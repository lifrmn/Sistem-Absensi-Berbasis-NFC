
  # Sistem Absensi NFC Unismuh

  Sistem absensi berbasis NFC dengan frontend React + backend Express + SQLite.

  ## Persiapan

  1. Install dependency:
     - `npm install`
  2. Salin environment:
     - `cp .env.example .env`
  3. Pastikan `JWT_SECRET` di `.env` memiliki minimal 32 karakter.

  ## Menjalankan Aplikasi (Local)

  - Jalankan full-stack (frontend + backend):
    - `npm run dev`
  - Frontend akan berjalan di `http://localhost:3000`
  - Backend API berjalan di `http://localhost:4000`

  Catatan:
  - Frontend default memakai `/api` (same-origin) dan otomatis diproxy ke backend saat development.
  - Jika API ada di host lain, set `VITE_API_BASE_URL` di `.env` (contoh: `https://api.domainanda.com/api`).

  ## Akun Demo

  - Dosen:
    - Username: `dosen`
    - Password: `Dosen@12345`
  - Mahasiswa:
    - Username: `a001`
    - Password: `Mahasiswa@12345`

  ## Quality Gate Sebelum Deploy

  - Typecheck + unit/integration + build:
    - `npm run check`
  - E2E Playwright:
    - `npm run test:e2e`

  ## Menjalankan Backend Saja (Production-like)

  - `npm run start:server`
  