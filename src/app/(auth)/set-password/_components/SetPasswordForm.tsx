"use client";

import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { supabase } from "@/lib/supabase";

import PasswordInput from "@/components/inputs/PasswordInput";
import Button from "@/components/Button";
import Icon from "@/components/icons/Icon";

type SetPasswordFormProps = {
    name: string;
    isNewAccount: boolean;
};

export default function SetPasswordForm({ name, isNewAccount }: SetPasswordFormProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null); 
    const [loading, setLoading] = useState(false);

    const t = useTranslations("login.set-password");

    const title = isNewAccount ? t("new.title") : t("reset.title");
    const subtitle = isNewAccount
        ? t("new.subtitle", { name })
        : t("reset.subtitle", { name });
    const buttonText = isNewAccount ? t("new.button") : t("reset.button");

    const handleSubmit = async () => {
        setError(null);

        if (password.length < 8) {
            setError(t("errors.length"));
            return;
        }
        if (password !== confirm) {
            setError(t("errors.mismatch"));
            return;
        }

        setLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({ password });

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }

        router.push("/invoices");
    };

    return (
        <Modal>
            <LockIcon />

            <div style={{ display: "flex", flexDirection: "column" }}>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </div>

            <form style={{ gap: "1rem", display: "flex", flexDirection: "column" }} onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <PasswordInput
                    label={t("new_password")}
                    value={password}
                    onChange={(v) => setPassword(v)}
                    placeholder={t("new_password_placeholder")}
                    showToggle
                />
                <PasswordInput
                    label={t("confirm_password")}
                    value={confirm}
                    onChange={(v) => setConfirm(v)}
                    placeholder={t("confirm_password_placeholder")}
                    showToggle
                />

                {error && <Text style={{ color: "var(--Error-500)" }}>{error}</Text>}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <Condition check={password.length >= 8} text={t("validations.length")} />
                    <Condition check={password === confirm && password.length > 0} text={t("validations.mismatch")} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", width: "100%" }}>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || password !== confirm || password.length < 8}
                        text={loading ? t("loading") : buttonText}
                        size="medium"
                        type="primary"
                        buttonType="submit"
                        style="filled"
                        cssStyles={{ width: "100%" }}
                    />

                    <Text>{t("comment")}</Text>
                </div>
            </form>
        </Modal>
    );
}

const Modal = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: var(--Background-Colors-bg-secondary);
    border-radius: 0.5rem;
    border: 1px solid var(--Border-Colors-border-primary);
    gap: 1.5rem;
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

const LockIcon = () => {
    return (
        <div style={{ borderRadius: "50%", background: "var(--Background-Colors-bg-primary)", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
            <Icon icon="lock" />
        </div>
    );
};

const Condition = ({ check, text }: { check: boolean; text: string }) => {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", background: check ? "var(--Success-500)" : "var(--Error-500)" }}></div>
            <Text>{text}</Text>
        </div>
    );
};