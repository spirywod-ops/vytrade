/* Contoh Engulfing & inside bar: pola candle hanya bermakna di konteks (entry tetap di FVG/OB). Data buatan sendiri.
   - engulf-bull / engulf-bear : engulfing di dalam FVG setelah CHoCH -> entry di 50% FVG (LP / SP).
   - inside-bull / inside-bear : inside bar, body close keluar mother bar = breakout, meninggalkan FVG -> entry di 50% FVG.
   - engulf-bad : engulfing bullish di tengah downtrend tanpa zona dan tanpa sweep -> LP kena SL.
   - inside-bad : harga hanya wick keluar dari mother bar, body close kembali ke dalam -> bukan breakout, LP kena SL.
   Dicek oleh tests/validate.html (detektor engulfing/inside bar, konteks, RR 1:2, hasil TP/SL).
   meta: {pat: indeks candle pola (engulfing = candle kedua; inside bar = inside bar), mother (inside bar), kind}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }
  function plan(top, bot, buf) { var e = r2((top + bot) / 2), s = r2(bot - buf), t = r2(e + 2 * (e - s)); return { entry: e, sl: s, tp: t }; }
  var LH = 2665.5; // swing high terakhir dari V.head

  /* ---------- Engulfing di FVG ---------- */
  // 18 = candle 1 FVG, 19 = impuls (body close > LH = CHoCH), 20 = candle 3 FVG. 22 turun, 23 engulfing naik, 24 retest 50% FVG.
  var eb = V.head([
    [2657, .4, .6], [2668, .6, .4], [2670, .8, 4],
    [2666.5, .5, .5], [2662.8, .3, .5], [2667.2, .3, .2],
    [2663.5, .4, 3.2], [2667, .5, .5], [2671, .6, .5], [2673, .6, .5]
  ]);
  var eTop = eb[20].l, eBot = eb[18].h;               // 2664 dan 2657.4
  var pe = plan(eTop, eBot, 1.2);
  var ovEb = [
    { type: 'zone', kind: 'FVG', i1: 18, i2: 26, top: eTop, bottom: eBot, label: 'FVG' },
    { type: 'line', i1: 14, i2: 19, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
    { type: 'mark', i: 23, y: eb[23].l, label: 'Engulfing', color: SW, pos: 'below' },
    { type: 'arrow', i: 24, y: pe.entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 24, i2: 27, entry: pe.entry, sl: pe.sl, tp: pe.tp }
  ];

  /* ---------- Inside bar breakout ---------- */
  // 18 = mother bar, 19 = inside bar (seluruh range di dalam mother), 20 = body close di atas high mother (breakout + CHoCH),
  // 19-21 membentuk FVG, 23 = retest 50% FVG.
  var ib = V.head([
    [2656.5, 1.5, 3], [2655.5, .7, .9], [2668, .4, .4], [2669.5, .8, 3.2],
    [2666, .4, .5], [2662, .4, 1.6], [2666, .5, .5], [2670, .6, .5], [2673, .8, .5]
  ]);
  var iTop = ib[21].l, iBot = ib[19].h;               // 2664.8 dan 2657.2
  var pi = plan(iTop, iBot, 1.2);
  var mHigh = ib[18].h;                               // 2658
  var ovIb = [
    { type: 'zone', kind: 'FVG', i1: 19, i2: 25, top: iTop, bottom: iBot, label: 'FVG' },
    { type: 'line', i1: 14, i2: 20, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
    { type: 'line', i1: 18, i2: 20, y: mHigh, label: 'Breakout', color: SW, pos: 'below', labelAt: 'start' },
    { type: 'text', i: 18, y: ib[18].l, dy: 11, text: 'Mother' },
    { type: 'mark', i: 19, y: ib[19].h, label: 'Inside bar', color: SW, pos: 'above' },
    { type: 'arrow', i: 23, y: pi.entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 23, i2: 26, entry: pi.entry, sl: pi.sl, tp: pi.tp }
  ];

  /* ---------- Belum valid ---------- */
  // Engulfing di tengah downtrend: low 2653.8 di atas LL 2653.5 (bukan sweep), tidak ada FVG/OB bullish di sana.
  var eBad = V.head([
    [2654, .4, .3], [2656.2, .3, .2], [2655.4, .5, .5], [2652.5, .4, .7], [2649.5, .4, .7], [2646.5, .4, .7], [2644, .4, .7]
  ]);
  var bE = r2(eBad[19].c), bS = r2(eBad[19].l - 0.4), bT = r2(bE + 2 * (bE - bS));

  // Inside bar: candle 20 wick ke 2659.5 (> high mother 2658) tapi body close 2657 (di dalam mother) = bukan breakout.
  var iBad = V.head([
    [2656.5, 1.5, 3], [2655.5, .7, .9], [2657, 2.5, .5], [2653.5, .4, .6], [2650.5, .4, .6], [2647, .4, .6], [2644, .4, .6]
  ]);
  var wE = r2(iBad[18].h), wS = r2(iBad[18].l - 0.5), wT = r2(wE + 2 * (wE - wS));

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.engulfing = [
    {
      id: 'engulf-bull', tab: 'Bullish', title: 'Bullish engulfing di FVG (valid) + entry LP', valid: true,
      hint: 'Cari dua candle: turun lalu naik yang menutupi seluruh body candle turun, di dalam FVG.',
      symbol: 'XAUUSD', tf: 'M15', candles: eb, meta: { pat: 23, kind: 'engulf-bull' },
      overlays: ovEb,
      note: 'Setelah CHoCH, harga turun ke FVG ' + f(eBot) + '–' + f(eTop) + '. Candle 23 naik dan body-nya (' + f(eb[23].o) + '–' + f(eb[23].c) + ') menutupi seluruh body candle 22 (' + f(eb[22].c) + '–' + f(eb[22].o) + '). Entry LP di 50% FVG ' + f(pe.entry) + ' (candle 24), SL ' + f(pe.sl) + ' di bawah zona, TP ' + f(pe.tp) + ' (RR 1:2).'
    },
    {
      id: 'engulf-bear', tab: 'Bearish', title: 'Bearish engulfing di FVG (valid) + entry SP', valid: true,
      hint: 'Cari dua candle: naik lalu turun yang menutupi seluruh body candle naik, di dalam FVG.',
      symbol: 'XAUUSD', tf: 'M15', candles: V.mirror(eb), meta: { pat: 23, kind: 'engulf-bear' },
      overlays: V.mirrorOv(ovEb),
      note: 'Setelah CHoCH turun, harga naik ke FVG ' + f(m(eTop)) + '–' + f(m(eBot)) + '. Candle 23 turun dan body-nya menutupi seluruh body candle 22. Entry SP di 50% FVG ' + f(m(pe.entry)) + ' (candle 24), SL ' + f(m(pe.sl)) + ' di atas zona, TP ' + f(m(pe.tp)) + ' (RR 1:2).'
    },
    {
      id: 'inside-bull', tab: 'Inside bar ↑', title: 'Inside bar breakout naik (valid) + entry LP di FVG', valid: true,
      hint: 'Cari satu candle besar (mother bar) dan candle kecil di dalamnya, lalu lihat arah body close keluarnya.',
      symbol: 'XAUUSD', tf: 'M15', candles: ib, meta: { pat: 19, mother: 18, kind: 'inside-bull' },
      overlays: ovIb,
      note: 'Candle 19 (inside bar) seluruhnya di dalam mother bar candle 18 (' + f(ib[18].l) + '–' + f(mHigh) + '). Candle 20 body close di ' + f(ib[20].c) + ', di atas high mother = breakout naik, sekaligus CHoCH. FVG ' + f(iBot) + '–' + f(iTop) + ': entry LP di 50% ' + f(pi.entry) + ' (candle 23), SL ' + f(pi.sl) + ', TP ' + f(pi.tp) + ' (RR 1:2).'
    },
    {
      id: 'inside-bear', tab: 'Inside bar ↓', title: 'Inside bar breakout turun (valid) + entry SP di FVG', valid: true,
      hint: 'Cari satu candle besar (mother bar) dan candle kecil di dalamnya, lalu lihat arah body close keluarnya.',
      symbol: 'XAUUSD', tf: 'M15', candles: V.mirror(ib), meta: { pat: 19, mother: 18, kind: 'inside-bear' },
      overlays: V.mirrorOv(ovIb),
      note: 'Candle 19 (inside bar) seluruhnya di dalam mother bar candle 18 (' + f(m(mHigh)) + '–' + f(m(ib[18].l)) + '). Candle 20 body close di ' + f(m(ib[20].c)) + ', di bawah low mother = breakout turun, sekaligus CHoCH. FVG ' + f(m(iTop)) + '–' + f(m(iBot)) + ': entry SP di 50% ' + f(m(pi.entry)) + ' (candle 23), SL ' + f(m(pi.sl)) + ', TP ' + f(m(pi.tp)) + ' (RR 1:2).'
    },
    {
      id: 'engulf-bad', tab: 'Belum valid', title: 'Engulfing di tengah tren tanpa zona (belum valid)', valid: false,
      hint: 'Tebak dulu: engulfing ini ada di FVG, OB, atau setelah sweep?',
      symbol: 'XAUUSD', tf: 'M15', candles: eBad, meta: { pat: 19, kind: 'engulf-bull' },
      overlays: [
        { type: 'mark', i: 19, y: eBad[19].l, label: 'Engulfing?', color: SW, pos: 'below' },
        { type: 'text', i: 19, y: eBad[19].h, dy: -5, text: 'Tanpa FVG, OB, sweep' },
        { type: 'arrow', i: 20, y: bE, label: 'Entry' },
        { type: 'position', side: 'long', i: 20, i2: 24, entry: bE, sl: bS, tp: bT }
      ],
      note: 'Bentuknya bullish engulfing, tetapi muncul di tengah downtrend: tidak di FVG atau OB, dan low-nya (' + f(eBad[19].l) + ') tidak menyapu LL ' + f(eBad[17].l) + '. LP di ' + f(bE) + ' kena SL ' + f(bS) + ' karena harga lanjut turun.'
    },
    {
      id: 'inside-bad', tab: 'Belum valid', title: 'Wick keluar mother bar, body close di dalam (bukan breakout)', valid: false,
      hint: 'Tebak dulu: apakah candle 20 sudah breakout dari mother bar? Lihat body-nya.',
      symbol: 'XAUUSD', tf: 'M15', candles: iBad, meta: { pat: 19, mother: 18, kind: 'inside-bull' },
      overlays: [
        { type: 'line', i1: 18, i2: 23, y: wE, label: 'High mother', color: SW, pos: 'below' },
        { type: 'text', i: 18, y: iBad[18].l, dy: 11, text: 'Mother' },
        { type: 'mark', i: 19, y: iBad[19].l, label: 'Inside bar', color: SW, pos: 'below' },
        { type: 'mark', i: 20, y: iBad[20].h, label: 'Wick saja', color: SW, pos: 'above' },
        { type: 'arrow', i: 20, y: wE, label: 'Entry' },
        { type: 'position', side: 'long', i: 20, i2: 24, entry: wE, sl: wS, tp: wT }
      ],
      note: 'Candle 20 wick ke ' + f(iBad[20].h) + ' (di atas high mother ' + f(wE) + '), tetapi body close ' + f(iBad[20].c) + ' masih di dalam mother bar. Arah breakout ditentukan body close, jadi ini belum breakout. LP di ' + f(wE) + ' kena SL ' + f(wS) + '.'
    }
  ];
})();
