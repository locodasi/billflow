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

    const subtotal = useMemo(() => {
        return invoiceData.items.reduce(
            (total, item) =>
                total +
                item.unitCost * item.quantity,
            0,
        );
    }, [invoiceData.items]);

    const tax = useMemo(() => {
        return (
            subtotal *
            (invoiceData.taxRate / 100)
        );
    }, [
        subtotal,
        invoiceData.taxRate,
    ]);

    const total = useMemo(() => {
        return (
            subtotal +
            tax +
            invoiceData.shipping
        );
    }, [
        subtotal,
        tax,
        invoiceData.shipping,
    ]);

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
            <BottomGrid>
                <Section>

                    <TextArea
                        value={
                            invoiceData.bankDetails
                        }
                        onChange={(value) =>
                            updateInvoice({
                                bankDetails: value,
                            })
                        }
                        placeholder={
                            'IBAN: ...\nBIC: ...\nBank: ...'
                        }
                        minLines={8}
                        maxLines={12}
                    />
                </Section>

                <TotalsSection>


                    <TotalsCard>
                        <TotalRow>
                            <TotalLabel>
                                Subtotal
                            </TotalLabel>

                            <TotalValue>
                                {formatCurrency(
                                    subtotal,
                                    invoiceData.currency,
                                )}
                            </TotalValue>
                        </TotalRow>

                        <TotalRow>
                            <TotalLabel>
                                Tax
                            </TotalLabel>

                            <TaxInput>
                                <TaxRateInput>
                                    <NumberInput
                                        value={
                                            invoiceData.taxRate
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            updateInvoice({
                                                taxRate:
                                                    value,
                                            })
                                        }
                                        min={0}
                                        max={100}
                                        step={0.01}
                                        placeholder="0"
                                    />

                                    <Percent>
                                        %
                                    </Percent>
                                </TaxRateInput>

                                <TotalValue>
                                    {formatCurrency(
                                        tax,
                                        invoiceData.currency,
                                    )}
                                </TotalValue>
                            </TaxInput>
                        </TotalRow>

                        <TotalRow>
                            <TotalLabel>
                                Shipping
                            </TotalLabel>

                            <TaxInput>
                                <ShippingInput>
                                    <NumberInput
                                        value={
                                            invoiceData.shipping
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            updateInvoice({
                                                shipping:
                                                    value,
                                            })
                                        }
                                        min={0}
                                        step={0.01}
                                        placeholder="0.00"
                                    />
                                </ShippingInput>

                                <TotalValue>
                                    {formatCurrency(
                                        invoiceData.shipping,
                                        invoiceData.currency,
                                    )}
                                </TotalValue>
                            </TaxInput>
                        </TotalRow>

                        <Divider />

                        <GrandTotalRow>
                            <GrandTotalLabel>
                                Invoice total
                            </GrandTotalLabel>

                            <GrandTotal>
                                {formatCurrency(
                                    total,
                                    invoiceData.currency,
                                )}
                            </GrandTotal>
                        </GrandTotalRow>
                    </TotalsCard>
                </TotalsSection>
            </BottomGrid>

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

const BottomGrid = styled.div`
    display: grid;
    grid-template-columns:
        minmax(0, 1fr)
        minmax(360px, 0.75fr);

    gap: 24px;
    align-items: start;

    > section {
        height: 100%;
    }

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const TotalsSection = styled(Section)`
    margin: 0;
`;

const TotalsCard = styled.div`
    width: 100%;
    padding: 1rem;

    border: 1px solid
        var(--Border-Colors-border-primary);
    border-radius: 10px;

    background: var(
        --Background-Colors-bg-secondary
    );

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const TotalRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
`;

const TotalLabel = styled.span`
    color: var(--Text-text-secondary);
    font-size: 14px;
    line-height: 20px;
`;

const TotalValue = styled.span`
    color: var(--Text-text-primary);
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    text-align: right;
    white-space: nowrap;
`;

const TaxInput = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
`;

const TaxRateInput = styled.div`
    position: relative;
    width: 90px;

    > div {
        width: 100%;
    }
`;

const ShippingInput = styled.div`
    width: 110px;

    > div {
        width: 100%;
    }
`;

const Percent = styled.span`
    position: absolute;
    top: 50%;
    right: 10px;

    transform: translateY(-50%);

    color: var(--Text-text-tertiary);
    font-size: 13px;

    pointer-events: none;
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background: var(
        --Border-Colors-border-primary
    );
`;

const GrandTotalRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
`;

const GrandTotalLabel = styled.span`
    color: var(--Text-text-primary);
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
`;

const GrandTotal = styled.span`
    color: var(--Text-text-primary);
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
    white-space: nowrap;
`;