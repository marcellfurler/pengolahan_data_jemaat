import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";

const SuratTemplatePemberitahuanKelahiran = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state || {};

  // ✅ Format tanggal Indonesia
  const formatTanggalIndonesia = (tanggal) => {
    if (!tanggal) return "..................";
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

   // ✅ Cetak hanya isi surat (tanpa navbar & tombol)
    const handlePrint = () => {
    const printContent = document.getElementById("surat-kelahiran").innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
        <head>
            <title>Surat Pemberitahuan Kelahiran</title>
            <style>
            @media print {
                @page { size: A4; margin: 20mm; }
                body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.4; text-align: justify; }
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

  // ✅ Download ke PDF
    const handleDownload = () => {
    const element = document.getElementById("surat-kelahiran");

    // Tambahkan wrapper .page agar html2pdf tahu page-break
    const pages = document.createElement("div");
    pages.innerHTML = `<div class="page">${element.innerHTML}</div>`;

    // Optional: copy style dari element asliaa
    pages.style.fontFamily = "Times New Roman, serif";
    pages.style.fontSize = "12pt";
    pages.style.lineHeight = "1.4";

    const opt = {
        margin: [20, 20, 20, 20], // top, left, bottom, right dalam mm
        filename: `Surat_Kelahiran_${data.nama || "Jemaat"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] }, // biar page break di CSS berfungsi
    };

    html2pdf().from(pages).set(opt).save();
    };

  return (
    <div>
      <NavbarComponent />
      {/* === Header Tombol === */}
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
          id="surat-kelahiran"
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
          {/* === HEADER SURAT === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SP.Lahir
          </div>
          

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PEMBERITAHUAN KELAHIRAN
          </p>
          

          <p>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus,</p>

          <p>
            Dengan penuh ucapan syukur kepada Tuhan Yang Maha Kasih, melalui
            surat ini perkenankanlah kami:
          </p>

          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama Orang Tua</td>
              </tr>
              <tr>
                <td>    Ayah</td>
                <td>: {data.namaIbu || "................................................"}</td>
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

          <p style={{ marginTop: "10px" }}>
            Memberitahukan kepada Yang Terhormat Majelis GKJ Wates Selatan, bahwa
            Tuhan telah menganugerahkan anak kepada kami, yaitu:
          </p>

          <table style={{ width: "100%", marginTop: "5px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama Anak</td>
                <td>: {data.namaAnak || "................................................"}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td>
                  : {data.jenisKelamin || "( Laki-laki / Perempuan )"}
                </td>
              </tr>
              <tr>
                <td>Anak Ke</td>
                <td>
                  : {data.anakKe || ".................."}{" "}
                  ({data.keteranganAnakKe || "......................................."})
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "10px" }}>Yang lahir pada:</p>

          <table style={{ width: "100%", marginTop: "5px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Hari / Tanggal</td>
                <td>
                  : {data.hariLahir || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalLahir)}
                </td>
              </tr>
              <tr>
                <td>Waktu / Pukul</td>
                <td>: {data.waktuLahir || ".................."}</td>
              </tr>
              <tr>
                <td>Tempat</td>
                <td>: {data.tempatLahir || ".................."}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Demikian surat pemberitahuan kelahiran kami, kiranya menjadi
            perhatian, dan semoga Tuhan selalu memberkati kita sekalian. Amin.
          </p>

          {/* === TANDA TANGAN === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat
            </p>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
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
                  {data.namaAyah || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Suami</div>
              </div>

              <div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    minWidth: "150px",
                    paddingBottom: "3px",
                  }}
                >
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

export default SuratTemplatePemberitahuanKelahiran;
