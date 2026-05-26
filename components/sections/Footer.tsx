import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  return (
    <footer className="border-t border-border-default py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4 L12 16 L20 4" stroke="#00E0FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white font-semibold">Thalos</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-caption text-steel">
          <Link href={`/${locale}/impressum`} className="hover:text-white">{t('impressum')}</Link>
          <Link href={`/${locale}/datenschutz`} className="hover:text-white">{t('datenschutz')}</Link>
          <Link href={`/${locale}/agb`} className="hover:text-white">{t('agb')}</Link>
          <a href="mailto:hello@thalos.at" className="hover:text-white">{t('contact')}</a>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 mt-8 text-caption text-steel">{t('rights')}</div>
    </footer>
  );
}
