import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  return (
    <footer className="border-t border-border-default py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-2">
          <Logo size={24} />
          <span className="text-white font-semibold">Thalos</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-caption text-steel">
          <Link href={`/${locale}/impressum`} className="hover:text-white">{t('impressum')}</Link>
          <Link href={`/${locale}/datenschutz`} className="hover:text-white">{t('datenschutz')}</Link>
          <Link href={`/${locale}/agb`} className="hover:text-white">{t('agb')}</Link>
          <Link href={`/${locale}/widerruf`} className="hover:text-white">{t('widerruf')}</Link>
          <a href="mailto:notifications@thalos.at" className="hover:text-white">{t('contact')}</a>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 mt-8 text-caption text-steel">{t('rights')}</div>
    </footer>
  );
}
