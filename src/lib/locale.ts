'use server';

import { cookies, headers } from 'next/headers';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { locales, defaultLocale, type Locale } from './i18n-config';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get(COOKIE_NAME)?.value;

    if (locales.includes(cookieLocale as Locale)) {
        return cookieLocale as Locale;
    }

    // No hay cookie todavía -> negociar según el idioma del navegador/SO
    const headersList = await headers();
    const negotiatorHeaders: Record<string, string> = {};
    headersList.forEach((value, key) => {
        negotiatorHeaders[key] = value;
    });

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

    return match(languages, locales, defaultLocale) as Locale;
}

export async function setUserLocale(locale: Locale) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, locale);
}

export async function clearUserLocale() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}