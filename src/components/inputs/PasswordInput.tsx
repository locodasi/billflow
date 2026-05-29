'use client'

import {useState} from "react";

import InputWrapper, {InputStyle} from "./Input";
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
                style={styles}
            />

            {showToggle && (
                <p>a</p>
            )}
        </InputWrapper>
    )
}

export default PasswordInput;