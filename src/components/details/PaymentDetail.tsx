import { useState, useEffect } from "react";

import {useTranslations} from "next-intl";

import { supabase } from "@/lib/supabase";

import { Payment } from "@/types/payment";

import { useProjectsStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";

import { parseDateToLocaleFormat } from "@/utils/timeFunctions";

import Button from "../Button";

import PDF from "./PDF"
import InfoSection, { TwoRowData } from "./InfoSection"
import ElementAssociated from "./ElementAssociated";


interface InvoiceRelation {
    invoice_id: string;
    amount_applied: number;
    invoices: {
        invoice_number: string;
        currency: string;
        created_at: string;
    },
    invoice_summary: {
        computed_status: string;
    }
}

interface PaymentDetailProps {
    payment: Payment;
    pdfWidth: string;
    pdfHeight: string;
    updatePaymentStatus: (paymentId: string, newStatus: "approved" | "rejected") => Promise<void>;
}

const PaymentDetail = ({ payment, pdfWidth, pdfHeight, updatePaymentStatus }: PaymentDetailProps) => {

    const t = useTranslations('payments.detail');

    const [invoicesRelation, setInvoicesRelation] = useState<InvoiceRelation[]>([]);
    const projectName = useProjectsStore(s => s.project?.name);
    const role = useUserStore(s => s.role);

    useEffect(() => {
        const fetchInvoicesRelation = async () => {
            const { data, error } = await supabase.from('payment_invoices')
                .select(`
                    invoice_id,
                    amount_applied,
                    invoices (
                        invoice_number,
                        currency,
                        created_at
                    ),
                    invoice_summary (
                        computed_status
                    )
                `)
                .eq('payment_id', payment.id);

            if (error) {
                console.error("Error fetching invoices relation:", error);
            } else {
                setInvoicesRelation(data as unknown as InvoiceRelation[]);
            }
        }

        fetchInvoicesRelation();
    }, [payment.id]);

    return (
        <div style={{ display: 'flex', flex: "1", minHeight: 0 }}>
            <PDF path={payment.receipt_pdf_path} width={pdfWidth} height={pdfHeight} />

            <div style={{ display: 'flex', flexDirection: 'column', width: '50%', minHeight: 0 }}>
                <InfoSection title={t('details.title').toUpperCase()}>
                    <TwoRowData leftText={t('details.amount')} rightText={payment.amount.toString()} />
                    <TwoRowData leftText={t('details.currency')} rightText={payment.currency} />
                    <TwoRowData leftText={t('details.date')} rightText={parseDateToLocaleFormat(payment.created_at)} />
                    <TwoRowData leftText={t('details.method')} rightText={payment.payment_method} />
                    <TwoRowData leftText={t('details.project')} rightText={projectName || "N/A"} />

                    {
                        role === "admin" && payment.status === "pending" && (
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <Button text={t('details.approve')} onClick={() => updatePaymentStatus(payment.id, "approved")} type="primary"/>
                                <Button text={t('details.reject')} onClick={() => updatePaymentStatus(payment.id, "rejected")} type="error"/>
                            </div>
                        )
                    }
                </InfoSection>

                <InfoSection title={t('notes.title').toUpperCase()}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--Text-text-tertiary)' }}>{payment.notes || t('notes.no_notes')}</p>
                </InfoSection>

                <InfoSection title={t('element_associated.title').toUpperCase()} useBorder={false} >
                    {
                        invoicesRelation.map((relation) => (
                            <ElementAssociated
                                key={relation.invoice_id}
                                title={relation.invoices.invoice_number}
                                status={relation.invoice_summary.computed_status}
                                moneyText={t('element_associated.moneyApplied', { amount: relation.amount_applied, currency: relation.invoices.currency })}
                                date={t('element_associated.issuedOn', { date: parseDateToLocaleFormat(relation.invoices.created_at) })}
                                url={`/invoices/${relation.invoice_id}`}
                            />
                        ))
                    }
                </InfoSection>
            </div>
        </div>
    )
}

export default PaymentDetail;