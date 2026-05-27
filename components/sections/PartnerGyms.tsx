import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';

export function PartnerGyms() {
  const t = useTranslations('partnerGyms');
  const locale = useLocale();
  return (
    <section id="partnerGyms" className="relative py-14 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,224,255,0.10),transparent_60%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-[960px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-3">{t('eyebrow')}</div>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-6 text-body-lg text-steel max-w-[720px]">{t('body')}</p>

          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Button href={`/${locale}#contact-partner-gym`} size="lg">
              {t('cta')}
            </Button>
            <span className="text-caption text-steel">{t('microline')}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
