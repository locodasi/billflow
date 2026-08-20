import { Suspense } from "react";

import CardsSkeleton from "./components/cards/CardsSkeleton";
import ServerCards from "./components/cards/ServerCards";
import MetricsClient from "./components/MetricsClient";
import ChartsSkeletons from "./components/charts/ChartsSkeletons";
import ServerCharts from "./components/charts/ServerCharts";
import { parseOffset, parsePeriod } from "@/lib/period";


async function MetricsPage({
    searchParams,
}: {
    searchParams: Promise<{ period?: string, offset?: string }>;
}) {
    const resolvedSearchParams = await searchParams;

    const period = parsePeriod(resolvedSearchParams.period);
    const offset = parseOffset(resolvedSearchParams.offset);

    return (
        <MetricsClient
            skeleton={<CardsSkeleton />}
            content={
                <>
                    <Suspense key={`kpis-${period}-${offset}`} fallback={<CardsSkeleton />}>
                        <ServerCards period={period} offset={offset} />
                    </Suspense>

                    <Suspense key={`charts-${period}-${offset}`} fallback={<ChartsSkeletons />}>
                        <ServerCharts period={period} offset={offset} />
                    </Suspense>
                </>
            }
        />
    )
}

export default MetricsPage;



