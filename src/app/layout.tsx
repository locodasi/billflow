import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import "../styles/globals.css";

import StyledComponentsRegistry from '@/lib/registry'

import ThemeProvider from "./_components/ThemeProvider";
import { LanguageSync } from "./_components/LanguageSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Billflow",
  description: "Billflow",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >

      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
                        (function() {
                            try {
                                var stored = localStorage.getItem('ui-preferences');
                                var theme = stored ? JSON.parse(stored).state?.theme : 'system';
                                
                                if (!theme || theme === 'system') {
                                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                }
                                
                                document.documentElement.setAttribute('data-theme', theme);
                            } catch(e) {
                                document.documentElement.setAttribute('data-theme', 'light');
                            }
                        })();
                    `
        }} />
      </head>

      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StyledComponentsRegistry>
            <ThemeProvider>
              <LanguageSync />
              {children}
            </ThemeProvider>
          </StyledComponentsRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
