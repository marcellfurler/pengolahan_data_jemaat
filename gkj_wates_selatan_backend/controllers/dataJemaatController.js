// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";

// ✅ Ambil semua data jemaat
export const getAllJemaat = (req, res) => {
  const query = `
    SELECT 
      j.NIK,
      j.namaLengkap,
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
      p.namaPepanthan,        
      l.namaPelayanan         
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

// ✅ Update data jemaat + pepanthan
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
    namaPepanthan, // ✅ tambahkan
  } = req.body;

  if (tanggalLahir && tanggalLahir.includes("T")) {
    tanggalLahir = tanggalLahir.split("T")[0];
  }

  // 🔹 Ambil data lama dulu untuk mencegah kehilangan data (seperti nomorTelepon & foto)
  const getOldDataQuery = `SELECT * FROM dataJemaat WHERE NIK = ?`;
  db.query(getOldDataQuery, [nik], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data lama" });
    if (results.length === 0)
      return res.status(404).json({ message: "Data jemaat tidak ditemukan" });

    const oldData = results[0];

    // 🔹 Jika nomorTelepon baru kosong, pakai nomor lama
    if (!nomorTelepon || nomorTelepon.trim() === "") {
      nomorTelepon = oldData.nomorTelepon;
    }

    // 🔹 Jika tidak upload foto baru, gunakan yang lama
    let finalFoto = oldData.foto;
    if (req.files?.foto?.[0]) {
      finalFoto = path.relative(process.cwd(), req.files.foto[0].path).replace(/\\/g, "/");
    }

    // 🔹 Update data jemaat
    const updateJemaatQuery = `
      UPDATE dataJemaat
      SET 
        namaLengkap=?, tempatLahir=?, tanggalLahir=?, jenisKelamin=?, agama=?, golonganDarah=?,
        wargaNegara=?, nomorTelepon=?, alamat=?, foto=?
      WHERE NIK=?
    `;

    db.query(
      updateJemaatQuery,
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
          console.error("❌ Gagal update data jemaat:", err2);
          return res.status(500).json({ message: "Gagal update data jemaat" });
        }

        // 🔹 Update tabel pepanthan (jika ada perubahan nama pepanthan)
        if (namaPepanthan && namaPepanthan.trim() !== "") {
          const checkPepanthanQuery = `SELECT * FROM dataPepanthan WHERE NIK = ?`;
          db.query(checkPepanthanQuery, [nik], (err3, resultPepanthan) => {
            if (err3) {
              console.error("❌ Gagal cek data pepanthan:", err3);
              return res.status(500).json({ message: "Gagal update data pepanthan" });
            }

            if (resultPepanthan.length > 0) {
              // Jika sudah ada, update
              const updatePepanthanQuery = `
                UPDATE dataPepanthan SET namaPepanthan=? WHERE NIK=?
              `;
              db.query(updatePepanthanQuery, [namaPepanthan, nik], (err4) => {
                if (err4) {
                  console.error("❌ Gagal update pepanthan:", err4);
                  return res.status(500).json({ message: "Gagal update data pepanthan" });
                }
                res.json({ message: "✅ Data jemaat & pepanthan berhasil diperbarui" });
              });
            } else {
              // Jika belum ada, tambahkan data pepanthan baru
              const insertPepanthanQuery = `
                INSERT INTO dataPepanthan (NIK, namaPepanthan) VALUES (?, ?)
              `;
              db.query(insertPepanthanQuery, [nik, namaPepanthan], (err5) => {
                if (err5) {
                  console.error("❌ Gagal tambah data pepanthan:", err5);
                  return res.status(500).json({ message: "Gagal tambah data pepanthan" });
                }
                res.json({ message: "✅ Data jemaat & pepanthan berhasil diperbarui" });
              });
            }
          });
        } else {
          res.json({ message: "✅ Data jemaat berhasil diperbarui" });
        }
      }
    );
  });
};
