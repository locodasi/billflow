import { Suspense } from "react";

import CardsSkeleton from "./_components/cards/CardsSkeleton";
import ServerCards from "./_components/cards/ServerCards";
import MetricsClient from "./_components/MetricsClient";
import ChartsSkeletons from "./_components/charts/ChartsSkeletons";
import ServerCharts from "./_components/charts/ServerCharts";
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



