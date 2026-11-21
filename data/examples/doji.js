/* Contoh Doji & marubozu. Doji = ragu (body sangat kecil), marubozu = dorongan kuat (body penuh, hampir tanpa wick).
   Data buatan sendiri.
   - doji-bull : doji menyapu low (sweep), lalu marubozu naik menembus LH (CHoCH) dan meninggalkan FVG -> entry LP di 50% FVG.
   - doji-bear : cermin -> entry SP.
   - doji-bad  : doji di tengah downtrend tanpa zona/sweep, lalu marubozu TURUN -> LP kena SL.
   Dicek oleh tests/validate.html (detektor doji/marubozu, konteks sweep + FVG, CHoCH, RR 1:2, hasil TP/SL).
   meta: {doji: indeks doji, maru: indeks marubozu, maruDir: 'up'|'down'}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }

  // Pantulan kecil (18-21) lalu candle 22 = doji. Swing high 19 (2660.5) = LH terbaru. Candle 23 = marubozu naik.
  var bounce = [[2658, .5, .6], [2660, .5, .5], [2658.5, .2, .6], [2656.5, .4, .5]];
  var bull = V.head(bounce.concat([
    [2656.7, .7, 3.2],     // 22 doji: body 0.2, wick bawah menyapu LL 2653.5 (low 2653.3), close 2656.7
    [2668, .1, .1],        // 23 marubozu: body 11.3, wick masing-masing 0.1; body close > LH 2660.5 = CHoCH
    [2669.5, .5, 4.5],     // 24 candle 3 FVG (low 2663.5)
    [2666, .5, .5],
    [2663, .4, 2.7],       // 26 retest, low 2660.3 menyentuh 50% FVG
    [2667, .5, .5], [2670, .6, .5], [2672, .6, .5]
  ]));
  var bear = V.mirror(bull);

  var fTop = bull[24].l, fBot = bull[22].h;                          // 2663.5 dan 2657.4
  var entry = r2((fTop + fBot) / 2), sl = r2(fBot - 0.7), tp = r2(entry + 2 * (entry - sl));
  var lvl = bull[19].h;                                              // 2660.5
  var dj = bull[22], mr = bull[23];

  // Belum valid: doji di tengah downtrend (low 2654.5 di atas LL 2653.5), lalu marubozu turun melanjutkan tren.
  var bad = V.head(bounce.concat([
    [2656.7, .7, 2.0],     // 22 doji tanpa sweep dan tanpa zona
    [2650, .1, .1],        // 23 marubozu TURUN
    [2648, .4, .5], [2645, .4, .5]
  ]));
  var bd = bad[22];
  var bEntry = r2(bd.c), bSl = r2(bd.l - 0.4), bTp = r2(bEntry + 2 * (bEntry - bSl));

  var ovBull = [
    { type: 'zone', kind: 'FVG', i1: 22, i2: 28, top: fTop, bottom: fBot, label: 'FVG' },
    { type: 'line', i1: 19, i2: 23, y: lvl, label: 'CHoCH', color: CH, pos: 'below', labelAt: 'start' },
    { type: 'mark', i: 22, y: dj.l, label: 'Doji', color: SW, pos: 'below' },
    { type: 'text', i: 23, y: mr.h, dy: -4, text: 'Marubozu' },
    { type: 'arrow', i: 26, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 26, i2: 29, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.doji = [
    {
      id: 'doji-bull', tab: 'Bullish', title: 'Doji sweep + marubozu naik (valid) + entry LP di FVG', valid: true,
      hint: 'Cari candle kecil tanpa arah (doji), lalu candle besar tanpa wick yang menyusul.',
      symbol: 'XAUUSD', tf: 'M15', candles: bull, meta: { doji: 22, maru: 23, maruDir: 'up' },
      overlays: ovBull,
      note: 'Candle 22 doji (body ' + f(Math.abs(dj.c - dj.o)) + ' dari range ' + f(dj.h - dj.l) + '), wick-nya menyapu LL ' + f(bull[17].l) + ' lalu close kembali di atas. Candle 23 marubozu naik (body ' + f(mr.c - mr.o) + ', hampir tanpa wick), body close di atas LH ' + f(lvl) + ' = CHoCH dan meninggalkan FVG ' + f(fBot) + '–' + f(fTop) + '. Entry LP di 50% ' + f(entry) + ' (candle 26), SL ' + f(sl) + ', TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'doji-bear', tab: 'Bearish', title: 'Doji sweep + marubozu turun (valid) + entry SP di FVG', valid: true,
      hint: 'Cari candle kecil tanpa arah (doji), lalu candle besar tanpa wick yang menyusul.',
      symbol: 'XAUUSD', tf: 'M15', candles: bear, meta: { doji: 22, maru: 23, maruDir: 'down' },
      overlays: V.mirrorOv(ovBull, function (n, o) { if (o.type === 'line') n.labelAt = 'start'; }),
      note: 'Candle 22 doji, wick-nya menyapu HH ' + f(m(bull[17].l)) + ' lalu close kembali di bawah. Candle 23 marubozu turun, body close di bawah HL ' + f(m(lvl)) + ' = CHoCH dan meninggalkan FVG ' + f(m(fTop)) + '–' + f(m(fBot)) + '. Entry SP di 50% ' + f(m(entry)) + ' (candle 26), SL ' + f(m(sl)) + ', TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'doji-bad', tab: 'Belum valid', title: 'Doji di tengah tren tanpa zona (belum valid)', valid: false,
      hint: 'Tebak dulu: apakah doji ini bisa jadi dasar entry? Lihat konteks dan candle sesudahnya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bad, meta: { doji: 22, maru: 23, maruDir: 'down' },
      overlays: [
        { type: 'mark', i: 22, y: bd.l, label: 'Doji?', color: SW, pos: 'below' },
        { type: 'text', i: 23, y: bad[23].l, dy: 11, text: 'Marubozu turun' },
        { type: 'text', i: 22, y: bd.h, dy: -5, text: 'Tanpa FVG, OB, sweep' },
        { type: 'arrow', i: 23, y: bEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 23, i2: 25, entry: bEntry, sl: bSl, tp: bTp }
      ],
      note: 'Doji hanya tanda ragu, bukan sinyal arah. Candle 22 muncul di tengah downtrend: tidak di FVG atau OB, low-nya (' + f(bd.l) + ') tidak menyapu LL ' + f(bad[17].l) + '. Candle berikutnya marubozu turun, jadi LP di ' + f(bEntry) + ' kena SL ' + f(bSl) + '.'
    }
  ];
})();
