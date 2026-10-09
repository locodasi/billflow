import styled, { css, CSSProperties } from "styled-components";

import { createPortal } from "react-dom";

import {useEffect} from "react";

import { useCloseOnBack } from "@/hooks/useCloseOnBack";


const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;


interface Props {
    children: React.ReactNode;
    onClose: () => void;
    zIndex?: number;
}

const Modal = ({children, onClose, zIndex = 1000}: Props) => {
    useCloseOnBack(onClose);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
    
        document.addEventListener("keydown", handleKeyDown);
    
        document.body.style.overflow = "hidden";
    
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return createPortal(
        <ModalWrapper style={{zIndex}} onClick={handleClick} id="my-modal">
            {children}
        </ModalWrapper>,
        document.body
    );
};

export default Modal

import Icon, { Icons } from "../icons/Icon";

interface HeaderModalProps {
    onClose: () => void;
    closeIcon?: Icons;
    title?: string;
    styles?: CSSProperties;
}

export const HeaderModal = ({ title, onClose, closeIcon = "delete-circle", styles }: HeaderModalProps) => {

    return(
        <HeaderWrapper style={styles}>
            <HeaderTitle>{title}</HeaderTitle>
            <Icon icon={closeIcon} size={24} onClick={onClose} />
        </HeaderWrapper>
    )
}

export const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const HeaderTitle = styled.h2`
    color: var(--Text-text-primary);
    font-size: 1.25rem;
    font-weight: 500;
`;

export type ModalVariant  = "large" | "default" | "wide"

const MODAL_VARIANTS: Record<ModalVariant, any> = {
    default: css`
    `,

    large: css`
        width: min(1000px, 95vw);
        height: 90vh;
    `,

    wide: css`
        width: min(1200px, 95vw);
        height: 80vh;
    `,
} as const;

export const WrapperModal = ({children, styles, variant = "default"}: {children: React.ReactNode, styles?: React.CSSProperties, variant?: ModalVariant}) => {

    return(
        <Wrapper style={styles} $variant={variant}>
            {children}
        </Wrapper>
    )
}

const Wrapper = styled.div<{
    $variant: ModalVariant;
}>`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--Background-Colors-bg-primary);
    border: 1px solid var(--Border-Colors-border-primary);
    border-radius: 0.5rem;

    max-height: 90vh;

    ${({ $variant }) => MODAL_VARIANTS[$variant]}

    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
        max-height: none;

        border: none;
        border-radius: 0;
    }
`;