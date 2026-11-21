/* Contoh "Kapan TIDAK entry" (Tahap 7B). Tiap contoh menunjukkan entry yang menggoda, lalu kenapa harus dilewati (hasilnya kena SL).
   - noentry-breach : zona FVG sudah ditembus body close berlawanan, entry LP di retest dari bawah -> ditolak, kena SL.
   - noentry-chop   : bias TF besar tidak jelas (HH tetapi LL = melebar, tren campuran) -> entry LP di FVG kena SL.
   - noentry-wait   : konfirmasi (body close di bawah HL) belum ada, entry SP di FVG -> harga lanjut naik, kena SL.
   Alasan "berita besar" tidak bisa digambar di chart candle, jadi dijelaskan di kartu materi.
   meta.reason: 'zona-tertembus' | 'bias' | 'konfirmasi'. Dicek oleh tests/validate.html. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef';
  var LH = 2665.5; // swing high terakhir (candle 14) dari V.head
  function f(v) { return String(r2(v)); }
  function plan(top, bot) {
    var e = r2((top + bot) / 2), s = r2(bot - 0.7), t = r2(e + 2 * (e - s));
    return { entry: e, sl: s, tp: t };
  }

  // X: FVG bullish 2658.5-2663.5 (candle 20-22), lalu candle 25 body close 2657 < 2658.5 = tertembus. Candle 28 retest dari bawah.
  var breach = V.head([
    [2653.5, .4, .6], [2655, .4, .5], [2658, .5, .4], [2667.5, .4, .3], [2669, .4, 4.0],
    [2666, .5, .6], [2662, .4, .5], [2657, .4, .6], [2654.5, .4, .6], [2657.5, .4, .5],
    [2661, .4, .6], [2659, .4, .5], [2656, .4, .6], [2653, .4, .6], [2650, .4, .6]
  ]);
  var bTop = breach[22].l, bBot = breach[20].h;        // 2663.5 dan 2658.5
  var pb = plan(bTop, bBot);

  // Y: range yang melebar (HH 9 = 2664.9 dan LL 13 = 2651.0), tanpa tren jelas. FVG kecil di candle 14-16.
  var chop = V.walk(2655, [
    [2657, .5, .5], [2659, .5, .5], [2660.5, .8, .4], [2658, .5, .5], [2655.5, .5, .5],
    [2653.5, .5, 1.0], [2656, .4, .5], [2659, .5, .4], [2662, .5, .5], [2664, .9, .4],
    [2661, .4, .5], [2658, .4, .5], [2655, .4, .5], [2652, .4, 1.0], [2655, .4, .5],
    [2659, .3, .3], [2661, .4, 1.0], [2659.5, .4, .5], [2657.5, .4, .5], [2656, .4, .6],
    [2653.5, .4, .6], [2651, .4, .6], [2649, .4, .6]
  ]);
  var cTop = chop[16].l, cBot = chop[14].h;             // 2658 dan 2655.4
  var pc = plan(cTop, cBot);

  // Z: FVG bullish 2653.5... dicerminkan jadi bearish. Harga menyentuh zona tetapi tidak pernah body close melewati level.
  var wait = V.head([
    [2651.5, .5, .6], [2652.5, .4, .5], [2658, .3, .3], [2659, .4, 1.0], [2657.5, .4, .5],
    [2655.5, .4, .9], [2654, .4, .6], [2651.5, .4, .6], [2648.5, .4, .6], [2646, .4, .6], [2643.5, .4, .6]
  ]);
  var waitBear = V.mirror(wait);
  var wTop = wait[21].l, wBot = wait[19].h;             // 2657 dan 2652.9
  var pw = plan(wTop, wBot);

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.noentry = [
    {
      id: 'noentry-breach', tab: 'Zona tertembus', title: 'Zona sudah tertembus body close: jangan entry', valid: false,
      hint: 'Tebak dulu: apa yang terjadi pada FVG ini sebelum entry dipasang?',
      symbol: 'XAUUSD', tf: 'M5', candles: breach, meta: { reason: 'zona-tertembus' },
      overlays: [
        { type: 'zone', kind: 'OFF', i1: 20, i2: 31, top: bTop, bottom: bBot, label: 'FVG tertembus' },
        { type: 'line', i1: 14, i2: 21, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'text', i: 24, y: breach[25].l, dy: 12, text: 'Close di bawah zona' },
        { type: 'arrow', i: 28, y: pb.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 28, i2: 32, entry: pb.entry, sl: pb.sl, tp: pb.tp }
      ],
      note: 'Candle ke-25 body close di ' + f(breach[25].c) + ', di bawah batas bawah FVG ' + f(bBot) + ': zona tertembus dan tidak dipakai lagi. Entry LP ' + f(pb.entry) + ' saat harga kembali ke zona ditolak, lalu harga lanjut turun dan kena SL ' + f(pb.sl) + '.'
    },
    {
      id: 'noentry-chop', tab: 'Bias tidak jelas', title: 'Bias TF besar tidak jelas: jangan entry', valid: false,
      hint: 'Tebak dulu: apakah strukturnya uptrend, downtrend, atau campuran?',
      symbol: 'XAUUSD', tf: 'M5', candles: chop, meta: { reason: 'bias' },
      overlays: [
        { type: 'text', i: 9, y: chop[9].h, dy: -4, text: 'HH' },
        { type: 'text', i: 13, y: chop[13].l, dy: 11, text: 'LL' },
        { type: 'zone', kind: 'FVG', i1: 14, i2: 21, top: cTop, bottom: cBot, label: 'FVG' },
        { type: 'arrow', i: 19, y: pc.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 19, i2: 22, entry: pc.entry, sl: pc.sl, tp: pc.tp }
      ],
      note: 'Swing high naik (HH ' + f(chop[9].h) + ') tetapi swing low juga turun (LL ' + f(chop[13].l) + '): range melebar, bias tidak jelas. Entry LP ' + f(pc.entry) + ' di FVG kecil tanpa arah TF besar kena SL ' + f(pc.sl) + '.'
    },
    {
      id: 'noentry-wait', tab: 'Konfirmasi belum ada', title: 'Konfirmasi belum ada: tunggu, jangan entry', valid: false,
      hint: 'Tebak dulu: apa yang masih ditunggu sebelum SP ini boleh dipasang?',
      symbol: 'XAUUSD', tf: 'M5', candles: waitBear, meta: { reason: 'konfirmasi', level: m(LH) },
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 19, i2: 27, top: m(wBot), bottom: m(wTop), label: 'FVG' },
        { type: 'line', i1: 14, i2: 27, y: m(LH), label: 'HL', color: CH, pos: 'below' },
        { type: 'text', i: 19, y: m(2667), dy: 0, text: 'Belum close di bawah HL' },
        { type: 'arrow', i: 23, y: m(pw.entry), label: 'Entry' },
        { type: 'position', side: 'short', i: 23, i2: 27, entry: m(pw.entry), sl: m(pw.sl), tp: m(pw.tp) }
      ],
      note: 'Harga menyentuh FVG bearish ' + f(m(wBot)) + '–' + f(m(wTop)) + ' dan SP ' + f(m(pw.entry)) + ' dipasang, padahal belum ada body close di bawah HL ' + f(m(LH)) + '. Tanpa konfirmasi, harga lanjut naik dan kena SL ' + f(m(pw.sl)) + '.'
    }
  ];
})();
