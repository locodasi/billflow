
import { useRouter } from "next/navigation"

import Modal, { HeaderWrapper, WrapperModal } from "@/components/modals/Modal";
import Icon from "@/components/icons/Icon";

import {InvoiceSummary } from "@/types/Invoice";

import Button from "@/components/Button";

import Title from "@/components/details/Title";
import DownloadButton from "@/components/details/DownloadButton";
import InvoiceDetail from "@/components/details/InvoiceDetail";

const InvoiceDetailModal = ({ invoice, onClose }: { invoice: InvoiceSummary, onClose: () => void }) => {

    const router = useRouter();

    const goToInvoicePage = () => {
        router.push(`invoices/${invoice.id}`);
    }

    return (
        <Modal onClose={onClose}>
            <WrapperModal styles={{ padding: '0', gap: '0' }}>
                <HeaderWrapper style={{ borderBottom: '1px solid var(--Border-Colors-border-secondary)', padding: '1rem' }}>
                    <Title text={invoice.invoice_number} status={invoice.computed_status} type="invoice"/>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Button text="Ir a su pagina" size="small" onClick={goToInvoicePage} firstIcon={"link"} />
                        <DownloadButton file_title={invoice.invoice_number} path={invoice.pdf_path} />
                        <Icon icon="cancel" onClick={onClose} />
                    </div>
                </HeaderWrapper>

                <InvoiceDetail invoice={invoice} pdfWidth="50vw" pdfHeight="80vh" />

            </WrapperModal>
        </Modal>
    )
}

export default InvoiceDetailModal;





