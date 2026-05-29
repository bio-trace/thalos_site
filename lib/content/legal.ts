import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { defaultLocale, type Locale } from '@/lib/i18n';

export type LegalSlug = 'impressum' | 'datenschutz' | 'agb' | 'widerruf';

const SLUGS: readonly LegalSlug[] = ['impressum', 'datenschutz', 'agb', 'widerruf'];

/** Localized page titles (rendered as the <h1>) per legal document. */
export const LEGAL_TITLES: Record<Locale, Record<LegalSlug, string>> = {
  de: {
    impressum: 'Impressum',
    datenschutz: 'Datenschutzerklärung',
    agb: 'Allgemeine Geschäftsbedingungen',
    widerruf: 'Rücktrittsbelehrung',
  },
  en: {
    impressum: 'Legal Notice',
    datenschutz: 'Privacy Policy',
    agb: 'General Terms and Conditions',
    widerruf: 'Right of Withdrawal',
  },
};

export async function loadLegal(
  slug: LegalSlug,
  locale: Locale = defaultLocale,
  cwd: string = process.cwd()
): Promise<string> {
  if (!SLUGS.includes(slug)) {
    throw new Error(`Unknown legal slug: ${slug}`);
  }
  // German is the default and lives in `${slug}.md`; other locales add a
  // suffix, e.g. `${slug}.en.md`.
  const filename = locale === defaultLocale ? `${slug}.md` : `${slug}.${locale}.md`;
  const file = path.join(cwd, 'data', 'legal', filename);
  const md = await fs.readFile(file, 'utf8');
  const body = md.replace(/^---\n[\s\S]*?\n---\n/, '');
  // marked.parse typing doesn't narrow on async:false; cast is required.
  return marked.parse(body, { async: false }) as string;
}
