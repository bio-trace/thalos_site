import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Locale } from '@/lib/i18n';

export type { Locale };

export type FAQItem = {
  id: string;
  q: Record<Locale, string>;
  a: Record<Locale, string>;
  order?: number;
};

export async function loadFaq(cwd: string = process.cwd()): Promise<FAQItem[]> {
  const dir = path.join(cwd, 'data', 'faq');
  const entries = await fs.readdir(dir);
  const jsonFiles = entries.filter((f) => f.endsWith('.json'));
  const items = await Promise.all(
    jsonFiles.map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), 'utf8');
      return JSON.parse(raw) as FAQItem;
    })
  );
  return items.sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    if (ao !== bo) return ao - bo;
    return a.id.localeCompare(b.id);
  });
}
