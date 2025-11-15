import express from "express";
import { getPendetaDetailByNIK } from "../controllers/dataPendetaController.js";

const router = express.Router();

// ✅ Endpoint untuk mendapatkan detail Pendeta
// Mendukung 2 cara:
// 1. Query parameter: GET /api/pendeta/detail?nik=xxx
// 2. Route parameter: GET /api/pendeta/detail/:nik (Dipakai oleh frontend)

router.get("/detail", getPendetaDetailByNIK); 
router.get("/detail/:nik", getPendetaDetailByNIK); 

export default router;