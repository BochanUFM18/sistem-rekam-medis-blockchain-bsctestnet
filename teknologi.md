# 🚀 Teknologi yang Digunaan: Sistem Rekam Medis Blockchain

Proyek ini adalah aplikasi web *full-stack* yang dibangun dengan arsitektur hybrid, menggabungkan kekuatan aplikasi web tradisional dengan keamanan dan desentralisasi dari teknologi Web3. Tujuan utamanya adalah untuk menciptakan sistem pencatatan rekam medis yang aman, transparan, dan tidak dapat diubah.

Berikut adalah rincian teknologi yang menjadi tulang punggung aplikasi ini.

## Ringkasan Teknologi

| Kategori | Teknologi | Kegunaan Utama dalam Proyek |
| :--- | :--- | :--- |
| **Dasar & Lingkungan** | **Node.js** | Lingkungan untuk menjalankan JavaScript di sisi server. |
| **Backend** | **Express.js** | Kerangka kerja untuk membangun aplikasi web dan API. |
| | `body-parser` | Membaca data yang dikirim dari form HTML. |
| | `dotenv` | Mengelola kunci rahasia (API & Private Key) di luar kode. |
| **Frontend** | **HTML (via JS)** | Struktur halaman web yang dibuat secara dinamis. |
| | **Pico.css** | Framework CSS ringan untuk gaya visual dan *styling*. |
| **Blockchain & Web3**| **Solidity** | Bahasa pemrograman untuk menulis Smart Contract. |
| | **Smart Contract** | Program di blockchain untuk mencatat bukti hash IPFS. |
| | **Ethers.js** | Pustaka untuk berinteraksi dengan blockchain dari JavaScript. |
| | **BNB Smart Chain**| Jaringan blockchain tempat Smart Contract berjalan (Testnet). |
| | **IPFS (via Pinata)**| Sistem penyimpanan file terdesentralisasi untuk data rekam medis. |
| | `pinata/sdk` | SDK untuk mempermudah proses unggah file ke IPFS. |
| **Keamanan & Sesi**| `bcrypt` | Mengamankan password pengguna dengan metode *hashing*. |
| | `express-session`| Mengelola sesi login pengguna. |
| | `crypto` | Mengenkripsi data rekam medis sebelum diunggah ke IPFS. |
| **Penyimpanan & Data**| **File JSON** | Digunakan sebagai database sederhana untuk data pengguna & metadata. |
| | `axios` | Mengambil kembali data rekam medis dari gateway IPFS. |

> **Arsitektur Inti**: Data rekam medis yang sensitif dienkripsi dan disimpan di **IPFS** (penyimpanan terdesentralisasi), sementara *hash* (bukti digital) dari data tersebut dicatat secara permanen di **BNB Smart Chain**. Ini memastikan data tetap privat namun memiliki jejak verifikasi yang tidak bisa dimanipulasi.

---

## 🏗️ Dasar & Lingkungan (Foundation & Environment)

### Node.js
Sebagai fondasi dari seluruh backend, Node.js adalah lingkungan runtime yang mengeksekusi JavaScript di sisi server. Seluruh logika di dalam `app.js` berjalan di atas Node.js.

## ⚙️ Backend (Sisi Server)

### Express.js
Framework minimalis yang berjalan di atas Node.js untuk menyederhanakan pengembangan aplikasi web. Dalam proyek ini, Express berfungsi untuk:
* **Routing**: Menentukan respons server untuk setiap URL, seperti `app.get('/')` untuk halaman utama atau `app.post('/login')` untuk memproses login.
* **Middleware**: Mengelola alur permintaan-respons, termasuk penggunaan `body-parser` dan `express-session`.

### `body-parser`
Middleware untuk "membongkar" data yang dikirim dari form HTML. Ini memungkinkan kita mengakses data inputan pengguna (misalnya, username dan password) melalui `req.body` di dalam kode.

### `dotenv`
Pustaka penting untuk keamanan. `dotenv` memuat variabel lingkungan dari file `.env` ke dalam `process.env`. Digunakan untuk menyimpan informasi sensitif seperti `PINATA_API_KEY` dan `PRIVATE_KEY` agar tidak terekspos langsung di dalam kode.

## 🎨 Frontend (Sisi Klien/Tampilan)

### HTML (dihasilkan via JavaScript)
Aplikasi ini tidak menggunakan file `.html` statis. Sebaliknya, seluruh struktur HTML dibuat secara dinamis sebagai *template literal* (string di dalam `` ` ``) di dalam `app.js`, terutama pada fungsi `renderPage`.

### Pico.css
Sebuah framework CSS yang sangat ringan dan modern. Digunakan untuk memberikan semua gaya visual pada aplikasi—mulai dari tata letak, form, tombol, hingga tipografi—tanpa perlu menulis banyak kode CSS kustom.

## 🔗 Teknologi Blockchain & Web3

### Solidity
Bahasa pemrograman utama yang digunakan untuk menulis logika Smart Contract di dalam file `MedicalRecords.sol`.

### Smart Contract
Program otonom yang berjalan di jaringan BNB Smart Chain. Fungsinya sebagai "buku besar digital" yang abadi dan transparan untuk mencatat *hash* dari setiap rekam medis baru yang ditambahkan, memastikan integritas data.

### Ethers.js
Pustaka JavaScript modern untuk berinteraksi dengan blockchain. Digunakan untuk:
* Menyambungkan aplikasi ke node BNB Smart Chain (`new ethers.JsonRpcProvider`).
* Mengelola dompet dan menandatangani transaksi (`new ethers.Wallet`).
* Berinteraksi dengan fungsi Smart Contract (`new ethers.Contract`).

### BNB Smart Chain (Testnet)
Jaringan blockchain tempat Smart Contract di-deploy. Versi **Testnet** digunakan agar semua transaksi dapat diuji tanpa biaya finansial nyata.

### IPFS (InterPlanetary File System)
Sistem penyimpanan file terdistribusi yang digunakan untuk menyimpan data rekam medis yang sebenarnya (setelah dienkripsi). Dipilih karena lebih efisien dan murah untuk menyimpan file besar dibandingkan menyimpannya langsung di blockchain.

### Pinata SDK (`@pinata/sdk`)
Layanan dan SDK yang menyederhanakan proses unggah dan "pinning" file ke IPFS. "Pinning" memastikan file tetap tersedia dan tidak terhapus dari jaringan.

## 🔐 Keamanan & Otentikasi

### `bcrypt`
Standar industri untuk mengamankan password. `bcrypt` mengubah password pengguna menjadi *hash* kriptografis yang tidak dapat dibalik. Fungsi `bcrypt.compare()` digunakan untuk memverifikasi password saat login tanpa pernah melihat password aslinya.

### `express-session`
Middleware untuk membuat dan mengelola sesi login. Ini memungkinkan server untuk "mengingat" pengguna yang telah login melalui *cookie*, sehingga mereka tidak perlu memasukkan kredensial di setiap halaman.

### `crypto` (Modul Bawaan Node.js)
Digunakan untuk lapisan keamanan data. Sebelum data rekam medis diunggah ke IPFS, data tersebut dienkripsi menggunakan `AES-256-GCM`. Ini menjamin bahwa hanya pihak yang berwenang (yang memiliki kunci dekripsi di server) yang dapat membaca isi data.

## 🗃️ Penyimpanan Data & Lainnya

### File JSON (sebagai Database)
Untuk kesederhanaan, proyek ini menggunakan file `users.json` dan `database.json` sebagai database lokal.
* `users.json`: Menyimpan informasi akun pengguna (username, hash password, peran).
* `database.json`: Menyimpan metadata penting terkait file di IPFS (kunci enkripsi, hash transaksi, dll).

### `axios`
Pustaka untuk melakukan permintaan HTTP. Digunakan untuk mengambil kembali file rekam medis terenkripsi dari gateway IPFS Pinata sebelum data tersebut didekripsi dan ditampilkan kepada dokter atau pasien.
