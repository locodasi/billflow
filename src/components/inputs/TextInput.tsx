'use client'

import InputWrapper, {InputStyle} from "./InputWrapper";
import { TextInputProps } from "./types";


const TextInput = ({onChange, value, disabled, error, label, placeholder, styles, underText}: TextInputProps) => {

    return(
        <InputWrapper error={error} disabled={disabled} label={label} styles={styles} underText={underText}>
            <InputStyle
                type="text"
                onChange={(event) => onChange((event.target as HTMLInputElement).value)}
                value={value}
                placeholder={placeholder}
                style={styles?.input}
            />
        </InputWrapper>
    )
}

export default TextInput;
