// controllers/dataNikahController.js
import { db } from "../config/db.js"; // ✅ tambahkan ini di paling atas

export const getSertifikatNikahByNik = (req, res) => {
  const { nik } = req.params; // huruf kecil sesuai di routes
  console.log("📥 NIK diterima dari frontend:", nik);

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
      console.log("⚠️ Tidak ada sertifikat untuk NIK:", nik);
      return res.status(404).json({ message: "Sertifikat nikah tidak ditemukan" });
    }

    const sertifikatPath = results[0].sertifikatNikah;
    const fullUrl = `http://localhost:5000/${sertifikatPath.replace(/\\/g, "/")}`;
    console.log("✅ URL sertifikat dikirim ke frontend:", fullUrl);

    res.json({ sertifikatNikah: fullUrl });
  });
};
