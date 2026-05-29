import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadFaq } from '@/lib/content/faq';

describe('loadFaq', () => {
  let tmpDir: string;

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'faq-test-'));
    await fs.mkdir(path.join(tmpDir, 'data', 'faq'), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, 'data', 'faq', 'second.json'),
      JSON.stringify({
        id: 'second',
        q: { de: 'Frage 2', en: 'Question 2' },
        a: { de: 'Antwort 2', en: 'Answer 2' },
        order: 2,
      })
    );
    await fs.writeFile(
      path.join(tmpDir, 'data', 'faq', 'first.json'),
      JSON.stringify({
        id: 'first',
        q: { de: 'Frage 1', en: 'Question 1' },
        a: { de: 'Antwort 1', en: 'Answer 1' },
        order: 1,
      })
    );
  });

  afterAll(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('returns items sorted by order', async () => {
    const items = await loadFaq(tmpDir);
    expect(items.map((i) => i.id)).toEqual(['first', 'second']);
  });

  it('preserves de/en pairs', async () => {
    const items = await loadFaq(tmpDir);
    expect(items[0].q.de).toBe('Frage 1');
    expect(items[0].q.en).toBe('Question 1');
    expect(items[0].a.de).toBe('Antwort 1');
  });

  it('treats missing order as Infinity (sorts last)', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'data', 'faq', 'no-order.json'),
      JSON.stringify({ id: 'no-order', q: { de: 'X', en: 'X' }, a: { de: 'Y', en: 'Y' } })
    );
    const items = await loadFaq(tmpDir);
    expect(items[items.length - 1].id).toBe('no-order');
  });
});
