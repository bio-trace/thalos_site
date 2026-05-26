# Linux server deploy

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
