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
// controllers/dataJemaatController.js
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
    namaPepanthan,
    statusBaptis,
    statusSidi,
    statusNikah,
  } = req.body;

  if (tanggalLahir && tanggalLahir.includes("T")) {
    tanggalLahir = tanggalLahir.split("T")[0];
  }

  // Ambil data lama
  const getOldDataQuery = `SELECT * FROM dataJemaat WHERE NIK = ?`;
  db.query(getOldDataQuery, [nik], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data lama" });
    if (results.length === 0)
      return res.status(404).json({ message: "Data jemaat tidak ditemukan" });

    const oldData = results[0];
    nomorTelepon = nomorTelepon?.trim() ? nomorTelepon : oldData.nomorTelepon;

    let finalFoto = oldData.foto;
    if (req.files?.foto?.[0]) {
      finalFoto = path.relative(process.cwd(), req.files.foto[0].path).replace(/\\/g, "/");
    }

    // 1️⃣ Update data jemaat utama
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
        if (err2) return res.status(500).json({ message: "Gagal update data jemaat" });

        // 2️⃣ Update Pepanthan
        const updatePepanthan = () => {
          if (!namaPepanthan?.trim()) return Promise.resolve();
          return new Promise((resolve, reject) => {
            const checkQuery = `SELECT * FROM dataPepanthan WHERE NIK=?`;
            db.query(checkQuery, [nik], (err3, result) => {
              if (err3) return reject(err3);
              if (result.length > 0) {
                db.query(`UPDATE dataPepanthan SET namaPepanthan=? WHERE NIK=?`, [namaPepanthan, nik], (err4) => {
                  if (err4) reject(err4);
                  else resolve();
                });
              } else {
                db.query(`INSERT INTO dataPepanthan (NIK, namaPepanthan) VALUES (?, ?)`, [nik, namaPepanthan], (err4) => {
                  if (err4) reject(err4);
                  else resolve();
                });
              }
            });
          });
        };

        // 3️⃣ Update status gerejawi
        const updateStatus = (statusType) => {
          if (!statusType || !req.files?.sertifikat?.[0]) return Promise.resolve();

          const sertifikatPath = path.relative(process.cwd(), req.files.sertifikat[0].path).replace(/\\/g, "/");

          let table, columnStatus, columnFile;
          if (statusType === "baptis") {
            table = "dataBaptis";
            columnStatus = "statusBaptis";
            columnFile = "sertifikatBaptis";
          }
          if (statusType === "sidi") {
            table = "dataSidi";
            columnStatus = "statusSidi";
            columnFile = "sertifikatSidi";
          }
          if (statusType === "nikah") {
            table = "dataNikah";
            columnStatus = "statusNikah";
            columnFile = "sertifikatNikah";
          }

          return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table} WHERE NIK=?`, [nik], (err, result) => {
              if (err) return reject(err);

              const statusValue =
                statusType === "baptis"
                  ? "Baptis"
                  : statusType === "sidi"
                  ? "Sidi"
                  : statusType === "nikah"
                  ? "Menikah"
                  : "";

              if (result.length > 0) {
                // Update jika sudah ada
                const updateQuery = `UPDATE ${table} SET ${columnStatus}=?, ${columnFile}=? WHERE NIK=?`;
                db.query(updateQuery, [statusValue, sertifikatPath, nik], (err2) =>
                  err2 ? reject(err2) : resolve()
                );
              } else {
                // Insert baru jika belum ada
                const insertQuery = `INSERT INTO ${table} (NIK, ${columnStatus}, ${columnFile}) VALUES (?, ?, ?)`;
                db.query(insertQuery, [nik, statusValue, sertifikatPath], (err2) =>
                  err2 ? reject(err2) : resolve()
                );
              }
            });
          });
        };


        // 4️⃣ Jalankan semuanya
        (async () => {
          try {
            await updatePepanthan();
            await updateStatus(req.body.statusType);
            res.json({ message: "✅ Data jemaat & status gerejawi berhasil diperbarui" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal update status gerejawi" });
          }
        })();
      }
    );
  });
};

