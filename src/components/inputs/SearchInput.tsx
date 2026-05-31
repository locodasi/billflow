'use client'

import {useState, useEffect} from "react";

import Icon from "../icons/Icon";

import InputWrapper, {InputStyle} from "./InputWrapper";
import { SearchInputProps } from "./types";


const SearchInput = ({disabled, error, label, placeholder, styles, delay = 300, onSearch}: SearchInputProps) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(value);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, delay, onSearch]);

    return(
        <InputWrapper error={error} disabled={disabled} label={label}>

            <Icon icon={"search"} size={16} />

            <InputStyle
                type="text"
                onChange={(e) => setValue(e.target.value)}
                value={value}
                placeholder={placeholder}
                style={styles}
            />
        </InputWrapper>
    )
}

export default SearchInput;
