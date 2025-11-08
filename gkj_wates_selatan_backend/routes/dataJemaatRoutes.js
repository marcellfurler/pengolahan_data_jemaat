// routes/dataJemaatRoutes.js
import express from "express";
import { getAllJemaat } from "../controllers/dataJemaatController.js";

const router = express.Router();

// Endpoint utama untuk ambil semua jemaat
router.get("/", getAllJemaat);

// Export router ke server.js
export default router;
