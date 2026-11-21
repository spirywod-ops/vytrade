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
- Hammer: body kecil di atas, lower wick minimal 2x body, upper wick sangat kecil. Shooting star: kebalikannya. Hanya bermakna di area FVG/OB atau setelah sweep, bukan sinyal tunggal.
- Engulfing: body candle kedua menutupi seluruh body candle pertama dengan arah berlawanan. Inside bar: seluruh range candle berada di dalam range candle sebelumnya (mother bar); arah breakout mengikuti body close di luar mother bar.
- Doji: open dan close hampir sama (body sangat kecil), tanda ragu. Marubozu: body penuh tanpa atau hampir tanpa wick, tanda dorongan kuat.
- Candle expansion (displacement): satu atau beberapa candle berbody besar dengan range minimal 1,5x rata-rata range 10 candle sebelumnya, close dekat ekstrem, biasanya meninggalkan FVG dan menembus struktur.
- Consolidation: harga sideways dalam range dengan candle kecil, likuiditas menumpuk di atas dan bawah range. Breakout valid: body close di luar range lalu bertahan. Fakeout: wick keluar range lalu close kembali ke dalam (sama dengan sweep).
- Reversal: struktur berbalik (CHoCH, lalu konfirmasi). Continuation: pullback ke FVG/OB lalu BOS searah tren.
- Breaker block: OB yang ditembus body close berlawanan, lalu zonanya berbalik peran (analog IFVG), biasanya setelah sweep dan CHoCH. Catatan: definisi breaker bervariasi antar trader; ini definisi VyTrade.
- CISD (Change in State of Delivery): setelah rangkaian candle searah (delivery) yang membentuk sebuah swing, harga body close melewati open candle pertama rangkaian itu ke arah berlawanan. Bullish CISD: setelah rangkaian candle turun yang berakhir di low, body close di atas open candle turun pertama rangkaian itu. Bearish kebalikannya. Hanya konfirmasi di TF entry (biasanya setelah sweep), bukan sinyal tunggal. Entry tetap di FVG/OB yang tercipta dari gerakan CISD. Catatan: definisi CISD bervariasi antar trader; ini definisi VyTrade.
- QML (Quasimodo Level), versi bearish: uptrend (HH dan HL), harga membuat higher high (head) lalu CHoCH bearish (body close di bawah HL terakhir), lalu kembali ke level high "left shoulder" (high sebelum head) sebagai QML. Entry SP di QML bila ada FVG/OB di area itu. Bullish kebalikannya. Catatan: penentuan level QML bervariasi antar trader; ini definisi VyTrade.
- Inducement: swing minor (pullback kecil) antara posisi harga dan zona FVG/OB yang disapu dulu sebelum harga bereaksi di zona. Menjebak trader yang masuk terlalu awal.
- Turtle soup (liquidity raid): wick menembus high/low penting (equal high/low, high/low sesi Asia, high/low n-candle) lalu body close kembali ke dalam. Entry berlawanan arah tembusan di FVG/OB berikutnya. Beda dari kartu "Liquidity sweep": turtle soup menekankan level besar atau level sesi. Body close yang bertahan di luar level = BOS, bukan turtle soup.
- AMD (Accumulation, Manipulation, Distribution): fase 1 range sideways, fase 2 sweep atau fakeout ke satu sisi range yang berlawanan dengan tujuan, fase 3 expansion ke arah sebenarnya. Pada sesi: Asia sering menjadi range, London sering menjadi manipulasi, New York sering menjadi distribusi, tetapi itu kecenderungan, bukan aturan.

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

## Sistem level (peta belajar di tab Belajar)
- Level 1 Dasar, Level 2 Menengah, Level 3 Lanjut, Level 4 Expert. Tiap kartu punya tanda centang saat sudah dibuka dan tiap level punya persentase progres (disimpan di localStorage `vytrade.progress`, ikut ekspor/impor).
- Zona entry tetap hanya FVG dan OB. Konsep lain adalah konteks atau konfirmasi, bukan sinyal tunggal.
- Istilah "OCL" belum didefinisikan pengguna; jangan ditambahkan.

## Format studi kasus (dipakai di Tahap 10)
5 slide dari TF besar ke kecil: Konteks pasar (1D), Profil pasar (4H), Level kunci dan konfirmasi (15m), Teknik entry (2m), Eksekusi (hasil dalam R). Chart selalu buatan sendiri (data ilustrasi), tidak menyalin gambar orang lain.

## Fitur
Materi bertahap (Dasar, Struktur, Zona, Top-down, Eksekusi, Lanjut) · Kuis (pilihan ganda, benar/salah, tebak zona di chart, selalu ada penjelasan) · Flashcard · Checklist setup · Glosarium + pencarian · Jurnal setup · Progres.

## Tahap pembangunan
Tahap 1–8 sudah selesai (kerangka PWA, Dasar, Struktur, Zona, Top-down + Checklist, Kuis/flashcard/glosarium, Jurnal, Lanjut, Eksekusi, Peta belajar + Level 1 dan Level 2 baru).
9. Level 3 baru: kartu CISD, QML, inducement & turtle soup, AMD (masing-masing minimal 2 contoh valid + 1 BELUM VALID, penanda khusus di chart, flashcard, glosarium, minimal 3 soal kuis).
10. Level 4 Expert (IRL ke ERL, narasi bias HTF) + 6 studi kasus.
11. Simulasi baca chart, kalkulator lot, tag kesalahan jurnal.
Setelah tahap 1 dan seterusnya, pandu deploy ke GitHub Pages (klik demi klik) agar bisa dipasang di iPhone.
