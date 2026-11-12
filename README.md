# Bear Adventure Prototype 0.2

Fitur: dunia hutan/desa low-poly, beruang dengan animasi berjalan, keyboard WASD + Space + Shift, kamera mouse, kontrol sentuh HP, tabrakan sederhana dengan pohon/batu/rumah, 12 koin, penyimpanan lokal LocalStorage, dan PWA dasar.

## GitHub Pages
1. Upload seluruh isi folder ini ke root repository.
2. Settings → Pages → Deploy from a branch.
3. Pilih branch `main`, folder `/ (root)`, Save.
4. Buka URL Pages repository.

## Offline
Service worker meng-cache file lokal setelah kunjungan pertama. Three.js masih menggunakan CDN, jadi untuk offline penuh perlu mengunduh modul Three.js dan mengganti import pada `js/game.js` dengan file lokal.

## Batasan
Prototype menggunakan geometri Three.js, animasi sederhana dan collision circle di bidang XZ. Belum ada musuh, NPC, sistem nyawa, atau sinkronisasi Supabase. Koin tersimpan di browser yang sama.
