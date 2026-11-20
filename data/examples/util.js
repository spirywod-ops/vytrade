/* Pembantu untuk menyusun data candle contoh (dipakai file data/examples/*.js).
   walk(awal, langkah): tiap langkah [close, wickAtas, wickBawah]; open = close candle sebelumnya.
   mirror(candles): cermin harga di sekitar 2650 (5300 - harga) -> contoh bullish jadi bearish. */
(function () {
  function r2(v) { return Math.round(v * 100) / 100; }

  function walk(start, moves) {
    var prev = start;
    return moves.map(function (m) {
      var o = prev, c = m[0];
      prev = c;
      return { o: r2(o), h: r2(Math.max(o, c) + m[1]), l: r2(Math.min(o, c) - m[2]), c: r2(c) };
    });
  }

  function mp(p) { return r2(5300 - p); }

  function mirror(cs) {
    return cs.map(function (c) { return { o: mp(c.o), h: mp(c.l), l: mp(c.h), c: mp(c.c) }; });
  }

  // Awal downtrend yang dipakai contoh struktur (candle 0-17). Swing high: 2, 8, 14 (LH).
  // Swing low: 5, 11, 17 (LL). Langkah = [close, wickAtas, wickBawah], mulai di 2660.
  var HEAD_START = 2660;
  var HEAD = [
    [2663, .6, .6], [2666, .6, .6], [2669, 1.5, .6], [2666, .5, .6], [2663, .5, .6], [2661, .5, 1.5],
    [2663, .6, .6], [2665, .6, .6], [2666, 1.5, .6], [2663, .5, .6], [2660, .5, .6], [2657.5, .5, 1.5],
    [2660, .6, .6], [2662.5, .6, .6], [2664, 1.5, .6], [2661.5, .5, .6], [2658.5, .5, .6], [2655, .5, 1.5]
  ];
  function head(tail) { return walk(HEAD_START, HEAD.concat(tail)); }

  window.VyData = { walk: walk, mirror: mirror, mp: mp, r2: r2, head: head };
})();
