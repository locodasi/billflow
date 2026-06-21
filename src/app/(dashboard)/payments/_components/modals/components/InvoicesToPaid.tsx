import styled from "styled-components";

import {useState, useEffect} from "react";

import { supabase } from "@/lib/supabase";

import { InvoiceSummary } from "@/types/Invoice";

import { useProjectsStore } from "@/stores/projectStore";

interface InvoicesToPaidProps {
    invoicesSelected: string[];
    onSelectInvoice: (invoice: InvoiceSummary) => void;
}

const InvoicesToPaid = ({ invoicesSelected, onSelectInvoice }: InvoicesToPaidProps) => {
    const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);

    const projectId = useProjectsStore(state => state.project?.id);

    useEffect(() => {
        if(!projectId) return;

        const fetchInvoices = async () => {
            const { data, error } = await supabase
                .from('invoice_summary')
                .select('*')
                .eq('project_id', projectId)
                .gt('outstanding_amount', 0)
                .order('created_at', { ascending: true });

            if (error) {
                console.error("Error fetching invoices:", error);
            } else {
                setInvoices(data || [] );
            }
        }

        fetchInvoices(); 
    }, [projectId]);

    return(
        <Wrapper>
            <Title>Facturas a cubrir</Title>

            {invoices.map((invoice, index) => (
                <InvoiceItem key={invoice.id} invoice={invoice} selected={invoicesSelected.includes(invoice.id)} onSelect={() => onSelectInvoice(invoice)} />
            ))}
        </Wrapper>
    )
}

export default InvoicesToPaid;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow-y: auto;
    padding-right: 0.5rem;
    width: 400px;
`;

const Title = styled.h3`
    font-size: 1rem;
    font-weight: 500;
    color: var(--Text-text-secondary);
`;

import ProgressBar from "@/components/ProgressBar";
import { StatusChip } from "@/components/Chips";
import CheckBox from "@/components/CheckButton";

const InvoiceItem = ({ invoice, selected, onSelect }: { invoice: InvoiceSummary, selected?: boolean, onSelect: () => void }) => {

    return(
        <WrapperInvoice $selected={selected} onClick={onSelect}>
            <CheckBox checked={selected} onChange={onSelect} size="medium" color="primary"/>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <InvoiceTitle $selected={selected}>{invoice.invoice_number}</InvoiceTitle>

                    <StatusChip status={invoice.computed_status} text={invoice.computed_status} style={{padding: "0.1rem 0.5rem"}}/>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <InvoiceAmount>Total: {invoice.amount} {invoice.currency}</InvoiceAmount>

                    <InvoiceAmount style={{color: selected ? "var(--Components-Buttons-button-brand-secondary-content)" : "var(--status-processing-text)"}}>
                        Debe: {invoice.outstanding_amount} {invoice.currency}
                    </InvoiceAmount>
                </div>

                <ProgressBar progress={invoice.paid_amount / invoice.amount * 100} />
            </div>
        </WrapperInvoice>
    )
}

const WrapperInvoice = styled.div<{$selected?: boolean}>`
    padding: 0.5rem;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    border: 1px solid ${props => props.$selected ? "var(--Components-Buttons-button-brand-secondary-border)" : "var(--Border-Colors-border-primary)"};
    border-radius: 8px;
    width: 100%;
    cursor: pointer;

    &:hover {
        border-color: var(--Border-Colors-border-tertiary);
    }

`;

const InvoiceTitle = styled.p<{$selected?: boolean}>`
    color: ${({$selected}) => $selected ? "var(--Components-Buttons-button-brand-secondary-content)" : "var(--Text-text-primary)"};
    font-size: 0.875rem;
    font-weight: 500;
`;

const InvoiceAmount = styled.p`
    font-size: 0.75rem;
    color: var(--Text-text-tertiary);
`;