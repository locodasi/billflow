import styled, { CSSProperties } from "styled-components";

import { createPortal } from "react-dom";

import {useEffect} from "react";


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

export const WrapperModal = ({children, styles}: {children: React.ReactNode, styles?: React.CSSProperties}) => {

    return(
        <Wrapper style={styles}>
            {children}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--Background-Colors-bg-primary);
    border: 1px solid var(--Border-Colors-border-primary);
    border-radius: 0.5rem;

    max-height: 90vh;

    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
        max-height: none;

        border: none;
        border-radius: 0;
    }
`;