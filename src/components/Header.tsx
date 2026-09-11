import styled from "styled-components";

import { Icons } from "./icons/Icon";
import Button from "./Button";

import { MobileComponent, DesktopComponent } from "./DiscoverVersions";

interface HeaderProps {
    title: string;
    projectName?: string;
    actions?: React.ReactNode;
    mobileActions?: React.ReactNode;
}

const Header = ({ title, projectName, actions, mobileActions }: HeaderProps) => {

    return (
        <HeaderWrapper>
            <HeaderTitle>
                {title}

                {projectName && (
                    <ProjectName>
                        <Separator>--</Separator> {projectName}
                    </ProjectName>
                )}

            </HeaderTitle>

            <DesktopComponent>
                {actions}
            </DesktopComponent>

            <MobileComponent>
                {mobileActions}
            </MobileComponent>
        </HeaderWrapper>
    )
}

export default Header;

export const HeaderWrapper = styled.header`
    width: 100%;
    padding: 1rem;

    background-color: var(--Background-Colors-bg-secondary);
    border-bottom: 1px solid var(--Border-Colors-border-secondary);

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 1rem;

    @media (max-width: 768px) {
        padding: 0.75rem 1rem;
        min-height: 48px;
    }
`;

export const HeaderTitle = styled.h1`
    color: var(--Text-text-primary);
    font-size: 1.5rem;
    font-weight: 600;

    min-width: 0;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 768px) {
        font-size: 1.125rem;
    }
`;

export const ProjectName = styled.span`
    @media (max-width: 768px) {
        display: none;
    }
`;

export const Separator = styled.span`
    margin: 0 0.25rem;
`;

