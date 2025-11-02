import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";

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

  // ✅ Fungsi download PDF
  const handleDownload = () => {
    const element = document.getElementById("surat-bimbingan");
    const pages = document.createElement("div");
    pages.innerHTML = `<div class="page">${element.innerHTML}</div>`;

    pages.style.fontFamily = "Times New Roman, serif";
    pages.style.fontSize = "12pt";
    pages.style.lineHeight = "1.4";

    const opt = {
      margin: [20, 20, 20, 20],
      filename: `Surat_Bimbingan_Katekisasi_${data.nama || "Jemaat"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf().from(pages).set(opt).save();
  };

  // ✅ Fungsi print langsung
  const handlePrint = () => {
    const printContent = document.getElementById("surat-bimbingan").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>Surat Bimbingan Katekisasi</title>
        <style>
          @media print {
            @page { size: A4; margin: 20mm; }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.4;
            }
            .page { page-break-after: always; width: 100%; }
            .page:last-child { page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <div class="page">${printContent}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div>
      <NavbarComponent />

      {/* === HEADER BUTTON === */}
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
