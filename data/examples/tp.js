/* Contoh Take Profit dan RR 1:2 (Tahap 7B): TP = entry ± 2 x jarak risiko. Opsi: target ke liquidity terdekat selama RR >= 1:2.
   - tp-bull : OB bullish, TP tepat RR 1:2; garis "Liq" = swing high di atasnya (opsi target, RR jauh di atas 1:2).
   - tp-bear : cermin dari FVG bullish -> entry SP, TP tepat RR 1:2.
   - tp-low  : BELUM VALID. TP ditaruh 1:1 (terlalu dekat); harga lanjut jauh melewati TP yang benar (RR 1:2).
   Data buatan sendiri. Dicek oleh tests/validate.html (zona, entry 50%, SL di luar zona, RR tepat 1:2 / di bawah 1:2, hasil). */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316', GOOD = '#1f9d55';
  var LH = 2665.5; // swing high terakhir (candle 14) dari V.head
  function f(v) { return String(r2(v)); }
  function plan(top, bot, off) {
    var e = r2((top + bot) / 2), s = r2(bot - off), t = r2(e + 2 * (e - s));
    return { entry: e, sl: s, tp: t };
  }

  // D: OB bullish (candle 19), CHoCH candle 22 (close 2668 > LH), swing high candle 22 (2668.5) = liquidity di atas.
  var obBull = V.head([
    [2653, .5, .6], [2651, .5, .9], [2658, .4, .3], [2663, .5, .4], [2668, .5, .4],
    [2666.5, .4, .5], [2663, .4, .5], [2659, .4, .5], [2655, .4, .5], [2652.5, .4, .9],
    [2656, .5, .4], [2660, .5, .4], [2664, .5, .5], [2667, .5, .5], [2669.5, .6, .5]
  ]);
  var oTop = obBull[19].h, oBot = obBull[19].l;          // 2653.5 dan 2650.1
  var po = plan(oTop, oBot, 0.7);
  var liq = obBull[22].h;                                // 2668.5

  // A3: FVG bullish (candle 20-22, zona 2657.4-2662.5), CHoCH candle 21, retest candle 26. Dicerminkan jadi SP.
  var fvgBull = V.head([
    [2654, .5, .6], [2656, .4, .4], [2657, .4, .5], [2666.5, .4, .3], [2667.5, .5, 4.0],
    [2665.5, .5, .6], [2663, .4, .5], [2661.5, .4, .5], [2660, .4, .8], [2663, .5, .4],
    [2666.5, .5, .4], [2669, .5, .5], [2671, .6, .5]
  ]);
  var bear = V.mirror(fvgBull);
  var gTop = fvgBull[22].l, gBot = fvgBull[20].h;        // 2662.5 dan 2657.4
  var pg = plan(gTop, gBot, 0.7);

  // A2: FVG bullish (candle 20-22), retest candle 26; TP salah di 1:1, harga lanjut sampai 1:2 dan lebih.
  var low = V.head([
    [2654.2, .4, .8], [2656.5, .4, .5], [2657.5, .5, .4], [2667, .4, .3], [2668, .5, 2.6],
    [2666.5, .5, .6], [2664, .4, .5], [2662, .4, .5], [2660, .4, .6], [2663, .4, .6],
    [2666, .5, .5], [2669.5, .6, .5], [2672, .6, .5]
  ]);
  var lTop = low[22].l, lBot = low[20].h;                // 2664.4 dan 2658
  var pl = plan(lTop, lBot, 0.7);
  var lowTp = r2(pl.entry + (pl.entry - pl.sl));         // RR 1:1

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.tp = [
    {
      id: 'tp-bull', tab: 'Bullish', title: 'TP RR 1:2 (valid) LP, liquidity di atasnya', valid: true,
      hint: 'Hitung dulu: jarak entry ke SL, lalu berapa TP-nya?',
      symbol: 'XAUUSD', tf: 'M5', candles: obBull, meta: { breakAt: 22, liq: liq },
      overlays: [
        { type: 'zone', kind: 'OB', i1: 19, i2: 32, top: oTop, bottom: oBot, label: 'OB' },
        { type: 'line', i1: 14, i2: 22, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'line', i1: 22, i2: 32, y: liq, label: 'Liq', color: SW, pos: 'above', labelAt: 'start' },
        { type: 'arrow', i: 27, y: po.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 27, i2: 32, entry: po.entry, sl: po.sl, tp: po.tp }
      ],
      note: 'Risiko = ' + f(po.entry) + ' − ' + f(po.sl) + ' = ' + f(po.entry - po.sl) + ', jadi TP = ' + f(po.entry) + ' + 2 × ' + f(po.entry - po.sl) + ' = ' + f(po.tp) + ' (RR 1:2). Opsi: target ke liquidity di ' + f(liq) + ' (swing high), RR-nya jauh di atas 1:2.'
    },
    {
      id: 'tp-bear', tab: 'Bearish', title: 'TP RR 1:2 (valid) SP', valid: true,
      hint: 'Hitung dulu: jarak entry ke SL, lalu berapa TP-nya untuk SP?',
      symbol: 'XAUUSD', tf: 'M5', candles: bear, meta: { breakAt: 21 },
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 20, i2: 30, top: m(gBot), bottom: m(gTop), label: 'FVG' },
        { type: 'line', i1: 14, i2: 21, y: m(LH), label: 'CHoCH', color: CH, pos: 'below' },
        { type: 'arrow', i: 26, y: m(pg.entry), label: 'Entry' },
        { type: 'position', side: 'short', i: 26, i2: 30, entry: m(pg.entry), sl: m(pg.sl), tp: m(pg.tp) }
      ],
      note: 'Risiko = ' + f(m(pg.sl)) + ' − ' + f(m(pg.entry)) + ' = ' + f(pg.entry - pg.sl) + '. Untuk SP, TP = ' + f(m(pg.entry)) + ' − 2 × ' + f(pg.entry - pg.sl) + ' = ' + f(m(pg.tp)) + ' (RR 1:2).'
    },
    {
      id: 'tp-low', tab: 'Belum valid', title: 'RR di bawah 1:2 (TP terlalu dekat)', valid: false,
      hint: 'Tebak dulu: apa yang kurang dari TP ini?',
      symbol: 'XAUUSD', tf: 'M5', candles: low, meta: { breakAt: 21 },
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 20, i2: 30, top: lTop, bottom: lBot, label: 'FVG' },
        { type: 'line', i1: 14, i2: 21, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'line', i1: 26, i2: 30, y: pl.tp, label: 'TP 1:2', color: GOOD, pos: 'above' },
        { type: 'arrow', i: 26, y: pl.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 26, i2: 30, entry: pl.entry, sl: pl.sl, tp: lowTp }
      ],
      note: 'Entry ' + f(pl.entry) + ' dan SL ' + f(pl.sl) + ' sudah benar, tetapi TP ' + f(lowTp) + ' hanya RR 1:1. Harga lanjut sampai ' + f(pl.tp) + ' (RR 1:2) dan lebih jauh; TP terlalu dekat memotong hasil, dan satu kali kalah menghapus satu kali menang.'
    }
  ];
})();
