import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";
import { printSurat } from "../../../components/printSurat";

const SuratTemplateBimbinganKatekisasi = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state || {};

  // ✅ Format tanggal ke bahasa Indonesia
  const formatTanggalIndonesia = (tanggal) => {
    if (!tanggal) return "..................";
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  // === HANDLE PRINT ===
  const handlePrint = () => {
    printSurat("surat-bimbingan", "Surat Permohonan Bimbingan Katekesasi", data.nama || "Surat_Bimbingan_Katekisasi");
  }
  return (
    <div>
      <NavbarComponent />

      {/* === HEADER BUTTON === */}
      <div className="d-flex justify-content-between align-items-center px-4 mt-4 mb-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
        <div>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>
      </div>

      {/* === SURAT === */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#eaeaea",
          padding: "10px 0",
        }}
      >
        <div
          id="surat-bimbingan"
          style={{
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "20mm 18mm",
            fontFamily: "Times New Roman, serif",
            fontSize: "12pt",
            lineHeight: "1.4",
            color: "#000",
            textAlign: "justify",
            boxSizing: "border-box",
            boxShadow: "0 0 6px rgba(0,0,0,0.25)",
          }}
        >
          {/* === HEADER === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SP.B KATEKISASI
          </div>

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN BIMBINGAN KATEKISASI
          </p>

          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Dengan penuh pengharapan dan percaya akan anugerah keselamatan dari
            Tuhan Yesus Kristus, maka melalui surat ini perkenankanlah saya :
          </p>

          {/* === DATA JEMAAT === */}
          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr><td style={{ width: "35%" }}>Nama</td><td>: {data.nama || "................................................"}</td></tr>
              <tr><td>Tempat Tanggal Lahir</td><td>: {data.tempatLahir || ".................."}, {formatTanggalIndonesia(data.tanggalLahir)}</td></tr>
              <tr><td>Alamat</td><td>: {data.alamat || "................................................"}</td></tr>
              <tr><td>Nama Ayah</td><td>: {data.namaAyah || "................................................"}</td></tr>
              <tr><td>Nama Ibu</td><td>: {data.namaIbu || "................................................"}</td></tr>
              <tr><td>Tanggal Baptis Anak</td><td>: {formatTanggalIndonesia(data.tanggalBaptis)}</td></tr>
              <tr><td>Tempat Baptis Anak</td><td>: {data.tempatBaptis || "................................................"}</td></tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Memohon kepada Yang Terhormat Majelis GKJ Wates Selatan, agar berkenan
            memberikan BIMBINGAN KATEKISASI. Bimbingan Katekisasi diharapkan dapat
            dilayankan pada setiap:
          </p>

          {/* === JADWAL === */}
          <table style={{ width: "100%", marginTop: "5px" }}>
            <tbody>
              <tr><td style={{ width: "35%" }}>Hari</td><td>: {data.hariBimbingan || ".................."}</td></tr>
              <tr><td>Waktu Pukul</td><td>: {data.waktuBimbingan || ".................."}</td></tr>
              <tr><td>Tempat</td><td>: {data.tempatBimbingan || ".................."}</td></tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Demikian surat permohonan bimbingan katekisasi saya, atas perkenannya
            permohonan ini saya ucapkan banyak terima kasih, dan semoga Tuhan selalu
            memberkati kita sekalian. Amin.
          </p>

          {/* === TANDA TANGAN === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat <br />
              Mengetahui :
            </p> <br />

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "100px",
                  marginTop: "40px",
                }}
              >
                <div>
                  <div
                    style={{
                      borderBottom: "1px solid #000",
                      minWidth: "150px",
                      paddingBottom: "3px",
                    }}
                  >
                    ................................
                  </div>
                  <div style={{ marginTop: "5px" }}>Orang Tua</div>
                </div>

                <div>
                  <div
                    style={{
                      borderBottom: "1px solid #000",
                      minWidth: "150px",
                      paddingBottom: "3px",
                    }}
                  >
                    {data.nama || "........................"}
                  </div>
                  <div style={{ marginTop: "5px" }}>Pemohon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplateBimbinganKatekisasi;
