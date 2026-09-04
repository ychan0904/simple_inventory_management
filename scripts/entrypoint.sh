#!/bin/sh
set -e

mkdir -p /app/data
npx prisma migrate deploy
node scripts/seed.cjs
exec npx next start -H 0.0.0.0 -p "${PORT:-3000}"
