import 'server-only';
import { loadLegal, LEGAL_TITLES, type LegalSlug } from '@/lib/content/legal';
import type { Locale } from '@/lib/i18n';

type Props = {
  slug: LegalSlug;
  locale: Locale;
};

export async function LegalDocument({ slug, locale }: Props) {
  const html = await loadLegal(slug, locale);
  const title = LEGAL_TITLES[locale][slug];
  return (
    <main id="main" className="max-w-[800px] mx-auto px-4 md:px-6 py-32">
      <h1 className="text-h1 font-bold tracking-tight text-white">{title}</h1>
      <div
        className="legal-prose mt-10 text-body text-steel"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
