/* Tab Latihan: kuis, flashcard, glosarium + progres (localStorage). Isi soal/kartu/istilah ada di data/*.js.
   Logika murni (progres, acak opsi, cari glosarium) diekspor di VyLatihan; UI dibuat oleh VyLatihan.build(h) dari app.js. */
(function (global) {
  'use strict';

  var KEY = 'vytrade.progress';

  /* ---------- Progres ---------- */
  // {best: {catId: {score, total}}, hafal: {cardId: true}}
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && typeof v === 'object') return { best: v.best || {}, hafal: v.hafal || {} };
    } catch (e) { /* abaikan */ }
    return { best: {}, hafal: {} };
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* abaikan */ } }

  // Skor baru menggantikan terbaik kalau persentasenya lebih tinggi. Kembalikan true kalau rekor baru.
  function recordBest(p, cat, score, total) {
    var b = p.best[cat];
    if (!b || score / total > b.score / b.total) { p.best[cat] = { score: score, total: total }; return true; }
    return false;
  }

  /* ---------- Kuis ---------- */
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function questionsOf(cat) { return global.QUIZ.filter(function (q) { return q.cat === cat; }); }

  // Opsi pilihan ganda diacak; tiap opsi menyimpan apakah benar. Benar/salah: urutan tetap.
  function prepare(q) {
    if (q.type === 'mc') {
      return shuffle(q.options.map(function (t, i) { return { text: t, correct: i === q.answer }; }));
    }
    if (q.type === 'tf') {
      return [{ text: 'Benar', correct: q.answer === true }, { text: 'Salah', correct: q.answer === false }];
    }
    return [];
  }

  /* ---------- Glosarium ---------- */
  function searchGlossary(query) {
    var s = (query || '').trim().toLowerCase();
    return global.GLOSSARY.filter(function (g) {
      return !s || g.t.toLowerCase().indexOf(s) >= 0 || g.arti.toLowerCase().indexOf(s) >= 0;
    });
  }

  // Tautan materi: id konsep -> rute. 'topdown' dan 'checklist' punya halaman sendiri.
  function linkOf(id) {
    if (!id) return null;
    if (id === 'topdown') return '#/belajar/topdown';
    if (id === 'checklist') return '#/setup';
    return '#/belajar/' + id;
  }

  /* ---------- UI ---------- */
  function build(h) {
    var base = '#/latihan';

    function back(href, text) { return h('a', { href: href, class: 'back', text: text }); }
    function menuLink(href, title, desc, extra) {
      return h('a', { class: 'card link', href: href }, [
        h('span', null, [h('span', { class: 'mt', text: title }), h('span', { class: 'muted small md', text: desc }), extra || null]),
        h('span', { class: 'chev', 'aria-hidden': 'true', text: '›' })
      ]);
    }
    function bestText(p, cat) {
      var b = p.best[cat];
      return b ? 'Terbaik ' + b.score + '/' + b.total : 'Belum dicoba';
    }

    /* ----- Beranda Latihan ----- */
    function home() {
      var p = load();
      var root = h('section', null, [h('h1', { text: 'Latihan' })]);

      var hafal = global.FLASHCARDS.filter(function (c) { return p.hafal[c.id]; }).length;
      var prog = h('div', { class: 'card', id: 'progres' }, [h('h3', { text: 'Progres' })]);
      global.QUIZ_CATS.forEach(function (c) {
        prog.appendChild(h('div', { class: 'row' }, [
          h('span', { class: 'tfname', text: c.title }),
          h('span', { class: 'muted small', text: bestText(p, c.id) })
        ]));
      });
      prog.appendChild(h('div', { class: 'row' }, [
        h('span', { class: 'tfname', text: 'Flashcard' }),
        h('span', { class: 'muted small', text: hafal + '/' + global.FLASHCARDS.length + ' hafal' })
      ]));
      var armed = false;
      var reset = h('button', { type: 'button', class: 'btn ghost', id: 'reset-progres', text: 'Reset progres' });
      reset.addEventListener('click', function () {
        if (!armed) {
          armed = true; reset.textContent = 'Yakin? Tekan lagi untuk menghapus'; reset.classList.add('danger');
          setTimeout(function () { armed = false; reset.textContent = 'Reset progres'; reset.classList.remove('danger'); }, 4000);
          return;
        }
        save({ best: {}, hafal: {} });
        global.location.hash = '#/latihan/x'; // paksa render ulang
        global.location.hash = base;
      });
      prog.appendChild(reset);
      root.appendChild(prog);

      root.appendChild(h('h2', { text: 'Menu' }));
      root.appendChild(menuLink(base + '/kuis', 'Kuis', 'Pilihan ganda, benar/salah, tebak zona di chart'));
      root.appendChild(menuLink(base + '/flashcard', 'Flashcard', 'Satu kartu per konsep. Yang belum hafal muncul lagi'));
      root.appendChild(menuLink(base + '/glosarium', 'Glosarium', global.GLOSSARY.length + ' istilah dengan pencarian'));
      return root;
    }

    /* ----- Pilih kategori kuis ----- */
    function kuisMenu() {
      var p = load();
      var root = h('section', null, [back(base, '‹ Latihan'), h('h1', { text: 'Kuis' }), h('p', { class: 'muted', text: 'Pilih kategori. Tiap soal ada penjelasan setelah dijawab.' })]);
      global.QUIZ_CATS.forEach(function (c) {
        var n = questionsOf(c.id).length;
        root.appendChild(menuLink(base + '/kuis/' + c.id, c.title, c.desc + ' · ' + n + ' soal · ' + bestText(p, c.id)));
      });
      return root;
    }

    /* ----- Sesi kuis ----- */
    function kuisSesi(catId) {
      var cat = global.QUIZ_CATS.filter(function (c) { return c.id === catId; })[0];
      if (!cat) return kuisMenu();
      var qs = shuffle(questionsOf(catId)), idx = 0, score = 0;
      var root = h('section', null, [back(base + '/kuis', '‹ Kategori'), h('h1', { text: 'Kuis ' + cat.title })]);
      var box = h('div', { id: 'quiz-box' });
      root.appendChild(box);

      function finish() {
        var p = load(), rekor = recordBest(p, catId, score, qs.length);
        save(p);
        box.innerHTML = '';
        box.appendChild(h('div', { class: 'card status', role: 'status' }, [
          h('p', { class: 'muted small', text: 'Skor akhir' }),
          h('p', { class: 'score', id: 'skor', text: score + '/' + qs.length }),
          h('p', { class: 'small', text: rekor ? 'Rekor baru untuk kategori ini!' : bestText(p, catId) })
        ]));
        var again = h('button', { type: 'button', class: 'btn', text: 'Ulangi kategori ini' });
        again.addEventListener('click', function () { qs = shuffle(questionsOf(catId)); idx = 0; score = 0; show(); });
        box.appendChild(again);
        box.appendChild(h('a', { href: base + '/kuis', class: 'btn ghost gap', text: 'Pilih kategori lain' }));
      }

      function show() {
        box.innerHTML = '';
        var q = qs[idx], done = false;
        var card = h('div', { class: 'card' }, [
          h('p', { class: 'muted small', text: 'Soal ' + (idx + 1) + '/' + qs.length + ' · skor ' + score }),
          h('p', { class: 'qtext', text: q.q })
        ]);
        var fb = h('div', { class: 'feedback', 'aria-live': 'polite' });

        function answered(ok) {
          done = true;
          if (ok) score++;
          fb.innerHTML = '';
          fb.appendChild(h('div', { class: 'card ' + (ok ? 'fb-ok' : 'fb-bad') }, [
            h('p', { class: 'fb-title', text: ok ? 'Benar' : 'Belum tepat' }),
            h('p', { class: 'small', text: q.expl })
          ]));
          var last = idx === qs.length - 1;
          var next = h('button', { type: 'button', class: 'btn', id: 'next', text: last ? 'Lihat skor' : 'Soal berikutnya' });
          next.addEventListener('click', function () { if (last) finish(); else { idx++; show(); } });
          fb.appendChild(next);
          next.focus();
        }

        if (q.type === 'zone') {
          var ex = null;
          Object.keys(global.EXAMPLES).forEach(function (k) {
            global.EXAMPLES[k].forEach(function (e) { if (e.id === q.ex) ex = e; });
          });
          // Hanya zona yang ditanya yang ditampilkan saat jawaban dibuka.
          var spec = {
            title: q.q, symbol: ex.symbol, tf: ex.tf, candles: ex.candles,
            overlays: (ex.overlays || []).filter(function (o) { return o.type === 'zone' && o.kind === q.zoneKind; })
          };
          var cbox = h('div', { class: 'chart-box tap' });
          var chart = global.VyChart.render(cbox, spec);
          card.appendChild(cbox);
          var hint = h('p', { class: 'muted small', text: 'Ketuk area ' + q.zoneKind + ' di chart.' });
          card.appendChild(hint);
          var skip = h('button', { type: 'button', class: 'btn ghost', id: 'skip', text: 'Menyerah, tunjukkan zona' });
          card.appendChild(skip);
          cbox.addEventListener('click', function (e) {
            if (done) return;
            var pt = chart.toSvg(e.clientX, e.clientY), ok = chart.hitZone(pt, q.zoneKind, 3);
            chart.setOverlay(true); chart.mark(pt, ok);
            skip.remove(); hint.textContent = ok ? 'Tepat di zona.' : 'Di luar zona. Zona yang benar sekarang ditampilkan.';
            answered(ok);
          });
          skip.addEventListener('click', function () {
            if (done) return;
            chart.setOverlay(true); skip.remove(); hint.textContent = 'Ini zona yang benar.';
            answered(false);
          });
        } else {
          var opts = h('div', { class: 'opts' });
          prepare(q).forEach(function (o) {
            var b = h('button', { type: 'button', class: 'opt', text: o.text });
            b.addEventListener('click', function () {
              if (done) return;
              Array.prototype.forEach.call(opts.children, function (x, i) { x.disabled = true; });
              b.classList.add(o.correct ? 'right' : 'wrong');
              if (!o.correct) Array.prototype.forEach.call(opts.children, function (x, i) {
                if (x.getAttribute('data-ok') === '1') x.classList.add('right');
              });
              answered(o.correct);
            });
            b.setAttribute('data-ok', o.correct ? '1' : '0');
            opts.appendChild(b);
          });
          card.appendChild(opts);
        }
        box.appendChild(card);
        box.appendChild(fb);
      }
      show();
      return root;
    }

    /* ----- Flashcard ----- */
    function flashcard() {
      var root = h('section', null, [back(base, '‹ Latihan'), h('h1', { text: 'Flashcard' })]);
      var box = h('div', { id: 'flash-box' });
      root.appendChild(box);
      var queue = null;

      function newQueue() {
        var p = load();
        queue = shuffle(global.FLASHCARDS.filter(function (c) { return !p.hafal[c.id]; }));
      }
      function show() {
        var p = load(), total = global.FLASHCARDS.length;
        var hafal = global.FLASHCARDS.filter(function (c) { return p.hafal[c.id]; }).length;
        box.innerHTML = '';
        if (!queue) newQueue();
        if (!queue.length) {
          box.appendChild(h('div', { class: 'card status' }, [
            h('p', { class: 'big', text: 'Semua kartu sudah hafal' }),
            h('p', { class: 'muted small', text: hafal + '/' + total + ' hafal. Mau mengulang dari awal?' })
          ]));
          var again = h('button', { type: 'button', class: 'btn', id: 'flash-ulang', text: 'Ulangi semua kartu' });
          again.addEventListener('click', function () { p.hafal = {}; save(p); queue = null; show(); });
          box.appendChild(again);
          return;
        }
        var c = queue[0], flipped = false;
        box.appendChild(h('p', { class: 'muted small', text: 'Sisa ' + queue.length + ' kartu · hafal ' + hafal + '/' + total }));
        var face = h('button', { type: 'button', class: 'flash', id: 'flash-card', 'aria-label': 'Balik kartu' }, [
          h('span', { class: 'flash-hint muted small', text: 'Ketuk untuk membalik' }),
          h('span', { class: 'flash-main', text: c.depan })
        ]);
        var actions = h('div', { class: 'pager', hidden: 'hidden' });
        var again = h('button', { type: 'button', class: 'btn ghost', id: 'flash-lagi', text: 'Ulangi' });
        var known = h('button', { type: 'button', class: 'btn', id: 'flash-hafal', text: 'Sudah hafal' });
        again.addEventListener('click', function () { queue.push(queue.shift()); show(); });
        known.addEventListener('click', function () {
          var pp = load(); pp.hafal[c.id] = true; save(pp); queue.shift(); show();
        });
        actions.appendChild(again); actions.appendChild(known);
        var materi = linkOf(c.id);
        face.addEventListener('click', function () {
          flipped = !flipped;
          face.innerHTML = '';
          if (flipped) {
            face.classList.add('back');
            face.appendChild(h('span', { class: 'flash-hint muted small', text: c.depan }));
            face.appendChild(h('span', { class: 'flash-arti', text: c.arti }));
            face.appendChild(h('span', { class: 'flash-syarat small', text: 'Syarat valid: ' + c.syarat }));
            actions.removeAttribute('hidden');
          } else {
            face.classList.remove('back');
            face.appendChild(h('span', { class: 'flash-hint muted small', text: 'Ketuk untuk membalik' }));
            face.appendChild(h('span', { class: 'flash-main', text: c.depan }));
          }
        });
        box.appendChild(face);
        box.appendChild(actions);
        if (materi) box.appendChild(h('a', { href: materi, class: 'back', text: 'Buka materi ›' }));
      }
      show();
      return root;
    }

    /* ----- Glosarium ----- */
    function glosarium() {
      var root = h('section', null, [back(base, '‹ Latihan'), h('h1', { text: 'Glosarium' })]);
      var input = h('input', { type: 'search', class: 'search', id: 'gl-cari', placeholder: 'Cari istilah (mis. FVG, wick, RR)', 'aria-label': 'Cari istilah', autocomplete: 'off' });
      var list = h('div', { id: 'gl-list' });
      root.appendChild(input);
      root.appendChild(list);
      function render() {
        var res = searchGlossary(input.value);
        list.innerHTML = '';
        if (!res.length) { list.appendChild(h('p', { class: 'muted', text: 'Tidak ada istilah yang cocok.' })); return; }
        res.forEach(function (g) {
          var href = linkOf(g.link);
          list.appendChild(h('div', { class: 'card gl' }, [
            h('h3', { text: g.t }),
            h('p', { text: g.arti }),
            href ? h('a', { href: href, class: 'gl-link', text: 'Lihat materi ›' }) : null
          ]));
        });
      }
      input.addEventListener('input', render);
      render();
      return root;
    }

    return {
      route: function (parts) {
        var sub = parts[1], arg = parts[2];
        if (sub === 'kuis') return arg ? kuisSesi(arg) : kuisMenu();
        if (sub === 'flashcard') return flashcard();
        if (sub === 'glosarium') return glosarium();
        return home();
      }
    };
  }

  global.VyLatihan = {
    KEY: KEY, load: load, save: save, recordBest: recordBest, shuffle: shuffle, questionsOf: questionsOf,
    prepare: prepare, searchGlossary: searchGlossary, linkOf: linkOf, build: build
  };
})(window);
