import Select from "react-select";
import { StylesConfig } from "react-select";

import styled from "styled-components";

export interface Option {
    value: string;
    label: string | JSX.Element;
}

interface Props {
    options: Array<Option>;
    value: Option | null;
    onChange: (selectedOption: Option) => void;
    title?: string;
    width?: string;
    disabled?: boolean;
    textColor?: string;
    placeholder?: string;
}

const NormalSelect = ({ options, value, onChange, title, width, disabled = false, textColor, placeholder }: Props) => {

    const customStyles: StylesConfig<{ value: string; label: string | JSX.Element; }, false> = {
        control: (provided) => ({
            ...provided,
            backgroundColor: disabled ? "var(--Background-Colors-bg-secondary, #1A232D)" : "var(--Background-Colors-bg-primary, #1A232D)", // background
            borderColor: disabled ? "var(--Background-Colors-bg-secondary, #1A232D)" : "var(--Border-Colors-border-secondary, #1A232D)", // border
            boxShadow: "none", // para quitar el glow azul por defecto
            borderRadius: "0.625rem",
            width: "100%",
            minHeight: "2.25rem", // opcional

            ":hover": {
                borderColor: "var(--Border-Colors-border-secondary, #1A232D)", // color al pasar el mouse
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "var(--Background-Colors-bg-primary, #1A232D)",  // Fondo del dropdown
            border: "none",
            borderRadius: "0.625rem",
            padding: 0,
            width: "100%",
            zIndex: 9999, // Asegura que no se tape
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: disabled ? "transparent" : "#FFFFFF", // Cambiá este color como quieras
            padding: "0 8px",
            transition: "0.2s",
        
            ":hover": {
                color: disabled ? "transparent" : "#FFFFFF", // color al pasar el mouse
            },
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "var(--Background-Colors-bg-primary_hover, #1A232D)" : "var(--Background-Colors-bg-primary, #1A232D)",
            color: textColor || "var(--Text-text-primary, #FFFFFF)",
            cursor: "pointer",
        }),
        singleValue: (provided) => ({
            ...provided,
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 500,
            color: disabled ? "var(--Text-text-tertiary, #97A1AF)" : (textColor || "var(--Text-text-primary, #FFFFFF)"), // color del texto seleccionado
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "var(--Text-text-tertiary, #97A1AF)", // color del placeholder
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            letterSpacing: 0,
        }),
    };

    return(
        <div style={{width, display: "flex", flexDirection: "column", gap: "0.25rem", pointerEvents: disabled ? "none" : "auto"}}>
            {title && <Title>{title}</Title>}

            <Select
                options={options}
                value={value}
                styles={customStyles}
                onChange={(selectedOption) => onChange(selectedOption as { value: string; label: string | JSX.Element })} // Type assertion to match the expected type
                placeholder={placeholder || "Select..."}
            />
        </div>
    )
}

export default NormalSelect;

const Title = styled.p`
    color: var(--Text-text-secondary, #E4E7EC);
    text-shadow: 0 1px 2px rgba(20, 28, 36, 0.04);

    /* Paragraph S/Medium */
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 142.857% */
`;

import Icon, {Icons} from "./icons/Icon";

import { JSX } from "react";

export const OptionWithIcon = ({icon, text, iconColor}: {icon: Icons, text: string, iconColor?: string}) => {

    return(
        <div style={{display: "flex", alignItems: "center", gap: "0.25rem", flex: "1 0 0"}}>
            <Icon icon={icon} size={18} iconColor={iconColor || "var(--Icons-icon-500, #CED2DA)"} />
            <p>{text}</p>
        </div>
    )
}