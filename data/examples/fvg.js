/* Contoh chart FVG (data buatan sendiri, bergaya harga XAUUSD). Format candle: {o,h,l,c}.
   Semua contoh divalidasi oleh tests/validate.html (deteksi FVG + RR 1:2). */
(function () {
  function C(rows) {
    return rows.map(function (r) { return { o: r[0], h: r[1], l: r[2], c: r[3] }; });
  }
  // Cermin harga di sekitar 2650 (pivot 5300): dipakai untuk contoh bearish.
  function mirror(cs) {
    return cs.map(function (c) { return { o: 5300 - c.o, h: 5300 - c.l, l: 5300 - c.h, c: 5300 - c.c }; });
  }
  var m = function (p) { return 5300 - p; };

  // [open, high, low, close]. FVG bullish: candle 7 (high 2647), 8 (impuls), 9 (low 2652) -> zona 2647-2652.
  var head = [
    [2648, 2650, 2645, 2646], [2646, 2649, 2644, 2648], [2648, 2651, 2647, 2650], [2650, 2652, 2648, 2649],
    [2649, 2650, 2645, 2646], [2646, 2647, 2642, 2643], [2643, 2646, 2641, 2645], [2645, 2647, 2643, 2644],
    [2644, 2658, 2644, 2657], [2657, 2662, 2652, 2661], [2661, 2664, 2658, 2660], [2660, 2663, 2657, 2658],
    [2658, 2659, 2652, 2653]
  ];
  var bullTail = [
    [2653, 2655, 2648, 2650], [2650, 2660, 2649, 2659], [2659, 2667, 2658, 2666],
    [2666, 2670, 2664, 2669], [2669, 2672, 2666, 2668]
  ];
  // Contoh salah: candle 13 body close di 2645 (di bawah batas bawah zona 2647) lalu harga lanjut turun.
  var brokenTail = [
    [2653, 2654, 2644, 2645], [2645, 2647, 2639, 2640], [2640, 2646, 2638, 2645],
    [2645, 2648, 2641, 2642], [2642, 2643, 2636, 2637]
  ];

  var bull = C(head.concat(bullTail));
  var bear = mirror(bull);
  var broken = C(head.concat(brokenTail));

  // Entry = 50% zona, SL di luar sisi jauh zona, TP = entry +/- 2 x risiko (RR 1:2).
  var LONG = { entry: 2649.5, sl: 2645, tp: 2649.5 + 2 * (2649.5 - 2645) };      // 2658.5
  var SHORT = { entry: m(2649.5), sl: m(2645), tp: m(2649.5) - 2 * (m(2645) - m(2649.5)) }; // 2641.5

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.fvg = [
    {
      id: 'fvg-bull', tab: 'Bullish', title: 'FVG bullish (valid) + entry LP', valid: true,
      symbol: 'XAUUSD', tf: 'M15', candles: bull,
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 7, i2: 14, labelI: 10, top: 2652, bottom: 2647, label: 'FVG' },
        { type: 'text', i: 7, y: 2643, dy: 11, text: '1' },
        { type: 'text', i: 8, y: 2644, dy: 11, text: '2' },
        { type: 'text', i: 9, y: 2662, dy: -4, text: '3' },
        { type: 'arrow', i: 13, y: LONG.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 13, i2: 17, entry: LONG.entry, sl: LONG.sl, tp: LONG.tp }
      ],
      note: 'High candle 1 = 2647, low candle 3 = 2652, jadi ada celah 2647–2652. Harga turun ke zona lalu naik lagi. Entry LP 2649.5 (50% zona), SL 2645 di bawah zona, TP 2658.5 (RR 1:2).'
    },
    {
      id: 'fvg-bear', tab: 'Bearish', title: 'FVG bearish (valid) + entry SP', valid: true,
      symbol: 'XAUUSD', tf: 'M15', candles: bear,
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 7, i2: 14, labelI: 10, top: m(2647), bottom: m(2652), label: 'FVG' },
        { type: 'text', i: 7, y: m(2643), dy: -4, text: '1' },
        { type: 'text', i: 8, y: m(2644), dy: -4, text: '2' },
        { type: 'text', i: 9, y: m(2662), dy: 11, text: '3' },
        { type: 'arrow', i: 13, y: SHORT.entry, label: 'Entry' },
        { type: 'position', side: 'short', i: 13, i2: 17, entry: SHORT.entry, sl: SHORT.sl, tp: SHORT.tp }
      ],
      note: 'Low candle 1 = 2653, high candle 3 = 2648, jadi ada celah 2648–2653. Harga naik ke zona lalu turun lagi. Entry SP 2650.5 (50% zona), SL 2655 di atas zona, TP 2641.5 (RR 1:2).'
    },
    {
      id: 'fvg-broken', tab: 'Belum valid', title: 'FVG sudah tertembus (jangan dipakai)', valid: false,
      symbol: 'XAUUSD', tf: 'M15', candles: broken,
      overlays: [
        { type: 'zone', kind: 'OFF', i1: 7, i2: 14, labelI: 10, top: 2652, bottom: 2647, label: 'FVG' },
        { type: 'text', i: 13, y: 2638, text: 'Body close tembus zona', anchor: 'end' },
        { type: 'arrow', i: 13, y: LONG.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 13, i2: 15, entry: LONG.entry, sl: LONG.sl, tp: LONG.tp }
      ],
      note: 'Candle 13 body close di 2645, di bawah batas bawah zona (2647). Zona itu tidak dipakai lagi: LP di 2649.5 kena SL 2645. Kalau setelah itu harga kembali ke zona dari sisi seberang, zona ini bisa jadi IFVG (lihat materi IFVG).'
    }
  ];
})();
