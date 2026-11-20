/* Flashcard: satu kartu per konsep. `id` = id konsep di data/concepts.js (atau 'topdown' / 'checklist').
   depan = istilah; arti = arti singkat; syarat = syarat valid. */
window.FLASHCARDS = [
  { id: 'candlestick', depan: 'Candlestick', arti: 'Satu candle merangkum harga satu periode: body (open ke close) dan wick (high/low).', syarat: 'Naik = putih, turun = hitam. Yang dihitung untuk konfirmasi adalah body close, bukan wick.' },
  { id: 'swing', depan: 'HH, HL, LH, LL', arti: 'Puncak dan lembah lokal yang dibandingkan untuk membaca tren.', syarat: 'Uptrend = HH + HL. Downtrend = LH + LL. Keduanya harus ada sekaligus.' },
  { id: 'bos', depan: 'BOS (Break of Structure)', arti: 'Harga menembus swing searah tren; tren lanjut.', syarat: 'Searah tren dan body close melewati level. Wick saja tidak dihitung.' },
  { id: 'choch', depan: 'CHoCH (Change of Character)', arti: 'Harga menembus swing berlawanan tren; tanda pertama tren mungkin berbalik.', syarat: 'Body close melewati LH terakhir (downtrend) atau HL terakhir (uptrend). Wick saja = sweep.' },
  { id: 'bos-vs-choch', depan: 'BOS vs CHoCH', arti: 'Dua-duanya body close menembus swing; bedanya arah terhadap tren.', syarat: 'Searah tren = BOS. Berlawanan tren = CHoCH. Tanpa body close = sweep.' },
  { id: 'fvg', depan: 'FVG (Fair Value Gap)', arti: 'Celah harga dari gerak cepat 3 candle; zona entry.', syarat: 'Bullish: low candle 3 di atas high candle 1. Bearish: high candle 3 di bawah low candle 1. Belum ditembus body close berlawanan.' },
  { id: 'ifvg', depan: 'IFVG (Inverse FVG)', arti: 'FVG yang ditembus lalu zonanya berbalik peran (support jadi resisten, atau sebaliknya).', syarat: 'Body close berlawanan melewati sisi jauh zona, lalu tunggu harga kembali ke zona (retest).' },
  { id: 'ob', depan: 'OB (Order Block)', arti: 'Candle berlawanan terakhir sebelum gerak kuat yang menembus struktur; zona entry.', syarat: 'Gerak setelahnya body close menembus swing. Zona = high–low candle, entry di 50%, SL di luar sisi jauh.' },
  { id: 'topdown', depan: 'Top-down', arti: 'Membaca chart dari TF besar ke kecil: 1D, 4H, 1H, 30m, 15m, 5m, 1m.', syarat: 'TF besar menentukan ARAH, TF kecil menentukan TITIK MASUK. Kalau bertentangan, tunggu atau ikut TF besar.' },
  { id: 'checklist', depan: 'Checklist setup', arti: 'Daftar syarat yang harus lengkap sebelum entry.', syarat: '5 syarat wajib: bias, area kerja, konfirmasi body close, entry di FVG/OB kecil, SL di luar zona + RR minimal 1:2.' }
];
