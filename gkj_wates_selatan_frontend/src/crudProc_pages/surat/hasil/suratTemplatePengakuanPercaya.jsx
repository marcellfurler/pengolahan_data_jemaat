import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";
import { printSurat } from "../../../components/printSurat";

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

  // === HANDLE PRINT ===
  const handlePrint = () => {
    printSurat("surat-pengakuan-percaya", "Surat Permohonan Pengakuan Percaya dan Baptis Dewasa", data.nama || "Surat_Pengakuan_Percaya");
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
            textAlign: "justify",
          }}
        >
          {/* === Header === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SPP.Bts DEWASA
          </div>

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN PELAYANAN PENGAKUAN PERCAYA DAN BAPTIS DEWASA
          </p>

          <p>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Dengan penuh pengharapan dan percaya akan anugerah keselamatan dari Tuhan
            Yesus Kristus, maka melalui surat ini perkenankanlah saya:
          </p>

          <p>
            
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
            bimbingan <strong>{data.pembimbing || "................................................"}</strong>{" "}
            yang telah berlangsung selama <strong>{data.durasiKatekisasi || ".................."}</strong>.
          </p>

          <p>
            Demikian surat permohonan pelayanan Pengakuan Percaya (SIDI) saya, atas
            perkenannya permohonan ini, saya ucapkan terima kasih. Kiranya Tuhan
            memberkati kita sekalian. Amin.
          </p>

          {/* === Tanda tangan === */}
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
                marginTop: "40px",
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
                <div style={{ marginTop: "5px" }}>Pembimbing Katekesasi</div>
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

export default SuratTemplatePengakuanPercaya;
