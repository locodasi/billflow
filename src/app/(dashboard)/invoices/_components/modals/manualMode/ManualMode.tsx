import styled from "styled-components";

import { useMemo, useState } from "react";

import { InvoiceData, InvoiceItem } from "@/lib/pdf/TestInvoice";

import { InvoiceSummary } from "@/types/Invoice"
import TextInput from "@/components/inputs/TextInput";
import { useCurrencyOptions } from "@/hooks/useCurrencyOptions";
import NormalSelect, { Option } from "@/components/Select";
import TextArea from "@/components/inputs/Textarea";
import Button from "@/components/Button";
import NumberInput from "@/components/inputs/NumberInput";
import PreviewInvoicePdf from "@/lib/pdf/PreviewInvoicePDf";
import { Section } from "./common";
import Items from "./Items";
import BottomSection from "./BottomSection";

const createItem = (): InvoiceItem => ({
    id: crypto.randomUUID(),
    description: 'Hours worked',
    unitCost: 8,
    quantity: 1,
});

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

const formatCurrency = (
    amount: number,
    currency: string,
) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

const ManualMode = ({ close, addInvoice }: { close: () => void, addInvoice: (invoice: InvoiceSummary) => void }) => {

    const [invoiceData, setInvoiceData] =
        useState<InvoiceData>(initialInvoice);

    const [showPreview, setShowPreview] =
        useState(false);

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

    

    const handleUploadInvoice = async (
        file: Blob,
    ) => {
        // Acá posteriormente:
        //
        // 1. Crear invoice en DB
        // 2. Crear path del PDF
        // 3. Subir `file` a Supabase Storage
        // 4. Guardar el path en la invoice
        //
        // Cuando termina:
        setShowPreview(false);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", overflow: "auto" }}>
            <Section>
                <Fields columns={2}>
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
                </Fields>

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
            <BottomSection invoiceData={invoiceData} updateInvoice={updateInvoice}/>

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

