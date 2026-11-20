/* Materi. Satu konsep = satu kartu: Apa itu / Cara melihat / Syarat valid / Kesalahan umum.
   `examples` = nama kunci di window.EXAMPLES (lihat data/examples/). */
window.GROUPS = ['Dasar', 'Struktur', 'Zona', 'Top-down', 'Eksekusi', 'Lanjut'];

window.CONCEPTS = [
  {
    id: 'fvg', group: 'Zona', title: 'FVG (Fair Value Gap)', examples: 'fvg',
    apa: 'FVG adalah celah harga yang tertinggal saat harga bergerak sangat cepat. Zona ini sering didatangi lagi sebelum harga lanjut.',
    cara: 'Cari 3 candle berurutan dengan candle tengah besar. Celah antara high candle 1 dan low candle 3 (bullish) adalah zonanya; bearish kebalikannya.',
    syarat: 'Bullish: low candle ke-3 di atas high candle ke-1. Bearish: high candle ke-3 di bawah low candle ke-1. Zona belum ditembus body close berlawanan.',
    salah: 'Menganggap wick yang menembus zona sebagai tembus (yang dihitung body close). Memakai FVG yang sudah tertembus, atau pasang SL di dalam zona.'
  }
];
