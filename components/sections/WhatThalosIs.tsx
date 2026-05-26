import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';

export function WhatThalosIs() {
  const t = useTranslations('what');
  return (
    <section className="border-y border-border-default py-12 md:py-16">
      <div className="max-w-[1024px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-h2 font-semibold text-white">{t('title')}</h2>
          <p className="mt-4 text-body-lg text-steel">{t('body')}</p>
        </Reveal>
      </div>
    </section>
  );
}
