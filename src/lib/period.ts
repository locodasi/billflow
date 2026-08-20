// lib/period.ts
const VALID_PERIODS = ["month", "quarter", "year"] as const;
type Period = (typeof VALID_PERIODS)[number];

function getPeriodRange(period: Period, offset: number = 0, referenceDate: Date = new Date()) {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();

    let start: Date;
    let end: Date;
    let granularity: "week" | "month" = "month";

    switch (period) {
        case "month":
            start = new Date(year, month - offset, 1);
            end = new Date(year, month - offset + 1, 1);
            granularity = "week";
            break;
        case "quarter": {
            const currentQuarterStartMonth = Math.floor(month / 3) * 3;
            const targetStartMonth = currentQuarterStartMonth - offset * 3;
            start = new Date(year, targetStartMonth, 1);
            end = new Date(year, targetStartMonth + 3, 1);
            granularity = "month";
            break;
        }
        case "year":
            start = new Date(year - offset, 0, 1);
            end = new Date(year - offset + 1, 0, 1);
            granularity = "month";
            break;
    }

    return {
        startUtc: start.toISOString(),
        endUtc: end.toISOString(),
        granularity,
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