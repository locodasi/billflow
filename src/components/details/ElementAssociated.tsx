import styled from "styled-components";

import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation"

import { useFormattedDate } from "@/hooks/useFormattedDate";

import { StatusChip } from "../Chips";

interface ElementAssociatedProps {
    url: string;
    title: string;
    status: string;
    moneyText: string;
    date: string;
    type?: "invoices" | "payments";
}

const ElementAssociated = ({ url, title, status, moneyText, date, type = "invoices" }: ElementAssociatedProps) => {

    const {parseDateToLocaleFormat} = useFormattedDate();

    const t = useTranslations(`${type}.detail.element_associated`);

    const router = useRouter();

    const goToInvoicePage = () => {
        router.push(url);
    }

    return(
        <Wrapper onClick={goToInvoicePage}>
            <div style={{display: "flex", flexDirection: "column"}}>
                <Title>{title}</Title>
                <MoneyText>{moneyText}</MoneyText>
                <DateText>{t('issuedOn', { date: parseDateToLocaleFormat(date) })}</DateText>
            </div>

            <StatusChip status={status} type={type} />
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