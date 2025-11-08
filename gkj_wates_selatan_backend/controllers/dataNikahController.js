// controllers/dataNikahController.js
import { db } from "../config/db.js";

export const getSertifikatNikahByNik = (req, res) => {
  const { nik } = req.params;
   console.log("🔍 NIK diterima dari frontend:", nik);

  const query = `
    SELECT sertifikatNikah
    FROM dataNikah
    WHERE NIK = ?
    LIMIT 1
  `;

  db.query(query, [nik], (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil sertifikat nikah:", err);
      return res.status(500).json({ message: "Gagal mengambil data sertifikat nikah" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Sertifikat nikah tidak ditemukan" });
    }

    // kirim URL lengkap biar React langsung bisa akses
    const sertifikatPath = results[0].sertifikatNikah;
    
    // 1. Ganti backslash ke forward slash
    let cleanPath = sertifikatPath.replace(/\\/g, "/"); 
    
    // 2. Hapus slash ganda di awal jika ada (jika dimulai dengan /)
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1); 
    }

    const fullUrl = `http://localhost:5000/${cleanPath}`;

    res.json({ sertifikatNikah: fullUrl });
});
};
