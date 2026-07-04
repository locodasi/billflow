// src/constants/currencies.ts
export const CURRENCY_CODES = [
    "USD", "EUR", "GBP", "JPY", "ARS", "BRL", "CAD", "CHF",
] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];