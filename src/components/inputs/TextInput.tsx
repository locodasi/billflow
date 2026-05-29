'use client'

import InputWrapper, {InputStyle} from "./Input";
import { TextInputProps } from "./types";

const TextInput = ({onChange, value, disabled, error, label, placeholder, styles}: TextInputProps) => {

    return(
        <InputWrapper error={error} disabled={disabled} label={label}>
            <InputStyle
                type="text"
                onChange={(event) => onChange((event.target as HTMLInputElement).value)}
                value={value}
                placeholder={placeholder}
                style={styles}
            />
        </InputWrapper>
    )
}

export default TextInput;
