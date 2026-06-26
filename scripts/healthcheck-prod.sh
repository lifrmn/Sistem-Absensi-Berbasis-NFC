#!/usr/bin/env bash
set -euo pipefail

echo "== Service status =="
docker compose -f docker-compose.prod.yml ps

echo "\n== Backend health =="
curl -fsS http://localhost/api/health | cat

echo "\n== Frontend health =="
curl -fsS http://localhost/healthz | cat

echo "\nSemua healthcheck lulus."
