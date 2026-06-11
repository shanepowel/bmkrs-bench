#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOCAL_DOCKER_URL='postgresql://fnm:fnm_dev_password@localhost:5432/freelancenearme?schema=public'
ENV_WEB="$ROOT/apps/web/.env"
ENV_DB="$ROOT/packages/database/.env"

append_pgbouncer() {
  local url="$1"
  # Only Prisma local dev pooler needs pgbouncer=true — not Docker Postgres on :5432
  if [[ "$url" == *"localhost:5432"* || "$url" == *"127.0.0.1:5432"* ]]; then
    echo "$url"
    return
  fi
  if [[ "$url" != *"pgbouncer="* ]]; then
    if [[ "$url" == *"?"* ]]; then
      echo "${url}&pgbouncer=true"
    else
      echo "${url}?pgbouncer=true"
    fi
  else
    echo "$url"
  fi
}

write_env() {
  local db_url
  db_url="$(append_pgbouncer "$1")"
  local template="$ROOT/scripts/env.local.template"
  if [[ -f "$template" ]]; then
    sed "s|{{DATABASE_URL}}|$db_url|g" "$template" > "$ENV_WEB"
  else
    cat > "$ENV_WEB" <<EOF
DATABASE_URL="$db_url"
DEV_AUTH_BYPASS=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLATFORM_FEE_PERCENT=10
NEXT_PUBLIC_PLATFORM_FEE_PERCENT=10
EOF
  fi
  echo "DATABASE_URL=\"$db_url\"" > "$ENV_DB"
  echo "Wrote $ENV_WEB and $ENV_DB (see docs/ENVIRONMENT.md)"
}

echo "==> Installing dependencies"
npm install

if command -v docker >/dev/null 2>&1; then
  echo "==> Starting Docker Postgres"
  docker compose up -d
  echo "Waiting for Postgres..."
  for i in $(seq 1 30); do
    if docker compose exec -T postgres pg_isready -U fnm -d freelancenearme >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
  write_env "$LOCAL_DOCKER_URL"
else
  echo "==> Docker not found — starting Prisma local database"
  cd packages/database
  DB_URL=$(npx prisma dev --detach 2>&1 | tail -1)
  cd "$ROOT"
  if [[ -z "$DB_URL" || "$DB_URL" != postgres* ]]; then
    echo "Failed to start Prisma dev. Install Docker or set DATABASE_URL manually."
    exit 1
  fi
  write_env "$DB_URL"
fi

echo "==> Applying schema"
npm run db:push

echo "==> Seeding demo data"
npm run db:seed

echo ""
echo "Done. Run: npm run dev"
echo "  http://localhost:3000"
echo "  Dev user: client (default) — set DEV_AUTH_USER=talent in apps/web/.env for talent flows"
