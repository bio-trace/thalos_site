import { setRequestLocale } from 'next-intl/server';
import { LegalDocument } from '@/components/ui/LegalDocument';
import type { Locale } from '@/lib/i18n';

export default function Datenschutz({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <LegalDocument slug="datenschutz" locale={locale as Locale} />;
}
