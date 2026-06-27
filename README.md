
# Sistem Absensi NFC Unismuh

Sistem absensi berbasis NFC dengan frontend React, backend Express, dan SQLite.

## Menjalankan Lokal

1. Install dependency:
   - `npm install`
2. Siapkan env lokal:
   - `cp .env.example .env`
3. Pastikan `JWT_SECRET` minimal 32 karakter.
4. Jalankan full-stack lokal:
   - `npm run dev`

Endpoint lokal:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`

Catatan:
- Frontend default memakai `/api` (same-origin).
- Saat development, Vite memproxy `/api` ke backend.

## Akun Demo

- Dosen:
  - Username: `dosen`
  - Password: `Dosen@12345`
- Mahasiswa:
  - Username: `a001`
  - Password: `Mahasiswa@12345`

## Deploy Production Terintegrasi

Arsitektur production:
- `backend` container tunggal: build React sekali, lalu Express serve frontend + API `/api`.
- Persistensi database SQLite pada volume Docker `app_data`.

File deployment:
- `Dockerfile.backend`
- `docker-compose.prod.yml`
- `scripts/deploy-prod.sh`
- `scripts/healthcheck-prod.sh`

### 1) Siapkan env production

1. Salin template:
   - `cp .env.production.example .env.production`
2. Isi nilai production:
   - `JWT_SECRET` wajib acak dan minimal 32 karakter.
   - `CORS_ORIGIN` isi domain aplikasi Anda, contoh `https://absensi.example.com`.

### 2) Startup command production

Jalankan:
- `bash scripts/deploy-prod.sh`

Script akan:
- Validasi `.env.production` dan `JWT_SECRET`.
- Build image backend (termasuk build frontend).
- Start container dengan `docker compose`.

### 3) Cek health dan status

- `bash scripts/healthcheck-prod.sh`

Atau manual:
- `docker compose -f docker-compose.prod.yml ps`
- `curl http://localhost/api/health`
- `curl http://localhost/`

### 4) Stop / restart

- Stop: `docker compose -f docker-compose.prod.yml down`
- Restart: `docker compose -f docker-compose.prod.yml restart`

## Quality Gate Sebelum Deploy

- Typecheck + unit/integration + build:
  - `npm run check`
- E2E Playwright:
  - `npm run test:e2e`
  