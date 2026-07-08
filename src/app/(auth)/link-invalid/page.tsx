// app/auth/link-invalid/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import {useTranslations} from "next-intl";

import { sendSetPasswordEmail_action } from "@/actions/auth";


import TextInput from "@/components/inputs/TextInput";
import Button from "@/components/Button";

export default function LinkInvalidPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const t = useTranslations("login.link-invalid");

    const handleResend = async () => {
        if (!email.trim()) return;
        setLoading(true);
        setError(null);

        const result = await sendSetPasswordEmail_action({ email, isNewAccount: false });
        console.log(result);
        setLoading(false);
        if (!result.success) {
            setError(result.error.message);
            return;
        }
        setSent(true);
    };

    if (sent) {
        return (
            <Modal>
                <div style={{ borderRadius: "50%", background: "var(--Success-500)", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon icon="check" size={24} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Title>{t("sent.title")}</Title>
                    <Subtitle>{t("sent.subtitle")}</Subtitle>
                </div>
            </Modal>
        )
    }

    return (
        <Modal>
            <ChainIcon />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <Title>{t("title")}</Title>
                <Subtitle>{t("subtitle")}</Subtitle>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                <TextInput value={email} onChange={(v) => setEmail(v)} placeholder="tu@gamil.com" />
                <Button
                    onClick={handleResend}
                    disabled={loading || !email.trim()}
                    text={t("send_button")}
                    type="primary"
                    style="filled"
                    size="medium"
                    cssStyles={{ width: "100%" }}
                />

                <Button style="text" text={t("go_back")} onClick={() => router.push("/login")} firstIcon={"arrow-left"} />
            </div>

            {error && <Text style={{ color: "var(--Error-500)" }}>{error}</Text>}
        </Modal>
    );
}

const Modal = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background: var(--Background-Colors-bg-secondary);
    border-radius: 0.5rem;
    border: 1px solid var(--Border-Colors-border-primary);
    gap: 1.5rem;
    max-width: 500px;
`;

const Title = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--Text-text-primary);
`;

const Subtitle = styled.p`
    font-size: 1rem;
    color: var(--Text-text-tertiary);
    font-weight: 500;
`;

const Text = styled.p`
    font-size: 0.75rem;
    color: var(--Text-text-tertiary);
`;

import Icon from "@/components/icons/Icon";

const ChainIcon = () => {
    return (
        <div style={{ borderRadius: "50%", background: "var(--Error-500)", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", transform: "rotate(-45deg)" }}>
            <Icon icon="remove-link" size={24} />
        </div>
    );
};