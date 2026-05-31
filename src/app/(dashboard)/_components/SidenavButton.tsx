"use client"

import styled from "styled-components";

import Icon, { Icons } from "@/components/icons/Icon";

import Tooltip from "@/components/Tooltip";

interface SidenavButtonProps {
    isExpanded: boolean;
    text: string;
    icon: Icons;
    onClick: () => void;
}

const SidenavButton = ({ isExpanded, text, icon, onClick }: SidenavButtonProps) => {

    if (!isExpanded) {
        return (
            <Tooltip content={text} position="right" arrow={false}>
                <Wrapper $isExpanded={isExpanded} onClick={onClick}>
                    <Icon icon={icon} size={24} iconColor="var(--Icons-icon-400)" grab />
                </Wrapper>
            </Tooltip>
        )
    }

    return (
        <Wrapper $isExpanded={isExpanded} onClick={onClick}>
            <Icon icon={icon} size={20} iconColor="var(--Icons-icon-400)" grab />
            {isExpanded && <Text>{text}</Text>}
        </Wrapper>
    )
}

export default SidenavButton;

const Wrapper = styled.div<{ $isExpanded?: boolean }>`
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    border-radius: 0.5rem;
    padding: ${({ $isExpanded }) => $isExpanded ? "0.5rem" : "0.25rem"};
    justify-content: ${({ $isExpanded }) => $isExpanded ? "flex-start" : "center"};
    cursor: pointer;
    gap: 0.5rem;

    &:hover {
        background-color: var(--Background-Colors-bg-secondary_hover);
        border: 1px solid var(--Border-Colors-border-secondary_hove);
    }
`;

const Text = styled.p`
    color: var(--Text-text-primary);
    font-size: 1rem;
    font-weight: 500;
`;