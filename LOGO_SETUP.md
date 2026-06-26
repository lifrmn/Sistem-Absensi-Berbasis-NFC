# Setup Logo Universitas Muhammadiyah Makassar

Aplikasi sudah dipersiapkan untuk menampilkan logo resmi UNISMUH Makassar di semua halaman branding.

## Langkah-Langkah Integrasi

### 1. Siapkan File Logo

1. Dapatkan logo resmi Universitas Muhammadiyah Makassar (format PNG atau SVG dengan transparansi)
2. Sesuaikan ukuran dan kualitas:
   - **Resolusi minimal**: 512x512 px
   - **Format**: PNG dengan transparansi (background transparan)
   - **Ukuran file**: < 100 KB ideal
3. Simpan file sebagai: **`public/logo-unismuh.png`**

### 2. Verifikasi Lokasi File

File harus berada di:
```
Sistem-Absensi-Berbasis-NFC/
└── public/
    └── logo-unismuh.png
```

Saat development (`npm run dev`), file akan diakses di `/logo-unismuh.png` (root URL).
Saat production (Docker), Nginx menyajikannya dari `public/` folder yang dikopi ke container.

### 3. Testing

Jalankan aplikasi dan cek apakah logo muncul di:

#### Splash Screen (Halaman Awal)
- File: `src/components/SplashScreen.tsx`
- Logo akan berputar dengan animasi
- Fallback: Ikon `GraduationCap` jika file tidak ditemukan

#### Login Page (Desktop View)
- File: `src/components/LoginPage.tsx`
- Logo ditampilkan di sebelah kiri untuk resolusi desktop (lg+)
- Fallback: Ikon di mobile view

#### Login Page (Mobile View)
- File: `src/components/LoginPage.tsx`
- Logo kecil ditampilkan di atas form untuk mobile

#### Design Showcase
- File: `src/components/DesignShowcase.tsx`
- Logo ditampilkan bersama ikon NFC

### 4. Jalankan Aplikasi

```bash
# Development dengan hot-reload
npm run dev

# Production
npm run build
npm run start:server

# Atau pakai Docker
bash scripts/deploy-prod.sh
```

## Komponen `UnismuhLogo`

File: `src/components/UnismuhLogo.tsx`

Dua varian tersedia:

### 1. `UnismuhLogo`
Hanya menampilkan gambar logo, langsung fail jika file tidak ada.

```tsx
import { UnismuhLogo } from './components/UnismuhLogo';

<UnismuhLogo size="w-24 h-24" className="drop-shadow-lg" />
```

### 2. `UnismuhLogoWithFallback` ✅ (Yang digunakan di aplikasi)
Menampilkan logo, dengan fallback otomatis ke ikon GraduationCap jika file gagal dimuat.

```tsx
import { UnismuhLogoWithFallback } from './components/UnismuhLogo';

<UnismuhLogoWithFallback 
  size="w-24 h-24"
  fallbackClassName="text-white"
/>
```

**Props:**
- `size`: Tailwind size class (default: `w-24 h-24`)
- `className`: Extra Tailwind classes untuk `<img>`
- `fallbackClassName`: Tailwind untuk fallback ikon

## Troubleshooting

### Logo tidak muncul di browser

1. **Cek console browser**:
   - Buka DevTools (F12)
   - Lihat tab Network dan cari `/logo-unismuh.png`
   - Apakah status 200 atau 404?

2. **Verifikasi path file**:
   ```bash
   ls -la public/logo-unismuh.png
   ```
   File harus ada di folder `public/`

3. **Test dengan URL langsung**:
   - Development: Buka `http://localhost:3000/logo-unismuh.png` di browser
   - Production: Buka `http://your-domain/logo-unismuh.png`

4. **Cek permission file**:
   ```bash
   chmod 644 public/logo-unismuh.png
   ```

### Logo blur/pecah

- Gunakan resolusi tinggi (512x512 px atau lebih)
- Pastikan format PNG (bukan JPG) agar bisa transparan
- Cek ukuran file: jangan > 200 KB

### Fallback ikon tetap tampil

Jika ikon GraduationCap tetap muncul, berarti logo.png gagal dimuat.
Cek:
1. Apakah file `public/logo-unismuh.png` ada?
2. Apakah browser punya akses ke file?
3. Cek console DevTools untuk error message

## Optimasi untuk Production

### Docker Deployment

File akan otomatis disertakan dalam Docker image karena:
1. `Dockerfile.frontend` copy `.` (semua file termasuk `public/`)
2. Nginx menyajikannya dari `/usr/share/nginx/html` (dari `build/` yang merupakan copy dari `public/`)

### Asset Caching

Nginx sudah dikonfigurasi untuk cache static assets selamanya:
- File di-cache dengan header `Cache-Control: public, immutable`
- Vite build menamakan asset dengan hash (contoh: `logo-unismuh.png` akan tetap sama tapi bisa di-cache)

### CDN (Optional)

Jika ingin menggunakan CDN:
1. Upload `public/logo-unismuh.png` ke CDN Anda
2. Update reference di `src/components/UnismuhLogo.tsx`:
   ```tsx
   src="/logo-unismuh.png"  // ubah ke URL CDN
   ```

## File yang Telah Dimodifikasi

| File | Perubahan |
|------|-----------|
| `src/components/UnismuhLogo.tsx` | **Baru**: Komponen logo dengan fallback |
| `src/components/LoginPage.tsx` | Ganti `GraduationCap` → `UnismuhLogoWithFallback` |
| `src/components/SplashScreen.tsx` | Ganti `GraduationCap` → `UnismuhLogoWithFallback` |
| `src/components/DesignShowcase.tsx` | Ganti `GraduationCap` → `UnismuhLogoWithFallback` |
| `public/` | **Baru**: Folder untuk menyimpan logo.png |

## Verifikasi Quick Check

Setelah setup, jalankan:

```bash
npm run typecheck    # Pastikan tidak ada TS error
npm test             # Jalankan unit tests
npm run build        # Build untuk production
```

Semua harus hijau ✓

---

**Catatan**: Fallback ikon tetap berfungsi sementara logo setup tidak selesai, jadi tidak ada downtime visual.
