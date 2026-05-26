import { useTranslations } from 'next-intl';
import { FAQAccordion } from '@/components/ui/FAQAccordion';

export function FAQ() {
  const t = useTranslations('faq');
  const items = t.raw('items') as { q: string; a: string }[];
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-h1 font-bold tracking-tight text-white mb-10">{t('title')}</h2>
        <FAQAccordion items={items} />
      </div>
    </section>
  );
}
