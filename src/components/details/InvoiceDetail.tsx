import styled from "styled-components";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";

import { InvoiceSummary } from "@/types/Invoice"

import { useProjectsStore } from "@/stores/projectStore";

import { parseDateToLocaleFormat } from "@/utils/timeFunctions";

import PDF from "./PDF"
import InfoSection, { TwoRowData } from "./InfoSection"
import ProgressBar from "../ProgressBar";
import ElementAssociated from "./ElementAssociated";

interface PaymentRelation {
    payment_id: string;
    amount_applied: number;
    payments: {
        payment_number: string;
        status: string;
        currency: string;
        created_at: string;
    }
}
const InvoiceDetail = ({ invoice, pdfWidth, pdfHeight }: { invoice: InvoiceSummary, pdfWidth: string, pdfHeight: string }) => {

    const [paymentsRelation, setPaymentsRelation] = useState<PaymentRelation[]>([]);
    const projectName = useProjectsStore(s => s.project?.name);

    useEffect(() => {
        const fetchPaymentsRelation = async () => {
            const { data, error } = await supabase.from('payment_invoices')
                .select(`
                    payment_id,
                    amount_applied,
                    payments (
                        payment_number,
                        status,
                        currency,
                        created_at
                    )
                `)
                .eq('invoice_id', invoice.id);

            if (error) {
                console.error("Error fetching payments relation:", error);
            } else {
                setPaymentsRelation(data as unknown as PaymentRelation[]);
            }
        }

        fetchPaymentsRelation();
    }, [invoice.id]);

    return (
        <div style={{ display: 'flex', flex: "1", minHeight: 0 }}>
            <PDF path={invoice.pdf_path} width={pdfWidth} height={pdfHeight} />

            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', minHeight: 0 }}>
                <InfoSection title="RESUMEN DE PAGO">
                    <TwoRowData leftText="Total facturado" rightText={`${invoice.amount} ${invoice.currency}`} />
                    <TwoRowData leftText="Cobrado" rightText={`${invoice.paid_amount} ${invoice.currency}`} rightTextColor="var(--Success-600)" />
                    <TwoRowData leftText="Pendiente" rightText={`${invoice.pending_amount} ${invoice.currency}`} rightTextColor="var(--Warning-600)" />
                    <TwoRowData leftText="Adeudado" rightText={`${invoice.outstanding_amount} ${invoice.currency}`} rightTextColor="var(--Error-600)" />
                    <ProgressBar progress={(invoice.paid_amount / invoice.amount) * 100} color="success" />
                    <PercentText>{((invoice.paid_amount / invoice.amount) * 100).toFixed(0)}% cobrado</PercentText>
                </InfoSection>

                <InfoSection title="DETALLES">
                    <TwoRowData leftText="Fecha de emision" rightText={parseDateToLocaleFormat(invoice.created_at)} />
                    <TwoRowData leftText="Moneda" rightText={invoice.currency} />
                    <TwoRowData leftText="Proyecto" rightText={projectName || "N/A"} />
                </InfoSection>

                <InfoSection title="NOTAS">
                    <p style={{ fontSize: '0.875rem', color: 'var(--Text-text-tertiary)' }}>{invoice.notes || "No hay notas para esta factura"}</p>
                </InfoSection>

                <InfoSection title="RECIBOS ASOCIADOS" useBorder={false} >
                    {
                        paymentsRelation.map((relation) => (
                            <ElementAssociated
                                key={relation.payment_id}
                                title={relation.payments.payment_number}
                                status={relation.payments.status}
                                moneyText={`${relation.amount_applied} ${invoice.currency} aplicado`}
                                date={relation.payments.created_at}
                                url={`/payments/${relation.payment_id}`}
                            />
                        ))
                    }
                </InfoSection>
            </div>
        </div>
    )
}

export default InvoiceDetail;

const PercentText = styled.span`
    font-size: 0.75rem;
    color: var(--Text-text-tertiary);
    font-weight: 400;
    align-self: flex-end;
`;