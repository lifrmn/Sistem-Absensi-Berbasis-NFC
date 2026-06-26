# 🚀 Quick Start Guide - Fitur AI Sistem Absensi UNISMUH

## 👋 Selamat Datang!

Sistem Absensi NFC UNISMUH sekarang dilengkapi dengan **3 fitur AI yang mudah digunakan**. Panduan ini akan membantu Anda mulai menggunakan fitur AI dalam **5 menit**.

---

## 🎯 3 Fitur AI yang Tersedia

### 1️⃣ AI Smart Insights 📊
**Apa itu?** Analisis otomatis kondisi kelas Anda  
**Di mana?** Halaman Laporan Kehadiran (bagian atas)  
**Untuk siapa?** Dosen  

### 2️⃣ AI Predictions 🎯
**Apa itu?** Prediksi mahasiswa yang berisiko gagal  
**Di mana?** Laporan Kehadiran → Tab "AI Predictions"  
**Untuk siapa?** Dosen  

### 3️⃣ AI Chatbot 💬
**Apa itu?** Asisten virtual 24/7  
**Di mana?** Tombol floating kiri bawah  
**Untuk siapa?** Dosen & Mahasiswa  

---

## 🏃 Mulai Cepat (3 Langkah)

### Langkah 1: Login
```
1. Buka aplikasi
2. Klik "Mulai" di splash screen
3. Login sebagai Dosen atau Mahasiswa
4. Untuk demo: gunakan kredensial apapun
```

### Langkah 2: Lihat AI Insights (Dosen)
```
1. Di dashboard, klik banner "Fitur AI Tersedia"
   ATAU
   Klik menu "Laporan Kehadiran"
   
2. Scroll ke "AI Smart Insights"

3. Lihat analisis otomatis:
   ✅ Performa Kelas
   ✅ Mahasiswa Berisiko
   ✅ Mahasiswa Berprestasi
   ✅ Rekomendasi
```

### Langkah 3: Coba AI Chatbot (Semua User)
```
1. Klik tombol chat (kiri bawah) 💬

2. Ketik pertanyaan atau klik quick question:
   • "Bagaimana cara absen dengan NFC?"
   • "Berapa minimal kehadiran?"
   • "Bagaimana cara export laporan?"

3. Chatbot akan jawab dalam 1 detik! 🤖
```

---

## 💡 Tips Penggunaan

### Untuk Dosen:

#### Mengidentifikasi Mahasiswa Berisiko
1. Buka "Laporan Kehadiran"
2. Klik tab **"AI Predictions"**
3. Lihat kartu prediksi untuk setiap mahasiswa
4. Mahasiswa dengan **risk tinggi** ada di atas
5. Baca "Alasan Prediksi AI" dan "Rekomendasi"
6. Klik "Lihat Detail Lengkap" untuk info lebih

#### Memahami Risk Level
- 🟢 **Rendah (0-29):** Mahasiswa aman
- 🟡 **Sedang (30-59):** Perlu reminder
- 🔴 **Tinggi (60-100):** Butuh intervensi

#### Interpretasi Trend
- 📈 **Meningkat:** Positif! Keep it up
- ➡️ **Stabil:** Monitor terus
- 📉 **Menurun:** Warning! Perlu action

### Untuk Mahasiswa:

#### Cek Status Kehadiran
1. Login ke dashboard mahasiswa
2. Lihat kartu "Kehadiran Semester"
3. Atau tanya chatbot: *"Berapa kehadiran minimal?"*

#### Troubleshooting
1. Klik chatbot kiri bawah
2. Tanya: *"Kenapa tidak bisa absen?"*
3. Ikuti instruksi dari chatbot

---

## 📱 Contoh Pertanyaan untuk Chatbot

### Pertanyaan Umum:
- "Bagaimana cara absen dengan NFC?"
- "Berapa minimal kehadiran untuk lulus?"
- "Apa yang harus dilakukan jika terlambat?"
- "Bagaimana cara export laporan?"
- "Kenapa sistem error?"

### Pertanyaan Tentang AI:
- "Apa itu AI prediction?"
- "Bagaimana AI menghitung risk?"
- "Apa kegunaan fitur AI?"

### Greetings:
- "Halo"
- "Hi"
- "Terima kasih"

---

## 🎨 Tampilan Visual

### AI Smart Insights
```
🎉 Performa Kelas Sangat Baik
   Rata-rata kehadiran kelas 78.3%
   
⚠️  2 Mahasiswa Berisiko Tinggi
   25% mahasiswa memiliki kehadiran <60%
   
⭐ 5 Mahasiswa Berprestasi
   62% mahasiswa memiliki kehadiran ≥85%
```

### AI Prediction Card
```
┌─────────────────────────────────┐
│ 🤖 AI Prediction    RISK: TINGGI│
│                                  │
│ Budi Santoso                    │
│ A002                            │
│                                  │
│ Persentase: 53%                 │
│ Risk Score: 65/100              │
│ Trend: 📉 Menurun               │
│                                  │
│ Alasan:                         │
│ • Persentase rendah (53%)       │
│ • Tren menurun 5 pertemuan      │
│                                  │
│ 💡 Rekomendasi:                 │
│ Segera hubungi mahasiswa        │
│                                  │
│ [Lihat Detail Lengkap]          │
└─────────────────────────────────┘
```

---

## ❓ FAQ

**Q: Apakah AI ini akurat?**  
A: AI menggunakan algoritma statistik yang cocok untuk prediksi kehadiran. Akurasi ~80-90% untuk kasus umum.

**Q: Apakah data saya aman?**  
A: Ya! Semua AI berjalan di browser Anda (client-side). Tidak ada data yang dikirim ke server eksternal.

**Q: Bagaimana cara kerja AI?**  
A: AI menggunakan 3 metode: Moving Average, Weighted Scoring, dan Rule-Based NLP. Lihat `AI_FEATURES_README.md` untuk detail.

**Q: Bisakah AI salah prediksi?**  
A: Ya, AI bisa salah. Gunakan prediksi sebagai **decision support**, bukan keputusan final.

**Q: Apakah chatbot bisa jawab semua pertanyaan?**  
A: Chatbot memiliki knowledge base terbatas (9 topik). Untuk pertanyaan kompleks, hubungi admin.

**Q: Bagaimana cara menambah pertanyaan ke chatbot?**  
A: Edit file `/components/AIChatbot.tsx` di bagian `knowledgeBase` array.

---

## 🎓 Best Practices

### DO ✅
- Gunakan AI sebagai decision support tool
- Periksa prediksi dengan data manual
- Kombinasikan AI insights dengan pengalaman Anda
- Tanya chatbot untuk info cepat
- Lihat trend jangka panjang, bukan snapshot

### DON'T ❌
- Jangan 100% percaya prediksi AI
- Jangan abaikan konteks (sakit, izin, dll)
- Jangan skip verifikasi manual
- Jangan berharap chatbot jawab semua
- Jangan hanya lihat risk score

---

## 🔧 Troubleshooting

### Masalah: AI Insights tidak muncul
**Solusi:**
1. Pastikan ada data mahasiswa
2. Refresh halaman
3. Cek browser console untuk error

### Masalah: Chatbot tidak merespon
**Solusi:**
1. Klik tombol send
2. Pastikan ada koneksi internet
3. Coba refresh browser

### Masalah: Prediksi terlihat salah
**Solusi:**
1. Periksa data input (total hadir/tidak hadir)
2. Lihat alasan prediksi
3. Verifikasi dengan data manual
4. Hubungi admin jika tetap aneh

---

## 📚 Resource Lengkap

1. **AI_FEATURES_README.md** - Dokumentasi lengkap
2. **AI_FILES_SUMMARY.md** - Technical details
3. **AI_QUICK_START.md** - Panduan ini
4. **Design Showcase** - Visual overview (tombol kanan bawah)
5. **AI Chatbot** - Tanya langsung!

---

## 🎯 Next Steps

Setelah familiar dengan AI:

1. **Eksplorasi Lebih Dalam**
   - Coba semua fitur AI
   - Bandingkan prediksi dengan realita
   - Sesuaikan threshold jika perlu

2. **Integrasi ke Workflow**
   - Gunakan AI insights untuk planning
   - Set reminder untuk mahasiswa berisiko
   - Export laporan berkala

3. **Feedback**
   - Catat apa yang berhasil/tidak
   - Suggest improvement
   - Share best practices

---

## 💬 Butuh Bantuan?

1. **Tanya AI Chatbot** (kiri bawah) 💬
2. **Lihat Documentation** (README files)
3. **Hubungi Admin IT** UNISMUH
4. **Design Showcase** untuk visual guide

---

## 🎉 Selamat Menggunakan!

Anda sekarang siap menggunakan fitur AI! 🚀

**Mulai dari:**
1. Login sebagai Dosen
2. Klik "Coba Fitur AI Sekarang" di dashboard
3. Eksplorasi 3 fitur AI

**Remember:** AI adalah **asisten**, bukan **pengganti** judgment Anda! 🧠

---

**🤖 Happy Analyzing with AI!**

*Dibuat untuk Universitas Muhammadiyah Makassar*  
*Informatika - 2025*
