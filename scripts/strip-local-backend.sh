#!/usr/bin/env bash
# Strip `local_backend: true` from Sveltia config before a production build.
# In dev we set this flag so Sveltia talks to `npx decap-server`.
# In prod it must be off so Sveltia uses the GitHub backend.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CFG="$ROOT/public/admin/config.yml"

if [ ! -f "$CFG" ]; then
  echo "→ skip: $CFG not found"
  exit 0
fi

# Remove lines starting with `local_backend:` (any indentation)
sed -i.bak '/^[[:space:]]*local_backend:/d' "$CFG"
rm -f "$CFG.bak"
echo "✓ stripped local_backend from $CFG"
