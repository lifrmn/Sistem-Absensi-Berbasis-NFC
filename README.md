
<div align="center">

# 📡 Sistem Absensi NFC — Unismuh

**Sistem absensi modern berbasis NFC dengan real-time monitoring, laporan kehadiran, dan deploy satu perintah.**

[![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)](package.json)
[![Stack](https://img.shields.io/badge/stack-React%20%2B%20Express%20%2B%20SQLite-0052CC?style=flat-square)](#tech-stack)
[![Deploy](https://img.shields.io/badge/deploy-Docker%20Single%20Container-2496ED?style=flat-square&logo=docker)](#-deploy-production)
[![License](https://img.shields.io/badge/license-Private-lightgrey?style=flat-square)](#)

</div>

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🔐 **Auth JWT** | Login dosen & mahasiswa dengan token aman |
| 📡 **Absensi NFC** | Tap kartu NFC untuk mencatat kehadiran real-time |
| 📊 **Dashboard Dosen** | Statistik sesi, monitoring kehadiran, laporan lengkap |
| 🎓 **Dashboard Mahasiswa** | Riwayat kehadiran & persentase personal |
| 📈 **Analitik Kehadiran** | Grafik tren & prediksi mahasiswa perlu perhatian |
| 🐳 **Single Container** | Deploy satu `docker compose` di VPS kecil sekalipun |

---

## 🛠 Tech Stack

```
Frontend  →  React 18 + TypeScript + Tailwind CSS + Vite
Backend   →  Express 5 + SQLite (better-sqlite3) + JWT
Deploy    →  Docker (single container) — Express serve static build
```

---

## 🚀 Menjalankan Lokal

```bash
# 1. Install dependency
npm install

# 2. Salin & isi env
cp .env.example .env
# Pastikan JWT_SECRET minimal 32 karakter

# 3. Jalankan full-stack (Vite + Express berjalan bersamaan)
npm run dev
```

| Endpoint | URL |
|---|---|
| Frontend (Vite) | `http://localhost:3000` |
| Backend API | `http://localhost:4000` |

> Saat development, Vite otomatis memproxy `/api` → backend port 4000.  
> Di production (single container), keduanya berada di origin yang sama.

---

## 👤 Akun Demo

| Role | Username | Password |
|---|---|---|
| 🧑‍🏫 Dosen | `dosen` | `Dosen@12345` |
| 🎓 Mahasiswa | `a001` | `Mahasiswa@12345` |

---

## 🐳 Deploy Production

### Arsitektur

```
┌─────────────────────────────────────────┐
│          Single Docker Container         │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Express (port 4000)             │   │
│  │  ├── GET /api/*   → API routes   │   │
│  │  └── GET /*       → React SPA    │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Volume: app_data → SQLite database      │
└─────────────────────────────────────────┘
          ↑ port 80 (PUBLIC_PORT)
```

### File Deployment

```
Dockerfile.backend        ← multi-stage: build React + run Express
docker-compose.prod.yml   ← satu service, satu port
scripts/deploy-prod.sh    ← startup dengan validasi env
scripts/healthcheck-prod.sh
```

### 1 — Siapkan env production

```bash
cp .env.production.example .env.production
```

Edit `.env.production`:

```env
JWT_SECRET=<random string minimal 32 karakter>
CORS_ORIGIN=https://absensi.example.com
PUBLIC_PORT=80          # ganti jika port 80 sudah terpakai, misal 8080
```

### 2 — Deploy

```bash
bash scripts/deploy-prod.sh
```

Script otomatis:
- ✅ Validasi `JWT_SECRET`
- ✅ Build image (termasuk build React)
- ✅ Start container dan tunggu healthcheck

### 3 — Cek status & health

```bash
bash scripts/healthcheck-prod.sh
```

Atau manual:

```bash
docker compose -f docker-compose.prod.yml ps
curl http://localhost/api/health
curl http://localhost/
```

### 4 — Stop / Restart

```bash
# Stop
docker compose -f docker-compose.prod.yml down

# Restart
docker compose -f docker-compose.prod.yml restart
```

---

## ✅ Quality Gate

Jalankan sebelum deploy:

```bash
# Typecheck + unit test + build
npm run check

# E2E test (Playwright)
npm run test:e2e
```
  