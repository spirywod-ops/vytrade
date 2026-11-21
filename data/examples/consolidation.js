/* Contoh Consolidation: harga sideways dalam range, candle kecil, likuiditas menumpuk di atas dan bawah range.
   Breakout valid = body close di luar range lalu bertahan. Fakeout = wick keluar range lalu close kembali ke dalam. Data buatan sendiri.
   - cons-bull : breakout naik (body close di atas range, candle berikutnya bertahan), meninggalkan FVG -> entry LP di 50% FVG.
   - cons-bear : cermin (breakout turun) -> entry SP.
   - cons-bad  : wick keluar di atas range tapi close kembali ke dalam (fakeout) -> LP kena SL.
   Dicek oleh tests/validate.html (deteksi konsolidasi, klasifikasi breakout vs fakeout, FVG, RR 1:2, hasil TP/SL).
   meta: {from, to: indeks candle awal dan akhir range, exit: indeks candle keluar range, kind: 'breakout'|'fakeout', dir}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var SW = '#f97316';
  function f(v) { return String(r2(v)); }

  // Candle 0-13: sideways di 2646.4-2653.8 (tinggi 7.4), candle kecil (range sekitar 3), beberapa high dan low sejajar.
  var range = [
    [2651, .8, .6], [2653, .8, .6], [2652, .7, .6], [2649.5, .6, .6], [2647.5, .7, .5], [2649, .6, .8], [2651.5, .6, .6],
    [2653, .7, .6], [2651, .6, .6], [2648.5, .6, .6], [2647, .7, .6], [2649.5, .6, .6], [2651.5, .6, .6], [2653, .6, .6]
  ];
  // 14 = breakout (body close 2659.5 > top), 15 = bertahan (close 2662) dan candle 3 FVG (low 2658). 17 = retest 50% FVG.
  var bull = V.walk(2650, range.concat([
    [2659.5, .4, .3], [2662, .5, 1.5], [2658, .4, .5], [2657, .4, 1.8],
    [2660.5, .5, .4], [2664, .6, .5], [2667, .6, .5]
  ]));
  var bear = V.mirror(bull);
  var top = Math.max.apply(null, bull.slice(0, 14).map(function (c) { return c.h; }));     // 2653.8
  var bot = Math.min.apply(null, bull.slice(0, 14).map(function (c) { return c.l; }));     // 2646.4
  var fTop = bull[15].l, fBot = bull[13].h;                                                // 2658 dan 2653.6
  var entry = r2((fTop + fBot) / 2), sl = r2(fBot - 0.7), tp = r2(entry + 2 * (entry - sl));

  // Fakeout: candle 14 wick ke 2656 (di atas range) tapi close 2652.5 (di dalam). Harga lalu keluar ke bawah.
  var bad = V.walk(2650, range.concat([
    [2652.5, 3, .8], [2649.8, .5, .6], [2646.5, .5, .5], [2644, .5, .5], [2642, .5, .5]
  ]));
  var wEntry = 2654, wSl = 2651.4, wTp = r2(wEntry + 2 * (wEntry - wSl));

  var ovBull = [
    { type: 'zone', kind: 'OFF', i1: 0, i2: 13, top: top, bottom: bot, label: 'Range', opacity: 0.12 },
    { type: 'zone', kind: 'FVG', i1: 13, i2: 19, top: fTop, bottom: fBot, label: 'FVG', labelPos: 'above' },
    { type: 'line', i1: 13, i2: 15, y: top, label: 'Breakout', color: SW, pos: 'below', labelAt: 'start' },
    { type: 'arrow', i: 17, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 17, i2: 20, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.consolidation = [
    {
      id: 'cons-bull', tab: 'Breakout ↑', title: 'Breakout naik dari range (valid) + entry LP di FVG', valid: true,
      hint: 'Cari range sideways dengan candle kecil, lalu lihat body close yang keluar dan bertahan.',
      symbol: 'XAUUSD', tf: 'M15', candles: bull,
      meta: { from: 0, to: 13, exit: 14, kind: 'breakout', dir: 'up' },
      overlays: ovBull,
      note: 'Candle 0–13 sideways di ' + f(bot) + '–' + f(top) + ' dengan candle kecil. Candle 14 body close di ' + f(bull[14].c) + ' (di atas range) dan candle 15 bertahan (close ' + f(bull[15].c) + ') = breakout valid, meninggalkan FVG ' + f(fBot) + '–' + f(fTop) + '. Entry LP di 50% ' + f(entry) + ' (candle 17), SL ' + f(sl) + ' di bawah zona, TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'cons-bear', tab: 'Breakout ↓', title: 'Breakout turun dari range (valid) + entry SP di FVG', valid: true,
      hint: 'Cari range sideways dengan candle kecil, lalu lihat body close yang keluar dan bertahan.',
      symbol: 'XAUUSD', tf: 'M15', candles: bear,
      meta: { from: 0, to: 13, exit: 14, kind: 'breakout', dir: 'down' },
      overlays: V.mirrorOv(ovBull),
      note: 'Candle 0–13 sideways di ' + f(m(top)) + '–' + f(m(bot)) + '. Candle 14 body close di ' + f(m(bull[14].c)) + ' (di bawah range) dan candle 15 bertahan (close ' + f(m(bull[15].c)) + ') = breakout valid, meninggalkan FVG ' + f(m(fTop)) + '–' + f(m(fBot)) + '. Entry SP di 50% ' + f(m(entry)) + ' (candle 17), SL ' + f(m(sl)) + ' di atas zona, TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'cons-bad', tab: 'Fakeout', title: 'Wick keluar range, close kembali ke dalam (fakeout)', valid: false,
      hint: 'Tebak dulu: apakah candle 14 breakout? Lihat di mana body-nya close.',
      symbol: 'XAUUSD', tf: 'M15', candles: bad,
      meta: { from: 0, to: 13, exit: 14, kind: 'fakeout', dir: 'up' },
      overlays: [
        { type: 'zone', kind: 'OFF', i1: 0, i2: 13, top: top, bottom: bot, label: 'Range', opacity: 0.12 },
        { type: 'line', i1: 13, i2: 16, y: top, label: 'Atas range', color: SW, pos: 'above', labelAt: 'start' },
        { type: 'mark', i: 14, y: bad[14].h, label: 'Fakeout', color: SW, pos: 'above' },
        { type: 'arrow', i: 14, y: wEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 14, i2: 18, entry: wEntry, sl: wSl, tp: wTp }
      ],
      note: 'Candle 14 wick ke ' + f(bad[14].h) + ' (di atas range ' + f(top) + ') tetapi close ' + f(bad[14].c) + ' kembali ke dalam. Itu fakeout (sama dengan sweep), bukan breakout. LP di ' + f(wEntry) + ' kena SL ' + f(wSl) + ' lalu harga keluar ke bawah.'
    }
  ];
})();
