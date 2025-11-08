import { db } from "../config/db.js";

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
      p.namaPepanthan,
      s.statusSidi,
      b.statusBaptis,
      n.statusNikah,
      pl.namaPelayanan
    FROM dataJemaat j
    LEFT JOIN dataPepanthan p ON j.NIK = p.NIK
    LEFT JOIN dataSidi s ON j.NIK = s.NIK
    LEFT JOIN dataBaptis b ON j.NIK = b.NIK
    LEFT JOIN dataNikah n ON j.NIK = n.NIK
    LEFT JOIN dataPelayanan pl ON j.NIK = pl.NIK
    GROUP BY j.NIK, j.namaLengkap
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data jemaat:", err);
      res.status(500).json({ message: "Gagal mengambil data jemaat" });
    } else {
      res.json(results);
    }
  });
};
