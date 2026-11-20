/* Contoh Premium / Discount: range = swing low ke swing high terakhir, garis 50% di tengah.
   Di atas 50% = premium, di bawah 50% = discount. Buy di discount, sell di premium. Data buatan sendiri.
   - pd-buy   : naik dari low ke high, pullback ke FVG di DISCOUNT -> entry LP.
   - pd-sell  : cermin, pullback ke FVG di PREMIUM -> entry SP.
   - pd-wrong : buy di FVG yang ada di PREMIUM -> kena SL (BELUM VALID).
   meta: {lowIdx, highIdx} = swing low dan swing high yang membentuk range. Dicek oleh tests/validate.html. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  function f(v) { return String(r2(v)); }
  var GREY = '#8a919c';

  // Kaki naik dari low (candle 6, 2640) ke high (candle 16, 2680); FVG discount: candle 7-9.
  var legUp = [
    [2658, .6, .6], [2655, .6, .6], [2652, .5, .6], [2649, .5, .6], [2646, .5, .6], [2643, .5, .8],
    [2641, .4, 1.0],       // 6  swing low 2640
    [2644, .6, .4],        // 7  candle 1 FVG (high 2644.6)
    [2652, .5, .2],        // 8  impuls naik
    [2656, .6, .4],        // 9  candle 3 FVG (low 2651.6)
    [2660, .6, .5], [2664, .6, .5], [2662, .8, .6]
  ];
  var buy = V.walk(2660, legUp.concat([
    [2668, .6, .6], [2672, .6, .5], [2676, .8, .5],
    [2679, 1.0, .6],       // 16 swing high 2680
    [2675, .5, .7], [2670, .5, .7], [2664, .5, .6], [2659, .5, .6], [2654, .5, .6], [2650, .5, .6],
    [2649.5, .4, 2.4],     // 23 sentuh entry 2648.1 (di discount, di dalam FVG)
    [2654, .5, .5], [2658, .5, .5], [2662, .5, .5], [2666, .5, .5], [2670, .5, .5]
  ]));
  var sell = V.mirror(buy);
  // Contoh salah: FVG kedua terbentuk di PREMIUM (candle 12-14), entry buy di sana lalu harga jatuh.
  var wrong = V.walk(2660, legUp.concat([
    [2670, .5, .3],        // 13 impuls
    [2674, .6, 1.2],       // 14 candle 3 FVG premium (low 2668.8; candle 12 high 2664.8)
    [2677, .8, .5],
    [2679, 1.0, .6],       // 16 swing high 2680
    [2675, .5, .7], [2672, .5, .7], [2670, .4, .8],
    [2667, .4, 1.4],       // 20 sentuh entry 2666.8 (di premium)
    [2662, .4, .5], [2657, .4, .5], [2652, .4, .5], [2648, .4, .5], [2645, .4, .6], [2643, .4, .6]
  ]));

  var L = buy[6].l, H = buy[16].h, mid = (H + L) / 2;               // 2640, 2680, 2660
  var zBot = buy[7].h, zTop = buy[9].l;                             // FVG discount 2644.6-2651.6
  var entry = (zTop + zBot) / 2, sl = zBot - 1.2, tp = entry + 2 * (entry - sl);
  var wBot = wrong[12].h, wTop = wrong[14].l;                       // FVG premium 2664.8-2668.8
  var wEntry = (wTop + wBot) / 2, wSl = wBot - 1.2, wTp = wEntry + 2 * (wEntry - wSl);

  // Premium selalu di atas 50%, discount di bawahnya (hi > md > lo).
  function rangeOv(n, lo, hi, md, premI) {
    return [
      { type: 'zone', kind: 'PREM', i1: 6, i2: n - 1, top: hi, bottom: md, label: 'Premium', labelI: premI, opacity: 0.1 },
      { type: 'zone', kind: 'DISC', i1: 6, i2: n - 1, top: md, bottom: lo, label: 'Discount', opacity: 0.1 },
      { type: 'line', i1: 6, i2: n - 1, y: md, label: '50%', color: GREY, pos: 'above', labelAt: 'start' }
    ];
  }

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.premdisc = [
    {
      id: 'pd-buy', tab: 'Buy', title: 'Buy di discount (valid) + entry LP di FVG', valid: true,
      hint: 'Tarik range dari low ke high, cari 50%-nya, lalu tebak zona buy.',
      symbol: 'XAUUSD', tf: 'M15', candles: buy, meta: { lowIdx: 6, highIdx: 16 },
      overlays: rangeOv(buy.length, L, H, mid).concat([
        { type: 'text', i: 6, y: L, dy: 11, text: 'Low' },
        { type: 'text', i: 16, y: H, dy: -4, text: 'High' },
        { type: 'zone', kind: 'FVG', i1: 7, i2: 25, top: zTop, bottom: zBot, label: 'FVG', labelI: 9, labelPos: 'above' },
        { type: 'arrow', i: 23, y: entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 23, i2: 26, entry: entry, sl: sl, tp: tp }
      ]),
      note: ''
    },
    {
      id: 'pd-sell', tab: 'Sell', title: 'Sell di premium (valid) + entry SP di FVG', valid: true,
      hint: 'Tarik range dari high ke low, cari 50%-nya, lalu tebak zona sell.',
      symbol: 'XAUUSD', tf: 'M15', candles: sell, meta: { lowIdx: 16, highIdx: 6 },
      overlays: rangeOv(sell.length, m(H), m(L), m(mid), 12).concat([
        { type: 'text', i: 6, y: m(L), dy: -4, text: 'High' },
        { type: 'text', i: 16, y: m(H), dy: 11, text: 'Low' },
        { type: 'zone', kind: 'FVG', i1: 7, i2: 25, top: m(zBot), bottom: m(zTop), label: 'FVG', labelI: 9, labelPos: 'above' },
        { type: 'arrow', i: 23, y: m(entry), label: 'Entry' },
        { type: 'position', side: 'short', i: 23, i2: 26, entry: m(entry), sl: m(sl), tp: m(tp) }
      ]),
      note: ''
    },
    {
      id: 'pd-wrong', tab: 'Belum valid', title: 'Buy di premium (belum valid)', valid: false,
      hint: 'Tebak dulu: apakah FVG ini layak untuk buy? Cek posisinya terhadap 50%.',
      symbol: 'XAUUSD', tf: 'M15', candles: wrong, meta: { lowIdx: 6, highIdx: 16 },
      overlays: rangeOv(wrong.length, L, H, mid).concat([
        { type: 'text', i: 6, y: L, dy: 11, text: 'Low' },
        { type: 'text', i: 16, y: H, dy: -4, text: 'High' },
        { type: 'zone', kind: 'FVG', i1: 12, i2: 21, top: wTop, bottom: wBot, label: 'FVG', labelI: 9, labelPos: 'above' },
        { type: 'arrow', i: 20, y: wEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 20, i2: 23, entry: wEntry, sl: wSl, tp: wTp }
      ]),
      note: ''
    }
  ];

  // Catatan dirangkai dari angka yang sama dengan data (supaya tidak melenceng).
  var P = window.EXAMPLES.premdisc;
  P[0].note = 'Range ' + f(L) + '–' + f(H) + ', garis 50% di ' + f(mid) + '. FVG ' + f(zBot) + '–' + f(zTop) + ' ada di discount (di bawah 50%). Entry LP di 50% zona ' + f(entry) + ', SL ' + f(sl) + ' di bawah zona, TP ' + f(tp) + ' (RR 1:2).';
  P[1].note = 'Range ' + f(m(H)) + '–' + f(m(L)) + ' (turun), garis 50% di ' + f(m(mid)) + '. FVG ' + f(m(zTop)) + '–' + f(m(zBot)) + ' ada di premium (di atas 50%). Entry SP di 50% zona ' + f(m(entry)) + ', SL ' + f(m(sl)) + ' di atas zona, TP ' + f(m(tp)) + ' (RR 1:2).';
  P[2].note = 'Range ' + f(L) + '–' + f(H) + ', garis 50% di ' + f(mid) + '. FVG ' + f(wBot) + '–' + f(wTop) + ' ada di premium, jadi buy di sini mengejar harga mahal. LP di ' + f(wEntry) + ' kena SL ' + f(wSl) + ' saat harga turun ke discount.';
})();
