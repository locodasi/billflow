"use client";

import styled from "styled-components";

import { useState } from "react";

import Icon from "@/components/icons/Icon";

import SidenavButton from "./SidenavButton";
import UserButton from "./UserButton";

const Sidenav = () => {

    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <Wrapper $isExpanded={isExpanded}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: isExpanded ? "space-between" : "center" }}>
                {isExpanded && <p>Aca van los proyectos</p>}
                <Icon icon={isExpanded ? "sidebar-collapse" : "sidebar-expand"} size={24} iconColor="var(--Icons-icon-400)" grab onClick={() => setIsExpanded(prev => !prev)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                <SidenavButton isExpanded={isExpanded} text="Facturas" icon="page" />
                <SidenavButton isExpanded={isExpanded} text="Recibos" icon="journal" />
                <SidenavButton isExpanded={isExpanded} text="Metricas" icon="reports" />
                <SidenavButton isExpanded={isExpanded} text="Configuracion" icon="settings" />
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