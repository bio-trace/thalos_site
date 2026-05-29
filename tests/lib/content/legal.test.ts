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
      '## Heading\n\nParagraph with **bold** text.\n'
    );
  });

  afterAll(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('renders markdown to HTML', async () => {
    const html = await loadLegal('impressum', tmpDir);
    expect(html).toContain('<h2>Heading</h2>');
    expect(html).toContain('<strong>bold</strong>');
  });

  it('throws on unknown slug', async () => {
    await expect(loadLegal('unknown' as any, tmpDir)).rejects.toThrow();
  });

  it('strips YAML frontmatter before rendering', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'data', 'legal', 'datenschutz.md'),
      '---\ntitle: X\n---\n## Body\n\nText.\n'
    );
    const html = await loadLegal('datenschutz', tmpDir);
    expect(html).toContain('<h2>Body</h2>');
    expect(html).not.toContain('title: X');
    expect(html).not.toContain('---');
  });
});
