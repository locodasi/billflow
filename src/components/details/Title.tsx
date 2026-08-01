import styled from "styled-components";

import { StatusChip } from "../Chips";

const Title = ({text, status, type}: {text: string, status: string, type: "invoices" | "payments"}) => {

    return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <TitleStyle>{text}</TitleStyle>
            <StatusChip status={status.toLowerCase()} type={type} />
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