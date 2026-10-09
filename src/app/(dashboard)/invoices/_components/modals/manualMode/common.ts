import styled from "styled-components";

import { InvoiceItem } from "@/lib/pdf/TestInvoice";

export const Section = styled.section`
width: 100%;

display: flex;
flex-direction: column;
gap: 1rem;
`;

export const createItem = (): InvoiceItem => ({
    id: crypto.randomUUID(),
    description: 'Hours worked',
    unitCost: 8,
    quantity: 1,
});

export const formatCurrency = (
    amount: number,
    currency: string,
) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};