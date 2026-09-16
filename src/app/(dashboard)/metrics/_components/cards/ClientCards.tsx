"use client";

import { useTranslations } from "next-intl";

import { useProjectsStore } from "@/stores/projectStore";

import Card, { TwoRowData } from "@/components/card/Card"
import { getDeltaDisplay } from "@/lib/period";
import Icon from "@/components/icons/Icon";

const FILL_ROW_CARD_STYLES: React.CSSProperties = {
    flex: "1 1 200px",
    minWidth: 0,
};

const ClientCards = ({ invoiced, payed, totalInvoices, averagePerMonth, prevInvoiced, prevPayed, prevTotalInvoices }: { invoiced: number, payed: number, totalInvoices: number, averagePerMonth: number, prevInvoiced: number, prevPayed: number, prevTotalInvoices: number }) => {

    const t = useTranslations('metrics');

    const currency = useProjectsStore(s => s.project?.currency);

    return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                <TwoRowData normalText={t('data_cards.invoiced.title')} boldText={`${currency} ${invoiced}`} reverse />
                <DeltaBadge current={invoiced} previous={prevInvoiced} currency={currency} />

            </Card>

            <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                <TwoRowData normalText={t('data_cards.paid.title')} boldText={`${currency} ${payed}`} reverse />
                <DeltaBadge current={payed} previous={prevPayed} currency={currency} />

            </Card>

            <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                <TwoRowData normalText={t('data_cards.total_invoices.title')} boldText={`${totalInvoices}`} reverse />
                <DeltaBadge current={totalInvoices} previous={prevTotalInvoices}/>
            </Card>

            <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                <TwoRowData normalText={t('data_cards.monthly_average.title')} boldText={`${currency} ${averagePerMonth} / ${t('data_cards.monthly_average.month')}`} reverse />
            </Card>
        </div>
    )
}

export default ClientCards;

function DeltaBadge({ current, previous, currency }: { current: number; previous: number; currency?: string }) {
    const display = getDeltaDisplay(current, previous);
    const t = useTranslations('metrics.data_cards.delta_badge');

    if (display.kind === "equal") {
        return <span style={{ fontSize: 14, color: "var(--Text-text-tertiary)" }}>= {t('equal')}</span>;
    }

    const color = display.isUp ? "var(--Success-500)" : "var(--Error-500)";

    if (display.kind === "percent") {
        return (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <Icon icon={display.isUp ? "arrow-up" : "arrow-down"} size={14} iconColor={color} />
                <span style={{ fontSize: 14, fontWeight: 500, color }}>{display.value}% {t("diff")}</span>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color }}>{display.isUp ? "+" : "-"} {currency ?? ""} {display.value} {t("diff")}</span>
        </div>
    );
}