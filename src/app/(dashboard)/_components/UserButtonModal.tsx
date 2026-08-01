import styled from "styled-components";

import { useRouter } from "next/navigation";

import {useTranslations} from "next-intl";

import { logout } from "@/lib/auth";

import { useUIStore } from "@/stores/uiStore";

import Tabs, { Tab } from "@/components/Tab";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";

import { UserImg, UserData } from "./UserButton";

const UserButtonModal = () => {

    return (
        <Wrapper>
            <UserWrapper>
                <UserImg />

                <UserData />

                <LogoutButton styles={{ marginLeft: "auto" }} />
            </UserWrapper>

            <ModeWrapper>
                <Modes />
            </ModeWrapper>
        </Wrapper>
    )
}

export default UserButtonModal;

export const LogoutButton = ({ text, styles }: { text?: string, styles?: React.CSSProperties }) => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    if (text) return <Button text={text} onClick={handleLogout} cssStyles={styles} firstIcon={"log-out"} size="small" />;

    return (
        <IconButton icon="log-out" size="extra-small" onClick={handleLogout} personalizeStyle={styles} />
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.25rem 0;
    background-color: var(--Background-Colors-bg-primary);
    border: 1px solid var(--Border-Colors-border-secondary);
    border-radius: 0.5rem;
`;

const UserWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
`;

const ModeWrapper = styled.div`
    padding: 0.5rem;
    border-top: 1px solid var(--Border-Colors-border-secondary);
    border-bottom: 1px solid var(--Border-Colors-border-secondary);
`;

export const Modes = () => {
    const { theme, setTheme } = useUIStore();

    const t = useTranslations("common.theme");

    return (
        <Tabs size="medium">
            <Tab text={t('dark')} onClick={() => setTheme("dark")} firstIcon="half-moon" active={theme === "dark"} />
            <Tab text={t('system')} onClick={() => setTheme("system")} firstIcon="modern-tv" active={theme === "system"} />
            <Tab text={t('light')} onClick={() => setTheme("light")} firstIcon="sun-light" active={theme === "light"} />
        </Tabs>
    )
}
