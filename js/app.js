/* VyTrade: router + tampilan. Konten ada di data/*.js */
(function () {
  'use strict';

  var view = document.getElementById('view');

  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  function setTab(name) {
    var links = document.querySelectorAll('#tabbar a');
    for (var i = 0; i < links.length; i++) {
      var on = links[i].getAttribute('data-tab') === name;
      links[i].classList.toggle('active', on);
      if (on) links[i].setAttribute('aria-current', 'page'); else links[i].removeAttribute('aria-current');
    }
  }

  function comingSoon(title, desc) {
    return h('section', null, [
      h('h1', { text: title }),
      h('div', { class: 'card soon' }, [
        h('p', { class: 'big', text: 'Segera hadir' }),
        h('p', { class: 'muted', text: desc })
      ])
    ]);
  }

  function viewBelajar() {
    var root = h('section', null, [
      h('div', { class: 'hero' }, [
        h('h1', { class: 'brand', text: 'VyTrade' }),
        h('p', { class: 'muted', text: 'Belajar trading XAUUSD dan indeks, dari dasar sampai lanjut.' }),
        h('p', { class: 'disclaimer', text: 'Edukasi, bukan saran keuangan.' })
      ])
    ]);
    window.GROUPS.forEach(function (g) {
      var items = window.CONCEPTS.filter(function (c) { return c.group === g; });
      root.appendChild(h('h2', { text: g }));
      if (g === 'Top-down') {
        root.appendChild(h('a', { class: 'card link', href: '#/belajar/topdown' }, [
          h('span', { text: 'Cara baca top-down (1D → 1m)' }),
          h('span', { class: 'chev', 'aria-hidden': 'true', text: '›' })
        ]));
        return;
      }
      if (!items.length) {
        root.appendChild(h('p', { class: 'muted soon-row', text: 'Segera hadir' }));
        return;
      }
      items.forEach(function (c) {
        root.appendChild(h('a', { class: 'card link', href: '#/belajar/' + c.id }, [
          h('span', { text: c.title }),
          h('span', { class: 'chev', 'aria-hidden': 'true', text: '›' })
        ]));
      });
    });
    return root;
  }

  function exampleBlock(ex) {
    var box = h('div', { class: 'chart-box' });
    var chart = window.VyChart.render(box, ex);
    var btn = h('button', { type: 'button', class: 'btn', 'aria-pressed': 'false', text: 'Tampilkan zona' });
    btn.addEventListener('click', function () {
      var on = !chart.isOverlayOn();
      chart.setOverlay(on);
      btn.textContent = on ? 'Sembunyikan zona' : 'Tampilkan zona';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    // valid true/false = VALID / BELUM VALID; tanpa `valid` (contoh anatomi) = badge netral.
    var bcls = ex.valid === true ? 'ok' : ex.valid === false ? 'bad' : 'info';
    var btxt = ex.valid === true ? 'VALID' : ex.valid === false ? 'BELUM VALID' : (ex.badge || 'CONTOH');
    return h('article', { class: 'card ex' }, [
      h('div', { class: 'ex-head' }, [
        h('h3', { text: ex.title }),
        h('span', { class: 'badge ' + bcls, text: btxt })
      ]),
      h('p', { class: 'muted small', text: ex.hint || 'Coba tebak dulu di mana zonanya, lalu tekan tombol.' }),
      box, btn,
      h('p', { class: 'note', text: ex.note })
    ]);
  }

  function viewKonsep(id) {
    var c = window.CONCEPTS.filter(function (x) { return x.id === id; })[0];
    if (!c) return h('section', null, [h('a', { href: '#/belajar', class: 'back', text: '‹ Belajar' }), h('p', { text: 'Materi tidak ditemukan.' })]);
    var root = h('section', null, [
      h('a', { href: '#/belajar', class: 'back', text: '‹ Belajar' }),
      h('h1', { text: c.title })
    ]);
    var card = h('div', { class: 'card' });
    [['Apa itu', c.apa], ['Cara melihat', c.cara], ['Syarat valid', c.syarat], ['Kesalahan umum', c.salah]].forEach(function (p) {
      card.appendChild(h('h3', { text: p[0] }));
      card.appendChild(h('p', { text: p[1] }));
    });
    root.appendChild(card);
    root.appendChild(h('h2', { text: 'Contoh chart' }));
    (window.EXAMPLES[c.examples] || []).forEach(function (ex) { root.appendChild(exampleBlock(ex)); });
    if (c.pilih && window.PILIH) {
      root.appendChild(h('h2', { text: window.PILIH.judul }));
      root.appendChild(h('div', { class: 'card' }, [h('p', { text: window.PILIH.teks })]));
    }
    return root;
  }

  /* ---------- Top-down ---------- */
  function viewTopdown(sc, tfId) {
    var T = window.TOPDOWN;
    if (!T.scenarios[sc]) sc = 'bull';
    var steps = T.scenarios[sc].steps;
    var idx = 0;
    steps.forEach(function (s, i) { if (s.id === tfId) idx = i; });
    var st = steps[idx];
    function href(scn, i) { return '#/belajar/topdown/' + scn + '/' + steps[i].id; }

    var root = h('section', null, [
      h('a', { href: '#/belajar', class: 'back', text: '‹ Belajar' }),
      h('h1', { text: 'Top-down 1D → 1m' }),
      h('p', { class: 'muted', text: T.intro })
    ]);

    var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Skenario' });
    Object.keys(T.scenarios).forEach(function (k) {
      seg.appendChild(h('a', { href: href(k, idx), class: 'seg-btn' + (k === sc ? ' on' : ''), 'aria-current': k === sc ? 'true' : 'false', text: T.scenarios[k].label }));
    });
    root.appendChild(seg);

    var chips = h('nav', { class: 'chips', 'aria-label': 'Langkah TF' });
    steps.forEach(function (s, i) {
      chips.appendChild(h('a', { href: href(sc, i), class: 'chip' + (i === idx ? ' on' : '') + (i < idx ? ' done' : ''), 'aria-current': i === idx ? 'step' : 'false', text: s.label }));
    });
    root.appendChild(chips);

    var art = exampleBlock({
      title: 'Langkah ' + (idx + 1) + '/' + steps.length + ' · ' + st.label + ' · ' + st.title,
      badge: st.label, symbol: st.symbol, tf: st.tf, candles: st.candles, overlays: st.overlays, note: st.sebab,
      hint: idx === 0 ? 'Lihat arah candle dulu, lalu tekan tombol untuk melihat zonanya.' : 'Tebak dulu di mana zona kerja TF ini, lalu tekan tombol.'
    });
    art.appendChild(h('p', { class: 'vs small', text: st.vs }));
    if (st.penutup) art.appendChild(h('p', { class: 'penutup', text: st.penutup }));
    root.appendChild(art);

    var nav = h('div', { class: 'pager' });
    nav.appendChild(idx > 0 ? h('a', { href: href(sc, idx - 1), class: 'btn ghost', text: '‹ ' + steps[idx - 1].label }) : h('span'));
    nav.appendChild(idx < steps.length - 1
      ? h('a', { href: href(sc, idx + 1), class: 'btn', text: steps[idx + 1].label + ' ›' })
      : h('a', { href: '#/setup', class: 'btn', text: 'Cek checklist setup ›' }));
    root.appendChild(nav);
    return root;
  }

  /* ---------- Setup (checklist + waktu) ---------- */
  var SETUP_KEY = 'vytrade.setup';
  var cleanup = null;

  function loadSetup() {
    try {
      var v = JSON.parse(localStorage.getItem(SETUP_KEY) || 'null');
      if (v && typeof v === 'object') return { dir: v.dir === 'buy' || v.dir === 'sell' ? v.dir : null, checked: v.checked || {} };
    } catch (e) { /* abaikan */ }
    return { dir: null, checked: {} };
  }
  function saveSetup(st) { try { localStorage.setItem(SETUP_KEY, JSON.stringify(st)); } catch (e) { /* abaikan */ } }

  function viewSetup() {
    var S = window.SETUP, VS = window.VySetup, st = loadSetup();
    var statusBox = h('div', { class: 'card status', role: 'status', 'aria-live': 'polite' });
    var root = h('section', null, [h('h1', { text: 'Checklist setup' })]);

    function renderStatus() {
      var r = VS.evaluate(st.dir, st.checked);
      statusBox.innerHTML = '';
      var cls = r.status === 'VALID' ? 'ok' : r.status === 'BELUM' ? 'bad' : 'info';
      statusBox.appendChild(h('div', { class: 'ex-head' }, [
        h('span', { class: 'status-big ' + cls, text: r.status === 'ARAH' ? 'PILIH ARAH' : r.status }),
        h('span', { class: 'muted small', text: 'Bonus ' + r.bonusDone + '/' + r.bonusTotal })
      ]));
      if (r.missing.length) {
        statusBox.appendChild(h('p', { class: 'small', text: 'Syarat yang kurang:' }));
        statusBox.appendChild(h('ul', { class: 'missing' }, r.missing.map(function (m) { return h('li', { text: m.text }); })));
      }
      statusBox.appendChild(h('p', { class: 'note', text: 'Langkah berikutnya: ' + r.next }));
    }

    var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Arah entry' });
    var dirBtns = {}, boxes = {}, labels = {};
    [['buy', 'Buy (LP)'], ['sell', 'Sell (SP)']].forEach(function (d) {
      var b = h('button', { type: 'button', class: 'seg-btn', text: d[1], 'aria-pressed': 'false' });
      b.addEventListener('click', function () { st.dir = d[0]; saveSetup(st); sync(); });
      dirBtns[d[0]] = b; seg.appendChild(b);
    });

    function check(item, text) {
      var cb = h('input', { type: 'checkbox' });
      cb.addEventListener('change', function () {
        if (cb.checked) st.checked[item.id] = true; else delete st.checked[item.id];
        saveSetup(st); renderStatus();
      });
      boxes[item.id] = cb;
      labels[item.id] = h('span', { text: text });
      return h('label', { class: 'check' }, [cb, labels[item.id]]);
    }
    function sync() {
      ['buy', 'sell'].forEach(function (k) {
        dirBtns[k].classList.toggle('on', st.dir === k);
        dirBtns[k].setAttribute('aria-pressed', st.dir === k ? 'true' : 'false');
      });
      S.bonus.forEach(function (b) {
        if (typeof b.text === 'object') labels[b.id].textContent = b.text[st.dir === 'sell' ? 'sell' : 'buy'];
      });
      renderStatus();
    }

    root.appendChild(h('h2', { text: '1. Arah entry' }));
    root.appendChild(seg);
    root.appendChild(h('h2', { text: 'Status' }));
    root.appendChild(statusBox);
    root.appendChild(h('h2', { text: '2. Syarat wajib (semua)' }));
    var reqCard = h('div', { class: 'card checks' });
    S.required.forEach(function (r) { reqCard.appendChild(check(r, r.text)); });
    root.appendChild(reqCard);
    root.appendChild(h('h2', { text: 'Bonus (tidak wajib)' }));
    var bonCard = h('div', { class: 'card checks' });
    S.bonus.forEach(function (b) { bonCard.appendChild(check(b, typeof b.text === 'object' ? b.text.buy : b.text)); });
    root.appendChild(bonCard);

    var reset = h('button', { type: 'button', class: 'btn ghost', id: 'reset', text: 'Reset' });
    reset.addEventListener('click', function () {
      st.dir = null; st.checked = {}; saveSetup(st);
      Object.keys(boxes).forEach(function (k) { boxes[k].checked = false; });
      sync();
    });
    root.appendChild(reset);

    Object.keys(st.checked).forEach(function (k) { if (boxes[k]) boxes[k].checked = true; });
    sync();

    root.appendChild(h('h2', { text: 'Candle close berikutnya' }));
    var clock = h('div', { class: 'card' }), cdEls = {};
    [['M15', 15], ['M5', 5], ['M1', 1]].forEach(function (t) {
      var big = h('span', { class: 'cd', text: '--:--' }), at = h('span', { class: 'muted small', text: '' });
      cdEls[t[0]] = { big: big, at: at, min: t[1] };
      clock.appendChild(h('div', { class: 'row' }, [h('span', { class: 'tfname', text: t[0] }), at, big]));
    });
    root.appendChild(clock);
    root.appendChild(h('h2', { text: 'Sesi (WIB)' }));
    var sesBox = h('div', { class: 'card' });
    root.appendChild(sesBox);
    root.appendChild(h('h2', { text: 'Aturan waktu' }));
    root.appendChild(h('div', { class: 'card' }, S.aturanWaktu.map(function (t) { return h('p', { class: 'small', text: '• ' + t }); })));

    function tick() {
      var now = Date.now();
      Object.keys(cdEls).forEach(function (k) {
        var e = cdEls[k], nc = VS.nextClose(now, e.min);
        e.big.textContent = VS.fmtCountdown(nc - now);
        e.at.textContent = 'close ' + VS.hhmm(nc, 'Asia/Jakarta') + ' WIB';
      });
      sesBox.innerHTML = '';
      VS.sessions(now).forEach(function (s) {
        sesBox.appendChild(h('div', { class: 'row' }, [
          h('span', { class: 'tfname', text: s.name }),
          h('span', { class: 'muted small', text: s.wib }),
          h('span', { class: 'pill' + (s.state === 'aktif' ? ' on' : ''), text: VS.STATE_TEXT[s.state] })
        ]));
      });
      var ov = VS.overlap(now);
      if (ov) sesBox.appendChild(h('p', { class: 'small muted', text: 'Overlap London + New York: ' + ov }));
    }
    tick();
    var timer = setInterval(tick, 1000);
    cleanup = function () { clearInterval(timer); };
    return root;
  }

  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    var parts = (location.hash || '#/belajar').replace(/^#\/?/, '').split('/');
    var tab = parts[0] || 'belajar', node;
    if (tab === 'belajar') node = parts[1] === 'topdown' ? viewTopdown(parts[2], parts[3]) : parts[1] ? viewKonsep(parts[1]) : viewBelajar();
    else if (tab === 'latihan') node = comingSoon('Latihan', 'Kuis pilihan ganda, benar/salah, dan tebak zona di chart.');
    else if (tab === 'setup') node = viewSetup();
    else if (tab === 'jurnal') node = comingSoon('Jurnal', 'Catat setup dan hasil, plus ekspor/impor cadangan JSON.');
    else { location.replace('#/belajar'); return; }
    setTab(tab);
    view.innerHTML = '';
    view.appendChild(node);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);
  route();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('SW gagal:', e); });
    });
  }
})();
