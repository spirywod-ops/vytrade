/* Contoh AMD (Accumulation, Manipulation, Distribution). Data buatan sendiri.
   Fase 1 (A) range sideways; fase 2 (M) sweep atau fakeout ke satu sisi range yang berlawanan dengan tujuan; fase 3 (D) expansion ke arah sebenarnya.
   Pada sesi: Asia sering range, London sering manipulasi, New York sering distribusi (kecenderungan, bukan aturan).
   - amd-bull : range candle 0-11, candle 12 menyapu low range (wick di bawah, close di dalam), candle 14 expansion naik menembus high range
                dan meninggalkan FVG -> entry LP di 50% FVG.
   - amd-bear : cermin (sweep high range, expansion turun) -> entry SP.
   - amd-bad  : tidak ada sweep sebelum expansion (candle 12-13 tetap di dalam range) -> bukan pola AMD; entry LP di FVG gagal dan kena SL.
   Dicek oleh tests/validate.html (range, sweep, expansion, FVG, RR 1:2, hasil TP/SL).
   meta: {from, to: indeks candle range, sweep: indeks candle manipulasi (-1 = tidak ada), exp: indeks candle expansion, dir: 'up'|'down' arah expansion}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var SW = '#f97316', OFFC = '#8a919c', OKC = '#1f9d55';
  function f(v) { return String(r2(v)); }

  // Candle 0-11: sideways 2646.4-2653.8 (tinggi 7.4), candle kecil, beberapa high dan low sejajar.
  var range = [
    [2651, .8, .6], [2653, .8, .6], [2652, .7, .6], [2649.5, .6, .6], [2647.5, .7, .5], [2649, .6, .8], [2651.5, .6, .6],
    [2653, .7, .6], [2651, .6, .6], [2648.5, .6, .6], [2647, .7, .6], [2649.5, .6, .6]
  ];
  // 12 = manipulasi (wick ke 2644.5 di bawah low range 2646.4, close 2648 di dalam), 13 = candle 1 FVG (high 2649.5),
  // 14 = expansion (body close 2657 > high range 2653.8), 15 = candle 3 FVG (low 2655.2), 18 = retest 50% FVG (low 2651.6).
  var bull = V.walk(2650, range.concat([
    [2648, .5, 3.5], [2649, .5, .4],
    [2657, .3, .4], [2659.2, .5, 1.8],
    [2657, .4, .5], [2654, .3, .6], [2652.4, .3, .8],
    [2655.5, .5, .4], [2659, .6, .4], [2662, .6, .5], [2664, .6, .5]
  ]));
  var bear = V.mirror(bull);
  var top = Math.max.apply(null, bull.slice(0, 12).map(function (c) { return c.h; }));     // 2653.8
  var bot = Math.min.apply(null, bull.slice(0, 12).map(function (c) { return c.l; }));     // 2646.4
  var fBot = bull[13].h, fTop = bull[15].l;                                                // 2649.5 dan 2655.2
  var entry = r2((fTop + fBot) / 2), sl = r2(fBot - 0.7), tp = r2(entry + 2 * (entry - sl));

  // Belum valid: tidak ada sweep. Candle 12-13 tetap di dalam range, lalu expansion naik tetapi harga gagal bertahan dan jatuh kembali.
  var bad = V.walk(2650, range.concat([
    [2650, .5, .5], [2651, .5, .5],
    [2658, .3, .4], [2658.8, .5, 2.0],
    [2655, .2, 1.5], [2652, .3, 1.5],
    [2649, .3, .5], [2646.5, .3, .5], [2644, .3, .5]
  ]));
  var bFBot = bad[13].h, bFTop = bad[15].l;                                                // 2651.5 dan 2656
  var bEntry = r2((bFTop + bFBot) / 2), bSl = r2(bFBot - 0.7), bTp = r2(bEntry + 2 * (bEntry - bSl));

  var ovBull = [
    { type: 'band', i1: 0, i2: 11, label: 'A', color: OFFC },
    { type: 'band', i1: 12, i2: 13, label: 'M', color: SW },
    { type: 'band', i1: 14, i2: 22, label: 'D', color: OKC },
    { type: 'zone', kind: 'OFF', i1: 0, i2: 11, top: top, bottom: bot, label: 'Range', labelI: 3, opacity: 0.1 },
    { type: 'mark', i: 12, y: bull[12].l, label: 'Sweep', color: SW, pos: 'below' },
    { type: 'zone', kind: 'FVG', i1: 13, i2: 22, top: fTop, bottom: fBot, label: 'FVG', labelI: 15 },
    { type: 'arrow', i: 18, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 18, i2: 22, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.amd = [
    {
      id: 'amd-bull', tab: 'Bullish', title: 'AMD bullish: range, sweep low, expansion naik (valid) + entry LP', valid: true,
      hint: 'Tebak dulu: di mana fase A, M, dan D? Cari sweep di salah satu sisi range sebelum expansion.',
      symbol: 'XAUUSD', tf: 'M15', from: 2, candles: bull, meta: { from: 0, to: 11, sweep: 12, exp: 14, dir: 'up' },
      overlays: ovBull,
      note: 'A: candle 0–11 sideways di ' + f(bot) + '–' + f(top) + '. M: candle 12 menyapu low range (wick ' + f(bull[12].l) + ', close ' + f(bull[12].c) + ' kembali di dalam). D: candle 14 expansion naik, body close ' + f(bull[14].c) + ' di atas range, meninggalkan FVG ' + f(fBot) + '–' + f(fTop) + '. Entry LP di 50% ' + f(entry) + ' (candle 18), SL ' + f(sl) + ' di bawah zona, TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'amd-bear', tab: 'Bearish', title: 'AMD bearish: range, sweep high, expansion turun (valid) + entry SP', valid: true,
      hint: 'Tebak dulu: di mana fase A, M, dan D? Cari sweep di salah satu sisi range sebelum expansion.',
      symbol: 'XAUUSD', tf: 'M15', from: 2, candles: bear, meta: { from: 0, to: 11, sweep: 12, exp: 14, dir: 'down' },
      overlays: V.mirrorOv(ovBull, function (n, o) { if (o.type === 'band') n.labelAt = 'bottom'; }),
      note: 'A: candle 0–11 sideways di ' + f(m(top)) + '–' + f(m(bot)) + '. M: candle 12 menyapu high range (wick ' + f(m(bull[12].l)) + ', close ' + f(m(bull[12].c)) + ' kembali di dalam). D: candle 14 expansion turun, body close ' + f(m(bull[14].c)) + ' di bawah range, meninggalkan FVG ' + f(m(fTop)) + '–' + f(m(fBot)) + '. Entry SP di 50% ' + f(m(entry)) + ' (candle 18), SL ' + f(m(sl)) + ' di atas zona, TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'amd-bad', tab: 'Belum valid', title: 'Expansion tanpa sweep, bukan AMD', valid: false,
      hint: 'Tebak dulu: apakah ada fase M (sweep) sebelum expansion? Lihat candle 12 dan 13.',
      symbol: 'XAUUSD', tf: 'M15', from: 2, candles: bad, meta: { from: 0, to: 11, sweep: -1, exp: 14, dir: 'up' },
      overlays: [
        { type: 'band', i1: 0, i2: 11, label: 'A', color: OFFC },
        { type: 'band', i1: 12, i2: 13, label: 'M?', color: OFFC },
        { type: 'band', i1: 14, i2: 20, label: 'D', color: OKC },
        { type: 'zone', kind: 'OFF', i1: 0, i2: 11, top: top, bottom: bot, label: 'Range', labelI: 3, opacity: 0.1 },
        { type: 'zone', kind: 'FVG', i1: 13, i2: 20, top: bFTop, bottom: bFBot, label: 'FVG', labelI: 15 },
        { type: 'arrow', i: 16, y: bEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 16, i2: 19, entry: bEntry, sl: bSl, tp: bTp }
      ],
      note: 'Candle 12–13 tetap di dalam range ' + f(bot) + '–' + f(top) + ' tanpa wick yang menyapu sisi mana pun, jadi tidak ada fase M. Expansion candle 14 tidak didahului pengambilan likuiditas, sehingga mudah gagal. LP di 50% FVG ' + f(bEntry) + ' kena SL ' + f(bSl) + '.'
    }
  ];
})();
