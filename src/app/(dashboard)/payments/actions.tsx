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


// FALTA PASAR QUE FACTURAS PAGA, Y GENERAR LAS RELACIONES Y COMO SE DISTRIBUYE EL PAGO ENTRE FACTURAS SI ES QUE SE PAGAN VARIAS CON UN MISMO COMPROBANTE. TAMBIEN FALTA VER EL TEMA DE LOS ESTADOS DE LAS FACTURAS, SI SE PAGAN PARCIALMENTE O COMPLETAMENTE ETC
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

    return payment;
}