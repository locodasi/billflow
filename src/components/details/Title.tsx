import styled from "styled-components";

import { StatusChip } from "../Chips";

const Title = ({text, status, type}: {text: string, status: string, type: "invoice" | "payment"}) => {

    return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <TitleStyle>{text}</TitleStyle>
            <StatusChip type={type} status={status.toLowerCase()} />
        </div>
    )
}

export default Title;

const TitleStyle = styled.p`
    color: var(--Text-text-primary, #344051);
    font-family: Inter;
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.5rem; /* 150% */
`;