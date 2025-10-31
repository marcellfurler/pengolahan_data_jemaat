import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";

const SuratTemplatePengakuanPercaya = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state || {};

  const formatTanggalIndonesia = (tanggal) => {
    if (!tanggal) return "..................";
    const date = new Date(tanggal);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  // === PRINT hanya bagian surat ===
  const handlePrint = () => {
    const printContents = document.getElementById("surat-pengakuan-percaya").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // === DOWNLOAD PDF ===
  const handleDownload = () => {
    const element = document.getElementById("surat-pengakuan-percaya");
    const opt = {
      margin: 0,
      filename: `Surat_Pengakuan_Percaya_${data.nama || "Jemaat"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div>
      <NavbarComponent />

      {/* Tombol Aksi */}
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
          id="surat-pengakuan-percaya"
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

          <p>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus,</p>

          <p>
            Dengan penuh pengharapan dan percaya akan anugerah keselamatan dari Tuhan
            Yesus Kristus, maka melalui surat ini perkenankanlah saya:
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr><td style={{ width: "35%" }}>Nama</td><td>: {data.nama || "................................................"}</td></tr>
              <tr><td>Tempat Tgl Lahir</td><td>: {data.tempatLahir || ".................."}, {formatTanggalIndonesia(data.tanggalLahir)}</td></tr>
              <tr><td>Alamat</td><td>: {data.alamat || "................................................"}</td></tr>
              <tr><td>Nama Orang Tua</td></tr>
              <tr><td>    Ayah</td><td>: {data.namaAyah || "................................................"}</td></tr>
              <tr><td>    Ibu</td><td>: {data.namaIbu || "................................................"}</td></tr>
              <tr><td>Tgl Baptis Anak</td><td>: {formatTanggalIndonesia(data.tanggalBaptis) || ".................."}</td></tr>
              <tr><td>Tempat Baptis Anak</td><td>: {data.tempatBaptis || "................................................"}</td></tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Memohon kepada Yang Terhormat Majelis GKJ Wates Selatan, agar berkenan
            memberikan pelayanan Pengakuan Percaya (SIDI).
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr><td style={{ width: "35%" }}>Hari / Tanggal</td><td>: {data.hariPelayanan || ".................."}, {formatTanggalIndonesia(data.tanggalPelayanan)}</td></tr>
              <tr><td>Waktu / Pukul</td><td>: {data.waktuPelayanan || ".................."}</td></tr>
              <tr><td>Tempat</td><td>: {data.tempatPelayanan || ".................."}</td></tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Selanjutnya perlu Yang Terhormat Majelis GKJ Wates Selatan ketahui, bahwa
            untuk keperluan tersebut saya telah menyelesaikan program katekisasi di bawah
            bimbingan {data.pembimbing || "................................................"}{" "}
            yang telah berlangsung selama {data.durasiKatekisasi || ".................."}.
          </p>

          <p>
            Demikian surat permohonan pelayanan Pengakuan Percaya (SIDI) saya, atas
            perkenannya permohonan ini, saya ucapkan terima kasih. Kiranya Tuhan
            memberkati kita sekalian. <br />Amin.
          </p>

          {/* === Tanda tangan === */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat
            </p>
            <br /><br /><br />
            <table
              style={{
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
              }}
            >
              <tbody>
                <tr>
                  <td>......................................</td>
                  <td>......................................</td>
                </tr>
                <tr>
                  <td>Pembimbing Katekisasi</td>
                  <td>Pemohon</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplatePengakuanPercaya;
