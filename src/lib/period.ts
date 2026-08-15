// lib/period.ts
const VALID_PERIODS = ["month", "quarter", "year"] as const;
type Period = (typeof VALID_PERIODS)[number];

function getPeriodRange(period: Period, referenceDate: Date = new Date()) {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();

    let start: Date;
    let end: Date;

    switch (period) {
        case "month":
            start = new Date(year, month, 1);
            end = new Date(year, month + 1, 1);
            break;
        case "quarter": {
            const quarterStartMonth = Math.floor(month / 3) * 3;
            start = new Date(year, quarterStartMonth, 1);
            end = new Date(year, quarterStartMonth + 3, 1);
            break;
        }
        case "year":
            start = new Date(year, 0, 1);
            end = new Date(year + 1, 0, 1);
            break;
    }

    return {
        startUtc: start.toISOString(),
        endUtc: end.toISOString(),
    };
}

function parsePeriod(value: string | undefined): Period {
  if (VALID_PERIODS.includes(value as Period)) {
    return value as Period;
  }
  return "month";
}

export { getPeriodRange, parsePeriod };
export type { Period };