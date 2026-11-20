/* Top-down 1D -> 1m (data buatan sendiri, bergaya XAUUSD). Ditulis SEKALI untuk skenario bullish (entry LP),
   skenario bearish dibuat otomatis dengan mencerminkan harga (5300 - harga), teks, dan overlay.
   Rantai zona (tiap zona di dalam zona sebelumnya), dicek oleh tests/validate.html:
   1D FVG [2630-2660] > 4H OB [2641-2652] > 1H FVG [2644-2650] > 30m OB [2645-2649] > 5m FVG [2646.5-2648.5] > 1m OB [2646.6-2647.8]
   Entry 2647.2 (50% OB 1m), SL 2646.1, TP 2649.4 (RR 1:2).
   Token teks: <kata> = kata bergantung arah; [a-b] = rentang harga; {p} = satu harga (dicerminkan di bearish). */
(function () {
  var V = window.VyData, r2 = V.r2, mir = V.mp;
  var SYM = 'XAUUSD';

  function hi(cs, i) { return cs[i].h; }
  function lo(cs, i) { return cs[i].l; }

  // ---------- 1D ----------
  var d1 = V.walk(2400, [
    [2412, 5, 5], [2406, 4, 5], [2422, 5, 5], [2436, 5, 4], [2428, 4, 6], [2444, 5, 5], [2460, 6, 4], [2450, 4, 6],
    [2442, 4, 7], [2458, 5, 4], [2476, 6, 4], [2494, 6, 5], [2486, 4, 6], [2500, 5, 5], [2520, 6, 4], [2540, 6, 4],
    [2532, 4, 6], [2548, 5, 5], [2570, 6, 4], [2606, 8, 4], [2622, 8, 4], [2672, 5, 3], [2688, 4, 12], [2704, 5, 4],
    [2722, 6, 4], [2712, 4, 6], [2698, 4, 6], [2706, 5, 5], [2688, 4, 8], [2674, 4, 6], [2680, 5, 6], [2664, 4, 8],
    [2654, 3, 6]
  ]);
  var Z1D = { kind: 'FVG', top: 2660, bottom: 2630, i1: 20 };

  // ---------- 4H ----------
  var h4 = V.walk(2560, [
    [2568, 3, 3], [2576, 3, 3], [2584, 3, 3], [2592, 4, 3], [2586, 2, 4], [2580, 2, 4], [2584, 2, 3], [2594, 2, 3],
    [2602, 3, 3], [2596, 2, 4], [2590, 2, 4], [2600, 2, 3],
    [2606, 3, 3], [2614, 3, 3], [2610, 3, 4], [2624, 3, 3], [2636, 3, 3], [2648, 4, 3], [2654, 2, 3], [2650, 1, 3],
    [2646, 1, 3], [2650, 2, 3], [2643, 2, 2], [2654, 1, 1], [2662, 2, 1], [2672, 2, 2], [2682, 3, 2], [2694, 3, 2],
    [2704, 3, 3], [2696, 2, 4], [2688, 2, 4], [2680, 2, 4], [2672, 2, 4], [2666, 2, 4], [2660, 2, 4], [2656, 2, 4],
    [2650, 2, 4], [2654, 3, 3], [2651, 2, 3]
  ]);
  var Z4H = { kind: 'OB', top: 2652, bottom: 2641, i1: 22 };

  // ---------- 1H ----------
  var h1 = V.walk(2688, [
    [2692, 2, 2], [2698, 3, 2], [2690, 2, 3], [2684, 2, 3],
    [2678, 2, 2], [2684, 3, 2], [2676, 2, 3], [2670, 2, 3], [2674, 3, 2], [2666, 2, 3], [2660, 2, 3], [2662, 2, 2],
    [2656, 1, 3], [2652, 1, 2], [2655, 2, 2], [2650, 1, 3], [2645, 1, 2], [2642.5, 1, 1], [2643.5, .5, 1],
    [2655, 1, .5], [2660, 1, 5], [2664, 1, 2], [2662, 2, 2], [2658, 1, 2], [2659, 2, 2], [2655, 1, 2], [2652, 1, 2],
    [2653, 2, 2], [2650.5, 1, 1.5], [2649, 1, 1.5], [2651, 1.5, 1.5], [2649.2, 1, 1.5]
  ]);
  var Z1H = { kind: 'FVG', top: 2650, bottom: 2644, i1: 18 };

  // ---------- 30m ----------
  var m30 = V.walk(2664, [
    [2660, 1, 2], [2656, 1, 2], [2652, 1, 2], [2655, 1, 1], [2658, 1.5, 1], [2655, 1, 1], [2652, 1, 1.5], [2651, 1, 1],
    [2649.5, .5, 1], [2648.5, .5, .5], [2646, .5, 1], [2650, .5, .5], [2661, 1, .5], [2662, 1, 1], [2660, 1.5, 1],
    [2664, .8, 1.5], [2662, 1, 1.5], [2659, 1, 2], [2661, 1.5, 1.5], [2657, 1, 2], [2654, 1, 2], [2656, 1.5, 1.5],
    [2653, 1, 2], [2651, 1, 2], [2653, 1.5, 1.5], [2651, 1, 2], [2649.5, 1, 1.5], [2650.5, 1, 1.5], [2648.5, 1, 1.5],
    [2648, 1, 1.5]
  ]);
  var Z30 = { kind: 'OB', top: 2649, bottom: 2645, i1: 10 };

  // ---------- 15m ----------
  var m15 = V.walk(2672, [
    [2669, 1, 1], [2671, 1.5, 1], [2667, 1, 1.5], [2664, 1, 1.5], [2662.5, 1, 1],
    [2658, 1, 1], [2661, 1.5, 1], [2657, 1, 1.5], [2654, 1, 1.5], [2652, 1, 1.5], [2654, 1, 1], [2656, 1.5, 1],
    [2653, 1, 1.5], [2651, .8, 1.5], [2649, .5, 1.5], [2650, 1, .8], [2652, 1.5, .8], [2650.5, 1, 1.2], [2648, .8, 1.2],
    [2646.5, .5, 1.2], [2647.5, .8, .8], [2647, .5, 2.3], [2649, 1, .5], [2651, 1, .5], [2654, 1.5, .5], [2656, 1, 1],
    [2658, 1, 1], [2655.5, 1.5, 1.5], [2657, 1, 1], [2654, 1, 1.5], [2651, .8, 1.5]
  ]);
  // LH terakhir = candle 11+5 (high 2653.5), sweep di candle 16+5 (low 2644.7), CHoCH di candle 19+5.

  // ---------- 5m ----------
  var m5 = V.walk(2658, [
    [2656, 1, 1.5], [2658, 1.5, 1], [2654.5, 1, 1.5],
    [2651, 1, 1], [2653, 1.5, 1], [2650.5, 1, 1.5], [2649, .8, 1.2], [2650.5, 1, .8], [2648.5, .8, 1.2], [2647, .6, 1],
    [2648, .8, .8], [2645.8, .6, 1.1], [2646.2, .3, .5], [2652, .5, .3], [2654, .5, 3.5], [2657, 1, 1], [2656, 1.5, 1],
    [2658.5, 1, 1], [2657, 1, 1.5], [2655, 1, 1.5], [2656, 1.5, 1], [2653, 1, 1.5], [2654, 1.5, 1], [2651.5, 1, 1.5],
    [2652.5, 1.5, 1], [2650, 1, 1.5], [2651, 1.2, 1], [2649, .8, 1.5], [2649.8, 1, 1], [2648, .7, 1.5], [2647.8, .8, .5]
  ]);
  var Z5 = { kind: 'FVG', top: 2648.5, bottom: 2646.5, i1: 12 };

  // ---------- 1m ----------
  var m1 = V.walk(2651.4, [
    [2651, .2, .2], [2651.4, .3, .2], [2650.8, .2, .3], [2650.2, .2, .2],
    [2649.6, .2, .2], [2649.0, .2, .2], [2648.6, .2, .2], [2649.2, .3, .2], [2649.5, .4, .2], [2649.0, .2, .3],
    [2648.6, .2, .3], [2648.2, .2, .3], [2647.9, .2, .3], [2647.5, .2, .2], [2646.9, .3, .3], [2648.2, .2, .2],
    [2649.0, .2, .2], [2650.2, .3, .2], [2650.8, .3, .2], [2650.3, .2, .3], [2650.6, .3, .2], [2649.8, .2, .3],
    [2649.2, .2, .3], [2648.6, .2, .3], [2648.1, .2, .3], [2647.6, .2, .3], [2647.3, .2, .4], [2648.0, .2, .2],
    [2648.6, .2, .2], [2649.0, .3, .2], [2649.6, .3, .2], [2650.0, .3, .2]
  ]);
  var Z1 = { kind: 'OB', top: 2647.8, bottom: 2646.6, i1: 14 };
  var TRADE = { entry: 2647.2, sl: 2646.1, tp: r2(2647.2 + 2 * (2647.2 - 2646.1)), i: 26, i2: 31 };

  var CH = '#d946ef';
  function zone(z, label, i1, labelI) {
    return { type: 'zone', kind: z.kind, i1: i1 === undefined ? z.i1 : i1, i2: 60, top: z.top, bottom: z.bottom, label: label || z.kind, labelI: labelI };
  }

  // Langkah-langkah (bullish). `zone` = zona kerja TF itu (null kalau TF itu hanya konfirmasi).
  var STEPS = [
    {
      id: '1d', label: '1D', tf: 'D1', title: 'Bias besar', candles: d1, zone: Z1D,
      overlays: [
        zone(Z1D, 'FVG', undefined, 24),
        { type: 'text', i: 24, y: hi(d1, 24), dy: -4, text: 'HH' },
        { type: 'text', i: 8, y: lo(d1, 8), dy: 11, text: 'HL' }
      ],
      sebab: 'Karena 1D punya <hhhl>, bias besar <bias> dan kita hanya cari <buy>. Harga sedang koreksi ke <fvg> 1D [2630-2660], jadi itu area besar tempat kita menunggu.',
      vs: 'Dibanding TF lain: ini TF terbesar, jadi acuan untuk semua TF di bawahnya.'
    },
    {
      id: '4h', label: '4H', tf: 'H4', title: 'Struktur utama dan area kerja', candles: h4, zone: Z4H, breakAt: 24, levelIdx: 18,
      overlays: [
        zone(Z1D, '1D FVG', 0, 0),
        zone(Z4H, 'OB', undefined, 26),
        { type: 'line', i1: 18, i2: 24, y: 2656, label: 'BOS', color: CH, pos: 'above' }
      ],
      sebab: 'Karena bias 1D <bias>, di 4H kita cari struktur yang searah. Harga body close menembus <sw> (BOS) lalu meninggalkan <ob> [2641-2652] di dalam FVG 1D.',
      vs: 'Dibanding 1D: zona mengecil dari 30 poin ([2630-2660]) jadi 11 poin ([2641-2652]), masih di dalam zona 1D.'
    },
    {
      id: '1h', label: '1H', tf: 'H1', title: 'Konfirmasi bias, zona makin sempit', candles: h1, zone: Z1H,
      overlays: [
        zone(Z4H, '4H OB', 0, 0),
        zone(Z1H, 'FVG', undefined, 22)
      ],
      sebab: 'Karena harga sudah di area 4H, di 1H kita cek bias masih <bias>. Harga sempat <lawan> ke OB 4H lalu <naik> kuat dan meninggalkan <fvg> [2644-2650].',
      vs: 'Dibanding 4H: zona mengecil jadi 6 poin, tetap di dalam OB 4H [2641-2652].'
    },
    {
      id: '30m', label: '30m', tf: 'M30', title: 'Arah jangka pendek, pilih zona kerja', candles: m30, zone: Z30,
      overlays: [
        zone(Z1H, '1H FVG', 0, 0),
        zone(Z30, 'OB', undefined, 14)
      ],
      sebab: 'Karena 1H sudah memberi zona sempit, di 30m kita pilih satu zona kerja: <ob> [2645-2649] di dalam FVG 1H. Harga 30m turun kembali ke zona itu, jadi kita mulai pantau.',
      vs: 'Dibanding 1H: zona mengecil jadi 4 poin, tetap di dalam FVG 1H [2644-2650].'
    },
    {
      id: '15m', label: '15m', tf: 'M15', title: 'Tunggu konfirmasi', candles: m15, zone: null, breakAt: 24, levelIdx: 16, sweepIdx: 21,
      overlays: [
        zone(Z30, '30m OB', 0, 0),
        { type: 'line', i1: 16, i2: 24, y: 2653.5, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'text', i: 21, y: 2644.7, dy: 11, text: 'Sweep' }
      ],
      sebab: 'Karena harga sudah di zona kerja 30m, di 15m kita belum masuk: tunggu body close menembus <lh> terakhir {2653.5}. Harga sempat sweep <sweep> ke {2644.7}, lalu body close di atasnya = CHoCH.',
      vs: 'Dibanding 30m: 30m menentukan zona, 15m menentukan KAPAN boleh masuk. Tidak ada zona baru, hitung konfirmasi setelah candle 15m close.'
    },
    {
      id: '5m', label: '5m', tf: 'M5', title: 'Cari zona entry', candles: m5, zone: Z5,
      overlays: [
        zone(Z30, '30m OB', 0, 0),
        zone(Z5, 'FVG', undefined, 18),
        { type: 'text', i: 11, y: 2644.7, dy: 11, text: 'Sweep' }
      ],
      sebab: 'Karena CHoCH di 15m sudah terjadi, di 5m kita cari <fvg> untuk entry. Dorongan <naik> setelah sweep meninggalkan FVG [2646.5-2648.5], dan harga kembali ke sana.',
      vs: 'Dibanding 15m: sekarang ada zona entry sungguhan, lebarnya 2 poin dan masih di dalam OB 30m [2645-2649].'
    },
    {
      id: '1m', label: '1m', tf: 'M1', title: 'Presisi entry dan SL', candles: m1, zone: Z1, trade: TRADE, levelIdx: 8, breakAt: 17,
      overlays: [
        zone(Z5, '5m FVG', 0, 0),
        zone(Z1, 'OB', undefined, 20),
        { type: 'line', i1: 8, i2: 17, y: 2649.9, label: 'CHoCH', color: CH, pos: 'above' },
        { type: 'arrow', i: TRADE.i, y: TRADE.entry, label: 'Entry' },
        { type: 'position', side: 'long', i: TRADE.i, i2: TRADE.i2, entry: TRADE.entry, sl: TRADE.sl, tp: TRADE.tp }
      ],
      sebab: 'Karena harga sudah di FVG 5m, di 1m kita cari titik paling presisi: <ob> [2646.6-2647.8] setelah CHoCH kecil. Entry <pos> di 50% OB, SL di luar OB.',
      vs: 'Dibanding 5m: zona mengecil jadi 1.2 poin, jadi risiko cuma 1.1 poin dan TP 2.2 poin (RR 1:2).',
      penutup: 'Entry {2647.2} · SL {2646.1} · TP {2649.4} · RR 1:2'
    }
  ];

  var WORDS = {
    naik: ['naik', 'turun'], lawan: ['turun', 'naik'], bias: ['bullish', 'bearish'], hhhl: ['HH dan HL', 'LH dan LL'],
    buy: ['Buy', 'Sell'], pos: ['LP', 'SP'], fvg: ['FVG bullish', 'FVG bearish'], ob: ['OB bullish', 'OB bearish'],
    lh: ['LH', 'HL'], sweep: ['low', 'high'], sw: ['swing high', 'swing low']
  };

  function fill(s, side) {
    if (!s) return s;
    var k = side === 'bull' ? 0 : 1;
    function num(v) { return String(k ? mir(parseFloat(v)) : parseFloat(v)); }
    return s.replace(/<(\w+)>/g, function (m, w) { return WORDS[w][k]; })
      .replace(/\[([\d.]+)-([\d.]+)\]/g, function (m, a, b) {
        return k ? (mir(parseFloat(b)) + '–' + mir(parseFloat(a))) : (a + '–' + b);
      })
      .replace(/\{([\d.]+)\}/g, function (m, p) { return num(p); });
  }

  function mirrorZone(z) {
    return z && { kind: z.kind, top: mir(z.bottom), bottom: mir(z.top), i1: z.i1 };
  }

  function mirrorOverlay(o) {
    var c = {};
    for (var key in o) c[key] = o[key];
    ['y', 'entry', 'sl', 'tp'].forEach(function (f) { if (typeof o[f] === 'number') c[f] = mir(o[f]); });
    if (o.type === 'zone') { c.top = mir(o.bottom); c.bottom = mir(o.top); }
    if (o.type === 'position') c.side = o.side === 'long' ? 'short' : 'long';
    if (o.type === 'line') c.pos = o.pos === 'below' ? 'above' : 'below';
    if (o.type === 'text') c.dy = -(o.dy || 0);
    return c;
  }

  function build(side) {
    var steps = STEPS.map(function (s) {
      var bull = side === 'bull';
      var t = s.trade;
      return {
        id: s.id, label: s.label, symbol: SYM, tf: s.tf, title: s.title, side: side,
        candles: bull ? s.candles : V.mirror(s.candles),
        overlays: bull ? s.overlays : s.overlays.map(mirrorOverlay),
        zone: bull ? s.zone : mirrorZone(s.zone),
        trade: !t ? null : {
          entry: bull ? t.entry : mir(t.entry), sl: bull ? t.sl : mir(t.sl), tp: bull ? t.tp : mir(t.tp), i: t.i, i2: t.i2
        },
        breakAt: s.breakAt, levelIdx: s.levelIdx, sweepIdx: s.sweepIdx,
        sebab: fill(s.sebab, side), vs: fill(s.vs, side), penutup: fill(s.penutup, side)
      };
    });
    return steps;
  }

  window.TOPDOWN = {
    intro: 'Mulai dari TF terbesar, lalu turun satu per satu. TF besar menentukan ARAH, TF kecil menentukan TITIK MASUK. Kalau TF besar dan kecil bertentangan, tunggu atau ikut TF besar.',
    scenarios: {
      bull: { label: 'Bullish · LP', steps: build('bull') },
      bear: { label: 'Bearish · SP', steps: build('bear') }
    }
  };
})();
