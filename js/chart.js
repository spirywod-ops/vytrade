/* VyChart: render candlestick SVG dari data OHLC {o,h,l,c} + overlay.
   Overlay (array `overlays` di spec), koordinat pakai index candle (i) dan harga (y):
   - zone:     {type:'zone', kind:'FVG'|'IFVG'|'OB'|'OFF', i1, i2, top, bottom, label, labelI (opsional: index candle tempat label)}
   - position: {type:'position', side:'long'|'short', i, i2, entry, sl, tp}  (kotak TP hijau, SL merah, label LP/SP)
   - line:     {type:'line', i1, i2, y, label, color, dash, pos:'above'|'below', labelAt:'start'}   (level BOS/CHoCH, dll)
   - arrow:    {type:'arrow', i, y, label}                    (panah entry, menunjuk ke kanan)
   - text:     {type:'text', i, y, dy, text, anchor}
*/
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var W = 360, H = 250;
  var PAD = { l: 6, r: 46, t: 26, b: 18 };
  var COLORS = { FVG: '#2f7bf6', IFVG: '#9b5de5', OB: '#f59e0b', OFF: '#8a919c', TP: '#1f9d55', SL: '#e04848', LINE: '#8a919c' };

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function niceStep(range) {
    var raw = range / 5;
    var pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var f = raw / pow;
    var m = f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10;
    return m * pow;
  }

  function fmt(p) {
    return (Math.round(p * 100) / 100).toString();
  }

  /* Deteksi FVG sesuai definisi baku:
     bullish: low candle ke-3 > high candle ke-1 (zona = high c1 .. low c3)
     bearish: high candle ke-3 < low candle ke-1 (zona = high c3 .. low c1)
     breached: ada body close berlawanan melewati sisi jauh zona setelah candle ke-3. */
  function detectFVG(cs) {
    var out = [];
    for (var i = 0; i + 2 < cs.length; i++) {
      var a = cs[i], c = cs[i + 2], z = null;
      if (c.l > a.h) z = { dir: 'bull', bottom: a.h, top: c.l };
      else if (c.h < a.l) z = { dir: 'bear', top: a.l, bottom: c.h };
      if (!z) continue;
      z.i1 = i; z.i3 = i + 2; z.breached = false; z.breachIndex = -1;
      for (var k = i + 3; k < cs.length; k++) {
        var close = cs[k].c;
        if ((z.dir === 'bull' && close < z.bottom) || (z.dir === 'bear' && close > z.top)) {
          z.breached = true; z.breachIndex = k; break;
        }
      }
      out.push(z);
    }
    return out;
  }

  function render(container, spec) {
    var cs = spec.candles, n = cs.length, ovs = spec.overlays || [];
    var plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b;
    var step = plotW / n, bw = Math.max(3, step * 0.58);

    var hi = -Infinity, lo = Infinity;
    cs.forEach(function (c) { hi = Math.max(hi, c.h); lo = Math.min(lo, c.l); });
    ovs.forEach(function (o) {
      [o.top, o.bottom, o.y, o.entry, o.sl, o.tp].forEach(function (v) {
        if (typeof v === 'number') { hi = Math.max(hi, v); lo = Math.min(lo, v); }
      });
    });
    var padv = (hi - lo) * 0.05;
    hi += padv; lo -= padv;

    function x(i) { return PAD.l + (i + 0.5) * step; }
    function y(p) { return PAD.t + (hi - p) / (hi - lo) * plotH; }

    var svg = el('svg', {
      viewBox: '0 0 ' + W + ' ' + H, 'class': 'chart ov-off', role: 'img',
      'aria-label': (spec.title || 'Chart') + ' - ' + spec.symbol + ' ' + spec.tf
    });

    // grid + sumbu harga
    var g0 = el('g', null, svg);
    var st = niceStep(hi - lo);
    for (var p = Math.ceil(lo / st) * st; p < hi; p += st) {
      el('line', { x1: PAD.l, x2: W - PAD.r, y1: y(p), y2: y(p), 'class': 'grid' }, g0);
      var t = el('text', { x: W - PAD.r + 4, y: y(p) + 3, 'class': 't-axis' }, g0);
      t.textContent = fmt(p);
    }

    // zona (di belakang candle)
    var gz = el('g', { 'class': 'ov' }, svg);
    ovs.forEach(function (o) {
      if (o.type !== 'zone') return;
      var col = COLORS[o.kind] || COLORS.OFF;
      var x1 = x(o.i1) - step / 2, x2 = Math.min(W - PAD.r, x(o.i2) + step / 2);
      el('rect', {
        x: x1, y: y(o.top), width: x2 - x1, height: Math.max(1, y(o.bottom) - y(o.top)),
        fill: col, 'fill-opacity': 0.2, stroke: col, 'stroke-width': 1, 'stroke-dasharray': '3 2'
      }, gz);
      var lx = typeof o.labelI === 'number' ? x(o.labelI) - step / 2 + 3 : x1 + 3;
      var lt = el('text', { x: lx, y: y(o.top) + 10, 'class': 't-label', fill: col }, gz);
      lt.textContent = o.label || o.kind;
    });

    // candle
    var gc = el('g', null, svg);
    cs.forEach(function (c, i) {
      var up = c.c >= c.o, cls = up ? 'up' : 'dn';
      el('line', { x1: x(i), x2: x(i), y1: y(c.h), y2: y(c.l), 'class': 'wick ' + cls }, gc);
      var top = y(Math.max(c.o, c.c)), bot = y(Math.min(c.o, c.c));
      el('rect', { x: x(i) - bw / 2, y: top, width: bw, height: Math.max(1, bot - top), 'class': 'body ' + cls }, gc);
    });

    // anotasi (di atas candle)
    var ga = el('g', { 'class': 'ov' }, svg);
    ovs.forEach(function (o) {
      var tx;
      if (o.type === 'position') {
        var x1 = x(o.i) - step / 2, x2 = Math.min(W - PAD.r, x(o.i2) + step / 2), w = x2 - x1;
        var long = o.side === 'long';
        el('rect', { x: x1, y: Math.min(y(o.entry), y(o.tp)), width: w, height: Math.abs(y(o.tp) - y(o.entry)), fill: COLORS.TP, 'fill-opacity': 0.22, stroke: COLORS.TP, 'stroke-width': 0.8 }, ga);
        el('rect', { x: x1, y: Math.min(y(o.entry), y(o.sl)), width: w, height: Math.abs(y(o.sl) - y(o.entry)), fill: COLORS.SL, 'fill-opacity': 0.22, stroke: COLORS.SL, 'stroke-width': 0.8 }, ga);
        el('line', { x1: x1, x2: x2, y1: y(o.entry), y2: y(o.entry), stroke: 'currentColor', 'stroke-width': 1, 'class': 'entry-line' }, ga);
        tx = el('text', { x: x1 + 3, y: y(o.entry) + (long ? -3 : 9), 'class': 't-label', fill: long ? COLORS.TP : COLORS.SL }, ga);
        tx.textContent = long ? 'LP' : 'SP';
        tx = el('text', { x: x2 - 3, y: y(o.tp) + (long ? 9 : -3), 'text-anchor': 'end', 'class': 't-small', fill: COLORS.TP }, ga);
        tx.textContent = 'TP ' + fmt(o.tp);
        tx = el('text', { x: x2 - 3, y: y(o.sl) + (long ? -3 : 9), 'text-anchor': 'end', 'class': 't-small', fill: COLORS.SL }, ga);
        tx.textContent = 'SL ' + fmt(o.sl);
      } else if (o.type === 'line') {
        var lc = o.color || COLORS.LINE;
        el('line', { x1: x(o.i1), x2: x(o.i2), y1: y(o.y), y2: y(o.y), stroke: lc, 'stroke-width': 1, 'stroke-dasharray': o.dash === false ? '' : '4 3' }, ga);
        if (o.label) {
          // pos: 'above' (default) | 'below' = label di atas/bawah garis; labelAt: 'start' = di ujung kiri garis.
          var atStart = o.labelAt === 'start';
          tx = el('text', {
            x: atStart ? x(o.i1) : x(o.i2), y: y(o.y) + (o.pos === 'below' ? 11 : -3),
            'text-anchor': atStart ? 'start' : 'end', 'class': 't-label', fill: lc
          }, ga);
          tx.textContent = o.label;
        }
      } else if (o.type === 'arrow') {
        var ax = x(o.i) - step * 0.7, ay = y(o.y);
        el('line', { x1: ax - 26, x2: ax - 3, y1: ay, y2: ay, 'class': 'arrow', 'stroke-width': 1.6 }, ga);
        el('path', { d: 'M' + ax + ' ' + ay + ' l-6 -3.5 l0 7 z', 'class': 'arrow-head' }, ga);
        if (o.label) {
          tx = el('text', { x: ax - 26, y: ay - 4, 'class': 't-label' }, ga);
          tx.textContent = o.label;
        }
      } else if (o.type === 'text') {
        tx = el('text', { x: x(o.i), y: y(o.y) + (o.dy || 0), 'text-anchor': o.anchor || 'middle', 'class': 't-label' }, ga);
        tx.textContent = o.text;
      }
    });

    // label pojok
    var tf = el('text', { x: PAD.l + 2, y: 15, 'class': 't-corner' }, svg);
    tf.textContent = spec.symbol + ' · ' + spec.tf;
    var il = el('text', { x: W - 6, y: H - 5, 'text-anchor': 'end', 'class': 't-ilus' }, svg);
    il.textContent = 'Ilustrasi';

    container.appendChild(svg);
    return {
      svg: svg,
      setOverlay: function (on) { svg.classList.toggle('ov-off', !on); },
      isOverlayOn: function () { return !svg.classList.contains('ov-off'); }
    };
  }

  global.VyChart = { render: render, detectFVG: detectFVG };
})(window);
