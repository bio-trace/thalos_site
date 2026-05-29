import { useTranslations, useLocale } from 'next-intl';
import { Users, Tag, TrendingUp, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';

const CARDS = [
  { key: 'spots', icon: Users },
  { key: 'price', icon: Tag },
  { key: 'data', icon: TrendingUp },
  { key: 'status', icon: Activity },
] as const;

export function FoundingAthleteBeta() {
  const t = useTranslations('foundingAthleteBeta');
  const locale = useLocale();
  return (
    <section id="founding-athlete-beta" className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-card border border-border-active bg-[rgba(0,224,255,0.03)] shadow-cta-glow">
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(0,224,255,0.14),transparent_55%)] pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-12 p-6 md:p-10 lg:p-14">
            {/* Left: the offer + CTAs */}
            <Reveal>
              <div className="text-eyebrow uppercase tracking-eyebrow text-cyan">{t('eyebrow')}</div>
              <h2 className="mt-3 text-h1 font-bold tracking-tight text-white">{t('headline')}</h2>
              <p className="mt-3 text-body-lg font-semibold text-cyan">{t('subheadline')}</p>
              <p className="mt-5 text-body text-steel max-w-[560px]">{t('heroBody')}</p>
              <p className="mt-5 text-white font-semibold">{t('uniqueLine')}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button href={`/${locale}/founding-athlete`} size="lg">
                  {t('ctaLearnMore')}
                </Button>
                <Button href={`/${locale}#download`} size="lg" variant="secondary">
                  {t('ctaBecome')}
                </Button>
              </div>
              <p className="mt-4 text-caption text-steel">{t('teaserNote')}</p>
            </Reveal>

            {/* Right: highlight cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {CARDS.map((c, i) => (
                <Reveal key={c.key} delay={i * 0.05} className="h-full">
                  <Card className="h-full" variant="elevated">
                    <Icon icon={c.icon} size={24} active className="mb-3" />
                    <h3 className="text-white text-[19px] font-semibold leading-snug mb-1.5">
                      {t(`cards.${c.key}.title`)}
                    </h3>
                    <p className="text-steel text-body">{t(`cards.${c.key}.body`)}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
