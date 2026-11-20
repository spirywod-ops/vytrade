/* Contoh Liquidity sweep: wick melewati equal high/low lalu CLOSE KEMBALI ke dalam. Data buatan sendiri.
   - liq-bull : EQL (dua low sejajar) disapu wick, close kembali di atas -> CHoCH -> entry LP di FVG.
   - liq-bear : cermin (EQH disapu, close kembali di bawah) -> entry SP.
   - liq-bos  : body close menembus EQL dan BERTAHAN = BOS, bukan sweep -> LP kena SL.
   Dicek oleh tests/validate.html (deteksi EQH/EQL + sweep, CHoCH, FVG, RR 1:2, hasil TP/SL).
   meta: {kind:'sweep'|'break', side:'low'|'high', i1, i2 (dua swing yang sejajar), j (candle sweep/tembus), level}. */
(function () {
  var V = window.VyData, m = V.mp, r2 = V.r2;
  var CH = '#d946ef', SW = '#f97316';
  function f(v) { return String(r2(v)); }

  // Lanjutan V.head (downtrend, LH 14 = 2665.5, LL 17 = 2653.5). [close, wickAtas, wickBawah]
  var base = [
    [2658, .5, .6], [2661, .5, .6],
    [2663.5, 1, .5],       // 20 LH terakhir (high 2664.5)
    [2660, .5, .6], [2656.5, .5, .6],
    [2655, .4, 1.6],       // 23 low kedua (2653.4) sejajar low candle 17 (2653.5) = EQL
    [2657, .5, .6], [2656, .5, .6]
  ];
  var bull = V.head(base.concat([
    [2654.2, .4, 2.4],     // 26 sweep: wick turun ke 2651.8, close 2654.2 (kembali di atas EQL)
    [2658, .4, .4],        // 27 candle 1 FVG (high 2658.4)
    [2666.5, .5, .2],      // 28 impuls: body close > LH 2664.5 = CHoCH
    [2668, .8, 1.8],       // 29 candle 3 FVG (low 2664.7)
    [2665, .5, .9],
    [2661.3, .4, 1.2],     // 31 sentuh entry 2661.55 di dalam FVG
    [2665, .5, .5], [2669, .6, .5], [2672, .8, .5], [2675, .8, .5], [2674, .8, .8]
  ]));
  var bear = V.mirror(bull);

  var bos = V.head(base.concat([
    [2652.3, .4, 1.0],     // 26 body close di bawah EQL 2653.4 (wick bawah 2651.3)
    [2652.9, .5, .5],      // 27 naik tipis ke 2653.4 (retest dari bawah), tetap close di bawah level
    [2649.5, .4, .8], [2646, .4, .8], [2643, .4, .8], [2640, .4, .8], [2638, .4, .8]
  ]));

  var EQL = Math.min(bull[17].l, bull[23].l);                     // 2653.4
  var LH = bull[20].h;                                            // 2664.5
  var fvgBot = bull[27].h, fvgTop = bull[29].l;                   // 2658.4 dan 2664.7
  var entry = (fvgTop + fvgBot) / 2, sl = fvgBot - 1.2, tp = entry + 2 * (entry - sl);
  var bEntry = EQL, bSl = 2650.4, bTp = bEntry + 2 * (bEntry - bSl);

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.liquidity = [
    {
      id: 'liq-bull', tab: 'Bullish', title: 'Sweep di bawah EQL lalu naik (valid) + entry LP', valid: true,
      hint: 'Cari dua low yang sejajar, lalu tebak candle mana yang menyapunya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bull,
      meta: { kind: 'sweep', side: 'low', i1: 17, i2: 23, j: 26, level: EQL },
      overlays: [
        { type: 'line', i1: 17, i2: 28, y: EQL, label: 'EQL', color: SW, pos: 'below', labelAt: 'start' },
        { type: 'mark', i: 26, y: bull[26].l, label: 'Sweep', color: SW, pos: 'below' },
        { type: 'line', i1: 20, i2: 28, y: LH, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'zone', kind: 'FVG', i1: 27, i2: 35, top: fvgTop, bottom: fvgBot, label: 'FVG', labelPos: 'above' },
        { type: 'arrow', i: 31, y: entry, label: 'Entry' },
        { type: 'position', side: 'long', i: 31, i2: 35, entry: entry, sl: sl, tp: tp }
      ],
      note: 'Dua low sejajar di ' + f(EQL) + ' (EQL) jadi target liquidity. Candle ke-26 wick turun ke ' + f(bull[26].l) + ' lalu close ' + f(bull[26].c) + ', kembali di atas EQL = sweep. Candle ke-28 body close di atas LH ' + f(LH) + ' (CHoCH); entry LP di 50% FVG ' + f(entry) + ', SL ' + f(sl) + ' di bawah zona, TP ' + f(tp) + ' (RR 1:2).'
    },
    {
      id: 'liq-bear', tab: 'Bearish', title: 'Sweep di atas EQH lalu turun (valid) + entry SP', valid: true,
      hint: 'Cari dua high yang sejajar, lalu tebak candle mana yang menyapunya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bear,
      meta: { kind: 'sweep', side: 'high', i1: 17, i2: 23, j: 26, level: m(EQL) },
      overlays: [
        { type: 'line', i1: 17, i2: 28, y: m(EQL), label: 'EQH', color: SW, pos: 'above', labelAt: 'start' },
        { type: 'mark', i: 26, y: bear[26].h, label: 'Sweep', color: SW, pos: 'above' },
        { type: 'line', i1: 20, i2: 28, y: m(LH), label: 'CHoCH', color: CH, pos: 'below' },
        { type: 'zone', kind: 'FVG', i1: 27, i2: 35, top: m(fvgBot), bottom: m(fvgTop), label: 'FVG', labelPos: 'above' },
        { type: 'arrow', i: 31, y: m(entry), label: 'Entry' },
        { type: 'position', side: 'short', i: 31, i2: 35, entry: m(entry), sl: m(sl), tp: m(tp) }
      ],
      note: 'Dua high sejajar di ' + f(m(EQL)) + ' (EQH). Candle ke-26 wick naik ke ' + f(bear[26].h) + ' lalu close ' + f(bear[26].c) + ', kembali di bawah EQH = sweep. Candle ke-28 body close di bawah HL ' + f(m(LH)) + ' (CHoCH); entry SP di 50% FVG ' + f(m(entry)) + ', SL ' + f(m(sl)) + ' di atas zona, TP ' + f(m(tp)) + ' (RR 1:2).'
    },
    {
      id: 'liq-bos', tab: 'Belum valid', title: 'Body close menembus EQL dan bertahan (BOS, bukan sweep)', valid: false,
      hint: 'Tebak dulu: ini sweep atau bukan? Perhatikan body-nya.',
      symbol: 'XAUUSD', tf: 'M15', candles: bos,
      meta: { kind: 'break', side: 'low', i1: 17, i2: 23, j: 26, level: EQL },
      overlays: [
        { type: 'line', i1: 17, i2: 29, y: EQL, label: 'EQL', color: SW, pos: 'above', labelAt: 'start' },
        { type: 'text', i: 26, y: bos[26].l, dy: 12, text: 'BOS (body close)' },
        { type: 'arrow', i: 27, y: bEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 27, i2: 30, entry: bEntry, sl: bSl, tp: bTp }
      ],
      note: 'Candle ke-26 body close di ' + f(bos[26].c) + ', di bawah EQL ' + f(EQL) + ', dan harga tidak kembali di atasnya. Itu BOS searah downtrend, bukan sweep. Buy di ' + f(bEntry) + ' (anggap sweep) salah: harga lanjut turun dan kena SL ' + f(bSl) + '.'
    }
  ];
})();
