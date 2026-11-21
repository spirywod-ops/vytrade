/* Contoh Breaker block (definisi VyTrade): OB yang ditembus body close berlawanan, lalu zonanya berbalik peran (analog IFVG),
   biasanya setelah sweep dan CHoCH. Definisi breaker bervariasi antar trader. Data buatan sendiri.
   - bb-bull : OB bearish (candle 19) ditembus body close ke atas setelah sweep low + CHoCH -> zona jadi support -> entry LP di 50%.
   - bb-bear : cermin (OB bullish ditembus ke bawah) -> zona jadi resisten -> entry SP.
   - bb-bad  : OB bearish hanya ditembus wick, body close tetap di bawah high OB -> OB masih hidup, bukan breaker -> LP kena SL.
   Dicek oleh tests/validate.html (deteksi OB, body close menembus sisi jauh, sweep, CHoCH, retest 50%, RR 1:2, hasil TP/SL).
   meta: {ob: indeks candle OB, breakAt: indeks candle body close penembus, sweep: indeks candle sweep}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }

  // 19 = OB bearish (candle naik terakhir sebelum turun), 20 = BOS turun, 21 = low 2645.5, 24 = sweep (wick di bawah 2645.5, close di atasnya),
  // 25 = body close 2663.5 di atas high OB 2661.6 (breaker + CHoCH), 29 = retest 50% zona dari atas (entry).
  var base = [
    [2656, .4, .4], [2661, .6, .4], [2650, .3, .4], [2646, .3, .5],
    [2648.5, .4, .2], [2650, .4, .3], [2647.5, .3, 2.2]
  ];
  var bull = V.head(base.concat([
    [2663.5, .4, .3], [2665, .5, .5], [2662, .4, .5], [2659.5, .4, .6],
    [2658.8, .2, 1.2],     // 29 retest, low 2657.6 menyentuh 50% zona
    [2662, .5, .5], [2666.5, .6, .5]
  ]));
  var bear = V.mirror(bull);
  var top = bull[19].h, bot = bull[19].l;                            // 2661.6 dan 2655.6
  var entry = r2((top + bot) / 2), sl = r2(bot - 0.7), tp = r2(entry + 2 * (entry - sl));

  // Belum valid: candle 25 wick ke 2663 (di atas high OB) tapi body close 2660 masih di bawah = OB belum ditembus.
  var bad = V.head(base.concat([
    [2660, 3, .3], [2656, .4, .6], [2652, .4, .5], [2649, .4, .5], [2646, .4, .5]
  ]));

  var ovBull = [
    { type: 'zone', kind: 'BB', i1: 19, i2: 31, top: top, bottom: bot, label: 'Breaker' },
    { type: 'text', i: 19, y: bull[19].h, dy: -4, text: 'OB bearish' },
    { type: 'mark', i: 24, y: bull[24].l, label: 'Sweep', color: SW, pos: 'below' },
    { type: 'line', i1: 19, i2: 25, y: top, label: 'CHoCH', color: CH, pos: 'above', labelAt: 'start' },
    { type: 'arrow', i: 29, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 29, i2: 31, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.breaker = [
    {
      id: 'bb-bull', tab: 'Bullish', title: 'Breaker bullish: OB bearish ditembus ke atas (valid) + entry LP', valid: true,
      hint: 'Cari OB bearish yang akhirnya ditembus body close ke atas, lalu tebak entry saat harga kembali ke zona.',
      symbol: 'XAUUSD', tf: 'M15', candles: bull, meta: { ob: 19, breakAt: 25, sweep: 24 },
      overlays: ovBull,
      note: 'Candle 19 = OB bearish ' + f(bot) + '–' + f(top) + '. Candle 24 menyapu low ' + f(bull[21].l) + ' lalu close di atasnya (sweep). Candle 25 body close di ' + f(bull[25].c) + ', di atas high OB (CHoCH): zona berbalik jadi support = breaker. Harga kembali ke zona, entry LP di 50% ' + f(entry) + ' (candle 29), SL ' + f(sl) + ' di bawah zona, TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'bb-bear', tab: 'Bearish', title: 'Breaker bearish: OB bullish ditembus ke bawah (valid) + entry SP', valid: true,
      hint: 'Cari OB bullish yang akhirnya ditembus body close ke bawah, lalu tebak entry saat harga kembali ke zona.',
      symbol: 'XAUUSD', tf: 'M15', candles: bear, meta: { ob: 19, breakAt: 25, sweep: 24 },
      overlays: V.mirrorOv(ovBull, function (n, o) { if (o.type === 'text') { n.text = 'OB bullish'; n.dy = 11; } }),
      note: 'Candle 19 = OB bullish ' + f(m(top)) + '–' + f(m(bot)) + '. Candle 24 menyapu high ' + f(m(bull[21].l)) + ' lalu close di bawahnya (sweep). Candle 25 body close di ' + f(m(bull[25].c)) + ', di bawah low OB (CHoCH): zona berbalik jadi resisten = breaker. Entry SP di 50% ' + f(m(entry)) + ' (candle 29), SL ' + f(m(sl)) + ' di atas zona, TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'bb-bad', tab: 'Belum valid', title: 'OB hanya ditembus wick, belum breaker', valid: false,
      hint: 'Tebak dulu: apakah OB bearish ini sudah ditembus? Lihat body close candle 25.',
      symbol: 'XAUUSD', tf: 'M15', candles: bad, meta: { ob: 19, breakAt: -1, sweep: 24 },
      overlays: [
        { type: 'zone', kind: 'OB', i1: 19, i2: 28, top: top, bottom: bot, label: 'OB' },
        { type: 'line', i1: 19, i2: 25, y: top, label: 'High OB', color: CH, pos: 'above', labelAt: 'start' },
        { type: 'mark', i: 25, y: bad[25].h, label: 'Wick saja', color: SW, pos: 'above' },
        { type: 'arrow', i: 26, y: entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 26, i2: 29, entry: entry, sl: sl, tp: tp }
      ],
      note: 'Candle 25 wick ke ' + f(bad[25].h) + ' (di atas high OB ' + f(top) + '), tetapi body close ' + f(bad[25].c) + ' masih di bawah. OB bearish belum ditembus, jadi masih resisten dan belum jadi breaker. LP di ' + f(entry) + ' kena SL ' + f(sl) + ' saat harga ditolak turun.'
    }
  ];
})();
