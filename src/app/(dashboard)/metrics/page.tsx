"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";

import { useProjectsStore } from "@/stores/projectStore";

import { HeaderTitle, HeaderWrapper } from "@/components/Header";
import Chips from "@/components/Chips";
import Card, { TwoRowData } from "@/components/card/Card";

import InvoicesPerState from "./components/InvoicesPerState";
import InvoicesVsPayments from "./components/InvoicesVsPayments";


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

                <div style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'nowrap' }}>

                    <InvoicesPerState data={[
                        { mes: "Enero", pagado: 2400, adeudado: 400 },
                        { mes: "Febrero", pagado: 1398, adeudado: 300 },
                        { mes: "Marzo", pagado: 9800, adeudado: 200 },
                        { mes: "Abril", pagado: 3908, adeudado: 100 },
                        { mes: "Mayo", pagado: 4800, adeudado: 50 },
                        { mes: "Junio", pagado: 3800, adeudado: 20 },
                    ]} />

                    <InvoicesVsPayments data={[
                        { mes: "Enero", ventas2024: 4000, ventas2025: 3500 },
                        { mes: "Febrero", ventas2024: 3000, ventas2025: 2800 },
                        { mes: "Marzo", ventas2024: 2000, ventas2025: 2500 },
                        { mes: "Abril", ventas2024: 2780, ventas2025: 3000 },
                        { mes: "Mayo", ventas2024: 1890, ventas2025: 2000 },
                        { mes: "Junio", ventas2024: 2390, ventas2025: 2200 },
                    ]} />
                </div>

                <Card pointer={false}>
                    <TwoRowData normalText={t('data_cards.monthly_average.title')} boldText={`USD 300 / ${t('data_cards.monthly_average.month')}`} reverse />
                </Card>
            </div>


        </>
    )
}

export default MetricsPage;



