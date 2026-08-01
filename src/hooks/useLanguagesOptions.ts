import { useLocale } from 'next-intl';
import { useMemo } from 'react';

const LANGUAGE_CODES = ['en', 'es', 'de'];

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function useLanguageOptions() {
    const locale = useLocale();

    return useMemo(() => {
        const displayNames = new Intl.DisplayNames([locale], {
            type: 'language',
        });

        return LANGUAGE_CODES.map((code) => ({
            value: code,
            label: capitalize(displayNames.of(code) ?? code),
        }));
    }, [locale]);
}