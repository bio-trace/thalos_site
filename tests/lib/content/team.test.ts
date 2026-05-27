import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadTeam } from '@/lib/content/team';

describe('loadTeam', () => {
  let tmpDir: string;

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'team-test-'));
    await fs.mkdir(path.join(tmpDir, 'data', 'team'), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, 'data', 'team', 'z.json'),
      JSON.stringify({ id: 'z', name: 'Zed', role: { de: 'X', en: 'X' }, image: null, order: 3 })
    );
    await fs.writeFile(
      path.join(tmpDir, 'data', 'team', 'a.json'),
      JSON.stringify({ id: 'a', name: 'Alice', role: { de: 'Y', en: 'Y' }, image: '/a.jpg', order: 1 })
    );
    await fs.writeFile(
      path.join(tmpDir, 'data', 'team', 'b.json'),
      JSON.stringify({ id: 'b', name: 'Bob', role: { de: 'Z', en: 'Z' }, image: '/b.jpg', order: 2 })
    );
  });

  afterAll(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('returns members sorted by (order asc, id asc)', async () => {
    const members = await loadTeam(tmpDir);
    expect(members.map((m) => m.id)).toEqual(['a', 'b', 'z']);
  });

  it('returns typed members with role and image fields', async () => {
    const members = await loadTeam(tmpDir);
    expect(members[0]).toMatchObject({
      id: 'a',
      name: 'Alice',
      role: { de: 'Y', en: 'Y' },
      image: '/a.jpg',
      order: 1,
    });
  });

  it('treats missing order as Infinity (sorts last)', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'data', 'team', 'no-order.json'),
      JSON.stringify({ id: 'no-order', name: 'NO', role: { de: 'N', en: 'N' }, image: null })
    );
    const members = await loadTeam(tmpDir);
    expect(members[members.length - 1].id).toBe('no-order');
  });
});
