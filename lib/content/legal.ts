import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

export type LegalSlug = 'impressum' | 'datenschutz' | 'agb' | 'widerruf';

const SLUGS: readonly LegalSlug[] = ['impressum', 'datenschutz', 'agb', 'widerruf'];

export async function loadLegal(slug: LegalSlug, cwd: string = process.cwd()): Promise<string> {
  if (!SLUGS.includes(slug)) {
    throw new Error(`Unknown legal slug: ${slug}`);
  }
  const file = path.join(cwd, 'data', 'legal', `${slug}.md`);
  const md = await fs.readFile(file, 'utf8');
  const body = md.replace(/^---\n[\s\S]*?\n---\n/, '');
  // marked.parse typing doesn't narrow on async:false; cast is required.
  return marked.parse(body, { async: false }) as string;
}
