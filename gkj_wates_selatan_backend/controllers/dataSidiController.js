import { db } from "../config/db.js"; // ✅ pastikan ini ada

export const getSertifikatSidiByNik = (req, res) => {
  const { nik } = req.params; // ✅ param huruf kecil
  console.log("📥 NIK diterima dari frontend (Sidi):", nik);

  const query = `
    SELECT sertifikatSidi
    FROM dataSidi
    WHERE NIK = ?
    LIMIT 1
  `;

  db.query(query, [nik], (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil sertifikat sidi:", err);
      return res.status(500).json({ message: "Gagal mengambil data sertifikat sidi" });
    }

    if (results.length === 0) {
      console.log("⚠️ Tidak ada sertifikat untuk NIK:", nik);
      return res.status(404).json({ message: "Sertifikat sidi tidak ditemukan" });
    }

    const sertifikatPath = results[0].sertifikatSidi;
    const fullUrl = `http://localhost:5000/${sertifikatPath.replace(/\\/g, "/")}`;
    console.log("✅ URL sertifikat dikirim ke frontend:", fullUrl);

    res.json({ sertifikatSidi: fullUrl });
  });
};
