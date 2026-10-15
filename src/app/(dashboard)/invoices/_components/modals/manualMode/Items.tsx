import styled from "styled-components";

import { useTranslations } from "next-intl";

import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import NumberInput from "@/components/inputs/NumberInput";
import TextInput from "@/components/inputs/TextInput";

import { InvoiceItem } from "@/lib/pdf/InvoicePDF";

import { createItem, formatCurrency, Section } from "./common";

interface Props {
    items: InvoiceItem[]
    currency: string;
    updateInvoiceItems: (items: InvoiceItem[]) => void
}
const Items = ({ items, currency, updateInvoiceItems }: Props) => {

    const t = useTranslations("invoices.upload.manual.items");

    const updateItem = (
        id: string,
        changes: Partial<InvoiceItem>,
    ) => {
        updateInvoiceItems(items.map(item =>
            item.id === id
                ? {
                    ...item,
                    ...changes,
                }
                : item,
        ))
    };

    const addItem = () => {
        updateInvoiceItems([...items, createItem()])
    };

    const removeItem = (id: string) => {
        updateInvoiceItems(items.filter(item => item.id !== id))
    };

    const moveItemUp = (id: string) => {
        const index = items.findIndex((item) => item.id === id);

        if (index <= 0) {
            return;
        }

        const updatedItems = [...items];

        [
            updatedItems[index - 1],
            updatedItems[index],
        ] = [
                updatedItems[index],
                updatedItems[index - 1],
            ];

        updateInvoiceItems(updatedItems);
    };

    return (
        <Section>
            <ItemsTable>
                <ItemsHeader>
                    <DescriptionColumn>
                        {t("description")}
                    </DescriptionColumn>

                    <UnitColumn>
                        {t("unit_cost")}
                    </UnitColumn>

                    <QuantityColumn>
                        {t("quantity")}
                    </QuantityColumn>

                    <AmountColumn>
                        {t("amount")}
                    </AmountColumn>

                    <ActionColumn />
                </ItemsHeader>

                {items.map((item, index) => (
                    <ItemRow key={item.id}>
                        <DescriptionColumn>
                            <TextInput
                                value={item.description}
                                onChange={(value) =>
                                    updateItem(item.id, {
                                        description: value,
                                    })
                                }
                                placeholder={t("description_placeholder")}
                            />
                        </DescriptionColumn>

                        <UnitColumn>
                            <NumberInput
                                value={item.unitCost}
                                onChange={(value) =>
                                    updateItem(item.id, {
                                        unitCost: value,
                                    })
                                }
                                min={0}
                                step={0.01}
                                placeholder={t("unit_cost_placeholder")}
                            />
                        </UnitColumn>

                        <QuantityColumn>
                            <NumberInput
                                value={item.quantity}
                                onChange={(value) =>
                                    updateItem(item.id, {
                                        quantity: value,
                                    })
                                }
                                min={1}
                                step={1}
                                placeholder={t("quantity_placeholder")}
                            />
                        </QuantityColumn>

                        <AmountColumn>
                            <CalculatedValue>
                                {formatCurrency(
                                    item.unitCost * item.quantity,
                                    currency,
                                )}
                            </CalculatedValue>
                        </AmountColumn>

                        <ActionColumn>
                            <IconButton
                                icon="arrow-up"
                                onClick={() => moveItemUp(item.id)}
                                disabled={index === 0}
                                size="small"
                                style="outline"
                            // Si IconButton admite title o aria-label:
                            // title={t("move_item_up")}
                            />

                            <IconButton
                                icon="cancel"
                                onClick={() => removeItem(item.id)}
                                type="error"
                                style="outline"
                                size="small"
                            // Si IconButton admite title o aria-label:
                            // title={t("remove_item")}
                            />
                        </ActionColumn>
                    </ItemRow>
                ))}
            </ItemsTable>

            <AddItemContainer>
                <Button
                    text={t("add_item")}
                    onClick={addItem}
                    type="primary"
                    style="outline"
                    size="small"
                    cssStyles={{ width: "100%" }}
                />
            </AddItemContainer>
        </Section>
    );
}

export default Items

const itemGridColumns = `
    minmax(0, 1fr)
    minmax(110px, 140px)
    minmax(75px, 100px)
    minmax(110px, 140px)
    100px
`;

const ItemsTable = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ItemsHeader = styled.div`
    display: grid;
    grid-template-columns: ${itemGridColumns};
    gap: 12px;
    align-items: end;
    padding: 0 12px 4px;

    color: var(--Text-text-tertiary);
    font-size: 11px;
    line-height: 16px;
    font-weight: 600;
    text-transform: uppercase;

    @media (max-width: 850px) {
        display: none;
    }
`;

const DescriptionColumn = styled.div`
    min-width: 0;
    width: 100%;
`;

const UnitColumn = styled.div`
    min-width: 0;
    width: 100%;
`;

const QuantityColumn = styled.div`
    min-width: 0;
    width: 100%;
`;

const AmountColumn = styled.div`
    min-width: 0;
    width: 100%;
`;

const ActionColumn = styled.div`
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
`;

const CalculatedValue = styled.div`
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: 36px;

    display: flex;
    align-items: center;

    padding: 0 12px;

    border: 1px solid var(--Border-Colors-border-primary);
    border-radius: 8px;

    background: var(--Background-Colors-bg-secondary);
    color: var(--Text-text-primary);

    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
`;


const ItemRow = styled.div`
    display: grid;
    grid-template-columns: ${itemGridColumns};
    gap: 12px;
    align-items: center;

    padding: 12px;

    border: 1px solid var(--Border-Colors-border-primary);
    border-radius: 10px;

    @media (max-width: 1050px) and (min-width: 851px) {
        grid-template-columns:
            minmax(0, 1fr)
            110px
            75px
            110px
            100px;
        gap: 8px;
    }

    @media (max-width: 850px) {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 12px;

        ${DescriptionColumn} {
            grid-column: 1 / -1;
        }

        ${UnitColumn},
        ${QuantityColumn} {
            grid-column: auto;
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
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;

        ${DescriptionColumn},
        ${UnitColumn},
        ${QuantityColumn},
        ${AmountColumn},
        ${ActionColumn} {
            grid-column: 1;
        }

        ${ActionColumn} {
            justify-content: flex-start;
        }
    }
`;



const AddItemContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: -4px;
`;