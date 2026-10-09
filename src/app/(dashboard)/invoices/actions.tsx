// actions/parseInvoice.ts
'use server'

import { extractText, getDocumentProxy } from 'unpdf'

import { InvoiceSummary } from '@/types/Invoice'

type InvoiceData = {
    invoiceNumber: string | null
    amount: string | null
    currency: string | null
}

export async function parseInvoice(formData: FormData): Promise<InvoiceData> {
    const file = formData.get('pdf') as File
    if (!file) throw new Error('No file provided')

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer))
    const { text } = await extractText(pdf, { mergePages: true })

    console.log("Texto extraído del PDF:", text);

    const invoiceNumber = text.match(/(\d{4})\s+\d{2}\/\d{2}\/\d{4}/)?.[1] ?? null
    const amount = text.match(/INVOICE TOTAL\s*[€$£]?\s*([\d.,]+)/i)?.[1] ?? null
    const currencyMatch = text.match(/ARS|USD|EUR|GBP|JPY|BRL|CAD|CHF|R\$|CA\$|[€£¥$]/)?.[0] ?? null

    const CURRENCY_SYMBOL_MAP: Record<string, string> = {
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        'R$': 'BRL',
        'CA$': 'CAD',
        '$': 'USD',
    }

    const currency = currencyMatch ? (CURRENCY_SYMBOL_MAP[currencyMatch] ?? currencyMatch) : null


    return { invoiceNumber, amount, currency }
}

import { createServerClient } from "@/lib/supabase.server";
import { convertToUSD } from '@/lib/exchange-rate'
import { invoiceUploadedEmailTemplate } from '@/lib/notifications/templates/email/helper'
import { getUserByProjectId } from '@/lib/supabaseFunctions'

type CreateInvoiceInput = {
    projectId: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    pdf: File | Blob;
    dueDate?: string | null;
    notes?: string | null;
    metadata?: Record<string, any> | null;
};

export async function createInvoice(data: CreateInvoiceInput) {
    // 1. Validaciones obligatorias
    if (!data.projectId?.trim()) {
        throw new Error("Project ID requerido");
    }

    if (!data.invoiceNumber?.trim()) {
        throw new Error("Invoice number requerido");
    }

    if (
        typeof data.amount !== "number" ||
        !Number.isFinite(data.amount) ||
        data.amount <= 0
    ) {
        throw new Error("Amount debe ser un número mayor que cero");
    }

    if (!data.currency?.trim()) {
        throw new Error("Currency requerido");
    }

    if (!data.pdf || data.pdf.size === 0) {
        throw new Error("Archivo PDF requerido");
    }

    // 2. Validar fecha de vencimiento, si fue proporcionada
    const dueDate = data.dueDate?.trim() || null;

    function isValidDateOnly(value: string): boolean {
        const [year, month, day] = value.split("-").map(Number);

        const date = new Date(Date.UTC(year, month - 1, day));

        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        );
    }

    if (
        dueDate !== null &&
        (
            !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
            !isValidDateOnly(dueDate)
        )
    ) {
        throw new Error("Due date inválida. Usá el formato YYYY-MM-DD");
    }

    const supabase = await createServerClient();

    // 3. Subir PDF
    const arrayBuffer = await data.pdf.arrayBuffer();
    const filePath =
        `${data.projectId}/invoices/${data.invoiceNumber.trim()}.pdf`;

    const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, arrayBuffer, {
            contentType: "application/pdf",
            upsert: false,
        });

    if (uploadError) {
        throw new Error(`Upload fallido: ${uploadError.message}`);
    }

    // 4. Convertir moneda
    const { exchangeRate, amountUsd } = await convertToUSD(
        data.amount,
        data.currency
    );

    // 5. Insertar factura
    const { data: invoice, error: insertError } = await supabase
        .from("invoices")
        .insert({
            invoice_number: data.invoiceNumber.trim(),
            project_id: data.projectId,
            amount: data.amount,
            currency: data.currency,
            due_date: dueDate,
            notes: data.notes ?? null,
            metadata: data.metadata ?? {},
            pdf_path: filePath,
            exchange_rate_to_usd: exchangeRate,
            amount_usd: amountUsd,
        })
        .select()
        .single();

    if (insertError) {
        // Evita dejar el PDF huérfano si falla el INSERT.
        const { error: cleanupError } = await supabase.storage
            .from("documents")
            .remove([filePath]);

        if (cleanupError) {
            console.error("Error eliminando PDF tras fallar el INSERT:", cleanupError);
        }

        throw new Error(`Insert fallido: ${insertError.message}`);
    }

    // 6. Notificación
    try {
        const user = await getUserByProjectId(data.projectId);

        const { data: project } = await supabase
            .from("projects")
            .select("name")
            .eq("id", data.projectId)
            .single();

        if (user.settings.notifications.email.invoiceUploaded) {
            const result = await notificationService.send(
                await invoiceUploadedEmailTemplate({
                    recipient: {
                        name: user.fullName,
                        email: user.email,
                    },
                    locale: user.language,
                    amount: data.amount,
                    currency: data.currency,
                    invoiceNumber: data.invoiceNumber.trim(),
                    invoiceId: invoice.id,
                    projectName: project?.name ?? "Tu proyecto",
                })
            );

            if (!result.success) {
                console.error("[invoiceUploadedNotification]", result.error);
            }
        }
    } catch (error) {
        // La factura ya fue creada; un fallo de notificación no debería
        // hacer que el flujo informe que la creación falló.
        console.error("[invoiceUploadedNotification]", error);
    }

    // 7. Devolver factura
    return {
        ...invoice,
        paid_amount: 0,
        pending_amount: 0,
        outstanding_amount: invoice.amount,
        computed_status: "unpaid",
    } as InvoiceSummary;
}


import { notificationService } from "@/lib/notifications/notification-service";


import JSZip from "jszip";

export async function downloadUnpaidInvoicesPDF(projectId: string): Promise<{
    data: number[] | null; // Uint8Array serializada como array para poder cruzar el boundary
    error: string | null;
}> {
    // 1. Obtener facturas impagas del proyecto

    const supabase = await createServerClient();

    const { data: invoices, error: fetchError } = await supabase
        .from("invoice_summary")
        .select("id, pdf_path")
        .eq("project_id", projectId)
        .eq("computed_status", "unpaid") //Aca habria que ver si descargar deberia ser las que estan unpaid o las que tienen outstanding_amount = amount (osea no se pago ni se sta procesando un peso)
        .not("pdf_path", "is", null);

    if (fetchError) return { data: null, error: fetchError.message };
    if (!invoices?.length) return { data: null, error: "No hay facturas impagas con PDF." };

    const zip = new JSZip();
    const folder = zip.folder("unpaid_invoices")!;

    const downloads = await Promise.allSettled(
        invoices.map(async (invoice) => {
            const { data, error } = await supabase.storage
                .from("documents")
                .download(invoice.pdf_path);

            if (error || !data) throw new Error(`Error descargando ${invoice.pdf_path}: ${error?.message}`);

            const buffer = await data.arrayBuffer();
            const filename = invoice.pdf_path.split("/").pop() ?? `invoice-${invoice.id}.pdf`;
            folder.file(filename, buffer);
        })
    );

    // Loguear los que fallaron sin romper todo
    downloads.forEach((result, i) => {
        if (result.status === "rejected") {
            console.error(`PDF ${i} falló:`, result.reason);
        }
    });

    const successCount = downloads.filter((r) => r.status === "fulfilled").length;
    if (successCount === 0) return { data: null, error: "Ningún PDF pudo descargarse." };

    // 3. Generar el ZIP en memoria
    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    // Uint8Array no cruza el server/client boundary directamente → la convertimos a array
    return { data: Array.from(zipBuffer), error: null };
} 