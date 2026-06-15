import { useState, useEffect } from "react";

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
                <InfoSection title="DETALLES">
                    <TwoRowData leftText="Monto" rightText={payment.amount.toString()} />
                    <TwoRowData leftText="Moneda" rightText={payment.currency} />
                    <TwoRowData leftText="Fecha de emision" rightText={parseDateToLocaleFormat(payment.created_at)} />
                    <TwoRowData leftText="Metodo de pago" rightText={payment.payment_method} />
                    <TwoRowData leftText="Proyecto" rightText={projectName || "N/A"} />

                    {
                        role === "admin" && payment.status === "pending" && (
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <Button text="Aprobar" onClick={() => updatePaymentStatus(payment.id, "approved")} type="primary"/>
                                <Button text="Rechazar" onClick={() => updatePaymentStatus(payment.id, "rejected")} type="error"/>
                            </div>
                        )
                    }
                </InfoSection>

                <InfoSection title="NOTAS">
                    <p style={{ fontSize: '0.875rem', color: 'var(--Text-text-tertiary)' }}>{payment.notes || "No hay notas para esta factura"}</p>
                </InfoSection>

                <InfoSection title="FACTURAS ASOCIADAS" useBorder={false} >
                    {
                        invoicesRelation.map((relation) => (
                            <ElementAssociated
                                key={relation.invoice_id}
                                title={relation.invoices.invoice_number}
                                status={relation.invoice_summary.computed_status}
                                moneyText={`${relation.amount_applied} ${relation.invoices.currency} aplicado`}
                                date={relation.invoices.created_at}
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