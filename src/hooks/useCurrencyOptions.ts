// src/hooks/useCurrencyOptions.ts
'use client';

import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import { CURRENCY_CODES } from '@/utils/constants';

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function useCurrencyOptions() {
    const locale = useLocale();

    return useMemo(() => {
        const displayNames = new Intl.DisplayNames([locale], { type: 'currency' });

        return CURRENCY_CODES.map((code) => ({
            value: code,
            label: `${capitalize(displayNames.of(code) ?? code)} (${code})`,
        }));
    }, [locale]);
}