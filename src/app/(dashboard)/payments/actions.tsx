// actions/parseInvoice.ts
'use server'

import { extractText, getDocumentProxy } from 'unpdf'

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

import { createServerClient } from "@/lib/supabase.server";
import { convertToUSD } from "@/lib/exchange-rate";

import { UploadPayload } from './_components/modals/UploadMode'

export async function createPayload(data: UploadPayload, projectId: string) {
    // Validación
    if (!data.paymentNumber?.value) throw new Error('Payment number requerido')
    if (!data.amount?.value) throw new Error('Amount requerido')
    if (!data.currency?.value) throw new Error('Currency requerido')
    if (!data.file) throw new Error('Archivo PDF requerido')

    const supabase = await createServerClient();

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

    let totalPayed = data.amount.value;

    for (const invoice of invoicesToPay) {
        if (totalPayed <= 0) break;

        const amountToPay = Math.min(invoice.outstanding_amount, totalPayed);

        const { error: paymentInvoiceError } = await supabase
            .from('payment_invoices')
            .insert({
                payment_id: payment.id,
                invoice_id: invoice.id,
                amount_applied: amountToPay,
                amount_applied_usd: amountToPay * exchangeRate, // revisá la dirección
            })

        if (paymentInvoiceError) {
            console.error(`Error al relacionar pago con factura: ${paymentInvoiceError.message}`)
        }

        totalPayed -= amountToPay;
    }

    return payment;
}

export async function updatePaymentStatus(paymentId: string, newStatus: string) {
    const supabase = await createServerClient();

    const { error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('id', paymentId);

    if (error) throw new Error(`Error al actualizar estado: ${error.message}`)
} 

