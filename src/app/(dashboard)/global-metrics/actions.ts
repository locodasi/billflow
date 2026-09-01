'use server'
import { Locale } from "next-intl";

import { createServerClient } from "@/lib/supabase.server";
import { getPeriodRange, type Period } from "@/lib/period";
import { getUserLocale } from "@/lib/locale";

const roundToTwo = (value: number) => Number(value.toFixed(2));

export async function getCardsValue(period: Period, offset: number = 0) {
    const { startUtc, endUtc } = getPeriodRange(period, offset);
    const { startUtc: prevStartUtc, endUtc: prevEndUtc } = getPeriodRange(period, offset + 1);

    const supabase = await createServerClient();


    const { data, error } = await supabase
        .rpc("get_global_cards_metrics", {
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
        invoiced: roundToTwo(invoiced),
        payed: roundToTwo(payed),
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
        ? date.toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" })
        : date.toLocaleDateString(locale, { month: "short", timeZone: "UTC" });
}


type ChartsMetrics = {
    by_client: {
        client_id: string;
        client_name: string;
        invoiced: number;
        paid: number;
    }[];
    timeline: {
        bucket: string;
        invoiced: number;
        paid: number;
    }[];
};

export async function getChartsValue(period: Period, offset: number = 0) {
    const { startUtc, endUtc, granularity } = getPeriodRange(period, offset);

    console.log(startUtc, endUtc, granularity);
    const supabase = await createServerClient();
    const locale = await getUserLocale();

    const { data, error } = await supabase
        .rpc("get_global_charts_metrics", {
            p_start: startUtc,
            p_end: endUtc,
            p_granularity: granularity,
        })

    if (error) throw new Error(`Error al obtener KPIs: ${error.message}`);

    const metrics = data as unknown as ChartsMetrics;
    
    const barData = (metrics?.by_client ?? []).map((row) => ({
        clientId: row.client_id,
        clientName: row.client_name,
        owed: roundToTwo(Math.max(row.invoiced - row.paid, 0)),
        paid: roundToTwo(Number(row.paid)),
    }));
    

    const timeline = metrics?.timeline ?? [];

    const lineData = timeline.map((row) => ({
        month: formatBucketLabel(
            row.bucket,
            granularity,
            locale
        ),
        invoiced: roundToTwo(Number(row.invoiced)),
        paid: roundToTwo(Number(row.paid)),
    }));

    return { barData, lineData };
}
