"use client";

import styled from "styled-components";

import { useTranslations } from "next-intl";

import { Language, useUserStore } from "@/stores/userStore";

import Header from "@/components/Header";
import NormalSelect from "@/components/Select";
import Switch, {Subtitle, TextWrapper, Title} from "@/components/Switch";

import { UserData, UserImg } from "../_components/UserButton";
import { LogoutButton, Modes } from "../_components/UserButtonModal";
import { LANGUAGE_OPTIONS } from "../clients/_components/NewClientModal";
import { updateUserLanguage } from "./actions";

const SettingsPage = () => {

    const language = useUserStore(s => s.language);
    const setLanguage = useUserStore(s => s.setLanguage);

    const t = useTranslations("settings");

    const handleLanguageChange = async (value: string) => {
        setLanguage(value as Language);
        await updateUserLanguage(value as Language);
    }


    return (
        <>
            <Header title={t("header")} />

            <SectionWrapper >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
                    <UserImg />
                    <UserData showEmail showRole={false} />
                    <LogoutButton text={t("log-out")} styles={{ marginLeft: "auto" }} />
                </div>
            </SectionWrapper>

            <Section title={t("appearance.header")} description={t("appearance.text")}>
                <div>
                    <Modes />
                </div>
            </Section>

            <Section title={t("language.header")} description={t("language.text")}>
                <NormalSelect
                    options={LANGUAGE_OPTIONS}
                    value={LANGUAGE_OPTIONS.find(option => option.value === language) || null}
                    onChange={(selectedOption) => handleLanguageChange(selectedOption.value)}
                />
            </Section>

            <Section title={t("notifications.header")} description={t("notifications.text")} last>
                <Switch type="primary" isOn disabled handleToggle={() => { }} right={false} styles={{justifyContent: "space-between"}}>
                    <TextWrapper>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <Title>{t("notifications.new-invoice.header")}</Title>
                            <Soon />
                        </div>
                        <Subtitle>{t("notifications.new-invoice.text")}</Subtitle>
                    </TextWrapper>
                </Switch>

                <Switch type="primary" isOn disabled handleToggle={() => { }} right={false} styles={{justifyContent: "space-between"}}>
                    <TextWrapper>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <Title>{t("notifications.payload-approved.header")}</Title>
                            <Soon />
                        </div>
                        <Subtitle>{t("notifications.payload-approved.text")}</Subtitle>
                    </TextWrapper>
                </Switch>

                <Switch type="primary" isOn disabled handleToggle={() => { }} right={false} styles={{justifyContent: "space-between"}}>
                    <TextWrapper>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <Title>{t("notifications.payload-rejected.header")}</Title>
                            <Soon />
                        </div>
                        <Subtitle>{t("notifications.payload-rejected.text")}</Subtitle>
                    </TextWrapper>
                </Switch>
            </Section>
        </>
    )
}

export default SettingsPage;

const Soon = () => {

    const t = useTranslations("settings");

    return(
        <div style={{padding: "0 0.25rem", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "0.5rem", backgroundColor: "var(--Background-Colors-bg-secondary)"}}>
            <p style={{fontSize: "0.875rem", color: "var(--Text-text-tertiary)"}}>{t("notifications.soon")}</p>
        </div>
    )
}

const Section = ({ title, description, last = false, children }: { title: string, description: string, last?: boolean, children: React.ReactNode }) => {

    return (
        <SectionWrapper $last={last}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                <SectionTitle>{title}</SectionTitle>
                <SectionDescription>{description}</SectionDescription>
            </div>
            {children}
        </SectionWrapper>
    )
}

const SectionWrapper = styled.div<{ $last?: boolean }>`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-bottom: ${props => props.$last ? "none" : "1px solid var(--Border-Colors-border-secondary)"};
`;

const SectionTitle = styled.p`
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--Text-text-primary);
    line-height: 1rem;
`;

const SectionDescription = styled.p`
    font-size: 0.875rem;
    color: var(--Text-text-tertiary);
    font-weight: 400;
`;