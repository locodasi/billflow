// components/MetricsClient.tsx
"use client";

import { useTranslations } from "next-intl";

import { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { useProjectsStore } from "@/stores/projectStore";

import Header, { HeaderTitle, HeaderWrapper } from "@/components/Header";
import Chips from "@/components/Chips";
import PeriodNavigator from "./PeriodNavigator";
import { parsePeriod } from "@/lib/period";

const TEMPORAL_CHIPS = ["month", "quarter", "year"] as const;


function MetricsClient({
    content,
    skeleton,
}: {
    content: React.ReactNode; // todo el bloque real (cards + charts), ya resuelto por Suspense
    skeleton: React.ReactNode; // el layout completo de skeletons
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const t = useTranslations('metrics');
    const projectName = useProjectsStore(s => s.project?.name); 

    const currentPeriod = searchParams.get("period") ?? "month";

    function handleSelect(period: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("period", period);

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }

    return (
        <>

            <Header
                title={t('header')}
                projectName={projectName}
                actions={(
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Chips
                            items={TEMPORAL_CHIPS.map(chip => ({ text: t(`temporal_chips.${chip}`), value: chip }))}
                            selected={currentPeriod}
                            onClick={handleSelect}
                        />
                    </div>
                )}
                mobileActions={(
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Chips
                            items={TEMPORAL_CHIPS.map(chip => ({ text: t(`temporal_chips.${chip}`), value: chip }))}
                            selected={currentPeriod}
                            onClick={handleSelect}
                        />
                    </div>
                )}
            />

            <PeriodNavigator period={parsePeriod(currentPeriod)} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', overflow: "auto" }}>
                {isPending ? skeleton : content}
            </div>
        </>
    );
}

export default MetricsClient;