export const locales = ['es', 'en'] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];