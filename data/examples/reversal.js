/* Contoh Reversal vs Continuation. Reversal = struktur berbalik (CHoCH, lalu konfirmasi). Continuation = pullback ke FVG/OB lalu BOS searah tren.
   Data buatan sendiri.
   - rev-bull / rev-bear   : downtrend -> CHoCH naik meninggalkan FVG -> entry LP di 50% FVG -> BOS naik mengonfirmasi (bearish = cermin).
   - cont-bear / cont-bull : downtrend lanjut: BOS turun meninggalkan OB bearish -> pullback ke OB -> entry SP -> BOS turun lagi (bullish = cermin).
   - rev-bad : candle sama dengan cont-bear, tetapi pullback dibaca sebagai reversal -> LP di pullback kena SL (tidak ada CHoCH).
   Dicek oleh tests/validate.html (klasifikasi CHoCH vs BOS, zona FVG/OB, entry 50%, konfirmasi, RR 1:2, hasil TP/SL).
   meta: {kind: 'reversal'|'continuation', break: indeks candle CHoCH/BOS pemicu, confirm: indeks candle BOS konfirmasi}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }
  var LH = 2665.5; // swing high terakhir dari V.head

  /* ---------- Reversal: CHoCH naik + FVG ---------- */
  // 19 = body close > LH (CHoCH), 18-20 = FVG, 23 = retest 50% FVG (entry), 26 = body close > high candle 20 (BOS konfirmasi).
  var rv = V.head([
    [2656, .4, .6], [2668, .4, .3], [2669.5, .6, 4.8],
    [2666, .5, .5], [2662.5, .4, .5], [2660.5, .4, 1],
    [2664, .5, .5], [2668, .5, .5], [2671, .6, .5], [2672, .5, .5]
  ]);
  var rTop = rv[20].l, rBot = rv[18].h;                              // 2663.2 dan 2656.4
  var rEntry = r2((rTop + rBot) / 2), rSl = r2(rBot - 1), rTp = r2(rEntry + 2 * (rEntry - rSl));
  var rHH = rv[20].h;                                                // 2670.1
  var ovRv = [
    { type: 'text', i: 14, y: rv[14].h, dy: -4, text: 'LH' },
    { type: 'zone', kind: 'FVG', i1: 18, i2: 27, top: rTop, bottom: rBot, label: 'FVG' },
    { type: 'line', i1: 14, i2: 19, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
    { type: 'line', i1: 20, i2: 26, y: rHH, label: 'BOS', color: CH, pos: 'above', labelAt: 'start' },
    { type: 'arrow', i: 23, y: rEntry, label: 'Entry' },
    { type: 'position', side: 'long', i: 23, i2: 27, entry: rEntry, sl: rSl, tp: rTp }
  ];

  /* ---------- Continuation: BOS turun + pullback ke OB bearish ---------- */
  // 19 = OB bearish (naik terakhir), 20 = body close < LL 2653.5 (BOS), 21 = LL baru 2645.5, 22-25 = pullback ke OB,
  // 25 = entry (50% OB), 28 = body close < low candle 21 (BOS lagi).
  var cn = V.head([
    [2656, .4, .4], [2661, .6, .4], [2650, .3, .4], [2646, .3, .5],
    [2650, .4, .4], [2654, .4, .5], [2657, .4, .5], [2658, .9, .4],
    [2655, .4, .5], [2652.5, .4, .5], [2644.5, .4, .5], [2641, .4, .5]
  ]);
  var oTop = cn[19].h, oBot = cn[19].l;                              // 2661.6 dan 2655.6
  var cEntry = r2((oTop + oBot) / 2), cSl = r2(oTop + 0.7), cTp = r2(cEntry - 2 * (cSl - cEntry));
  var LL = cn[17].l, LL2 = cn[21].l;                                 // 2653.5 dan 2645.5
  var ovCn = [
    { type: 'zone', kind: 'OB', i1: 19, i2: 28, top: oTop, bottom: oBot, label: 'OB' },
    { type: 'line', i1: 17, i2: 20, y: LL, label: 'BOS', color: CH, pos: 'below', labelAt: 'start' },
    { type: 'line', i1: 21, i2: 28, y: LL2, label: 'BOS lagi', color: CH, pos: 'below', labelAt: 'start' },
    { type: 'text', i: 23.5, y: cn[24].h, dy: -5, text: 'Pullback' },
    { type: 'arrow', i: 25, y: cEntry, label: 'Entry' },
    { type: 'position', side: 'short', i: 25, i2: 29, entry: cEntry, sl: cSl, tp: cTp }
  ];

  /* ---------- Belum valid: pullback dibaca sebagai reversal ---------- */
  var bEntry = 2657, bSl = 2655, bTp = r2(bEntry + 2 * (bEntry - bSl));
  var ovBad = [
    { type: 'zone', kind: 'OFF', i1: 19, i2: 28, top: oTop, bottom: oBot, label: 'OB bearish', opacity: 0.12 },
    { type: 'line', i1: 19, i2: 28, y: oTop, label: 'Belum ditembus', color: CH, pos: 'above', labelAt: 'start' },
    { type: 'arrow', i: 25, y: bEntry, label: 'Entry' },
    { type: 'position', side: 'long', i: 25, i2: 28, entry: bEntry, sl: bSl, tp: bTp }
  ];

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.reversal = [
    {
      id: 'rev-bull', tab: 'Reversal ↑', title: 'Reversal bullish: CHoCH + FVG + BOS konfirmasi (valid)', valid: true,
      hint: 'Cari CHoCH pertama setelah downtrend, lalu BOS yang mengonfirmasi arah baru.',
      symbol: 'XAUUSD', tf: 'M15', candles: rv, meta: { kind: 'reversal', break: 19, confirm: 26 },
      overlays: ovRv,
      note: 'Downtrend (LH, LL). Candle 19 body close di atas LH ' + f(LH) + ' = CHoCH dan meninggalkan FVG ' + f(rBot) + '–' + f(rTop) + '. Candle 26 body close di atas high ' + f(rHH) + ' = BOS naik, konfirmasi arah baru. Entry LP di 50% FVG ' + f(rEntry) + ', SL ' + f(rSl) + ', TP ' + f(rTp) + ' (RR 1:2).'
    },
    {
      id: 'rev-bear', tab: 'Reversal ↓', title: 'Reversal bearish: CHoCH + FVG + BOS konfirmasi (valid)', valid: true,
      hint: 'Cari CHoCH pertama setelah uptrend, lalu BOS yang mengonfirmasi arah baru.',
      symbol: 'XAUUSD', tf: 'M15', candles: V.mirror(rv), meta: { kind: 'reversal', break: 19, confirm: 26 },
      overlays: V.mirrorOv(ovRv, function (n, o) { if (o.type === 'text' && o.text === 'LH') n.text = 'HL'; }),
      note: 'Uptrend (HH, HL). Candle 19 body close di bawah HL ' + f(m(LH)) + ' = CHoCH dan meninggalkan FVG ' + f(m(rTop)) + '–' + f(m(rBot)) + '. Candle 26 body close di bawah low ' + f(m(rHH)) + ' = BOS turun, konfirmasi arah baru. Entry SP di 50% FVG ' + f(m(rEntry)) + ', SL ' + f(m(rSl)) + ', TP ' + f(m(rTp)) + ' (RR 1:2).'
    },
    {
      id: 'cont-bear', tab: 'Continuation ↓', title: 'Continuation bearish: pullback ke OB + BOS turun (valid)', valid: true,
      hint: 'Cari BOS searah tren, tunggu pullback ke zona, lalu lihat BOS berikutnya.',
      symbol: 'XAUUSD', tf: 'M15', candles: cn, meta: { kind: 'continuation', break: 20, confirm: 28 },
      overlays: ovCn,
      note: 'Downtrend lanjut. Candle 20 body close di bawah LL ' + f(LL) + ' (BOS) meninggalkan OB bearish ' + f(oBot) + '–' + f(oTop) + '. Harga pullback ke OB, entry SP di 50% ' + f(cEntry) + ' (candle 25), SL ' + f(cSl) + ', TP ' + f(cTp) + ' (RR 1:2). Candle 28 body close di bawah ' + f(LL2) + ' = BOS lagi: tren lanjut.'
    },
    {
      id: 'cont-bull', tab: 'Continuation ↑', title: 'Continuation bullish: pullback ke OB + BOS naik (valid)', valid: true,
      hint: 'Cari BOS searah tren, tunggu pullback ke zona, lalu lihat BOS berikutnya.',
      symbol: 'XAUUSD', tf: 'M15', candles: V.mirror(cn), meta: { kind: 'continuation', break: 20, confirm: 28 },
      overlays: V.mirrorOv(ovCn, function (n, o) { if (o.type === 'text') n.dy = 11; }),
      note: 'Uptrend lanjut. Candle 20 body close di atas HH ' + f(m(LL)) + ' (BOS) meninggalkan OB bullish ' + f(m(oTop)) + '–' + f(m(oBot)) + '. Harga pullback ke OB, entry LP di 50% ' + f(m(cEntry)) + ' (candle 25), SL ' + f(m(cSl)) + ', TP ' + f(m(cTp)) + ' (RR 1:2). Candle 28 body close di atas ' + f(m(LL2)) + ' = BOS lagi: tren lanjut.'
    },
    {
      id: 'rev-bad', tab: 'Belum valid', title: 'Pullback dibaca sebagai reversal (belum valid)', valid: false,
      hint: 'Tebak dulu: apakah ini CHoCH? Cek apakah ada body close di atas swing high terakhir.',
      symbol: 'XAUUSD', tf: 'M15', candles: cn, meta: { kind: 'continuation', break: 20, confirm: 28 },
      overlays: ovBad,
      note: 'Harga naik pullback, tetapi tidak ada body close di atas swing high ' + f(oTop) + ': tidak ada CHoCH, jadi ini bukan reversal. Pullback justru berhenti di OB bearish. LP di ' + f(bEntry) + ' melawan tren dan kena SL ' + f(bSl) + ' saat tren turun lanjut.'
    }
  ];
})();
