# Deploy

Single-host deploy with Docker Compose for the Next.js app, host nginx for
TLS/reverse proxying, and systemd for supervision. This mirrors the deployment
style used by `thalos_back`.

## Files in repo

| File | Purpose |
|---|---|
| `Dockerfile` | 3-stage build (deps → builder → runtime), ~150 MB image |
| `docker-compose.yml` | Next.js app bound to `127.0.0.1:53000` |
| `.dockerignore` | keeps `node_modules`, `.next`, `.git` out of build context |
| `.env.production.example` | env template — copy to `.env`, fill `RESEND_API_KEY` |
| `deploy/thalos.at.nginx` | nginx reverse proxy for `thalos.at` + `www.thalos.at` |
| `deploy/thalos-site.service` | systemd unit for the Compose app |

## Server one-time

Ubuntu / Debian:

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# 2. Install nginx + certbot
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# 3. Open firewall
ufw allow 80/tcp
ufw allow 443/tcp

# 4. Clone repo
git clone <repo-url> /root/thalos_site
cd /root/thalos_site

# 5. Env vars
cp .env.production.example .env
chmod 600 .env
nano .env                          # set RESEND_API_KEY=re_xxx

# 6. Install nginx config
cp deploy/thalos.at.nginx /etc/nginx/sites-enabled/thalos.at
nginx -t
systemctl reload nginx

# 7. Install systemd service
cp deploy/thalos-site.service /etc/systemd/system/thalos-site.service
systemctl daemon-reload
systemctl enable --now thalos-site

# 8. Issue certificates
certbot --nginx -d thalos.at -d www.thalos.at
```

If the repo is cloned somewhere other than `/root/thalos_site`, update
`WorkingDirectory` in `deploy/thalos-site.service` before copying it.

## DNS

Point at the server before issuing certificates:
- `A` record: `thalos.at` → server IPv4
- `A` (or `CNAME`) record: `www.thalos.at` → same target

## Updates

```bash
cd /root/thalos_site
git pull
systemctl restart thalos-site      # rebuilds changed layers + restarts
docker image prune -f              # optional: clean old layers
```

For a one-off deploy without systemd, run `docker compose up -d --build`.

## Operations

```bash
systemctl status thalos-site       # service status
journalctl -u thalos-site -f       # systemd logs
docker compose ps                  # container status
docker compose logs -f app         # app logs
docker compose exec app sh         # shell into app
docker compose restart app         # restart app container
docker compose down                # stop app container
nginx -t                           # validate nginx config
```

## Rollback

```bash
git checkout <previous-sha>
systemctl restart thalos-site
```

## Notes

- App listens on container port 3000 and is published only on
  `127.0.0.1:53000`, so it is not directly exposed to the internet.
- nginx is the only thing binding public ports 80/443.
- The app container runs as non-root user `nextjs` (uid 1001) for safety.
- HSTS, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy headers
  are set in `deploy/thalos.at.nginx`.
