import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Locale } from '@/lib/i18n';

export type { Locale };

export type TeamMember = {
  id: string;
  name: string;
  role: Record<Locale, string>;
  image: string | null;
  order?: number;
};

export async function loadTeam(cwd: string = process.cwd()): Promise<TeamMember[]> {
  const dir = path.join(cwd, 'data', 'team');
  const entries = await fs.readdir(dir);
  const jsonFiles = entries.filter((f) => f.endsWith('.json'));
  const members = await Promise.all(
    jsonFiles.map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), 'utf8');
      return JSON.parse(raw) as TeamMember;
    })
  );
  return members.sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    if (ao !== bo) return ao - bo;
    return a.id.localeCompare(b.id);
  });
}
