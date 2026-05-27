import { useTranslations, useLocale } from 'next-intl';
import { Dumbbell, Activity, Users, Flame } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';

const AUDIENCES = [
  { key: 'strength', icon: Dumbbell },
  { key: 'crossfit', icon: Activity },
  { key: 'coaches', icon: Users },
  { key: 'founding', icon: Flame },
] as const;

export function Athletes() {
  const t = useTranslations('athletes');
  const locale = useLocale();
  return (
    <section id="athletes" className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-3 text-body-lg text-steel max-w-[640px]">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUDIENCES.map((a, i) => (
            <Reveal key={a.key} delay={i * 0.05}>
              <Card className="h-full">
                <Icon icon={a.icon} size={28} active className="mb-4" />
                <h3 className="text-white text-h2 font-semibold mb-2">{t(`audiences.${a.key}.title`)}</h3>
                <p className="text-steel text-body">{t(`audiences.${a.key}.body`)}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-10">
            <Button href={`/${locale}#contact-founding-athlete`} size="lg">
              {t('cta')}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
