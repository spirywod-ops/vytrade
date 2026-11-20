/* Contoh BOS (Break of Structure): body close menembus swing SEARAH tren. Data buatan sendiri.
   Garis BOS punya `struct` (kind, dir) dan dicek oleh tests/validate.html: level = high/low swing,
   titik tembus = candle pertama yang BODY CLOSE-nya melewati level (wick saja tidak dihitung). */
(function () {
  var V = window.VyData;
  var COL = '#0e9aa7';

  // Downtrend lalu body close di bawah swing low terakhir (LL) = BOS bearish.
  var bear = V.head([
    [2657, .5, .6], [2658.5, 1.2, .6], [2656, .6, .6], [2653, .5, .6],
    [2650, .5, .8], [2647.5, .5, 1.2], [2649, .6, .6]
  ]);
  var bull = V.mirror(bear);

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.bos = [
    {
      id: 'bos-bull', title: 'BOS bullish (searah uptrend)', badge: 'CONTOH',
      hint: 'Coba tebak dulu di candle mana BOS terjadi, lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: bull,
      overlays: [
        { type: 'text', i: 14, y: bull[14].l, dy: 11, text: 'HL' },
        { type: 'text', i: 17, y: bull[17].h, dy: -4, text: 'HH' },
        { type: 'line', i1: 17, i2: 21, y: bull[17].h, label: 'BOS', color: COL, pos: 'above', struct: { kind: 'BOS', dir: 'up' } }
      ],
      note: 'Tren naik (HH dan HL). Candle ke-21 body close di atas high swing terakhir (HH) = BOS bullish: tren lanjut, searah.'
    },
    {
      id: 'bos-bear', title: 'BOS bearish (searah downtrend)', badge: 'CONTOH',
      hint: 'Coba tebak dulu di candle mana BOS terjadi, lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: bear,
      overlays: [
        { type: 'text', i: 14, y: bear[14].h, dy: -4, text: 'LH' },
        { type: 'text', i: 17, y: bear[17].l, dy: 11, text: 'LL' },
        { type: 'line', i1: 17, i2: 21, y: bear[17].l, label: 'BOS', color: COL, pos: 'below', struct: { kind: 'BOS', dir: 'down' } }
      ],
      note: 'Tren turun (LH dan LL). Candle ke-21 body close di bawah low swing terakhir (LL) = BOS bearish: tren lanjut, searah.'
    }
  ];
})();
