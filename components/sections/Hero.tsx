import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { PhoneScreenshot } from '@/components/ui/PhoneScreenshot';
import { Reveal } from '@/components/motion/Reveal';

export function Hero() {
  const t = useTranslations('hero');
  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 bg-hero-gradient opacity-90 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(0,224,255,0.18),transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div>
            <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-4">{t('eyebrow')}</div>
            <h1 className="text-display font-bold tracking-tight leading-tight text-white">{t('headline')}</h1>
            <p className="mt-4 text-h2 font-semibold text-cyan">{t('tagline')}</p>
            <p className="mt-6 text-body-lg text-steel max-w-[560px]">{t('sub')}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button href="#download" size="lg">{t('ctaPrimary')}</Button>
              <Button href="#partnerGyms" size="lg" variant="secondary">{t('ctaSecondary')}</Button>
            </div>
            <p className="mt-4 text-caption text-steel">{t('microline')}</p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex justify-center lg:justify-end">
            <PhoneScreenshot alt="Thalos app home screen" priority />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
