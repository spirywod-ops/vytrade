/* Peta belajar: 4 level. `sections` = daftar bagian; tiap bagian punya `h` (judul, boleh kosong) dan `ids` (id kartu).
   id kartu = id konsep di data/concepts.js, atau 'topdown' (halaman khusus, lihat LEVEL_SPECIAL).
   Kartu dihitung "dibuka" saat halamannya dikunjungi; progres level = kartu dibuka / jumlah kartu.
   Level yang belum punya kartu: soon: true (tampil "Segera hadir"). Satu kartu hanya boleh ada di satu level. */
window.LEVELS = [
  {
    id: 'l1', title: 'Level 1 · Dasar', desc: 'Membaca candle dan arah harga.',
    sections: [{ h: '', ids: ['candlestick', 'swing', 'hammer', 'engulfing', 'doji'] }]
  },
  {
    id: 'l2', title: 'Level 2 · Menengah', desc: 'Struktur, zona entry, top-down, dan eksekusi.',
    sections: [
      { h: 'Struktur', ids: ['bos', 'choch', 'bos-vs-choch', 'expansion', 'consolidation', 'reversal'] },
      { h: 'Zona', ids: ['fvg', 'ifvg', 'ob', 'breaker'] },
      { h: 'Top-down', ids: ['topdown'] },
      { h: 'Eksekusi', ids: ['entry', 'sl', 'tp', 'noentry'] }
    ]
  },
  {
    id: 'l3', title: 'Level 3 · Lanjut', desc: 'Liquidity, premium/discount, SMT, sesi, CISD, QML, inducement, dan AMD.',
    sections: [{ h: '', ids: ['liquidity', 'premdisc', 'smt', 'sesi', 'cisd', 'qml', 'inducement', 'amd'] }]
  },
  {
    id: 'l4', title: 'Level 4 · Expert', desc: 'Materi expert.',
    sections: [], soon: true
  }
];

window.LEVEL_SPECIAL = {
  topdown: { title: 'Cara baca top-down (1D → 1m)', href: '#/belajar/topdown' }
};
