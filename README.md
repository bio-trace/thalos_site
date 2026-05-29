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

Production runs via **Docker Compose** on a Linux server: one Next.js container bound to `127.0.0.1:53000`, fronted by host **nginx** + **certbot** for TLS, managed by **systemd**. Full walkthrough: [`deploy/README.md`](deploy/README.md).

Quick version:
```
# On the server
git clone <repo> /root/thalos_site && cd /root/thalos_site
git checkout cms-content-editor
cp .env.example .env && nano .env              # set RESEND_API_KEY
cp deploy/thalos.at.nginx /etc/nginx/sites-enabled/thalos.at
certbot --nginx -d thalos.at -d www.thalos.at  # TLS
cp deploy/thalos-site.service /etc/systemd/system/ && systemctl enable --now thalos-site
```

Updates:
```
git pull && systemctl restart thalos-site
```

DNS: `A` record `thalos.at` → server IP. certbot issues the Let's Encrypt cert.

## Design tokens
Edit `design-system/tokens/*` — Tailwind picks them up via `tailwind.config.ts`. Do not introduce raw hex outside tokens.

## Content
Translation strings live in `messages/{de,en}.json`. Placeholder copy is flagged with `[LOREM]` — replace before public launch.

## FAQ
Edit any file under `data/faq/*.json`. One file per question. Each entry: `{ id, q: { de, en }, a: { de, en }, order }`. Add/remove/rename freely; `order` controls sort.

## Team
Edit any file under `data/team/*.json`. One file per member:
```json
{ "id": "robert", "name": "Robert Bruckner", "role": { "de": "Gründer & CEO", "en": "Founder & CEO" }, "image": "/images/team/robert.jpg", "order": 1 }
```
- `image` path relative to `public/` (drop photo at `public/images/team/robert.jpg`). `null` → gradient placeholder.
- Grid: 1 col mobile, 2 col sm, 3 col md, 4 col lg.

## Legal pages
Markdown under `data/legal/{impressum,datenschutz,agb,widerruf}.md`. Rendered via `marked` at request time.

## CMS — `/admin/` editor

Non-developers edit team, FAQ, legal, and UI text via the browser. Powered by [Sveltia CMS](https://github.com/sveltia/sveltia-cms) (Decap-compatible). Editor guide: [docs/cms-editor-guide.md](docs/cms-editor-guide.md).

### Local dev — file-system backend (no PAT, no PRs)

Two terminals from project root:

```bash
# Terminal 1: filesystem bridge on :8081
npx decap-server

# Terminal 2: Next dev server on :3000
npm run dev
```

Open http://localhost:3000/admin/. Sveltia detects the proxy → edits write directly to `data/`, `messages/`, etc. Review with `git diff`, commit or discard manually.

The flag enabling this is `local_backend: true` in `public/admin/config.yml`. **Both Docker and static prod builds strip this line automatically** ([`scripts/strip-local-backend.sh`](scripts/strip-local-backend.sh)) — never reaches production.

### Production — GitHub backend

In prod, `/admin/` requires a GitHub Personal Access Token with `repo` + `pull_request` scope. Edits become PRs against `master`. See editor guide for PAT setup.

### Optional — basic-auth on `/admin/`

Sveltia already requires a PAT, but you can gate the login page with an extra HTTP auth layer in the host nginx vhost ([`deploy/thalos.at.nginx`](deploy/thalos.at.nginx)):

```nginx
location /admin/ {
    auth_basic "Thalos CMS";
    auth_basic_user_file /etc/nginx/.htpasswd;   # htpasswd -c /etc/nginx/.htpasswd editor
    proxy_pass http://127.0.0.1:53000;
}
```
