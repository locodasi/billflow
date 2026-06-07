
export interface InputStylesConfig {
    wrapper?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
    underText?: React.CSSProperties;
}

export interface BaseInputProps {
    label?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    styles?: InputStylesConfig;
    underText?: string;
    width?: string;
}

export interface TextInputProps extends BaseInputProps {
    value: string;
    onChange: (value: string) => void;
}

export interface SearchInputProps extends BaseInputProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    delay?: number;
}

export interface NumberInputProps extends BaseInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export interface PasswordInputProps extends BaseInputProps {
    value: string;
    onChange: (value: string) => void;
    showToggle?: boolean;
}

export interface DateInputProps extends BaseInputProps {
    value: string;          // format "YYYY-MM-DD"
    onChange: (value: string) => void;
    min?: string;
    max?: string;
}