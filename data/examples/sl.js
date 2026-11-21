/* Contoh Stop Loss (Tahap 7B): SL di luar sisi jauh zona, atau di luar low/high sweep. Bukan di tengah zona.
   - sl-bull  : OB = candle sweep (wick menyapu EQL), SL di bawah low sweep -> entry LP di 50% OB.
   - sl-bear  : cermin dari FVG bullish -> SL di atas sisi jauh zona, entry SP di 50% FVG.
   - sl-tight : SALAH. SL terlalu sempit di dalam zona OB; wick menyentuhnya, lalu harga lanjut naik ke TP yang benar.
   Data buatan sendiri. Dicek oleh tests/validate.html (zona OB/FVG, sweep, SL di luar zona/sweep, RR 1:2, hasil TP/SL). */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316', GOOD = '#1f9d55';
  var LH = 2665.5; // swing high terakhir (candle 14) dari V.head
  function f(v) { return String(r2(v)); }
  function plan(top, bot, off) {
    var e = r2((top + bot) / 2), s = r2(bot - off), t = r2(e + 2 * (e - s));
    return { entry: e, sl: s, tp: t };
  }

  // C: sama dengan dasar contoh liquidity (candle 18-25), candle 26 = sweep sekaligus OB (candle turun dengan wick bawah panjang).
  var base = [
    [2658, .5, .6], [2661, .5, .6],
    [2663.5, 1, .5],       // 20 LH terakhir (high 2664.5)
    [2660, .5, .6], [2656.5, .5, .6],
    [2655, .4, 1.6],       // 23 low kedua (2653.4) sejajar low candle 17 (2653.5) = EQL
    [2657, .5, .6], [2656, .5, .6]
  ];
  var sweepBull = V.head(base.concat([
    [2654.2, .4, 2.4],     // 26 sweep + OB: wick turun ke 2651.8, close 2654.2 (kembali di atas EQL)
    [2659, .4, .4],        // 27 impuls naik
    [2665.5, .4, .3],      // 28 body close > LH 2664.5 = CHoCH
    [2663, .5, .5], [2660, .4, .5], [2657, .4, .5],
    [2654.5, .4, .8],      // 32 retest ke 50% OB (entry)
    [2658, .5, .4], [2661.5, .5, .4], [2664, .5, .5]
  ]));
  var EQL = Math.min(sweepBull[17].l, sweepBull[23].l);   // 2653.4
  var LH2 = sweepBull[20].h;                              // 2664.5
  var sTop = sweepBull[26].h, sBot = sweepBull[26].l;     // 2656.4 dan 2651.8
  var ps = plan(sTop, sBot, 0.7);                         // SL 2651.1 = di bawah low sweep

  // A2: FVG bullish (candle 20-22), CHoCH di candle 21, retest candle 26. Dicerminkan jadi SP.
  var fvgBull = V.head([
    [2654.2, .4, .8], [2656.5, .4, .5], [2657.5, .5, .4], [2667, .4, .3], [2668, .5, 2.6],
    [2666.5, .5, .6], [2664, .4, .5], [2662, .4, .5], [2660, .4, .6], [2663, .4, .6],
    [2666, .5, .5], [2669.5, .6, .5], [2672, .6, .5]
  ]);
  var bear = V.mirror(fvgBull);
  var fTop = fvgBull[22].l, fBot = fvgBull[20].h;         // 2664.4 dan 2658
  var pf = plan(fTop, fBot, 0.7);

  // F: OB bullish yang sama seperti contoh entry (candle 19), tetapi SL ditaruh di DALAM zona dan kena wick candle 28.
  var tight = V.head([
    [2652, .5, .6], [2649.5, .5, 1.0], [2657, .5, .4], [2662, .5, .5], [2667, .5, .5],
    [2665, .5, .6], [2661, .4, .6], [2657, .4, .6], [2653, .4, .6],
    [2652, .3, 1.8],       // 27 retest, sentuh entry 2650.5
    [2650, .3, 1.2],       // 28 wick turun ke 2648.8: kena SL sempit 2649, tetap di atas sisi bawah OB 2648.5
    [2655, .5, .5], [2658.5, .5, .4], [2662, .5, .5]
  ]);
  var tTop = tight[19].h, tBot = tight[19].l;             // 2652.5 dan 2648.5
  var rightSl = r2(tBot - 0.7);                           // 2647.8
  var pt = plan(tTop, tBot, 0.7);
  var tightSl = 2649, tightTp = r2(pt.entry + 2 * (pt.entry - tightSl));

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.sl = [
    {
      id: 'sl-bull', tab: 'Bullish', title: 'SL di bawah low sweep + OB (valid) LP', valid: true,
      hint: 'Tebak dulu: di mana SL yang aman untuk LP ini?',
      symbol: 'XAUUSD', tf: 'M5', candles: sweepBull, meta: { sweepAt: 26, level: EQL },
      overlays: [
        { type: 'line', i1: 17, i2: 28, y: EQL, label: 'EQL', color: SW, pos: 'below', labelAt: 'start' },
        { type: 'mark', i: 26, y: sBot, label: 'Sweep', color: SW, pos: 'below' },
        { type: 'line', i1: 20, i2: 28, y: LH2, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'zone', kind: 'OB', i1: 26, i2: 35, top: sTop, bottom: sBot, label: 'OB' },
        { type: 'arrow', i: 32, y: ps.entry, label: 'Entry' },
        { type: 'text', i: 31, y: ps.sl, dy: 4, text: 'SL di luar sweep', anchor: 'end' },
        { type: 'position', side: 'long', i: 32, i2: 35, entry: ps.entry, sl: ps.sl, tp: ps.tp }
      ],
      note: 'Candle ke-26 menyapu EQL ' + f(EQL) + ' (low ' + f(sBot) + ') lalu close ' + f(sweepBull[26].c) + ', sekaligus jadi OB. Entry LP ' + f(ps.entry) + ' (50% OB), SL ' + f(ps.sl) + ' di bawah low sweep (dan di bawah zona), TP ' + f(ps.tp) + ' (RR 1:2).'
    },
    {
      id: 'sl-bear', tab: 'Bearish', title: 'SL di atas sisi jauh FVG (valid) SP', valid: true,
      hint: 'Tebak dulu: di mana SL yang aman untuk SP ini?',
      symbol: 'XAUUSD', tf: 'M5', candles: bear, meta: { breakAt: 21 },
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 20, i2: 30, top: m(fBot), bottom: m(fTop), label: 'FVG' },
        { type: 'line', i1: 14, i2: 21, y: m(LH), label: 'CHoCH', color: CH, pos: 'below' },
        { type: 'arrow', i: 26, y: m(pf.entry), label: 'Entry' },
        { type: 'position', side: 'short', i: 26, i2: 30, entry: m(pf.entry), sl: m(pf.sl), tp: m(pf.tp) }
      ],
      note: 'FVG bearish ' + f(m(fBot)) + '–' + f(m(fTop)) + '. Entry SP ' + f(m(pf.entry)) + ' (50%), SL ' + f(m(pf.sl)) + ' di atas sisi jauh zona (bukan di tengah zona), TP ' + f(m(pf.tp)) + ' (RR 1:2).'
    },
    {
      id: 'sl-tight', tab: 'Belum valid', title: 'SL terlalu sempit di dalam zona (salah)', valid: false,
      hint: 'Tebak dulu: apa yang keliru dari letak SL ini?',
      symbol: 'XAUUSD', tf: 'M5', candles: tight, meta: { rightSl: rightSl },
      overlays: [
        { type: 'zone', kind: 'OB', i1: 19, i2: 30, top: tTop, bottom: tBot, label: 'OB' },
        { type: 'line', i1: 14, i2: 22, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'line', i1: 19, i2: 31, y: rightSl, label: 'SL benar', color: GOOD, pos: 'below' },
        { type: 'arrow', i: 27, y: pt.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 27, i2: 31, entry: pt.entry, sl: tightSl, tp: tightTp }
      ],
      note: 'Entry LP ' + f(pt.entry) + ' di OB ' + f(tBot) + '–' + f(tTop) + ', tetapi SL ' + f(tightSl) + ' ada di dalam zona. Wick candle 28 turun ke ' + f(tight[28].l) + ' dan menyentuh SL, lalu harga lanjut naik. SL di ' + f(rightSl) + ' (di luar zona) tidak tersentuh dan TP ' + f(r2(pt.entry + 2 * (pt.entry - rightSl))) + ' tercapai.'
    }
  ];
})();
