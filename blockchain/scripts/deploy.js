const hre = require("hardhat");

async function main() {
  console.log("Deploying MedicalRecords contract...");

  // Menggunakan metode deployContract yang lebih baru dan stabil
  const medicalRecords = await hre.ethers.deployContract("MedicalRecords");

  // Menunggu hingga kontrak benar-benar selesai di-deploy di jaringan
  await medicalRecords.waitForDeployment();

  // Menggunakan .target untuk mendapatkan alamat, BUKAN .address
  console.log(`MedicalRecords contract deployed to: ${medicalRecords.target}`);
}

// Pola standar untuk menjalankan fungsi async dan menangani error
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});