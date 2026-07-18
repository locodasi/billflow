import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/lib/locale';

const namespaces = ['login', 'invoices', "common", "settings", "clients", "payments", "sidenav"] as const;

export default getRequestConfig(async () => {
    const locale = await getUserLocale();

    const modules = await Promise.all(
        namespaces.map((ns) => import(`../../messages/${locale}/${ns}.json`))
    );

    const messages = Object.fromEntries(
        namespaces.map((ns, i) => [ns, modules[i].default])
    );

    return { locale, messages };
});