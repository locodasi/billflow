import styled from "styled-components";

import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import NumberInput from "@/components/inputs/NumberInput";
import TextInput from "@/components/inputs/TextInput";

import { InvoiceItem } from "@/lib/pdf/TestInvoice";

import { createItem, formatCurrency, Section } from "./common";

interface Props {
    items: InvoiceItem[]
    currency: string;
    updateInvoiceItems: (items: InvoiceItem[]) => void
}
const Items = ({ items, currency, updateInvoiceItems }: Props) => {

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

                {items.map(
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
                                        currency,
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
        </Section >
    )
}

export default Items

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