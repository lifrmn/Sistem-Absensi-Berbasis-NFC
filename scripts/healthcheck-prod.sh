#!/usr/bin/env bash
set -euo pipefail

echo "== Service status =="
docker compose -f docker-compose.prod.yml ps

printf '\n== Backend health ==\n'
curl -fsS http://localhost/api/health

printf '\n== Frontend health ==\n'
curl -fsS http://localhost/healthz

printf '\nSemua healthcheck lulus.\n'
