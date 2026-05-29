import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border-default py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 grid gap-10 md:grid-cols-3 md:items-start">
        <div className="flex items-start gap-3">
          <Logo size={28} />
          <div>
            <div className="text-white font-semibold tracking-tight">Thalos</div>
            <p className="mt-2 max-w-[280px] text-caption text-steel">{t('tagline')}</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-caption text-steel md:justify-center">
          <Link href={`/${locale}/impressum`} className="hover:text-white">{t('impressum')}</Link>
          <Link href={`/${locale}/datenschutz`} className="hover:text-white">{t('datenschutz')}</Link>
          <Link href={`/${locale}/agb`} className="hover:text-white">{t('agb')}</Link>
          <Link href={`/${locale}/widerruf`} className="hover:text-white">{t('widerruf')}</Link>
          <a href="mailto:notifications@thalos.at" className="hover:text-white">{t('contact')}</a>
        </nav>
        <div className="flex md:justify-end">
          <LanguageToggle />
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 mt-10 text-caption text-steel">
        © {year} {t('rights')}
      </div>
    </footer>
  );
}
