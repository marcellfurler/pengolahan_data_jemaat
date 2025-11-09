import express from "express";
import { getSertifikatSidiByNik } from "../controllers/dataSidiController.js";

const router = express.Router();

// ✅ Gunakan param huruf kecil agar konsisten
router.get("/:nik", getSertifikatSidiByNik);

export default router;
