// actions/parseInvoice.ts
'use server'

import { extractText, getDocumentProxy } from 'unpdf'
import { SupabaseClient } from '@supabase/supabase-js'

type PaymentData = {
    paymentNumber: string | null
    amount: string | null
    currency: string | null
}

export async function parsePayment(formData: FormData): Promise<PaymentData> {
    const file = formData.get('pdf') as File
    if (!file) throw new Error('No file provided')

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer))
    const { text } = await extractText(pdf, { mergePages: true })

    console.log("Texto extraído del PDF:", text);

    const paymentNumber = text.match(/(\d{4})\s+\d{2}\/\d{2}\/\d{4}/)?.[1] ?? null
    const amount = text.match(/Amount\s*[€$£]?\s*([\d.,]+)/i)?.[1] ?? null
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


    return { paymentNumber, amount, currency }
}

import { UploadPayload } from './_components/modals/UploadMode'

import { createServerClient } from "@/lib/supabase.server";
import { convertToUSD } from "@/lib/exchange-rate";
import { notificationService } from '@/lib/notifications/notification-service'
import { paymentsUploadedEmailTemplate, paymentStatusEmailTemplate } from '@/lib/notifications/templates/email/helper'
import serverEnv from '@/lib/env.server'
import { DEFAULT_SETTINGS, UserSettingsInput } from '@/stores/userStore'
import { deepMerge } from '@/lib/deep-merge'
import { getAvailableProjectCredits } from '@/lib/credits'

type UnpaidInvoice = {
    id: string
    outstanding_amount: number
}

async function payInvoicesWithPayment(
    paymentId: string,
    invoices: UnpaidInvoice[],
    amount: number,
    exchangeRate: number,
    supabase: SupabaseClient
): Promise<UnpaidInvoice[]> {
    let remainingAmount = amount
    const unpaidInvoices: UnpaidInvoice[] = []

    for (const invoice of invoices) {
        if (remainingAmount <= 0) {
            unpaidInvoices.push(invoice)
            continue
        }

        if (invoice.outstanding_amount == null) {
            console.error(
                `outstanding_amount null para invoice ${invoice.id}, se omite`
            )
            unpaidInvoices.push(invoice)
            continue
        }

        const amountToPay = Math.min(
            invoice.outstanding_amount,
            remainingAmount
        )

        const { error } = await supabase
            .from("payment_invoices")
            .insert({
                payment_id: paymentId,
                invoice_id: invoice.id,
                amount_applied: amountToPay,
                amount_applied_usd: amountToPay * exchangeRate,
            })

        if (error) {
            console.error(
                `Error al relacionar pago con factura ${invoice.id}: ${error.message}`
            )

            // Como el pago no se pudo aplicar, la factura sigue pendiente.
            unpaidInvoices.push(invoice)
            continue
        }

        remainingAmount -= amountToPay

        const remainingInvoiceAmount =
            invoice.outstanding_amount - amountToPay

        if (remainingInvoiceAmount > 0) {
            unpaidInvoices.push({
                ...invoice,
                outstanding_amount: remainingInvoiceAmount,
            })
        }
    }

    // El excedente del recibo se convierte en crédito.
    if (remainingAmount > 0) {
        const { error } = await supabase
            .from("project_credits")
            .insert({
                payment_id: paymentId,
                amount: remainingAmount,
            })

        if (error) {
            throw new Error(
                `Error al crear saldo a favor: ${error.message}`
            )
        }
    }

    return unpaidInvoices
}

async function payInvoicesWithProjectCredits(
    projectId: string,
    paymentId: string,
    invoices: UnpaidInvoice[],
    exchangeRate: number,
    supabase: SupabaseClient
) {
    if (invoices.length === 0) {
        return
    }

    const credits = await getAvailableProjectCredits(
        projectId,
        supabase
    )

    if (credits.length === 0) {
        return
    }

    let creditIndex = 0

    for (const invoice of invoices) {
        let invoiceRemaining = invoice.outstanding_amount

        while (invoiceRemaining > 0 && creditIndex < credits.length) {
            const credit = credits[creditIndex]

            if (credit.amount <= 0) {
                creditIndex++
                continue
            }

            const amountToApply = Math.min(
                invoiceRemaining,
                credit.amount
            )

            const { error } = await supabase
                .from("credit_applications")
                .insert({
                    credit_id: credit.id,
                    invoice_id: invoice.id,
                    payment_id: paymentId,
                    amount_applied: amountToApply,
                    amount_applied_usd: amountToApply * exchangeRate,
                })

            if (error) {
                throw new Error(
                    `Error al aplicar crédito ${credit.id} a factura ${invoice.id}: ${error.message}`
                )
            }

            // Actualizamos el crédito en memoria.
            credit.amount -= amountToApply

            // Actualizamos lo que queda de la factura.
            invoiceRemaining -= amountToApply

            // Si este crédito se agotó, pasamos al siguiente.
            if (credit.amount <= 0) {
                creditIndex++
            }
        }
    }
}



export async function createPayload(data: UploadPayload, projectId: string) {
    // Validación
    if (!data.paymentNumber?.value) throw new Error('Payment number requerido')
    if (!data.amount?.value) throw new Error('Amount requerido')
    if (!data.currency?.value) throw new Error('Currency requerido')
    if (!data.file) throw new Error('Archivo PDF requerido')

    if (!data.amount?.value || data.amount.value <= 0) {
        throw new Error('Amount debe ser mayor a 0')
    }

    const supabase = await createServerClient();

    // Obtener proyecto ANTES de hacer cualquier operación
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, name, currency')
        .eq('id', projectId)
        .single()

    if (projectError || !project) {
        throw new Error('Proyecto no encontrado')
    }

    const paymentCurrency = data.currency.value.toUpperCase()
    const projectCurrency = project.currency.toUpperCase()
    
    if (paymentCurrency !== projectCurrency) {
        throw new Error(
            `La moneda del pago (${paymentCurrency}) no coincide con la moneda del proyecto (${projectCurrency})`
        )
    }

    // Upload PDF
    const arrayBuffer = await data.file.arrayBuffer()
    const filePath = `${projectId}/payments/${data.paymentNumber.value}.pdf`

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, arrayBuffer, {
            contentType: 'application/pdf',
            upsert: false,
        })

    if (uploadError) throw new Error(`Upload fallido: ${uploadError.message}`)

    // Convertir a USD
    const { exchangeRate, amountUsd } = await convertToUSD(data.amount.value, data.currency.value)

    // Insert payment
    const { data: payment, error: insertError } = await supabase
        .from('payments')
        .insert({
            payment_number: data.paymentNumber.value,
            project_id: projectId,
            amount: data.amount.value,
            currency: data.currency.value,
            notes: data.notes,
            receipt_pdf_path: filePath,
            status: 'pending',
            payment_method: data.payment_method,
            exchange_rate_to_usd: exchangeRate,
            amount_usd: amountUsd,
        })
        .select()
        .single()

    if (insertError) throw new Error(`Insert fallido: ${insertError.message}`)

    const { data: invoicesToPay, error: invoicesError } = await supabase
        .from('invoice_summary')
        .select('*')
        .in('id', data.invoicesToPay.map(inv => inv.id))
        .gt('outstanding_amount', 0)
        .order('created_at', { ascending: true });

    if (invoicesError) throw new Error(`Error al obtener facturas: ${invoicesError.message}`)

    const unpaidInvoices = await payInvoicesWithPayment(payment.id, invoicesToPay, data.amount.value, exchangeRate, supabase)
    await payInvoicesWithProjectCredits(project.id, payment.id, unpaidInvoices, exchangeRate, supabase)

    // Enviar notificación de nuevo pago
    const result = await notificationService.send(
        await paymentsUploadedEmailTemplate({ recipient: { name: "Lucas", email: serverEnv.PERSONAL_EMAIL }, locale: "es", amount: data.amount.value, currency: data.currency.value, paymentNumber: data.paymentNumber.value, paymentId: payment.id, projectName: project?.name ?? "Tu proyecto" })
    );

    if (!result.success) {
        console.error("[sendWelcomeNotification]", result.error);
    }

    return payment;
}

export async function updatePaymentStatus(paymentId: string, newStatus: string, rejectionReason?: string) {
    const supabase = await createServerClient();

    const { data: payment, error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', paymentId)
        .select(`
            id,
            payment_number,
            amount,
            currency,
            status,
            project:projects (
                id,
                name,
                client:clients (
                    id,
                    profile:profiles (
                        id,
                        full_name,
                        email,
                        language,
                        settings
                    )
                )
            )
        `)
        .single();

    if (error) throw new Error(`Error al actualizar estado: ${error.message}`);
    if (!payment) throw new Error("No se encontró el recibo actualizado");

    console.log("Datos del pago actualizado:", payment);

    const project = payment.project;
    const owner = project?.client?.profile;
    const settings = deepMerge(DEFAULT_SETTINGS, (owner?.settings as UserSettingsInput | null) ?? {});

    if (!owner?.email) {
        // decidí si esto debe frenar todo o solo loguearse y seguir
        console.warn(`Recibo ${paymentId} actualizado sin owner/email para notificar`);
        return;
    }

    const isApproved = newStatus === "approved";

    if ((settings.notifications.email.invoiceRejected && !isApproved) || (settings.notifications.email.invoiceApproved && isApproved)) {
        await notificationService.send(
            await paymentStatusEmailTemplate({
                recipient: { name: owner.full_name ?? "Usuario", email: owner.email },
                locale: owner.language ?? "es",
                amount: payment.amount,
                currency: payment.currency,
                paymentNumber: payment.payment_number,
                paymentId: payment.id,
                projectName: project?.name ?? "Tu proyecto",
                ...(isApproved
                    ? { status: "approved" }
                    : { status: "rejected", rejectionReason: rejectionReason ?? "" }),
            })
        );
    }
}

