# Content CMS — Design

Date: 2026-05-27
Status: Approved (brainstorming phase)
Owner: Patrick Ortner

## Goal

Let non-developer teammates edit website content (team, FAQ, legal text, UI strings, images) without using git or a local dev environment, while keeping git as the source of truth and every change auditable as a commit.

## Non-goals

- Real-time collaborative editing
- Scheduled publishing
- Image CDN / on-the-fly transforms
- Server-side runtime CMS (incompatible with current static-export deploy)

## Constraints

- Site currently deploys as **static export** to GitHub Pages on push to `master` (`.github/workflows/deploy.yml`)
- Stack: Next.js 14, next-intl, Tailwind, vitest, playwright
- Two locales: `de`, `en`
- Editors: 1–3 people, some non-technical
- No new managed infrastructure

## Chosen approach: Git-based CMS (Sveltia)

Sveltia CMS is a client-only admin UI served as static assets at `/admin/`. Editors log in with a GitHub Personal Access Token; Sveltia commits content changes against the repo via the GitHub Contents API. PR-based editorial workflow ensures every change goes through review before reaching `master`.

Alternatives considered and rejected:

- **Headless CMS (Sanity/Strapi/Payload)** — adds external service; git becomes secondary mirror, not source of truth.
- **Decap CMS** — requires OAuth proxy for static hosts; dated UI; slow maintenance.
- **TinaCMS** — slick UX but tied to Tina Cloud unless self-hosted, adds external dependency.
- **Custom protected `/admin` route** — months of polish to reach parity with Sveltia.

## Architecture

```
Editor browser
    │
    ▼  loads
/admin/  (static: index.html + Sveltia JS bundle)
    │
    ▼  PAT in localStorage, REST calls
GitHub Contents API
    │
    ▼  commit → branch cms/<collection>/<slug> → PR vs master
GitHub PR review (branch protection: 1 approval, CI green)
    │
    ▼  merge
.github/workflows/deploy.yml (existing) → static export → Pages
```

Key properties:

- No new runtime. `/admin/` is static assets; Sveltia runs entirely in the editor's browser.
- Auth lives at GitHub. Repo write access = edit access. Revoke by removing collaborator.
- Every edit produces a real git commit attributed to the editor's GitHub identity.

## Collections

Four CMS collections + media.

### 1. Team (folder collection)

- Path: `data/team/<id>.json`, one file per member
- Fields:
  - `id` (string, slug)
  - `name` (string)
  - `role.de` (string), `role.en` (string)
  - `image` (image upload → `public/images/team/`)
  - `order` (integer, sort key)
- Migration: split current `data/team.json` (currently has duplicated entries from a demo) into 4 files (robert, sanja, misha, andi). Strip duplicates.
- Loader: new util in `lib/content/team.ts` — reads folder, sorts by `(order asc, id asc)`.

### 2. FAQ (folder collection)

- Path: `data/faq/<id>.json`, one file per question
- Fields:
  - `id` (string, slug)
  - `q.de` (string), `q.en` (string)
  - `a.de` (markdown), `a.en` (markdown)
  - `order` (integer)
- Migration: split current `data/faq.json` (6 entries) into 6 files.
- Loader: `lib/content/faq.ts` — folder read + sort + markdown render of answers.

### 3. Legal (files collection)

- Path: `data/legal/{impressum,datenschutz,agb,widerruf}.md`
- Widget: markdown (rich-text editor)
- Format: switch source from `.html` to `.md`. Markdown rendered to HTML at build via `marked`.
- Migration: convert existing 4 `.html` files to `.md` (hand-edit or `turndown`).
- Loader: `lib/content/legal.ts` — reads `.md`, returns rendered HTML.

### 4. UI strings (files collection, full exposure)

- Path: `messages/de.json`, `messages/en.json`
- Widget: nested object mirroring current shape (`hero.headline`, `nav.system`, `system.pillars.workouts.title`, …)
- All keys exposed per scope decision.
- Safety: `scripts/validate-messages.ts` runs in CI — validates both locales against a hand-maintained JSON schema (`lib/content/messages-schema.json`). Catches:
  - Missing required key
  - Key present in one locale, missing in the other
  - Type mismatch (e.g. object where string expected)
- Failed validation blocks merge.

### Media

- Folder: `public/images/`
- Public URL prefix: `/images/`
- Used by team `image` widget. Sveltia auto-uploads with collision-safe filenames.
- Max upload: 2 MB (Sveltia config).

## Auth

**PAT-based login** (chosen over OAuth to avoid running an OAuth proxy):

1. Editor visits `/admin/`.
2. Pastes a GitHub fine-grained PAT (repo-scoped, write `contents` + read `metadata`).
3. PAT stored in browser `localStorage` only.
4. Sveltia uses PAT for all GitHub API calls.

PAT lifecycle:

- Max 90-day expiry per token
- Generated per editor; never shared
- Revoked by removing repo collaborator status OR editor revoking token in GitHub

Editor list: TBD. Start with Patrick; add Robert/Sanja/others as needed by adding them as repo collaborators.

`/admin/` protection:

- Page is publicly loadable but inert without valid PAT
- `<meta name="robots" content="noindex">` + `robots.txt` `Disallow: /admin/`

## Build flow

Editorial workflow enabled (`publish_mode: editorial_workflow` in Sveltia config):

1. Editor edits content in Sveltia → "Save" creates branch `cms/<collection>/<slug>` and opens PR vs `master`.
2. PR triggers `.github/workflows/pr.yml` (new): typecheck → lint → vitest → `validate-messages` → next build → playwright (no auth/admin tests required for PR).
3. Patrick reviews PR diff in GitHub UI.
4. Merge → `.github/workflows/deploy.yml` (existing) runs static export and deploys to Pages.

Branch protection on `master`:

- Require PR (no direct push)
- Require CI green
- Require 1 approval **only once a second editor exists** (a PR author cannot self-approve on GitHub; with a single collaborator, the rule would deadlock all merges). Until then: PR required, CI required, no approval requirement. Re-enable approval requirement when second collaborator is added.
- Linear history enforced (no force-push, no merge commits if desired)

## Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Editor deletes UI string key → build breaks | `validate-messages` CI script; PR blocks |
| de/en key drift | Same script cross-checks key sets across locales |
| Oversized image upload | Sveltia `media_library.config.max_file_size: 2_000_000` |
| Broken markdown in legal | Sveltia preview tab; `marked` renders safely; no raw HTML allowed |
| Direct push bypass | Branch protection on `master` |
| PAT leak | Fine-grained, repo-scoped, 90-day expiry |
| Concurrent edits on same file | Editorial workflow uses per-PR branches; GitHub surfaces conflicts |
| Sveltia CDN outage | Pin Sveltia version in `index.html`; optionally self-host bundle in `public/admin/` |
| Filename collisions on upload | Sveltia auto-suffixes |
| Unstable team/FAQ order | Loader uses stable sort `(order, id)` |
| Editor edits one locale, forgets the other | Sveltia i18n widget shows both side-by-side; required-field validation per locale |

## Testing

| Layer | What | Tool |
|-------|------|------|
| Unit | Team loader (sort, defaults, missing field handling) | vitest |
| Unit | FAQ loader; legal markdown→HTML render | vitest |
| Unit | `validate-messages`: catches missing key, locale drift, type mismatch | vitest |
| Integration | Static build with new data layout produces equivalent DOM to current site | snapshot test |
| E2E | `/admin/` loads, shows login form, no JS crash without PAT | playwright |
| Manual | Full round-trip: editor PAT login → edit team entry → PR opened → merged → deployed → live | documented checklist in editor guide |

## File layout

**New:**

```
public/admin/index.html
public/admin/config.yml
data/team/{robert,sanja,misha,andi}.json
data/faq/{what-is,medical,data,cost,availability,founding-athlete}.json
data/legal/{impressum,datenschutz,agb,widerruf}.md
lib/content/team.ts
lib/content/faq.ts
lib/content/legal.ts
lib/content/messages-schema.json
scripts/validate-messages.ts
scripts/migrate-content.ts
docs/cms-editor-guide.md
.github/workflows/pr.yml
```

**Changed:**

- Components consuming team/faq: switch to new loaders
- Legal route: render markdown via `marked`
- `package.json`: add `marked` dep; add `validate:messages` npm script
- `next.config.mjs`: ensure `/admin/` excluded from i18n routing
- `README.md`: link to editor guide

**Removed:**

- `data/team.json`
- `data/faq.json`
- `data/legal/*.html`

## New dependencies

- `marked` (markdown → HTML for legal + FAQ answers)
- (Sveltia loaded via CDN, no npm dep)

## Open items deferred to implementation plan

- Exact Sveltia version to pin
- Whether to self-host Sveltia bundle vs CDN
- Whether to generate `messages-schema.json` from TS types or hand-maintain
- Exact PR template / labels for CMS-originated PRs
- Editor onboarding script (PAT setup automation, if any)
