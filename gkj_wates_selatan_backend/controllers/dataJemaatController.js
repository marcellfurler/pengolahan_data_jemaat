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
// Pastikan folder sertifikat/foto ada
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

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
            let namaPelayananStr = "";

            if (Array.isArray(namaPelayanan)) {
              namaPelayananStr = namaPelayanan.join(", ");
            } else if (typeof namaPelayanan === "string") {
              try {
                const parsed = JSON.parse(namaPelayanan);
                if (Array.isArray(parsed)) namaPelayananStr = parsed.join(", ");
                else namaPelayananStr = parsed;
              } catch {
                namaPelayananStr = namaPelayanan;
              }
            }

            const [rows] = await promisePool.query(`SELECT * FROM dataPelayanan WHERE NIK=?`, [nik]);
            if (rows.length) {
              await promisePool.query(`UPDATE dataPelayanan SET namaPelayanan=? WHERE NIK=?`, [namaPelayananStr, nik]);
            } else {
              await promisePool.query(`INSERT INTO dataPelayanan (NIK, namaPelayanan) VALUES (?, ?)`, [nik, namaPelayananStr]);
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

          // --- UPLOAD/UPDATE SERTIFIKAT BAPTIS, SIDI, NIKAH ---
          let deleteStatuses = req.body.deleteStatus;
          if (typeof deleteStatuses === "string") {
            try { deleteStatuses = JSON.parse(deleteStatuses); } catch { deleteStatuses = [deleteStatuses]; }
          } else if (!Array.isArray(deleteStatuses)) deleteStatuses = [];

          const sertifikatTypes = ["baptis", "sidi", "nikah"];
          const columnMap = {
            baptis: { table: "dataBaptis", status: "statusBaptis", sertifikat: "sertifikatBaptis", defaultValue: "Belum Baptis", value: "Baptis" },
            sidi: { table: "dataSidi", status: "statusSidi", sertifikat: "sertifikatSidi", defaultValue: "Belum Sidi", value: "Sidi" },
            nikah: { table: "dataNikah", status: "statusNikah", sertifikat: "sertifikatNikah", defaultValue: "Belum Nikah", value: "Nikah" },
          };

          // mapping field upload
          const fileMap = {
            baptis: req.files?.sertifikatBaptis?.[0],
            sidi: req.files?.sertifikatSidi?.[0],
            nikah: req.files?.sertifikatNikah?.[0],
          };

          for (const t of sertifikatTypes) {
            const { table, status, sertifikat, defaultValue, value } = columnMap[t];

            const filePath = fileMap[t] ? path.relative(process.cwd(), fileMap[t].path).replace(/\\/g, "/") : null;
            const toDelete = deleteStatuses.includes(t);

            // Ambil data lama
            const [existing] = await promisePool.query(`SELECT ${status}, ${sertifikat} FROM ${table} WHERE NIK=?`, [nik]);
            let currentStatus = existing.length ? existing[0][status] : defaultValue;
            let currentSertifikat = existing.length ? existing[0][sertifikat] : null;

            let newStatus = currentStatus;
            let newSertifikat = currentSertifikat;

            if (toDelete) {
              newStatus = defaultValue;
              newSertifikat = null;
            } else if (filePath) {
              newStatus = value; // update status hanya jika ada file
              newSertifikat = filePath;
            }

            // INSERT/UPDATE hanya jika ada perubahan
            if (filePath || toDelete) {
              await promisePool.query(
                `INSERT INTO ${table} (NIK, ${status}, ${sertifikat})
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE ${status}=VALUES(${status}), ${sertifikat}=VALUES(${sertifikat})`,
                [nik, newStatus, newSertifikat]
              );
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


// Tambah Jemaat
export const tambahJemaat = (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  try {
    // =====================
    // Ambil data dari body
    // =====================
      const {
    namaLengkap,
    nik,
    alamat,
    tempatLahir,
    tanggalLahir,
    jenisKelamin,
    agama,
    golonganDarah,
    nomorTelepon,
    pepanthan,
    namaPelayanan, // <- ambil langsung
    statusNikah,
    statusSidi,
    statusBaptis,
    namaPekerjaan,
    jabatan,
  } = req.body;

    // =====================
    // Ambil file upload + atur path lengkap
    // =====================
    const foto = req.files?.foto?.[0] ? `uploads/fotoProfil/${req.files.foto[0].filename}` : null;
    const sertifikatNikah = req.files?.sertifikatNikah?.[0] ? `uploads/sertifikat/nikah/${req.files.sertifikatNikah[0].filename}` : null;
    const sertifikatSidi = req.files?.sertifikatSidi?.[0] ? `uploads/sertifikat/sidi/${req.files.sertifikatSidi[0].filename}` : null;
    const sertifikatBaptis = req.files?.sertifikatBaptis?.[0] ? `uploads/sertifikat/baptis/${req.files.sertifikatBaptis[0].filename}` : null;

    // =====================
    // Parsing data dinamis
    // =====================
    const pendidikanList = req.body.pendidikan ? JSON.parse(req.body.pendidikan) : [];
    const pelayanan = req.body.dataPelayanan ? JSON.parse(req.body.dataPelayanan) : {};

    // =====================
    // INSERT dataJemaat
    // =====================
    const queryJemaat = `
      INSERT INTO dataJemaat 
      (NIK, namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      queryJemaat,
      [nik, namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto],
      (err) => {
        if (err) {
          console.error("Error INSERT dataJemaat:", err);
          return res.status(500).json({ message: "Gagal menambah data jemaat", err });
        }

        // =====================
        // INSERT status nikah
        // =====================
        if (statusNikah) {
          db.query(
            `INSERT INTO dataNikah (NIK, statusNikah, sertifikatNikah) VALUES (?, ?, ?)`,
            [nik, statusNikah, sertifikatNikah],
            (err) => {
              if (err) console.error("Error INSERT dataNikah:", err);
            }
          );
        }

        // =====================
        // INSERT status sidi
        // =====================
        if (statusSidi) {
          db.query(
            `INSERT INTO dataSidi (NIK, statusSidi, sertifikatSidi) VALUES (?, ?, ?)`,
            [nik, statusSidi, sertifikatSidi],
            (err) => {
              if (err) console.error("Error INSERT dataSidi:", err);
            }
          );
        }

        // =====================
        // INSERT status baptis
        // =====================
        if (statusBaptis) {
          db.query(
            `INSERT INTO dataBaptis (NIK, statusBaptis, sertifikatBaptis) VALUES (?, ?, ?)`,
            [nik, statusBaptis, sertifikatBaptis],
            (err) => {
              if (err) console.error("Error INSERT dataBaptis:", err);
            }
          );
        }

        // =====================
        // INSERT pepanthan
        // =====================
        if (pepanthan) {
          db.query(
            `INSERT INTO dataPepanthan (NIK, namaPepanthan) VALUES (?, ?)`,
            [nik, pepanthan],
            (err) => {
              if (err) console.error("Error INSERT dataPepanthan:", err);
            }
          );
        }


        // =====================
        // INSERT pelayanan (jika Pendeta / Majelis / Koor)
        // =====================
        if (namaPelayanan) {
          let namaPelayananStr = "";

          if (Array.isArray(namaPelayanan)) {
            // Ambil elemen pertama saja
            namaPelayananStr = namaPelayanan[0];
          } else if (typeof namaPelayanan === "string") {
            try {
              const parsed = JSON.parse(namaPelayanan); // parse JSON string
              if (Array.isArray(parsed)) {
                namaPelayananStr = parsed[0]; // ambil elemen pertama saja
              } else {
                namaPelayananStr = parsed; // string tunggal
              }
            } catch {
              namaPelayananStr = namaPelayanan; // string biasa
            }
          }

          // Hapus tanda kutip yang mungkin tersisa
          namaPelayananStr = namaPelayananStr.replace(/^["']?(.*?)["']?$/, "$1");

          const queryPelayanan = `
            INSERT INTO dataPelayanan (NIK, namaPelayanan)
            VALUES (?, ?)
          `;
          db.query(queryPelayanan, [nik, namaPelayananStr], (err) => {
            if (err) console.error("Error INSERT dataPelayanan:", err);
          });
        }






        // =====================
        // INSERT PENDIDIKAN LIST
        // =====================
        pendidikanList.forEach((p) => {
          db.query(
            `INSERT INTO dataRiwayatPendidikan (NIK, jenjangPendidikan, namaInstitusi, tahunLulus)
             VALUES (?, ?, ?, ?)`,
            [nik, p.jenjangPendidikan, p.namaInstitusi, p.tahunLulus],
            (err) => {
              if (err) console.error("Error INSERT dataRiwayatPendidikan:", err);
            }
          );
        });

        // =====================
        // INSERT PEKERJAAN
        // =====================
        if (namaPekerjaan) {
          const queryPekerjaan = `
            INSERT INTO dataPekerjaan (NIK, namaPekerjaan, jabatan)
            VALUES (?, ?, ?)
          `;
          db.query(queryPekerjaan, [nik, namaPekerjaan, jabatan || ""], (err) => {
            if (err) console.error("Error INSERT dataPekerjaan:", err);
          });
        }

        // =====================
        // RESPONSE SUCCESS
        // =====================
        return res.status(201).json({ message: "Data jemaat berhasil ditambahkan." });
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server", error });
  }
};