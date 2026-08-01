'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useUserStore } from '@/stores/userStore';
import { setUserLocale } from '@/lib/locale';
import { locales, type Locale } from '@/lib/i18n-config';

export function LanguageSync() {
  const router = useRouter();
  const activeLocale = useLocale(); // el que está renderizado ahora mismo (server)
  const language = useUserStore((s) => s.language);
  const isSyncing = useRef(false);

  useEffect(() => {
    // "de" u otros idiomas del store que todavía no soportás en next-intl
    if (!locales.includes(language as Locale)) return;
    if (!language) return;

    if (language === activeLocale) return;
    if (isSyncing.current) return;

    isSyncing.current = true;
    setUserLocale(language as Locale).then(() => {
      router.refresh();
    });
  }, [language, activeLocale, router]);

  // Una vez que el server ya renderizó con el locale nuevo, liberamos el lock
  useEffect(() => {
    isSyncing.current = false;
  }, [activeLocale]);

  return null;
}