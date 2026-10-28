// lib/period.ts
import { DateTime } from "luxon";

const VALID_PERIODS = ["month", "quarter", "year"] as const;
type Period = (typeof VALID_PERIODS)[number];

function getPeriodRange(
    period: Period,
    offset: number = 0,
    timezone: string = "UTC",
) {
    const reference = DateTime.now().setZone(timezone);

    if (!reference.isValid) {
        throw new Error(`Invalid timezone: ${timezone}`);
    }

    if (!Number.isInteger(offset)) {
        throw new Error("Invalid period offset");
    }

    let start: DateTime;
    let durationMonths: number;

    switch (period) {
        case "month":
            start = reference.startOf("month").minus({ months: offset });
            durationMonths = 1;
            break;

        case "quarter":
            start = reference.startOf("quarter").minus({
                months: offset * 3,
            });
            durationMonths = 3;
            break;

        case "year":
            start = reference.startOf("year").minus({ years: offset });
            durationMonths = 12;
            break;
    }

    const end = start.plus({ months: durationMonths });

    const startUtc = start.toUTC().toISO();
    const endUtc = end.toUTC().toISO();

    if (!startUtc || !endUtc) {
        throw new Error("Could not calculate period range");
    }

    return {
        startUtc,
        endUtc,
        granularity: period === "month" ? "week" : "month" as "week" | "month",
    };
}

function parsePeriod(value: string | undefined): Period {
    if (VALID_PERIODS.includes(value as Period)) {
        return value as Period;
    }
    return "month";
}

function parseOffset(value: string | undefined): number {
    const parsed = Number(value ?? 0);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return Math.floor(parsed);
}

// lib/delta.ts
export type DeltaDisplay =
    | { kind: "equal" }
    | { kind: "absolute"; value: number; isUp: boolean } // solo cuando previous === 0
    | { kind: "percent"; value: number; isUp: boolean; absoluteValue: number };

export function getDeltaDisplay(current: number, previous: number): DeltaDisplay {
    if (current === previous) return { kind: "equal" };

    const diff = current - previous;
    const isUp = diff > 0;

    if (previous === 0) {
        return { kind: "absolute", value: Math.abs(diff), isUp };
    }

    const pct = Math.round(Math.abs((diff / previous) * 100));
    return { kind: "percent", value: pct, isUp, absoluteValue: Math.abs(diff) };
}

export { getPeriodRange, parsePeriod, parseOffset };
export type { Period };