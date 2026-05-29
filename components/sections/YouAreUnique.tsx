import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';

export function YouAreUnique() {
  const t = useTranslations('youAreUnique');
  return (
    <section className="relative py-14 md:py-20 overflow-hidden border-y border-border-default">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,224,255,0.06),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-[860px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <Reveal>
          <div className="text-eyebrow uppercase tracking-eyebrow text-cyan mb-4">{t('eyebrow')}</div>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-6 text-body-lg text-steel">{t('body')}</p>
          <p className="mt-8 text-h2 font-semibold text-cyan">{t('highlight')}</p>
        </Reveal>
      </div>
    </section>
  );
}
