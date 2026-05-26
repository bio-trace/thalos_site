import { useTranslations } from 'next-intl';
import { QuoteCard } from '@/components/ui/QuoteCard';
import { Reveal } from '@/components/motion/Reveal';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format';

export function Athletes() {
  const t = useTranslations('athletes');
  return (
    <section id="athletes" className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-3 text-body-lg text-steel">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {([1, 2, 3] as const).map((i) => (
            <Reveal key={i} delay={i * 0.05}>
              <QuoteCard
                quote={t(`quote${i}` as 'quote1' | 'quote2' | 'quote3')}
                name="[LOREM] Athlete"
                role="DASGYM"
                image={PLACEHOLDER}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
