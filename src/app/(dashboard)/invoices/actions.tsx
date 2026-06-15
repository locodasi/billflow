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

import { UploadInvoice } from './_components/modals/UploadMode'

export async function createInvoice(data: UploadInvoice, projectId: string): Promise<InvoiceSummary> {
    // Validación
    if (!data.invoiceNumber?.value) throw new Error('Invoice number requerido')
    if (!data.amount?.value) throw new Error('Amount requerido')
    if (!data.currency?.value) throw new Error('Currency requerido')
    if (!data.file) throw new Error('Archivo PDF requerido')

    const supabase = await createServerClient();

    // Upload PDF
    const arrayBuffer = await data.file.arrayBuffer()
    const filePath = `${projectId}/invoices/${data.invoiceNumber.value}.pdf`

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, arrayBuffer, {
            contentType: 'application/pdf',
            upsert: false,
        })

    if (uploadError) throw new Error(`Upload fallido: ${uploadError.message}`)

    const { exchangeRate, amountUsd } = await convertToUSD(data.amount.value, data.currency.value)

    // Insert invoice
    const { data: invoice, error: insertError } = await supabase
        .from('invoices')
        .insert({
            invoice_number: data.invoiceNumber.value,
            project_id: projectId,
            amount: data.amount.value,
            currency: data.currency.value,
            notes: data.notes,
            metadata: data.metadata,
            pdf_path: filePath,
            exchange_rate_to_usd: exchangeRate,
            amount_usd: amountUsd,
        })
        .select()
        .single()

    if (insertError) throw new Error(`Insert fallido: ${insertError.message}`)

    return {
        ...invoice,
        paid_amount: 0,
        pending_amount: 0,
        outstanding_amount: invoice.amount,
    }
}

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