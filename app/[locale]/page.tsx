import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function Page({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = useTranslations('hero');
  return (
    <main id="main" className="min-h-screen flex items-center justify-center">
      <h1 className="text-display font-bold tracking-tight">{t('headline')}</h1>
    </main>
  );
}
