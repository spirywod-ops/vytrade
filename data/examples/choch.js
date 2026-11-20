/* Contoh CHoCH (Change of Character): body close menembus swing BERLAWANAN tren
   (LH terakhir saat downtrend, HL terakhir saat uptrend). Data buatan sendiri.
   - choch-bull : downtrend -> CHoCH bullish, entry LP di FVG.
   - choch-bear : uptrend -> CHoCH bearish, entry SP di OB.
   - choch-sweep: wick menembus LH tapi body tidak close = sweep, BUKAN CHoCH.
   Dicek oleh tests/validate.html (swing, titik tembus body close, zona FVG/OB, RR 1:2, hasil TP/SL). */
(function () {
  var V = window.VyData;
  var COL = '#d946ef';
  var mp = V.mp;

  /* ---------- 1) Bullish: downtrend + CHoCH + entry di FVG ---------- */
  var bull = V.head([
    [2657, .4, .6],        // 18  candle 1 FVG (high 2657.4)
    [2668, .6, .4],        // 19  impuls: body close > LH 2665.5 = CHoCH
    [2670, .8, 4],         // 20  candle 3 FVG (low 2664)
    [2666, .5, .5], [2662.5, .5, .5],   // 21-22 pullback
    [2661.5, .5, 1.5],     // 23 sentuh entry 2660.7 di dalam FVG
    [2665, .5, .5], [2668, .5, .5], [2671, .8, .5], [2674, .8, .5], [2672, .8, .8]  // 24-28 naik ke TP
  ]);
  var fvgTop = bull[20].l, fvgBot = bull[18].h;                 // 2664 dan 2657.4
  var bEntry = (fvgTop + fvgBot) / 2, bSl = fvgBot - 1.2;       // SL di bawah sisi jauh zona
  var bTp = bEntry + 2 * (bEntry - bSl);

  /* ---------- 2) Bearish: uptrend + CHoCH + entry di OB ---------- */
  // Dirancang sebagai bullish (OB = candle turun terakhir sebelum impuls naik), lalu dicermin.
  var bullOB = V.head([
    [2661, .6, .4],        // 18 impuls naik (up) menutup di atas high OB
    [2667, .5, .6],        // 19 body close > LH 2665.5 = CHoCH
    [2663, .5, 2],         // 20 pullback
    [2660, .5, .7],        // 21
    [2658, .5, 2],         // 22 sentuh entry (50% OB)
    [2662, .6, .6], [2666, .6, .6], [2670, .6, .6], [2672, .6, .6]  // 23-26
  ]);
  var bear = V.mirror(bullOB);
  var obTop = bear[17].h, obBot = bear[17].l;                   // bear[17] = candle naik terakhir (OB bearish)
  var sEntry = (obTop + obBot) / 2, sSl = obTop + 0.7;
  var sTp = sEntry - 2 * (sSl - sEntry);

  /* ---------- 3) Belum valid: wick sweep, body tidak close ---------- */
  var sweep = V.head([
    [2658, .5, .6], [2661, .6, .6],
    [2663.5, 3.5, .6],     // 20 wick naik ke 2667 (> LH 2665.5) tapi body close 2663.5 (< LH)
    [2660, .5, .6],        // 21
    [2656.5, .5, .6], [2652, .5, 1], [2649, .5, .6], [2646, .5, 1.5]   // 22-25 lanjut turun
  ]);
  var wEntry = 2662, wSl = 2658.5, wTp = wEntry + 2 * (wEntry - wSl);

  window.EXAMPLES = window.EXAMPLES || {};
  window.EXAMPLES.choch = [
    {
      id: 'choch-bull', title: 'CHoCH bullish (valid) + entry LP di FVG', valid: true,
      hint: 'Coba tebak dulu di mana CHoCH dan zona entrynya, lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: bull,
      overlays: [
        { type: 'text', i: 14, y: bull[14].h, dy: -4, text: 'LH' },
        { type: 'text', i: 17, y: bull[17].l, dy: 11, text: 'LL' },
        { type: 'zone', kind: 'FVG', i1: 18, i2: 24, top: fvgTop, bottom: fvgBot, label: 'FVG' },
        { type: 'line', i1: 14, i2: 19, y: bull[14].h, label: 'CHoCH', color: COL, pos: 'above', struct: { kind: 'CHoCH', dir: 'up' } },
        { type: 'arrow', i: 23, y: bEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 23, i2: 26, entry: bEntry, sl: bSl, tp: bTp }
      ],
      note: 'Downtrend (LH, LL). Candle ke-19 body close di atas LH terakhir (2665.5) = CHoCH bullish. Impuls itu meninggalkan FVG 2657.4–2664. Harga kembali ke FVG, lalu entry LP di 50% zona, SL di bawah zona, TP RR 1:2.'
    },
    {
      id: 'choch-bear', title: 'CHoCH bearish (valid) + entry SP di OB', valid: true,
      hint: 'Coba tebak dulu di mana CHoCH dan zona entrynya, lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: bear,
      overlays: [
        { type: 'text', i: 14, y: bear[14].l, dy: 11, text: 'HL' },
        { type: 'zone', kind: 'OB', i1: 17, i2: 23, top: obTop, bottom: obBot, label: 'OB' },
        { type: 'line', i1: 14, i2: 19, y: bear[14].l, label: 'CHoCH', color: COL, pos: 'below', struct: { kind: 'CHoCH', dir: 'down' } },
        { type: 'arrow', i: 22, y: sEntry, label: 'Entry' },
        { type: 'position', side: 'short', i: 22, i2: 24, entry: sEntry, sl: sSl, tp: sTp }
      ],
      note: 'Uptrend (HH, HL). Candle ke-19 body close di bawah HL terakhir (2634.5) = CHoCH bearish. Order block (OB) = candle naik terakhir sebelum turun kuat. Harga kembali ke OB, entry SP di 50% zona, SL di atas zona, TP RR 1:2.'
    },
    {
      id: 'choch-sweep', title: 'Wick tembus, body tidak close (sweep, bukan CHoCH)', valid: false,
      hint: 'Coba tebak dulu: apakah ini CHoCH? Lalu tekan tombol.',
      symbol: 'XAUUSD', tf: 'M15', candles: sweep,
      overlays: [
        { type: 'line', i1: 14, i2: 20, y: sweep[14].h, label: 'Level LH', color: COL, pos: 'above', labelAt: 'start', struct: { kind: 'sweep', dir: 'up' } },
        { type: 'text', i: 20.3, y: sweep[20].h, dy: -4, anchor: 'end', text: 'Sweep (wick)' },
        { type: 'arrow', i: 21, y: wEntry, label: 'Entry' },
        { type: 'position', side: 'long', i: 21, i2: 23, entry: wEntry, sl: wSl, tp: wTp }
      ],
      note: 'Wick candle ke-20 naik ke 2667 (di atas LH 2665.5), tapi body close hanya 2663.5. Itu sweep, bukan CHoCH. Entry LP 2662 salah: harga lanjut turun dan kena SL 2658.5.'
    }
  ];

  // BOS vs CHoCH: dua contoh bullish berdampingan (BOS = searah tren, CHoCH = berlawanan tren).
  window.EXAMPLES.bosvschoch = [window.EXAMPLES.bos[0], window.EXAMPLES.choch[0]];
})();
