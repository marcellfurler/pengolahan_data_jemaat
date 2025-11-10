// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";

export const updateJemaat = (req, res) => {
  const { nik } = req.params;
  let { nama, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, wargaNegara, telepon, alamat } = req.body;

  // Format tanggal MySQL
  if (tanggalLahir && tanggalLahir.includes("T")) {
    tanggalLahir = tanggalLahir.split("T")[0];
  }

  // Ambil foto lama
  db.query("SELECT foto FROM dataJemaat WHERE NIK = ?", [nik], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data lama" });

    const oldFoto = results[0]?.foto || "";
    let finalFoto = oldFoto;

    // Jika ada upload baru, gunakan path relatif
    if (req.files?.foto?.[0]) {
      finalFoto = path.relative(process.cwd(), req.files.foto[0].path).replace(/\\/g, "/");
    }

    // Update data jemaat
    const updateQuery = `
      UPDATE dataJemaat
      SET namaLengkap=?, tempatLahir=?, tanggalLahir=?, jenisKelamin=?, agama=?, golonganDarah=?, 
          wargaNegara=?, nomorTelepon=?, alamat=?, foto=?
      WHERE NIK=?
    `;

    db.query(updateQuery, [nama, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, wargaNegara, telepon, alamat, finalFoto, nik], (err2) => {
      if (err2) return res.status(500).json({ message: "Gagal update data jemaat" });

      // Handle semua sertifikat sekaligus
      const sertifikatMap = {
        sertifikatSidi: "dataSidi",
        sertifikatBaptis: "dataBaptis",
        sertifikatNikah: "dataNikah",
      };

      const updatePromises = [];

      for (const field in sertifikatMap) {
        const tableName = sertifikatMap[field];
        if (req.files?.[field]?.[0]) {
          const filePathRel = path.relative(process.cwd(), req.files[field][0].path).replace(/\\/g, "/");
          const query = `
            INSERT INTO ${tableName} (NIK, ${field})
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE ${field} = VALUES(${field})
          `;
          updatePromises.push(new Promise((resolve, reject) => {
            db.query(query, [nik, filePathRel], (err3) => {
              if (err3) reject(err3);
              else resolve();
            });
          }));
        }
      }

      // Jalankan semua update sertifikat
      Promise.all(updatePromises)
        .then(() => res.json({ message: "✅ Data jemaat dan sertifikat berhasil diperbarui" }))
        .catch((err) => {
          console.error("❌ Gagal update sertifikat:", err);
          res.status(500).json({ message: "Gagal update sertifikat" });
        });
    });
  });
};
