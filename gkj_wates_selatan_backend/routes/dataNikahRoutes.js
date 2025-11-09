import express from "express";
import { getSertifikatNikahByNik } from "../controllers/dataNikahController.js";

const router = express.Router();

// param harus lowercase dan sama dengan controller
router.get("/:nik", getSertifikatNikahByNik);

export default router;
