/* Contoh Hammer & shooting star: pola candle hanya bermakna di konteks (area FVG/OB atau setelah sweep). Data buatan sendiri.
   - hammer-bull : hammer di OB bullish, wick-nya menyapu low OB (sweep) lalu close kembali ke atas -> entry LP di 50% OB.
   - hammer-bear : cermin (shooting star di OB bearish setelah sweep high) -> entry SP.
   - hammer-bad  : hammer muncul di tengah downtrend, tanpa zona dan tanpa sweep -> LP kena SL.
   Dicek oleh tests/validate.html (detektor hammer/shooting star, konteks OB + sweep, RR 1:2, hasil TP/SL).
   meta: {pat: indeks candle pola, kind: 'hammer'|'shooting'}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }

  // Lanjutan V.head. Candle 18 = OB (turun terakhir sebelum naik), 20 = body close > LH 2665.5 (CHoCH),
  // 21-24 pullback, 25 = hammer (wick turun ke bawah low OB, close kembali di atas), 26 = retest 50% OB (entry).
  var bull = V.head([
    [2652.5, .5, .8], [2659, .6, .4], [2666.5, .6, .5], [2668, .8, .5],
    [2664, .4, .6], [2660, .4, .6], [2656, .4, .8],
    [2657, .2, 5.5],       // 25 hammer: body 1.0, lower wick 5.5, upper wick 0.2
    [2658, .4, 3.5],       // 26 retest, low 2653.5 menyentuh 50% OB
    [2661, .6, .5], [2665, .6, .5], [2668, .6, .5]
  ]);
  var bear = V.mirror(bull);

  var LH = 2665.5;
  var obTop = bull[18].h, obBot = bull[18].l;                       // 2655.5 dan 2651.7
  var entry = r2((obTop + obBot) / 2);                               // 2653.6
  var sl = r2(bull[25].l - 0.5), tp = r2(entry + 2 * (entry - sl));  // SL di bawah low sweep
  var ham = bull[25];

  // Belum valid: hammer di tengah downtrend. Low-nya (2654.3) masih di atas LL 2653.5, tidak ada FVG/OB di bawahnya.
  var bad = V.head([
    [2658, .5, .6], [2660, .5, .5], [2658.5, .2, .6], [2656.5, .4, .5],
    [2656.9, .08, 2.2],    // 22 "hammer" di tengah tren, tanpa zona dan tanpa sweep
    [2652.5, .4, .8], [2649, .4, .8], [2646, .4, .8], [2643, .4, .8]
  ]);
  var bHam = bad[22];
  var bEntry = r2(bHam.c), bSl = r2(bHam.l - 0.4), bTp = r2(bEntry + 2 * (bEntry - bSl));

  var ovBull = [
    { type: 'zone', kind: 'OB', i1: 18, i2: 28, top: obTop, bottom: obBot, label: 'OB' },
    { type: 'line', i1: 14, i2: 20, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
    { type: 'mark', i: 25, y: ham.l, label: 'Hammer', color: SW, pos: 'below' },
    { type: 'text', i: 25, y: ham.h, dy: -5, text: 'Sweep low OB' },
    { type: 'arrow', i: 26, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 26, i2: 29, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.hammer = [
    {
      id: 'hammer-bull', tab: 'Bullish', title: 'Hammer di OB bullish setelah sweep low (valid) + entry LP', valid: true,
      hint: 'Cari candle dengan wick bawah panjang di area OB, lalu tebak entry-nya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bull, meta: { pat: 25, kind: 'hammer' },
      overlays: ovBull,
      note: 'Candle 25 hammer: body ' + f(Math.abs(ham.c - ham.o)) + ', wick bawah ' + f(Math.min(ham.o, ham.c) - ham.l) + '. Wick-nya menyapu low OB ' + f(obBot) + ' lalu close ' + f(ham.c) + ' (kembali di atas). Entry LP di 50% OB ' + f(entry) + ' (candle 26), SL ' + f(sl) + ' di bawah low sweep, TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'hammer-bear', tab: 'Bearish', title: 'Shooting star di OB bearish setelah sweep high (valid) + entry SP', valid: true,
      hint: 'Cari candle dengan wick atas panjang di area OB, lalu tebak entry-nya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bear, meta: { pat: 25, kind: 'shooting' },
      overlays: V.mirrorOv(ovBull, function (n, o) {
        if (o.type === 'mark') n.label = 'Shooting star';
        if (o.type === 'text') { n.text = 'Sweep high OB'; n.dy = 11; }
      }),
      note: 'Candle 25 shooting star: body ' + f(Math.abs(ham.c - ham.o)) + ', wick atas ' + f(Math.min(ham.o, ham.c) - ham.l) + '. Wick-nya menyapu high OB ' + f(m(obBot)) + ' lalu close ' + f(m(ham.c)) + ' (kembali di bawah). Entry SP di 50% OB ' + f(m(entry)) + ' (candle 26), SL ' + f(m(sl)) + ' di atas high sweep, TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'hammer-bad', tab: 'Belum valid', title: 'Hammer di tengah tren tanpa zona (belum valid)', valid: false,
      hint: 'Tebak dulu: apakah hammer ini punya konteks? Cari FVG, OB, atau sweep di dekatnya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bad, meta: { pat: 22, kind: 'hammer' },
      overlays: [
        { type: 'mark', i: 22, y: bHam.l, label: 'Hammer?', color: SW, pos: 'below' },
        { type: 'text', i: 22, y: bHam.h, dy: -5, text: 'Tanpa FVG, OB, sweep' },
        { type: 'arrow', i: 23, y: bEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 23, i2: 26, entry: bEntry, sl: bSl, tp: bTp }
      ],
      note: 'Bentuknya hammer (wick bawah ' + f(Math.min(bHam.o, bHam.c) - bHam.l) + ', body ' + f(Math.abs(bHam.c - bHam.o)) + '), tapi ada di tengah downtrend: tidak di FVG atau OB, dan wick-nya tidak menyapu low sebelumnya (' + f(bad[17].l) + '). LP di ' + f(bEntry) + ' kena SL ' + f(bSl) + ' karena harga lanjut turun.'
    }
  ];
})();
