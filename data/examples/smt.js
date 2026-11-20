/* Contoh SMT divergence: dua aset berkorelasi dibandingkan di TF yang sama. Data buatan sendiri.
   Satu aset membuat high/low baru, aset lain GAGAL membuatnya = divergensi. Hanya konfirmasi tambahan;
   entry tetap di FVG atau OB aset utama (chart atas).
   - smt-bull  : XAUUSD LL, XAGUSD HL  -> CHoCH -> entry LP di FVG.
   - smt-bear  : XAUUSD HH, XAGUSD LH  -> CHoCH -> entry SP di OB.
   - smt-index : US30 HH, NAS100 LH    -> CHoCH -> entry SP di FVG.
   - smt-none  : XAUUSD dan XAGUSD sama-sama LL = bukan SMT (BELUM VALID) -> LP kena SL.
   Dibangun dalam "skala emas" lalu dipetakan ke harga tiap aset. Swing yang dibandingkan: candle 17 dan 23 di kedua chart.
   Dicek oleh tests/validate.html (deteksi divergensi swing, CHoCH, FVG/OB, RR 1:2, hasil TP/SL). */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SM = '#d946ef', GREY = '#8a919c';
  function rd(v, d) { var k = Math.pow(10, d); return Math.round(v * k) / k; }
  function fs(v, d) { return String(rd(v, d)); }

  // ---------- Aset A (utama): head downtrend V.head (swing low 17 = 2653.5), tail beda per contoh ----------
  var A_COMMON = [
    [2658, .5, .6], [2661, .5, .6],
    [2663.5, 1, .5],       // 20 LH terakhir (high 2664.5)
    [2660, .5, .6], [2656, .5, .6],
    [2653.5, .4, 2.5],     // 23 low baru 2651.0 (LL dibanding candle 17)
    [2658, .4, .4],        // 24 candle 1 FVG (high 2658.4)
    [2666, .5, .2],        // 25 impuls: body close > LH 2664.5 = CHoCH
    [2668, .8, 2.5]        // 26 candle 3 FVG (low 2663.5)
  ];
  var A_FVG = V.head(A_COMMON.concat([
    [2665, .5, .5], [2661.5, .4, 1.0],   // 27, 28 sentuh entry 2660.95 (50% FVG)
    [2665, .5, .5], [2669, .8, .5], [2672, .8, .5], [2674, .8, .8]
  ]));
  var A_OB = V.head(A_COMMON.concat([
    [2663, .5, .5], [2659, .5, .5], [2655, .4, .6],
    [2654.5, .4, 1.5],                   // 30 sentuh entry 2653.7 (50% OB candle 23)
    [2659, .5, .5], [2663, .5, .5], [2667, .8, .5], [2670, .8, .5]
  ]));
  var A_NONE = V.head([
    [2658, .5, .6], [2661, .5, .6], [2663.5, 1, .5], [2660, .5, .6], [2656, .5, .6], [2653.5, .4, 2.5],
    [2655.5, .4, .5],      // 24 pantulan kecil (sentuh entry 2654)
    [2652, .4, .5],        // 25 kena SL 2652, lanjut turun
    [2649, .4, .6], [2646, .4, .6], [2643.5, .4, .6], [2641, .4, .6], [2639, .4, .6], [2637.5, .4, .6], [2635, .4, .6]
  ]);

  // ---------- Aset B (korelasi): swing low 17 (2654.7) dan 23 (2656.3 = HL, gagal membuat LL) ----------
  var B_HEAD = [
    [2662.5, .7, .5], [2666, .5, .6], [2668.5, 1.3, .7], [2666.5, .5, .5], [2663.5, .6, .5], [2660.5, .5, 1.4],
    [2662.5, .5, .7], [2665.5, .6, .5], [2667, 1.2, .7], [2663.5, .6, .6], [2660.5, .4, .7], [2658, .5, 1.3],
    [2660.5, .7, .5], [2663, .6, .6], [2664.5, 1.2, .7], [2662, .5, .5], [2659, .5, .5], [2656, .5, 1.3]
  ];
  var B_COMMON = [
    [2659, .5, .5], [2661.8, .5, .5], [2664, 1, .5], [2661, .5, .5], [2658, .5, .5],
    [2656.8, .4, .5],      // 23 HL (low 2656.3 > 2654.7): gagal membuat low baru
    [2660, .4, .3], [2665, .5, .2], [2667, .6, 1.0]
  ];
  var B_FVG = V.walk(2660, B_HEAD.concat(B_COMMON, [
    [2664.5, .3, .5], [2663, .4, .8], [2666, .5, .5], [2669, .8, .5], [2671.5, .8, .5], [2673, .8, .8]
  ]));
  var B_OB = V.walk(2660, B_HEAD.concat(B_COMMON, [
    [2665.5, .4, .5], [2662.5, .4, .5], [2660, .4, .5], [2658.8, .4, .6],
    [2662, .4, .4], [2665, .5, .5], [2668, .8, .5], [2670.5, .8, .5]
  ]));
  var B_NONE = V.walk(2660, B_HEAD.concat([
    [2659, .5, .5], [2662, .5, .5], [2664, 1, .5], [2661, .5, .5], [2658, .5, .5],
    [2653.8, .4, .9],      // 23 low baru 2652.9 (LL) = sama seperti aset A
    [2656, .4, .4], [2654, .4, .5], [2651, .4, .6], [2648, .4, .6], [2645, .4, .6], [2642, .4, .6], [2640.5, .4, .6], [2638, .4, .6], [2636, .4, .6]
  ]));

  // ---------- Pemetaan harga per aset ----------
  function mapCs(cs, fn) { return cs.map(function (c) { return { o: fn(c.o), h: fn(c.h), l: fn(c.l), c: fn(c.c) }; }); }
  var ASSET = {
    xau: { symbol: 'XAUUSD', k: 1, fn: function (p) { return r2(p); }, d: 2 },
    xag: { symbol: 'XAGUSD', k: 0.25, fn: function (p) { return rd(31 + (p - 2650) * 0.25, 3); }, d: 3 },
    us30: { symbol: 'US30', k: 15, fn: function (p) { return r2(42000 + (p - 2650) * 15); }, d: 2 },
    nas: { symbol: 'NAS100', k: 7, fn: function (p) { return r2(21000 + (p - 2650) * 7); }, d: 2 }
  };
  // arah: 'bull' = apa adanya; 'bear' = cermin harga emas (5300 - p) sebelum dipetakan.
  function make(raw, dir, asset) {
    return mapCs(dir === 'bear' ? V.mirror(raw) : raw, ASSET[asset].fn);
  }

  // Overlay divergensi satu chart: garis miring a -> b, dua lingkaran, label.
  function divOv(cs, bear, label, color) {
    var key = bear ? 'h' : 'l', pos = bear ? 'above' : 'below';
    return [
      { type: 'seg', i1: 17, y1: cs[17][key], i2: 23, y2: cs[23][key], label: label, color: color, pos: pos },
      { type: 'mark', i: 17, y: cs[17][key], color: color },
      { type: 'mark', i: 23, y: cs[23][key], label: 'SMT', color: color, pos: pos }
    ];
  }

  // Contoh valid. zone 'FVG' (candle 24-26, entry candle 28) atau 'OB' (candle 23, entry candle 30).
  function valid(o) {
    var bear = o.dir === 'bear', A = make(o.A, o.dir, o.a), B = make(o.B, o.dir, o.b), k = ASSET[o.a].k, dA = ASSET[o.a].d;
    var zone, entryI, sl, tp, entry, top, bot, i1, label;
    if (o.zone === 'FVG') {
      i1 = 24; entryI = 28;
      top = bear ? A[24].l : A[26].l; bot = bear ? A[26].h : A[24].h;
      entry = (top + bot) / 2;
      sl = bear ? top + 1.2 * k : bot - 1.2 * k;
    } else {
      i1 = 23; entryI = 30;
      top = A[23].h; bot = A[23].l;
      entry = (top + bot) / 2;
      sl = bear ? top + 0.7 * k : bot - 0.7 * k;
    }
    tp = entry + 2 * (entry - sl);
    var lvl = bear ? A[20].l : A[20].h;
    var ovA = divOv(A, bear, bear ? 'HH' : 'LL', SM).concat([
      { type: 'line', i1: 20, i2: 25, y: lvl, label: 'CHoCH', color: CH, pos: bear ? 'below' : 'above' },
      { type: 'zone', kind: o.zone, i1: i1, i2: entryI + 4, top: top, bottom: bot, label: o.zone, labelPos: 'above' },
      { type: 'arrow', i: entryI, y: entry, label: 'Entry' },
      { type: 'position', side: bear ? 'short' : 'long', i: entryI, i2: entryI + 3, entry: entry, sl: sl, tp: tp }
    ]);
    var ovB = divOv(B, bear, bear ? 'LH' : 'HL', SM);
    var key = bear ? 'h' : 'l', nameA = ASSET[o.a].symbol, nameB = ASSET[o.b].symbol;
    var note = nameA + ' membuat ' + (bear ? 'high' : 'low') + ' baru (' + (bear ? 'HH' : 'LL') + ') di ' + fs(A[23][key], dA) +
      ', tapi ' + nameB + ' gagal dan hanya ' + (bear ? 'LH' : 'HL') + ' (' + fs(B[23][key], ASSET[o.b].d) + '). Itu SMT ' + (bear ? 'bearish' : 'bullish') +
      '. Setelah CHoCH di candle ke-25, entry ' + (bear ? 'SP' : 'LP') + ' di 50% ' + o.zone + ' ' + fs(entry, dA) + ', SL ' + fs(sl, dA) + ', TP ' + fs(tp, dA) + ' (RR 1:2).';
    return {
      id: o.id, tab: o.tab, title: o.title, valid: true, hint: 'Bandingkan kedua chart: aset mana yang gagal membuat ' + (bear ? 'high' : 'low') + ' baru?',
      symbol: nameA, tf: 'M15', candles: A, overlays: ovA,
      pair: { symbol: nameB, tf: 'M15', candles: B, overlays: ovB },
      meta: { dir: o.dir, ia: 17, ib: 23, zone: o.zone },
      note: note
    };
  }

  // Contoh salah: kedua aset sama-sama membuat low baru (tidak ada divergensi).
  var nA = make(A_NONE, 'bull', 'xau'), nB = make(B_NONE, 'bull', 'xag');
  var nEntry = 2654.0, nSl = 2652.0, nTp = nEntry + 2 * (nEntry - nSl);
  var none = {
    id: 'smt-none', tab: 'Belum valid', title: 'Dua aset sama-sama LL (bukan SMT)', valid: false,
    hint: 'Tebak dulu: apakah ada divergensi? Lihat low kedua di tiap chart.',
    symbol: 'XAUUSD', tf: 'M15', candles: nA,
    overlays: divOv(nA, false, 'LL', GREY).concat([
      { type: 'arrow', i: 24, y: nEntry, label: 'Entry' },
      { type: 'position', side: 'long', i: 24, i2: 27, entry: nEntry, sl: nSl, tp: nTp }
    ]),
    pair: { symbol: 'XAGUSD', tf: 'M15', candles: nB, overlays: divOv(nB, false, 'LL', GREY) },
    meta: { dir: 'none', ia: 17, ib: 23 },
    note: 'XAUUSD dan XAGUSD sama-sama membuat low baru (' + fs(nA[23].l, 2) + ' dan ' + fs(nB[23].l, 3) + '), jadi tidak ada divergensi. Itu tanda downtrend masih kompak, bukan SMT. LP di ' + fs(nEntry, 2) + ' kena SL ' + fs(nSl, 2) + ' saat harga lanjut turun.'
  };

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.smt = [
    valid({ id: 'smt-bull', tab: 'Bullish', title: 'SMT bullish: XAUUSD LL, XAGUSD HL (valid) + entry LP', dir: 'bull', zone: 'FVG', A: A_FVG, B: B_FVG, a: 'xau', b: 'xag' }),
    valid({ id: 'smt-bear', tab: 'Bearish', title: 'SMT bearish: XAUUSD HH, XAGUSD LH (valid) + entry SP', dir: 'bear', zone: 'OB', A: A_OB, B: B_OB, a: 'xau', b: 'xag' }),
    valid({ id: 'smt-index', tab: 'Indeks', title: 'SMT indeks: US30 HH, NAS100 LH (valid) + entry SP', dir: 'bear', zone: 'FVG', A: A_FVG, B: B_FVG, a: 'us30', b: 'nas' }),
    none
  ];
})();
