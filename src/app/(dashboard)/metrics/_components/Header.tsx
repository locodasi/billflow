"use client";

import { useTranslations } from "next-intl";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { useProjectsStore } from "@/stores/projectStore";

import { HeaderTitle, HeaderWrapper } from "@/components/Header";
import Chips from "@/components/Chips";

const TEMPORAL_CHIPS = ["month", "quarter", "year"] as const;

const Header = () => {

    const t = useTranslations('metrics');
    const projectName = useProjectsStore(s => s.project?.name);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPeriod = searchParams.get("period") ?? "month";

    function handleSelect(period: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("period", period);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <HeaderWrapper>
            <HeaderTitle>{`${t('header')} -- ${projectName}`}</HeaderTitle>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Chips
                    items={TEMPORAL_CHIPS.map(chip => ({ text: t(`temporal_chips.${chip}`), value: chip }))}
                    selected={currentPeriod}
                    onClick={handleSelect}
                />
            </div>
        </HeaderWrapper>

    )
}

export default Header;