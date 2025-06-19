Sistem Rekam Medis Berbasis Blockchain

Prasyarat
Pastikan di komputer Anda sudah terpasang:

Node.js: Versi 18 atau yang lebih baru (nodejs.org).
Editor Kode: Seperti Visual Studio Code.

Panduan Menjalankan Proyek
Cukup ikuti tiga langkah mudah ini.

Langkah 1: Ekstrak & Buka Proyek
Ekstrak file ZIP proyek yang sudah Anda terima. Kemudian, buka folder proyek tersebut di terminal atau Command Prompt.

Langkah 2: Install Semua Kebutuhan (Dependencies)
Jalankan perintah berikut di terminal untuk mengunduh dan meng-install semua library yang dibutuhkan oleh proyek.

Bash

npm install --legacy-peer-deps
Tunggu hingga proses instalasi ini selesai.

Catatan: File .env yang berisi kunci-kunci rahasia sudah termasuk di dalam proyek ini untuk mempermudah. Di proyek nyata, kunci rahasia tidak boleh dibagikan.

Langkah 3: Jalankan Aplikasi!
Setelah instalasi selesai, Anda bisa langsung menjalankan server aplikasi dengan perintah:

Bash

node app.js

Jika berhasil, terminal akan menampilkan pesan: Server berjalan di http://localhost:3000.

Sekarang buka browser Anda dan navigasi ke http://localhost:3000 untuk mulai menggunakan aplikasi. Semuanya sudah terhubung dan siap pakai.

Alur Penggunaan
Buka aplikasi, lalu klik Registrasi.
Buat akun Dokter dan Pasien baru untuk Anda coba sendiri.
Login sebagai Dokter untuk input data.
Login sebagai Pasien untuk melihat riwayat data Anda.
