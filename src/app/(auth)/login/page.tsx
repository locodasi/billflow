'use client'

import styled from "styled-components";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/auth";

import TextInput from "@/components/inputs/TextInput";
import PasswordInput from "@/components/inputs/PasswordInput";
import Button from "@/components/Button";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await login(email, password);
            router.push("/invoices");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin();
    }

    return (
        <form onSubmit={handleSubmit} >
            <Container>
                <Title>Iniciar Sesion</Title>
                <TextInput
                    onChange={(value) => setEmail(value)}
                    value={email}
                    placeholder="jhondoe@gamil.com"
                    label="Email"
                    error={error}
                />
                <PasswordInput
                    onChange={(value) => setPassword(value)}
                    value={password}
                    placeholder="********"
                    label="Password"
                    showToggle={true}
                />
                <Button
                    text="Iniciar Sesion"
                    onClick={handleLogin}
                    style="filled"
                    size="medium"
                    type="primary"
                    buttonType="submit"
                    cssStyles={{ width: "100%" }}
                />
            </Container>
        </form>
    )
}

export default Login;

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

const Title = styled.h1`
    align-self: stretch;

    color: var(--Text-text-primary, #FFF);
    text-align: center;

    /* H5/Bold */
    font-family: Inter;
    font-size: 1.75rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2.25rem; /* 128.571% */
    letter-spacing: -0.0175rem;
`;