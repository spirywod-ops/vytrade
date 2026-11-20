/* Tab Jurnal + cadangan JSON. Logika murni diekspor di VyJurnal (diuji di tests/validate.html);
   UI dibuat oleh VyJurnal.build(h) dari app.js. Data jurnal: localStorage 'vytrade.jurnal' = {v, entries}. */
(function (global) {
  'use strict';

  var KEYS = { jurnal: 'vytrade.jurnal', progress: 'vytrade.progress', setup: 'vytrade.setup' };
  var SCHEMA = 1;            // versi skema jurnal DAN file cadangan
  var APP = 'VyTrade';
  var PAIRS = ['XAUUSD', 'US30', 'NAS100', 'SPX500'];
  var TFS = ['1D', '4H', '1H', '30m', '15m', '5m', '1m'];
  var RESULTS = { open: 'Belum selesai', tp: 'TP', sl: 'SL', be: 'BE' };
  var CHK = { '': '—', valid: 'VALID', belum: 'BELUM' };

  function store() { return global.localStorage; }

  /* ---------- Hitung RR ---------- */
  // dir 'LP' (long) / 'SP' (short). Hasil: {rr, ok, msg}. ok=false kalau urutan harga tidak cocok dengan arah.
  function calcRR(dir, entry, sl, tp) {
    entry = +entry; sl = +sl; tp = +tp;
    if (![entry, sl, tp].every(isFinite) || !entry || !sl || !tp) return { rr: null, ok: false, msg: 'Isi entry, SL, dan TP.' };
    var risk = dir === 'SP' ? sl - entry : entry - sl;
    var reward = dir === 'SP' ? entry - tp : tp - entry;
    if (risk <= 0) return { rr: null, ok: false, msg: dir === 'SP' ? 'Untuk SP, SL harus di atas entry.' : 'Untuk LP, SL harus di bawah entry.' };
    if (reward <= 0) return { rr: null, ok: false, msg: dir === 'SP' ? 'Untuk SP, TP harus di bawah entry.' : 'Untuk LP, TP harus di atas entry.' };
    return { rr: reward / risk, ok: true, msg: '' };
  }

  function fmtRR(rr) { return rr == null ? '—' : '1:' + (Math.round(rr * 100) / 100); }

  /* ---------- Statistik ---------- */
  // R per setup: TP = +RR rencana, SL = -1, BE = 0. "Belum selesai" tidak dihitung.
  function rOf(e) {
    if (e.result === 'sl') return -1;
    if (e.result === 'be') return 0;
    if (e.result === 'tp') { var c = calcRR(e.dir, e.entry, e.sl, e.tp); return c.ok ? c.rr : 0; }
    return null;
  }

  function groupStats(list) {
    var closed = list.filter(function (e) { return rOf(e) !== null; });
    var wins = closed.filter(function (e) { return e.result === 'tp'; }).length;
    var total = closed.reduce(function (s, e) { return s + rOf(e); }, 0);
    return { count: list.length, closed: closed.length, wins: wins, winRate: closed.length ? wins / closed.length : null, totalR: Math.round(total * 100) / 100 };
  }

  function stats(entries) {
    var s = groupStats(entries);
    s.valid = groupStats(entries.filter(function (e) { return e.checklist === 'valid'; }));
    s.belum = groupStats(entries.filter(function (e) { return e.checklist === 'belum'; }));
    return s;
  }

  /* ---------- Penyimpanan jurnal ---------- */
  function cleanEntry(e) {
    if (!e || typeof e !== 'object') return null;
    return {
      id: typeof e.id === 'string' && e.id ? e.id : 'j' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      time: typeof e.time === 'string' ? e.time : '',
      pair: PAIRS.indexOf(e.pair) >= 0 ? e.pair : PAIRS[0],
      dir: e.dir === 'SP' ? 'SP' : 'LP',
      tfBias: TFS.indexOf(e.tfBias) >= 0 ? e.tfBias : '4H',
      tfEntry: TFS.indexOf(e.tfEntry) >= 0 ? e.tfEntry : '5m',
      entry: +e.entry || 0, sl: +e.sl || 0, tp: +e.tp || 0,
      result: RESULTS[e.result] ? e.result : 'open',
      checklist: e.checklist === 'valid' || e.checklist === 'belum' ? e.checklist : '',
      note: typeof e.note === 'string' ? e.note.slice(0, 500) : ''
    };
  }

  // Migrasi format lama ke SCHEMA terbaru. Baru ada versi 1; tambahkan langkah di sini kalau format berubah.
  function migrateJurnal(d) {
    if (!d || typeof d !== 'object' || !Array.isArray(d.entries)) return null;
    if (d.v !== SCHEMA) return null;
    return { v: SCHEMA, entries: d.entries.map(cleanEntry).filter(Boolean) };
  }

  function loadJurnal(st) {
    st = st || store();
    try {
      var m = migrateJurnal(JSON.parse(st.getItem(KEYS.jurnal) || 'null'));
      if (m) return m;
    } catch (e) { /* abaikan */ }
    return { v: SCHEMA, entries: [] };
  }
  function saveJurnal(j, st) { try { (st || store()).setItem(KEYS.jurnal, JSON.stringify(j)); } catch (e) { /* abaikan */ } }

  /* ---------- Cadangan ---------- */
  function readJSON(st, key) { try { return JSON.parse(st.getItem(key) || 'null'); } catch (e) { return null; } }

  function buildBackup(st, now) {
    st = st || store();
    return {
      app: APP, schema: SCHEMA, exportedAt: new Date(now || Date.now()).toISOString(),
      data: { jurnal: loadJurnal(st), progress: readJSON(st, KEYS.progress), setup: readJSON(st, KEYS.setup) }
    };
  }

  function summarize(b) {
    var p = b.data.progress || {}, s = b.data.setup || {};
    return {
      jurnal: b.data.jurnal.entries.length,
      kuis: Object.keys(p.best || {}).length,
      hafal: Object.keys(p.hafal || {}).length,
      checklist: Object.keys(s.checked || {}).filter(function (k) { return s.checked[k]; }).length
    };
  }

  // Validasi teks file impor. Hasil: {ok:false, error} atau {ok:true, backup, summary}.
  function validateBackup(text) {
    var b;
    try { b = JSON.parse(text); } catch (e) { return { ok: false, error: 'File rusak: bukan JSON yang valid.' }; }
    if (!b || typeof b !== 'object' || b.app !== APP || !b.data || typeof b.data !== 'object') return { ok: false, error: 'Bukan file cadangan VyTrade.' };
    if (b.schema !== SCHEMA) return { ok: false, error: 'Versi cadangan tidak cocok (file: ' + b.schema + ', aplikasi: ' + SCHEMA + ').' };
    var d = b.data, j = d.jurnal == null ? { v: SCHEMA, entries: [] } : migrateJurnal(d.jurnal);
    if (!j) return { ok: false, error: 'Data jurnal di file rusak.' };
    var p = d.progress == null ? null : d.progress, s = d.setup == null ? null : d.setup;
    if (p !== null && (typeof p !== 'object' || Array.isArray(p))) return { ok: false, error: 'Data progres di file rusak.' };
    if (s !== null && (typeof s !== 'object' || Array.isArray(s))) return { ok: false, error: 'Data checklist di file rusak.' };
    var clean = { app: APP, schema: SCHEMA, exportedAt: b.exportedAt, data: { jurnal: j, progress: p, setup: s } };
    var sum = summarize(clean);
    if (!sum.jurnal && !sum.kuis && !sum.hafal && !sum.checklist) return { ok: false, error: 'File cadangan kosong, tidak ada data untuk diimpor.' };
    return { ok: true, backup: clean, summary: sum };
  }

  // Timpa semua data dengan isi cadangan (yang sudah divalidasi).
  function applyBackup(b, st) {
    st = st || store();
    saveJurnal(b.data.jurnal, st);
    [['progress', KEYS.progress], ['setup', KEYS.setup]].forEach(function (x) {
      if (b.data[x[0]] === null) st.removeItem(x[1]); else st.setItem(x[1], JSON.stringify(b.data[x[0]]));
    });
  }

  /* ---------- Waktu ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function localInput(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function dateStamp(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  /* ---------- UI ---------- */
  function build(h) {
    function field(label, ctrl) { return h('label', { class: 'fld' }, [h('span', { class: 'small muted', text: label }), ctrl]); }
    function select(opts, val) {
      var s = h('select', null, opts.map(function (o) { return h('option', { value: o[0], text: o[1] }); }));
      s.value = val; return s;
    }
    function num() { return h('input', { type: 'number', inputmode: 'decimal', step: 'any' }); }
    function pairs(list) { return list.map(function (x) { return [x, x]; }); }
    function fmtTime(t) { return t ? t.replace('T', ' ') : '—'; }

    function view() {
      var root = h('section', null, [h('h1', { text: 'Jurnal' })]);
      var editing = null;
      var statBox = h('div', { class: 'card', id: 'stat' });
      var listBox = h('div', { id: 'daftar' });
      var formCard = h('div', { class: 'card', id: 'form' });
      var msgBox = h('p', { class: 'small', id: 'cad-msg', role: 'status' });
      var importBox = h('div', { id: 'impor-box' });

      /* --- Form --- */
      var fTime = h('input', { type: 'datetime-local' });
      var fPair = select(pairs(PAIRS), PAIRS[0]);
      var fDir = select([['LP', 'LP (Long)'], ['SP', 'SP (Short)']], 'LP');
      var fBias = select(pairs(TFS), '4H');
      var fEnt = select(pairs(TFS), '5m');
      var fEntry = num(), fSL = num(), fTP = num();
      var fRes = select(Object.keys(RESULTS).map(function (k) { return [k, RESULTS[k]]; }), 'open');
      var fChk = select(Object.keys(CHK).map(function (k) { return [k, k ? CHK[k] : 'Tidak dicatat']; }), '');
      var fNote = h('textarea', { rows: '2', maxlength: '500', placeholder: 'Catatan singkat' });
      var rrBox = h('p', { class: 'rr', id: 'rr', role: 'status' });
      var formTitle = h('h3', { text: 'Catat setup' });
      var btnSave = h('button', { type: 'button', class: 'btn', id: 'simpan', text: 'Simpan' });
      var btnCancel = h('button', { type: 'button', class: 'btn ghost', id: 'batal', text: 'Batal edit', hidden: 'hidden' });
      var btnFromSetup = h('button', { type: 'button', class: 'btn ghost', id: 'dari-setup', text: 'Ambil dari tab Setup' });
      var chkHint = h('p', { class: 'small muted', id: 'chk-hint' });

      function updRR() {
        var c = calcRR(fDir.value, fEntry.value, fSL.value, fTP.value);
        rrBox.className = 'rr';
        if (!c.ok) { rrBox.textContent = 'RR: ' + c.msg; rrBox.classList.add('muted'); return; }
        rrBox.textContent = 'RR ' + fmtRR(c.rr);
        if (c.rr < 2 - 1e-9) { rrBox.textContent += ' — di bawah 1:2, aturan minimal belum terpenuhi.'; rrBox.classList.add('warn'); }
      }
      [fDir, fEntry, fSL, fTP].forEach(function (x) { x.addEventListener('input', updRR); x.addEventListener('change', updRR); });

      btnFromSetup.addEventListener('click', function () {
        var st = readJSON(store(), KEYS.setup) || {};
        var dirKey = st.dir === 'buy' ? 'buy' : st.dir === 'sell' ? 'sell' : null;
        if (!dirKey) { chkHint.textContent = 'Tab Setup belum diisi (arah belum dipilih).'; return; }
        var r = global.VySetup.evaluate(dirKey, st.checked || {});
        fChk.value = r.status === 'VALID' ? 'valid' : 'belum';
        fDir.value = dirKey === 'buy' ? 'LP' : 'SP';
        chkHint.textContent = 'Status Setup: ' + r.status + (r.status === 'BELUM' ? ' (kurang ' + r.missing.length + ' syarat wajib).' : '.');
        updRR();
      });

      function resetForm() {
        editing = null;
        fTime.value = localInput();
        fPair.value = PAIRS[0]; fDir.value = 'LP'; fBias.value = '4H'; fEnt.value = '5m';
        fEntry.value = ''; fSL.value = ''; fTP.value = ''; fRes.value = 'open'; fChk.value = ''; fNote.value = '';
        formTitle.textContent = 'Catat setup'; btnSave.textContent = 'Simpan'; btnCancel.setAttribute('hidden', 'hidden');
        chkHint.textContent = '';
        updRR();
      }

      function startEdit(e) {
        editing = e.id;
        fTime.value = e.time; fPair.value = e.pair; fDir.value = e.dir; fBias.value = e.tfBias; fEnt.value = e.tfEntry;
        fEntry.value = e.entry; fSL.value = e.sl; fTP.value = e.tp; fRes.value = e.result; fChk.value = e.checklist; fNote.value = e.note;
        formTitle.textContent = 'Edit setup'; btnSave.textContent = 'Simpan perubahan'; btnCancel.removeAttribute('hidden');
        chkHint.textContent = '';
        updRR();
        if (formCard.scrollIntoView) formCard.scrollIntoView();
      }

      btnCancel.addEventListener('click', resetForm);
      btnSave.addEventListener('click', function () {
        var c = calcRR(fDir.value, fEntry.value, fSL.value, fTP.value);
        if (!c.ok) { rrBox.textContent = 'Belum bisa disimpan. ' + c.msg; rrBox.className = 'rr warn'; return; }
        var j = loadJurnal();
        var e = cleanEntry({
          id: editing, time: fTime.value || localInput(), pair: fPair.value, dir: fDir.value, tfBias: fBias.value, tfEntry: fEnt.value,
          entry: fEntry.value, sl: fSL.value, tp: fTP.value, result: fRes.value, checklist: fChk.value, note: fNote.value
        });
        if (editing) j.entries = j.entries.map(function (x) { return x.id === editing ? e : x; });
        else j.entries.push(e);
        saveJurnal(j);
        resetForm();
        refresh();
      });

      formCard.appendChild(formTitle);
      [field('Tanggal dan jam', fTime), field('Pair', fPair), field('Arah', fDir), field('TF bias', fBias), field('TF entry', fEnt),
       field('Entry', fEntry), field('SL', fSL), field('TP', fTP)].forEach(function (x) { formCard.appendChild(x); });
      formCard.appendChild(rrBox);
      formCard.appendChild(field('Hasil', fRes));
      formCard.appendChild(field('Checklist terpenuhi', fChk));
      formCard.appendChild(btnFromSetup);
      formCard.appendChild(chkHint);
      formCard.appendChild(field('Catatan', fNote));
      formCard.appendChild(btnSave);
      formCard.appendChild(btnCancel);

      /* --- Statistik + daftar --- */
      function pct(x) { return x == null ? '—' : Math.round(x * 100) + '%'; }
      function rTxt(x) { return (x > 0 ? '+' : '') + x + 'R'; }

      function refresh() {
        var list = loadJurnal().entries.slice().sort(function (a, b) { return a.time < b.time ? 1 : a.time > b.time ? -1 : 0; });
        var s = stats(list);
        statBox.innerHTML = '';
        statBox.appendChild(h('h3', { text: 'Statistik' }));
        [['Jumlah setup', s.count + ' (' + s.closed + ' selesai)'], ['Win rate', pct(s.winRate)], ['Total R', rTxt(s.totalR)]].forEach(function (r) {
          statBox.appendChild(h('div', { class: 'row' }, [h('span', { class: 'small', text: r[0] }), h('strong', { text: r[1] })]));
        });
        statBox.appendChild(h('h3', { text: 'Checklist VALID vs BELUM' }));
        [['VALID', s.valid], ['BELUM', s.belum]].forEach(function (g) {
          statBox.appendChild(h('div', { class: 'row' }, [
            h('span', { class: 'small', text: g[0] + ' (' + g[1].count + ' setup)' }),
            h('strong', { text: 'win ' + pct(g[1].winRate) + ' · ' + rTxt(g[1].totalR) })
          ]));
        });
        statBox.appendChild(h('p', { class: 'small muted', text: 'TP dihitung +RR rencana, SL -1R, BE 0R. Setup belum selesai tidak dihitung.' }));

        listBox.innerHTML = '';
        listBox.appendChild(h('h2', { text: 'Daftar jurnal' }));
        if (!list.length) listBox.appendChild(h('p', { class: 'muted', text: 'Belum ada catatan.' }));
        list.forEach(function (e) {
          var c = calcRR(e.dir, e.entry, e.sl, e.tp);
          var bEdit = h('button', { type: 'button', class: 'btn ghost jr-edit', text: 'Edit' });
          var bDel = h('button', { type: 'button', class: 'btn ghost danger-txt jr-del', text: 'Hapus' });
          bEdit.addEventListener('click', function () { startEdit(e); });
          bDel.addEventListener('click', function () {
            if (!global.confirm('Hapus catatan ini? Tidak bisa dikembalikan.')) return;
            var j = loadJurnal(); j.entries = j.entries.filter(function (x) { return x.id !== e.id; }); saveJurnal(j);
            if (editing === e.id) resetForm();
            refresh();
          });
          listBox.appendChild(h('article', { class: 'card jr' }, [
            h('div', { class: 'ex-head' }, [
              h('h3', { text: e.pair + ' · ' + e.dir }),
              h('span', { class: 'badge ' + (e.result === 'tp' ? 'ok' : e.result === 'sl' ? 'bad' : 'info'), text: RESULTS[e.result] })
            ]),
            h('p', { class: 'small muted', text: fmtTime(e.time) + ' · bias ' + e.tfBias + ' · entry ' + e.tfEntry }),
            h('p', { class: 'small', text: 'Entry ' + e.entry + ' · SL ' + e.sl + ' · TP ' + e.tp + ' · RR ' + fmtRR(c.rr) + ' · Checklist ' + CHK[e.checklist] }),
            e.note ? h('p', { class: 'small', text: e.note }) : null,
            h('div', { class: 'jr-act' }, [bEdit, bDel])
          ]));
        });
      }

      /* --- Cadangan --- */
      var bExport = h('button', { type: 'button', class: 'btn', id: 'ekspor', text: 'Ekspor cadangan' });
      var fileIn = h('input', { type: 'file', accept: '.json,application/json', id: 'impor-file', hidden: 'hidden' });
      var bImport = h('button', { type: 'button', class: 'btn ghost', id: 'impor', text: 'Impor cadangan' });

      bExport.addEventListener('click', function () {
        var text = JSON.stringify(buildBackup(), null, 2), name = 'vytrade-cadangan-' + dateStamp() + '.json';
        var file = null;
        try { file = new global.File([text], name, { type: 'application/json' }); } catch (e) { /* tanpa File */ }
        if (file && global.navigator.canShare && global.navigator.canShare({ files: [file] })) {
          global.navigator.share({ files: [file], title: 'Cadangan VyTrade' })
            .then(function () { msgBox.textContent = 'Cadangan dibagikan.'; })
            .catch(function (e) { msgBox.textContent = e && e.name === 'AbortError' ? 'Ekspor dibatalkan.' : 'Gagal membagikan: ' + (e && e.message); });
          return;
        }
        var url = global.URL.createObjectURL(new global.Blob([text], { type: 'application/json' }));
        var a = h('a', { href: url, download: name });
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { global.URL.revokeObjectURL(url); }, 1000);
        msgBox.textContent = 'File ' + name + ' diunduh.';
      });

      bImport.addEventListener('click', function () { fileIn.value = ''; fileIn.click(); });
      fileIn.addEventListener('change', function () {
        var f = fileIn.files && fileIn.files[0];
        if (f) f.text().then(showImport).catch(function () { showImport(''); });
      });

      function showImport(text) {
        importBox.innerHTML = '';
        var r = validateBackup(text);
        if (!r.ok) { msgBox.textContent = 'Impor gagal. ' + r.error; return; }
        var s = r.summary;
        msgBox.textContent = '';
        var yes = h('button', { type: 'button', class: 'btn danger', id: 'impor-ya', text: 'Timpa data saya' });
        var no = h('button', { type: 'button', class: 'btn ghost', id: 'impor-tidak', text: 'Batal' });
        yes.addEventListener('click', function () {
          applyBackup(r.backup);
          importBox.innerHTML = '';
          msgBox.textContent = 'Impor selesai. Data lama sudah diganti.';
          refresh();
        });
        no.addEventListener('click', function () { importBox.innerHTML = ''; msgBox.textContent = 'Impor dibatalkan.'; });
        importBox.appendChild(h('div', { class: 'card', id: 'impor-ringkas' }, [
          h('h3', { text: 'File valid. Isi cadangan:' }),
          h('p', { class: 'small', text: s.jurnal + ' catatan jurnal · ' + s.kuis + ' kategori kuis · ' + s.hafal + ' kartu hafal · ' + s.checklist + ' centang checklist.' }),
          h('p', { class: 'small', text: 'Data yang ada sekarang akan DITIMPA. Lanjutkan?' }),
          yes, no
        ]));
      }

      var cadCard = h('div', { class: 'card' }, [
        h('h3', { text: 'Cadangan data' }),
        h('p', { class: 'small', text: 'Data hanya ada di perangkat ini. Ekspor cadangan secara berkala, terutama sebelum menghapus data Safari.' }),
        bExport, h('div', { class: 'gap' }), bImport, fileIn, msgBox, importBox
      ]);

      root.appendChild(statBox);
      root.appendChild(formCard);
      root.appendChild(listBox);
      root.appendChild(cadCard);
      resetForm();
      refresh();
      return root;
    }
    return { view: view };
  }

  global.VyJurnal = {
    KEYS: KEYS, SCHEMA: SCHEMA, PAIRS: PAIRS, calcRR: calcRR, stats: stats, rOf: rOf, cleanEntry: cleanEntry,
    loadJurnal: loadJurnal, saveJurnal: saveJurnal, buildBackup: buildBackup, validateBackup: validateBackup,
    applyBackup: applyBackup, build: build
  };
})(window);
