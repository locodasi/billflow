'use client'

import TextareaAutosize from "react-textarea-autosize";

import styled from "styled-components";

import { Label } from "./InputWrapper";

type TextAreaProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    minLines?: number;
    maxLines?: number;
}

const TextArea = ({
    value,
    onChange,
    label,
    placeholder,
    error,
    disabled,
    minLines = 2,
    maxLines = 6,
}: TextAreaProps) => {

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {label && <Label>{label}</Label>}

            <StyledTextArea
                minRows={minLines}
                maxRows={maxLines}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                $hasError={!!error}
            />
        </div>
    );
}

export default TextArea;


const StyledTextArea = styled(TextareaAutosize) <{ $hasError: boolean }>`
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ $hasError }) =>
        $hasError ? "var(--Error-400)" : "var(--Border-Colors-border-primary)"};
    background: var(--Background-Colors-bg-primary);
    color: var(--Text-text-primary);
    font-size: 0.875rem;
    resize: none;
    outline: none;
    line-height: 1.5;
    font-family: inherit;

    &::placeholder {
        color: var(--Text-text-tertiary);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;