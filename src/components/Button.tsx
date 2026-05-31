import styled from "styled-components";

import { Icons, ReturnIcon } from "./icons/Icon";
import { JSX } from "react";

type Sizes = "extra-small" | "ultra-small" | "small" | "medium" | "large" | "extra-large"


const SIZES = {
    "ultra-small": {
        padding: "var(--padding-4, 0.25rem) var(--padding-10, 0.625rem)",
        border: "var(--radius-m, 0.5rem)",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        icon: "1rem"
    },
    "extra-small": {
        padding: "var(--padding-8, 0.5rem) var(--padding-16, 1rem)",
        border: "var(--radius-m, 0.5rem)",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        icon: "1.25rem"
    },
    "small": {
        padding: "var(--padding-10, 0.625rem) var(--padding-20, 1.25rem)",
        border: "var(--radius-m, 0.625rem)",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        icon: "1.25rem"
    },
    "medium": {
        padding: "var(--padding-10, 0.625rem) var(--padding-20, 1.25rem)",
        border: "var(--radius-m, 0.625rem)",
        fontSize: "1rem",
        lineHeight: "1.5rem",
        icon: "1.5rem"
    },
    "large": {
        padding: "var(--padding-12, 0.75rem) var(--padding-24, 1.5rem)",
        border: "var(--radius-l, 0.75rem)",
        fontSize: "1rem",
        lineHeight: "1.5rem",
        icon: "1.5rem"
    },
    "extra-large": {
        padding: "var(--padding-16, 1rem) var(--padding-28, 1.75rem)",
        border: "var(--radius-l, 0.75rem)",
        fontSize: "1rem",
        lineHeight: "1.5rem",
        icon: "1.5rem"
    }
}

const ICON_SIZE = {
    "extra-small": 13,
    "ultra-small": 16,
    "small": 16,
    "medium": 20,
    "large": 20,
    "extra-large": 20
}

interface ButtonProps {
    text: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;

    type?: "default" | "primary" | "error";
    style?: "filled" | "outline" | "text";
    disabled?: boolean;
    size?: Sizes;
    firstIcon?: Icons | JSX.Element;
    secondIcon?: Icons | JSX.Element;
    cssStyles?: React.CSSProperties;
    buttonType?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "default", disabled = false, size = "ultra-small", style = "outline", firstIcon, secondIcon, cssStyles, buttonType = "button" }) => {

    const ButtonComponent = TYPES[style][type] || TextDefaultButton;

    const {border} = SIZES[size] || SIZES["ultra-small"];

    return(
        // <div> removed this recently to give it 100% width (check if it breaks anything)
            <ButtonComponent onClick={onClick} disabled={disabled} style={cssStyles} $border={border} $size={size} type={buttonType}>
                {firstIcon && <ReturnIcon icon={firstIcon} size={ICON_SIZE[size]} iconColor="var(--Icons-icon-700)" grab/>}
                {text}
                {secondIcon && <ReturnIcon icon={secondIcon} size={ICON_SIZE[size]} iconColor="var(--Icons-icon-700)" grab/>}
            </ButtonComponent>
        // </div>
    )
}

export default Button;

const Wrapper = styled.button<{$size: Sizes, $border: string}>`
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

    text-align: center;

    /* Paragraph M/Medium */
    font-family: Inter;
    font-size: ${({$size}) => SIZES[$size].fontSize};
    font-style: normal;
    font-weight: 500;
    line-height: ${({$size}) => SIZES[$size].lineHeight};


    .icon, .icon svg  {
        width: ${({$size}) => SIZES[$size].icon};
        height: ${({$size}) => SIZES[$size].icon};
    }
`;

const TextDefaultButton = styled(Wrapper)`
    color: var(--Text-text-secondary, #344051);

    .icon path {
        stroke: var(--Icons-icon-700);
    }

    &:not(:disabled):hover {
        background: var(--Background-Colors-bg-primary_hover, #F9FAFB);
    }

    &:disabled {
        cursor: auto;
        color: var(--Text-text-tertiary, #637083);

        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

const TextPrimaryButton = styled(Wrapper)`
    /* Effects/Shadows/button-shadow-base */
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    color: var(--Components-Buttons-button-brand-secondary-content, #0166FF);

    .icon path {
        stroke: var(--Components-Buttons-button-brand-secondary-content, #0166FF);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-base-secondary-bg-hover, #F9FAFB);
    }

    &:focus {
        background: var(--Components-Buttons-button-base-secondary-bg, #FFF);

        /* Effects/Focus State/Primary (Blue) */
        box-shadow: 0 0 0 2px rgba(1, 102, 255, 0.15);
    }

    &:disabled {
        background: var(--Components-Buttons-button-base-secondary-bg, #FFF);
        cursor: auto;
        color: var(--Text-text-tertiary, #637083);

        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

const TextErrorButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-base-secondary-bg, #FFF);

    color: var(--Components-Buttons-button-error-fg, #DE1212);

    .icon path {
        stroke: var(--Components-Buttons-button-error-fg, #DE1212);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-error-secondary-bg-hover, #FFE5E5);

        .icon path {
            stroke: var(--Components-Buttons-button-error-fg-hover, #B01111);
        }
    }

    &:focus {
        background: var(--Components-Buttons-button-base-secondary-bg, #FFF);

        /* Effects/Focus State/Error */
        box-shadow: 0 0 0 2px rgba(246, 44, 44, 0.20);
    }

    &:disabled {
        background: var(--Components-Buttons-button-base-secondary-bg, #FFF);
        color: var(--Text-text-tertiary, #637083);
        cursor: auto;

        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

const FilledDefaultButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-base-bg, #141C25);
    color: var(--Text-text-quaternary, #FFF);

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

        /* Effects/Shadows/button-shadow-base */
        box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

        .icon path {
            stroke: var(--Icons-icon-0);
        }
    }
`;

const FilledPrimaryButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-brand-bg, #0166FF);
    color: var(--Base-0-White, #FFF);
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    svg path {
        stroke: var(--Base-0-White, #FFF);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-brand-bg-hover, #005CE5);
    }

    &:focus {
        background: var(--Components-Buttons-button-brand-bg-hover, #005CE5);
        box-shadow: 0 0 0 2px rgba(99, 112, 131, 0.15);
    }

    &:disabled {
        background: var(--Components-Buttons-button-base-primary-disabled, #CED2DA);

        /* Effects/Shadows/button-shadow-base */
        box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);
        cursor: auto;
    }
`;

const FilledErrorButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-error-primary-bg, #F62C2C);
    color: var(--Base-0-White, #FFF);
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
        /* Effects/Shadows/button-shadow-base */
        box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);
        cursor: auto;
    }
`;

const OutlineDefaultButton = styled(Wrapper)`
    background: var(--Components-Buttons-button-base-secondary-bg, #FFF);
    border: 1px solid var(--Components-Buttons-button-base-secondary-border, #E4E7EC);
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    color: var(--Text-text-secondary, #344051);

    .icon path {
        stroke: var(--Icons-icon-700);
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
        color: var(--Text-text-tertiary, #637083);

        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

const OutlinePrimaryButton = styled(Wrapper)`
    border: 1px solid var(--Components-Buttons-button-brand-secondary-border, #0166FF);
    background: var(--Components-Buttons-button-base-secondary-bg, #FFF);
    /* Effects/Shadows/button-shadow-base */
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    color: var(--Components-Buttons-button-brand-secondary-content, #0166FF);

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
        color: var(--Text-text-tertiary, #637083);

        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

const OutlineErrorButton = styled(Wrapper)`
    border: 1px solid var(--Components-Buttons-button-error-secondary-border, #F66);
    background: var(--Components-Buttons-button-base-secondary-bg, #FFF);

    /* Effects/Shadows/button-shadow-base */
    box-shadow: 0 1px 2px 0 rgba(21, 28, 36, 0.05);

    color: var(--Components-Buttons-button-error-fg, #DE1212);

    .icon path {
        stroke: var(--Components-Buttons-button-error-fg, #DE1212);
    }

    &:not(:disabled):hover {
        background: var(--Components-Buttons-button-error-secondary-bg-hover, #FFE5E5);
    }

    &:focus {
        /* Effects/Focus State/Error */
        box-shadow: 0 0 0 2px rgba(246, 44, 44, 0.20);
    }

    &:disabled {
        cursor: auto;
        border: 1px solid var(--Components-Buttons-button-base-secondary-border, #E4E7EC);
        color: var(--Text-text-tertiary, #637083);

        .icon path {
            stroke: var(--Icons-icon-500);
        }
    }
`;

const TYPES = {
    text: {
        default: TextDefaultButton,
        primary: TextPrimaryButton,
        error: TextErrorButton
    },
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