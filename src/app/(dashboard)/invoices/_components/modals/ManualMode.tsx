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
import IconButton from "@/components/IconButton";
import PreviewInvoicePdf from "@/lib/pdf/PreviewInvoicePDf";

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

    const updateItem = (
        id: string,
        changes: Partial<InvoiceItem>,
    ) => {
        setInvoiceData((current) => ({
            ...current,
            items: current.items.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        ...changes,
                    }
                    : item,
            ),
        }));
    };

    const addItem = () => {
        setInvoiceData((current) => ({
            ...current,
            items: [
                ...current.items,
                createItem(),
            ],
        }));
    };

    const removeItem = (id: string) => {
        setInvoiceData((current) => ({
            ...current,
            items: current.items.filter(
                (item) => item.id !== id,
            ),
        }));
    };

    const moveItemUp = (id: string) => {
        setInvoiceData((current) => {
            const index = current.items.findIndex(
                (item) => item.id === id,
            );

            if (index <= 0) {
                return current;
            }

            const items = [...current.items];

            [
                items[index - 1],
                items[index],
            ] = [
                    items[index],
                    items[index - 1],
                ];

            return {
                ...current,
                items,
            };
        });
    };

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

            {/* Items */}
            <Section>
                <ItemsTable>
                    <ItemsHeader>
                        <DescriptionColumn>
                            Description
                        </DescriptionColumn>

                        <UnitColumn>
                            Unit cost
                        </UnitColumn>

                        <QuantityColumn>
                            QTY
                        </QuantityColumn>

                        <AmountColumn>
                            Amount
                        </AmountColumn>

                        <ActionColumn />
                    </ItemsHeader>

                    {invoiceData.items.map(
                        (item, index) => (
                            <ItemRow key={item.id}>
                                <DescriptionColumn>
                                    <TextInput
                                        value={
                                            item.description
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            updateItem(
                                                item.id,
                                                {
                                                    description:
                                                        value,
                                                },
                                            )
                                        }
                                        placeholder="Hours worked"
                                    />
                                </DescriptionColumn>

                                <UnitColumn>
                                    <NumberInput
                                        value={
                                            item.unitCost
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            updateItem(
                                                item.id,
                                                {
                                                    unitCost:
                                                        value,
                                                },
                                            )
                                        }
                                        min={0}
                                        step={0.01}
                                        placeholder="0.00"
                                    />
                                </UnitColumn>

                                <QuantityColumn>
                                    <NumberInput
                                        value={
                                            item.quantity
                                        }
                                        onChange={(
                                            value,
                                        ) =>
                                            updateItem(
                                                item.id,
                                                {
                                                    quantity:
                                                        value,
                                                },
                                            )
                                        }
                                        min={1}
                                        step={1}
                                        placeholder="1"
                                    />
                                </QuantityColumn>

                                <AmountColumn>
                                    <CalculatedValue>
                                        {formatCurrency(
                                            item.unitCost *
                                            item.quantity,
                                            invoiceData.currency,
                                        )}
                                    </CalculatedValue>
                                </AmountColumn>

                                <ActionColumn>
                                    <IconButton
                                        icon="arrow-up"
                                        onClick={() =>
                                            moveItemUp(
                                                item.id,
                                            )
                                        }
                                        disabled={
                                            index === 0
                                        }
                                        size="small"
                                        style="outline"
                                    />

                                    <IconButton
                                        icon="cancel"
                                        onClick={() =>
                                            removeItem(
                                                item.id,
                                            )
                                        }
                                        type="error"
                                        style="outline"
                                        size="small"
                                    />
                                </ActionColumn>
                            </ItemRow>
                        ),
                    )}
                </ItemsTable>

                <AddItemContainer>
                    <Button
                        text="Add item"
                        onClick={addItem}
                        type="primary"
                        style="outline"
                        size="small"
                        cssStyles={{ width: "100%" }}
                    />
                </AddItemContainer>
            </Section>

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

const Section = styled.section`
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

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

const ItemsTable = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const ItemsHeader = styled.div`
    display: grid;
    grid-template-columns:
        minmax(220px, 1fr)
        140px
        100px
        140px
        180px;

    gap: 12px;
    padding: 0 12px 8px;

    color: var(--Text-text-tertiary);
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    text-transform: uppercase;

    @media (max-width: 1050px) {
        grid-template-columns:
            minmax(180px, 1fr)
            120px
            90px
            120px
            160px;
    }

    @media (max-width: 850px) {
        display: none;
    }
`;

const DescriptionColumn = styled.div`
    min-width: 0;
`;

const UnitColumn = styled.div`
    min-width: 0;
`;

const QuantityColumn = styled.div`
    min-width: 0;
`;

const AmountColumn = styled.div`
    min-width: 0;
`;

const ActionColumn = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
`;

const ItemRow = styled.div`
    display: grid;
    grid-template-columns:
        minmax(220px, 1fr)
        140px
        100px
        140px
        100px;

    gap: 12px;
    align-items: center;

    padding: 12px;

    border: 1px solid
        var(--Border-Colors-border-primary);
    border-radius: 10px;

    & + & {
        margin-top: 8px;
    }

    @media (max-width: 1050px) {
        grid-template-columns:
            minmax(180px, 1fr)
            120px
            90px
            120px
            100px;
    }

    @media (max-width: 850px) {
        grid-template-columns: 1fr 1fr;

        ${DescriptionColumn} {
            grid-column: 1 / -1;
        }

        ${AmountColumn} {
            grid-column: 1;
        }

        ${ActionColumn} {
            grid-column: 2;
            justify-content: flex-end;
        }
    }

    @media (max-width: 550px) {
        grid-template-columns: 1fr;

        ${DescriptionColumn},
        ${AmountColumn},
        ${ActionColumn} {
            grid-column: 1;
        }

        ${ActionColumn} {
            justify-content: flex-start;
        }
    }
`;

const CalculatedValue = styled.div`
    min-height: 36px;
    display: flex;
    align-items: center;

    padding: 0 12px;

    border: 1px solid
        var(--Border-Colors-border-primary);
    border-radius: 8px;

    background: var(
        --Background-Colors-bg-secondary
    );

    color: var(--Text-text-primary);
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
`;

const AddItemContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: -4px;
`;

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