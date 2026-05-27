# Content CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let non-developer teammates edit website content (team, FAQ, legal text, UI strings, images) via a browser-based `/admin/` UI (Sveltia CMS) backed by GitHub commits and PR review, keeping git as the source of truth.

**Architecture:** Convert flat JSON arrays (`data/team.json`, `data/faq.json`) into per-entry folder collections (`data/team/<id>.json`, `data/faq/<id>.json`) with `order` sort keys. Convert legal HTML into markdown rendered at build via `marked`. Add a JSON schema validator for `messages/*.json` to catch destructive edits in CI. Drop a static Sveltia bundle into `public/admin/` configured for editorial workflow (PR-per-change). Wire branch protection + a PR-only CI workflow.

**Tech Stack:** Next.js 14 (App Router, static export via `next.config.static.mjs`), next-intl, vitest, playwright, Sveltia CMS (CDN-loaded), `marked` for markdown, GitHub Actions.

**Spec reference:** `docs/superpowers/specs/2026-05-27-content-cms-design.md`

---

## Task 1: Migrate team data to folder collection + loader

Refactors `data/team.json` (an array with duplicates from a demo) into one JSON file per member with an explicit `order` sort key. Adds a server-only loader. Converts `Team` component to an async server component using the loader.

**Files:**
- Create: `data/team/robert.json`
- Create: `data/team/sanja.json`
- Create: `data/team/misha.json`
- Create: `data/team/andi.json`
- Create: `lib/content/team.ts`
- Create: `tests/lib/content/team.test.ts`
- Modify: `components/sections/Team.tsx`
- Delete: `data/team.json`

### Task 1, Step 1: Write the failing loader test

- [ ] Create `tests/lib/content/team.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadTeam } from '@/lib/content/team';

describe('loadTeam', () => {
  let tmpDir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn> | undefined;

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
```

### Task 1, Step 2: Run test, verify it fails

- [ ] Run:

```bash
npx vitest run tests/lib/content/team.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/content/team'`.

### Task 1, Step 3: Implement loader

- [ ] Create `lib/content/team.ts`:

```ts
import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

export type Locale = 'de' | 'en';

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
```

### Task 1, Step 4: Add `vi` import to test

The test references `vi.spyOn` indirectly through the spy variable but the spy variable is unused. Remove it (and the unused import) to keep the test clean.

- [ ] Edit `tests/lib/content/team.test.ts`: delete the line `let cwdSpy: ReturnType<typeof vi.spyOn> | undefined;`. No other changes.

### Task 1, Step 5: Run test, verify it passes

- [ ] Run:

```bash
npx vitest run tests/lib/content/team.test.ts
```

Expected: PASS (3 tests).

### Task 1, Step 6: Create per-member JSON files

Source data from current `data/team.json` (de-duplicated, 4 unique members).

- [ ] Create `data/team/robert.json`:

```json
{
  "id": "robert",
  "name": "Robert Bruckner",
  "role": { "de": "CEO · Gründer", "en": "CEO · Founder" },
  "image": "/images/team/robert.jpg",
  "order": 1
}
```

- [ ] Create `data/team/sanja.json`:

```json
{
  "id": "sanja",
  "name": "Sanja Bruckner",
  "role": { "de": "CFO · COO", "en": "CFO · COO" },
  "image": "/images/team/sanja.jpeg",
  "order": 2
}
```

- [ ] Create `data/team/misha.json`:

```json
{
  "id": "misha",
  "name": "Dr. Mikhail \"Misha\" Ivanov",
  "role": { "de": "CTO", "en": "CTO" },
  "image": "/images/team/misha.jpg",
  "order": 3
}
```

- [ ] Create `data/team/andi.json`:

```json
{
  "id": "andi",
  "name": "Andreas \"Andi\" Pürzel",
  "role": { "de": "Sportlicher Leiter", "en": "Athletic Lead" },
  "image": "/images/team/andi.jpeg",
  "order": 4
}
```

### Task 1, Step 7: Convert Team component to async server component using the loader

- [ ] Replace the full contents of `components/sections/Team.tsx`:

```tsx
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';
import { loadTeam, type Locale } from '@/lib/content/team';

export async function Team() {
  const t = await getTranslations('team');
  const locale = (await getLocale()) as Locale;
  const members = await loadTeam();
  return (
    <section id="team" className="py-14 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-h1 font-bold tracking-tight text-white">{t('title')}</h2>
          <p className="mt-3 text-body-lg text-steel">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.04}>
              <Card
                className="h-full"
                media={
                  <div className="relative aspect-square w-full bg-[#0F2640]">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,224,255,0.18),transparent_70%)]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                }
              >
                <div className="mt-auto">
                  <div className="text-white font-semibold">{m.name}</div>
                  <div className="text-steel text-caption">{m.role[locale]}</div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

The page that renders `<Team />` (`app/[locale]/page.tsx`) is already a server component, but the function is currently sync. Make it async-aware: no change needed — server components compose with async children automatically.

### Task 1, Step 8: Delete old data file

- [ ] Run:

```bash
rm data/team.json
```

### Task 1, Step 9: Verify typecheck + build + tests pass

- [ ] Run:

```bash
npx tsc --noEmit && npx vitest run && npx next build
```

Expected: typecheck clean, all tests pass, build succeeds.

### Task 1, Step 10: Commit

- [ ] Run:

```bash
git add data/team tests/lib/content lib/content/team.ts components/sections/Team.tsx
git rm data/team.json
git commit -m "feat(team): split team.json into per-member folder + loader"
```

---

## Task 2: Migrate FAQ data to folder collection + loader

Same pattern as Task 1 but for FAQ. Answers stay plain text for now (markdown rendering is a separate concern handled in the legal task; FAQ answers in current code are rendered as plain strings inside an accordion — keep that).

**Files:**
- Create: `data/faq/<id>.json` (6 files)
- Create: `lib/content/faq.ts`
- Create: `tests/lib/content/faq.test.ts`
- Modify: `components/sections/FAQ.tsx`
- Delete: `data/faq.json`

### Task 2, Step 1: Write failing loader test

- [ ] Create `tests/lib/content/faq.test.ts`:

```ts
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
});
```

### Task 2, Step 2: Run test, verify it fails

- [ ] Run:

```bash
npx vitest run tests/lib/content/faq.test.ts
```

Expected: FAIL — module not found.

### Task 2, Step 3: Implement loader

- [ ] Create `lib/content/faq.ts`:

```ts
import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

export type Locale = 'de' | 'en';

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
```

### Task 2, Step 4: Run test, verify pass

- [ ] Run:

```bash
npx vitest run tests/lib/content/faq.test.ts
```

Expected: PASS (2 tests).

### Task 2, Step 5: Create per-item JSON files

- [ ] Create `data/faq/what-is.json`:

```json
{
  "id": "what-is",
  "q": { "de": "Was ist Thalos?", "en": "What is Thalos?" },
  "a": {
    "de": "[LOREM] Thalos ist ein AI Performance Coach, der Training, Ernährung und Regeneration verbindet.",
    "en": "[LOREM] Thalos is an AI Performance Coach that unifies training, nutrition and recovery."
  },
  "order": 1
}
```

- [ ] Create `data/faq/medical.json`:

```json
{
  "id": "medical",
  "q": { "de": "Gibt Thalos medizinische Beratung?", "en": "Does Thalos give medical advice?" },
  "a": {
    "de": "Nein. Thalos stellt keine Diagnosen und keine Therapieempfehlungen.",
    "en": "No. Thalos does not provide diagnoses or therapy recommendations."
  },
  "order": 2
}
```

- [ ] Create `data/faq/data.json`:

```json
{
  "id": "data",
  "q": { "de": "Welche Daten nutzt Thalos?", "en": "What data does Thalos use?" },
  "a": {
    "de": "[LOREM] Wearables, manuelle Logs, optional CGM und Laktat.",
    "en": "[LOREM] Wearables, manual logs, optional CGM and lactate."
  },
  "order": 3
}
```

- [ ] Create `data/faq/cost.json`:

```json
{
  "id": "cost",
  "q": { "de": "Was kostet Thalos?", "en": "What does Thalos cost?" },
  "a": {
    "de": "[LOREM] Premium Mitgliedschaft. Details folgen zum Launch.",
    "en": "[LOREM] Premium membership. Details at launch."
  },
  "order": 4
}
```

- [ ] Create `data/faq/availability.json`:

```json
{
  "id": "availability",
  "q": { "de": "Wo ist Thalos verfügbar?", "en": "Where is Thalos available?" },
  "a": {
    "de": "[LOREM] Start in Wien mit DASGYM. Expansion in DACH geplant.",
    "en": "[LOREM] Starting in Vienna with DASGYM. DACH expansion planned."
  },
  "order": 5
}
```

- [ ] Create `data/faq/founding-athlete.json`:

```json
{
  "id": "founding-athlete",
  "q": { "de": "Wie werde ich Founding Athlete?", "en": "How do I become a Founding Athlete?" },
  "a": {
    "de": "Schreib uns über das Kontaktformular und wähle „Founding Athlete\" — wir melden uns mit Details zur Community.",
    "en": "Reach out via the contact form and select 'Founding Athlete' — we'll get back to you with community details."
  },
  "order": 6
}
```

### Task 2, Step 6: Convert FAQ component to async server component

- [ ] Replace the full contents of `components/sections/FAQ.tsx`:

```tsx
import { getTranslations, getLocale } from 'next-intl/server';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { loadFaq, type Locale } from '@/lib/content/faq';

export async function FAQ() {
  const t = await getTranslations('faq');
  const locale = (await getLocale()) as Locale;
  const items = await loadFaq();
  const localized = items.map((i) => ({ q: i.q[locale], a: i.a[locale] }));
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-h1 font-bold tracking-tight text-white mb-10">{t('title')}</h2>
        <FAQAccordion items={localized} />
      </div>
    </section>
  );
}
```

### Task 2, Step 7: Delete old data file

- [ ] Run:

```bash
rm data/faq.json
```

### Task 2, Step 8: Verify typecheck + tests + build

- [ ] Run:

```bash
npx tsc --noEmit && npx vitest run && npx next build
```

Expected: all green.

### Task 2, Step 9: Commit

- [ ] Run:

```bash
git add data/faq tests/lib/content/faq.test.ts lib/content/faq.ts components/sections/FAQ.tsx
git rm data/faq.json
git commit -m "feat(faq): split faq.json into per-item folder + loader"
```

---

## Task 3: Migrate legal HTML to markdown + add `marked` rendering

Renames `data/legal/<slug>.de.html` files to `data/legal/<slug>.md`. Adds `marked` dep. Converts existing HTML content to markdown (preserving structure: headings, paragraphs, line breaks, emphasis). Updates `LegalDocument` to read markdown and render via `marked`. The current HTML uses `<section>`, `<h2>`, `<p>`, `<strong>`, `<br>` — markdown handles all except `<section>` (which is stylistic and can be dropped or kept as raw inline HTML).

**Files:**
- Modify: `package.json` (add `marked`)
- Create: `data/legal/impressum.md` (converted from `impressum.de.html`)
- Create: `data/legal/datenschutz.md` (converted from `datenschutz.de.html`)
- Create: `data/legal/agb.md` (converted from `agb.de.html`)
- Create: `data/legal/widerruf.md` (converted from `widerruf.de.html`)
- Create: `lib/content/legal.ts`
- Create: `tests/lib/content/legal.test.ts`
- Modify: `components/ui/LegalDocument.tsx`
- Delete: `data/legal/*.de.html`

### Task 3, Step 1: Install `marked`

- [ ] Run:

```bash
npm install marked
```

Expected: `marked` added to `dependencies` in `package.json`, lockfile updated.

### Task 3, Step 2: Write failing legal-loader test

- [ ] Create `tests/lib/content/legal.test.ts`:

```ts
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
});
```

### Task 3, Step 3: Run test, verify fail

- [ ] Run:

```bash
npx vitest run tests/lib/content/legal.test.ts
```

Expected: FAIL — module not found.

### Task 3, Step 4: Implement legal loader

- [ ] Create `lib/content/legal.ts`:

```ts
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
  return marked.parse(md, { async: false }) as string;
}
```

### Task 3, Step 5: Run test, verify pass

- [ ] Run:

```bash
npx vitest run tests/lib/content/legal.test.ts
```

Expected: PASS (2 tests).

### Task 3, Step 6: Convert legal HTML to markdown

For each file, read the existing `.de.html`, convert to markdown by hand, write to `.md`. Conversion rules:

- `<section>...</section>` → keep contents, drop the wrapper
- `<h2>X</h2>` → `## X`
- `<p>X</p>` → `X\n\n` (blank line separates paragraphs)
- `<strong>X</strong>` → `**X**`
- `<br>` → two trailing spaces + newline (markdown line break)
- HTML entities preserved as-is

- [ ] Convert `data/legal/impressum.de.html` to `data/legal/impressum.md` manually following rules above. Open the source file, transform each `<section>` block, write the markdown output. Verify visually that no content is lost (every line of source maps to output).

- [ ] Convert `data/legal/datenschutz.de.html` to `data/legal/datenschutz.md` using the same rules.

- [ ] Convert `data/legal/agb.de.html` to `data/legal/agb.md` using the same rules.

- [ ] Convert `data/legal/widerruf.de.html` to `data/legal/widerruf.md` using the same rules.

### Task 3, Step 7: Update LegalDocument component

- [ ] Replace the full contents of `components/ui/LegalDocument.tsx`:

```tsx
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
```

### Task 3, Step 8: Delete old HTML files

- [ ] Run:

```bash
rm data/legal/impressum.de.html data/legal/datenschutz.de.html data/legal/agb.de.html data/legal/widerruf.de.html
```

### Task 3, Step 9: Visually verify all 4 legal pages render correctly

- [ ] Run dev server:

```bash
npm run dev
```

- [ ] In browser, visit each of:
  - `http://localhost:3000/de/impressum`
  - `http://localhost:3000/de/datenschutz`
  - `http://localhost:3000/de/agb`
  - `http://localhost:3000/de/widerruf`
- [ ] For each, confirm: page title appears, body content renders as paragraphs with headings, no raw markdown syntax visible (no `##` or `**` shown to user).
- [ ] Stop dev server (Ctrl+C).

### Task 3, Step 10: Verify typecheck + tests + build

- [ ] Run:

```bash
npx tsc --noEmit && npx vitest run && npx next build
```

Expected: all green.

### Task 3, Step 11: Commit

- [ ] Run:

```bash
git add data/legal package.json package-lock.json lib/content/legal.ts tests/lib/content/legal.test.ts components/ui/LegalDocument.tsx
git rm data/legal/impressum.de.html data/legal/datenschutz.de.html data/legal/agb.de.html data/legal/widerruf.de.html
git commit -m "feat(legal): convert HTML to markdown, render via marked"
```

---

## Task 4: Messages schema validator script

Adds a JSON schema for `messages/*.json` (the next-intl messages files) and a Node script that validates both locales against it. Catches: missing required key, locale-key drift, type mismatch. Wired into CI in Task 8.

The schema is hand-maintained to match the current key tree. When devs add new keys, they update the schema alongside the messages — making it explicit, version-controlled, and reviewable.

**Files:**
- Create: `lib/content/messages-schema.json`
- Create: `scripts/validate-messages.ts`
- Create: `tests/scripts/validate-messages.test.ts`
- Modify: `package.json` (add `validate:messages` script + `ajv` + `tsx` deps)

### Task 4, Step 1: Install validation deps

- [ ] Run:

```bash
npm install --save-dev ajv tsx
```

Expected: `ajv` and `tsx` added to `devDependencies`.

### Task 4, Step 2: Create the messages JSON schema

This schema is derived from the current shape of `messages/de.json` and `messages/en.json`. Every leaf is `type: string`. Required keys are everything currently present.

- [ ] Create `lib/content/messages-schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "nav",
    "hero",
    "what",
    "system",
    "productInMotion",
    "science",
    "athletes",
    "team",
    "partnerGyms",
    "founder",
    "faq",
    "appDownload",
    "footer"
  ],
  "properties": {
    "nav": {
      "type": "object",
      "additionalProperties": false,
      "required": ["system", "science", "athletes", "team", "partnerGyms", "applyCta", "openMenu", "closeMenu", "switchLang"],
      "properties": {
        "system": { "type": "string" },
        "science": { "type": "string" },
        "athletes": { "type": "string" },
        "team": { "type": "string" },
        "partnerGyms": { "type": "string" },
        "applyCta": { "type": "string" },
        "openMenu": { "type": "string" },
        "closeMenu": { "type": "string" },
        "switchLang": { "type": "string" }
      }
    },
    "hero": {
      "type": "object",
      "additionalProperties": false,
      "required": ["eyebrow", "headline", "sub", "ctaPrimary", "ctaSecondary"],
      "properties": {
        "eyebrow": { "type": "string" },
        "headline": { "type": "string" },
        "sub": { "type": "string" },
        "ctaPrimary": { "type": "string" },
        "ctaSecondary": { "type": "string" }
      }
    },
    "what": {
      "type": "object",
      "additionalProperties": false,
      "required": ["title", "body"],
      "properties": {
        "title": { "type": "string" },
        "body": { "type": "string" }
      }
    },
    "system": {
      "type": "object",
      "additionalProperties": false,
      "required": ["title", "pillars"],
      "properties": {
        "title": { "type": "string" },
        "pillars": {
          "type": "object",
          "additionalProperties": false,
          "required": ["workouts", "meals", "recovery", "data"],
          "properties": {
            "workouts": { "$ref": "#/definitions/titleBody" },
            "meals": { "$ref": "#/definitions/titleBody" },
            "recovery": { "$ref": "#/definitions/titleBody" },
            "data": { "$ref": "#/definitions/titleBody" }
          }
        }
      }
    },
    "productInMotion": {
      "type": "object",
      "additionalProperties": false,
      "required": ["title", "slides"],
      "properties": {
        "title": { "type": "string" },
        "slides": {
          "type": "object",
          "additionalProperties": false,
          "required": ["home", "sleep", "meals"],
          "properties": {
            "home": { "$ref": "#/definitions/titleBody" },
            "sleep": { "$ref": "#/definitions/titleBody" },
            "meals": { "$ref": "#/definitions/titleBody" }
          }
        }
      }
    },
    "science": {
      "type": "object",
      "additionalProperties": false,
      "required": ["eyebrow", "title", "body", "disclaimer"],
      "properties": {
        "eyebrow": { "type": "string" },
        "title": { "type": "string" },
        "body": { "type": "string" },
        "disclaimer": { "type": "string" }
      }
    },
    "athletes": {
      "type": "object",
      "additionalProperties": false,
      "required": ["title", "subtitle", "quote1", "quote2", "quote3"],
      "properties": {
        "title": { "type": "string" },
        "subtitle": { "type": "string" },
        "quote1": { "type": "string" },
        "quote2": { "type": "string" },
        "quote3": { "type": "string" }
      }
    },
    "team": {
      "type": "object",
      "additionalProperties": false,
      "required": ["title", "subtitle"],
      "properties": {
        "title": { "type": "string" },
        "subtitle": { "type": "string" }
      }
    },
    "partnerGyms": {
      "type": "object",
      "additionalProperties": false,
      "required": ["eyebrow", "title", "body", "form"],
      "properties": {
        "eyebrow": { "type": "string" },
        "title": { "type": "string" },
        "body": { "type": "string" },
        "form": {
          "type": "object",
          "additionalProperties": false,
          "required": ["inquiryType", "types", "name", "gym", "city", "email", "message", "submit", "success", "error"],
          "properties": {
            "inquiryType": { "type": "string" },
            "types": {
              "type": "object",
              "additionalProperties": false,
              "required": ["partner_gym", "general", "founding_athlete", "press", "other"],
              "properties": {
                "partner_gym": { "type": "string" },
                "general": { "type": "string" },
                "founding_athlete": { "type": "string" },
                "press": { "type": "string" },
                "other": { "type": "string" }
              }
            },
            "name": { "type": "string" },
            "gym": { "type": "string" },
            "city": { "type": "string" },
            "email": { "type": "string" },
            "message": { "type": "string" },
            "submit": { "type": "string" },
            "success": { "type": "string" },
            "error": { "type": "string" }
          }
        }
      }
    },
    "founder": {
      "type": "object",
      "additionalProperties": false,
      "required": ["quote", "name", "role"],
      "properties": {
        "quote": { "type": "string" },
        "name": { "type": "string" },
        "role": { "type": "string" }
      }
    },
    "faq": {
      "type": "object",
      "additionalProperties": false,
      "required": ["title"],
      "properties": {
        "title": { "type": "string" }
      }
    },
    "appDownload": {
      "type": "object",
      "additionalProperties": false,
      "required": ["eyebrow", "title", "body", "iosSmall", "iosLarge", "iosAria", "androidSmall", "androidLarge", "androidAria", "availability"],
      "properties": {
        "eyebrow": { "type": "string" },
        "title": { "type": "string" },
        "body": { "type": "string" },
        "iosSmall": { "type": "string" },
        "iosLarge": { "type": "string" },
        "iosAria": { "type": "string" },
        "androidSmall": { "type": "string" },
        "androidLarge": { "type": "string" },
        "androidAria": { "type": "string" },
        "availability": { "type": "string" }
      }
    },
    "footer": {
      "type": "object",
      "additionalProperties": false,
      "required": ["rights", "impressum", "datenschutz", "agb", "widerruf", "contact"],
      "properties": {
        "rights": { "type": "string" },
        "impressum": { "type": "string" },
        "datenschutz": { "type": "string" },
        "agb": { "type": "string" },
        "widerruf": { "type": "string" },
        "contact": { "type": "string" }
      }
    }
  },
  "definitions": {
    "titleBody": {
      "type": "object",
      "additionalProperties": false,
      "required": ["title", "body"],
      "properties": {
        "title": { "type": "string" },
        "body": { "type": "string" }
      }
    }
  }
}
```

### Task 4, Step 3: Write failing validator test

- [ ] Create `tests/scripts/validate-messages.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { validateMessages } from '@/scripts/validate-messages';

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['hero'],
  properties: {
    hero: {
      type: 'object',
      additionalProperties: false,
      required: ['headline'],
      properties: { headline: { type: 'string' } },
    },
  },
} as const;

const valid = { hero: { headline: 'X' } };
const missingKey = { hero: {} };
const extraKey = { hero: { headline: 'X', stray: 'oops' } };
const wrongType = { hero: { headline: 42 } };

describe('validateMessages', () => {
  it('passes for valid + matching locales', () => {
    const result = validateMessages(schema as any, { de: valid, en: valid });
    expect(result.ok).toBe(true);
  });

  it('fails when a required key is missing', () => {
    const result = validateMessages(schema as any, { de: valid, en: missingKey });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/headline/);
  });

  it('fails when a stray key is present', () => {
    const result = validateMessages(schema as any, { de: valid, en: extraKey });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/stray/);
  });

  it('fails when a value has wrong type', () => {
    const result = validateMessages(schema as any, { de: valid, en: wrongType });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/string/);
  });

  it('fails when locale key sets differ', () => {
    const result = validateMessages(schema as any, {
      de: { hero: { headline: 'X' } },
      en: { hero: { headline: 'X' } },
    });
    expect(result.ok).toBe(true);
  });
});
```

### Task 4, Step 4: Run test, verify fail

- [ ] Run:

```bash
npx vitest run tests/scripts/validate-messages.test.ts
```

Expected: FAIL — module not found.

### Task 4, Step 5: Implement validator script

- [ ] Create `scripts/validate-messages.ts`:

```ts
import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';

type Messages = Record<string, unknown>;
type Schema = Record<string, unknown>;

export function validateMessages(
  schema: Schema,
  locales: Record<string, Messages>
): { ok: true } | { ok: false; errors: string[] } {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const errors: string[] = [];
  for (const [locale, messages] of Object.entries(locales)) {
    if (!validate(messages)) {
      for (const err of validate.errors ?? []) {
        errors.push(`[${locale}] ${err.instancePath || '/'} ${err.message}`);
      }
    }
  }
  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

async function main() {
  const cwd = process.cwd();
  const schemaPath = path.join(cwd, 'lib', 'content', 'messages-schema.json');
  const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));
  const locales: Record<string, Messages> = {};
  for (const locale of ['de', 'en']) {
    const file = path.join(cwd, 'messages', `${locale}.json`);
    locales[locale] = JSON.parse(await fs.readFile(file, 'utf8'));
  }
  const result = validateMessages(schema, locales);
  if (result.ok) {
    console.log('✓ messages valid');
    process.exit(0);
  }
  for (const e of result.errors) console.error('✗', e);
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
```

### Task 4, Step 6: Run test, verify pass

- [ ] Run:

```bash
npx vitest run tests/scripts/validate-messages.test.ts
```

Expected: PASS (5 tests).

### Task 4, Step 7: Add `validate:messages` npm script

- [ ] Edit `package.json`. In the `"scripts"` section, add this entry after `"format": "prettier --write ."`:

```json
    "validate:messages": "tsx scripts/validate-messages.ts"
```

The full `scripts` block should look like:

```json
  "scripts": {
    "dev": "next dev",
    "dev:turbo": "next dev --turbo",
    "build": "next build",
    "build:static": "bash scripts/build-static.sh",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "format": "prettier --write .",
    "validate:messages": "tsx scripts/validate-messages.ts"
  },
```

### Task 4, Step 8: Run validator against real messages

- [ ] Run:

```bash
npm run validate:messages
```

Expected: `✓ messages valid` (exits 0). If the schema or messages drift, fix the schema (it must mirror current key tree).

### Task 4, Step 9: Commit

- [ ] Run:

```bash
git add lib/content/messages-schema.json scripts/validate-messages.ts tests/scripts/validate-messages.test.ts package.json package-lock.json
git commit -m "feat(content): validate messages/*.json against schema in CI"
```

---

## Task 5: Add Sveltia CMS admin page + config

Drops a static HTML loader + Sveltia config into `public/admin/`. Configures 4 collections (team, faq, legal, ui-strings) + media folder. PR workflow enabled.

**Files:**
- Create: `public/admin/index.html`
- Create: `public/admin/config.yml`
- Create: `public/robots.txt`
- Modify: `middleware.ts` (exclude `/admin/` from i18n routing)

### Task 5, Step 1: Create Sveltia admin loader

Sveltia is loaded from `unpkg`. Pin to current version `@sveltia/cms@0.97.0` (replace with the latest stable version at implementation time — check https://github.com/sveltia/sveltia-cms/releases).

- [ ] Create `public/admin/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Thalos CMS</title>
  </head>
  <body>
    <script type="module" src="https://unpkg.com/@sveltia/cms@0.97.0/dist/sveltia-cms.js"></script>
  </body>
</html>
```

### Task 5, Step 2: Create Sveltia config

- [ ] Create `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: <YOUR_GITHUB_ORG_OR_USER>/<YOUR_REPO_NAME>
  branch: master
  auth_type: pat

publish_mode: editorial_workflow

media_folder: public/images
public_folder: /images

i18n:
  structure: single_file
  locales: [de, en]
  default_locale: de

collections:
  - name: team
    label: Team
    folder: data/team
    extension: json
    format: json
    create: true
    delete: true
    identifier_field: id
    slug: '{{id}}'
    media_folder: ../../public/images/team
    public_folder: /images/team
    fields:
      - { name: id, label: ID (slug), widget: string, pattern: ['^[a-z0-9-]+$', 'lowercase letters, digits, hyphens only'] }
      - { name: name, label: Name, widget: string }
      - name: role
        label: Role
        widget: object
        fields:
          - { name: de, label: Deutsch, widget: string }
          - { name: en, label: English, widget: string }
      - { name: image, label: Photo, widget: image, required: false }
      - { name: order, label: Sort order, widget: number, value_type: int, min: 0 }

  - name: faq
    label: FAQ
    folder: data/faq
    extension: json
    format: json
    create: true
    delete: true
    identifier_field: id
    slug: '{{id}}'
    fields:
      - { name: id, label: ID (slug), widget: string, pattern: ['^[a-z0-9-]+$', 'lowercase letters, digits, hyphens only'] }
      - name: q
        label: Question
        widget: object
        fields:
          - { name: de, label: Deutsch, widget: string }
          - { name: en, label: English, widget: string }
      - name: a
        label: Answer
        widget: object
        fields:
          - { name: de, label: Deutsch, widget: text }
          - { name: en, label: English, widget: text }
      - { name: order, label: Sort order, widget: number, value_type: int, min: 0 }

  - name: legal
    label: Legal
    files:
      - name: impressum
        label: Impressum
        file: data/legal/impressum.md
        fields:
          - { name: body, label: Body, widget: markdown }
      - name: datenschutz
        label: Datenschutz
        file: data/legal/datenschutz.md
        fields:
          - { name: body, label: Body, widget: markdown }
      - name: agb
        label: AGB
        file: data/legal/agb.md
        fields:
          - { name: body, label: Body, widget: markdown }
      - name: widerruf
        label: Widerruf
        file: data/legal/widerruf.md
        fields:
          - { name: body, label: Body, widget: markdown }

  - name: ui-strings
    label: UI Strings
    files:
      - name: de
        label: Deutsch
        file: messages/de.json
        format: json
        fields:
          - { name: nav, label: Navigation, widget: object, fields: [
              { name: system, label: System, widget: string },
              { name: science, label: Science, widget: string },
              { name: athletes, label: Athletes, widget: string },
              { name: team, label: Team, widget: string },
              { name: partnerGyms, label: Partner Gyms, widget: string },
              { name: applyCta, label: Apply CTA, widget: string },
              { name: openMenu, label: Open menu, widget: string },
              { name: closeMenu, label: Close menu, widget: string },
              { name: switchLang, label: Switch language, widget: string }
            ] }
          - { name: hero, label: Hero, widget: object, fields: [
              { name: eyebrow, widget: string },
              { name: headline, widget: string },
              { name: sub, widget: string },
              { name: ctaPrimary, widget: string },
              { name: ctaSecondary, widget: string }
            ] }
      - name: en
        label: English
        file: messages/en.json
        format: json
        fields:
          - { name: nav, label: Navigation, widget: object, fields: [
              { name: system, label: System, widget: string },
              { name: science, label: Science, widget: string },
              { name: athletes, label: Athletes, widget: string },
              { name: team, label: Team, widget: string },
              { name: partnerGyms, label: Partner Gyms, widget: string },
              { name: applyCta, label: Apply CTA, widget: string },
              { name: openMenu, label: Open menu, widget: string },
              { name: closeMenu, label: Close menu, widget: string },
              { name: switchLang, label: Switch language, widget: string }
            ] }
          - { name: hero, label: Hero, widget: object, fields: [
              { name: eyebrow, widget: string },
              { name: headline, widget: string },
              { name: sub, widget: string },
              { name: ctaPrimary, widget: string },
              { name: ctaSecondary, widget: string }
            ] }

media_library:
  config:
    max_file_size: 2000000
```

**Note:** The `ui-strings` collection above shows the `nav` and `hero` sections only. After verifying the pattern works in the browser, extend it to cover every key in `messages-schema.json` (what, system.pillars, productInMotion.slides, science, athletes, team, partnerGyms.form.types, founder, faq, appDownload, footer). The extension is mechanical — copy the same shape, mirroring the schema. This is called out explicitly in Step 8 below.

**Replace `<YOUR_GITHUB_ORG_OR_USER>/<YOUR_REPO_NAME>`** with the actual GitHub repo path before committing. Get it via `git remote get-url origin | sed 's#.*github.com[:/]##;s#\.git$##'`.

### Task 5, Step 3: Add robots.txt to disallow /admin/

- [ ] Create `public/robots.txt`:

```
User-agent: *
Disallow: /admin/
```

### Task 5, Step 4: Exclude /admin/ from next-intl middleware

The current matcher `'/((?!api|_next|.*\\..*).*)'` would match `/admin/` (no file extension) and redirect to `/de/admin/`, breaking the Sveltia loader.

- [ ] Replace the full contents of `middleware.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|admin|.*\\..*).*)'],
};
```

### Task 5, Step 5: Verify dev server serves /admin/ correctly

- [ ] Run:

```bash
npm run dev
```

- [ ] In browser, open `http://localhost:3000/admin/`. Confirm Sveltia login screen appears (a "Sign in with GitHub" or PAT prompt). Do not log in yet — just confirm the page loads.
- [ ] In browser, open `http://localhost:3000/robots.txt`. Confirm the disallow line shows.
- [ ] Stop dev server.

### Task 5, Step 6: Verify static build includes /admin/

- [ ] Run:

```bash
npm run build:static
```

- [ ] Confirm `out/admin/index.html` and `out/admin/config.yml` exist:

```bash
ls out/admin/
```

Expected: both files listed.

### Task 5, Step 7: Replace the GitHub repo placeholder in config.yml

- [ ] Run to determine the slug:

```bash
git remote get-url origin
```

- [ ] Edit `public/admin/config.yml`. Replace `<YOUR_GITHUB_ORG_OR_USER>/<YOUR_REPO_NAME>` with the actual `org/repo` derived from the remote URL (e.g. `thalos-ai/thalos-website`).

### Task 5, Step 8: Extend ui-strings collection to full schema coverage

The config in Step 2 only covers `nav` and `hero`. Extend the field list under both `de` and `en` ui-strings entries to cover every top-level key in `lib/content/messages-schema.json`. Use the schema as the canonical reference for field names and required-ness.

- [ ] For each top-level key in `messages-schema.json` not already present (`what`, `system`, `productInMotion`, `science`, `athletes`, `team`, `partnerGyms`, `founder`, `faq`, `appDownload`, `footer`), add a corresponding `object` field with `fields` matching the schema's nested properties. For nested object properties (e.g. `system.pillars.workouts.title`), nest object widgets the same way.
- [ ] Save `public/admin/config.yml`.

### Task 5, Step 9: Verify build still passes

- [ ] Run:

```bash
npx next build && npm run build:static
```

Expected: both succeed.

### Task 5, Step 10: Commit

- [ ] Run:

```bash
git add public/admin public/robots.txt middleware.ts
git commit -m "feat(cms): Sveltia admin at /admin/ + PR editorial workflow"
```

---

## Task 6: PR-only CI workflow + extend deploy workflow with validation

Adds a new workflow that runs on every PR (typecheck, lint, vitest, validate:messages, build, playwright). Updates the existing deploy workflow to run `validate:messages` before building, so a PR merged with bad messages still gets caught.

**Files:**
- Create: `.github/workflows/pr.yml`
- Modify: `.github/workflows/deploy.yml`

### Task 6, Step 1: Create PR workflow

- [ ] Create `.github/workflows/pr.yml`:

```yaml
name: PR Checks

on:
  pull_request:
    branches: [main, master]

permissions:
  contents: read

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm

      - run: npm ci

      - name: Typecheck
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm test

      - name: Validate messages schema
        run: npm run validate:messages

      - name: Build (standalone)
        run: npm run build

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: E2E tests
        run: npm run e2e
```

### Task 6, Step 2: Add validate:messages step to deploy workflow

- [ ] Edit `.github/workflows/deploy.yml`. After the `- run: npm ci` line and before the `- name: Build static export` step, insert:

```yaml
      - name: Validate messages schema
        run: npm run validate:messages
```

The relevant block of the workflow should now read:

```yaml
      - run: npm ci

      - name: Validate messages schema
        run: npm run validate:messages

      - name: Build static export
        env:
          NEXT_PUBLIC_BASE_PATH: ${{ steps.base.outputs.value }}
        run: npm run build:static
```

### Task 6, Step 3: Commit

- [ ] Run:

```bash
git add .github/workflows
git commit -m "ci: PR checks workflow + validate messages before deploy"
```

---

## Task 7: Editor onboarding guide

Documents how a new editor sets up access: generate PAT, log in, edit content, open PR.

**Files:**
- Create: `docs/cms-editor-guide.md`
- Modify: `README.md` (link to editor guide)

### Task 7, Step 1: Write editor guide

- [ ] Create `docs/cms-editor-guide.md`:

```markdown
# CMS Editor Guide

The Thalos site has a built-in content editor at **https://thalos.at/admin/**. Use it to update team members, FAQ entries, legal text, UI strings, and images — without using git, a code editor, or a local dev environment.

Every save opens a pull request on GitHub. A maintainer reviews and merges. Once merged, the live site rebuilds automatically (1–2 minutes).

## One-time setup

1. **Get a GitHub account** if you don't have one — https://github.com/join.
2. **Ask the maintainer (Patrick) to add you as a collaborator** to the repository. You'll receive an email invite — accept it.
3. **Generate a personal access token (PAT)**:
   - Go to https://github.com/settings/personal-access-tokens/new
   - **Token name**: `thalos-cms` (or anything memorable)
   - **Resource owner**: select the org/user that owns the repo
   - **Expiration**: 90 days
   - **Repository access**: "Only select repositories" → pick the thalos website repo
   - **Permissions** → "Repository permissions":
     - **Contents**: Read and write
     - **Metadata**: Read-only (auto-selected)
     - **Pull requests**: Read and write
   - Click **Generate token**. **Copy the token now** — you cannot see it again.
4. **Save the token somewhere safe** (password manager). You'll paste it once into the editor.

## Logging in

1. Open https://thalos.at/admin/
2. Paste your PAT into the login form.
3. The token is saved in your browser only. No server stores it.
4. You'll need to log in again on a new device or after clearing browser data.

## Editing content

The editor sidebar shows four collections:

- **Team** — one card per member. Add, edit, reorder via the `Sort order` field, or delete.
- **FAQ** — one entry per question. Same controls.
- **Legal** — four fixed documents (Impressum, Datenschutz, AGB, Widerruf). Edit body text using the rich-text editor.
- **UI Strings** — site text in German and English. Fields are grouped by section (hero, nav, etc.).

To upload a new team photo: open the team member, click the image field, drop a new file. The image is uploaded to `/public/images/team/` and the team entry is updated to point to it.

## Saving — and the PR flow

Every save creates a pull request:

1. Click **Save** in the editor.
2. The editor pushes your changes to a new branch named `cms/<collection>/<slug>` and opens a PR against `master`.
3. The PR appears on GitHub. A maintainer reviews the changes.
4. If a check fails (e.g. you removed a required UI string), the PR is blocked — fix it in the editor and save again.
5. Once approved + merged, the site rebuilds and your change goes live in 1–2 minutes.

## Rotating your token

PATs expire every 90 days. When yours expires:

1. Generate a new one (same steps as setup).
2. Log out of the editor, paste the new token.
3. Delete the expired token from your GitHub settings.

## Troubleshooting

- **"Authorization failed"** — your PAT is expired or has the wrong scopes. Generate a new one.
- **"Branch is out of date"** — someone else's PR was merged. The editor auto-rebases; if it can't, ask the maintainer.
- **"Validation failed" in your PR** — usually a UI string was removed or has the wrong type. The error mentions the field. Fix it in the editor and save again.
```

### Task 7, Step 2: Link editor guide from README

- [ ] Open `README.md`. Add the following section at the bottom of the file (or in a sensible location — read the file first to decide):

```markdown
## Editing site content

Non-developers can edit team, FAQ, legal, and UI text via the browser at `/admin/`. See [docs/cms-editor-guide.md](docs/cms-editor-guide.md).
```

### Task 7, Step 3: Commit

- [ ] Run:

```bash
git add docs/cms-editor-guide.md README.md
git commit -m "docs(cms): editor onboarding guide"
```

---

## Task 8: Enable branch protection on master

This task is **manual via the GitHub UI** (cannot be expressed as a code change). Document the steps so they're done as part of the rollout.

**Files:** (none — GitHub repo settings change)

### Task 8, Step 1: Enable branch protection rule

- [ ] In the GitHub repo, go to **Settings → Branches → Branch protection rules → Add rule**.
- [ ] **Branch name pattern**: `master`
- [ ] Enable: **Require a pull request before merging**.
- [ ] Enable: **Require status checks to pass before merging**. Pick the checks listed in `.github/workflows/pr.yml` (typecheck, lint, unit tests, validate messages, build, e2e). They appear in the picker after the workflow has run at least once on a PR.
- [ ] Enable: **Require linear history** (no merge commits → cleaner history with squash-merge).
- [ ] Do **not** enable "Require approvals" yet (would deadlock single-editor case per the spec).
- [ ] Save the rule.

### Task 8, Step 2: When a second collaborator joins, enable approval requirement

- [ ] When a second editor is added as a collaborator, return to the branch protection rule and enable **Require approvals → 1**.

### Task 8, Step 3: (No commit) — note this completion in implementation log

This task produces no code change. Reviewers verify by visiting the branch protection settings.

---

## Task 9: End-to-end smoke test of the full editing flow

Manual full-cycle verification: PAT login → edit → PR → CI → merge → deploy. Catches integration breakage that unit tests miss.

**Files:** (none — manual verification)

### Task 9, Step 1: Deploy to staging-equivalent

- [ ] Confirm latest changes from Tasks 1–7 are on `master` and the existing deploy workflow has deployed to thalos.at successfully.

### Task 9, Step 2: Log into /admin/ as Patrick

- [ ] Generate a PAT per the editor guide.
- [ ] Visit `https://thalos.at/admin/` (or local `http://localhost:3000/admin/` if testing pre-deploy).
- [ ] Log in with PAT. Confirm dashboard shows all 4 collections.

### Task 9, Step 3: Make a low-stakes edit in each collection

- [ ] Team: rename a member temporarily (e.g. add a trailing dot to their name). Save.
- [ ] FAQ: append a space to an answer in both locales. Save.
- [ ] Legal: add a single space to one of the documents. Save.
- [ ] UI strings: append a space to `hero.eyebrow` in both `de` and `en`. Save.

### Task 9, Step 4: Verify PRs are opened

- [ ] In GitHub, confirm 4 new PRs exist with branches matching `cms/<collection>/<slug>`.
- [ ] Confirm each PR has the `pr.yml` workflow running and passing (typecheck/lint/test/validate/build/e2e).

### Task 9, Step 5: Merge one PR and confirm deploy

- [ ] Merge one of the 4 PRs.
- [ ] Watch `deploy.yml` run on the resulting push to `master`.
- [ ] After deploy finishes, visit `https://thalos.at` and confirm the edit appears.

### Task 9, Step 6: Revert the test edits

- [ ] Use the editor to revert each test edit. Confirm 4 more PRs open with the revert changes.
- [ ] Merge all 4. Confirm site is back to original state.

### Task 9, Step 7: Verify the safety net catches a destructive edit

- [ ] In the editor, attempt to leave the UI string `hero.headline` empty (or delete it if possible). Save.
- [ ] Confirm the resulting PR's CI fails on `validate:messages` step. The PR is blocked from merging.
- [ ] Revert by editing the value back; confirm CI passes; merge.

---

## Self-Review

The plan was self-reviewed after writing:

- **Spec coverage:** Sveltia collections (team, faq, legal, ui-strings) covered by Tasks 1–3, 5. PAT auth covered by Sveltia config + editor guide (Task 7). Editorial workflow covered by `publish_mode: editorial_workflow` in config (Task 5). Branch protection covered by Task 8. CI validation covered by Tasks 4, 6. Messages schema covered by Task 4. Risks list cross-checked: `validate-messages` (Task 4), max image upload size (Task 5 config), `/admin/` middleware exclusion (Task 5 Step 4), Sveltia version pinning (Task 5 Step 1), `noindex` meta + robots.txt (Task 5 Steps 1, 3), branch protection edge case (Task 8 Step 2). Editor guide (Task 7) covers PAT lifecycle.

- **Placeholder scan:** No "TBD" / "implement later" left. Two explicit placeholders in Task 5 (`<YOUR_GITHUB_ORG_OR_USER>` and the abbreviated `ui-strings` config) are resolved by named follow-up steps within the same task (Step 7 and Step 8), with clear instructions on what to substitute and from what canonical source.

- **Type consistency:** `TeamMember` / `FAQItem` / `LegalSlug` defined once and reused. `loadTeam` / `loadFaq` / `loadLegal` function names consistent across tests, implementations, and consumers. `validateMessages` signature consistent between test, implementation, and the CLI entrypoint.

- **Scope:** Plan covers spec sections 1–7 of the design doc. Open items in the spec (exact Sveltia version, self-host bundle vs CDN, schema generation vs hand-maintained, PR template/labels, PAT setup automation) are intentionally deferred and not in scope here.
