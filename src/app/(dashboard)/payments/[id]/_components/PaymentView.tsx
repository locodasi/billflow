"use client"

import styled from "styled-components";

import {useState} from "react";

import { Payment } from "@/types/payment";

import { HeaderWrapper } from "@/components/Header";
import Path, { RedirectPath } from "@/components/Path";

import Title from "@/components/details/Title";
import DownloadButton from "@/components/details/DownloadButton";
import PaymentDetail from "@/components/details/PaymentDetail";

import { updatePaymentStatus } from "../../actions";

const PaymentView = ({ payment }: { payment: Payment }) => {
    const [statePayment, setStatePayment] = useState(payment);

    const handleUpdatePaymentStatus = async (paymentId: string, newStatus: "approved" | "rejected") => {
        await updatePaymentStatus(paymentId, newStatus);
        setStatePayment(prev => prev ? { ...prev, status: newStatus } : prev);
    }

    return (
        <>
            <HeaderWrapper>
                <Path>
                    <RedirectPath path="/payments" label="Pagos" />
                    <Title text={statePayment.payment_number} status={statePayment.status} type="payment"/>
                </Path>

                <DownloadButton file_title={statePayment.payment_number} path={statePayment.receipt_pdf_path} />
            </HeaderWrapper>

            <Wrapper>
                <PaymentDetail payment={statePayment} pdfHeight="100%" pdfWidth="80%" updatePaymentStatus={handleUpdatePaymentStatus}/>
            </Wrapper>
        </>
    )
}

export default PaymentView;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
`;
