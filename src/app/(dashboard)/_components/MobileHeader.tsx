"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Icon from "@/components/icons/Icon";
import Modal, { HeaderModal, WrapperModal } from "@/components/modals/Modal";
import SidenavButton from "./SidenavButton";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/stores/userStore";
import MobileProjectSelector from "./MobileProjectSelector";

const MobileHeader = () => {
    const t = useTranslations("sidenav");
    const role = useUserStore(state => state.role);
    const pathname = usePathname();
    const router = useRouter();

    const [showMenu, setShowMenu] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);


    // Si cambió la ruta, cerramos el menú en el mismo render (sin effect)
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setShowMenu(false);
    }

    const openMenu = () => setShowMenu(true);
    const closeMenu = () => setShowMenu(false);

    const goTo = (url: string) => {
        router.push(url)
        closeMenu()
    }

    function goToFromMenu(url: string) {
        // Misma página: no hay navegación, así que cerramos el menú a mano
        if (url === pathname) {
            closeMenu();
            return;
        }

        // replace pisa la entrada de historial que agregó el modal
        router.replace(url);
    }

    return (
        <>
            <Wrapper>
                <LeftSection>
                    <Icon
                        icon="menu"
                        size={24}
                        iconColor="var(--Icons-icon-400)"
                        grab
                        onClick={openMenu}
                    />

                    <MobileProjectSelector />
                </LeftSection>

                <ProfileButton onClick={() => goTo("/settings")}>
                    <Icon
                        icon="profile-circle"
                        size={24}
                        iconColor="var(--Icons-icon-400)"
                    />
                </ProfileButton>
            </Wrapper>

            {showMenu && (
                <Modal onClose={closeMenu} zIndex={1000}>
                    <WrapperModal>
                        <HeaderModal onClose={closeMenu} title="Menu" closeIcon="cancel"
                            styles={{ borderBottom: "1px solid var(--Border-Colors-border-secondary)", paddingBottom: "0.5rem" }}
                        />

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
                            <SidenavButton isExpanded={true} text={t("invoices")} icon="page" onClick={() => goToFromMenu("/invoices")} />
                            <SidenavButton isExpanded={true} text={t("payments")} icon="journal" onClick={() => goToFromMenu("/payments")} />
                            {role === "admin" && <SidenavButton isExpanded={true} text={t("clients")} icon="user" onClick={() => goToFromMenu("/clients")} />}
                            <SidenavButton isExpanded={true} text={t("metrics")} icon="reports" onClick={() => goToFromMenu("/metrics")} />
                            {role === "admin" && <SidenavButton isExpanded={true} text={t("global_metrics")} icon="reports" onClick={() => goToFromMenu("/global-metrics")} />}
                            <SidenavButton isExpanded={true} text={t("settings")} icon="settings" onClick={() => goToFromMenu("/settings")} />
                        </div>

                    </WrapperModal>

                </Modal>
            )}
        </>
    );
};

export default MobileHeader;

const Wrapper = styled.header`
    display: none;

    @media (max-width: 768px) {
        display: flex;
        align-items: center;
        justify-content: space-between;


        height: 56px;
        width: 100%;
        flex-shrink: 0;

        padding: 0 1rem;

        background-color: var(--Background-Colors-bg-secondary);
        border-bottom: 1px solid var(--Border-Colors-border-secondary);
    }
`;


const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
`;

const ProjectName = styled.p`
    color: var(--Text-text-primary);
    font-size: 0.875rem;
    font-weight: 500;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    min-width: 0;
`;

const ProfileButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    padding: 0;
    border: 0;
    background: transparent;

    cursor: pointer;
`;
