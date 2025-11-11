// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";

// ===============================
// Ambil semua data jemaat lengkap
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
      pe.jabatan,
      pd.jenjangPendidikan,
      pd.namaInstitusi,
      pd.tahunLulus
    FROM dataJemaat j
    LEFT JOIN dataBaptis b ON j.NIK = b.NIK
    LEFT JOIN dataSidi s ON j.NIK = s.NIK
    LEFT JOIN dataNikah n ON j.NIK = n.NIK
    LEFT JOIN dataPepanthan p ON j.NIK = p.NIK
    LEFT JOIN dataPelayanan l ON j.NIK = l.NIK
    LEFT JOIN dataPekerjaan pe ON j.NIK = pe.NIK
    LEFT JOIN dataRiwayatPendidikan pd ON j.NIK = pd.NIK
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil data jemaat:", err);
      return res.status(500).json({ message: "Gagal mengambil data jemaat" });
    }

    const jemaatMap = {};
    results.forEach(row => {
      if (!jemaatMap[row.NIK]) {
        jemaatMap[row.NIK] = {
          ...row,
          pendidikanList: []
        };
      }
      if (row.jenjangPendidikan) {
        jemaatMap[row.NIK].pendidikanList.push({
          jenjangPendidikan: row.jenjangPendidikan,
          namaInstitusi: row.namaInstitusi,
          tahunLulus: row.tahunLulus
        });
      }
      delete jemaatMap[row.NIK].jenjangPendidikan;
      delete jemaatMap[row.NIK].namaInstitusi;
      delete jemaatMap[row.NIK].tahunLulus;
    });

    res.json(Object.values(jemaatMap));
  });
};

// ===============================
// Update data jemaat lengkap
// ===============================
export const updateJemaat = (req, res) => {
  const { nik } = req.params;

  // Ambil semua field dari body
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
    namaPelayanan,
    pendidikanList, // array atau JSON string
  } = req.body;

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
      async (err2) => {
        if (err2) return res.status(500).json({ message: "Gagal update data jemaat" });

        try {
          // =======================
          // 2️⃣ Update Pepanthan
          // =======================
          if (namaPepanthan?.trim()) {
            await new Promise((resolve, reject) => {
              db.query(`SELECT * FROM dataPepanthan WHERE NIK=?`, [nik], (err, rows) => {
                if (err) return reject(err);
                if (rows.length > 0) {
                  db.query(`UPDATE dataPepanthan SET namaPepanthan=? WHERE NIK=?`, [namaPepanthan, nik], e => e ? reject(e) : resolve());
                } else {
                  db.query(`INSERT INTO dataPepanthan (NIK, namaPepanthan) VALUES (?, ?)`, [nik, namaPepanthan], e => e ? reject(e) : resolve());
                }
              });
            });
          }

          // =======================
          // 3️⃣ Update status gerejawi
          // =======================
          if (statusType) {
            const tableMap = {
              baptis: { table: "dataBaptis", columnStatus: "statusBaptis", columnFile: "sertifikatBaptis" },
              sidi: { table: "dataSidi", columnStatus: "statusSidi", columnFile: "sertifikatSidi" },
              nikah: { table: "dataNikah", columnStatus: "statusNikah", columnFile: "sertifikatNikah" }
            };
            const { table, columnStatus, columnFile } = tableMap[statusType];
            const sertifikatPath = req.files?.sertifikat?.[0] 
              ? path.relative(process.cwd(), req.files.sertifikat[0].path).replace(/\\/g,"/") 
              : null;
            const statusValue = statusType==="baptis"?"Baptis":statusType==="sidi"?"Sidi":"Menikah";

            await new Promise((resolve, reject) => {
              db.query(`SELECT * FROM ${table} WHERE NIK=?`, [nik], (err, rows) => {
                if (err) return reject(err);
                if (rows.length > 0) {
                  const queryUpdate = sertifikatPath 
                    ? `UPDATE ${table} SET ${columnStatus}=?, ${columnFile}=? WHERE NIK=?`
                    : `UPDATE ${table} SET ${columnStatus}=? WHERE NIK=?`;
                  const params = sertifikatPath ? [statusValue, sertifikatPath, nik] : [statusValue, nik];
                  db.query(queryUpdate, params, e => e ? reject(e) : resolve());
                } else {
                  db.query(`INSERT INTO ${table} (NIK, ${columnStatus}, ${columnFile}) VALUES (?, ?, ?)`,
                    [nik, statusValue, sertifikatPath || ""], e => e ? reject(e) : resolve());
                }
              });
            });
          }

          // =======================
          // 4️⃣ Update pekerjaan
          // =======================
          if (namaPekerjaan?.trim() || jabatan?.trim()) {
            await new Promise((resolve, reject) => {
              db.query(`SELECT * FROM dataPekerjaan WHERE NIK=?`, [nik], (err, rows) => {
                if (err) return reject(err);
                if (rows.length > 0) {
                  db.query(`UPDATE dataPekerjaan SET namaPekerjaan=?, jabatan=? WHERE NIK=?`,
                    [namaPekerjaan || "", jabatan || "", nik], e => e ? reject(e) : resolve());
                } else {
                  db.query(`INSERT INTO dataPekerjaan (NIK, namaPekerjaan, jabatan) VALUES (?, ?, ?)`,
                    [nik, namaPekerjaan || "", jabatan || ""], e => e ? reject(e) : resolve());
                }
              });
            });
          }

          // =======================
          // 5️⃣ Update pelayanan
          // =======================
          if (namaPelayanan?.trim()) {
            await new Promise((resolve, reject) => {
              db.query(`SELECT * FROM dataPelayanan WHERE NIK=?`, [nik], (err, rows) => {
                if (err) return reject(err);
                if (rows.length > 0) {
                  db.query(`UPDATE dataPelayanan SET namaPelayanan=? WHERE NIK=?`, [namaPelayanan, nik], e => e ? reject(e) : resolve());
                } else {
                  db.query(`INSERT INTO dataPelayanan (NIK, namaPelayanan) VALUES (?, ?)`, [nik, namaPelayanan], e => e ? reject(e) : resolve());
                }
              });
            });
          }

          // =======================
          // 6️⃣ Update pendidikan (hapus dulu semua lama, lalu insert baru)
          // =======================
          try {
            pendidikanList = typeof pendidikanList === "string" ? JSON.parse(pendidikanList) : pendidikanList;
          } catch {
            pendidikanList = [];
          }

          if (pendidikanList?.length) {
            await new Promise((resolve, reject) => {
              db.query(`DELETE FROM dataRiwayatPendidikan WHERE NIK=?`, [nik], (err) => {
                if (err) return reject(err);
                const promises = pendidikanList.map(p => new Promise((res, rej) => {
                  db.query(
                    `INSERT INTO dataRiwayatPendidikan (NIK, jenjangPendidikan, namaInstitusi, tahunLulus) VALUES (?, ?, ?, ?)`,
                    [nik, p.jenjangPendidikan || "", p.namaInstitusi || "", p.tahunLulus || ""],
                    e => e ? rej(e) : res()
                  );
                }));
                Promise.all(promises).then(() => resolve()).catch(reject);
              });
            });
          }

          res.json({ message: "✅ Data jemaat lengkap berhasil diperbarui" });

        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Gagal update data jemaat" });
        }
      }
    );
  });
};
