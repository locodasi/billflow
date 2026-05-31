import styled from "styled-components";

import {Icons, ReturnIcon} from "./icons/Icon";
import { JSX } from "react";

type Sizes = "extra-small" | "ultra-small" | "small" | "medium" | "large" | "extra-large"

const SIZES = {
    "ultra-small": {
        padding: "var(--padding-4, 0.25rem)",
        border: "var(--radius-m, 0.5rem)",
        icon: "1rem"
    },
    "extra-small": {
        padding: "var(--padding-8, 0.5rem)",
        border: "var(--radius-m, 0.75rem)",
        icon: "1.25rem"
    },
    "small": {
        padding: "var(--padding-10, 0.625rem)",
        border: "var(--radius-m, 0.75rem)",
        icon: "1.25rem"
    },
    "medium": {
        padding: "var(--padding-10, 0.625rem)",
        border: "var(--radius-m, 0.75rem)",
        icon: "1.5rem"
    },
    "large": {
        padding: "var(--padding-12, 0.75rem)",
        border: "var(--radius-l, 0.75rem)",
        icon: "1.5rem"
    },
    "extra-large": {
        padding: "var(--padding-16, 1rem)",
        border: "var(--radius-l, 1rem)",
        icon: "1.5rem"
    }
}

interface ButtonProps {
    icon: Icons | JSX.Element;
    onClick: (e?: React.MouseEvent) => void;

    type?: "default" | "primary" | "error" | "secondary";
    style?: "filled" | "outline";
    disabled?: boolean;
    size?: Sizes;
    personalizeStyle?: React.CSSProperties;
    className?: string;
    ghost?: boolean;
}

const IconButton: React.FC<ButtonProps> = ({ icon, onClick, type = "default", disabled = false, size = "ultra-small", style = "outline", personalizeStyle, className, ghost = false }) => {

    let ButtonComponent;

    if(type === "secondary"){
        ButtonComponent = Secondary;
    }else{
        ButtonComponent = TYPES[style][type];
    }

    const {border} = SIZES[size] || SIZES["ultra-small"];

    const GivedIcon = <ReturnIcon icon={icon} size={16} iconColor={"none"} grab onlySvg className="icon"/>

    const finalizeStyle = ghost ? {
        border: "none",
        ...personalizeStyle
    } : personalizeStyle;
    
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        (e.currentTarget as HTMLButtonElement).blur(); // 👈 SACA EL FOCUS
        if(!disabled){
            onClick(e);
        }
        
    }
    return(
            <ButtonComponent onClick={handleClick} disabled={disabled} style={finalizeStyle} $border={border} $size={size} className={className}>
                {GivedIcon}
            </ButtonComponent>
    )
}

export default IconButton;

export const Wrapper = styled.button<{ $size: Sizes, $border: string }>`
    cursor: pointer;
    display: inline-flex;
    padding: ${({$size}) => SIZES[$size].padding};
    border-radius: ${({$border}) => $border};
    justify-content: center;
    align-items: center;
    gap: var(--8, 0.5rem);
    background: none;
    outline: none;
    border: none;


    .icon, .icon svg  {
        width: ${({$size}) => SIZES[$size].icon};
        height: ${({$size}) => SIZES[$size].icon};
    }
`;


export const FilledDefaultButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-base-bg, #141C25);

    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    svg path {
        stroke: var(--Icons-icon-0, #E4E7EC);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-base-hover, #344051);
    }

    &:focus {
        box-shadow: 0 0 0 2px rgba(99, 112, 131, 0.15);
    }

    &:disabled {
        cursor: auto;
        background: var(--Components-Buttons-button-base-primary-disabled, #CED2DA);
    }
`;

export const FilledPrimaryButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-brand-bg, #0166FF);
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    svg path {
        stroke: var(--Base-0-White, #FFF);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-brand-bg-hover, #005CE5);
    }

    &:focus {
        box-shadow: 0 0 0 2px rgba(1, 102, 255, 0.15);
    }

    &:disabled {
        background: var(--Components-Buttons-button-base-primary-disabled, #CED2DA);
        cursor: auto;
    }
`;

export const FilledErrorButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-error-primary-bg, #F62C2C);
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    svg path {
        stroke: var(--Base-0-White, #FFF);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-error-primary-bg-hover, #DE1212);
    }

    &:focus {
        box-shadow: 0px 0px 0px 2px rgba(246, 44, 44, 0.20);
    }

    &:disabled {
        background: var(--Components-Buttons-button-base-primary-disabled, #CED2DA);
        cursor: auto;
    }
`;

export const OutlineDefaultButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-base-secondary-bg, #FFF);
    border: 1px solid var(--Components-Buttons-button-base-secondary-border, #E4E7EC);
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    .icon path {
        stroke: var(--Icons-icon-900);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-base-secondary-bg-hover, #F9FAFB);
    }

    &:focus {
        box-shadow: 0 0 0 2px rgba(99, 112, 131, 0.15);
        border: none;
    }

    &:disabled {
        cursor: auto;
        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

export const OutlinePrimaryButton = styled(Wrapper)`
    border: 1px solid var(--Components-Buttons-button-brand-secondary-border, #0166FF);
    background: var(--Components-Buttons-button-base-secondary-bg, #FFF);
    /* Effects/Shadows/button-shadow-base */
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    .icon path {
        stroke: var(--Components-Buttons-button-brand-secondary-content, #0166FF);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-base-secondary-bg-hover, #F9FAFB);
    }

    &:focus {
        box-shadow: 0 0 0 2px rgba(1, 102, 255, 0.15);
        border: none;
    }

    &:disabled {
        cursor: auto;
        border: 1px solid var(--Components-Buttons-button-base-secondary-border, #E4E7EC);

        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

export const OutlineErrorButton = styled(Wrapper)`
    border: 1px solid var(--Components-Buttons-button-error-secondary-border, #F66);
    background: var(--Components-Buttons-button-base-secondary-bg, #FFF);

    /* Effects/Shadows/button-shadow-base */
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    .icon path {
        stroke: var(--Components-Buttons-button-error-fg, #DE1212);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-error-secondary-bg-hover, #FFE5E5);
    }

    &:focus {
        /* Effects/Focus State/Error */
        box-shadow: 0 0 0 2px rgba(246, 44, 44, 0.20);
        border: none;
    }

    &:disabled {
        cursor: auto;
        border: 1px solid var(--Components-Buttons-button-base-secondary-border, #E4E7EC);

        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

export const TYPES = {
    filled: {
        default: FilledDefaultButton,
        primary: FilledPrimaryButton,
        error: FilledErrorButton
    },
    outline: {
        default: OutlineDefaultButton,
        primary: OutlinePrimaryButton,
        error: OutlineErrorButton
    },
    // For backward compatibility
}

export const Secondary = styled(Wrapper)`
    background: var(--Background-Colors-bg-secondary, #F9FAFB);

    .icon path {
        stroke: var(--Icons-icon-900);
    }

    &:not(:disabled):hover {
        background: var(--Background-Colors-bg-primary, #FFF);

        /* Effects/Shadows/button-shadow-base */
        box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);
    }

    &:focus {
    }

    &:disabled {
        cursor: auto;
        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;