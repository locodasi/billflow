"use client";

import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useProjectsStore } from "@/stores/projectStore";
import Icon from "@/components/icons/Icon";
import Modal, { HeaderModal, WrapperModal } from "@/components/modals/Modal";
import SidenavButton from "./SidenavButton";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/stores/userStore";
import MobileProjectSelector from "./MobileProjectSelector";

const MobileHeader = () => {
    const project = useProjectsStore(state => state.project);
    const t = useTranslations("sidenav");
    const role = useUserStore(state => state.role);

    const [showMenu, setShowMenu] = useState(false);

    const router = useRouter();

    const openMenu = () => setShowMenu(true);
    const closeMenu = () => setShowMenu(false);

    const goTo = (url: string) => {
        router.push(url)
        closeMenu()
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

                <ProfileButton onClick={()=>goTo("/settings")}>
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
                            <SidenavButton isExpanded={true} text={t("invoices")} icon="page" onClick={() => goTo("/invoices")} />
                            <SidenavButton isExpanded={true} text={t("payments")} icon="journal" onClick={() => goTo("/payments")} />
                            {role === "admin" && <SidenavButton isExpanded={true} text={t("clients")} icon="user" onClick={() => goTo("/clients")} />}
                            <SidenavButton isExpanded={true} text={t("metrics")} icon="reports" onClick={() => goTo("/metrics")} />
                            {role === "admin" && <SidenavButton isExpanded={true} text={t("global_metrics")} icon="reports" onClick={() => goTo("/global-metrics")} />}
                            <SidenavButton isExpanded={true} text={t("settings")} icon="settings" onClick={() => goTo("/settings")} />
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

        position: sticky;
        top: 0;
        z-index: 100;

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
