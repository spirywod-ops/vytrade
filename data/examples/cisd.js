/* Contoh CISD (Change in State of Delivery): setelah rangkaian candle searah (delivery) yang membentuk sebuah swing, harga body close
   melewati OPEN candle pertama rangkaian itu ke arah berlawanan. Definisi CISD bervariasi antar trader; ini definisi VyTrade. Data buatan sendiri.
   - cisd-bull : 3 candle turun (20-22) berakhir di sweep low, lalu body close di atas open candle 20 (open acuan) = bullish CISD -> entry LP di FVG hasil gerakan itu.
   - cisd-bear : cermin (3 candle naik, sweep high, body close di bawah open acuan) -> entry SP.
   - cisd-bad  : candle 23 hanya wick di atas open acuan, body close tetap di bawahnya -> CISD belum terjadi -> LP kena SL.
   Dicek oleh tests/validate.html (rangkaian searah, swing, body close melewati open acuan, sweep, FVG, RR 1:2, hasil TP/SL).
   meta: {first, last: indeks candle pertama dan terakhir rangkaian, trigger: indeks candle body close penembus open acuan (-1 = belum terjadi), ref: open acuan}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }

  // Lanjutan V.head (downtrend, low terakhir 2653.5 di candle 17). 18-19 = pantulan kecil (19 close 2659 = open candle 20),
  // 20-22 = rangkaian turun (delivery), 22 menyapu low 2653.5 (wick 2651.9, close 2653.9), 23 = body close di atas 2659 (CISD) + FVG dengan candle 24.
  var pre = [[2656.8, .5, .6], [2659, .6, .5], [2657.4, .4, .4], [2655.6, .3, .5], [2653.9, .3, 2.0]];
  var bull = V.head(pre.concat([
    [2662.4, .4, .3],      // 23 body close 2662.4 > open acuan 2659
    [2664.5, .8, 1.8],     // 24 candle 3 FVG (low 2660.6)
    [2660.3, .5, .3],
    [2659.2, .3, 1.2],     // 26 retest, low 2658.0 menyentuh 50% FVG
    [2663, .5, .4], [2667, .6, .4], [2669.5, .6, .5], [2672, .6, .5]
  ]));
  var bear = V.mirror(bull);
  var ref = bull[20].o;                                          // 2659
  var fBot = bull[22].h, fTop = bull[24].l;                      // 2655.9 dan 2660.6
  var entry = r2((fTop + fBot) / 2), sl = r2(fBot - 0.7), tp = r2(entry + 2 * (entry - sl));

  // Belum valid: candle 23 wick ke 2661 (di atas open acuan 2659) tetapi body close 2658.2 masih di bawahnya. Harga lanjut turun.
  var bad = V.head(pre.concat([
    [2658.2, 2.8, .5],     // 23 wick saja
    [2655.2, .4, 1.5],     // 24 retest 50% zona candle 22
    [2652.6, .3, 1.6],     // 25 kena SL
    [2650, .4, .5], [2648, .4, .5], [2646, .4, .5]
  ]));
  var bTop = bad[22].h, bBot = bad[22].l;                        // 2655.9 dan 2651.9
  var bEntry = r2((bTop + bBot) / 2), bSl = r2(bBot - 0.7), bTp = r2(bEntry + 2 * (bEntry - bSl));

  var ovBull = [
    { type: 'zone', kind: 'FVG', i1: 22, i2: 29, top: fTop, bottom: fBot, label: 'FVG', labelI: 28 },
    { type: 'band', i1: 20, i2: 22, label: 'Delivery', color: CH },
    { type: 'line', i1: 20, i2: 23, y: ref, label: 'Open acuan', color: CH, pos: 'above', labelAt: 'start' },
    { type: 'mark', i: 22, y: bull[22].l, label: 'Sweep', color: SW, pos: 'below' },
    { type: 'text', i: 23, y: bull[23].h, dy: -4, text: 'CISD' },
    { type: 'arrow', i: 26, y: entry, label: 'Entry' },
    { type: 'position', side: 'long', i: 26, i2: 29, entry: entry, sl: sl, tp: tp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.cisd = [
    {
      id: 'cisd-bull', tab: 'Bullish', title: 'CISD bullish: body close di atas open acuan (valid) + entry LP', valid: true,
      hint: 'Cari rangkaian candle turun, tandai open candle pertamanya, lalu lihat apakah ada body close di atasnya.',
      symbol: 'XAUUSD', tf: 'M15', from: 12, candles: bull, meta: { first: 20, last: 22, trigger: 23, ref: ref },
      overlays: ovBull,
      note: 'Candle 20–22 turun berurutan (delivery); open candle 20 = ' + f(ref) + ' jadi open acuan. Candle 22 menyapu low ' + f(bull[17].l) + ' lalu close kembali di atasnya. Candle 23 body close ' + f(bull[23].c) + ' di atas open acuan = bullish CISD, meninggalkan FVG ' + f(fBot) + '–' + f(fTop) + '. Entry LP di 50% ' + f(entry) + ' (candle 26), SL ' + f(sl) + ' di bawah zona, TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'cisd-bear', tab: 'Bearish', title: 'CISD bearish: body close di bawah open acuan (valid) + entry SP', valid: true,
      hint: 'Cari rangkaian candle naik, tandai open candle pertamanya, lalu lihat apakah ada body close di bawahnya.',
      symbol: 'XAUUSD', tf: 'M15', from: 12, candles: bear, meta: { first: 20, last: 22, trigger: 23, ref: m(ref) },
      overlays: V.mirrorOv(ovBull, function (n, o) { if (o.type === 'band') n.labelAt = 'bottom'; }),
      note: 'Candle 20–22 naik berurutan (delivery); open candle 20 = ' + f(m(ref)) + ' jadi open acuan. Candle 22 menyapu high ' + f(m(bull[17].l)) + ' lalu close kembali di bawahnya. Candle 23 body close ' + f(m(bull[23].c)) + ' di bawah open acuan = bearish CISD, meninggalkan FVG ' + f(m(fTop)) + '–' + f(m(fBot)) + '. Entry SP di 50% ' + f(m(entry)) + ' (candle 26), SL ' + f(m(sl)) + ' di atas zona, TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'cisd-bad', tab: 'Belum valid', title: 'Hanya wick di atas open acuan, belum CISD', valid: false,
      hint: 'Tebak dulu: apakah candle 23 sudah CISD? Lihat di mana body-nya close terhadap garis open acuan.',
      symbol: 'XAUUSD', tf: 'M15', from: 12, candles: bad, meta: { first: 20, last: 22, trigger: -1, ref: ref },
      overlays: [
        { type: 'zone', kind: 'OB', i1: 22, i2: 27, top: bTop, bottom: bBot, label: 'OB', labelPos: 'above' },
        { type: 'band', i1: 20, i2: 22, label: 'Delivery', color: CH },
        { type: 'line', i1: 20, i2: 24, y: ref, label: 'Open acuan', color: CH, pos: 'above', labelAt: 'start' },
        { type: 'mark', i: 23, y: bad[23].h, label: 'Wick saja', color: SW, pos: 'above' },
        { type: 'arrow', i: 24, y: bEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 24, i2: 27, entry: bEntry, sl: bSl, tp: bTp }
      ],
      note: 'Candle 23 wick ke ' + f(bad[23].h) + ' (di atas open acuan ' + f(ref) + '), tetapi body close ' + f(bad[23].c) + ' masih di bawahnya. Itu belum CISD. LP di ' + f(bEntry) + ' kena SL ' + f(bSl) + ' saat harga lanjut turun.'
    }
  ];
})();
