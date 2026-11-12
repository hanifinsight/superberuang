# Bear Adventure Prototype 0.4

Pembaruan: beruang bipedal tepat 2 kaki + 2 tangan; animasi prosedural idle/berjalan/lari/lompat; efek suara Web Audio; progres koin, nyawa dan checkpoint tersimpan di LocalStorage; dukungan opsional GLB melalui `assets/bear.glb`; lingkungan hutan, desa, sungai, jembatan, gua, slime, checkpoint dan 12 koin.

## GitHub Pages
Unggah seluruh isi folder ini ke root repository. Settings → Pages → Deploy from a branch → main → /(root) → Save.

## GLB
Tidak ada model GLB profesional yang disertakan. Jika memiliki model bear rigged yang berlisensi sesuai, simpan sebagai `assets/bear.glb`. Game akan mencoba memuatnya dan tetap memakai model prosedural jika gagal.

## Offline
Three.js dan GLTFLoader masih dari CDN. Untuk offline penuh, simpan modul Three.js, GLTFLoader dan dependensinya secara lokal, ubah import di `js/game.js`, lalu masukkan file ke cache `sw.js`. Buka situs online sekali sebelum uji offline.

## Batasan
Animasi prosedural bukan rigging profesional. Belum ada sinkronisasi Supabase. File GLB eksternal bersifat opsional dan tidak disertakan.
