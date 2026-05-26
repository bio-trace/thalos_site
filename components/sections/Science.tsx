import { useTranslations } from 'next-intl';
import { ScienceViz } from '@/components/ui/ScienceViz';
import { Reveal } from '@/components/motion/Reveal';

export function Science() {
  const t = useTranslations('science');
  return (
    <section id="science" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,224,255,0.08),transparent_60%)] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div>
            <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-4">{t('eyebrow')}</div>
            <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
            <p className="mt-6 text-body-lg text-steel">{t('body')}</p>
            <p className="mt-6 text-caption text-steel">{t('disclaimer')}</p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex justify-center">
            <ScienceViz />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
