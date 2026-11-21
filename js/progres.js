/* Progres belajar (localStorage 'vytrade.progress'). Logika murni, diuji di tests/validate.html.
   Bentuk data (skema 2): {v: 2, best: {catId: {score, total}}, hafal: {cardId: true}, opened: {cardId: true}}.
   Skema 1 (tanpa v dan opened) dimigrasi otomatis: best dan hafal dipertahankan, opened kosong. */
(function (global) {
  'use strict';

  var KEY = 'vytrade.progress';
  var SCHEMA = 2;

  function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function onlyTrue(o) {
    var out = {};
    if (isObj(o)) Object.keys(o).forEach(function (k) { if (o[k]) out[k] = true; });
    return out;
  }

  // Ubah data progres dari versi mana pun ke SCHEMA terbaru. null/undefined -> data kosong.
  // Bukan objek, atau versi lebih baru dari aplikasi -> null (tidak dikenali).
  function migrate(p) {
    if (p === null || p === undefined) return { v: SCHEMA, best: {}, hafal: {}, opened: {} };
    if (!isObj(p)) return null;
    var v = p.v === undefined ? 1 : p.v;
    if (typeof v !== 'number' || v > SCHEMA || v < 1) return null;
    return {
      v: SCHEMA,
      best: isObj(p.best) ? p.best : {},
      hafal: onlyTrue(p.hafal),
      opened: v >= 2 ? onlyTrue(p.opened) : {}
    };
  }

  function store(st) { return st || global.localStorage; }

  function load(st) {
    try {
      var m = migrate(JSON.parse(store(st).getItem(KEY) || 'null'));
      if (m) return m;
    } catch (e) { /* abaikan */ }
    return migrate(null);
  }
  function save(p, st) { try { store(st).setItem(KEY, JSON.stringify(p)); } catch (e) { /* abaikan */ } }

  /* ---------- Peta belajar ---------- */
  function levelIds(level) {
    var out = [];
    (level.sections || []).forEach(function (s) { s.ids.forEach(function (id) { out.push(id); }); });
    return out;
  }
  function allIds() {
    var out = [];
    global.LEVELS.forEach(function (l) { levelIds(l).forEach(function (id) { out.push(id); }); });
    return out;
  }

  // Tandai kartu sudah dibuka. Hanya id yang ada di peta belajar. Mengembalikan true kalau baru ditandai.
  function markOpened(id, st) {
    if (allIds().indexOf(id) < 0) return false;
    var p = load(st);
    if (p.opened[id]) return false;
    p.opened[id] = true;
    save(p, st);
    return true;
  }

  // Hitung progres satu level. Level tanpa kartu (Segera hadir): total 0, pct null.
  function levelStats(level, opened) {
    var ids = levelIds(level), done = ids.filter(function (id) { return opened && opened[id]; }).length;
    return { done: done, total: ids.length, pct: ids.length ? Math.round(done / ids.length * 100) : null };
  }

  global.VyProgres = {
    KEY: KEY, SCHEMA: SCHEMA, migrate: migrate, load: load, save: save, markOpened: markOpened,
    levelIds: levelIds, allIds: allIds, levelStats: levelStats
  };
})(window);
