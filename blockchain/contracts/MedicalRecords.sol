// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title MedicalRecords
 * @dev Kontrak ini menyimpan hash dari rekam medis untuk verifikasi integritas.
 * Hash berfungsi sebagai bukti bahwa sebuah data telah dicatat pada waktu tertentu.
 */
contract MedicalRecords {
    // Mapping dari hash (string) ke status boolean (true jika ada).
    // 'public' agar kita bisa mengeceknya dari luar.
    mapping(string => bool) public records;

    // Event untuk memberitahu ketika ada hash baru yang ditambahkan.
    event RecordAdded(string indexed recordHash, address indexed addedBy, uint timestamp);

    /**
     * @dev Menambahkan hash rekam medis baru ke blockchain.
     * @param _recordHash Hash SHA-256 dari data rekam medis.
     */
    function addRecord(string memory _recordHash) public {
        // Memastikan hash belum pernah ditambahkan sebelumnya untuk menghindari duplikasi.
        require(!records[_recordHash], "Record hash already exists.");

        // Menyimpan hash ke dalam mapping.
        records[_recordHash] = true;

        // Memicu event.
        emit RecordAdded(_recordHash, msg.sender, block.timestamp);
    }
}