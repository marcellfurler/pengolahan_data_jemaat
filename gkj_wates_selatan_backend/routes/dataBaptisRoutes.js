import express from "express";
import { getSertifikatBaptisByNik } from "../controllers/dataBaptisController.js";

const router = express.Router();

router.get("/:nik", getSertifikatBaptisByNik);

export default router;
