# Thalos Website

Single-page long-scroll landing at [thalos.at](https://thalos.at). Next.js 14 + next-intl (DE/EN).

## Stack
Next.js 14 (App Router), TypeScript, Tailwind, next-intl, framer-motion, lucide-react, zod, resend. Tests: Vitest + RTL, Playwright.

## Develop
```
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY + PARTNER_GYM_INBOX
npm run dev                  # http://localhost:3000 — Next.js Fast Refresh (HMR) on
npm run dev:turbo            # same, but Turbopack (~10x faster reloads)
```

Editing any `.tsx`, `.ts`, `.css`, `.json` under `app/`, `components/`, `messages/`, `data/`, `design-system/` hot-reloads instantly. No page refresh needed.

## Test
```
npm test            # unit + integration (vitest)
npm run e2e         # playwright smoke
```

## Deploy
Vercel. Set env vars `RESEND_API_KEY`, `PARTNER_GYM_INBOX` in project settings. Push to `main` → auto-deploy. Add custom domain `thalos.at`.

## Design tokens
Edit `design-system/tokens/*` — Tailwind picks them up via `tailwind.config.ts`. Do not introduce raw hex outside tokens.

## Content
Translation strings live in `messages/{de,en}.json`. Placeholder copy is flagged with `[LOREM]` — replace before public launch.

## FAQ
Edit `data/faq.json`. Each entry: `{ id, q: { de, en }, a: { de, en } }`. Add/remove/reorder freely.

## Team
Edit `data/team.json`. Each entry:
```json
{ "id": "robert", "name": "Robert Bruckner", "role": { "de": "Gründer & CEO", "en": "Founder & CEO" }, "image": "/images/team/robert.jpg" }
```
- `image` path is relative to `public/` (e.g. drop a photo at `public/images/team/robert.jpg`). Set to `null` for gradient placeholder.
- Grid auto-flows: 1 col mobile, 2 col sm, 3 col md, 4 col lg. Add as many members as needed.
