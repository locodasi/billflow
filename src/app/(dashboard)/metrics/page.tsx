"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";

import { useProjectsStore } from "@/stores/projectStore";

import { HeaderTitle, HeaderWrapper } from "@/components/Header";
import Chips from "@/components/Chips";
import Card, { TwoRowData } from "@/components/card/Card";

const TEMPORAL_CHIPS = ["month", "quarter", "year"];
const FILL_ROW_CARD_STYLES: React.CSSProperties = { flex: 1, minWidth: 0 };

const MetricsPage = () => {
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
                    <TwoRowData normalText={t('data_cards.monthly_average.title')} boldText={`USD 300 / ${t('data_cards.monthly_average.month')}`} reverse />
                </Card>
            </div>


        </>
    )
}

export default MetricsPage; 