/* Isi checklist setup (tab Setup). Aturan di CLAUDE.md. `saran` = langkah berikutnya kalau syarat itu belum terpenuhi.
   Teks yang bergantung arah memakai {buy: ..., sell: ...}.
   Bonus punya `materi` = id kartu materi (data/concepts.js) untuk tautan "Pelajari". */
window.SETUP = {
  required: [
    {
      id: 'bias', text: 'Bias TF besar (1D/4H) searah dengan arah entry.',
      saran: 'Buka 1D dan 4H dulu. Kalau arahnya berlawanan, tunggu atau ikut TF besar.'
    },
    {
      id: 'area', text: 'Harga berada di FVG/OB TF besar (area kerja).',
      saran: 'Tandai FVG atau OB di 4H/1H, lalu tunggu harga masuk ke zona itu. Jangan kejar harga di luar zona.'
    },
    {
      id: 'konfirmasi', text: 'Konfirmasi di TF entry (15m/5m): CHoCH atau BOS dengan body close.',
      saran: 'Tunggu candle 15m atau 5m close. Wick yang menembus saja belum konfirmasi.'
    },
    {
      id: 'zonaentry', text: 'Entry di FVG/OB TF kecil (5m/1m).',
      saran: 'Setelah konfirmasi, cari FVG atau OB di 5m/1m. Pasang entry di titik tengah (50%) zona.'
    },
    {
      id: 'slrr', text: 'SL di luar zona atau di luar low/high sweep, dan TP minimal RR 1:2.',
      saran: 'Letakkan SL di luar sisi jauh zona (atau di luar low/high sweep). Kalau TP belum 2 kali jarak risiko, lewati setup ini.'
    }
  ],
  bonus: [
    { id: 'sweep', materi: 'liquidity', text: 'Ada sweep liquidity sebelum entry.' },
    { id: 'zonaharga', materi: 'premdisc', text: { buy: 'Entry di area discount (di bawah 50% range).', sell: 'Entry di area premium (di atas 50% range).' } },
    { id: 'smt', materi: 'smt', text: 'SMT mendukung (mis. XAUUSD vs XAGUSD).' },
    { id: 'sesi', materi: 'sesi', text: 'Jam sesi aktif (London atau New York).' }
  ],
  aturanWaktu: [
    'Konfirmasi hanya dihitung SETELAH candle close di TF itu.',
    'Jangan entry di tengah candle yang belum close.',
    'Hindari 1–2 menit sebelum rilis berita besar.'
  ]
};
