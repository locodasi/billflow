import styled from "styled-components";

import {useState} from "react";

import Modal, { HeaderModal, WrapperModal } from "@/components/modals/Modal";
import Icon from "@/components/icons/Icon";

import { Payment } from "@/types/payment";

import UploadMode from "./UploadMode";

const NewPaymentModal = ({ onClose, addPayment }: { onClose: () => void, addPayment: (payment: Payment) => void }) => {

    const [mode, setMode] = useState<"upload" | "manual">("upload");


    return (
        <Modal onClose={onClose}>
            <WrapperModal>
                <HeaderModal title="Nuevo pago" onClose={onClose} />

                <div style={{ display: "flex", alignItems: "stretch", gap: "1rem" }}>
                    <ModeOption $active={mode === "upload"} onClick={() => setMode("upload")}>
                        <Icon icon="upload" size={30} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <p className="title">Subir PDF</p>
                            <p className="subtitle">Detecta datos automaticamente</p>
                        </div>
                    </ModeOption>
                    <ModeOption $active={mode === "manual"} $disabled={true} onClick={() => setMode("manual")}>
                        <Icon icon="edit-pencil" size={30} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <p className="title">Crear manual</p>
                            <p className="subtitle">Proximamente</p>
                        </div>
                    </ModeOption>
                </div>

                {mode === "upload" && <UploadMode close={onClose} addPayment={addPayment}/>}

            </WrapperModal>
        </Modal>
    )
}

export default NewPaymentModal;

const ModeOption = styled.div<{ $active: boolean, $disabled?: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--Background-Colors-bg-secondary);
    border: 1px solid var(--Border-Colors-border-secondary);
    border-radius: 0.5rem;
    cursor: pointer;
    flex: 1;
    

    &:hover {
        background: ${({ $active }) => $active ? 'var(--Components-Buttons-button-brand-bg)' : 'var(--Background-Colors-bg-secondary-hover)'};
    }

    ${({ $active }) => $active && `
        background: var(--Components-Buttons-button-brand-bg);
        border: 1px solid var(--Components-Buttons-button-brand-secondary-border);
    `}

    ${({ $disabled }) => $disabled && `
        opacity: 0.5;
        pointer-events: none;
        cursor: default;
    `}

    .title {
        font-weight: 500;
        font-size: 1rem;
        color: ${({ $disabled }) => $disabled ? 'var(--Text-text-tertiary)' : 'var(--Text-text-primary)'};
    }

    .subtitle {
        font-weight: 400;
        font-size: 0.875rem;
        color: ${({ $disabled }) => $disabled ? 'var(--Text-text-tertiary)' : 'var(--Text-text-primary)'};
    }
`;