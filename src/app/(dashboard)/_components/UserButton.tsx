import styled from "styled-components";

import { useUserStore } from "@/stores/userStore";

import Icon from "@/components/icons/Icon";
import Tooltip from "@/components/Tooltip";

import UserButtonModal from "./UserButtonModal";
import Skeleton from "@/components/Skeleton";

const UserButton = ({ isExpanded }: { isExpanded: boolean }) => {

    return (
        <div style={{ marginTop: "auto" }}>
            <Tooltip theme="transparent" arrow={false} interactive content={<UserButtonModal />}>
                <Wrapper $isExpanded={isExpanded}>
                    <UserImg />

                    {isExpanded && <UserData />}
                </Wrapper>
            </Tooltip>
        </div>
    )
}

export default UserButton;

export const Wrapper = styled.div<{ $isExpanded: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: ${props => props.$isExpanded ? "0.25rem 0.5rem;" : "0.25rem"};
    border: 1px solid var(--Border-Colors-border-secondary);
    border-radius: 0.5rem;
    cursor: pointer;
    background-color: var(--Background-Colors-bg-secondary);

    &:hover {
        background-color: var(--Background-Colors-bg-secondary_hover);
        border: 1px solid var(--Border-Colors-border-secondary_hover);
    }
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

export const UserImg = () => {
    return <Icon icon="user-circle" size={36} iconColor="transparent" fillColor="var(--Icons-icon-400)" grab />;
}

interface UserDataProps {
    showEmail?: boolean;
    showRole?: boolean;
}

export const UserData = ({ showEmail = false, showRole = true }: UserDataProps) => {

    const { fullName, role, email } = useUserStore();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {role ? <Name>{fullName}</Name> : <Skeleton />}
            {!showRole ? null : role ? <Role>{role.charAt(0).toUpperCase() + role.slice(1)}</Role> : <Skeleton />}
            {!showEmail ? null : email ? <Role>{email}</Role> : <Skeleton />}
        </div>
    )
}