#!/usr/bin/env bash
# Build a static export to ./out/ for upload to any static file server.
# Tradeoffs vs Node deploy:
#   - No middleware (locale auto-redirect handled by root meta-refresh page)
#   - No API route (/api/partner-gym omitted — form will POST and fail; replace with Formspree/mailto before launch)
#   - No next/image optimization (images served as-is)
#   - No edge runtime OG image (route omitted)
# Renames are non-destructive: middleware.ts, next.config.mjs, app/api are stashed
# during build and restored at the end (even on failure).

set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

restore() {
  [ -f middleware.ts.bak ] && mv middleware.ts.bak middleware.ts || true
  [ -f next.config.mjs.bak ] && mv next.config.mjs.bak next.config.mjs || true
  [ -d app/api.bak ] && mv app/api.bak app/api || true
  [ -f app/opengraph-image.tsx.bak ] && mv app/opengraph-image.tsx.bak app/opengraph-image.tsx || true
  [ -f public/admin/config.yml.bak ] && mv public/admin/config.yml.bak public/admin/config.yml || true
}
trap restore EXIT

echo "→ stashing middleware, API route, OG image, swapping next.config"
[ -f middleware.ts ] && mv middleware.ts middleware.ts.bak
[ -d app/api ] && mv app/api app/api.bak
[ -f app/opengraph-image.tsx ] && mv app/opengraph-image.tsx app/opengraph-image.tsx.bak
mv next.config.mjs next.config.mjs.bak
cp next.config.static.mjs next.config.mjs

echo "→ backing up + stripping local_backend from public/admin/config.yml"
cp public/admin/config.yml public/admin/config.yml.bak
sed -i.tmp '/^[[:space:]]*local_backend:/d' public/admin/config.yml
rm -f public/admin/config.yml.tmp

echo "→ rm .next + out"
rm -rf .next out

echo "→ next build (static export)"
npx next build

echo "→ verifying out/"
[ -d out ] || { echo "FAIL: out/ not produced"; exit 1; }

echo "→ touching .nojekyll (so GitHub Pages serves _next/ correctly)"
touch out/.nojekyll

echo "✓ static build produced at: $ROOT/out"
echo
echo "Contents:"
ls -la out/ | head -20
echo
echo "Upload the contents of out/ to any static host (S3, nginx, GitHub Pages, Netlify Drop, Cloudflare Pages, etc.)"
