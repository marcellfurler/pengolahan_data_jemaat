import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";

const SuratTemplateBaptisAnak = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state || {};

  // ✅ Format tanggal ke Indonesia: 1 November 2025
  const formatTanggalIndonesia = (tanggal) => {
    if (!tanggal) return "..................";
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const element = document.getElementById("surat-baptis-anak");
    const opt = {
      margin: 0,
      filename: `Surat_Permohonan_Baptis_${data.namaAnak || "Anak"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div>
      <NavbarComponent />
      <div className="d-flex justify-content-between align-items-center px-4 mt-4 mb-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={handleDownload}>
            💾 Download
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>
      </div>

      {/* === SURAT (A4 tampilan tunggal) === */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#eaeaea",
          padding: "10px 0",
        }}
      >
        <div
          id="surat-baptis-anak"
          style={{
            width: "210mm",
            height: "297mm",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "20mm 18mm",
            fontFamily: "Times New Roman, serif",
            fontSize: "12pt",
            lineHeight: "1.3",
            color: "#000",
            boxSizing: "border-box",
            boxShadow: "0 0 6px rgba(0,0,0,0.25)",
          }}
        >
          {/* === Header Surat === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SPP.Bts ANAK
          </div>

          <h5
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN PELAYANAN BAPTIS ANAK
          </h5>

          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus,</p>

          <p>
            Dengan penuh pengharapan akan kasih dan anugerah dari Tuhan Yesus
            Kristus, melalui surat ini perkenankanlah kami :
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama:</td>
              </tr>
              <tr>
                <td>    Ayah</td>
                <td>: {data.namaAyah || "................................................"}</td>
              </tr>
              <tr>
                <td>    Ibu</td>
                <td>: {data.namaIbu || "................................................"}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>: {data.alamat || "................................................"}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Memohon kepada Yang Terhormat Majelis GKJ Wates Selatan, agar berkenan
            memberikan pelayanan Baptis Anak, untuk anak kami :
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama Anak</td>
                <td>: {data.namaAnak || "................................................"}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td>: {data.jenisKelamin || "( Laki-laki / Perempuan )"}</td>
              </tr>
              <tr>
                <td>Tempat, Tgl Lahir</td>
                <td>
                  : {data.tempatLahir || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalLahir)}
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Pelayanan Baptis Anak diharapkan dapat dilayankan pada:
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Hari / Tanggal</td>
                <td>
                  : {data.hariPelayanan || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalPelayanan)}
                </td>
              </tr>
              <tr>
                <td>Waktu / Pukul</td>
                <td>: {data.waktuPelayanan || ".................."}</td>
              </tr>
              <tr>
                <td>Tempat</td>
                <td>: {data.tempatPelayanan || ".................."}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "20px" }}>
            Demikian surat permohonan pelayanan baptis anak kami, atas
            perkenannya permohonan ini, kami ucapkan terima kasih, dan kiranya
            Tuhan selalu memberkati kita sekalian. Amin
          </p>

          {/* === Tanda Tangan === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, Yogyakarta, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat
            </p>
            <br />

            {/* Flexbox tanda tangan */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "100px", // jarak antar tanda tangan, bisa disesuaikan
                marginTop: "60px",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ borderBottom: "1px solid #000", minWidth: "150px", paddingBottom: "3px" }}>
                  {data.namaAyah || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Suami</div>
              </div>

              <div>
                <div style={{ borderBottom: "1px solid #000", minWidth: "150px", paddingBottom: "3px" }}>
                  {data.namaIbu || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Istri</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplateBaptisAnak;
