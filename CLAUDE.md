# CLAUDE.md — VyTrade (PWA belajar trading offline untuk iPhone)

## Tujuan
VyTrade: aplikasi belajar trading (XAUUSD dan indeks) untuk satu pengguna, dari dasar sampai lanjut. Dipasang di iPhone lewat Safari "Add to Home Screen" dan harus jalan offline. Konten edukasi, bukan sinyal. Tampilkan disclaimer "Edukasi, bukan saran keuangan" di halaman depan.

## Nama aplikasi
Nama "VyTrade" dipakai di: `manifest.webmanifest` (`name` dan `short_name`), `<title>` halaman, `apple-mobile-web-app-title` (teks ikon home screen), dan halaman depan.

## Cara bekerja dengan pengguna
- Bahasa Indonesia, jawaban singkat, langsung ke langkah.
- Pengguna pemula di Windows: setiap langkah teknis dipandu klik demi klik, berurutan.
- Kerjakan per TAHAP (lihat bawah). Berhenti di akhir tiap tahap, beri cara menguji, tanya sebelum lanjut.
- Setelah tiap tahap selesai dan lolos validasi, tanya saya dulu. Kalau saya setuju, commit dengan pesan singkat berbahasa Indonesia dan push ke main. Jangan commit file rahasia. Jangan force push.
- Jangan menambah library atau framework tanpa izin. Install tool (mis. Pillow untuk ikon) tanya dulu.

## Aturan teknis
- HTML + CSS + JavaScript biasa. Tanpa framework, tanpa build step, tanpa CDN atau font eksternal.
- PWA: `manifest.webmanifest`, `sw.js` (cache-first, nomor versi cache dinaikkan tiap rilis), ikon 180/192/512 + `apple-touch-icon`, meta `apple-mobile-web-app-capable`, `viewport-fit=cover`, padding safe-area.
- Semua path relatif (akan di-host di GitHub Pages dalam subfolder).
- Simpan progres dan jurnal di localStorage. Wajib ada tombol Ekspor/Impor JSON sebagai cadangan.
- Mobile-first (iPhone), tombol minimal 44px, mode terang dan gelap.
- Uji lokal: `python -m http.server 8080` lalu buka `http://localhost:8080`. Kalau `python` tidak dikenali di Windows, pakai `py -m http.server 8080`. Uji offline dengan mode pesawat.
- Saat pengembangan, service worker bisa menyimpan file lama. Naikkan nomor versi cache (`CACHE` di `sw.js`) tiap perubahan, dan beri tahu pengguna cara memaksa muat ulang (Ctrl+Shift+R).
- Setiap file baru yang harus tersedia offline wajib ditambahkan ke daftar `FILES` di `sw.js`.
- Konten ada di file data (`data/*.js`), bukan ditulis langsung di HTML, supaya mudah diedit.

## Struktur folder
index.html, manifest.webmanifest, sw.js, css/, js/ (app.js, chart.js, quiz.js), data/ (konsep, contoh, kuis), assets/icons/, tests/ (validasi data)

## Navigasi bawah (4 tab)
Belajar (materi, flashcard, glosarium) · Latihan (kuis) · Setup (checklist setup) · Jurnal (jurnal + ekspor/impor + progres). Tab yang belum dibangun menampilkan "Segera hadir".

## Aturan chart (PENTING)
- Gambar HARUS candlestick sungguhan (body + wick) yang dirender SVG dari data OHLC `{o,h,l,c}` di `js/chart.js`. Bukan garis zigzag atau skema.
- Gaya seperti chart pengguna: candle naik = putih (outline hitam), turun = hitam. Tetap kontras di mode gelap.
- Overlay di atas candle: zona FVG/IFVG/OB (kotak transparan), garis level BOS/CHoCH, tanda sweep, panah entry, garis SL/TP.
- Label wajib di chart: FVG, IFVG, OB, SP (Short Position), LP (Long Position), plus TF di pojok (contoh "XAUUSD · M15"). Beri tulisan kecil "Ilustrasi".
- Data candle contoh dibuat sendiri (bergaya harga XAUUSD) di `data/examples/`. Pengguna boleh menambah screenshot sendiri di `assets/img/`.
- Setiap konsep: minimal 2 contoh valid (bullish dan bearish) + 1 contoh "belum valid / salah" untuk konsep yang sering keliru (CHoCH vs BOS, wick vs body, FVG yang sudah tertembus).
- Tombol "Tampilkan zona" untuk menyalakan/mematikan overlay supaya pengguna bisa menebak dulu.
- Data contoh wajib divalidasi dengan kode (mis. fungsi deteksi FVG di `tests/`) agar gambar cocok dengan definisi baku.
- Setiap contoh memberi Entry, SL, TP dengan RR 1:2.

## Gaya teks
- Maksimal 2–3 kalimat per bagian. Bahasa sehari-hari. Istilah Inggris boleh, beri arti singkat saat pertama muncul.
- Format kartu materi: Apa itu / Cara melihat / Syarat valid / Kesalahan umum (masing-masing 1–2 kalimat).

## Definisi baku (jangan diubah tanpa izin)
- Patokan zona entry hanya FVG dan OB (IFVG = varian FVG). Struktur (BOS/CHoCH) dan liquidity adalah konfirmasi, bukan zona entry.
- FVG bullish: 3 candle, low candle ke-3 berada di atas high candle ke-1. Zona = jarak itu. Bearish kebalikannya (high candle ke-3 di bawah low candle ke-1).
- FVG tertembus: body close berlawanan melewati sisi jauh zona (bullish: close di bawah batas bawah zona). Zona itu tidak dipakai lagi sebagai FVG.
- IFVG (Inverse FVG): FVG yang ditembus body close berlawanan, lalu zonanya berbalik peran (bullish FVG yang ditembus ke bawah menjadi resisten bearish).
- OB bullish: candle turun terakhir sebelum naik kuat yang menembus struktur. OB bearish kebalikannya. Zona = high–low candle itu, titik tengah (50%) boleh jadi titik entry.
- BOS: body close menembus swing searah tren. CHoCH: body close menembus swing berlawanan tren (LH terakhir saat downtrend, HL terakhir saat uptrend). Wick saja = sweep, bukan CHoCH.
- Liquidity sweep: wick melewati equal high/low atau swing, lalu close kembali ke dalam.
- Premium/discount: di atas/bawah 50% range. Buy di discount, sell di premium.
- SMT: divergensi dua aset berkorelasi (XAUUSD–XAGUSD; US30/NAS100/SPX500). Hanya konfirmasi tambahan, bukan sinyal tunggal.
- Entry/SL/TP contoh: entry di titik tengah zona (50%), SL di luar sisi jauh zona, TP = entry ± 2 × jarak risiko (RR 1:2).

## Cara baca top-down (urutan 1D, 4H, 1H, 30m, 15m, 5m, 1m)
Tampilkan sebagai halaman bertahap, satu chart per TF, dengan penjelasan sebab-akibat dan perbandingan antar TF:
- 1D: bias besar dan zona besar. 4H: struktur utama dan area FVG/OB kerja. 1H: konfirmasi bias, persempit zona. 30m: arah jangka pendek, pilih zona kerja. 15m: tunggu konfirmasi CHoCH/BOS (body close). 5m: cari FVG/OB untuk entry. 1m: presisi entry dan SL.
- Aturan: TF besar menentukan ARAH, TF kecil menentukan TITIK MASUK. Kalau TF besar dan kecil bertentangan, tunggu atau ikut TF besar.
- Penutup tiap contoh: Entry, SL, TP dengan RR 1:2.

## Checklist setup (fitur interaktif, tab Setup)
Pengguna mencentang syarat, app menampilkan VALID / BELUM dan menyebut syarat yang kurang.
Wajib semua:
1. Bias TF besar (1D/4H) searah dengan arah entry.
2. Harga berada di FVG/OB TF besar (area kerja).
3. Konfirmasi di TF entry (15m/5m): CHoCH atau BOS dengan body close.
4. Entry di FVG/OB TF kecil (5m/1m).
5. SL di luar zona atau di luar low/high sweep. TP minimal RR 1:2.
Bonus (menambah keyakinan, tidak wajib): sweep liquidity, posisi discount/premium, SMT, jam sesi aktif.
Aturan waktu ("di menit berapa"): konfirmasi hanya dihitung SETELAH candle close di TF itu (M15 tiap :00/:15/:30/:45, M5 tiap 5 menit, M1 tiap menit). Jangan entry di tengah candle yang belum close, dan hindari 1–2 menit sebelum rilis berita besar.
Jam sesi ditampilkan dalam WIB. Hitung dengan `Intl.DateTimeFormat` (zona Europe/London dan America/New_York), jangan di-hardcode, karena bergeser saat DST.

## Fitur
Materi bertahap (Dasar, Struktur, Zona, Top-down, Eksekusi, Lanjut) · Kuis (pilihan ganda, benar/salah, tebak zona di chart, selalu ada penjelasan) · Flashcard · Checklist setup · Glosarium + pencarian · Jurnal setup · Progres.

## Tahap pembangunan
1. Kerangka PWA + navigasi + `chart.js` + satu konsep contoh (FVG). Uji di iPhone.
2. Dasar + Struktur: candlestick, HH/HL/LH/LL, BOS, CHoCH (+ contoh salah).
3. Zona: FVG, IFVG, OB, masing-masing minimal 2 contoh.
4. Top-down 1D→1m + Checklist setup.
5. Kuis, flashcard, glosarium.
6. Jurnal + ekspor/impor JSON.
7. Lanjut: liquidity, premium/discount, SMT, sesi.
Setelah tahap 1 dan seterusnya, pandu deploy ke GitHub Pages (klik demi klik) agar bisa dipasang di iPhone.
