"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { useTranslations } from "next-intl";

import Card, { BoldText } from "@/components/card/Card";

type ChartPayloadEntry = {
    dataKey: string;
    value: number;
};


function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: ChartPayloadEntry[]; label?: string }) {
    const t = useTranslations("metrics.diagrams.invoices_per_client");
    if (!active || !payload || !payload.length) return null;

    const paid = payload.find((p: ChartPayloadEntry) => p.dataKey === "paid")?.value ?? 0;
    const owed = payload.find((p: ChartPayloadEntry) => p.dataKey === "owed")?.value ?? 0;
    const total = paid + owed;

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
            <p style={{ margin: "4px 0 0", color: "var(--Success-500)" }}>{t("paid")}: {paid}</p>
            <p style={{ margin: "2px 0 0", color: "var(--Error-500)" }}>{t("pending")}: {owed}</p>
            <p style={{ margin: "4px 0 0", fontWeight: 600, color: "var(--Text-text-secondary)" }}>{t("total")}: {total}</p>
        </div>
    );
}

function InvoicesPerClient({ data }: { data: {
    clientId: string;
    clientName: string;
    owed: number;
    paid: number;
}[] }) {
    const t = useTranslations("metrics.diagrams.invoices_per_client");

    console.log(data)
    return (
        <Card pointer={false} cardStyles={{ flex: 1, minWidth: 0 }}>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <BoldText style={{ marginBottom: 8, fontSize: 16 }}>{t('title')}</BoldText>

                <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                    <div style={{display: "flex", alignItems: "center", gap: 4}}>
                        <div style={{width: 14, height: 14, backgroundColor: "var(--Success-500)", borderRadius: 2}}></div>
                        <span style={{fontSize: 14, color: "var(--Text-text-tertiary)" }}>{t('paid')}</span>
                    </div>

                    <div style={{display: "flex", alignItems: "center", gap: 4}}>
                        <div style={{width: 14, height: 14, backgroundColor: "var(--Error-500)", borderRadius: 2}}></div>
                        <span style={{fontSize: 14, color: "var(--Text-text-tertiary)" }}>{t('pending')}</span>
                    </div>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="1 3" horizontal={false} />
                    <XAxis
                    type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "var(--Text-text-tertiary)" }}
                    />
                    <YAxis
                        type="category"
                        dataKey={"clientName"}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "var(--Text-text-tertiary)" }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#000", opacity: 0.1 }} />
                    <Bar dataKey="paid" stackId="total" fill="#82ca9d" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="owed" stackId="total" fill="#e57373" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}

export default InvoicesPerClient;