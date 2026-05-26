import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';

const MEMBERS = ['1', '2', '3', '4'] as const;

export function Team() {
  const t = useTranslations('team');
  return (
    <section id="team" className="py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-3 text-body-lg text-steel">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEMBERS.map((id, i) => (
            <Reveal key={id} delay={i * 0.05}>
              <Card>
                <div className="aspect-square w-full rounded-card-sm bg-[#0F2640] mb-4" aria-hidden="true" />
                <div className="text-white font-semibold">{t(`members.${id}.name`)}</div>
                <div className="text-steel text-caption">{t(`members.${id}.role`)}</div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
