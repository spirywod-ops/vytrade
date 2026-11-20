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

  function route() {
    var parts = (location.hash || '#/belajar').replace(/^#\/?/, '').split('/');
    var tab = parts[0] || 'belajar', node;
    if (tab === 'belajar') node = parts[1] ? viewKonsep(parts[1]) : viewBelajar();
    else if (tab === 'latihan') node = comingSoon('Latihan', 'Kuis pilihan ganda, benar/salah, dan tebak zona di chart.');
    else if (tab === 'setup') node = comingSoon('Setup', 'Checklist setup: cek apakah setup kamu VALID atau BELUM.');
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
