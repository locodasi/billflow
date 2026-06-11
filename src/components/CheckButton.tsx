import styled from "styled-components";

import Icon from "./icons/Icon";

interface CheckBoxProps {
    onChange: (value: boolean) => void;
    checked?: boolean;
    indeterminate?: boolean;
    color?: "base" | "primary";
    size?: "small" | "medium";
    disabled?: boolean;
    className?: string;
    text?: string;
}

const CheckBox = ({ checked, indeterminate, onChange, color="base", size="medium", disabled, className, text }: CheckBoxProps) => {
    const iconStyle = {
        size: size === "small" ? 14 : 16,
        iconColor: "var(--Icons-icon-0, #FFFFFF)"
    }

    return (
        <div style={{display: "flex", alignItems:"center", gap: "0.5rem"}}>
            <CheckBoxStyle onClick={() => onChange(!(checked || indeterminate))} size={size} disabled={disabled} variant={(checked || indeterminate) ? color : "not_cheked"} className={className}>
                {indeterminate ? <Icon icon="minus" {...iconStyle} grab /> : checked && <Icon icon="check" grab {...iconStyle} />}
            </CheckBoxStyle>
            
            {text && <Text>{text}</Text>}
        </div>
    );
}

export default CheckBox;

const Text = styled.p`
    color: var(--Text-text-secondary, #344051);
    text-shadow: 0 1px 2px rgba(20, 28, 36, 0.04);

    /* Paragraph S/Medium */
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 142.857% */
`;

const SIZE = {
    small: `
        width: 1rem;
        height: 1rem;
        border-radius: 0.375rem;
        padding: 0.0625rem;
    `,
    medium: `
        width: 1.25rem;
        height: 1.25rem;
        padding: 0.125rem;
        border-radius: var(--radius-s, 0.5rem);
    `
}

const COLOR = {
    base: `
        background: var(--Foreground-Colors-foreground-01, #141C25);

        &:not(:disabled):hover {
            background: var(--Foreground-Colors-foreground-02, #1A232D);
        }

        &:not(:disabled):focus {
            box-shadow: 0px 0px 0px 2px rgba(99, 112, 131, 0.15);
        }

        &:disabled {
            background: var(--Foreground-Colors-foreground-07, #CED2DA)
        }
    `,
    primary: `
        background: var(--Components-Buttons-button-brand-bg, #0166FF);

        &:not(:disabled):hover {
            background: var(--Components-Buttons-button-brand-bg-hover, #005CE5);
        }

        &:not(:disabled):focus {
            box-shadow: 0px 0px 0px 2px rgba(1, 102, 255, 0.15);
        }

        &:disabled {
            background: var(--Foreground-Colors-foreground-07, #CED2DA)
        }
    `,
    not_cheked: `
        border: 1.5px solid var(--Border-Colors-border-tertiary, #CED2DA);

        &:not(:disabled):hover {
            background: var(--Background-Colors-bg-secondary, #F9FAFB);
        }

        &:not(:disabled):focus {
            background: var(--Background-Colors-bg-primary, #FFF);
            /* Effects/Focus State/Base */
            box-shadow: 0px 0px 0px 2px rgba(99, 112, 131, 0.15);
        }

        &:disabled {
            border: 1.5px solid var(--Border-Colors-border-disabled, #CED2DA);
        }
    `
}

const CheckBoxStyle = styled.button<{size: "small" | "medium", variant: keyof typeof COLOR}>`
    ${({ size }) => SIZE[size || "medium"]}
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    background: transparent;
    border: none;
    outline: none;

    &:not(:disabled){
        cursor: pointer;
    }

    ${({ variant }) => COLOR[variant || "base"]}
`;
