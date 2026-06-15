
import { useRouter } from "next/navigation"

import Modal, { HeaderWrapper, WrapperModal } from "@/components/modals/Modal";
import Icon from "@/components/icons/Icon";

import { Payment } from "@/types/payment";

import Button from "@/components/Button";

import Title from "@/components/details/Title";
import DownloadButton from "@/components/details/DownloadButton";
import PaymentDetail from "@/components/details/PaymentDetail";


const PaymentDetailModal = ({ payment, onClose }: { payment: Payment, onClose: () => void }) => {

    const router = useRouter();

    const goToPaymentPage = () => {
        router.push(`payments/${payment.id}`);
    }

    return (
        <Modal onClose={onClose}>
            <WrapperModal styles={{ padding: '0', gap: '0' }}>
                <HeaderWrapper style={{ borderBottom: '1px solid var(--Border-Colors-border-secondary)', padding: '1rem' }}>
                    <Title text={payment.payment_number} status={payment.status} />

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Button text="Ir a su pagina" size="small" onClick={goToPaymentPage} firstIcon={"link"} />
                        <DownloadButton file_title={payment.payment_number} path={payment.receipt_pdf_path} />
                        <Icon icon="cancel" onClick={onClose} />
                    </div>
                </HeaderWrapper>

                <PaymentDetail payment={payment} pdfWidth="50vw" pdfHeight="80vh" />

            </WrapperModal>
        </Modal>
    )
}

export default PaymentDetailModal;





