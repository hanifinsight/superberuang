# Bear Adventure — Prototype 0.5.2

## Penambahan versi 0.5.2
- Seluruh tekstur lokal sudah disediakan dan dipakai oleh material Three.js: rumput, jalur tanah, batang pohon, daun, batu, dinding, atap, dan air.
- Audio lokal sudah disediakan: ambience hutan loop serta efek koin, lompat, terkena musuh, checkpoint, langkah, dan dialog.
- Audio ambience mulai setelah pemain menekan tombol MULAI PETUALANGAN (mengikuti kebijakan autoplay browser).
- Service worker memasukkan seluruh tekstur PNG dan audio WAV ke cache.
- Audio Web Audio sintetis tetap menjadi fallback jika audio file gagal dimainkan.

## Struktur aset
- `assets/models/bear.glb`
- `assets/textures/*.png`
- `assets/audio/*.wav`

## Menjalankan
Gunakan VS Code Live Server atau GitHub Pages. Jangan membuka `index.html` langsung dengan double-click karena browser membatasi ES Modules dan pemuatan aset pada `file://`.

## Kontrol
WASD / panah untuk bergerak, Space untuk lompat, Shift untuk lari, E untuk berbicara dengan NPC. Di HP gunakan joystick dan tombol layar.

## Offline
File model, tekstur, dan audio disimpan lokal serta masuk precache Service Worker. Library Three.js dan GLTFLoader masih diambil dari CDN, sehingga koneksi internet tetap dibutuhkan untuk pemuatan awal library. Setelah library CDN berhasil dicache oleh browser, ketersediaan offline bergantung pada cache browser dan service worker.

## Catatan
Model beruang GLB berupa mesh statis, belum memiliki rig/skeleton. Gameplay perlu diuji melalui browser desktop dan HP setelah diunggah.
