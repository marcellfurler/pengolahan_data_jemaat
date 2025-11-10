// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";

// ✅ Tambahkan fungsi ini (untuk ambil semua data jemaat)
// controllers/dataJemaatController.js
export const getAllJemaat = (req, res) => {
  const query = `
    SELECT 
      j.NIK,
      j.namaLengkap AS nama,
      j.tempatLahir,
      j.tanggalLahir,
      j.jenisKelamin,
      j.agama, 
      j.golonganDarah,
      j.wargaNegara,
      j.nomorTelepon,
      j.alamat,
      j.foto,
      b.statusBaptis,
      s.statusSidi,
      n.statusNikah,
      p.namaPepanthan,        -- ✅ ambil nama pepanthan
      l.namaPelayanan         -- ✅ ambil nama pelayanan
    FROM dataJemaat j
    LEFT JOIN dataBaptis b ON j.NIK = b.NIK
    LEFT JOIN dataSidi s ON j.NIK = s.NIK
    LEFT JOIN dataNikah n ON j.NIK = n.NIK
    LEFT JOIN dataPepanthan p ON j.NIK = p.NIK
    LEFT JOIN dataPelayanan l ON j.NIK = l.NIK
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data jemaat:", err);
      return res.status(500).json({ message: "Gagal mengambil data jemaat" });
    }

    res.json(results);
  });
};


// ✅ Fungsi untuk update data jemaat dan sertifikat
export const updateJemaat = (req, res) => {
  const { nik } = req.params;
  let {
    nama,
    tempatLahir,
    tanggalLahir,
    jenisKelamin,
    agama,
    golonganDarah,
    wargaNegara,
    telepon,
    alamat,
  } = req.body;

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
      finalFoto = path
        .relative(process.cwd(), req.files.foto[0].path)
        .replace(/\\/g, "/");
    }

    // Update data jemaat
    const updateQuery = `
      UPDATE dataJemaat
      SET namaLengkap=?, tempatLahir=?, tanggalLahir=?, jenisKelamin=?, agama=?, golonganDarah=?, 
          wargaNegara=?, nomorTelepon=?, alamat=?, foto=?
      WHERE NIK=?
    `;

    db.query(
      updateQuery,
      [
        nama,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        agama,
        golonganDarah,
        wargaNegara,
        telepon,
        alamat,
        finalFoto,
        nik,
      ],
      (err2) => {
        if (err2)
          return res.status(500).json({ message: "Gagal update data jemaat" });

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
            const filePathRel = path
              .relative(process.cwd(), req.files[field][0].path)
              .replace(/\\/g, "/");

            // Insert/update sertifikat + ubah status
            const statusField =
              field === "sertifikatBaptis"
                ? "statusBaptis"
                : field === "sertifikatSidi"
                ? "statusSidi"
                : "statusNikah";
            const statusValue =
              field === "sertifikatBaptis"
                ? "Baptis"
                : field === "sertifikatSidi"
                ? "Sidi"
                : "Menikah";

            const query = `
              INSERT INTO ${tableName} (NIK, ${field}, ${statusField})
              VALUES (?, ?, ?)
              ON DUPLICATE KEY UPDATE 
                ${field} = VALUES(${field}), 
                ${statusField} = VALUES(${statusField})
            `;
            updatePromises.push(
              new Promise((resolve, reject) => {
                db.query(query, [nik, filePathRel, statusValue], (err3) => {
                  if (err3) reject(err3);
                  else resolve();
                });
              })
            );
          }
        }

        Promise.all(updatePromises)
          .then(() =>
            res.json({
              message: "✅ Data jemaat dan sertifikat berhasil diperbarui",
            })
          )
          .catch((err) => {
            console.error("❌ Gagal update sertifikat:", err);
            res.status(500).json({ message: "Gagal update sertifikat" });
          });
      }
    );
  });
};
