import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SertifikatNikah = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [sertifikatUrl, setSertifikatUrl] = useState("");

    useEffect(() => {
    if (state && state.data && state.data.nik) {
        fetch(`http://localhost:5000/api/nikah/${state.data.nik}`)
        .then((res) => res.json())
        .then((data) => {
            if (data && data.sertifikatNikah) {
            setSertifikatUrl(data.sertifikatNikah);
            } else {
            setSertifikatUrl(null);
            }
        })
        .catch((err) => console.error("❌ Gagal mengambil sertifikat:", err));
    }
    }, [state]);


  const handleDownloadPDF = async () => {
    const element = document.getElementById("sertifikat-nikah");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Sertifikat_Nikah_${state?.nama || "Jemaat"}.pdf`);
  };

  return (
    <div style={{ backgroundColor: "#f7f7f7", minHeight: "100vh" }}>
      <NavbarComponent />

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Kembali
          </button>

          <h4 className="fw-bold text-primary mb-0">Sertifikat Nikah Jemaat</h4>

          <button
            className="btn btn-success"
            onClick={handleDownloadPDF}
            disabled={!sertifikatUrl}
          >
            <FontAwesomeIcon icon={faDownload} className="me-2" /> Download PDF
          </button>
        </div>

        <div
          id="sertifikat-nikah"
          className="bg-white shadow p-4 rounded text-center"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            border: "1px solid #ccc",
          }}
        >
          {sertifikatUrl ? (
            <>
              <img
                src={sertifikatUrl}
                alt="Sertifikat Nikah"
                style={{
                  maxWidth: "100%",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              />
              <p className="mt-3 text-muted">
                Klik tombol di atas untuk mengunduh sertifikat ini sebagai PDF.
              </p>
            </>
          ) : (
            <p className="text-danger">
              ❌ Sertifikat nikah tidak ditemukan untuk jemaat ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SertifikatNikah;
