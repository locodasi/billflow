import styled from "styled-components";

import {useState} from "react";

import Modal, { HeaderModal, WrapperModal, HeaderWrapper, HeaderTitle } from "@/components/modals/Modal";
import Icon from "@/components/icons/Icon";

import { Payment } from "@/types/payment";

import UploadMode from "./UploadMode";

export type NewPaymentMode = "upload" | "manual";

const NewPaymentModal = ({ onClose, addPayment }: { onClose: () => void, addPayment: (payment: Payment) => void }) => {

    const [mode, setMode] = useState<NewPaymentMode>("upload");


    return (
        <Modal onClose={onClose}>
            <WrapperModal styles={{padding: "0", gap: "0"}}>
                <HeaderWrapper style={{padding: "1rem", borderBottom: "1px solid var(--Border-Colors-border-primary)"}}>
                    <HeaderTitle>Nuevo pago</HeaderTitle>

                    <Icon icon={"delete-circle"} size={24} onClick={onClose} />
                </HeaderWrapper>

                {mode === "upload" && <UploadMode close={onClose} addPayment={addPayment} mode={mode} setMode={setMode} />}

            </WrapperModal>
        </Modal>
    )
}

export default NewPaymentModal;
