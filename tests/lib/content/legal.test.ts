import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadLegal } from '@/lib/content/legal';

describe('loadLegal', () => {
  let tmpDir: string;

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'legal-test-'));
    await fs.mkdir(path.join(tmpDir, 'data', 'legal'), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, 'data', 'legal', 'impressum.md'),
      '## Heading\n\nGerman paragraph with **bold** text.\n'
    );
    await fs.writeFile(
      path.join(tmpDir, 'data', 'legal', 'impressum.en.md'),
      '## Heading\n\nEnglish paragraph with **bold** text.\n'
    );
  });

  afterAll(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('renders German markdown to HTML for locale de', async () => {
    const html = await loadLegal('impressum', 'de', tmpDir);
    expect(html).toContain('<h2>Heading</h2>');
    expect(html).toContain('German paragraph with <strong>bold</strong>');
  });

  it('loads the English file for locale en', async () => {
    const html = await loadLegal('impressum', 'en', tmpDir);
    expect(html).toContain('English paragraph with <strong>bold</strong>');
    expect(html).not.toContain('German paragraph');
  });

  it('defaults to German when locale is omitted', async () => {
    const html = await loadLegal('impressum', undefined, tmpDir);
    expect(html).toContain('German paragraph');
  });

  it('throws on unknown slug', async () => {
    await expect(loadLegal('unknown' as any, 'de', tmpDir)).rejects.toThrow();
  });

  it('strips YAML frontmatter before rendering', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'data', 'legal', 'datenschutz.md'),
      '---\ntitle: X\n---\n## Body\n\nText.\n'
    );
    const html = await loadLegal('datenschutz', 'de', tmpDir);
    expect(html).toContain('<h2>Body</h2>');
    expect(html).not.toContain('title: X');
    expect(html).not.toContain('---');
  });
});
