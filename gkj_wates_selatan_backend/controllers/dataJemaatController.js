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
    namaLengkap,
    tempatLahir,
    tanggalLahir,
    jenisKelamin,
    agama,
    golonganDarah,
    wargaNegara,
    nomorTelepon,
    alamat,
  } = req.body;

  if (tanggalLahir && tanggalLahir.includes("T")) {
    tanggalLahir = tanggalLahir.split("T")[0];
  }

  // Ambil data lama dulu
  const getOldDataQuery = `SELECT * FROM dataJemaat WHERE NIK = ?`;
  db.query(getOldDataQuery, [nik], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data lama" });
    if (results.length === 0)
      return res.status(404).json({ message: "Data jemaat tidak ditemukan" });

    const oldData = results[0];

    // Kalau nomorTelepon baru kosong/null, gunakan yang lama
    if (!nomorTelepon || nomorTelepon.trim() === "") {
      nomorTelepon = oldData.nomorTelepon;
    }

    let finalFoto = oldData.foto;
    if (req.files?.foto?.[0]) {
      finalFoto = path
        .relative(process.cwd(), req.files.foto[0].path)
        .replace(/\\/g, "/");
    }

    const updateQuery = `
      UPDATE dataJemaat
      SET 
        namaLengkap=?, tempatLahir=?, tanggalLahir=?, jenisKelamin=?, agama=?, golonganDarah=?,
        wargaNegara=?, nomorTelepon=?, alamat=?, foto=?
      WHERE NIK=?
    `;

    db.query(
      updateQuery,
      [
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        agama,
        golonganDarah,
        wargaNegara,
        nomorTelepon,
        alamat,
        finalFoto,
        nik,
      ],
      (err2) => {
        if (err2) {
          console.error("Error update:", err2);
          return res.status(500).json({ message: "Gagal update data jemaat" });
        }

        // Sertifikat (tetap sama)
        res.json({ message: "✅ Data jemaat berhasil diperbarui" });
      }
    );
  });
};


