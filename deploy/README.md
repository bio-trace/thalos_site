# Deploy — Docker Compose

Single-host deploy via Docker Compose: Next.js app + Caddy reverse proxy with auto-HTTPS.

## Files in repo

| File | Purpose |
|---|---|
| `Dockerfile` | 3-stage build (deps → builder → runtime), ~150 MB image |
| `docker-compose.yml` | `thalos` (Next) + `caddy` (proxy) |
| `.dockerignore` | keeps `node_modules`, `.next`, `.git` out of build context |
| `.env.production.example` | env template — copy to `.env`, fill `RESEND_API_KEY` |
| `deploy/Caddyfile.docker` | Caddy config, proxies `thalos.at` → `thalos:3000` |

## Server one-time

Ubuntu / Debian:

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# 2. Open firewall
ufw allow 80,443/tcp && ufw allow 443/udp

# 3. Clone repo
git clone <repo-url> /opt/thalos
cd /opt/thalos

# 4. Env vars
cp .env.production.example .env
chmod 600 .env
nano .env                          # set RESEND_API_KEY=re_xxx

# 5. Start stack
docker compose up -d --build
```

Site live at `https://thalos.at` once Caddy provisions the Let's Encrypt cert (~30 s after first start).

## DNS

Point at server **before** first start:
- `A` record: `thalos.at` → server IPv4
- `A` (or `CNAME`) record: `www.thalos.at` → same target

Without DNS, Caddy keeps retrying — check `docker compose logs caddy`.

## Updates

```bash
cd /opt/thalos
git pull
docker compose up -d --build       # rebuilds changed layers + restarts
docker image prune -f              # optional: clean old layers
```

~2 s downtime per restart.

## Operations

```bash
docker compose ps                  # status
docker compose logs -f thalos      # tail app logs
docker compose logs -f caddy       # tail proxy logs
docker compose exec thalos sh      # shell into app
docker compose restart thalos      # restart app only
docker compose down                # stop everything
```

## Rollback

```bash
git checkout <previous-sha>
docker compose up -d --build
```

## Volumes (auto-persisted)

- `caddy_data` — Let's Encrypt certs + ACME state (survives container recreate)
- `caddy_config` — Caddy runtime config cache

Inspect: `docker volume ls | grep thalos`.

## CMS at `/admin/`

Production ships with Sveltia CMS at `https://thalos.at/admin/`. Editors authenticate with a GitHub Personal Access Token (`repo` + `pull_request` scope); edits create PRs against `master`. After a PR is merged, run the update flow above to deploy the new content.

The `local_backend: true` flag in `public/admin/config.yml` is **only** for local development (talks to `npx decap-server`). The Docker build automatically strips it (`scripts/strip-local-backend.sh` runs in the builder stage before `npm run build`). Verify after build:

```bash
docker compose exec thalos cat /app/public/admin/config.yml | grep local_backend
# should output nothing
```

Optional hardening: uncomment the basic-auth block in `deploy/Caddyfile.docker` to gate the `/admin/` URL with an extra HTTP login. Generate hash via `docker run --rm caddy:2 caddy hash-password`.

## Notes

- App listens on container port 3000, exposed only to the Docker `web` network — never directly on host.
- Caddy is the only thing binding host ports (80/443).
- The `thalos` image runs as non-root user `nextjs` (uid 1001) for safety.
- HSTS, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy headers are set in `deploy/Caddyfile.docker`.
- Static assets (`/_next/static/*`, `/images/*`, `/icon.svg`, `/logo.svg`) get `Cache-Control: public, max-age=31536000, immutable`.
