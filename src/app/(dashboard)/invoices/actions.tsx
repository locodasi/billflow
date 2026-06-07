// actions/parseInvoice.ts
'use server'

import { extractText, getDocumentProxy } from 'unpdf'

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

import { UploadInvoice } from './_components/modals/UploadMode'

export async function createInvoice(data: UploadInvoice, projectId: string) {
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
            status: 'unpaid',
        })
        .select()
        .single()

    if (insertError) throw new Error(`Insert fallido: ${insertError.message}`)

    return invoice
}