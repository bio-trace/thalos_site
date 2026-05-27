import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

type Props = {
  slug: 'impressum' | 'datenschutz' | 'agb';
  title: string;
};

export async function LegalDocument({ slug, title }: Props) {
  const file = path.join(process.cwd(), 'data', 'legal', `${slug}.de.html`);
  const html = await fs.readFile(file, 'utf8');
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
