# Bear Adventure — Prototype 0.3

## Pembaruan
- Koreksi anatomi: karakter beruang sekarang bipedal dengan tepat **2 kaki dan 2 tangan** (bukan empat kaki).
- Dunia hutan, desa kecil, sungai, jembatan, dan pintu gua.
- Animasi dasar ayunan dua kaki dan dua tangan saat berjalan.
- Musuh slime berpatroli; kontak mengurangi nyawa.
- Tiga nyawa dan respawn pada titik awal / checkpoint.
- Pos pemeriksaan berupa bendera dekat jembatan.
- 12 koin koleksi.
- Keyboard WASD/panah, Space lompat, Shift lari; joystick dan tombol lompat untuk HP.
- Kamera third-person dapat diputar dengan drag mouse.
- PWA cache dasar.

## Pasang ke GitHub Pages
Upload semua isi folder ini ke root repository (jangan upload folder pembungkusnya saja), lalu Settings → Pages → Deploy from a branch → main → /(root) → Save.

## Offline
Three.js masih diambil dari jsDelivr CDN. Untuk offline penuh, unduh file `three.module.js`, letakkan misalnya di `vendor/three.module.js`, ubah import pada `js/game.js` menjadi `../vendor/three.module.js`, lalu tambahkan path itu ke array cache pada `sw.js`. Buka game online sekali sebelum mencoba offline.

## Batasan
Model karakter dan dunia dibangun dari geometri Three.js prosedural; belum menggunakan model GLB profesional atau animasi rigged. Audio belum ditambahkan. Data progres belum disinkronkan dengan Supabase. Versi ini adalah prototype untuk uji gameplay.
