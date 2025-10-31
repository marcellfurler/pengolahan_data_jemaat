import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";

const SuratTemplateBaptisDewasa = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state || {};

  // ✅ Format tanggal ke format Indonesia: 1 November 2025
  const formatTanggalIndonesia = (tanggal) => {
    if (!tanggal) return "..................";
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  // ✅ Cetak hanya isi surat (tanpa navbar & tombol)
  const handlePrint = () => {
    const printContents = document.getElementById("surat-baptis-dewasa").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Surat Permohonan Baptis Dewasa</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.3;
              margin: 0;
              padding: 0;
              color: #000;
            }
            @page {
              size: A4;
              margin: 20mm;
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // ✅ Download ke PDF
  const handleDownload = () => {
    const element = document.getElementById("surat-baptis-dewasa");
    const opt = {
      margin: 0,
      filename: `Surat_Permohonan_Baptis_Dewasa_${data.nama || "Jemaat"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div>
      <NavbarComponent />

      {/* Tombol Navigasi & Aksi */}
      <div className="d-flex justify-content-between align-items-center px-4 mt-4 mb-3 no-print">
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
          id="surat-baptis-dewasa"
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
          {/* === Header === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SPP.Bts DEWASA
          </div>

          <h5
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN PELAYANAN PENGAKUAN PERCAYA DAN BAPTIS DEWASA
          </h5>

          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus,</p>

          <p>
            Dengan penuh pengharapan dan percaya akan anugerah keselamatan dari
            Tuhan Yesus Kristus, maka melalui surat ini perkenankanlah saya :
          </p>

          {/* === Data Jemaat === */}
          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "35%" }}>Nama</td>
                <td>: {data.nama || "................................................"}</td>
              </tr>
              <tr>
                <td>Tempat, Tgl Lahir</td>
                <td>
                  : {data.tempatLahir || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalLahir)}
                </td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>: {data.alamat || "................................................"}</td>
              </tr>
              <tr>
                <td>Nama Orang Tua</td>
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
                <td>Nama Istri / Suami</td>
                <td>: {data.namaPasangan || "................................................"}</td>
              </tr>
              <tr>
                <td>Tempat, Tgl Nikah</td>
                <td>
                  : {data.tempatNikah || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalNikah)}
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Memohon kepada Yang Terhormat Majelis GKJ Wates Selatan, agar
            berkenan memberikan pelayanan Pengakuan Percaya dan Baptis Dewasa.
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "35%" }}>Hari / Tanggal</td>
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

          <p style={{ marginTop: "15px" }}>
            Selanjutnya perlu Yang Terhormat Majelis GKJ Wates Selatan ketahui,
            bahwa untuk keperluan tersebut saya telah menyelesaikan program
            katekisasi di bawah bimbingan {data.pembimbing || "................................................"}.
          </p>

          <p>
            Demikian surat permohonan pelayanan Pengakuan Percaya dan Baptis
            Dewasa saya, atas perkenannya permohonan ini, saya ucapkan terima
            kasih. Kiranya Tuhan memberkati kita sekalian. <br />Amin.
          </p>

          {/* === Tanda Tangan === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat
            </p>
            

            {/* Tabel tanda tangan tengah */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "100px",
                marginTop: "60px",
                textAlign: "center",
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
                  {data.pembimbing || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Pembimbing Katekisasi</div>
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
  );
};

export default SuratTemplateBaptisDewasa;
