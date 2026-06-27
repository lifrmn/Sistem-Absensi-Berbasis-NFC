#!/usr/bin/env bash
set -euo pipefail

echo "== Service status =="
docker compose -f docker-compose.prod.yml ps

printf '\n== API health ==\n'
curl -fsS http://localhost/api/health

printf '\n== Frontend route check ==\n'
curl -fsS http://localhost/ > /dev/null && echo "Frontend route OK"

printf '\nSemua healthcheck lulus.\n'
