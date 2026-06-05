
"use client";

import { useRef, useState } from "react";
import styled from "styled-components";

import Icon, { Icons } from "../icons/Icon";

interface FileInputProps {
    icon?: Icons;
    title?: string;
    subtitle?: string;
    onFileSelect: (files: File[]) => void;
    disabled?: boolean;
    multiple?: boolean;
    accept?: string;
}

const FileInput = ({ 
    icon = "cloud-upload", 
    title = "Arrastra y suelta un archivo aquí", 
    subtitle = "o haz clic para seleccionar", 
    onFileSelect, 
    disabled, 
    multiple, 
    accept = "*" 
}: FileInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const emitFiles = (files: FileList | null) => {
        if (!files || files.length === 0 || disabled) return;

        const selectedFiles = Array.from(files);
        onFileSelect(multiple ? selectedFiles : [selectedFiles[0]]);
    };

    const openPicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    return (
        <Dropzone
            $isDragOver={isDragOver}
            $disabled={!!disabled}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={openPicker}
            onKeyDown={(event) => {
                if (disabled) return;
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openPicker();
                }
            }}
            onDragEnter={(event) => {
                event.preventDefault();
                if (!disabled) setIsDragOver(true);
            }}
            onDragOver={(event) => {
                event.preventDefault();
                if (!disabled) setIsDragOver(true);
            }}
            onDragLeave={(event) => {
                event.preventDefault();
                setIsDragOver(false);
            }}
            onDrop={(event) => {
                event.preventDefault();
                setIsDragOver(false);
                emitFiles(event.dataTransfer.files);
            }}
        >
            <HiddenInput
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={(event) => {
                    emitFiles(event.target.files);
                    event.currentTarget.value = "";
                }}
            />

            <Icon icon={icon} size={26} iconColor="var(--Icons-icon-700)" />
            <TextGroup>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </TextGroup>
        </Dropzone>
    );


}

export default FileInput;

const HiddenInput = styled.input`
    display: none;
`;

const Dropzone = styled.div<{ $isDragOver: boolean; $disabled: boolean }>`
    width: 100%;
    min-height: 9rem;
    border-radius: var(--radius-m, 0.625rem);
    border: 1px dashed
        ${({ $isDragOver }) =>
            $isDragOver
                ? "var(--Components-Buttons-button-brand-bg, #235BFF)"
                : "var(--Border-Colors-border-secondary, #E4E7EC)"};
    background: ${({ $isDragOver }) =>
        $isDragOver
            ? "var(--Components-Buttons-button-brand-bg)"
            : "var(--Background-Colors-bg-primary, #FFF)"};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    text-align: center;
    cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        border-color: ${({ $disabled }) =>
            $disabled
                ? "var(--Border-Colors-border-secondary, #E4E7EC)"
                : "var(--Border-Colors-border-secondary_hover, #344051)"};
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0px 0px 0px 2px rgba(99, 112, 131, 0.2);
    }
`;

const TextGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const Title = styled.p`
    color: var(--Text-text-primary, #141C24);
    font-family: Inter;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;
`;

const Subtitle = styled.p`
    color: var(--Text-text-tertiary, #637083);
    font-family: Inter;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
`;