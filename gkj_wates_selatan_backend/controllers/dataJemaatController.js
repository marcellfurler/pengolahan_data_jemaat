// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";
import fs from "fs";

// ===================================================
// AMBIL SEMUA DATA JEMAAT + RELASI
// ===================================================
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
      b.sertifikatBaptis,
      s.sertifikatSidi,
      n.sertifikatNikah,
      p.namaPepanthan,        
      l.namaPelayanan,
      pe.namaPekerjaan,
      pe.jabatan,
      pd.kodeRiwayatPendidikan,
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
    if (err) return res.status(500).json({ message: "Gagal mengambil data jemaat" });

    const jemaatMap = {};
    results.forEach((row) => {
      if (!jemaatMap[row.NIK]) {
        jemaatMap[row.NIK] = { ...row, pendidikanList: [] };
      }

      if (row.jenjangPendidikan) {
        jemaatMap[row.NIK].pendidikanList.push({
          kodeRiwayatPendidikan: row.kodeRiwayatPendidikan,
          jenjangPendidikan: row.jenjangPendidikan,
          namaInstitusi: row.namaInstitusi,
          tahunLulus: row.tahunLulus,
        });
      }

      delete jemaatMap[row.NIK].jenjangPendidikan;
      delete jemaatMap[row.NIK].namaInstitusi;
      delete jemaatMap[row.NIK].tahunLulus;
      delete jemaatMap[row.NIK].kodeRiwayatPendidikan;
    });

    res.json(Object.values(jemaatMap));
  });
};

// ===================================================
// UPDATE DATA JEMAAT LENGKAP
// ===================================================
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
    namaPekerjaan,
    jabatan,
    namaPelayanan,
  } = req.body;

  if (tanggalLahir?.includes("T")) {
    tanggalLahir = tanggalLahir.split("T")[0];
  }

  db.query(`SELECT * FROM dataJemaat WHERE NIK=?`, [nik], async (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data lama" });
    if (results.length === 0)
      return res.status(404).json({ message: "Data jemaat tidak ditemukan" });

    const oldData = results[0];
    nomorTelepon = nomorTelepon?.trim() || oldData.nomorTelepon;

    // FOTO
    let finalFoto = oldData.foto;
    if (req.files?.foto?.[0]) {
      finalFoto = path.relative(process.cwd(), req.files.foto[0].path).replace(/\\/g, "/");
    }

    // UPDATE DATA JEMAAT
    const updateJemaatQuery = `
      UPDATE dataJemaat
      SET namaLengkap=?, tempatLahir=?, tanggalLahir=?, jenisKelamin=?, agama=?, golonganDarah=?,
          wargaNegara=?, nomorTelepon=?, alamat=?, foto=?
      WHERE NIK=?`;

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
        nik,
      ],
      async (err2) => {
        if (err2) return res.status(500).json({ message: "Gagal update data jemaat" });

        try {
          const promisePool = db.promise();

          // --- UPDATE/INSERT pepanthan ---
          if (namaPepanthan?.trim()) {
            const [rows] = await promisePool.query(`SELECT * FROM dataPepanthan WHERE NIK=?`, [nik]);
            if (rows.length) {
              await promisePool.query(`UPDATE dataPepanthan SET namaPepanthan=? WHERE NIK=?`, [namaPepanthan, nik]);
            } else {
              await promisePool.query(`INSERT INTO dataPepanthan (NIK, namaPepanthan) VALUES (?, ?)`, [nik, namaPepanthan]);
            }
          }

          // --- UPDATE/INSERT pelayanan ---
          if (namaPelayanan?.trim()) {
            const [rows] = await promisePool.query(`SELECT * FROM dataPelayanan WHERE NIK=?`, [nik]);
            if (rows.length) {
              await promisePool.query(`UPDATE dataPelayanan SET namaPelayanan=? WHERE NIK=?`, [namaPelayanan, nik]);
            } else {
              await promisePool.query(`INSERT INTO dataPelayanan (NIK, namaPelayanan) VALUES (?, ?)`, [nik, namaPelayanan]);
            }
          }

          // --- UPDATE/INSERT pekerjaan ---
          if (namaPekerjaan?.trim() || jabatan?.trim()) {
            const [rows] = await promisePool.query(`SELECT * FROM dataPekerjaan WHERE NIK=?`, [nik]);
            if (rows.length) {
              await promisePool.query(
                `UPDATE dataPekerjaan SET namaPekerjaan=?, jabatan=? WHERE NIK=?`,
                [namaPekerjaan || "", jabatan || "", nik]
              );
            } else {
              await promisePool.query(
                `INSERT INTO dataPekerjaan (NIK, namaPekerjaan, jabatan) VALUES (?, ?, ?)`,
                [nik, namaPekerjaan || "", jabatan || ""]
              );
            }
          }

          // --- PARSING pendidikanList ---
          let pendidikanList = [];
          if (req.body.pendidikanList) {
            let raw = req.body.pendidikanList;
            if (Array.isArray(raw)) {
              for (let item of raw) {
                try {
                  if (typeof item === "string") {
                    const parsed = JSON.parse(item);
                    if (Array.isArray(parsed)) pendidikanList.push(...parsed);
                    else pendidikanList.push(parsed);
                  } else if (typeof item === "object") {
                    pendidikanList.push(item);
                  }
                } catch {}
              }
            } else if (typeof raw === "string") {
              try { pendidikanList = JSON.parse(raw); } catch {}
            } else if (typeof raw === "object") {
              pendidikanList = [raw];
            }
          }

          // DELETE pendidikan lama
          const [oldRows] = await promisePool.query(
            `SELECT kodeRiwayatPendidikan FROM dataRiwayatPendidikan WHERE NIK=?`,
            [nik]
          );
          const oldIds = oldRows.map(r => r.kodeRiwayatPendidikan);
          const newIds = pendidikanList.filter(p => p.kodeRiwayatPendidikan).map(p => p.kodeRiwayatPendidikan);
          const idsToDelete = oldIds.filter(id => !newIds.includes(id));
          if (idsToDelete.length) {
            await promisePool.query(
              `DELETE FROM dataRiwayatPendidikan WHERE kodeRiwayatPendidikan IN (?) AND NIK=?`,
              [idsToDelete, nik]
            );
          }

          // UPDATE/INSERT pendidikan baru
          for (const p of pendidikanList) {
            const { kodeRiwayatPendidikan, jenjangPendidikan, namaInstitusi, tahunLulus } = p;
            if (kodeRiwayatPendidikan) {
              await promisePool.query(
                `UPDATE dataRiwayatPendidikan SET jenjangPendidikan=?, namaInstitusi=?, tahunLulus=? WHERE kodeRiwayatPendidikan=? AND NIK=?`,
                [jenjangPendidikan || "", namaInstitusi || "", tahunLulus || null, kodeRiwayatPendidikan, nik]
              );
            } else if (jenjangPendidikan?.trim() || namaInstitusi?.trim()) {
              await promisePool.query(
                `INSERT INTO dataRiwayatPendidikan (NIK, jenjangPendidikan, namaInstitusi, tahunLulus) VALUES (?, ?, ?, ?)`,
                [nik, jenjangPendidikan || "", namaInstitusi || "", tahunLulus || null]
              );
            }
          }

          // --- UPLOAD SERTIFIKAT & DELETE SEKALIGUS ---
          const sertifikatTypes = ["baptis", "sidi", "nikah"];

          // Parsing deleteStatuses sebelum loop
          let deleteStatuses = req.body.deleteStatus;
          if (typeof deleteStatuses === "string") {
            try { deleteStatuses = JSON.parse(deleteStatuses); } catch { deleteStatuses = [deleteStatuses]; }
          } else if (!Array.isArray(deleteStatuses)) deleteStatuses = [];

          for (const t of sertifikatTypes) {
            const columnMap = {
              baptis: { table: "dataBaptis", status: "statusBaptis", sertifikat: "sertifikatBaptis", defaultValue: "Belum Baptis", value: "Baptis" },
              sidi: { table: "dataSidi", status: "statusSidi", sertifikat: "sertifikatSidi", defaultValue: "Belum Sidi", value: "Sidi" },
              nikah: { table: "dataNikah", status: "statusNikah", sertifikat: "sertifikatNikah", defaultValue: "Belum Nikah", value: "Nikah" },
            };
            const { table, status, sertifikat, defaultValue, value } = columnMap[t];

            const toDelete = deleteStatuses.includes(t);

            let filePath = null;
            if (req.files?.[t]?.[0]) filePath = path.relative(process.cwd(), req.files[t][0].path).replace(/\\/g, "/");
            else if (req.files?.sertifikat?.[0] && (!req.body.statusType || req.body.statusType.toLowerCase() === t))
              filePath = path.relative(process.cwd(), req.files.sertifikat[0].path).replace(/\\/g, "/");

            if (toDelete) {
              // DELETE / reset sertifikat
              await promisePool.query(
                `INSERT INTO ${table} (NIK, ${status}, ${sertifikat}) VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE ${status}=?, ${sertifikat}=?`,
                [nik, defaultValue, null, defaultValue, null]
              );
            } else if (filePath) {
              // UPLOAD sertifikat baru
              const [rows] = await promisePool.query(`SELECT * FROM ${table} WHERE NIK=?`, [nik]);
              if (rows.length) {
                await promisePool.query(`UPDATE ${table} SET ${status}=?, ${sertifikat}=? WHERE NIK=?`, [value, filePath, nik]);
              } else {
                await promisePool.query(`INSERT INTO ${table} (NIK, ${status}, ${sertifikat}) VALUES (?, ?, ?)`, [nik, value, filePath]);
              }
            }
          }

          res.json({ message: "✅ Data jemaat berhasil diperbarui lengkap!" });
        } catch (error) {
          console.error("❌ Error saat update jemaat:", error);
          res.status(500).json({ message: "❌ Gagal update data jemaat" });
        }
      }
    );
  });
};
