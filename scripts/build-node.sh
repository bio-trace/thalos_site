#!/usr/bin/env bash
# Build a self-contained Node.js deployment bundle to ./dist/.
# Produces:
#   dist/
#     server.js            # Next.js standalone server
#     .next/               # static assets (CSS, JS chunks)
#     public/              # static files + CNAME + images
#     node_modules/        # minimal deps (only what server.js needs)
#     package.json
#
# Upload dist/ to your Linux server and run:
#   PORT=3000 HOSTNAME=0.0.0.0 RESEND_API_KEY=... PARTNER_GYM_INBOX=... node server.js
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ rm .next dist"
rm -rf .next dist

echo "→ next build (standalone)"
npx next build

echo "→ assembling dist/"
mkdir -p dist
cp -r .next/standalone/. dist/
mkdir -p dist/.next
cp -r .next/static dist/.next/static
cp -r public dist/public

echo "✓ Node bundle at: $ROOT/dist"
du -sh dist
echo
echo "Deploy:"
echo "  rsync -avz --delete dist/ user@server:/var/www/thalos/"
echo "  ssh user@server 'cd /var/www/thalos && PORT=3000 HOSTNAME=0.0.0.0 node server.js'"
echo "  (or use systemd service — see deploy/thalos.service)"
