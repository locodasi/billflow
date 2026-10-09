import styled from "styled-components";

import { useEffect, useMemo, useState } from "react";

import { InvoiceData, InvoiceItem } from "@/lib/pdf/TestInvoice";

import { InvoiceSummary } from "@/types/Invoice"
import TextInput from "@/components/inputs/TextInput";
import { useCurrencyOptions } from "@/hooks/useCurrencyOptions";
import NormalSelect, { Option } from "@/components/Select";
import TextArea from "@/components/inputs/Textarea";
import Button from "@/components/Button";
import PreviewInvoicePdf from "@/lib/pdf/PreviewInvoicePDf";
import { supabase } from "@/lib/supabase";
import env from "@/lib/env";

import { createItem, Section } from "./common";
import Items from "./Items";
import BottomSection from "./BottomSection";
import { useProjectsStore } from "@/stores/projectStore";
import { createInvoice } from "../../../actions";

const initialInvoice: InvoiceData = {
    invoiceNumber: '0042',
    invoiceDate: '31/07/2026',
    dueDate: '15/08/2026',

    purchaseOrder: '',

    billedTo: '',
    from: '',

    items: [createItem()],

    taxRate: 0,
    shipping: 0,

    currency: 'EUR',
    bankDetails: '',
};

const ManualMode = ({ close, addInvoice }: { close: () => void, addInvoice: (invoice: InvoiceSummary) => void }) => {

    const [invoiceData, setInvoiceData] =
        useState<InvoiceData>(initialInvoice);

    const [showPreview, setShowPreview] =
        useState(false);

    const bill_adress = useProjectsStore(state => state.project?.bill_address)
    const currency = useProjectsStore(state => state.project?.currency)
    const projectId = useProjectsStore(state => state.project?.id)

    // @ts-ignore
    const formatDate = (date: Temporal.PlainDate) => {
        return `${String(date.day).padStart(2, "0")}/${String(date.month).padStart(2, "0")}/${date.year}`;
    };

    // @ts-ignore
    const today = Temporal.Now.plainDateISO();
    const due = today.add({ days: 15 });

    useEffect(() => {
        if (!bill_adress || !currency || !projectId) return


        const getStartInvoiceData = async () => {

            const { data, error } = await supabase
                .from('invoices')
                .select('invoice_number')
                .eq('project_id', projectId)
                .order('invoice_number', { ascending: false })
                .range(0, 1)

            if (error) return

            let invoiceNumber = "0001"
            try {
                invoiceNumber = String(parseInt(data[0].invoice_number.replace("INV_", "")) + 1).padStart(4, "0")
            }catch{}

            setInvoiceData((current) => ({
                ...current,
                invoiceNumber: invoiceNumber,
                billedTo: bill_adress,
                from: env.FROM_INVOICE_ADRESS,
                currency,
                invoiceDate: formatDate(today),
                dueDate: formatDate(due)
            }))
        }

        getStartInvoiceData()

    }, [bill_adress, currency, projectId])

    const CURRENCIES = useCurrencyOptions();

    const selectedCurrency =
        CURRENCIES.find(
            (currency) =>
                currency.value === invoiceData.currency,
        ) || null;

    const updateInvoice = (
        changes: Partial<InvoiceData>,
    ) => {
        setInvoiceData((current) => ({
            ...current,
            ...changes,
        }));
    };

    const updateInvoiceItems = (items: InvoiceItem[]) => {
        setInvoiceData((current) => ({
            ...current,
            items: items
        }))
    }

    function calculateTotal(invoiceData: InvoiceData): number {
        const subtotal = invoiceData.items.reduce(
            (total, item) => total + item.quantity * item.unitCost,
            0
        );

        const tax = subtotal * (invoiceData.taxRate / 100);

        return Number((subtotal + tax + invoiceData.shipping).toFixed(2));
    }

    function toISODate(value: string | null | undefined): string | null {
        if (!value?.trim()) return null;

        const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

        // Si no coincide con el formato esperado, no inventamos una fecha.
        if (!match) return null;

        const [, day, month, year] = match;

        return `${year}-${month}-${day}`;
    }

    const handleUploadInvoice = async (
        file: Blob,
        invoiceData: InvoiceData
    ) => {
        try {
            if (!projectId) return
            console.log(invoiceData.dueDate)
            const invoice = await createInvoice({
                projectId,
                invoiceNumber: `INV_${invoiceData.invoiceNumber}`,
                amount: calculateTotal(invoiceData),
                currency: invoiceData.currency,
                pdf: file,
                dueDate: toISODate(invoiceData.dueDate) || null,
            });

            // Actualizar la lista del componente padre.
            addInvoice(invoice);

            // Cerrar el modal solamente si la creación salió bien.
            close();
        } catch (error) {
            console.error("Error al crear la factura:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", overflow: "auto" }}>
            <Section>
                {/* <Fields columns={2}>
                    <TextInput
                        label="Invoice number"
                        value={
                            invoiceData.invoiceNumber
                        }
                        onChange={(value) =>
                            updateInvoice({
                                invoiceNumber: value,
                            })
                        }
                        placeholder="0042"
                    />

                    <TextInput
                        label="Purchase order"
                        value={
                            invoiceData.purchaseOrder
                        }
                        onChange={(value) =>
                            updateInvoice({
                                purchaseOrder: value,
                            })
                        }
                        placeholder="PO-000123"
                    />
                </Fields> */}

                <Fields columns={3}>
                    <NormalSelect
                        title="Currency"
                        options={CURRENCIES}
                        value={selectedCurrency}
                        onChange={(option: Option) =>
                            updateInvoice({
                                currency:
                                    option.value,
                            })
                        }
                    />

                    <TextInput
                        label="Invoice date"
                        value={
                            invoiceData.invoiceDate
                        }
                        onChange={(value) =>
                            updateInvoice({
                                invoiceDate: value,
                            })
                        }
                        placeholder="31/07/2026"
                    />

                    <TextInput
                        label="Due date"
                        value={
                            invoiceData.dueDate
                        }
                        onChange={(value) =>
                            updateInvoice({
                                dueDate: value,
                            })
                        }
                        placeholder="15/08/2026"
                    />
                </Fields>

                <BillingGrid>
                    <TextArea
                        label="Billed to"
                        value={
                            invoiceData.billedTo
                        }
                        onChange={(value) =>
                            updateInvoice({
                                billedTo: value,
                            })
                        }
                        placeholder={
                            'Company name\nAddress\nTax number\nContact information'
                        }
                        minLines={5}
                        maxLines={8}
                    />

                    <TextArea
                        label="From"
                        value={
                            invoiceData.from
                        }
                        onChange={(value) =>
                            updateInvoice({
                                from: value,
                            })
                        }
                        placeholder={
                            'Your name / company\nAddress\nTax number\nContact information'
                        }
                        minLines={5}
                        maxLines={8}
                    />
                </BillingGrid>
            </Section>

            <Items items={invoiceData.items} currency={invoiceData.currency} updateInvoiceItems={updateInvoiceItems} />

            {/* Bank details + totals */}
            <BottomSection invoiceData={invoiceData} updateInvoice={updateInvoice} />

            <Button
                text="Create invoice"
                onClick={() => setShowPreview(true)}
                type="primary"
                style="filled"
                size="small"
            />

            {showPreview && (
                <PreviewInvoicePdf
                    data={invoiceData}
                    onClose={() => setShowPreview(false)}
                    onUpload={handleUploadInvoice}
                />
            )}
        </div>
    )
}

export default ManualMode



const Fields = styled.div<{
    columns: number;
}>`
    display: grid;
    grid-template-columns: repeat(
        ${({ columns }) => columns},
        minmax(0, 1fr)
    );
    gap: 16px;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

const BillingGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(
        2,
        minmax(0, 1fr)
    );
    gap: 16px;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

/* Items */



/* Bottom */

