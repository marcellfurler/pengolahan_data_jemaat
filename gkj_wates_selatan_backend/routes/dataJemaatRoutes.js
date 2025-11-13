import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import * as dataJemaatController from "../controllers/dataJemaatController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurasi folder upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "foto") {
      cb(null, path.join(__dirname, "../uploads/fotoProfil"));
    } else if (file.fieldname === "sertifikat") {
      if (req.body.statusType === "sidi") {
        cb(null, path.join(__dirname, "../uploads/sertifikat/sertifikatSidi"));
      } else if (req.body.statusType === "baptis") {
        cb(null, path.join(__dirname, "../uploads/sertifikat/sertifikatBaptis"));
      } else if (req.body.statusType === "nikah") {
        cb(null, path.join(__dirname, "../uploads/sertifikat/sertifikatNikah"));
      } else {
        cb(null, path.join(__dirname, "../uploads/sertifikat/sertifikatUpdate"));
      }
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Gunakan referensi dari objek import
router.get("/", dataJemaatController.getAllJemaat);

router.put(
  "/:nik",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "sertifikat", maxCount: 1 },
  ]),
  dataJemaatController.updateJemaat
);

export default router;
