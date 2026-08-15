import { Suspense } from "react";

import CardsSkeleton from "./components/cards/CardsSkeleton";
import ServerCards from "./components/cards/ServerCards";
import MetricsClient from "./components/MetricsClient";
import ChartsSkeletons from "./components/charts/ChartsSkeletons";
import ServerCharts from "./components/charts/ServerCharts";
import { parsePeriod } from "@/lib/period";


async function MetricsPage({
    searchParams,
}: {
    searchParams: Promise<{ period?: string }>;
}) {
    const resolvedSearchParams = await searchParams;

    const period = parsePeriod(resolvedSearchParams.period);

    return (
        <MetricsClient
            skeleton={<CardsSkeleton />}
            content={
                <>
                    <Suspense key={`kpis-${period}`} fallback={<CardsSkeleton />}>
                        {/* <KpiCards period={period} /> */}
                        <ServerCards period={period} />
                    </Suspense>

                    <Suspense key={`charts-${period}`} fallback={<ChartsSkeletons />}>
                        {/* <KpiCards period={period} /> */}
                        <ServerCharts />
                    </Suspense>
                </>
            }
        />
    )
    // return (
    //     <>
    //         <Header />

    //         <Suspense key={`kpis-${period}`} fallback={<CardsSkeleton />}>
    //             {/* <KpiCards period={period} /> */}
    //             <ServerCards />
    //         </Suspense>

    //         {/* <Suspense key={`facturas-${period}`} fallback={<ChartSkeleton  />}> */}
    //             {/* <FacturasPorEstado period={period} /> */}
    //             {/* <div>asdsd</div> */}
    //         {/* </Suspense> */}

    //         {/* <Suspense key={`pagos-${period}`} fallback={<ChartSkeleton  />}> */}
    //             {/* <FacturasVsPagos period={period} /> */}
    //             {/* <div>asdsd</div> */}
    //         {/* </Suspense> */}

    //     </>
    // )
}

export default MetricsPage;



