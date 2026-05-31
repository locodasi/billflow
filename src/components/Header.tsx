import styled from "styled-components";

import { Icons } from "./icons/Icon";
import Button from "./Button";

interface HeaderProps {
    title: string;
    showButton?: boolean;
    buttontext?: string;
    buttonIcon?: Icons;
    onButtonClick?: () => void;
}
const Header = ({ title, showButton, buttontext, buttonIcon, onButtonClick }: HeaderProps) => {

    return (
        <Wrapper>
            <Title>{title}</Title>

            {showButton && <Button size="small" text={buttontext || ""} firstIcon={buttonIcon || "2x2-cell"} onClick={onButtonClick || (() => {})} />}
        </Wrapper>
    )
}

export default Header;

const Wrapper = styled.header`
    width: 100%;
    padding: 1rem;
    background-color: var(--Background-Colors-bg-secondary);
    border-bottom: 1px solid var(--Border-Colors-border-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.h1`
    color: var(--Text-text-primary);
    font-size: 1.5rem;
    font-weight: 600;
`;