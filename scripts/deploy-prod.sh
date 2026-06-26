#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env.production ]]; then
  echo "File .env.production belum ada."
  echo "Jalankan: cp .env.production.example .env.production"
  exit 1
fi

# shellcheck disable=SC1091
source .env.production

if [[ -z "${JWT_SECRET:-}" || ${#JWT_SECRET} -lt 32 ]]; then
  echo "JWT_SECRET wajib diisi dan minimal 32 karakter di .env.production"
  exit 1
fi

docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

echo "Deployment selesai."
echo "Cek status: docker compose -f docker-compose.prod.yml ps"
echo "Cek health: bash scripts/healthcheck-prod.sh"
