import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import baptisRoutes from "./routes/baptisRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// === Route utama ===
app.use("/api/baptis", baptisRoutes);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
