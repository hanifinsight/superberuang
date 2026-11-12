# Bear Adventure – Prototype 0.6

Petualangan 3D third-person ringan berbasis Three.js, siap diunggah ke GitHub Pages.

## Fitur versi 0.6
- Karakter beruang prosedural dengan rig sederhana: dua lengan dan dua kaki bergerak independen saat berjalan dan berlari.
- Animasi lari, lompat, ayunan tangan-kaki, kemiringan badan, dan gerak kepala.
- Tiga jenis musuh: slime patroli, kura-kura bertempurung, dan lebah yang terbang serta mengejar pemain saat dekat.
- Area hutan, desa, sungai, jembatan, padang rumput, reruntuhan, gua, dan sarang lebah.
- Misi NPC Pak Beruang, 12 koin, checkpoint, nyawa, suara, tekstur, dan penyimpanan progres lokal.
- Kontrol laptop: WASD/arrow, Space lompat, Shift lari, E interaksi, drag mouse untuk kamera.
- Kontrol HP: joystick, tombol LARI, LOMPAT, dan interaksi.

## Cara menjalankan / deploy
1. Ekstrak ZIP.
2. Unggah seluruh isi folder `bear-adventure-prototype-06` ke repository GitHub (boleh di root repository).
3. Aktifkan GitHub Pages dari branch dan folder yang digunakan.
4. Buka alamat HTTPS GitHub Pages. Game memuat Three.js dari jsDelivr CDN, jadi koneksi internet diperlukan.
5. Jika versi lama masih tampil, lakukan hard refresh (`Ctrl + Shift + R`) atau hapus cache situs.

## Catatan teknis
Model GLB versi sebelumnya tetap disimpan sebagai aset referensi, tetapi pemain versi 0.6 menggunakan karakter prosedural ber-pivot agar animasi anggota tubuh berjalan konsisten tanpa ketergantungan pada skeleton GLB.

## Batasan prototype
Belum ada sistem combat untuk mengalahkan musuh, boss, atau penyimpanan cloud. Progres disimpan di browser perangkat masing-masing.
