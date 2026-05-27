import 'server-only';
import { loadLegal, type LegalSlug } from '@/lib/content/legal';

type Props = {
  slug: LegalSlug;
  title: string;
};

export async function LegalDocument({ slug, title }: Props) {
  const html = await loadLegal(slug);
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
