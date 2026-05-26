import { useTranslations, useLocale } from 'next-intl';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import faq from '@/data/faq.json';

type Locale = 'de' | 'en';
type FAQItem = {
  id: string;
  q: Record<Locale, string>;
  a: Record<Locale, string>;
};

const items = faq as FAQItem[];

export function FAQ() {
  const t = useTranslations('faq');
  const locale = useLocale() as Locale;
  const localized = items.map((i) => ({ q: i.q[locale], a: i.a[locale] }));
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-h1 font-bold tracking-tight text-white mb-10">{t('title')}</h2>
        <FAQAccordion items={localized} />
      </div>
    </section>
  );
}
