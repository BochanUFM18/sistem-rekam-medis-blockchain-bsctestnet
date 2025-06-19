const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { ethers } = require("ethers");
const crypto = require("crypto");
const fs = require("fs");
const session = require("express-session");
const bcrypt = require("bcrypt");
const axios = require("axios");
const PinataClient = require("@pinata/sdk");
require("dotenv").config();

const app = express();
const port = 3000;

// --- KONFIGURASI ---
const pinata = new PinataClient(
  process.env.PINATA_API_KEY,
  process.env.PRIVATE_KEY_PINATA
);
const contractAddress = "0x9F8E5A93Cd2EcC56D3f79E8bDBe486a383d7bBF0";
const contractABI =
  require("./artifacts/contracts/MedicalRecords.sol/MedicalRecords.json").abi;
const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// --- DATABASE LOKAL ---
const dbPath = path.join(__dirname, "database.json");
const usersDbPath = path.join(__dirname, "users.json");

if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
if (!fs.existsSync(usersDbPath))
  fs.writeFileSync(usersDbPath, JSON.stringify({}));

const readDb = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent.trim() === "" ? {} : JSON.parse(fileContent);
  } catch (error) {
    return {};
  }
};
const writeDb = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// --- MIDDLEWARE & HELPERS ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "kunci-super-rahasia",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

function isAuthenticated(req, res, next) {
  if (req.session.user) next();
  else res.redirect("/login");
}

function renderPage(title, bodyContent) {
  return `
        <!DOCTYPE html><html lang="id" data-theme="light"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} | Rekam Medis Blockchain</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"></head><body><main class="container"><nav><ul><li><strong><a href="/" style="text-decoration: none;">Rekam Medis Blockchain</a></strong></li></ul><ul><li><a href="/records">Log Publik</a></li><li><a href="/login">Login</a></li><li><a href="/register">Registrasi</a></li></ul></nav>${bodyContent}</main></body></html>
    `;
}

// --- ROUTES ---

app.get("/", (req, res) => {
  const body = `<article style="text-align: center; margin-top: 5rem;"><header><h1>Selamat Datang di Sistem Rekam Medis Blockchain</h1><p>Aplikasi aman untuk mencatat rekam medis dengan bukti di blockchain dan penyimpanan terdesentralisasi.</p></header><footer><a href="/login" role="button" class="contrast">Mulai Login</a><a href="/register" role="button" class="secondary">Daftar Akun Baru</a></footer></article>`;
  res.send(renderPage("Selamat Datang", body));
});

app.get("/login", (req, res) => {
  const body = `<article><header><h2>Login</h2></header><form action="/login" method="POST"><label for="username">Username</label><input type="text" id="username" name="username" required><label for="password">Password</label><input type="password" id="password" name="password" required><button type="submit">Login</button></form><footer><p>Belum punya akun? <a href="/register">Daftar di sini</a></p></footer></article>`;
  res.send(renderPage("Login", body));
});

app.get("/register", (req, res) => {
  const body = `<article><header><h2>Registrasi Akun Baru</h2></header><form action="/register" method="POST"><label for="username">Username</label><input type="text" id="username" name="username" required><label for="password">Password</label><input type="password" id="password" name="password" required><label for="role">Daftar sebagai</label><select name="role" id="role" required><option value="pasien">Pasien</option><option value="dokter">Dokter</option></select><button type="submit">Daftar</button></form><footer><p>Sudah punya akun? <a href="/login">Login di sini</a></p></footer></article>`;
  res.send(renderPage("Registrasi", body));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = readDb(usersDbPath)[username];
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    req.session.user = { username: user.username, role: user.role };
    res.redirect("/dashboard");
  } else {
    res.send(
      renderPage(
        "Error",
        "<h2>Username atau password salah.</h2><a href='/login' role='button'>Coba lagi</a>"
      )
    );
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const users = readDb(usersDbPath);
    if (users[username])
      return res.send(
        renderPage(
          "Error",
          "<h2>Username sudah terdaftar.</h2><p>Silakan gunakan username lain. <a href='/register' role='button'>Coba lagi</a></p>"
        )
      );

    users[username] = {
      username,
      passwordHash: await bcrypt.hash(password, 10),
      role,
    };
    if (role === "pasien") users[username].ownedHashes = [];
    if (role === "dokter") users[username].handledPatients = [];

    writeDb(usersDbPath, users);
    res.send(
      renderPage(
        "Sukses",
        "<h2>Registrasi berhasil!</h2><p>Silakan <a href='/login' role='button'>login</a> dengan akun baru Anda.</p>"
      )
    );
  } catch (error) {
    res
      .status(500)
      .send(
        renderPage(
          "Error",
          "<h2>Terjadi kesalahan saat proses registrasi.</h2>"
        )
      );
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  const user = req.session.user;
  let bodyContent = `<header style="margin-bottom: 2rem;"><h2>Dashboard</h2><p>Selamat datang, <strong>${user.username}</strong> (Peran: ${user.role}) | <a href="/logout">Logout</a></p></header>`;

  if (user.role === "dokter") {
    const users = readDb(usersDbPath);
    const doctorData = users[user.username];

    const formInputHTML = `<article><header><h3>Input Rekam Medis Baru</h3></header><form action="/addRecord" method="POST"><label for="patientUsername">Username Pasien</label><input type="text" id="patientUsername" name="patientUsername" placeholder="Contoh: pasien_satu" required><small>Pastikan pasien sudah terdaftar.</small><label for="keluhanUtama">Keluhan Utama</label><textarea id="keluhanUtama" name="keluhanUtama" rows="2" required></textarea><div class="grid"><label for="tekananDarah">Tekanan Darah</label><label for="suhu">Suhu</label></div><div class="grid"><input type="text" id="tekananDarah" name="tekananDarah"><input type="text" id="suhu" name="suhu"></div><label for="pemeriksaanLain">Pemeriksaan Fisik Lainnya</label><textarea id="pemeriksaanLain" name="pemeriksaanLain" rows="3"></textarea><label for="diagnosisKerja">Diagnosis Kerja</label><input type="text" id="diagnosisKerja" name="diagnosisKerja" required><label for="kodeICD10">Kode ICD-10</label><input type="text" id="kodeICD10" name="kodeICD10"><label for="treatment">Penatalaksanaan / Resep</label><textarea id="treatment" name="treatment" rows="3" required></textarea><label for="date">Tanggal</label><input type="date" id="date" name="date" required><button type="submit">Simpan & Catat di Blockchain</button></form></article>`;

    let patientListHTML = `<article><header><h3>Daftar Pasien Anda</h3></header>`;
    if (doctorData.handledPatients && doctorData.handledPatients.length > 0) {
      patientListHTML += `<table><thead><tr><th>Username Pasien</th><th>Total Catatan</th><th>Lihat Riwayat</th></tr></thead><tbody>`;
      doctorData.handledPatients.forEach((patientUsername) => {
        const patientData = users[patientUsername];
        const recordCount = patientData.ownedHashes.length;
        patientListHTML += `<tr><td>${patientUsername}</td><td>${recordCount}</td><td><a href="/patient-history/${patientUsername}">Lihat</a></td></tr>`;
      });
      patientListHTML += `</tbody></table>`;
    } else {
      patientListHTML += `<p>Anda belum menangani pasien satupun.</p>`;
    }
    patientListHTML += `</article>`;

    bodyContent += formInputHTML + patientListHTML;
  }

  if (user.role === "pasien") {
    const patientData = readDb(usersDbPath)[user.username];
    const allRecords = readDb(dbPath);
    bodyContent +=
      "<article><header><h3>Riwayat Rekam Medis Anda</h3></header>";
    const patientHashes = patientData?.ownedHashes || [];

    if (patientHashes.length > 0) {
      bodyContent +=
        "<table><thead><tr><th>Kunjungan Ke-</th><th>Tanggal Periksa</th><th>Hash IPFS</th><th>Aksi</th></tr></thead><tbody>";
      patientHashes.forEach((hash, index) => {
        const metadata = allRecords[hash];
        if (metadata) {
          bodyContent += `<tr><td>${index + 1}</td><td>${
            metadata.visitDate || "N/A"
          }</td><td><code>${hash}</code></td><td><a href="/verify/${hash}">Lihat Detail</a></td></tr>`;
        }
      });
      bodyContent += "</tbody></table>";
    } else {
      bodyContent += "<p>Anda belum memiliki riwayat rekam medis.</p>";
    }
    bodyContent += "</article>";
  }

  res.send(renderPage("Dashboard", bodyContent));
});

app.post("/addRecord", isAuthenticated, async (req, res) => {
  if (req.session.user.role !== "dokter")
    return res.status(403).send(renderPage("Error", "<h2>Akses Ditolak</h2>"));
  try {
    const doctorUsername = req.session.user.username;
    const {
      patientUsername,
      keluhanUtama,
      tekananDarah,
      suhu,
      pemeriksaanLain,
      diagnosisKerja,
      kodeICD10,
      treatment,
      date,
    } = req.body;
    const users = readDb(usersDbPath);

    if (!users[patientUsername] || users[patientUsername].role !== "pasien") {
      return res
        .status(400)
        .send(
          renderPage(
            "Error",
            `<h2>Pasien '${patientUsername}' tidak ditemukan.</h2>`
          )
        );
    }

    const recordData = {
      patientUsername,
      doctorUsername,
      date,
      anamnesis: { keluhanUtama },
      pemeriksaanFisik: { tekananDarah, suhu, pemeriksaanLain },
      diagnosis: { diagnosisKerja, kodeICD10 },
      penatalaksanaan: { treatment },
    };

    const encryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
    const encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(recordData), "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    const jsonToPin = { data: encryptedData.toString("hex") };
    const result = await pinata.pinJSONToIPFS(jsonToPin, {
      pinataMetadata: { name: `MedRec-${patientUsername}-${Date.now()}` },
    });
    const ipfsHash = result.IpfsHash;

    // ===========================================
    // == PERUBAHAN UTAMA: GAS FEE DITINGKATKAN ==
    // ===========================================
    const overrides = {
      gasLimit: 300000, // Memberikan batas gas yang aman
      gasPrice: ethers.parseUnits("0.1", "gwei"), // Menaikkan harga gas menjadi 100 Gwei (sangat tinggi)
    };

    // Mengirim transaksi dengan opsi gas yang sudah ditentukan
    const tx = await contract.addRecord(ipfsHash, overrides);
    // ===========================================

    const receipt = await tx.wait();
    const confirmedTxHash = receipt.hash;

    if (!confirmedTxHash) {
      throw new Error(
        "Transaksi dikonfirmasi tetapi hash tidak ditemukan pada receipt."
      );
    }

    const db = readDb(dbPath);
    db[ipfsHash] = {
      timestamp: new Date().toISOString(),
      transactionHash: confirmedTxHash,
      encryptionKey: encryptionKey.toString("hex"),
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
      visitDate: date,
    };
    writeDb(dbPath, db);

    if (!users[doctorUsername].handledPatients.includes(patientUsername)) {
      users[doctorUsername].handledPatients.push(patientUsername);
    }
    users[patientUsername].ownedHashes.push(ipfsHash);
    writeDb(usersDbPath, users);

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error saat addRecord:", error);
    res
      .status(500)
      .send(
        renderPage(
          "Error",
          `<h2>Gagal menyimpan data.</h2><p>${error.message}</p>`
        )
      );
  }
});

app.get("/patient-history/:patientUsername", isAuthenticated, (req, res) => {
  if (req.session.user.role !== "dokter")
    return res.status(403).send(renderPage("Error", "<h2>Akses Ditolak</h2>"));
  const { patientUsername } = req.params;
  const doctorData = readDb(usersDbPath)[req.session.user.username];
  const patientData = readDb(usersDbPath)[patientUsername];
  const allRecords = readDb(dbPath);

  if (!doctorData.handledPatients.includes(patientUsername)) {
    return res
      .status(403)
      .send(
        renderPage(
          "Error",
          "<h2>Akses Ditolak. Anda tidak menangani pasien ini.</h2>"
        )
      );
  }

  let bodyContent = `<article><header><h3>Riwayat Lengkap untuk Pasien: ${patientUsername}</h3></header>`;
  const patientHashes = patientData?.ownedHashes || [];

  if (patientHashes.length > 0) {
    bodyContent +=
      "<table><thead><tr><th>Kunjungan Ke-</th><th>Tanggal Periksa</th><th>Hash IPFS</th><th>Aksi</th></tr></thead><tbody>";
    patientHashes.forEach((hash, index) => {
      const metadata = allRecords[hash];
      if (metadata) {
        bodyContent += `<tr><td>${index + 1}</td><td>${
          metadata.visitDate || "N/A"
        }</td><td><code>${hash}</code></td><td><a href="/verify/${hash}">Lihat Detail</a></td></tr>`;
      }
    });
    bodyContent += "</tbody></table>";
  } else {
    bodyContent += `<p>Pasien ini belum memiliki riwayat rekam medis.</p>`;
  }
  bodyContent += `<footer><a href="/dashboard" role="button">Kembali ke Dashboard</a></footer></article>`;
  res.send(renderPage(`Riwayat ${patientUsername}`, bodyContent));
});

app.get("/verify/:hash", isAuthenticated, async (req, res) => {
  try {
    const ipfsHash = req.params.hash;
    const loggedInUser = req.session.user;
    const recordMetadata = readDb(dbPath)[ipfsHash];
    if (!recordMetadata)
      return res
        .status(404)
        .send(renderPage("Error", "<h2>Metadata tidak ditemukan.</h2>"));

    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      { timeout: 20000 }
    );
    const encryptedDataHex = response.data.data;

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(recordMetadata.encryptionKey, "hex"),
      Buffer.from(recordMetadata.iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(recordMetadata.authTag, "hex"));
    const decryptedJson = Buffer.concat([
      decipher.update(Buffer.from(encryptedDataHex, "hex")),
      decipher.final(),
    ]).toString("utf8");
    const record = JSON.parse(decryptedJson);

    const isOwner =
      loggedInUser.role === "pasien" &&
      loggedInUser.username === record.patientUsername;
    const isTreatingDoctor =
      loggedInUser.role === "dokter" &&
      loggedInUser.username === record.doctorUsername;

    if (!isOwner && !isTreatingDoctor) {
      return res
        .status(403)
        .send(renderPage("Error", "<h2>Akses Ditolak.</h2>"));
    }

    const detailBody = `<article><header><h2>Detail Rekam Medis (dari IPFS)</h2></header><p><strong>Username Pasien:</strong> ${
      record.patientUsername
    }</p><p><strong>Ditangani oleh:</strong> dr. ${
      record.doctorUsername
    }</p><p><strong>Tanggal Periksa:</strong> ${
      record.date
    }</p><hr><h4>Anamnesis</h4><p><strong>Keluhan Utama:</strong> ${
      record.anamnesis.keluhanUtama
    }</p><h4>Pemeriksaan Fisik</h4><p><strong>Tekanan Darah:</strong> ${
      record.pemeriksaanFisik.tekananDarah || "N/A"
    }</p><p><strong>Suhu Tubuh:</strong> ${
      record.pemeriksaanFisik.suhu || "N/A"
    }</p><p><strong>Pemeriksaan Lainnya:</strong> ${
      record.pemeriksaanFisik.pemeriksaanLain || "N/A"
    }</p><h4>Diagnosis & Penatalaksanaan</h4><p><strong>Diagnosis Kerja:</strong> ${
      record.diagnosis.diagnosisKerja
    }</p><p><strong>Kode ICD-10:</strong> ${
      record.diagnosis.kodeICD10 || "N/A"
    }</p><p><strong>Penatalaksanaan/Resep:</strong> ${
      record.penatalaksanaan.treatment
    }</p><hr><p><strong>Hash IPFS (CID):</strong><br><code>${ipfsHash}</code></p><p><strong>Bukti Transaksi:</strong><br><a href="https://testnet.bscscan.com/tx/${
      recordMetadata.transactionHash
    }" target="_blank">${
      recordMetadata.transactionHash
    }</a></p><footer><a href="/dashboard" role="button">Kembali</a></footer></article>`;
    res.send(renderPage("Detail Rekam Medis", detailBody));
  } catch (error) {
    console.error("Error saat verify:", error);
    res
      .status(500)
      .send(
        renderPage(
          "Error",
          `<h2>Gagal mengambil atau mendekripsi data.</h2><p>${error.message}</p><p><small>Ini bisa terjadi jika IPFS gateway sedang lambat atau file belum tersebar di jaringan. Coba lagi dalam beberapa saat.</small></p>`
        )
      );
  }
});

app.get("/records", (req, res) => {
  const db = readDb(dbPath);
  let tableBody = "";
  for (const hash in db) {
    const record = db[hash];
    const txLink = record.transactionHash
      ? `<a href="https://testnet.bscscan.com/tx/${record.transactionHash}" target="_blank">Lihat</a>`
      : "N/A";
    tableBody += `<tr><td>${db[hash].timestamp}</td><td style="word-break: break-all;"><code>${hash}</code></td><td>${txLink}</td></tr>`;
  }
  const body = `<article><header><h2>Log Publik (Hash IPFS)</h2></header><table><thead><tr><th>Timestamp</th><th>Hash IPFS (CID)</th><th>Link BscScan</th></tr></thead><tbody>${tableBody}</tbody></table></article>`;
  res.send(renderPage("Log Publik", body));
});

// Start Server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  if (contractAddress === "GANTI_DENGAN_ALAMAT_KONTRAK_ANDA") {
    console.warn(
      "\n!!! PERINGATAN: Alamat kontrak di app.js belum diisi. !!!\n"
    );
  }
});
