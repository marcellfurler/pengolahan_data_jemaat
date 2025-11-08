// routes/dataNikahRoutes.js
import express from "express";
import { getSertifikatNikahByNik } from "../controllers/dataNikahController.js";

const router = express.Router();

// ❗ gunakan nama param sama persis dengan controller
router.get("/:nik", getSertifikatNikahByNik);

export default router;
