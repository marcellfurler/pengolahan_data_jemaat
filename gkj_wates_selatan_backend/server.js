import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import dataJemaatRoutes from "./routes/dataJemaatRoutes.js";
import dataNikahRoutes from "./routes/dataNikahRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// folder public untuk gambar sertifikat
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/jemaat", dataJemaatRoutes);
app.use("/api/nikah", dataNikahRoutes);

app.get("/", (req, res) => {
  res.send("✅ Server GKJ Backend aktif dan berjalan 🚀");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server di http://localhost:${PORT}`));
