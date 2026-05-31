import styled from "styled-components";

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
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return createPortal(
        <ModalWrapper style={{zIndex}} onClick={handleClick} id="my-modal">
            {children}
        </ModalWrapper>,
        document.body
    );
};

export default Modal

import Icon from "../icons/Icon";

interface HeaderModalProps {
    title: string;
    onClose: () => void;
}

export const HeaderModal = ({ title, onClose }: HeaderModalProps) => {

    return(
        <HeaderWrapper>
            <Title>{title}</Title>
            <Icon icon={"delete-circle"} size={24} onClick={onClose} />
        </HeaderWrapper>
    )
}

const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.h2`
    color: var(--Text-text-primary);
    font-size: 1.25rem;
    font-weight: 500;
`;

export const WrapperModal = ({children}: {children: React.ReactNode}) => {

    return(
        <Wrapper>
            {children}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    background-color: var(--Background-Colors-bg-primary);
    border: 1px solid var(--Border-Colors-border-primary);
    border-radius: 0.5rem;
`;