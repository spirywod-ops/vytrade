/* Contoh Candle expansion (displacement): candle berbody besar, range minimal 1,5x rata-rata 10 candle sebelumnya,
   close dekat ekstrem, meninggalkan FVG dan menembus struktur. Data buatan sendiri.
   - exp-bull : dua candle ekspansi naik, body close tembus LH (CHoCH), FVG tertinggal -> entry LP di 50% FVG.
   - exp-bear : cermin -> entry SP.
   - exp-bad  : candle besar tapi body kecil, close jauh dari ekstrem (wick panjang), tanpa FVG dan tanpa tembus struktur -> LP kena SL.
   Dicek oleh tests/validate.html (detektor ekspansi: rasio range, body, close dekat ekstrem, FVG, tembus struktur; RR 1:2; hasil).
   meta: {exp: [indeks candle ekspansi], fvgAt: indeks candle 1 FVG}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }
  var LH = 2665.5; // swing high terakhir dari V.head

  // 19 dan 20 = ekspansi (range 7,5 dan 7,6 vs rata-rata sekitar 4). Candle 20 body close > LH = CHoCH.
  // FVG: candle 18 (high 2656.9) sampai candle 20 (low 2663.2). Candle 24 = retest 50% FVG.
  var bull = V.head([
    [2656.5, .4, .5], [2663.5, .3, .2], [2670.5, .3, .3], [2672, .6, 2],
    [2669, .4, .5], [2664, .4, .6], [2661, .4, 1.2],
    [2665, .5, .5], [2669, .5, .5], [2672, .6, .5]
  ]);
  var bear = V.mirror(bull);
  var fTop = bull[20].l, fBot = bull[18].h;                          // 2663.2 dan 2656.9
  var entry = r2((fTop + fBot) / 2), sl = r2(fBot - 0.7), tp = r2(entry + 2 * (entry - sl));

  // Belum valid: candle 19 range 8,8 tapi body 1,5 dan close 2657.5 jauh dari high 2664.5 (wick atas panjang).
  var bad = V.head([
    [2656, .5, .5], [2657.5, 7, .3], [2656, .5, .6], [2654.5, .4, .6],
    [2652, .4, .6], [2649, .4, .6], [2646, .4, .6]
  ]);
  var spike = bad[19];
  var bEntry = r2(spike.c), bSl = r2(spike.l - 0.5), bTp = r2(bEntry + 2 * (bEntry - bSl));

  var ovBull = [
    { type: 'zone', kind: 'FVG', i1: 18, i2: 26, top: fTop, bottom: fBot, label: 'FVG' },
    { type: 'line', i1: 14, i2: 20, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
    { type: 'text', i: 19.5, y: bull[20].h, dy: -5, text: 'Ekspansi' },
    { type: 'arrow', i: 24, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 24, i2: 27, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.expansion = [
    {
      id: 'exp-bull', tab: 'Bullish', title: 'Ekspansi naik + FVG (valid) + entry LP', valid: true,
      hint: 'Cari candle berbody besar yang jauh lebih panjang dari candle di sekitarnya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bull, meta: { exp: [19, 20], fvgAt: 18 },
      overlays: ovBull,
      note: 'Candle 19 dan 20 berbody besar dengan range ' + f(bull[19].h - bull[19].l) + ' dan ' + f(bull[20].h - bull[20].l) + ', jauh di atas rata-rata candle sebelumnya (sekitar 4). Close dekat high, body close tembus LH ' + f(LH) + ' (CHoCH), dan tertinggal FVG ' + f(fBot) + '–' + f(fTop) + '. Entry LP di 50% FVG ' + f(entry) + ' (candle 24), SL ' + f(sl) + ', TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'exp-bear', tab: 'Bearish', title: 'Ekspansi turun + FVG (valid) + entry SP', valid: true,
      hint: 'Cari candle berbody besar yang jauh lebih panjang dari candle di sekitarnya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bear, meta: { exp: [19, 20], fvgAt: 18 },
      overlays: V.mirrorOv(ovBull),
      note: 'Candle 19 dan 20 berbody besar ke bawah, close dekat low, body close tembus HL ' + f(m(LH)) + ' (CHoCH), dan tertinggal FVG ' + f(m(fTop)) + '–' + f(m(fBot)) + '. Entry SP di 50% FVG ' + f(m(entry)) + ' (candle 24), SL ' + f(m(sl)) + ', TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'exp-bad', tab: 'Belum valid', title: 'Candle besar tapi bukan ekspansi (belum valid)', valid: false,
      hint: 'Tebak dulu: apakah candle besar ini ekspansi? Lihat body, posisi close, dan apa yang tertinggal.',
      symbol: 'XAUUSD', tf: 'M15', candles: bad, meta: { exp: [], spike: 19 },
      overlays: [
        { type: 'mark', i: 19, y: spike.h, label: 'Bukan ekspansi', color: SW, pos: 'above', anchor: 'end' },
        { type: 'text', i: 19, y: spike.l, dy: 11, text: 'Body kecil, wick panjang' },
        { type: 'arrow', i: 20, y: bEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 20, i2: 24, entry: bEntry, sl: bSl, tp: bTp }
      ],
      note: 'Candle 19 memang besar (range ' + f(spike.h - spike.l) + '), tetapi body hanya ' + f(Math.abs(spike.c - spike.o)) + ' dan close ' + f(spike.c) + ' jauh dari high ' + f(spike.h) + '. Itu penolakan harga (wick), bukan dorongan: tidak ada FVG dan tidak ada tembus struktur. LP di ' + f(bEntry) + ' kena SL ' + f(bSl) + '.'
    }
  ];
})();
