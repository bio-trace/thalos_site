import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';

export function FounderNote() {
  const t = useTranslations('founder');
  return (
    <section className="py-14 md:py-20 border-t border-border-default">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 lg:px-8 text-center">
        <Reveal>
          <p className="text-h2 font-semibold text-white italic">&ldquo;{t('quote')}&rdquo;</p>
          <div className="mt-6 text-caption text-steel">
            <div className="text-white font-semibold">{t('name')}</div>
            <div>{t('role')}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
