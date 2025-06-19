Alur Aplikasi dan Alur Data Sistem Rekam Medis Blockchain
Berikut penjelasan lengkap dan rinci tentang alur aplikasi dan alur data dalam sistem rekam medis berbasis blockchain yang Anda buat:

1. Alur Aplikasi Secara Keseluruhan
A. Registrasi Pengguna
Pengguna mengakses /register melalui browser

Sistem menampilkan form registrasi dengan pilihan role (pasien/dokter)

Pengguna mengisi form dan submit

Sistem:

Memeriksa ketersediaan username

Meng-hash password dengan bcrypt

Menyimpan data user ke users.json

Untuk pasien: membuat array ownedHashes kosong

Untuk dokter: membuat array handledPatients kosong

Pengguna diarahkan ke halaman sukses dan bisa login

B. Login
Pengguna mengakses /login

Sistem menampilkan form login

Pengguna memasukkan username dan password

Sistem:

Memeriksa kecocokan username dan password hash

Membuat session untuk user yang berhasil login

Menyimpan role user di session

Pengguna diarahkan ke dashboard sesuai role

C. Dashboard
Untuk Pasien:

Menampilkan daftar rekam medis yang dimiliki

Setiap rekam medis menampilkan metadata dasar dan link untuk melihat detail

Untuk Dokter:

Menampilkan form input rekam medis baru

Menampilkan daftar pasien yang pernah ditangani

Setiap pasien menampilkan jumlah rekam medis dan link ke riwayat lengkap

D. Input Rekam Medis Baru (Dokter)
Dokter mengisi form di dashboard

Sistem:

Memvalidasi data pasien

Membuat struktur data rekam medis

Mengenkripsi data dengan AES-256-GCM

Mengunggah data terenkripsi ke IPFS via Pinata

Menyimpan hash IPFS ke blockchain (BSC Testnet)

Menyimpan metadata enkripsi ke database lokal

Memperbarui daftar pasien dokter dan daftar rekam medis pasien

E. Verifikasi Rekam Medis
Pengguna mengklik link verifikasi dari dashboard

Sistem:

Memeriksa hak akses (pasien hanya bisa melihat miliknya, dokter hanya bisa melihat pasiennya)

Mengambil data dari IPFS

Mendekripsi data menggunakan kunci dari database lokal

Menampilkan data rekam medis lengkap beserta bukti transaksi blockchain