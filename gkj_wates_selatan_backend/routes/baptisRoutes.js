import express from "express";
import { getAllBaptis, createBaptis } from "../controllers/baptisController.js";

const router = express.Router();

// Ambil semua data surat baptis
router.get("/", getAllBaptis);

// Tambah surat baptis baru
router.post("/", createBaptis);

export default router;
