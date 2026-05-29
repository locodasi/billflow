'use client'

import styled from "styled-components";

import {useState} from "react";

import TextInput from "@/components/inputs/TextInput";
import PasswordInput from "@/components/inputs/PasswordInput";

import Hola from "./_components/Hola";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    return(
        <Wrapper>
            <Container>
                <Hola />
                <TextInput
                    onChange={(value) => setEmail(value)}
                    value={email}
                    placeholder="jhondoe@gamil.com"
                    label="Email"
                />
                <PasswordInput
                    onChange={(value) => setPassword(value)}
                    value={password}
                    placeholder="********"
                    label="Password"
                    showToggle={true}
                />
            </Container>
        </Wrapper>
    )
}

export default Login;

const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--Background-Colors-bg-primary);
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1.5rem;
    background: var(--Background-Colors-bg-secondary);
    padding: 2rem;
    border: 1px solid var(--Border-Colors-border-primary);
    border-radius: 0.5rem;
`;