// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";
import fs from "fs";
import { unlink } from "fs/promises"; 

// ===================================================
// AMBIL SEMUA DATA JEMAAT + RELASI
// ===================================================
// controllers/dataJemaatController.js
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
      b.sertifikatBaptis,
      s.statusSidi,
      s.sertifikatSidi,
      n.statusNikah,
      n.sertifikatNikah,
      p.namaPepanthan,        
      l.namaPelayanan,
      pe.namaPekerjaan,
      pe.jabatan,
      pd.kodeRiwayatPendidikan,
      pd.jenjangPendidikan,
      pd.namaInstitusi,
      pd.tahunLulus,
      dp.jabatan AS jabatanPendeta,
      dp.sertifikatPendeta,
      drp.namaGereja,
      drp.tahunMulai,
      drp.tahunSelesai
    FROM dataJemaat j
    LEFT JOIN dataBaptis b ON j.NIK = b.NIK
    LEFT JOIN dataSidi s ON j.NIK = s.NIK
    LEFT JOIN dataNikah n ON j.NIK = n.NIK
    LEFT JOIN dataPepanthan p ON j.NIK = p.NIK
    LEFT JOIN dataPelayanan l ON j.NIK = l.NIK
    LEFT JOIN dataPekerjaan pe ON j.NIK = pe.NIK
    LEFT JOIN dataRiwayatPendidikan pd ON j.NIK = pd.NIK
    LEFT JOIN dataPendeta dp ON j.NIK = dp.NIK
    LEFT JOIN dataRiwayatPendeta drp ON dp.kodePendeta = drp.kodePendeta
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error getAllJemaat:", err);
      return res.status(500).json({ message: "Gagal mengambil data jemaat", err });
    }

    // Mapping jemaat + pendidikanList
    const jemaatMap = {};
    results.forEach((row) => {
      if (!jemaatMap[row.NIK]) {
        jemaatMap[row.NIK] = {
          ...row,
          pendidikanList: [],
          riwayatPendetaList: [],
        };
      }

      // Pendidikan
      if (row.jenjangPendidikan) {
        jemaatMap[row.NIK].pendidikanList.push({
          kodeRiwayatPendidikan: row.kodeRiwayatPendidikan,
          jenjangPendidikan: row.jenjangPendidikan,
          namaInstitusi: row.namaInstitusi,
          tahunLulus: row.tahunLulus,
        });
      }

      // Riwayat Pendeta
      if (row.namaGereja) {
        jemaatMap[row.NIK].riwayatPendetaList.push({
          namaGereja: row.namaGereja,
          tahunMulai: row.tahunMulai,
          tahunSelesai: row.tahunSelesai,
        });
      }

      // Hapus field sementara
      delete jemaatMap[row.NIK].jenjangPendidikan;
      delete jemaatMap[row.NIK].namaInstitusi;
      delete jemaatMap[row.NIK].tahunLulus;
      delete jemaatMap[row.NIK].kodeRiwayatPendidikan;
      delete jemaatMap[row.NIK].namaGereja;
      delete jemaatMap[row.NIK].tahunMulai;
      delete jemaatMap[row.NIK].tahunSelesai;
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

// ===================================================
// DELETE DATA JEMAAT (Diperbaiki)
// ===================================================
export const hapusJemaat = async (req, res) => {
    const { nik } = req.params;

    if (!nik) return res.status(400).json({ message: "NIK tidak diberikan" });

    const promisePool = db.promise();
    
    // Daftar tabel anak yang menggunakan NIK sebagai foreign key
    const tablesUsingNIK = [
        "dataBaptis", "dataSidi", "dataNikah", "dataPepanthan",
        "dataPelayanan", "dataPekerjaan", "dataRiwayatPendidikan", 
        "dataPendeta"
    ];
    
    try {
        // 1. Ambil path foto Jemaat dan sertifikat lain sebelum dihapus
        const [jemaatRows] = await promisePool.query(`
            SELECT 
                j.foto, b.sertifikatBaptis, s.sertifikatSidi, n.sertifikatNikah, dp.sertifikatPendeta
            FROM dataJemaat j
            LEFT JOIN dataBaptis b ON j.NIK = b.NIK
            LEFT JOIN dataSidi s ON j.NIK = s.NIK
            LEFT JOIN dataNikah n ON j.NIK = n.NIK
            LEFT JOIN dataPendeta dp ON j.NIK = dp.NIK
            WHERE j.NIK=?
        `, [nik]);

        if (jemaatRows.length === 0) {
            return res.status(404).json({ message: "Data jemaat tidak ditemukan." });
        }
        
        const pathsToDelete = [];
        const row = jemaatRows[0];
        
        // Kumpulkan semua path file yang perlu dihapus
        if (row.foto) pathsToDelete.push(row.foto);
        if (row.sertifikatBaptis) pathsToDelete.push(row.sertifikatBaptis);
        if (row.sertifikatSidi) pathsToDelete.push(row.sertifikatSidi);
        if (row.sertifikatNikah) pathsToDelete.push(row.sertifikatNikah);
        if (row.sertifikatPendeta) pathsToDelete.push(row.sertifikatPendeta);


        // 2. Hapus data dari tabel anak yang menggunakan NIK
        for (const table of tablesUsingNIK) {
            await promisePool.query(`DELETE FROM ${table} WHERE NIK=?`, [nik]);
        }
        
        // 3. Hapus data dari dataRiwayatPendeta (menggunakan kodePendeta yang diasumsikan sama dengan NIK)
        // 💡 PERBAIKAN: Ini harusnya dataRiwayatPendeta (cek skema kolom)
        await promisePool.query(`DELETE FROM dataRiwayatPendeta WHERE kodePendeta=?`, [nik]); 

        // 4. Hapus data Jemaat utama (TERAKHIR)
        await promisePool.query(`DELETE FROM dataJemaat WHERE NIK=?`, [nik]);

        // 5. Hapus file fisik
        const deleteFilePromises = pathsToDelete.map(async (filePath) => {
            try {
                const absolutePath = path.join(process.cwd(), filePath);
                // Hanya hapus jika file ada (gunakan fs.promises.unlink)
                if (fs.existsSync(absolutePath)) {
                    await unlink(absolutePath);
                }
            } catch (fileErr) {
                // Log error file tapi jangan crash transaksi utama
                console.warn(`⚠️ Gagal menghapus file ${filePath}:`, fileErr.message);
            }
        });
        await Promise.all(deleteFilePromises);


        res.json({ message: "✅ Jemaat berhasil dihapus!" });

    } catch (err) {
        // Jika terjadi error SQL, kemungkinan besar adalah Foreign Key atau nama kolom salah.
        console.error("❌ Error hapus jemaat (SQL/Logical):", err);
        res.status(500).json({ 
            message: "Gagal menghapus jemaat. Kemungkinan ada masalah relasi Foreign Key atau kesalahan nama kolom/tabel.", 
            err 
        });
    }
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

export const tambahPendeta = (req, res) => {
  try {
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
      namaPelayanan,    
      namaPekerjaan,    
      jabatan: jabatanPekerjaan, 
      jabatanPendeta, 
    } = req.body;
    
    const finalJabatanPendeta = jabatanPendeta || req.body.jabatan; 

    const foto = req.files?.foto?.[0] ? `uploads/fotoProfil/${req.files.foto[0].filename}` : null;
    const sertifikatPendeta = req.files?.sertifikatPendeta?.[0]
      ? `uploads/sertifikat/pendeta/${req.files.sertifikatPendeta[0].filename}`
      : null;

    const pendidikanList = req.body.pendidikan ? JSON.parse(req.body.pendidikan) : [];
    const pelayananList = req.body.dataPelayananList
      ? JSON.parse(req.body.dataPelayananList)
      : [];

    // 🔍 Debug: Log semua data yang diterima
    console.log("📥 Data diterima:");
    console.log("- NIK:", nik);
    console.log("- Jabatan Pendeta:", finalJabatanPendeta);
    console.log("- Sertifikat Pendeta:", sertifikatPendeta);
    console.log("- Pelayanan List:", pelayananList);

    // 1️⃣ Insert data jemaat dasar (Wajib)
    const queryJemaat = `
      INSERT INTO dataJemaat
      (NIK, namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        queryJemaat, 
        [nik, namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto], 
        async (err) => {
            if (err) {
                console.error("❌ Error INSERT dataJemaat (Pendeta):", err);
                return res.status(500).json({ message: "Gagal menambah data jemaat (NIK mungkin duplikat)", err });
            }

            console.log("✅ dataJemaat berhasil diinsert dengan NIK:", nik);

            const promisePool = db.promise();
            const criticalInserts = [];

            // === INSERT DATA PENDUKUNG (Menggunakan Promise.all) ===
            
            // Pepanthan
            if (pepanthan) {
                criticalInserts.push(
                    promisePool.query(`INSERT INTO dataPepanthan (NIK, namaPepanthan) VALUES (?, ?)`, [nik, pepanthan])
                );
            }
            
            // dataPelayanan
            if (namaPelayanan) {
                criticalInserts.push(
                    promisePool.query(`INSERT INTO dataPelayanan (NIK, namaPelayanan) VALUES (?, ?)`, [nik, namaPelayanan])
                );
            }

            // Pekerjaan
            if (namaPekerjaan || jabatanPekerjaan) {
                criticalInserts.push(
                    promisePool.query(`INSERT INTO dataPekerjaan (NIK, namaPekerjaan, jabatan) VALUES (?, ?, ?)`, 
                        [nik, namaPekerjaan || null, jabatanPekerjaan || null])
                );
            }

            // Pendidikan List
            pendidikanList.forEach((p) => {
                criticalInserts.push(
                    promisePool.query(
                        `INSERT INTO dataRiwayatPendidikan (NIK, jenjangPendidikan, namaInstitusi, tahunLulus) VALUES (?, ?, ?, ?)`,
                        [nik, p.jenjangPendidikan, p.namaInstitusi, p.tahunLulus]
                    )
                );
            });

            // 2️⃣ Detail Pendeta (dataPendeta) 
            // ✅ PERBAIKAN: kodePendeta AUTO_INCREMENT, nik sebagai FK
            console.log("🔄 Mencoba insert dataPendeta...");
            
            const [pendetaResult] = await promisePool.query(
                `INSERT INTO dataPendeta (nik, jabatan, sertifikatPendeta) VALUES (?, ?, ?)`, 
                [nik, finalJabatanPendeta || null, sertifikatPendeta || null]
            );
            
            // Ambil kodePendeta yang baru saja di-generate (AUTO_INCREMENT)
            const kodePendeta = pendetaResult.insertId;
            console.log("✅ dataPendeta berhasil diinsert dengan kodePendeta:", kodePendeta);

            // 3️⃣ Riwayat Pelayanan Pendeta (dataRiwayatPendeta) 
            // ✅ PERBAIKAN: Gunakan kodePendeta dari hasil insert sebelumnya
            if (pelayananList.length > 0) {
                console.log(`🔄 Mencoba insert ${pelayananList.length} riwayat pelayanan dengan kodePendeta: ${kodePendeta}...`);
                
                pelayananList.forEach((pel) => {
                    criticalInserts.push(
                        promisePool.query(
                            `INSERT INTO dataRiwayatPendeta (kodePendeta, namaGereja, tahunMulai, tahunSelesai) VALUES (?, ?, ?, ?)`,
                            [kodePendeta, pel.namaGereja || "", pel.tahunMulai || null, pel.tahunSelesai || null]
                        )
                    );
                });
            }
            
            try {
                // Tunggu semua operasi selesai
                const results = await Promise.all(criticalInserts);
                
                console.log("✅ Semua data berhasil diinsert:", results.length + 1, "operasi"); // +1 untuk dataPendeta
                
                res.json({ 
                    message: "✅ Pendeta berhasil ditambahkan!",
                    kodePendeta: kodePendeta,
                    nik: nik
                });
                
            } catch (subErr) {
                // 🔥 Tangkap error SQL dan laporkan detailnya
                console.error("❌ Error saat menjalankan INSERT Pendeta sekunder:", subErr);
                console.error("SQL Error Code:", subErr.code);
                console.error("SQL Message:", subErr.sqlMessage);
                
                res.status(500).json({ 
                    message: "Gagal menyimpan data Pendeta. Detail error ada di log server.", 
                    errorDetail: subErr.message,
                    sqlError: subErr.sqlMessage 
                });
            }
        }
    );
  } catch (error) {
    console.error("❌ Error tambahPendeta (Catch Luar):", error);
    res.status(500).json({ message: "❌ Terjadi kesalahan saat menambah pendeta" });
  }
};