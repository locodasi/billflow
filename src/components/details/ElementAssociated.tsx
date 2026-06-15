import styled from "styled-components";

import { useRouter } from "next/navigation"

import { parseDateToLocaleFormat } from "@/utils/timeFunctions";

import { StatusChip } from "../Chips";

interface ElementAssociatedProps {
    url: string;
    title: string;
    status: string;
    moneyText: string;
    date: string;
}

const ElementAssociated = ({ url, title, status, moneyText, date }: ElementAssociatedProps) => {

    const router = useRouter();

    const goToInvoicePage = () => {
        router.push(url);
    }

    return(
        <Wrapper onClick={goToInvoicePage}>
            <div style={{display: "flex", flexDirection: "column"}}>
                <Title>{title}</Title>
                <MoneyText>{moneyText}</MoneyText>
                <DateText>Emitida {parseDateToLocaleFormat(date)}</DateText>
            </div>

            <StatusChip status={status} text={status} />
        </Wrapper>
    )
}

export default ElementAssociated;

const Wrapper = styled.div`
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--Background-Colors-bg-secondary);
    cursor: pointer;
    border-radius: 0.5rem;

    &:hover {
        background-color: var(--Background-Colors-bg-secondary_hover);
    }
`;

const Title = styled.p`
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--Text-text-primary);
`;

const MoneyText = styled.p`
    font-size: 0.875rem;
    font-weight: 400;
    color: var(--Text-text-secondary);
`;

const DateText = styled.p`
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--Text-text-tertiary);
`;