"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Period } from "@/lib/period";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import IconButton from "@/components/IconButton";

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function getPeriodLabel(period: Period, offset: number, locale: string): string {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    switch (period) {
        case "month": {
            const start = new Date(year, month - offset, 1);
            return capitalize(start.toLocaleDateString(locale, { month: "long", year: "numeric" }));
        }
        case "quarter": {
            const currentQuarterStartMonth = Math.floor(month / 3) * 3;
            const targetStartMonth = currentQuarterStartMonth - offset * 3;
            const start = new Date(year, targetStartMonth, 1);
            const end = new Date(year, targetStartMonth + 2, 1);
            const startLabel = capitalize(start.toLocaleDateString(locale, { month: "short" }));
            const endLabel = capitalize(end.toLocaleDateString(locale, { month: "short" }));
            return `${startLabel} - ${endLabel} ${start.getFullYear()}`;
        }
        case "year": {
            return String(year - offset);
        }
    }
}

function PeriodNavigator({ period }: { period: Period }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale = useLocale();
    const currentOffset = Number(searchParams.get("offset") ?? 0);

    const label = useMemo(
        () => getPeriodLabel(period, currentOffset, locale),
        [period, currentOffset, locale]
    );

    function goToOffset(newOffset: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("offset", String(newOffset));
        router.push(`${pathname}?${params.toString()}`);
    }

    const isCurrentPeriod = currentOffset === 0;

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, margin: "10px 0 0px" }}>
            <IconButton
                onClick={() => goToOffset(Number(currentOffset) + 1)}
                aria-label="Last period"
                icon={"nav-arrow-left"}
                ghost
            />

            <span style={{ fontSize: 16, fontWeight: 500, minWidth: 150, textAlign: "center", color: "var(--Text-text-primary)" }}>
                {label}
            </span>

            <IconButton
                onClick={() => goToOffset(Number(currentOffset) - 1)}
                aria-label="Next period"
                icon={"nav-arrow-right"}
                ghost
                disabled={isCurrentPeriod}
            />

        </div>
    );
}

export default PeriodNavigator;