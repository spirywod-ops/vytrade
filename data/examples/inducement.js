/* Contoh Inducement + Turtle soup. Data buatan sendiri.
   - Inducement: swing minor (pullback kecil) antara posisi harga dan zona OB/FVG yang disapu dulu sebelum harga bereaksi di zona.
   - Turtle soup (liquidity raid): wick menembus high/low penting (di sini high/low sesi Asia) lalu body close kembali ke dalam;
     entry berlawanan arah tembusan di FVG/OB berikutnya. Beda dari kartu Liquidity sweep: turtle soup menekankan level besar atau level sesi.
   Candle 0-9 = sesi Asia (range 2646-2652.5, low Asia 2646.0). Candle 9 = OB bullish (candle turun terakhir sebelum naik menembus struktur).
   - ind-bull : harga turun dari 2660, menyapu inducement (low minor candle 15) di 17, menyentuh OB di 19, turtle soup di 20 (wick di bawah low Asia, close di atasnya)
                -> entry LP di FVG hasil pembalikan (50%).
   - ind-bear : cermin (high Asia, OB bearish, inducement = high minor) -> entry SP.
   - ind-bad  : candle 20 menembus low Asia dengan body close di bawah dan candle 21 bertahan di bawah = BOS turun, bukan turtle soup -> LP di OB kena SL.
   Dicek oleh tests/validate.html (low Asia, OB, inducement minor + disapu sebelum zona, turtle soup, FVG, RR 1:2, hasil TP/SL).
   meta: {asia: [awal, akhir], level: low Asia, ob: indeks OB, idm: indeks swing minor, sweepIdm: candle yang menyapu inducement,
          tap: candle pertama menyentuh OB, ts: candle turtle soup (-1 = tidak ada), dir: 'bull'|'bear'}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }

  var asia = [
    [2650.5, .6, .6], [2652, .5, .5], [2650.8, .3, .6], [2648.6, .4, .6], [2647.2, .4, .5],
    [2648.8, .5, 1.2],     // 5 low Asia 2646.0
    [2650.2, .5, .5], [2648.8, .4, .5], [2647.6, .4, .6],
    [2647.0, .3, .5]       // 9 OB bullish: 2646.5-2647.9
  ];
  var rally = [
    [2650.5, .4, .2], [2654.5, .5, .3], [2657, .6, .4], [2659.5, .8, .5],     // 10-13 (11 body close di atas swing high Asia)
    [2657.5, .5, .5],      // 14
    [2655, .4, .6],        // 15 inducement: low minor 2654.4
    [2656.8, .5, .4],      // 16
    [2653.3, .4, .5],      // 17 menyapu inducement (low 2652.8 di bawah 2654.4)
    [2650.5, .4, .5],      // 18
    [2648.2, .4, .5]       // 19 menyentuh zona OB (low 2647.7)
  ];
  var bull = V.walk(2649, asia.concat(rally, [
    [2647.6, .3, 2.4],     // 20 turtle soup: wick ke 2645.2 (di bawah low Asia 2646), close 2647.6 di atasnya
    [2653.5, .4, .2],      // 21 candle 2 FVG
    [2655.5, .4, .3],      // 22 candle 3 FVG (low 2653.2)
    [2651.6, .4, 1.0],     // 23 retest, low 2650.6 menyentuh 50% FVG
    [2655, .5, .4], [2658.5, .6, .4], [2661, .6, .5], [2663, .6, .5]
  ]));
  var bear = V.mirror(bull);
  var level = bull[5].l;                                          // 2646
  var obTop = bull[9].h, obBot = bull[9].l;                        // 2647.9 dan 2646.5
  var fBot = bull[20].h, fTop = bull[22].l;                        // 2648.3 dan 2653.2
  var entry = r2((fTop + fBot) / 2), sl = r2(fBot - 0.7), tp = r2(entry + 2 * (entry - sl));

  // Belum valid: candle 20 body close 2645.3 DI BAWAH low Asia dan candle 21 bertahan di bawahnya (BOS). LP di 50% OB langsung kena SL.
  var bad = V.walk(2649, asia.concat(rally, [
    [2645.3, .3, .7],      // 20 body close di bawah low Asia
    [2644, .3, .6],        // 21 bertahan di bawah
    [2642, .3, .6], [2640, .3, .6], [2638, .3, .6]
  ]));
  var bEntry = r2((obTop + obBot) / 2), bSl = r2(obBot - 0.7), bTp = r2(bEntry + 2 * (bEntry - bSl));

  var ovBull = [
    { type: 'band', i1: 0, i2: 9, label: 'Asia', color: '#8a919c' },
    { type: 'zone', kind: 'OB', i1: 9, i2: 19, top: obTop, bottom: obBot, label: 'OB', labelI: 14, labelPos: 'above' },
    { type: 'line', i1: 5, i2: 21, y: level, label: 'Low Asia', color: SW, pos: 'below', labelAt: 'start' },
    { type: 'mark', i: 15, y: bull[15].l, label: 'Inducement', color: CH, pos: 'below' },
    { type: 'mark', i: 20, y: bull[20].l, label: 'Turtle soup', color: SW, pos: 'below' },
    { type: 'zone', kind: 'FVG', i1: 20, i2: 27, top: fTop, bottom: fBot, label: 'FVG', labelI: 26 },
    { type: 'arrow', i: 23, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 23, i2: 26, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.inducement = [
    {
      id: 'ind-bull', tab: 'Bullish', title: 'Inducement disapu, turtle soup di low Asia (valid) + entry LP', valid: true,
      hint: 'Cari pullback kecil (inducement) di atas OB, lalu tebak candle turtle soup di low Asia dan zona entry.',
      symbol: 'XAUUSD', tf: 'M15', from: 3, candles: bull,
      meta: { asia: [0, 9], level: level, ob: 9, idm: 15, sweepIdm: 17, tap: 19, ts: 20, dir: 'bull' },
      overlays: ovBull,
      note: 'Candle 15 = inducement (pullback kecil, low ' + f(bull[15].l) + ') di atas OB ' + f(obBot) + '–' + f(obTop) + '; candle 17 menyapunya lalu harga menyentuh OB. Candle 20 turtle soup: wick ' + f(bull[20].l) + ' menembus low Asia ' + f(level) + ', body close ' + f(bull[20].c) + ' kembali di atasnya. Entry LP di 50% FVG ' + f(fBot) + '–' + f(fTop) + ' = ' + f(entry) + ' (candle 23), SL ' + f(sl) + ', TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'ind-bear', tab: 'Bearish', title: 'Inducement disapu, turtle soup di high Asia (valid) + entry SP', valid: true,
      hint: 'Cari pullback kecil (inducement) di bawah OB, lalu tebak candle turtle soup di high Asia dan zona entry.',
      symbol: 'XAUUSD', tf: 'M15', from: 3, candles: bear,
      meta: { asia: [0, 9], level: m(level), ob: 9, idm: 15, sweepIdm: 17, tap: 19, ts: 20, dir: 'bear' },
      overlays: V.mirrorOv(ovBull, function (n, o) {
        if (o.type === 'line' && o.label === 'Low Asia') n.label = 'High Asia';
        if (o.type === 'mark' && o.label === 'Inducement') n.anchor = 'end';
        if (o.type === 'band') n.labelAt = 'bottom';
      }),
      note: 'Candle 15 = inducement (pullback kecil, high ' + f(m(bull[15].l)) + ') di bawah OB ' + f(m(obTop)) + '–' + f(m(obBot)) + '; candle 17 menyapunya lalu harga menyentuh OB. Candle 20 turtle soup: wick ' + f(m(bull[20].l)) + ' menembus high Asia ' + f(m(level)) + ', body close ' + f(m(bull[20].c)) + ' kembali di bawahnya. Entry SP di 50% FVG ' + f(m(fTop)) + '–' + f(m(fBot)) + ' = ' + f(m(entry)) + ' (candle 23), SL ' + f(m(sl)) + ', TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'ind-bad', tab: 'Belum valid', title: 'Body close bertahan di bawah low Asia, itu BOS', valid: false,
      hint: 'Tebak dulu: apakah candle 20 turtle soup? Lihat body close candle 20 dan 21 terhadap low Asia.',
      symbol: 'XAUUSD', tf: 'M15', from: 3, candles: bad,
      meta: { asia: [0, 9], level: level, ob: 9, idm: 15, sweepIdm: 17, tap: 19, ts: -1, dir: 'bull' },
      overlays: [
        { type: 'band', i1: 0, i2: 9, label: 'Asia', color: '#8a919c' },
        { type: 'zone', kind: 'OB', i1: 9, i2: 20, top: obTop, bottom: obBot, label: 'OB', labelI: 14, labelPos: 'above' },
        { type: 'line', i1: 5, i2: 22, y: level, label: 'Low Asia', color: SW, pos: 'above', labelAt: 'start' },
        { type: 'mark', i: 15, y: bad[15].l, label: 'Inducement', color: CH, pos: 'below' },
        { type: 'mark', i: 20, y: bad[20].l, label: 'Close di bawah', color: SW, pos: 'below' },
        { type: 'arrow', i: 20, y: bEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 20, i2: 23, entry: bEntry, sl: bSl, tp: bTp }
      ],
      note: 'Candle 20 body close ' + f(bad[20].c) + ' di bawah low Asia ' + f(level) + ' dan candle 21 bertahan di ' + f(bad[21].c) + '. Itu BOS turun, bukan turtle soup (tidak ada close kembali ke dalam). LP di 50% OB ' + f(bEntry) + ' kena SL ' + f(bSl) + '.'
    }
  ];
})();
