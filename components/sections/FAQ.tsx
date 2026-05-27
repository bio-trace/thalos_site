import { getTranslations, getLocale } from 'next-intl/server';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { loadFaq, type Locale } from '@/lib/content/faq';

export async function FAQ() {
  const t = await getTranslations('faq');
  const locale = (await getLocale()) as Locale;
  const items = await loadFaq();
  const localized = items.map((i) => ({ q: i.q[locale], a: i.a[locale] }));
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-h1 font-bold tracking-tight text-white mb-10">{t('title')}</h2>
        <FAQAccordion items={localized} />
      </div>
    </section>
  );
}
