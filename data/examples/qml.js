/* Contoh QML (Quasimodo Level). Versi bearish: uptrend (HH, HL), harga membuat higher high (head), lalu CHoCH bearish (body close di bawah HL terakhir),
   lalu kembali ke level high "left shoulder" (high sebelum head) sebagai QML; entry SP bila ada FVG/OB di area itu. Bullish = kebalikannya.
   Penentuan level QML bervariasi antar trader; ini definisi VyTrade. Data buatan sendiri.
   Data dibuat sebagai versi bullish (downtrend: candle 11 = left shoulder, 14 = LH, 17 = head/lower low) lalu dicerminkan untuk versi bearish.
   - qml-bull : head (LL candle 17) -> CHoCH bullish (candle 18 body close di atas LH 14) -> kembali ke low left shoulder = QML -> OB di QML -> entry LP.
   - qml-bear : cermin (head = HH, CHoCH bearish, QML = high left shoulder) -> entry SP.
   - qml-bad  : head sudah terbentuk tetapi tidak ada CHoCH (candle 19 hanya wick di atas LH) -> level "QML" tidak sah -> LP kena SL.
   Dicek oleh tests/validate.html (head, CHoCH, level left shoulder, zona di QML, RR 1:2, hasil TP/SL).
   meta: {ls: indeks swing left shoulder, lh: indeks LH yang ditembus, head: indeks head, choch: indeks candle CHoCH (-1 = tidak ada), qml: harga level QML}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef';
  function f(v) { return String(r2(v)); }

  // V.head: LS = low swing candle 11 (2656), LH = high swing candle 14 (2665.5), head = low candle 17 (2653.5, lebih rendah dari LS).
  // 18 = body close 2667 di atas LH (CHoCH), OB = candle 17 (2653.5-2659). 23 = kembali ke QML 2656, low 2655.8 menyentuh 50% OB 2656.25.
  var bull = V.head([
    [2667, .4, .7],
    [2669, .6, .5], [2666, .5, .5], [2662.5, .4, .5], [2659.5, .4, .5],
    [2657.2, .4, 1.4],
    [2660.5, .5, .4], [2664, .5, .5], [2667.5, .5, .5], [2670, .5, .5]
  ]);
  var bear = V.mirror(bull);
  var qml = bull[11].l, lh = bull[14].h;                           // 2656 dan 2665.5
  var top = bull[17].h, bot = bull[17].l;                          // OB 2653.5-2659
  var entry = r2((top + bot) / 2), sl = r2(bot - 0.7), tp = r2(entry + 2 * (entry - sl));

  // Belum valid: tidak ada body close di atas LH. Candle 19 wick ke 2666.4 (di atas LH 2665.5), body close 2664.2 di bawahnya.
  var bad = V.head([
    [2661, .5, .7], [2664.2, 2.2, .5],
    [2661, .4, .5], [2658.3, .4, .5],
    [2656.6, .3, 1.0],     // 22 menyentuh 50% zona 2656.25
    [2653.5, .3, .8],      // 23 kena SL
    [2651, .4, .5], [2648.5, .4, .5], [2646, .4, .5]
  ]);

  var ovBull = [
    { type: 'zone', kind: 'OB', i1: 17, i2: 26, top: top, bottom: bot, label: 'OB', labelI: 20, labelPos: 'above' },
    { type: 'line', i1: 11, i2: 26, y: qml, label: 'QML', color: CH, pos: 'above', labelAt: 'start' },
    { type: 'line', i1: 14, i2: 18, y: lh, label: 'CHoCH', color: CH, pos: 'above', labelAt: 'start' },
    { type: 'text', i: 11, y: bull[11].l, dy: 11, text: 'LS' },
    { type: 'text', i: 17, y: bull[17].l, dy: 11, text: 'Head' },
    { type: 'arrow', i: 23, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 23, i2: 26, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.qml = [
    {
      id: 'qml-bull', tab: 'Bullish', title: 'QML bullish: head, CHoCH, kembali ke low left shoulder (valid) + entry LP', valid: true,
      hint: 'Cari lower low (head), tunggu CHoCH, lalu tebak level QML dan zona entry saat harga kembali.',
      symbol: 'XAUUSD', tf: 'M15', from: 8, candles: bull, meta: { ls: 11, lh: 14, head: 17, choch: 18, qml: qml },
      overlays: ovBull,
      note: 'Left shoulder = low candle 11 (' + f(qml) + '). Head = candle 17 membuat lower low ' + f(bull[17].l) + '. Candle 18 body close ' + f(bull[18].c) + ' di atas LH ' + f(lh) + ' (CHoCH bullish). Harga kembali ke QML ' + f(qml) + ', di dalam OB ' + f(bot) + '–' + f(top) + '. Entry LP di 50% ' + f(entry) + ' (candle 23), SL ' + f(sl) + ' di bawah zona, TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'qml-bear', tab: 'Bearish', title: 'QML bearish: head, CHoCH, kembali ke high left shoulder (valid) + entry SP', valid: true,
      hint: 'Cari higher high (head), tunggu CHoCH, lalu tebak level QML dan zona entry saat harga kembali.',
      symbol: 'XAUUSD', tf: 'M15', from: 8, candles: bear, meta: { ls: 11, lh: 14, head: 17, choch: 18, qml: m(qml) },
      overlays: V.mirrorOv(ovBull, function (n, o) {
        if (o.type === 'line' && o.label === 'CHoCH') n.pos = 'below';
        if (o.type === 'line' && o.label === 'QML') n.pos = 'below';
      }),
      note: 'Left shoulder = high candle 11 (' + f(m(qml)) + '). Head = candle 17 membuat higher high ' + f(m(bull[17].l)) + '. Candle 18 body close ' + f(m(bull[18].c)) + ' di bawah HL ' + f(m(lh)) + ' (CHoCH bearish). Harga kembali ke QML ' + f(m(qml)) + ', di dalam OB ' + f(m(top)) + '–' + f(m(bot)) + '. Entry SP di 50% ' + f(m(entry)) + ' (candle 23), SL ' + f(m(sl)) + ' di atas zona, TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'qml-bad', tab: 'Belum valid', title: 'Head tanpa CHoCH, level QML belum sah', valid: false,
      hint: 'Tebak dulu: apakah ada body close di atas LH setelah head? Kalau tidak, QML belum terbentuk.',
      symbol: 'XAUUSD', tf: 'M15', from: 8, candles: bad, meta: { ls: 11, lh: 14, head: 17, choch: -1, qml: qml },
      overlays: [
        { type: 'zone', kind: 'OB', i1: 17, i2: 25, top: top, bottom: bot, label: 'OB', labelI: 20, labelPos: 'above' },
        { type: 'line', i1: 11, i2: 25, y: qml, label: 'QML?', color: CH, pos: 'above', labelAt: 'start' },
        { type: 'line', i1: 14, i2: 20, y: lh, label: 'LH', color: CH, pos: 'above', labelAt: 'start' },
        { type: 'text', i: 11, y: bad[11].l, dy: 11, text: 'LS' },
        { type: 'text', i: 17, y: bad[17].l, dy: 11, text: 'Head' },
        { type: 'mark', i: 19, y: bad[19].h, label: 'Wick saja', color: '#f97316', pos: 'above' },
        { type: 'arrow', i: 22, y: entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 22, i2: 25, entry: entry, sl: sl, tp: tp }
      ],
      note: 'Setelah head (' + f(bad[17].l) + '), candle 19 hanya wick ke ' + f(bad[19].h) + ' (di atas LH ' + f(lh) + '), body close ' + f(bad[19].c) + ' masih di bawah. Tanpa CHoCH tren masih turun, jadi QML ' + f(qml) + ' belum sah. LP di ' + f(entry) + ' kena SL ' + f(sl) + '.'
    }
  ];
})();
