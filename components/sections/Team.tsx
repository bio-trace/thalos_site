import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';
import team from '@/data/team.json';

type Locale = 'de' | 'en';
type TeamMember = {
  id: string;
  name: string;
  role: Record<Locale, string>;
  image: string | null;
};

const members = team as TeamMember[];

export function Team() {
  const t = useTranslations('team');
  const locale = useLocale() as Locale;
  return (
    <section id="team" className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-3 text-body-lg text-steel">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.04}>
              <Card
                className="h-full"
                media={
                  <div className="relative aspect-square w-full bg-[#0F2640]">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,224,255,0.18),transparent_70%)]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                }
              >
                <div className="mt-auto">
                  <div className="text-white font-semibold">{m.name}</div>
                  <div className="text-steel text-caption">{m.role[locale]}</div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
