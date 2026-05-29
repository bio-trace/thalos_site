import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Dumbbell, Utensils, Moon, BarChart3, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

const PILLARS = [
  { key: 'workouts', icon: Dumbbell },
  { key: 'meals', icon: Utensils },
  { key: 'recovery', icon: Moon },
  { key: 'data', icon: BarChart3 },
  { key: 'coach', icon: Sparkles },
] as const;

export function System() {
  const t = useTranslations('system');
  return (
    <section id="system" className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.key} delay={i * 0.05}>
              <Card className="h-full">
                <Icon icon={p.icon} size={28} active className="mb-4" />
                <h3 className="text-white text-h2 font-semibold mb-2">{t(`pillars.${p.key}.title`)}</h3>
                <p className="text-steel text-body">{t(`pillars.${p.key}.body`)}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
