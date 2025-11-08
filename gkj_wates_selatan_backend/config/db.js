import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // isi sesuai setting Laragon kamu
  database: "gkj_wates_selatan",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal:", err);
  } else {
    console.log("✅ Terhubung ke database MySQL (Laragon)");
  }
});
