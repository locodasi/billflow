"use client";

import { useTranslations } from "next-intl";

import {useProjectsStore} from "@/stores/projectStore";

import Card, { TwoRowData } from "@/components/card/Card"

const FILL_ROW_CARD_STYLES: React.CSSProperties = { flex: 1, minWidth: 0 };

const ClientCards = ({ invoiced, payed, totalInvoices, averagePerMonth }: { invoiced: number, payed: number, totalInvoices: number, averagePerMonth: number }) => {

    const t = useTranslations('metrics');

    const currency = useProjectsStore(s => s.project?.currency);

    return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
            <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                <TwoRowData normalText={t('data_cards.invoiced.title')} boldText={`${currency} ${invoiced}`} reverse />
            </Card>

            <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                <TwoRowData normalText={t('data_cards.paid.title')} boldText={`${currency} ${payed}`} reverse />
            </Card>

            <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                <TwoRowData normalText={t('data_cards.total_invoices.title')} boldText={`${totalInvoices}`} reverse />
            </Card>

            <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                <TwoRowData normalText={t('data_cards.monthly_average.title')} boldText={`${currency} ${averagePerMonth} / ${t('data_cards.monthly_average.month')}`} reverse />
            </Card>
        </div>
    )
}

export default ClientCards;