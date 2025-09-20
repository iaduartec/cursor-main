#!/bin/sh
set -euo pipefail

if command -v pnpm >/dev/null 2>&1; then
  pnpm run vercel-build
elif command -v npm >/dev/null 2>&1; then
  npm run build
else
  echo "Error: Neither pnpm nor npm is available to run the build." >&2
  exit 1
fi
