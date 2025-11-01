import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";

const SuratTemplatePertobatan = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state || {};

  // Format tanggal ke dalam format Indonesia (contoh: 1 November 2025)
  const formatTanggalIndonesia = (tanggal) => {
    if (!tanggal) return "..................";
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const handleDownload = () => {
    const element = document.getElementById("surat-pertobatan");

    // Tambahkan wrapper .page agar html2pdf tahu page-break
    const pages = document.createElement("div");
    pages.innerHTML = `<div class="page">${element.innerHTML}</div>`;

    // Optional: copy style dari element asli
    pages.style.fontFamily = "Times New Roman, serif";
    pages.style.fontSize = "12pt";
    pages.style.lineHeight = "1.4";

    const opt = {
      margin: [20, 20, 20, 20], // top, left, bottom, right dalam mm
      filename: `Surat_Pertobatan_${data.nama || "Jemaat"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }, // biar page break di CSS berfungsi
    };

    html2pdf().from(pages).set(opt).save();
  };


    const handlePrint = () => {
    const printContent = document.getElementById("surat-pertobatan").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
        <head>
            <title>Surat Pertobatan</title>
            <style>
            @media print {
                @page { size: A4; margin: 20mm; }
                body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.4; }
                .page { page-break-after: always; width: 100%; box-sizing: border-box; }
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
          id="surat-pertobatan"
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
            textAlign: "justify",
          }}
        >
          {/* === Header === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SPP.PERTOBATAN
          </div>

          <h5
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN PELAYANAN PERTOBATAN
          </h5>
          
          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Dengan segala kerendahan di hadapan Tuhan Yesus Kristus Sang Juru
            Selamat, maka melalui surat ini perkenankanlah saya:
          </p>


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
                <td>Pekerjaan</td>
                <td>: {data.pekerjaan || "................................................"}</td>
              </tr>
              <tr>
                <td>Tempat, Tgl Baptis</td>
                <td>
                  : {data.tempatBaptis || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalBaptis)}
                </td>
              </tr>
              <tr>
                <td>Tempat, Tgl Sidi</td>
                <td>
                  : {data.tempatSidi || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalSidi)}
                </td>
              </tr>
              <tr>
                <td>Warga Gereja</td>
                <td>: {data.wargaGereja || "................................................"}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px", textAlign: "justify" }}>
            Saya menyadari dengan sesungguhnya, bahwa saya telah berdosa di
            hadapan Tuhan. Saya menyesali segala dosa dan menyatakan pertobatan
            di hadapan Tuhan dan Majelis serta Jemaat di sini. <br />
            Saya berjanji akan berusaha sekuat tenaga dengan tetap percaya,
            berserah, dan berharap pada pertolongan Roh Kudus untuk dapat
            melakukan semua yang baik dan berkenan di hadapan Tuhan. <br />
            Sehubungan dengan hal tersebut perkenankan saya memohon kepada Yang
            Terhormat Majelis GKJ Wates Selatan, agar berkenan memberikan
            pelayanan Pertobatan atas diri saya, yang diharapkan dapat
            terlaksana pada:
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

          <p style={{ marginTop: "20px", textAlign: "justify" }}>
            Demikian surat permohonan pelayanan Pertobatan ini, atas
            perkenannya permohonan ini saya ucapkan terima kasih, dan semoga
            Tuhan selalu memberkati kita sekalian. Amin
          </p>

          {/* === Tanda Tangan === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat
            </p>
            <br /><br />
            <table
              style={{
                width: "60%",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
              }}
            >
              <tbody>
                <tr>
                  <td>......................................</td>
                </tr>
                <tr>
                  <td>{data.nama || "Pemohon"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplatePertobatan;
