/* Materi. Satu konsep = satu kartu: Apa itu / Cara melihat / Syarat valid / Kesalahan umum.
   `examples` = nama kunci di window.EXAMPLES (lihat data/examples/). */
window.GROUPS = ['Dasar', 'Struktur', 'Zona', 'Top-down', 'Eksekusi', 'Lanjut'];

window.CONCEPTS = [
  {
    id: 'candlestick', group: 'Dasar', title: 'Candlestick', examples: 'candlestick',
    apa: 'Satu candle merangkum pergerakan harga dalam satu periode (misal 15 menit). Bagian utamanya: body (open ke close) dan wick (garis tipis di atas dan bawah).',
    cara: 'Candle naik berwarna putih (close di atas open), candle turun berwarna hitam. Ujung atas wick = high, ujung bawah wick = low.',
    syarat: 'High selalu paling atas dan low paling bawah, body ada di antaranya. Yang dihitung untuk konfirmasi struktur adalah body close, bukan wick.',
    salah: 'Menganggap wick sama kuatnya dengan body. Wick panjang justru tanda harga ditolak, bukan harga diterima.'
  },
  {
    id: 'swing', group: 'Struktur', title: 'HH, HL, LH, LL', examples: 'swing',
    apa: 'Swing high adalah puncak lokal, swing low adalah lembah lokal. Membandingkan swing yang berurutan menunjukkan arah tren.',
    cara: 'Uptrend: HH (higher high) dan HL (higher low). Downtrend: LH (lower high) dan LL (lower low). Swing = candle yang high/low-nya lebih ekstrem dari 2 candle di kiri dan kanannya.',
    syarat: 'Uptrend butuh HH dan HL sekaligus; downtrend butuh LH dan LL sekaligus. Swing baru terkonfirmasi setelah 2 candle berikutnya selesai.',
    salah: 'Menandai swing di tiap goyangan kecil, atau menyebut tren naik hanya dari HH padahal lembahnya makin rendah.'
  },
  {
    id: 'bos', group: 'Struktur', title: 'BOS (Break of Structure)', examples: 'bos',
    apa: 'BOS terjadi saat harga menembus swing searah tren. Tandanya tren masih lanjut.',
    cara: 'Uptrend: cari body close di atas swing high terakhir. Downtrend: body close di bawah swing low terakhir. Tarik garis dari swing itu sampai candle tembus.',
    syarat: 'Searah tren dan harus body close melewati level. Wick yang menembus saja tidak dihitung.',
    salah: 'Menyebut BOS padahal hanya wick yang tembus, atau menyebut BOS untuk tembusan yang berlawanan tren (itu CHoCH).'
  },
  {
    id: 'choch', group: 'Struktur', title: 'CHoCH (Change of Character)', examples: 'choch',
    apa: 'CHoCH adalah tanda pertama tren mungkin berbalik. Harga menembus swing yang berlawanan tren.',
    cara: 'Downtrend: body close di atas LH terakhir = CHoCH bullish. Uptrend: body close di bawah HL terakhir = CHoCH bearish. Setelah itu tunggu harga kembali ke FVG atau OB untuk entry.',
    syarat: 'Berlawanan tren dan body close melewati level. CHoCH hanya konfirmasi; zona entry tetap FVG atau OB.',
    salah: 'Menganggap wick yang menembus LH/HL sebagai CHoCH; itu liquidity sweep, tren belum berubah. Entry langsung di garis CHoCH tanpa zona juga keliru.'
  },
  {
    id: 'bos-vs-choch', group: 'Struktur', title: 'BOS vs CHoCH', examples: 'bosvschoch',
    apa: 'Keduanya sama-sama body close menembus swing. Bedanya hanya arah terhadap tren.',
    cara: 'Searah tren = BOS (tren lanjut). Berlawanan tren = CHoCH (tren mungkin berbalik). Lihat dulu tren lewat HH/HL atau LH/LL, baru beri nama.',
    syarat: 'Dua-duanya wajib body close. Tanpa body close, itu sweep.',
    salah: 'Memberi nama dari arah candle saja (naik = BOS). Yang menentukan nama adalah tren sebelumnya.'
  },
  {
    id: 'fvg', group: 'Zona', title: 'FVG (Fair Value Gap)', examples: 'fvg',
    apa: 'FVG adalah celah harga yang tertinggal saat harga bergerak sangat cepat. Zona ini sering didatangi lagi sebelum harga lanjut.',
    cara: 'Cari 3 candle berurutan dengan candle tengah besar. Celah antara high candle 1 dan low candle 3 (bullish) adalah zonanya; bearish kebalikannya.',
    syarat: 'Bullish: low candle ke-3 di atas high candle ke-1. Bearish: high candle ke-3 di bawah low candle ke-1. Zona belum ditembus body close berlawanan.',
    salah: 'Menganggap wick yang menembus zona sebagai tembus (yang dihitung body close). Memakai FVG yang sudah tertembus, atau pasang SL di dalam zona.',
    pilih: true
  },
  {
    id: 'ifvg', group: 'Zona', title: 'IFVG (Inverse FVG)', examples: 'ifvg',
    apa: 'IFVG adalah FVG yang ditembus body close berlawanan, lalu zonanya berbalik peran. FVG bullish yang ditembus ke bawah jadi resisten bearish, dan sebaliknya.',
    cara: 'Tandai FVG, tunggu body close menembus sisi jauhnya. Lalu tunggu harga kembali ke zona (retest) dan entry di titik tengah (50%) searah tembusan.',
    syarat: 'Wajib body close melewati sisi jauh zona. Setelah itu harga tidak boleh body close balik melewati zona.',
    salah: 'Menyebut IFVG padahal hanya wick yang menembus; FVG-nya masih hidup. Entry saat tembus tanpa menunggu harga kembali ke zona juga keliru.',
    pilih: false
  },
  {
    id: 'ob', group: 'Zona', title: 'OB (Order Block)', examples: 'ob',
    apa: 'OB adalah candle berlawanan arah yang terakhir sebelum gerak kuat yang menembus struktur. Zonanya sering didatangi lagi sebelum harga lanjut.',
    cara: 'OB bullish: candle turun terakhir sebelum naik kuat. OB bearish: candle naik terakhir sebelum turun kuat. Zona = high–low candle itu, titik tengah (50%) boleh jadi entry.',
    syarat: 'Gerak setelahnya kuat dan body close menembus swing (BOS atau CHoCH). Zona belum ditembus body close berlawanan.',
    salah: 'Menandai OB padahal gerak setelahnya tidak menembus struktur (hanya wick). SL di dalam zona juga keliru; SL harus di luar sisi jauh zona.',
    pilih: true
  },
  {
    id: 'hammer', group: 'Dasar', title: 'Hammer & shooting star', examples: 'hammer',
    apa: 'Hammer adalah candle dengan body kecil di atas dan wick bawah panjang (minimal 2x body). Shooting star kebalikannya: body kecil di bawah dan wick atas panjang.',
    cara: 'Lihat apakah wick-nya menyapu low (hammer) atau high (shooting star) lalu close kembali ke dalam. Cari pola ini di dalam OB atau FVG, lalu entry di titik tengah zona setelah candle close.',
    syarat: 'Wick minimal 2x body dan wick di sisi lain sangat kecil. Hanya bermakna di area FVG/OB atau setelah sweep, dan hanya konteks, bukan sinyal tunggal.',
    salah: 'Menganggap setiap candle berwick panjang sebagai sinyal beli atau jual, padahal tanpa zona dan sweep polanya tidak bermakna. Entry di tengah candle sebelum close juga keliru.'
  },
  {
    id: 'engulfing', group: 'Dasar', title: 'Engulfing & inside bar', examples: 'engulfing',
    apa: 'Engulfing: body candle kedua menutupi seluruh body candle pertama dengan arah berlawanan. Inside bar: seluruh range candle berada di dalam range candle sebelumnya (mother bar).',
    cara: 'Cari engulfing di dalam FVG atau OB, lalu entry di titik tengah zona setelah candle close. Untuk inside bar, tunggu body close di luar mother bar; arah breakout mengikuti body close itu.',
    syarat: 'Body kedua menutupi seluruh body pertama, atau seluruh range inside bar ada di dalam mother bar. Tetap butuh konteks FVG/OB, bukan sinyal tunggal.',
    salah: 'Menyebut breakout padahal hanya wick yang keluar dari mother bar. Memakai engulfing di tengah tren tanpa zona juga keliru.'
  },
  {
    id: 'doji', group: 'Dasar', title: 'Doji & marubozu', examples: 'doji',
    apa: 'Doji punya open dan close hampir sama (body sangat kecil), tanda ragu. Marubozu punya body penuh tanpa atau hampir tanpa wick, tanda dorongan kuat.',
    cara: 'Doji di area sweep atau zona menandakan harga mulai ragu. Marubozu yang menembus struktur dan meninggalkan FVG menandakan dorongan; entry tetap di FVG atau OB.',
    syarat: 'Doji: body sangat kecil dibanding range candle. Marubozu: body hampir sepenuh range candle. Keduanya hanya konteks, bukan sinyal tunggal.',
    salah: 'Menganggap doji sebagai tanda pembalikan pasti, padahal itu hanya ragu. Membeli melawan marubozu turun juga keliru.'
  },
  {
    id: 'expansion', group: 'Struktur', title: 'Candle expansion (displacement)', examples: 'expansion',
    apa: 'Candle expansion adalah satu atau beberapa candle berbody besar yang bergerak cepat dan tegas. Range-nya minimal 1,5x rata-rata range 10 candle sebelumnya.',
    cara: 'Cari candle yang jauh lebih panjang dari sekitarnya dengan close dekat ekstrem. Biasanya ia meninggalkan FVG dan menembus struktur (BOS atau CHoCH); entry di FVG itu.',
    syarat: 'Range minimal 1,5x rata-rata 10 candle sebelumnya, body besar, dan close dekat ekstrem. Idealnya meninggalkan FVG dan body close menembus struktur.',
    salah: 'Menyebut candle besar yang berwick panjang sebagai ekspansi. Candle seperti itu menunjukkan penolakan harga, bukan dorongan.'
  },
  {
    id: 'consolidation', group: 'Struktur', title: 'Consolidation (breakout vs fakeout)', examples: 'consolidation',
    apa: 'Consolidation adalah harga bergerak sideways dalam range dengan candle kecil. Likuiditas menumpuk di atas dan di bawah range.',
    cara: 'Tandai high dan low range, lalu tunggu candle yang keluar. Breakout valid kalau body close di luar range lalu bertahan; fakeout kalau hanya wick keluar lalu close kembali ke dalam.',
    syarat: 'Body close di luar range dan candle berikutnya bertahan di luar. Entry tetap di FVG atau OB yang tertinggal, bukan di garis range.',
    salah: 'Entry saat wick baru menyentuh luar range. Menyebut breakout padahal close kembali ke dalam (itu fakeout atau sweep).'
  },
  {
    id: 'reversal', group: 'Struktur', title: 'Reversal vs continuation', examples: 'reversal',
    apa: 'Reversal berarti struktur berbalik: CHoCH lalu konfirmasi. Continuation berarti tren lanjut: pullback ke FVG/OB lalu BOS searah tren.',
    cara: 'Lihat dulu trennya, baru lihat arah tembusannya. Berlawanan tren (CHoCH) = kemungkinan reversal; searah tren (BOS) setelah pullback ke zona = continuation.',
    syarat: 'Reversal butuh CHoCH dengan body close, lalu konfirmasi (misalnya BOS searah arah baru). Continuation butuh pullback ke FVG/OB lalu BOS searah tren.',
    salah: 'Menyebut pullback sebagai reversal padahal tidak ada body close menembus swing berlawanan. Melawan tren hanya karena harga naik atau turun beberapa candle juga keliru.'
  },
  {
    id: 'breaker', group: 'Zona', title: 'Breaker block', examples: 'breaker',
    apa: 'Breaker block adalah OB yang ditembus body close berlawanan, lalu zonanya berbalik peran. Ini analog IFVG, tetapi untuk OB.',
    cara: 'Cari OB yang gagal: biasanya setelah sweep dan CHoCH, harga body close menembus sisi jauhnya. Tunggu harga kembali ke zona dan entry di titik tengah (50%) searah peran baru.',
    syarat: 'Body close melewati sisi jauh OB, lalu zona belum ditembus balik. Definisi breaker bervariasi antar trader; ini definisi VyTrade.',
    salah: 'Menyebut breaker padahal hanya wick yang menembus OB. Entry saat zona baru ditembus, tanpa menunggu harga kembali ke zona, juga keliru.'
  },
  {
    id: 'entry', group: 'Eksekusi', title: 'Entry', examples: 'entry',
    apa: 'Entry adalah harga tempat posisi dibuka. Di VyTrade, entry hanya di zona FVG atau OB di TF kecil (5m/1m), setelah ada konfirmasi CHoCH atau BOS dengan body close.',
    cara: 'Tunggu candle konfirmasi close dulu, lalu tunggu harga kembali ke zona (retest) dan taruh entry di titik tengah (50%). Kalau harga lari menjauh dan tidak kembali ke zona, jangan dikejar; tunggu setup berikutnya.',
    syarat: 'Konfirmasi sudah body close, zona belum ditembus body close berlawanan, dan harga menyentuh titik 50%. Konfirmasi dihitung setelah candle close, bukan di tengah candle.',
    salah: 'Entry saat candle konfirmasi belum close, padahal bisa saja berakhir sebagai wick (sweep). Mengejar harga yang sudah lari tanpa retest juga keliru.'
  },
  {
    id: 'sl', group: 'Eksekusi', title: 'Stop loss (SL)', examples: 'sl',
    apa: 'Stop loss (SL) adalah harga untuk menutup posisi saat setup salah. Dengan SL, kerugian sudah dibatasi sebelum entry.',
    cara: 'Taruh SL sedikit di luar sisi jauh zona: di bawah zona untuk LP, di atas zona untuk SP. Kalau ada sweep, taruh di luar low atau high sweep itu.',
    syarat: 'SL di luar sisi jauh zona, bukan di tengah zona. Jarak entry ke SL (risiko) dipakai menghitung TP agar RR 1:2.',
    salah: 'SL terlalu sempit di dalam zona: wick kecil sudah menyentuhnya, lalu harga lanjut sesuai analisa. Menggeser SL menjauh setelah entry karena takut kena juga keliru.'
  },
  {
    id: 'tp', group: 'Eksekusi', title: 'Take profit dan RR 1:2', examples: 'tp',
    apa: 'Take profit (TP) adalah harga target untuk menutup posisi saat untung. RR (risk reward) 1:2 berarti jarak TP dua kali jarak SL.',
    cara: 'Hitung risiko = jarak entry ke SL, lalu TP = entry ± 2 × risiko (naik untuk LP, turun untuk SP). Opsi lain: target ke liquidity terdekat (EQH/EQL atau swing), asal RR tetap minimal 1:2.',
    syarat: 'RR minimal 1:2. Kalau liquidity terdekat terlalu dekat sehingga RR di bawah 1:2, lewati setup itu atau cari target berikutnya.',
    salah: 'Menaruh TP terlalu dekat supaya cepat untung (RR 1:1 atau kurang). Satu kali kalah lalu menghapus hasil satu kali menang.'
  },
  {
    id: 'noentry', group: 'Eksekusi', title: 'Kapan TIDAK entry', examples: 'noentry',
    apa: 'Tidak entry juga keputusan trading. Lewati setup kalau salah satu syarat checklist belum lengkap.',
    cara: 'Jangan entry kalau bias TF besar tidak jelas, zona sudah ditembus body close, konfirmasi CHoCH/BOS belum ada, atau berita besar akan rilis dalam 1–2 menit. Berita tidak bisa digambar di chart, jadi cek kalender ekonomi sebelum entry.',
    syarat: 'Satu alasan di atas sudah cukup untuk tidak entry. Tunggu sampai kelima syarat wajib di checklist terpenuhi.',
    salah: 'Memaksa entry karena takut ketinggalan (FOMO) atau karena sudah lama menunggu. Setup yang terlewat tidak merugikan, posisi yang dipaksa bisa.'
  },
  {
    id: 'liquidity', group: 'Lanjut', title: 'Liquidity sweep', examples: 'liquidity',
    apa: 'Liquidity adalah area tempat banyak order menumpuk, biasanya di atas equal high (EQH) atau di bawah equal low (EQL). Sweep terjadi saat harga mengambil order itu lalu berbalik.',
    cara: 'Tandai dua high atau low yang sejajar, lalu tunggu satu candle yang wick-nya melewati level itu. Kalau candle tersebut close kembali ke dalam, itu sweep.',
    syarat: 'Wick melewati level, lalu close kembali ke dalam (di bawah EQH atau di atas EQL). Sweep hanya konfirmasi; zona entry tetap FVG atau OB.',
    salah: 'Menyebut sweep padahal body close menembus level dan bertahan; itu BOS. Entry langsung di wick tanpa FVG atau OB juga keliru.'
  },
  {
    id: 'premdisc', group: 'Lanjut', title: 'Premium & Discount', examples: 'premdisc',
    apa: 'Premium/discount membagi sebuah range di titik 50%. Di atas 50% disebut premium (relatif mahal), di bawah 50% disebut discount (relatif murah).',
    cara: 'Tarik garis dari swing low ke swing high terakhir, lalu tandai titik tengahnya (50%). Buy dicari di discount, sell dicari di premium, tetap di FVG atau OB.',
    syarat: 'Range jelas (swing low dan swing high sudah terkonfirmasi) dan zona entry seluruhnya di sisi yang benar: di bawah 50% untuk buy, di atas 50% untuk sell.',
    salah: 'Buy di premium atau sell di discount karena harga terlihat bergerak cepat. Menarik range dari swing yang belum terkonfirmasi juga membuat 50% salah.'
  },
  {
    id: 'smt', group: 'Lanjut', title: 'SMT divergence', examples: 'smt',
    apa: 'SMT terjadi saat dua aset yang biasanya searah tidak kompak: satu membuat high/low baru, yang lain gagal. Pasangannya, misalnya XAUUSD–XAGUSD atau US30–NAS100–SPX500.',
    cara: 'Bandingkan dua chart di TF yang sama pada swing yang sejajar waktunya. Bearish: satu aset HH, yang lain LH. Bullish: satu aset LL, yang lain HL.',
    syarat: 'Aset berkorelasi, swing dibandingkan di waktu yang sama, dan ada aset yang benar-benar gagal membuat high/low baru. SMT hanya konfirmasi tambahan; entry tetap di FVG atau OB.',
    salah: 'Menyebut SMT padahal kedua aset sama-sama membuat high/low baru. Memakai SMT sebagai sinyal tunggal juga keliru.'
  },
  {
    id: 'sesi', group: 'Lanjut', title: 'Sesi: Asia, London, New York', page: 'sesi',
    apa: 'Harga emas dan indeks punya ritme berbeda di tiap sesi: Asia, London, New York. Likuiditas biasanya naik saat London dan New York buka.',
    cara: 'Lihat jam sesi dalam WIB di halaman ini (dihitung otomatis, ikut berubah saat DST). Overlap London dan New York biasanya paling ramai, Asia lebih tenang.',
    syarat: 'Sesi hanya bonus, bukan syarat wajib setup. Pilih entry di jam sesi aktif (London atau New York) dan hindari 1–2 menit sebelum rilis berita besar.',
    salah: 'Menghafal jam WIB sebagai angka tetap padahal bergeser saat DST. Menganggap semua candle di sesi aktif otomatis valid juga keliru.'
  }
];

/* Halaman sesi (js/app.js viewSesi). Jam WIB dihitung VySetup.sessions (Intl), bukan ditulis di sini. */
window.SESI = {
  intro: 'Jam di bawah dihitung otomatis dari zona waktu tiap kota, jadi ikut bergeser saat DST.',
  info: {
    asia: 'Biasanya tenang dan bergerak di range sempit. High dan low-nya sering jadi target liquidity yang disapu saat London buka.',
    london: 'Likuiditas naik tajam saat buka. Sering ada sweep high atau low sesi Asia, lalu arah hari itu mulai terlihat.',
    newyork: 'Volatilitas tinggi saat buka, apalagi saat data ekonomi AS rilis. Biasanya mereda setelah London tutup.'
  },
  overlap: 'Overlap London + New York biasanya jam paling ramai: likuiditas tebal dan gerakan sering lebih bersih. Cocok untuk menunggu setup yang sudah valid.',
  tips: [
    'Sesi aktif hanya bonus di checklist, bukan pengganti syarat wajib.',
    'Hindari 1–2 menit sebelum rilis berita besar.',
    'Akhir pekan pasar tutup, jadi sesi ditandai "Akhir pekan".'
  ]
};

/* Bagian "FVG atau OB, pilih yang mana?" (tampil di kartu yang bertanda pilih: true). */
window.PILIH = {
  judul: 'FVG atau OB, pilih yang mana?',
  teks: 'Keduanya sama-sama zona entry, jadi pilih yang paling jelas dan searah TF besar. Kalau FVG dan OB bertumpuk di area yang sama, itu area yang lebih kuat. Kalau hanya ada satu, tetap boleh dipakai selama syaratnya valid.'
};
