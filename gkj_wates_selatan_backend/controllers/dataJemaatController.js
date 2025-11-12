// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";

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
    if (err) {
      console.error("❌ Gagal mengambil data jemaat:", err);
      return res.status(500).json({ message: "Gagal mengambil data jemaat" });
    }

    const jemaatMap = {};
    results.forEach((row) => {
      if (!jemaatMap[row.NIK]) {
        jemaatMap[row.NIK] = {
          ...row,
          pendidikanList: [],
        };
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
// UPDATE DATA JEMAAT LENGKAP (versi perbaikan aman)
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

  if (tanggalLahir && tanggalLahir.includes("T")) {
    tanggalLahir = tanggalLahir.split("T")[0];
  }

  db.query(`SELECT * FROM dataJemaat WHERE NIK=?`, [nik], async (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data lama" });
    if (results.length === 0)
      return res.status(404).json({ message: "Data jemaat tidak ditemukan" });

    const oldData = results[0];
    nomorTelepon = nomorTelepon?.trim() ? nomorTelepon : oldData.nomorTelepon;

    let finalFoto = oldData.foto;
    if (req.files?.foto?.[0]) {
      finalFoto = path.relative(process.cwd(), req.files.foto[0].path).replace(/\\/g, "/");
    }

    let sertifikatPath = null;
    if (req.files?.sertifikat?.[0]) {
      sertifikatPath = path.relative(process.cwd(), req.files.sertifikat[0].path).replace(/\\/g, "/");
    }

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
          if (namaPepanthan?.trim()) {
            await db.promise().query(`UPDATE dataPepanthan SET namaPepanthan=? WHERE NIK=?`, [namaPepanthan, nik]);
          }

          if (namaPelayanan?.trim()) {
            await db.promise().query(`UPDATE dataPelayanan SET namaPelayanan=? WHERE NIK=?`, [namaPelayanan, nik]);
          }

          if (namaPekerjaan?.trim() || jabatan?.trim()) {
            await db.promise().query(
              `UPDATE dataPekerjaan SET namaPekerjaan=?, jabatan=? WHERE NIK=?`,
              [namaPekerjaan || "", jabatan || "", nik]
            );
          }

          // =====================================================
          // PARSING pendidikanList (campuran JSON & object)
          // =====================================================
          console.log("📦 req.body.pendidikanList diterima:", req.body.pendidikanList);
          console.log("📦 Tipe data:", typeof req.body.pendidikanList);

          let pendidikanList = [];

          if (req.body.pendidikanList) {
            let raw = req.body.pendidikanList;

            if (Array.isArray(raw)) {
              for (let item of raw) {
                try {
                  if (typeof item === "string" && item.startsWith("[")) {
                    const parsed = JSON.parse(item);
                    if (Array.isArray(parsed)) pendidikanList.push(...parsed);
                  } else if (typeof item === "string" && item.startsWith("{")) {
                    pendidikanList.push(JSON.parse(item));
                  } else if (typeof item === "object") {
                    pendidikanList.push(item);
                  }
                } catch (e) {
                  console.warn("⚠️ Gagal parse item pendidikan:", item);
                }
              }
            } else if (typeof raw === "string") {
              try {
                pendidikanList = JSON.parse(raw);
              } catch {
                console.warn("⚠️ pendidikanList bukan JSON valid:", raw);
              }
            } else if (typeof raw === "object") {
              pendidikanList = [raw];
            }
          }

          console.log("✅ Parsed pendidikanList:", pendidikanList);

          // =====================================================
          // DELETE: Hapus pendidikan yang sudah tidak ada
          // =====================================================
          const [oldPendidikanRows] = await db.promise().query(
            `SELECT kodeRiwayatPendidikan FROM dataRiwayatPendidikan WHERE NIK=?`,
            [nik]
          );
          const oldIds = oldPendidikanRows.map((r) => r.kodeRiwayatPendidikan);
          const newIds = pendidikanList
            .filter((p) => p.kodeRiwayatPendidikan)
            .map((p) => p.kodeRiwayatPendidikan);

          const idsToDelete = oldIds.filter((id) => !newIds.includes(id));

          if (idsToDelete.length > 0) {
            console.log("🗑 Menghapus pendidikan lama:", idsToDelete);
            await db
              .promise()
              .query(
                `DELETE FROM dataRiwayatPendidikan WHERE kodeRiwayatPendidikan IN (?) AND NIK=?`,
                [idsToDelete, nik]
              );
          }

          // =====================================================
          // UPDATE / INSERT pendidikan baru
          // =====================================================
          if (Array.isArray(pendidikanList) && pendidikanList.length > 0) {
            for (const p of pendidikanList) {
              const { kodeRiwayatPendidikan, jenjangPendidikan, namaInstitusi, tahunLulus } = p;

              if (kodeRiwayatPendidikan) {
                await db.promise().query(
                  `UPDATE dataRiwayatPendidikan 
                   SET jenjangPendidikan=?, namaInstitusi=?, tahunLulus=?
                   WHERE kodeRiwayatPendidikan=? AND NIK=?`,
                  [jenjangPendidikan?.trim() || "", namaInstitusi?.trim() || "", tahunLulus || null, kodeRiwayatPendidikan, nik]
                );
              } else if (jenjangPendidikan?.trim() || namaInstitusi?.trim()) {
                await db.promise().query(
                  `INSERT INTO dataRiwayatPendidikan (NIK, jenjangPendidikan, namaInstitusi, tahunLulus)
                   VALUES (?, ?, ?, ?)`,
                  [nik, jenjangPendidikan || "", namaInstitusi || "", tahunLulus || null]
                );
              }
            }
          } else {
            console.log("⚠️ Tidak ada perubahan pendidikan — data lama tetap disimpan.");
          }

          // =====================================================
          // UPLOAD SERTIFIKAT (baptis, sidi, nikah)
          // =====================================================
          if (req.body.statusType && sertifikatPath) {
            const type = req.body.statusType.toLowerCase();

            if (type === "baptis") {
              await db.promise().query(
                `UPDATE dataBaptis SET statusBaptis='Baptis', sertifikat=? WHERE NIK=?`,
                [sertifikatPath, nik]
              );
            } else if (type === "sidi") {
              await db.promise().query(
                `UPDATE dataSidi SET statusSidi='Sidi', sertifikat=? WHERE NIK=?`,
                [sertifikatPath, nik]
              );
            } else if (type === "nikah") {
              await db.promise().query(
                `UPDATE dataNikah SET statusNikah='Menikah', sertifikat=? WHERE NIK=?`,
                [sertifikatPath, nik]
              );
            }
          }

          res.json({
            message: "✅ Data jemaat, pendidikan (update/insert/delete) berhasil diperbarui!",
          });
        } catch (error) {
          console.error("❌ Error saat update jemaat:", error);
          res.status(500).json({ message: "❌ Gagal update data jemaat dan pendidikan" });
        }
      }
    );
  });
};
