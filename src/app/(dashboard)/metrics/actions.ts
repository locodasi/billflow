'use server'
import { Locale } from "next-intl";

import { createServerClient } from "@/lib/supabase.server";
import { getPeriodRange, type Period } from "@/lib/period";
import { getCurrentProjectId } from "@/lib/project-cookies";
import { getUserLocale } from "@/lib/locale";

const roundToTwo = (value: number) => Number(value.toFixed(2));

export async function getCardsValue(period: Period, offset: number = 0) {
    const { startUtc, endUtc } = getPeriodRange(period, offset);
    const { startUtc: prevStartUtc, endUtc: prevEndUtc } = getPeriodRange(period, offset + 1);

    const supabase = await createServerClient();
    const projectId = await getCurrentProjectId();

    if (!projectId) {
        return {
            invoiced: 0, payed: 0, totalInvoices: 0, averagePerMonth: 0,
            prevInvoiced: 0, prevPayed: 0, prevTotalInvoices: 0
        };
    }

    const { data, error } = await supabase
        .rpc("get_cards_metrics", {
            p_project_id: projectId,
            p_start: startUtc,
            p_end: endUtc,
            p_prev_start: prevStartUtc,
            p_prev_end: prevEndUtc,
        })
        .single();

    if (error) throw new Error(`Error al obtener KPIs: ${error.message}`);

    const invoiced = Number(data.invoiced);
    const payed = Number(data.payed);
    const totalInvoices = data.total_invoices;
    const prevInvoiced = Number(data.prev_invoiced);
    const prevPayed = Number(data.prev_payed);

    const averagePerMonth = period === "month" ? invoiced : invoiced / (period === "quarter" ? 3 : 12);

    return {
        invoiced,
        payed,
        totalInvoices,
        averagePerMonth: roundToTwo(averagePerMonth),
        prevInvoiced,
        prevPayed,
        prevTotalInvoices: data.prev_total_invoices,
    };
}

function formatBucketLabel(bucketIso: string, granularity: "week" | "month", locale: Locale) {
    const date = new Date(bucketIso);
    return granularity === "week"
        ? date.toLocaleDateString(locale, { day: "numeric", month: "short" })
        : date.toLocaleDateString(locale, { month: "short" });
}

export type InvoiceMetricBucket = {
    bucket: string;
    invoiced: number;
    paid: number;
    pending: number;
    outstanding: number;
    invoiced_cumulative: number;
    paid_cumulative: number;
};

export async function getChartsValue(period: Period, offset: number = 0) {
    const { startUtc, endUtc, granularity } = getPeriodRange(period, offset);

    const supabase = await createServerClient();
    const projectId = await getCurrentProjectId();
    const locale = await getUserLocale();

    if (!projectId) return { barData: [], lineData: [] };

    const { data, error } = await supabase
        .rpc("get_project_charts_metrics", {
            p_project_id: projectId,
            p_start: startUtc,
            p_end: endUtc,
            p_granularity: granularity,
        })

    if (error) throw new Error(`Error al obtener KPIs: ${error.message}`);

    const barData = data.map((row) => ({
        month: formatBucketLabel(row.bucket, granularity, locale),
        paid: row.paid,
        owed: row.outstanding,
    }));

    const lineData = data.map((row) => ({
        month: formatBucketLabel(row.bucket, granularity, locale),
        invoiced: row.invoiced_cumulative,
        paid: row.paid_cumulative,
    }));

    return { barData, lineData };
}
