import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { Nav } from '@/components/sections/Nav';
import { Footer } from '@/components/sections/Footer';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Thalos — AI Performance Coach',
  description: 'AI performance coach for serious athletes. Built in Vienna.',
  metadataBase: new URL('https://thalos.at'),
  openGraph: {
    title: 'Thalos — AI Performance Coach',
    description: 'AI performance coach for serious athletes. Built in Vienna.',
    type: 'website',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as Locale)) notFound();
  setRequestLocale(params.locale);
  const messages = await getMessages();
  return (
    <html lang={params.locale} className={inter.variable}>
      <body className="bg-navy text-white font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-cyan focus:text-navy focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>
          <Nav />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
