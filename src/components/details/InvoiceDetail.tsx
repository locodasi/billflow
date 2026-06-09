import styled from "styled-components";

import { Invoice } from "@/types/Invoice"

import { useProjectsStore } from "@/stores/projectStore";

import { parseDateToLocaleFormat } from "@/utils/timeFunctions";

import PDF from "./PDF"
import InfoSection, { TwoRowData } from "./InfoSection"
import ProgressBar from "../ProgressBar";

const InvoiceDetail = ({invoice, pdfWidth, pdfHeight }: {invoice: Invoice, pdfWidth: string, pdfHeight: string}) => {

    const projectName = useProjectsStore(s => s.project?.name);
    
    return (
        <div style={{ display: 'flex', flex: "1" }}>
            <PDF path={invoice.pdf_path} width={pdfWidth} height={pdfHeight} />

            <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                <InfoSection title="RESUMEN DE PAGO">
                    <TwoRowData leftText="Total facturado" rightText={`${invoice.amount} ${invoice.currency}`} />
                    <TwoRowData leftText="Cobrado" rightText={"300 ARS"} rightTextColor="var(--Success-600)" />
                    <TwoRowData leftText="Pendiente" rightText={`100 ARS`} rightTextColor="var(--Error-600)" />
                    <ProgressBar progress={30} color="success" />
                    <PercentText>30% cobrado</PercentText>
                </InfoSection>

                <InfoSection title="DETALLES">
                    <TwoRowData leftText="Fecha de emision" rightText={parseDateToLocaleFormat(invoice.created_at)} />
                    <TwoRowData leftText="Moneda" rightText={invoice.currency} />
                    <TwoRowData leftText="Proyecto" rightText={projectName || "N/A"} />
                </InfoSection>

                <InfoSection title="NOTAS">
                    <p style={{ fontSize: '0.875rem', color: 'var(--Text-text-tertiary)' }}>{invoice.notes || "No hay notas para esta factura"}</p>
                </InfoSection>

                <InfoSection title="RECIBOS ASOCIADOS" useBorder={false}>
                    <div></div>
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