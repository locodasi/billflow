// lib/email/get-email-translator.ts
import { createTranslator } from "next-intl";

const loaders = {
  en: () => import("@messages/en/emails.json"),
  es: () => import("@messages/es/emails.json"),
  de: () => import("@messages/de/emails.json"),
} as const;

export type Locale = keyof typeof loaders;

export async function getEmailTranslator(locale: string) {
  const load = loaders[locale as Locale] ?? loaders.es;
  const messages = (await load()).default;
  return createTranslator({ locale, messages });
}

export type EmailTranslator = Awaited<ReturnType<typeof getEmailTranslator>>;