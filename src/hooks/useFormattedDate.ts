'use client';

import { useFormatter } from 'next-intl';

export function useFormattedDate() {
    const format = useFormatter();

    function formatDate(dateString: string) {
        const formatted = format.dateTime(new Date(dateString), {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
        return formatted.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    function parseDateToLocaleFormat(dateString: string) {
        return format.dateTime(new Date(dateString));
    }

    return { formatDate, parseDateToLocaleFormat };
}