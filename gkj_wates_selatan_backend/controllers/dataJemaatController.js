// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";

// ===============================
// Ambil semua data jemaat
// ===============================
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
      l.namaPelayanan,
      pe.namaPekerjaan,
      pe.jabatan
    FROM dataJemaat j
    LEFT JOIN dataBaptis b ON j.NIK = b.NIK
    LEFT JOIN dataSidi s ON j.NIK = s.NIK
    LEFT JOIN dataNikah n ON j.NIK = n.NIK
    LEFT JOIN dataPepanthan p ON j.NIK = p.NIK
    LEFT JOIN dataPelayanan l ON j.NIK = l.NIK
    LEFT JOIN dataPekerjaan pe ON j.NIK = pe.NIK
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data jemaat:", err);
      return res.status(500).json({ message: "Gagal mengambil data jemaat" });
    }
    res.json(results);
  });
};

// ===============================
// Update data jemaat, status gerejawi, pekerjaan & pelayanan
// ===============================
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
    statusType,
    namaPekerjaan,
    jabatan,
    namaPelayanan
  } = req.body;

  // Format tanggal jika ada
  if (tanggalLahir && tanggalLahir.includes("T")) {
    tanggalLahir = tanggalLahir.split("T")[0];
  }

  // Ambil data lama
  db.query(`SELECT * FROM dataJemaat WHERE NIK=?`, [nik], (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data lama" });
    if (results.length === 0) return res.status(404).json({ message: "Data jemaat tidak ditemukan" });

    const oldData = results[0];
    nomorTelepon = nomorTelepon?.trim() ? nomorTelepon : oldData.nomorTelepon;

    let finalFoto = oldData.foto;
    if (req.files?.foto?.[0]) {
      finalFoto = path.relative(process.cwd(), req.files.foto[0].path).replace(/\\/g, "/");
    }

    // 1️⃣ Update data jemaat utama
    const updateJemaatQuery = `
      UPDATE dataJemaat
      SET namaLengkap=?, tempatLahir=?, tanggalLahir=?, jenisKelamin=?, agama=?, golonganDarah=?,
          wargaNegara=?, nomorTelepon=?, alamat=?, foto=?
      WHERE NIK=?
    `;
    db.query(
      updateJemaatQuery,
      [
        namaLengkap || oldData.namaLengkap,
        tempatLahir || oldData.tempatLahir,
        tanggalLahir || oldData.tanggalLahir,
        jenisKelamin || oldData.jenisKelamin,
        agama || oldData.agama,
        golonganDarah || oldData.golonganDarah,
        wargaNegara || oldData.wargaNegara,
        nomorTelepon,
        alamat || oldData.alamat,
        finalFoto,
        nik
      ],
      (err2) => {
        if (err2) return res.status(500).json({ message: "Gagal update data jemaat" });

        // 2️⃣ Update Pepanthan
        const updatePepanthan = () => {
          return new Promise((resolve, reject) => {
            if (!namaPepanthan?.trim()) return resolve();
            db.query(`SELECT * FROM dataPepanthan WHERE NIK=?`, [nik], (err, result) => {
              if (err) return reject(err);
              if (result.length > 0) {
                db.query(`UPDATE dataPepanthan SET namaPepanthan=? WHERE NIK=?`, [namaPepanthan, nik], (err2) => err2 ? reject(err2) : resolve());
              } else {
                db.query(`INSERT INTO dataPepanthan (NIK, namaPepanthan) VALUES (?, ?)`, [nik, namaPepanthan], (err2) => err2 ? reject(err2) : resolve());
              }
            });
          });
        };

        // 3️⃣ Update status gerejawi
        const updateStatus = () => {
          return new Promise((resolve, reject) => {
            if (!statusType) return resolve();

            let table, columnStatus, columnFile;
            if (statusType === "baptis") { table="dataBaptis"; columnStatus="statusBaptis"; columnFile="sertifikatBaptis"; }
            if (statusType === "sidi") { table="dataSidi"; columnStatus="statusSidi"; columnFile="sertifikatSidi"; }
            if (statusType === "nikah") { table="dataNikah"; columnStatus="statusNikah"; columnFile="sertifikatNikah"; }

            const sertifikatPath = req.files?.sertifikat?.[0] 
              ? path.relative(process.cwd(), req.files.sertifikat[0].path).replace(/\\/g,"/")
              : null;

            const statusValue = statusType==="baptis"?"Baptis":statusType==="sidi"?"Sidi":"Menikah";

            db.query(`SELECT * FROM ${table} WHERE NIK=?`, [nik], (err, result) => {
              if (err) return reject(err);

              if (result.length > 0) {
                const updateQuery = sertifikatPath 
                  ? `UPDATE ${table} SET ${columnStatus}=?, ${columnFile}=? WHERE NIK=?`
                  : `UPDATE ${table} SET ${columnStatus}=? WHERE NIK=?`;
                const params = sertifikatPath ? [statusValue, sertifikatPath, nik] : [statusValue, nik];
                db.query(updateQuery, params, (err2) => err2 ? reject(err2) : resolve());
              } else {
                const insertQuery = `INSERT INTO ${table} (NIK, ${columnStatus}, ${columnFile}) VALUES (?, ?, ?)`;
                db.query(insertQuery, [nik, statusValue, sertifikatPath || ""], (err2) => err2 ? reject(err2) : resolve());
              }
            });
          });
        };

        // 4️⃣ Update pekerjaan
        const updatePekerjaan = () => {
          return new Promise((resolve, reject) => {
            if (!namaPekerjaan?.trim() && !jabatan?.trim()) return resolve();

            db.query(`SELECT * FROM dataPekerjaan WHERE NIK=?`, [nik], (err, result) => {
              if (err) return reject(err);

              if (result.length > 0) {
                db.query(`UPDATE dataPekerjaan SET namaPekerjaan=?, jabatan=? WHERE NIK=?`,
                  [namaPekerjaan || "", jabatan || "", nik], (err2) => err2 ? reject(err2) : resolve());
              } else {
                db.query(`INSERT INTO dataPekerjaan (NIK, namaPekerjaan, jabatan) VALUES (?, ?, ?)`,
                  [nik, namaPekerjaan || "", jabatan || ""], (err2) => err2 ? reject(err2) : resolve());
              }
            });
          });
        };

        // 5️⃣ Update pelayanan
        const updatePelayanan = () => {
        return new Promise((resolve, reject) => {
          // Gunakan value frontend langsung, tidak skip
          const pelayananValue = namaPelayanan?.trim() || "";

          db.query(`SELECT * FROM dataPelayanan WHERE NIK=?`, [nik], (err, result) => {
            if (err) return reject(err);

            if (result.length > 0) {
              // UPDATE walaupun sebelumnya NULL atau "-"
              db.query(
                `UPDATE dataPelayanan SET namaPelayanan=? WHERE NIK=?`,
                [pelayananValue, nik],
                (err2) => (err2 ? reject(err2) : resolve())
              );
            } else {
              // INSERT walaupun sebelumnya NULL
              db.query(
                `INSERT INTO dataPelayanan (NIK, namaPelayanan) VALUES (?, ?)`,
                [nik, pelayananValue],
                (err2) => (err2 ? reject(err2) : resolve())
              );
            }
          });
        });
      };


        // 6️⃣ Jalankan semua update
        (async () => {
          try {
            await updatePepanthan();
            await updateStatus();
            await updatePekerjaan();
            await updatePelayanan();
            res.json({ message: "✅ Data jemaat, status gerejawi, pekerjaan & pelayanan berhasil diperbarui" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal update data jemaat" });
          }
        })();

      }
    );
  });
};
