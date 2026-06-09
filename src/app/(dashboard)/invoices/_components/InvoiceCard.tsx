import styled from "styled-components";

import { supabase } from "@/lib/supabase";

import Card from "@/components/card/Card";
import Icon from "@/components/icons/Icon";
import { StatusChip } from "@/components/Chips";
import Button from "@/components/Button";

import { formatDate } from "@/utils/timeFunctions";

import { Invoice } from "@/types/Invoice";

const InvoiceCard = ({ invoice, onClick }: { invoice: Invoice, onClick: () => void }) => {

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
        <Card cardStyles={{ boxShadow: `-3px 0px 0px var(--status-${invoice.status.toLowerCase()}-solid)` }} onClick={onClick}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title>{invoice.invoice_number}</Title>
                <StatusChip text={invoice.status} status={invoice.status.toLowerCase()} />
            </div>

            <div style={{ width: '100%', height: '200px', background: 'red' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <Icon icon={"calendar"} size={16} iconColor="var(--Text-text-tertiary, #667085)" />
                    <Date>{formatDate(invoice.created_at)}</Date>
                </div>
                <Amount>${invoice.amount}<Currency>{invoice.currency}</Currency></Amount>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--Border-Colors-border-secondary)' }}>
                <Button text="Descargar" size="small" onClick={handleDownload} firstIcon={"download"} />
            </div>
        </Card>
    )
}

export default InvoiceCard;

const Title = styled.p`
    color: var(--Text-text-primary, #344051);
    font-family: Inter;
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.5rem; /* 150% */
`;

const Date = styled.p`
    color: var(--Text-text-tertiary, #667085);
    font-size: 0.875rem;
    font-weight: 400;
`;

const Amount = styled.p`
    color: var(--Text-text-secondary, #344051);
    font-size: 1rem;
    font-weight: 500;
`;

const Currency = styled.span`
    color: var(--Text-text-tertiary, #667085);
    font-size: 0.875rem;
    font-weight: 400;
`;