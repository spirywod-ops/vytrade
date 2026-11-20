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
