/* Contoh IFVG (Inverse FVG): FVG yang ditembus BODY CLOSE berlawanan, lalu zonanya berbalik peran.
   - ifvg-bull : FVG bullish tertembus ke bawah -> zona jadi resisten -> entry SP saat retest.
   - ifvg-bear : FVG bearish tertembus ke atas -> zona jadi support -> entry LP saat retest.
   - ifvg-wick : hanya wick yang menembus, body close balik ke dalam = BELUM IFVG (FVG masih hidup).
   Data buatan sendiri. Dicek oleh tests/validate.html (deteksi IFVG, titik tembus, RR 1:2, hasil TP/SL). */
(function () {
  function C(rows) { return rows.map(function (r) { return { o: r[0], h: r[1], l: r[2], c: r[3] }; }); }
  var V = window.VyData, m = V.mp;

  // [open, high, low, close]. FVG bullish: candle 7 (high 2647), 8 (impuls), 9 (low 2652) -> zona 2647-2652.
  var head = [
    [2648, 2650, 2645, 2646], [2646, 2649, 2644, 2648], [2648, 2651, 2647, 2650], [2650, 2652, 2648, 2649],
    [2649, 2650, 2645, 2646], [2646, 2647, 2642, 2643], [2643, 2646, 2641, 2645], [2645, 2647, 2643, 2644],
    [2644, 2658, 2644, 2657], [2657, 2662, 2652, 2661], [2661, 2664, 2658, 2660], [2660, 2663, 2657, 2658],
    [2658, 2659, 2652, 2653]
  ];
  // Candle 13 body close 2645 (< batas bawah 2647) = tembus. Retest dari bawah di candle 18 (high 2650.5), lalu turun.
  var breakTail = [
    [2653, 2654, 2644, 2645], [2645, 2646, 2639, 2640], [2640, 2641, 2636, 2637], [2637, 2642, 2635, 2641],
    [2641, 2647, 2640, 2646], [2646, 2650.5, 2645, 2647], [2647, 2648, 2643, 2644], [2644, 2645, 2639, 2640],
    [2640, 2641, 2635, 2636]
  ];
  // Wick candle 13 turun ke 2644.5 (< 2647) tapi close 2648 (di dalam zona). Short "IFVG" di candle 14, harga naik.
  var wickTail = [
    [2653, 2654, 2644.5, 2648], [2648, 2651, 2647.5, 2650], [2650, 2656, 2649, 2655],
    [2655, 2660, 2654, 2659], [2659, 2663, 2657, 2662], [2662, 2666, 2660, 2665]
  ];

  var bull = C(head.concat(breakTail));
  var bear = V.mirror(bull);
  var wick = C(head.concat(wickTail));

  // Entry = 50% zona (2649.5), SL di luar sisi jauh zona (2654), TP = entry -/+ 2 x risiko.
  var SHORT = { entry: 2649.5, sl: 2654, tp: 2640.5 };
  var LONG = { entry: m(2649.5), sl: m(2654), tp: m(2640.5) };

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.ifvg = [
    {
      id: 'ifvg-bull', tab: 'Bullish → resisten', title: 'IFVG: FVG bullish tertembus, jadi resisten (SP)', valid: true,
      symbol: 'XAUUSD', tf: 'M15', candles: bull, meta: { breakAt: 13 },
      overlays: [
        { type: 'zone', kind: 'IFVG', i1: 7, i2: 21, labelI: 10, top: 2652, bottom: 2647, label: 'IFVG' },
        { type: 'text', i: 13, y: 2638, text: 'Body close tembus', anchor: 'end' },
        { type: 'arrow', i: 18, y: SHORT.entry, label: 'Entry' },
        { type: 'position', side: 'short', i: 18, i2: 21, entry: SHORT.entry, sl: SHORT.sl, tp: SHORT.tp }
      ],
      note: 'FVG bullish 2647–2652 ditembus body close di 2645 (candle 13), jadi zonanya berbalik jadi resisten. Harga naik kembali ke zona lalu ditolak. Entry SP 2649.5 (50% zona), SL 2654 di atas zona, TP 2640.5 (RR 1:2).'
    },
    {
      id: 'ifvg-bear', tab: 'Bearish → support', title: 'IFVG: FVG bearish tertembus, jadi support (LP)', valid: true,
      symbol: 'XAUUSD', tf: 'M15', candles: bear, meta: { breakAt: 13 },
      overlays: [
        { type: 'zone', kind: 'IFVG', i1: 7, i2: 21, labelI: 10, top: m(2647), bottom: m(2652), label: 'IFVG' },
        { type: 'text', i: 13, y: m(2638), text: 'Body close tembus', anchor: 'end' },
        { type: 'arrow', i: 18, y: LONG.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 18, i2: 21, entry: LONG.entry, sl: LONG.sl, tp: LONG.tp }
      ],
      note: 'FVG bearish 2648–2653 ditembus body close di 2655 (candle 13), jadi zonanya berbalik jadi support. Harga turun kembali ke zona lalu memantul. Entry LP 2650.5 (50% zona), SL 2646 di bawah zona, TP 2659.5 (RR 1:2).'
    },
    {
      id: 'ifvg-wick', tab: 'Belum valid', title: 'Hanya wick menembus, belum IFVG', valid: false,
      symbol: 'XAUUSD', tf: 'M15', candles: wick, meta: { wickAt: 13 },
      overlays: [
        { type: 'zone', kind: 'FVG', i1: 7, i2: 17, labelI: 10, top: 2652, bottom: 2647, label: 'FVG' },
        { type: 'text', i: 13, y: 2640, text: 'Wick saja, close di dalam', anchor: 'end' },
        { type: 'arrow', i: 14, y: SHORT.entry, label: 'Entry' },
        { type: 'position', side: 'short', i: 14, i2: 17, entry: SHORT.entry, sl: SHORT.sl, tp: SHORT.tp }
      ],
      note: 'Candle 13 hanya wick ke 2644.5 dan close di 2648, masih di dalam zona. Itu belum IFVG: FVG bullish-nya masih hidup. SP di 2649.5 melawan zona dan kena SL 2654.'
    }
  ];
})();
