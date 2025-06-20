# 🚀 Panduan Instalasi dan Konfigurasi
Selamat datang di proyek Sistem Rekam Medis Blockchain! Dokumen ini akan memandu Anda melalui setiap langkah yang diperlukan untuk menjalankan aplikasi ini secara lokal di komputer Anda, mulai dari instalasi hingga deploy Smart Contract.

## 🛠️ Prasyarat (Prerequisites)

Sebelum memulai, pastikan perangkat Anda telah terinstal perangkat lunak berikut:

- **[Node.js](https://nodejs.org/)** (versi 18.x atau lebih tinggi direkomendasikan)
- **[Git](https://git-scm.com/)** untuk meng-clone repositori.
- **[MetaMask](https://metamask.io/)** ekstensi browser untuk mengelola dompet digital dan berinteraksi dengan blockchain.

---

## ⚙️ Langkah-langkah Instalasi

Ikuti langkah-langkah berikut secara berurutan.

### 1. Clone Repositori
Buka terminal atau command prompt Anda, lalu clone repositori ini menggunakan Git.

git clone [\[URL_REPOSITORI_GITHUB_ANDA\]](https://github.com/BochanUFM18/sistem-rekam-medis-blockchain-bsctestnet)

### 2. Masuk ke Direktori Proyek
Pindah ke direktori proyek yang baru saja Anda clone.

cd sistem-rekam-medis-blockchain-bsctestnet

### 3. Install Dependensi
Install semua pustaka dan paket yang dibutuhkan oleh proyek menggunakan npm. Perintah ini akan menginstal dependensi untuk backend (Express.js) dan pengembangan blockchain (Hardhat, Ethers.js).

npm install 

## 🔑 Konfigurasi Environment (.env) 
Aplikasi ini memerlukan beberapa kunci rahasia (API Keys & Private Key) untuk dapat berfungsi. Kunci-kunci ini harus disimpan dalam sebuah file bernama .env.

#### 1. Buat File .env
Buat sebuah file baru di direktori utama proyek dengan nama .env.

#### 2. Isi File .env
Salin template di bawah ini ke dalam file .env Anda.

Kunci privat dari dompet MetaMask Anda (untuk deploy & transaksi)
PRIVATE_KEY=""
Kunci API dari akun Pinata.cloud Anda
PINATA_API_KEY=""
API Secret Key dari akun Pinata.cloud Anda
PRIVATE_KEY_PINATA=""

#### 3. Cara Mendapatkan Setiap Kunci
#### a. Mendapatkan PRIVATE_KEY dari MetaMask 
Kunci ini digunakan untuk mendeploy Smart Contract dan menandatangani transaksi dari sisi server.

#### - Buka ekstensi MetaMask di browser Anda.
#### - Pastikan Anda berada di jaringan "BNB Smart Chain Testnet".
#### - Klik ikon tiga titik (⋮) di sebelah kanan atas.
#### - Pilih "Detail akun" (Account Details).
#### - Klik tombol "Ekspor Kunci Privat" (Export Private Key).
#### - Masukkan password MetaMask Anda, lalu salin kunci yang muncul.
#### - Tempelkan kunci tersebut ke dalam variabel PRIVATE_KEY di file .env Anda.
PENTING: Jangan pernah membagikan atau mempublikasikan PRIVATE_KEY Anda kepada siapa pun! Ini setara dengan memberikan akses penuh ke dompet Anda.

#### b. Mendapatkan Kunci API Pinata
Kunci ini digunakan untuk mengautentikasi aplikasi Anda saat mengunggah file rekam medis ke IPFS melalui layanan Pinata.
#### - Buka situs Pinata.cloud dan daftar atau login.
#### - Setelah masuk, klik ikon profil Anda di kanan atas, lalu pilih "API Keys".
#### - Klik tombol "+ New Key".
#### - Beri nama untuk kunci Anda (misalnya, "Proyek Rekam Medis") dan aktifkan semua akses yang diperlukan (biasanya sudah default).
#### - Setelah kunci dibuat, Pinata akan menampilkan API Key dan API Secret.
Salin nilai API Key dan tempelkan ke PINATA_API_KEY.
Salin nilai API Secret dan tempelkan ke PRIVATE_KEY_PINATA. (Meskipun nama variabelnya PRIVATE_KEY_PINATA, isinya adalah API Secret).

## 📜 Deploy Smart Contract
Setelah file .env terkonfigurasi, Anda perlu mendeploy Smart Contract ke jaringan BNB Smart Chain Testnet untuk mendapatkan alamat kontrak (contractAddress).

### 1. Pastikan Anda Memiliki Faucet BNB
Anda memerlukan sedikit BNB Testnet untuk membayar "gas fee" saat deploy. Anda bisa mendapatkannya secara gratis dari faucet resmi BNB, misalnya BNB Testnet Faucet.

### 2. Jalankan Script Deploy
Proyek ini menggunakan Hardhat untuk mengelola proses deploy. Jalankan perintah berikut di terminal: 

npx hardhat run scripts/deploy.js --network bsc_testnet

(Catatan: Nama script deploy.js dan network bsc_testnet mungkin perlu disesuaikan jika Anda menamainya berbeda di hardhat.config.js)

### 3. Salin Alamat Kontrak 
Setelah proses selesai, terminal akan menampilkan pesan seperti ini:

Contract deployed to: 0x9F8E5A93Cd2EcC56D3f79E8bDBe486a383d7bBF0 

Salin alamat 0x... tersebut.

### 4. Update Alamat Kontrak di app.js
Buka file app.js dan cari baris berikut. Ganti nilainya dengan alamat kontrak yang baru saja Anda dapatkan.

const contractAddress = "GANTI_DENGAN_ALAMAT_KONTRAK_ANDA"; 

## ✅ Menjalankan Aplikasi 
Sekarang semua konfigurasi telah selesai! Untuk menjalankan server aplikasi, gunakan perintah: 

node app.js 

Jika berhasil, Anda akan melihat pesan di terminal:
Server berjalan di http://localhost:3000

Buka browser Anda dan kunjungi http://localhost:3000 untuk melihat aplikasi berjalan.