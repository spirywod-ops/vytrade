/* Contoh Entry (Tahap 7B): entry di zona FVG/OB TF kecil SETELAH konfirmasi (CHoCH/BOS dengan body close), di titik tengah (50%).
   - entry-bull  : CHoCH naik (body close tembus LH) meninggalkan FVG, harga retest ke zona -> entry LP di 50% FVG.
   - entry-bear  : cermin dari OB bullish (candle naik terakhir sebelum turun kuat) -> entry SP di 50% OB.
   - entry-early : entry di zona FVG padahal belum ada body close di atas LH (konfirmasi belum ada) -> harga lanjut turun, kena SL.
   Data buatan sendiri. Dicek oleh tests/validate.html (CHoCH, zona FVG/OB, entry setelah konfirmasi + retest, 50%, SL, RR 1:2, hasil). */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef';
  var LH = 2665.5; // swing high terakhir (candle 14) dari V.head
  function f(v) { return String(r2(v)); }
  function plan(top, bot) {
    var e = r2((top + bot) / 2), s = r2(bot - 0.7), t = r2(e + 2 * (e - s));
    return { entry: e, sl: s, tp: t };
  }

  // [close, wickAtas, wickBawah]. Candle 20 = candle 1 FVG, 21 = impuls (body close 2667.5 > LH = CHoCH), 22 = candle 3 FVG.
  // Candle 26 = retest ke 50% zona (entry), lalu naik ke TP.
  var bull = V.head([
    [2653.5, .4, .6], [2655, .4, .5], [2658, .5, .4], [2667.5, .4, .3], [2669, .4, 3.0],
    [2668, .5, .6], [2665.5, .4, .5], [2663, .4, .5], [2661.5, .4, .8], [2664, .5, .6],
    [2667, .5, .5], [2670, .6, .5], [2672, .6, .5]
  ]);
  var fTop = bull[22].l, fBot = bull[20].h;          // 2664.5 dan 2658.5
  var pf = plan(fTop, fBot);

  // OB bullish: candle 19 = candle turun terakhir sebelum naik kuat, candle 22 body close 2667 > LH = CHoCH. Dicerminkan jadi SP.
  var obBull = V.head([
    [2652, .5, .6], [2649.5, .5, 1.0], [2657, .5, .4], [2662, .5, .5], [2667, .5, .5],
    [2665, .5, .6], [2661, .4, .6], [2657, .4, .6], [2653, .4, .6], [2651.8, .4, 1.5],
    [2655, .5, .4], [2658.5, .5, .4], [2662, .5, .5]
  ]);
  var bear = V.mirror(obBull);
  var oTop = obBull[19].h, oBot = obBull[19].l;      // 2652.5 dan 2648.5
  var po = plan(oTop, oBot);

  // Entry terlalu cepat: FVG terbentuk (19-21), harga menyentuh 50% di candle 23, tetapi tidak pernah body close di atas LH.
  var early = V.head([
    [2652, .5, .5], [2653, .5, .6], [2659, .3, .3], [2660, .4, 1.2], [2658, .4, .5],
    [2656, .4, .6], [2655, .4, .6], [2653, .4, .7], [2650, .4, .6], [2647, .4, .6], [2644, .4, .6]
  ]);
  var eTop = early[21].l, eBot = early[19].h;        // 2657.8 dan 2653.5
  var pe = plan(eTop, eBot);

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.entry = [
    {
      id: 'entry-bull', tab: 'Bullish', title: 'Entry LP setelah CHoCH + retest FVG (valid)', valid: true,
      hint: 'Tebak dulu: candle mana yang jadi konfirmasi, dan di mana entry-nya?',
      symbol: 'XAUUSD', tf: 'M5', candles: bull, meta: { breakAt: 21 },
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 20, i2: 30, top: fTop, bottom: fBot, label: 'FVG' },
        { type: 'line', i1: 14, i2: 21, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'arrow', i: 26, y: pf.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 26, i2: 30, entry: pf.entry, sl: pf.sl, tp: pf.tp }
      ],
      note: 'Candle ke-21 body close di ' + f(bull[21].c) + ', menembus LH ' + f(LH) + ' (CHoCH) dan meninggalkan FVG ' + f(fBot) + '–' + f(fTop) + '. Entry LP baru dipasang setelah candle itu close dan harga kembali (retest) ke zona: ' + f(pf.entry) + ' (50%), SL ' + f(pf.sl) + ' di bawah zona, TP ' + f(pf.tp) + ' (RR 1:2).'
    },
    {
      id: 'entry-bear', tab: 'Bearish', title: 'Entry SP setelah CHoCH + retest OB (valid)', valid: true,
      hint: 'Tebak dulu: candle OB yang mana, dan kapan entry boleh dipasang?',
      symbol: 'XAUUSD', tf: 'M5', candles: bear, meta: { breakAt: 22 },
      overlays: [
        { type: 'zone', kind: 'OB', i1: 19, i2: 28, top: m(oBot), bottom: m(oTop), label: 'OB' },
        { type: 'line', i1: 14, i2: 22, y: m(LH), label: 'CHoCH', color: CH, pos: 'below' },
        { type: 'arrow', i: 27, y: m(po.entry), label: 'Entry' },
        { type: 'position', side: 'short', i: 27, i2: 30, entry: m(po.entry), sl: m(po.sl), tp: m(po.tp) }
      ],
      note: 'Candle ke-22 body close di ' + f(bear[22].c) + ', menembus HL ' + f(m(LH)) + ' (CHoCH); candle 19 adalah OB bearish ' + f(m(oBot)) + '–' + f(m(oTop)) + '. Entry SP dipasang saat harga retest ke OB: ' + f(m(po.entry)) + ' (50%), SL ' + f(m(po.sl)) + ' di atas zona, TP ' + f(m(po.tp)) + ' (RR 1:2).'
    },
    {
      id: 'entry-early', tab: 'Belum valid', title: 'Entry sebelum konfirmasi close (belum valid)', valid: false,
      hint: 'Tebak dulu: apa yang kurang sebelum entry ini boleh dipasang?',
      symbol: 'XAUUSD', tf: 'M5', candles: early, meta: { level: LH },
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 19, i2: 27, top: eTop, bottom: eBot, label: 'FVG' },
        { type: 'line', i1: 14, i2: 27, y: LH, label: 'LH', color: CH, pos: 'above' },
        { type: 'text', i: 19, y: 2667, dy: 0, text: 'Belum close di atas LH' },
        { type: 'arrow', i: 23, y: pe.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 23, i2: 27, entry: pe.entry, sl: pe.sl, tp: pe.tp }
      ],
      note: 'Harga menyentuh FVG ' + f(eBot) + '–' + f(eTop) + ' dan entry LP ' + f(pe.entry) + ' dipasang, padahal belum ada body close di atas LH ' + f(LH) + ' (tertinggi hanya ' + f(early[21].h) + '). Tanpa konfirmasi, harga lanjut turun dan kena SL ' + f(pe.sl) + '.'
    }
  ];
})();
