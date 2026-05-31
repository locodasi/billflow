import styled from "styled-components";

import {useRouter} from "next/navigation";

import { logout } from "@/lib/auth";

import { useUIStore } from "@/stores/uiStore";

import Tabs, { Tab } from "@/components/Tab";
import IconButton from "@/components/IconButton";

import { UserImg, UserData } from "./UserButton";

const UserButtonModal = () => {

    const { theme, setTheme } = useUIStore();

    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }
    
    return (
        <Wrapper>
            <UserWrapper>
                <UserImg />

                <UserData />

                <IconButton icon="log-in" size="extra-small" onClick={handleLogout} personalizeStyle={{marginLeft: "auto"}}/>
            </UserWrapper>

            <ModeWrapper>
                <Tabs size="medium">
                    <Tab text="Oscuro" onClick={() => setTheme("dark")} firstIcon="half-moon"  active={theme === "dark"} />
                    <Tab text="Sistema" onClick={() => setTheme("system")} firstIcon="modern-tv" active={theme === "system"} />
                    <Tab text="Claro" onClick={() => setTheme("light")} firstIcon="sun-light" active={theme === "light"} />
                </Tabs>
            </ModeWrapper>
        </Wrapper>
    )
}

export default UserButtonModal;

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

const Name = styled.p`
    color: var(--Text-text-primary);
    font-size: 1rem;
    font-weight: 500;
`;

const Role = styled.p`
    color: var(--Text-text-tertiary);
    font-size: 0.875rem;
    font-weight: 400;
`;

const ModeWrapper = styled.div`
    padding: 0.5rem;
    border-top: 1px solid var(--Border-Colors-border-secondary);
    border-bottom: 1px solid var(--Border-Colors-border-secondary);
`;