/* Contoh Struktur: HH/HL (uptrend) dan LH/LL (downtrend). Data buatan sendiri.
   Overlay teks punya `swing` (label yang diharapkan) dan dicek oleh tests/validate.html
   terhadap deteksi swing (fractal 2 candle kiri-kanan). Contoh anatomi: tanpa entry/SL/TP. */
(function () {
  var V = window.VyData;

  var down = V.head([[2657, .5, .6], [2659, .6, .6]]);
  var up = V.mirror(down);

  // [index candle, 'H' (swing high) / 'L' (swing low), label]
  function marks(cs, list) {
    return list.map(function (m) {
      var hi = m[1] === 'H';
      return { type: 'text', i: m[0], y: hi ? cs[m[0]].h : cs[m[0]].l, dy: hi ? -4 : 11, text: m[2], swing: m[2], at: m[1] };
    });
  }

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.swing = [
    {
      id: 'swing-up', title: 'Uptrend: HH dan HL', badge: 'CONTOH',
      hint: 'Coba tebak dulu titik HH dan HL, lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: up,
      overlays: marks(up, [[2, 'L', 'SL'], [5, 'H', 'SH'], [8, 'L', 'HL'], [11, 'H', 'HH'], [14, 'L', 'HL'], [17, 'H', 'HH']]),
      note: 'Puncak (swing high) makin tinggi = HH, lembah (swing low) makin tinggi = HL. Selama HH dan HL terus terbentuk, tren naik. SH dan SL pertama hanya titik awal untuk dibandingkan.'
    },
    {
      id: 'swing-down', title: 'Downtrend: LH dan LL', badge: 'CONTOH',
      hint: 'Coba tebak dulu titik LH dan LL, lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: down,
      overlays: marks(down, [[2, 'H', 'SH'], [5, 'L', 'SL'], [8, 'H', 'LH'], [11, 'L', 'LL'], [14, 'H', 'LH'], [17, 'L', 'LL']]),
      note: 'Puncak makin rendah = LH, lembah makin rendah = LL. Selama LH dan LL terus terbentuk, tren turun.'
    }
  ];
})();
