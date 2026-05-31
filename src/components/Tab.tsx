import styled from "styled-components";

import { Icons, ReturnIcon } from "@/components/icons/Icon";
import { JSX } from "react";

interface TabsProps {
    children: React.ReactNode;
    size?: "medium" | "large";
}

const Tabs = ({children, size = "medium"}: TabsProps) => {

    return (
        <TabsWrapper $size={size}>
            {children}
        </TabsWrapper>
    )
}

export default Tabs;

const TAB_PADDING = {
    medium: "var(--padding-4, 0.25rem) var(--padding-16, 1rem)",
    large: "var(--padding-6, 0.375rem) var(--padding-16, 1rem)",
}

const TabsWrapper = styled.div<{ $size: "medium" | "large" }>`
    display: inline-flex;
    padding: var(--padding-4, 0.25rem);
    align-items: flex-start;
    gap: var(--6, 0.375rem);

    border-radius: var(--radius-s, 0.5rem);
    background: var(--Background-Colors-bg-tertiary, #F2F4F7);

    .tab {
        padding: ${({$size}) => TAB_PADDING[$size]};
    }
`;

interface TabProps {
    text: string;
    onClick: () => void;
    active?: boolean;
    firstIcon?: Icons | JSX.Element;
    lastIcon?: Icons | JSX.Element;
}

export const Tab = ({ text, onClick, active, firstIcon, lastIcon }: TabProps) => {

    return(
        <TabWrapper className="tab" onClick={onClick} $active={active}>
            {firstIcon && <ReturnIcon icon={firstIcon} iconColor="var(--Icons-icon-700, #344051)" size={20} grab />}
            <TabText $active={active}>{text}</TabText>
            {lastIcon && <ReturnIcon icon={lastIcon} iconColor="var(--Icons-icon-700, #344051)" size={20} grab />}
        </TabWrapper>
    )
}

const TabWrapper = styled.div<{ $active?: boolean }>`
    cursor: pointer;
    display: flex;
    padding: var(--padding-6, 0.375rem) var(--padding-16, 1rem);
    justify-content: center;
    align-items: center;
    gap: var(--padding-6, 0.375rem);

    border-radius: var(--radius-xs, 0.375rem);

    &:hover {
        background: var(--Background-Colors-bg-primary_hover, #F2F4F7);
    }

    ${({$active}) => $active && `
        background: var(--Background-Colors-bg-primary, #FFF);

        /* Effects/Shadows/Tabs */
        box-shadow: 0 1px 3px 0 rgba(52, 64, 81, 0.17);

        &:hover {
            background: var(--Background-Colors-bg-primary, #FFF);
        }
    `}
`;

const TabText = styled.p<{ $active?: boolean }>`
    color: var(--Text-text-${({ $active }) => ($active ? "primary" : "tertiary")}, #637083);
    text-align: center;

    /* Paragraph S/Medium */
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 142.857% */
`;