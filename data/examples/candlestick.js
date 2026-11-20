/* Contoh Dasar: anatomi candlestick (data buatan sendiri, bergaya XAUUSD).
   Ini contoh anatomi, bukan setup, jadi tanpa entry/SL/TP. Divalidasi: OHLC konsisten. */
(function () {
  var walk = window.VyData.walk;

  // Contoh 1: candle naik (putih) dan turun (hitam).
  var c1 = walk(2648, [
    [2650, .8, .8], [2653, .8, .8], [2651.5, .8, 1], [2655.5, 1, 1.5], [2654, 1.2, .8],
    [2650, .8, 1.5], [2651.5, 1, 1], [2648.5, .8, 1.2], [2652, .8, 1], [2654.5, 1, .8]
  ]);

  // Contoh 2: body dan wick (wick panjang = harga ditolak).
  var c2 = walk(2650, [
    [2652, .8, .8], [2655, 1, 1], [2653.5, 3.5, .6], [2651, .8, .8],
    [2649.5, .6, 3.5], [2652, .8, .8], [2656, .8, .8], [2657, .6, .6]
  ]);

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.candlestick = [
    {
      id: 'candle-naik-turun', title: 'Candle naik (putih) dan turun (hitam)', badge: 'CONTOH',
      hint: 'Coba tebak dulu mana candle naik dan mana yang turun, lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: c1,
      overlays: [
        { type: 'text', i: 3, y: c1[3].l, dy: 11, text: 'Naik: close > open' },
        { type: 'text', i: 5, y: c1[5].l, dy: 11, text: 'Turun: close < open' },
        { type: 'text', i: 3, y: c1[3].h, dy: -4, text: 'High' },
        { type: 'text', i: 5, y: c1[5].h, dy: -4, text: 'High' }
      ],
      note: 'Candle putih: harga ditutup (close) lebih tinggi dari pembukaan (open). Candle hitam kebalikannya. Garis tipis di atas dan bawah body adalah wick.'
    },
    {
      id: 'candle-body-wick', title: 'Body dan wick', badge: 'CONTOH',
      hint: 'Coba tebak dulu bagian body dan wick, lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: c2,
      overlays: [
        { type: 'text', i: 2, y: c2[2].h, dy: -4, text: 'Wick atas panjang' },
        { type: 'text', i: 4, y: c2[4].l, dy: 11, text: 'Wick bawah panjang' },
        { type: 'text', i: 5.6, y: (c2[6].o + c2[6].c) / 2, dy: 3, anchor: 'end', text: 'Body' }
      ],
      note: 'Body = jarak open ke close. Wick = harga yang sempat dikunjungi lalu ditolak. Wick atas panjang berarti penjual menolak harga naik; wick bawah panjang berarti pembeli menolak harga turun.'
    }
  ];
})();
