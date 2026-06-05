'use client'

import InputWrapper, {InputStyle} from "./InputWrapper";
import { NumberInputProps } from "./types";


const NumberInput = ({onChange, value, disabled, error, label, placeholder, styles, max, min, step, underText}: NumberInputProps) => {

    return(
        <InputWrapper error={error} disabled={disabled} label={label} styles={styles} underText={underText}>
            <InputStyle
                type="number"
                onChange={(event) => onChange(Number(event.target.value))}
                disabled={disabled}
                value={value}
                placeholder={placeholder}
                max={max}
                min={min}
                step={step}
                style={styles?.input}
            />
        </InputWrapper>
    )
}

export default NumberInput;