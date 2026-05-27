# Linux server deploy

Two options:
1. **Docker Compose** (recommended — one command, isolated, auto-HTTPS via Caddy container)
2. **Bare metal** (Node + systemd + Caddy directly on host)

---

## Option 1: Docker Compose

Files in repo root: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.production.example`, `deploy/Caddyfile.docker`.

### Server one-time

Ubuntu/Debian:
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# Open firewall
ufw allow 80,443/tcp && ufw allow 443/udp
```

### Deploy
```bash
# On server, in a clean dir
git clone <repo-url> thalos
cd thalos
cp .env.production.example .env
nano .env                                 # fill RESEND_API_KEY
docker compose up -d --build              # builds image + starts thalos + caddy
```

### Update
```bash
cd thalos
git pull
docker compose up -d --build              # rebuilds + restarts
docker image prune -f                     # clean old layers
```

### Logs / status
```bash
docker compose ps
docker compose logs -f thalos
docker compose logs -f caddy
```

### Rollback
```bash
git checkout <previous-sha>
docker compose up -d --build
```

DNS: `A` record `thalos.at` → server IP. Caddy provisions HTTPS automatically once DNS resolves.

---

## Option 2: Bare metal

Self-contained Node.js bundle for `thalos.at`. Run behind Caddy (auto-HTTPS).

## One-time server setup

Assuming Ubuntu/Debian, root or sudo:

```bash
# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Caddy
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update && apt-get install -y caddy

# App user + dirs
useradd --system --shell /usr/sbin/nologin --home /var/www/thalos www-thalos || true
mkdir -p /var/www/thalos /etc/thalos
chown -R www-thalos:www-thalos /var/www/thalos
chmod 750 /etc/thalos

# Env vars (edit values)
cp deploy/env.example /etc/thalos/env
chmod 600 /etc/thalos/env
chown www-thalos:www-thalos /etc/thalos/env
nano /etc/thalos/env             # fill in RESEND_API_KEY

# Caddy config
cp deploy/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy

# systemd unit
cp deploy/thalos.service /etc/systemd/system/
# Edit User= in unit to www-thalos if you used that user
systemctl daemon-reload
systemctl enable thalos
```

## Build + deploy (every release)

On your dev machine:

```bash
npm run build:node                              # produces ./dist/
rsync -avz --delete dist/ www-thalos@SERVER:/var/www/thalos/
ssh root@SERVER 'systemctl restart thalos'
```

Or one-liner script — copy `deploy/deploy.sh.example` to `deploy/deploy.sh`, fill in `SERVER`, then:

```bash
bash deploy/deploy.sh
```

## Verify

```bash
systemctl status thalos                # active (running)
journalctl -u thalos -f                # tail logs
curl -I https://thalos.at              # 200 OK
```

## Rollback

Keep last good `dist/` somewhere:

```bash
rsync -avz dist-previous/ www-thalos@SERVER:/var/www/thalos/
ssh root@SERVER 'systemctl restart thalos'
```

## DNS

- `A` record: `thalos.at` → server IPv4
- `AAAA` record: `thalos.at` → server IPv6 (optional)
- `CNAME` record: `www.thalos.at` → `thalos.at` (or A to same IP)

Caddy auto-provisions Let's Encrypt cert once DNS resolves + ports 80/443 open.
