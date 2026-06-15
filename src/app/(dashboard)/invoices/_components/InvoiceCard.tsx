import styled from "styled-components";

import { supabase } from "@/lib/supabase";

import Card from "@/components/card/Card";
import Icon from "@/components/icons/Icon";
import { StatusChip } from "@/components/Chips";
import IconButton from "@/components/IconButton";

import { formatDate } from "@/utils/timeFunctions";

import { InvoiceSummary } from "@/types/Invoice";

const InvoiceCard = ({ invoice, onClick }: { invoice: InvoiceSummary, onClick: () => void }) => {

    const handleDownload = async () => {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(invoice.pdf_path)

        if (error || !data) return

        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `${invoice.invoice_number}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }
 
    return (
        <Card cardStyles={{ boxShadow: `-3px 0px 0px var(--status-${invoice.computed_status.toLowerCase()}-solid)` }} onClick={onClick}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title>{invoice.invoice_number}</Title>
                <StatusChip text={invoice.computed_status} status={invoice.computed_status.toLowerCase()} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Amount>${invoice.amount}<Currency>{invoice.currency}</Currency></Amount>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--Border-Colors-border-secondary)' }}>
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <Icon icon={"calendar"} size={16} iconColor="var(--Text-text-tertiary, #667085)" />
                    <Date>{formatDate(invoice.created_at)}</Date>
                </div>

                <IconButton size="small" onClick={handleDownload} icon={"download"} />
            </div>
        </Card>
    )
}

export default InvoiceCard;

const Title = styled.p`
    color: var(--Text-text-tertiary, #344051);
    font-family: Inter;
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1rem; /* 150% */
`;

const Date = styled.p`
    color: var(--Text-text-tertiary, #667085);
    font-size: 0.875rem;
    font-weight: 400;
`;

const Amount = styled.p`
    color: var(--Text-text-secondary, #344051);
    font-size: 1.5rem;
    font-weight: 500;
`;

const Currency = styled.span`
    color: var(--Text-text-tertiary, #667085);
    font-size: 0.875rem;
    font-weight: 400;
`;