"use client";

import styled from "styled-components";

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

    const handleLanguageChange = async (value: string) => {
        setLanguage(value as Language);
        await updateUserLanguage(value as Language);
    }


    return (
        <>
            <Header title="Configuracion" />

            <SectionWrapper >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
                    <UserImg />
                    <UserData showEmail showRole={false} />
                    <LogoutButton text="Cerrar sesión" styles={{ marginLeft: "auto" }} />
                </div>
            </SectionWrapper>

            <Section title="Apariencia" description="Elegí cómo se ve la aplicación">
                <div>
                    <Modes />
                </div>
            </Section>

            <Section title="Idioma" description="Idioma de la interfaz">
                <NormalSelect
                    options={LANGUAGE_OPTIONS}
                    value={LANGUAGE_OPTIONS.find(option => option.value === language) || null}
                    onChange={(selectedOption) => handleLanguageChange(selectedOption.value)}
                    placeholder="Selecciona un idioma"
                />
            </Section>

            <Section title="Notificaciones por email" description="Elegí cuándo querés recibir un correo" last>
                <Switch type="primary" isOn disabled handleToggle={() => { }} right={false} styles={{justifyContent: "space-between"}}>
                    <TextWrapper>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <Title>Nueva factura cargada</Title>
                            <Soon />
                        </div>
                        <Subtitle>Te avisamos cuando se carga una factura nueva</Subtitle>
                    </TextWrapper>
                </Switch>

                <Switch type="primary" isOn disabled handleToggle={() => { }} right={false} styles={{justifyContent: "space-between"}}>
                    <TextWrapper>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <Title>Recibo aprobado</Title>
                            <Soon />
                        </div>
                        <Subtitle>Te avisamos cuando se aprueba tu pago</Subtitle>
                    </TextWrapper>
                </Switch>

                <Switch type="primary" isOn disabled handleToggle={() => { }} right={false} styles={{justifyContent: "space-between"}}>
                    <TextWrapper>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <Title>Recibo rechazado</Title>
                            <Soon />
                        </div>
                        <Subtitle>Te avisamos cuando se rechaza tu pago</Subtitle>
                    </TextWrapper>
                </Switch>
            </Section>
        </>
    )
}

export default SettingsPage;

const Soon = () => {
    return(
        <div style={{padding: "0 0.25rem", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "0.5rem", backgroundColor: "var(--Background-Colors-bg-secondary)"}}>
            <p style={{fontSize: "0.875rem", color: "var(--Text-text-tertiary)"}}>Próximamente</p>
        </div>
    )
}

const Section = ({ title, description, last = false, children }: { title: string, description: string, last?: boolean, children: React.ReactNode }) => {

    return (
        <SectionWrapper $last={last}>
            <div style={{ display: "flex", flexDirection: "column" }}>
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