# Deploy — Docker Compose + host nginx

Single-host deploy: the Next.js app runs in one Docker container bound to
`127.0.0.1:53000`. Host **nginx** terminates TLS (via certbot) and reverse-proxies
to it. A **systemd** unit keeps the container running across reboots.

No Caddy. TLS = certbot/Let's Encrypt on the host.

## Files in repo

| File | Purpose |
|---|---|
| `Dockerfile` | 3-stage build → Next.js standalone server (strips `local_backend` from Sveltia config) |
| `docker-compose.yml` | one `app` service, published on `127.0.0.1:53000` only |
| `.dockerignore` | keeps `node_modules`, `.next`, `.git` out of build context |
| `.env.example` | env template — copy to `.env`, fill `RESEND_API_KEY` |
| `deploy/thalos.at.nginx` | host nginx reverse-proxy vhost (certbot fills the SSL block) |
| `deploy/thalos-site.service` | systemd unit running `docker compose up --build` |

## Server one-time (Ubuntu / Debian)

```bash
# 1. Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# 2. nginx + certbot
apt-get install -y nginx certbot python3-certbot-nginx

# 3. Clone repo (systemd unit expects /root/thalos_site — adjust if different)
git clone <repo-url> /root/thalos_site
cd /root/thalos_site
git checkout cms-content-editor

# 4. Env
cp .env.example .env
chmod 600 .env
nano .env                      # RESEND_API_KEY=re_xxx

# 5. nginx vhost + TLS
cp deploy/thalos.at.nginx /etc/nginx/sites-available/thalos.at
ln -sf /etc/nginx/sites-available/thalos.at /etc/nginx/sites-enabled/thalos.at
nginx -t && systemctl reload nginx
certbot --nginx -d thalos.at -d www.thalos.at   # adds the 443 SSL block

# 6. systemd service (build + start container, survive reboots)
cp deploy/thalos-site.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now thalos-site
```

Site live at `https://thalos.at`. Container listens only on localhost; nginx is the public edge.

## DNS

- `A` record `thalos.at` → server IPv4
- `A` (or `CNAME`) `www.thalos.at` → same target

certbot needs DNS resolving + port 80 open to issue the cert.

## Updates

```bash
cd /root/thalos_site
git pull
systemctl restart thalos-site     # re-runs `docker compose up --build`
```

Or without systemd:
```bash
docker compose up -d --build
docker image prune -f
```

## Operations

```bash
docker compose ps                 # container status
docker compose logs -f app        # app logs
systemctl status thalos-site      # service status
journalctl -u thalos-site -f      # service logs
nginx -t                          # validate nginx config
```

## CMS at /admin/

Served by the same container at `https://thalos.at/admin/`. Editors log in with a
GitHub Personal Access Token (`repo` + `pull_request` scope). Edits create PRs
against `master`; after merge, redeploy (`git pull && systemctl restart thalos-site`)
to publish.

The `local_backend: true` flag in `public/admin/config.yml` is dev-only and is
stripped automatically during the Docker build (`scripts/strip-local-backend.sh`).
Verify:
```bash
docker compose exec app cat /app/public/admin/config.yml | grep local_backend   # → no output
```

## Rollback

```bash
git checkout <previous-sha>
systemctl restart thalos-site
```

## Notes

- App runs as non-root `nextjs` (uid 1001) inside the container.
- Security headers (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) set in nginx vhost.
- `/_next/static/*` gets `Cache-Control: immutable` via the nginx vhost.
- Container exposes nothing publicly — only `127.0.0.1:53000`. nginx is the sole public listener.
