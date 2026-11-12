# Bear Adventure — Prototype 0.4.1 (Perbaikan tombol mulai)

## Perbaikan
- Menghapus import GLTFLoader yang belum digunakan pada versi 0.4. Ini mengurangi satu titik kegagalan saat modul eksternal gagal dimuat.
- Binding tombol MULAI PETUALANGAN memakai `addEventListener` dan secara eksplisit mengaktifkan loop gameplay.
- Memperbaiki class dialog pada HTML agar style panel mulai diterapkan.
- Memperjelas lapisan klik (z-index dan pointer-events) pada tombol.
- Menambahkan pesan kesalahan runtime agar kegagalan modul lebih mudah diketahui.
- Cache Service Worker diperbarui agar browser mengambil file versi baru.

## Cara menjalankan
1. Ekstrak ZIP.
2. Upload seluruh isi folder `bear-adventure-prototype-04` ke GitHub (timpa file versi lama).
3. Jika menggunakan GitHub Pages, tunggu deployment selesai.
4. Buka ulang URL dengan refresh paksa / hapus cache situs bila perlu.
5. Klik MULAI PETUALANGAN.

Gunakan HTTPS (GitHub Pages) atau Live Server. Jangan membuka `index.html` melalui `file://`, karena browser membatasi pemuatan JavaScript module dari CDN.

## Catatan
Game memerlukan browser yang mendukung WebGL dan koneksi internet untuk mengambil Three.js dari CDN.
