"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { useTranslations } from "next-intl";

import Card, { BoldText } from "@/components/card/Card";

type ChartPayloadEntry = {
    dataKey: string;
    value: number;
};


function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: ChartPayloadEntry[]; label?: string }) {
    const t = useTranslations("metrics.diagrams.invoices_vs_payments");
    if (!active || !payload || !payload.length) return null;

    const invoiced = payload.find((p: ChartPayloadEntry) => p.dataKey === "invoiced")?.value ?? 0;
    const paid = payload.find((p: ChartPayloadEntry) => p.dataKey === "paid")?.value ?? 0;
    const outstanding = invoiced - paid;

    return (
        <div
            style={{
                background: "var(--Background-Colors-bg-tertiary)",
                border: "1px solid var(--Border-Colors-border-tertiary)",
                borderRadius: 8,
                padding: "8px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontSize: 14,
            }}
        >
            <p style={{ margin: 0, fontWeight: 600, color: "var(--Text-text-primary)" }}>{label}</p>
            <p style={{ margin: "4px 0 0", color: "var(--Primary-500)" }}>{t("invoiced")}: {invoiced}</p>
            <p style={{ margin: "2px 0 0", color: "var(--Violet-500)" }}>{t("payment")}: {paid}</p>
            <p style={{ margin: "4px 0 0", fontWeight: 600, color: "var(--Text-text-secondary)" }}>{t("outstanding")}: {outstanding.toFixed(2)}</p>
        </div>
    );
}


function InvoicesVsPayments({ data }: { data: { month: string; invoiced: number; paid: number }[] }) {
    const t = useTranslations("metrics.diagrams.invoices_vs_payments");
    return (
        <Card pointer={false} cardStyles={{ flex: 1, minWidth: 0 }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <BoldText style={{ marginBottom: 8, fontSize: 16 }}>{t('title')}</BoldText>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 14, height: 14, backgroundColor: "var(--Primary-500)", borderRadius: 2 }}></div>
                        <span style={{ fontSize: 14, color: "var(--Text-text-tertiary)" }}>{t('invoiced')}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 14, height: 14, backgroundColor: "var(--Violet-500)", borderRadius: 2 }}></div>
                        <span style={{ fontSize: 14, color: "var(--Text-text-tertiary)" }}>{t('payment')}</span>
                    </div>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300} style={{ overflow: "hidden" }}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="1 3" />
                    <XAxis
                        dataKey="month"
                        padding={{ left: 20, right: 20 }}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 16, fill: "var(--Text-text-tertiary)", fontFamily: "inherit" }}
                    />
                    <YAxis
                        padding={{ bottom: 20, top: 20 }}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 16, fill: "var(--Text-text-tertiary)", fontFamily: "inherit" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="invoiced" stroke="var(--Primary-500)" strokeWidth={2} />
                    <Line type="monotone" dataKey="paid" stroke="var(--Violet-500)" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
            </ResponsiveContainer>

        </Card>
    );
}
export default InvoicesVsPayments;