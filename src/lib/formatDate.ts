// src/lib/formatDate.ts
import { getFormatter } from 'next-intl/server';

export async function formatDateServer(dateString: string) {
    const format = await getFormatter();
    const formatted = format.dateTime(new Date(dateString), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    return formatted.replace(/\b\w/g, (c) => c.toUpperCase());
}