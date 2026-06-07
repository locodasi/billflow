'use client'

import {useState} from "react";

import {useDebounce} from "@/utils/useDebounce";

import Icon from "../icons/Icon";

import InputWrapper, {InputStyle} from "./InputWrapper";
import { SearchInputProps } from "./types";


const SearchInput = ({disabled, error, label, placeholder, styles, delay = 300, onSearch, underText, width }: SearchInputProps) => {
    const [value, setValue] = useState("");

    const debouncedSearch = useDebounce((text: string) => {
        onSearch(text);
    }, delay);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        debouncedSearch(e.target.value);
    };

    return(
        <InputWrapper error={error} disabled={disabled} label={label} styles={styles} underText={underText} width={width}>

            <Icon icon={"search"} size={16} />

            <InputStyle
                type="text"
                onChange={handleChange}
                value={value}
                placeholder={placeholder}
                style={styles?.input}
            />
        </InputWrapper>
    )
}

export default SearchInput;
