"use client";

import { useTranslations } from "next-intl";

import { Fragment, useState } from "react";

import { useProjectsStore } from "@/stores/projectStore";

import { HeaderTitle, HeaderWrapper } from "@/components/Header";
import Chips from "@/components/Chips";
import Card, { BoldText, TwoRowData } from "@/components/card/Card";

const TEMPORAL_CHIPS = ["month", "quarter", "year"];
const FILL_ROW_CARD_STYLES: React.CSSProperties = { flex: 1, minWidth: 0 };
const TABLE_COLUMNS = "minmax(0, 1.4fr) minmax(0, 1fr) max-content";

const TABLE_GRID_STYLE: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: TABLE_COLUMNS,
    columnGap: "1rem",
    marginTop: "0.5rem",
    alignItems: "center",
};

const TABLE_HEADER_CELL_STYLE: React.CSSProperties = {
    color: "var(--Text-text-tertiary)",
    fontSize: "0.75rem",
    fontWeight: 500,
    margin: 0,
    padding: "0.5rem 0",
};

const TABLE_ROW_CELL_STYLE: React.CSSProperties = {
    padding: "0.75rem 0",
};

const TABLE_DIVIDER_STYLE: React.CSSProperties = {
    gridColumn: "1 / -1",
    borderBottom: "1px solid var(--Border-Colors-border-secondary)",
};

const TABLE_CELL_TEXT_STYLE: React.CSSProperties = {
    color: "var(--Text-text-primary)",
    fontSize: "0.9rem",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

const STATUS_COLORS = {
    slow: "var(--Error-600)",
    normal: "var(--Warning-600)",
    fast: "var(--Success-600)",
} as const;

type PaymentStatus = keyof typeof STATUS_COLORS;

const getStatusBadgeStyle = (status: PaymentStatus): React.CSSProperties => {
    const base = STATUS_COLORS[status];

    return {
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", 
        padding: "0.25rem 0.6rem",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: 500,
        lineHeight: 1,
        color: `color-mix(in srgb, ${base} 88%, white 12%)`,
        background: `color-mix(in srgb, ${base} 16%, transparent)`,
        border: `1px solid color-mix(in srgb, ${base} 45%, transparent)`,
    };
};


const PAYMENT_TIME_ROWS: Array<{ payer: string; averageDays: string; status: PaymentStatus }> = [
    {
        payer: "Acme Corp",
        averageDays: "9",
        status: "fast",
    },
    {
        payer: "Northwind",
        averageDays: "14",
        status: "normal"
    },
    {
        payer: "Globex",
        averageDays: "22",
        status: "slow"
    },
];

const GlobalMetricsPage = () => {
    const t = useTranslations('metrics');
    const projectName = useProjectsStore(s => s.project?.name);

    const [selectedTemporalChip, setSelectedTemporalChip] = useState<string>(TEMPORAL_CHIPS[0]);

    return (
        <>
            <HeaderWrapper>
                <HeaderTitle>{`${t('header')} -- ${projectName}`}</HeaderTitle>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Chips
                        items={TEMPORAL_CHIPS.map(chip => ({ text: t(`temporal_chips.${chip}`), value: chip }))}
                        selected={selectedTemporalChip}
                        onClick={v => setSelectedTemporalChip(v)}
                    />
                </div>
            </HeaderWrapper>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
                    <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                        <TwoRowData normalText={t('data_cards.invoiced.title')} boldText={"USD 4800"} reverse />
                    </Card>

                    <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                        <TwoRowData normalText={t('data_cards.paid.title')} boldText={"USD 4800"} reverse />
                    </Card>

                    <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                        <TwoRowData normalText={t('data_cards.total_invoices.title')} boldText={"35"} reverse />
                    </Card>

                    <Card pointer={false} cardStyles={FILL_ROW_CARD_STYLES}>
                        <TwoRowData normalText={t('data_cards.clients.title')} boldText={"3"} reverse />
                    </Card>
                </div>

                <Card pointer={false}>
                    <div>
                        DIAGRAMA
                    </div>
                </Card>

                <Card pointer={false}>
                    <div>
                        DIAGRAMA
                    </div>
                </Card>

                <Card pointer={false}>
                    <BoldText>{t("diagrams.time_of_pay.title")}</BoldText>
                    <div style={TABLE_GRID_STYLE}>
                        <p style={TABLE_HEADER_CELL_STYLE}>{t("diagrams.time_of_pay.clients")}</p>
                        <p style={TABLE_HEADER_CELL_STYLE}>{t("diagrams.time_of_pay.average")}</p>
                        <p style={{ ...TABLE_HEADER_CELL_STYLE}}>{t("diagrams.time_of_pay.status.title")}</p>
                        <div style={TABLE_DIVIDER_STYLE} />

                        {PAYMENT_TIME_ROWS.map((row, index) => {
                            const isLastRow = index === PAYMENT_TIME_ROWS.length - 1;

                            return (
                                <Fragment key={`${row.payer}-${index}`}>
                                    <p
                                        style={{ ...TABLE_CELL_TEXT_STYLE, ...TABLE_ROW_CELL_STYLE }}
                                    >
                                        {row.payer}
                                    </p>
                                    <p
                                        style={{ ...TABLE_CELL_TEXT_STYLE, ...TABLE_ROW_CELL_STYLE }}
                                    >
                                        {row.averageDays} {t("diagrams.time_of_pay.days")}
                                    </p>
                                    <div
                                        style={{ ...TABLE_ROW_CELL_STYLE }}
                                    >
                                        <span style={getStatusBadgeStyle(row.status)}>
                                            {t(`diagrams.time_of_pay.status.${row.status}`)}
                                        </span>
                                    </div>
                                    {!isLastRow && <div style={TABLE_DIVIDER_STYLE} />}
                                </Fragment>
                            );
                        })}
                    </div>
                </Card>


            </div>


        </>
    )
}

export default GlobalMetricsPage; 