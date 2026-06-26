#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env.production ]]; then
  echo "File .env.production belum ada."
  echo "Jalankan: cp .env.production.example .env.production"
  echo "Kemudian edit .env.production dan isi JWT_SECRET, CORS_ORIGIN, dll."
  exit 1
fi

# shellcheck disable=SC1091
source .env.production

if [[ -z "${JWT_SECRET:-}" || ${#JWT_SECRET} -lt 32 ]]; then
  echo "JWT_SECRET wajib diisi dan minimal 32 karakter di .env.production"
  exit 1
fi

echo ">> Building dan menjalankan containers..."
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build --wait

echo ""
echo ">> Deployment selesai!"
echo "   URL           : http://$(hostname -I | awk '{print $1}')"
echo "   Cek status    : docker compose -f docker-compose.prod.yml ps"
echo "   Cek logs      : docker compose -f docker-compose.prod.yml logs -f"
echo "   Cek health    : bash scripts/healthcheck-prod.sh"
