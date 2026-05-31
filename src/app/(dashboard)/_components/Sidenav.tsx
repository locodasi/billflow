"use client";

import styled from "styled-components";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useUserStore } from "@/stores/userStore";

import Icon from "@/components/icons/Icon";

import SidenavButton from "./SidenavButton";
import UserButton from "./UserButton";
import SelectProject from "./SelectProject";


const Sidenav = () => {

    const role = useUserStore(state => state.role);

    const [isExpanded, setIsExpanded] = useState(true);

    const router = useRouter();

    const goTo = (url: string) => {
        router.push(url);
    }

    return (
        <Wrapper $isExpanded={isExpanded}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: isExpanded ? "space-between" : "center" }}>
                {isExpanded && <SelectProject />}
                <Icon icon={isExpanded ? "sidebar-collapse" : "sidebar-expand"} size={24} iconColor="var(--Icons-icon-400)" grab onClick={() => setIsExpanded(prev => !prev)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <SidenavButton isExpanded={isExpanded} text="Facturas" icon="page" onClick={() => goTo("/invoices")} />
                <SidenavButton isExpanded={isExpanded} text="Recibos" icon="journal" onClick={() => goTo("/payments")} />
                {role === "admin" && <SidenavButton isExpanded={isExpanded} text="Clientes" icon="user" onClick={() => goTo("/clients")} />}
                <SidenavButton isExpanded={isExpanded} text="Metricas" icon="reports" onClick={() => goTo("/metrics")} />
                {role === "admin" && <SidenavButton isExpanded={isExpanded} text="Metricas globales" icon="reports" onClick={() => goTo("/global-metrics")} />}
                <SidenavButton isExpanded={isExpanded} text="Configuracion" icon="settings" onClick={() => goTo("/settings")} />
            </div>

            <UserButton isExpanded={isExpanded} />
        </Wrapper>
    )
};

export default Sidenav;

const Wrapper = styled.div<{ $isExpanded: boolean }>`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: ${props => (props.$isExpanded ? "250px" : "80px")};
    padding: 1rem;
    background-color: var(--Background-Colors-bg-secondary);
    border: 1px solid var(--Border-Colors-border-secondary);
    transition: width 0.7s ease;
    gap: 1rem;
`;

