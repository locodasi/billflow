import styled from "styled-components";

import { useMemo } from "react";

import TextArea from "@/components/inputs/Textarea";
import NumberInput from "@/components/inputs/NumberInput";

import { InvoiceData } from "@/lib/pdf/TestInvoice";

import { formatCurrency, Section } from "./common"

interface Props {
    invoiceData: InvoiceData
    updateInvoice: (invoiceData: Partial<InvoiceData>) => void
}

const BottomSection = ({invoiceData, updateInvoice}: Props) => {

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

    return (
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
    )
}

export default BottomSection

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