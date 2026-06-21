'use client'

import {useState} from "react";

import Icon from "@/components/icons/Icon";

import InputWrapper, {InputStyle} from "./InputWrapper";
import { PasswordInputProps } from "./types";

const PasswordInput = ({onChange, value, disabled, error, label, placeholder, styles, showToggle}: PasswordInputProps) => {

    const [type, setType] = useState<"password" | "text">("password");

    return(
        <InputWrapper error={error} disabled={disabled} label={label}>
            <InputStyle
                type={type}
                onChange={(event) => onChange((event.target as HTMLInputElement).value)}
                value={value}
                placeholder={placeholder}
                style={styles?.input}
            />

            {showToggle && (
                <Icon 
                    icon={type === "password" ? "eye-empty" : "eye-off"}
                    size={20}
                    iconColor={"var(--Icons-icon-700)"}
                    onClick={() => setType(type === "password" ? "text" : "password")}
                />
            )}
        </InputWrapper>
    )
}

export default PasswordInput;
