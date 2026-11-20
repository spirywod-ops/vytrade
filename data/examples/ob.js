/* Contoh OB (Order Block): candle berlawanan TERAKHIR sebelum gerak kuat yang menembus struktur (body close).
   Zona = high–low candle itu, entry di titik tengah (50%).
   - ob-bull : candle turun terakhir sebelum naik kuat, body close tembus LH -> entry LP.
   - ob-bear : cermin (candle naik terakhir sebelum turun kuat) -> entry SP.
   - ob-weak : gerak setelahnya TIDAK menembus struktur (hanya wick) = BUKAN OB valid.
   Data buatan sendiri. Dicek oleh tests/validate.html (deteksi OB, struktur tertembus body close, RR 1:2, hasil TP/SL). */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var LH = 2665.5; // swing high terakhir (candle 14) dari V.head

  // [close, wickAtas, wickBawah]; candle 18 = OB (turun), 19-20 impuls naik, candle 20 close 2666.5 > LH.
  var bull = V.head([
    [2652.5, .5, .8], [2659, .6, .4], [2666.5, .6, .5], [2668, .8, .5],
    [2664, .4, .6], [2660, .4, .6], [2656, .4, .8], [2655, .3, 1.8],
    [2659, .5, .5], [2662, .5, .5], [2665, .6, .5]
  ]);
  var bear = V.mirror(bull);
  // Contoh lemah: candle 20 hanya wick melewati LH (high 2666), body close 2663.5; lalu harga jatuh.
  var weak = V.head([
    [2652.5, .5, .8], [2659, .6, .4], [2663.5, 2.5, .5], [2660, .4, .5],
    [2656, .4, .6], [2654, .3, 1.2], [2650, .5, .5], [2646, .5, .6], [2643, .5, .8], [2640, .5, .6]
  ]);

  var obTop = bull[18].h, obBot = bull[18].l;           // 2655.5 dan 2651.7
  var entry = r2((obTop + obBot) / 2), sl = r2(obBot - 0.7), tp = r2(entry + 2 * (entry - sl));
  var CH = '#d946ef';

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.ob = [
    {
      id: 'ob-bull', tab: 'Bullish', title: 'OB bullish (valid) + entry LP', valid: true,
      symbol: 'XAUUSD', tf: 'M15', candles: bull, meta: { breakAt: 20 },
      overlays: [
        { type: 'zone', kind: 'OB', i1: 18, i2: 27, top: obTop, bottom: obBot, label: 'OB' },
        { type: 'line', i1: 14, i2: 20, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'arrow', i: 25, y: entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 25, i2: 28, entry: entry, sl: sl, tp: tp }
      ],
      note: 'Candle 18 = candle turun terakhir sebelum naik kuat. Candle 20 body close di 2666.5, menembus LH 2665.5. Zona OB 2651.7–2655.5, entry LP 2653.6 (50%), SL 2651 di bawah zona, TP 2658.8 (RR 1:2).'
    },
    {
      id: 'ob-bear', tab: 'Bearish', title: 'OB bearish (valid) + entry SP', valid: true,
      symbol: 'XAUUSD', tf: 'M15', candles: bear, meta: { breakAt: 20 },
      overlays: [
        { type: 'zone', kind: 'OB', i1: 18, i2: 27, top: m(obBot), bottom: m(obTop), label: 'OB' },
        { type: 'line', i1: 14, i2: 20, y: m(LH), label: 'CHoCH', color: CH, pos: 'below' },
        { type: 'arrow', i: 25, y: m(entry), label: 'Entry' },
        { type: 'position', side: 'short', i: 25, i2: 28, entry: m(entry), sl: m(sl), tp: m(tp) }
      ],
      note: 'Candle 18 = candle naik terakhir sebelum turun kuat. Candle 20 body close di 2633.5, menembus HL 2634.5. Zona OB 2644.5–2648.3, entry SP 2646.4 (50%), SL 2649 di atas zona, TP 2641.2 (RR 1:2).'
    },
    {
      id: 'ob-weak', tab: 'Belum valid', title: 'Gerak tidak menembus struktur (bukan OB)', valid: false,
      symbol: 'XAUUSD', tf: 'M15', candles: weak, meta: { wickAt: 20 },
      overlays: [
        { type: 'zone', kind: 'OFF', i1: 18, i2: 24, top: obTop, bottom: obBot, label: 'OB?' },
        { type: 'line', i1: 14, i2: 22, y: LH, label: 'LH', color: CH, pos: 'above' },
        { type: 'text', i: 20, y: 2669, text: 'Wick saja', dy: 0 },
        { type: 'arrow', i: 23, y: entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 23, i2: 26, entry: entry, sl: sl, tp: tp }
      ],
      note: 'Setelah candle 18, harga naik tapi candle 20 hanya wick melewati LH 2665.5 dan body close 2663.5. Struktur belum tembus, jadi candle 18 bukan OB valid. LP di 2653.6 kena SL 2651.'
    }
  ];
})();
