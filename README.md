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

🔑 Konfigurasi Environment (.env) 
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
##### a. Mendapatkan PRIVATE_KEY dari MetaMask 
Kunci ini digunakan untuk mendeploy Smart Contract dan menandatangani transaksi dari sisi server.

