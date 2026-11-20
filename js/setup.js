/* Logika checklist setup + waktu (fungsi murni, diuji di tests/validate.html). UI-nya ada di js/app.js. */
(function (global) {
  'use strict';

  /* ---------- Checklist ---------- */
  // dir: 'buy' | 'sell' | null; checked: objek {id: true}.
  // Hasil: {status:'ARAH'|'VALID'|'BELUM', missing:[{id,text,saran}], bonusDone, bonusTotal, next}
  function evaluate(dir, checked) {
    var S = global.SETUP;
    checked = checked || {};
    var bonusDone = S.bonus.filter(function (b) { return checked[b.id]; }).length;
    var res = { status: 'ARAH', missing: [], bonusDone: bonusDone, bonusTotal: S.bonus.length, next: 'Pilih arah dulu: Buy atau Sell.' };
    if (dir !== 'buy' && dir !== 'sell') return res;
    res.missing = S.required.filter(function (r) { return !checked[r.id]; });
    if (res.missing.length) {
      res.status = 'BELUM';
      res.next = res.missing[0].saran;
    } else {
      res.status = 'VALID';
      res.next = 'Semua syarat wajib terpenuhi. Tunggu candle close di TF entry, pasang Entry/SL/TP (RR 1:2), lalu cek berita besar.';
    }
    return res;
  }

  /* ---------- Waktu ---------- */
  var MIN = 60000;

  // Candle close berikutnya (ms) untuk TF `periodMin` menit. Candle M1/M5/M15 jatuh di kelipatan menit UTC.
  function nextClose(nowMs, periodMin) {
    var p = periodMin * MIN;
    return (Math.floor(nowMs / p) + 1) * p;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function fmtCountdown(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    return pad(Math.floor(s / 60)) + ':' + pad(s % 60);
  }

  var fmtCache = {};
  function parts(ms, zone) {
    var f = fmtCache[zone] || (fmtCache[zone] = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short'
    }));
    var o = {};
    f.formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, mo: +o.month, d: +o.day, h: (+o.hour) % 24, mi: +o.minute, s: +o.second, wd: o.weekday };
  }

  function offsetMs(ms, zone) {
    var p = parts(ms, zone);
    return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - Math.floor(ms / 1000) * 1000;
  }

  // Waktu dinding (tahun, bulan, tanggal, jam, menit) di zona -> ms UTC. Ikut DST karena offset dihitung Intl.
  function zonedToMs(y, mo, d, h, mi, zone) {
    var guess = Date.UTC(y, mo - 1, d, h, mi);
    var t = guess - offsetMs(guess, zone);
    return guess - offsetMs(t, zone);
  }

  function hhmm(ms, zone) {
    var p = parts(ms, zone);
    return pad(p.h) + ':' + pad(p.mi);
  }

  // Sesi buka 08:00 sampai 17:00 waktu setempat. Jam ditampilkan dalam WIB (Asia/Jakarta).
  var SESSIONS = [
    { id: 'london', name: 'London', zone: 'Europe/London' },
    { id: 'newyork', name: 'New York', zone: 'America/New_York' }
  ];
  var OPEN_H = 8, CLOSE_H = 17;

  function sessionInfo(s, nowMs) {
    var p = parts(nowMs, s.zone);
    var startMs = zonedToMs(p.y, p.mo, p.d, OPEN_H, 0, s.zone);
    var endMs = zonedToMs(p.y, p.mo, p.d, CLOSE_H, 0, s.zone);
    var weekend = p.wd === 'Sat' || p.wd === 'Sun';
    var state = weekend ? 'weekend' : nowMs < startMs ? 'belum' : nowMs < endMs ? 'aktif' : 'tutup';
    return {
      id: s.id, name: s.name, zone: s.zone, startMs: startMs, endMs: endMs, state: state,
      wib: hhmm(startMs, 'Asia/Jakarta') + '–' + hhmm(endMs, 'Asia/Jakarta') + ' WIB'
    };
  }

  function sessions(nowMs) {
    return SESSIONS.map(function (s) { return sessionInfo(s, nowMs); });
  }

  // Overlap London x New York (WIB), atau null kalau tidak ada.
  function overlap(nowMs) {
    var a = sessionInfo(SESSIONS[0], nowMs), b = sessionInfo(SESSIONS[1], nowMs);
    var s = Math.max(a.startMs, b.startMs), e = Math.min(a.endMs, b.endMs);
    return e > s ? hhmm(s, 'Asia/Jakarta') + '–' + hhmm(e, 'Asia/Jakarta') + ' WIB' : null;
  }

  var STATE_TEXT = { aktif: 'Aktif', belum: 'Belum buka', tutup: 'Sudah tutup', weekend: 'Akhir pekan' };

  global.VySetup = {
    evaluate: evaluate, nextClose: nextClose, fmtCountdown: fmtCountdown,
    sessions: sessions, overlap: overlap, hhmm: hhmm, STATE_TEXT: STATE_TEXT
  };
})(window);
