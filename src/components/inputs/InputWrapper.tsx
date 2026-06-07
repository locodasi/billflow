'use client'

import styled from "styled-components";

import { InputStylesConfig } from "./types";

const InputWrapper = ({ label, error, disabled, children, styles, underText, width }: {label?: string, error?: string, disabled?: boolean, children?: React.ReactNode, styles?: InputStylesConfig, underText?: string, width?: string}) => {

    return(
        <Wrapper style={{width: width || '100%'}}>
            {label && <Label>{label}</Label>}

            <InputWrapperStyle $error={!!error} style={{ ...styles?.wrapper, opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
                {children}
            </InputWrapperStyle>

            {underText && (
                <UnderText style={styles?.underText}>{underText}</UnderText>
            )}

            {error && (
                <Errorwrapper>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9ZM9.5625 5.25C9.5625 4.93934 9.31066 4.6875 9 4.6875C8.68934 4.6875 8.4375 4.93934 8.4375 5.25V9.75C8.4375 10.0607 8.68934 10.3125 9 10.3125C9.31066 10.3125 9.5625 10.0607 9.5625 9.75V5.25ZM9.4256 13.1255C9.63342 12.8946 9.61471 12.5389 9.38379 12.3311C9.15288 12.1232 8.79722 12.142 8.5894 12.3729L8.5819 12.3812C8.37408 12.6121 8.39279 12.9678 8.62371 13.1756C8.85462 13.3834 9.21028 13.3647 9.4181 13.1338L9.4256 13.1255Z" fill="#F62C2C" />
                    </svg>
                    <ErrorText>{error}</ErrorText>
                </Errorwrapper>
            )}
        </Wrapper>
    )
}

export default InputWrapper;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--padding-4, 0.25rem);
    min-width: 0;
    width: 100%;
`;

export const Label = styled.p`
    color: var(--Text-text-secondary, #344051);
    text-shadow: 0px 1px 2px rgba(20, 28, 36, 0.04);

    /* Paragraph S/Medium */
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem; /* 142.857% */
`;

export const InputWrapperStyle = styled.div<{ $error?: boolean}>`
    display: flex;
    padding: var(--padding-8, 0.5rem) var(--padding-8, 0.5rem) var(--padding-8, 0.5rem) var(--padding-12, 0.75rem);
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    gap: 0.25rem;

    border-radius: var(--radius-m, 0.625rem);
    border: 1px solid var(--Border-Colors-border-secondary, #E4E7EC);
    background: var(--Background-Colors-bg-primary, #FFF);

    /* Effects/Shadows/button-shadow-base */
    box-shadow: 0px 1px 2px 0px rgba(21, 28, 36, 0.05);

    ${({ $error }) => $error && `
        border: 1px solid var(--Error-500, #FF4D4D);
    `}

    &:hover {
        border: 1px solid var(--Border-Colors-border-secondary_hover, #344051);
    }
    
    &:focus{
        border: 1px solid var(--Foreground-Colors-foreground-01, #FFF);
        /* Effects/Focus State/Base */
        box-shadow: 0px 0px 0px 2px rgba(99, 112, 131, 0.15);
    }
`;

const Errorwrapper = styled.div`
    display: flex;
    align-items: center;
    gap: var(--4, 0.25rem);
`;

const UnderText = styled.p`
    color: var(--Text-text-tertiary, #637083);

    /* Paragraph S/Regular */
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem; /* 142.857% */
`;

const ErrorText = styled.p`
    color: var(--Error-600, #F62C2C);
    text-shadow: 0px 1px 2px rgba(20, 28, 36, 0.04);

    /* Paragraph S/Regular */
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.25rem; /* 142.857% */
`;

export const InputStyle = styled.input`
    display: flex;
    padding: var(--padding-none, 0rem);
    align-items: center;
    gap: var(--8, 0.5rem);
    flex: 1 0 0;
    background: transparent;
    border: none;
    outline: none;

    color: var(--Text-text-primary, #637083);

    /* Paragraph M/Regular */
    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 150% */

    &::placeholder {
        color: var(--Text-text-tertiary, #637083);
    }
`;