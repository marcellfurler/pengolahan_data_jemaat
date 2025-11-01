import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavbarComponent } from "./components/NavbarComponent";
import { DaftarSuratJemaat } from "./components/daftarSuratJemaat";

const HalamanSurat = () => {
  const navigate = useNavigate();

  // Kelompok surat berdasarkan kategori
  const kelompokSurat = [
    {
      kategori: "Pelayanan Sakramen dan Pertobatan",
      surat: [
        { id: 1, nama: "Surat Permohonan Baptis Anak", path: "/surat/baptis-anak" },
        { id: 2, nama: "Surat Permohonan Baptis Dewasa", path: "/surat/baptis-dewasa" },
        { id: 3, nama: "Surat Permohonan Pertobatan", path: "/surat/pertobatan" },
        { id: 4, nama: "Surat Pengakuan Percaya (Sidi)", path: "/surat/pengakuan-percaya" },
      ],
    },
    {
      kategori: "Peristiwa Kehidupan Jemaat",
      surat: [
        { id: 5, nama: "Surat Pemberitahuan Kelahiran", path: "/surat/pemberitahuan-kelahiran" },
        { id: 6, nama: "Surat Berita Acara Pertunangan", path: "/surat/tunangan" },
        { id: 7, nama: "Surat Permohonan Pemberkatan Nikah", path: "/surat/nikah" },
      ],
    },
    {
      kategori: "Pembinaan dan Pendidikan Iman",
      surat: [
        { id: 8, nama: "Surat Permohonan Bimbingan Katekisasi", path: "/surat/katekisasi" },
      ],
    },
    {
      kategori: "Kepengurusan dan Administrasi Gereja",
      surat: [
        { id: 9, nama: "Surat Kesanggupan Pencalonan Majelis", path: "/surat/calon-majelis" },
        { id: 10, nama: "Surat Atestasi Pindah Gereja", path: "/surat/atestasi" },
      ],
    },
  ];

  return (
    <div>
      <NavbarComponent />

      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">

          {/* Header Card dengan Tombol Kembali di Kiri */}
          <div
            className="card-header text-white d-flex align-items-center justify-content-between mb-3 py-3"
            style={{ backgroundColor: "#004d97" }}
          >
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/data")}
            >
              ← Kembali
            </button>
            <h4 className="mb-0 text-center flex-grow-1" style={{ color: "white" }}>
              📄 Pembuatan Template Surat
            </h4>
            <div style={{ width: "80px" }}></div> {/* Spacer agar judul tetap di tengah */}
          </div>

          {/* Body Card */}
          <div className="card-body">
            {/* NAV TABS */}
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                  style={{ color: "#004d97" }}
                >
                  Template Surat
                </button>
                <button
                  className="nav-link"
                  id="nav-favorit-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-favorit"
                  type="button"
                  role="tab"
                  aria-controls="nav-favorit"
                  aria-selected="false"
                  style={{ color: "#004d97" }}
                >
                  Daftar Surat Jemaat
                </button>
                <button
                  className="nav-link"
                  id="nav-lain-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-lain"
                  type="button"
                  role="tab"
                  aria-controls="nav-lain"
                  aria-selected="false"
                  style={{ color: "#004d97" }}
                >
                  Lainnya
                </button>
              </div>
            </nav>

            {/* TAB CONTENT */}
            <div className="tab-content" id="nav-tabContent">
              {/* Tab Semua Surat */}
              <div
                className="tab-pane fade show active mt-4"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
                tabIndex="0"
              >
                {kelompokSurat.map((kelompok, index) => (
                  <div key={index} className="mb-4">
                    <h5 className="fw-bold mb-3" style={{ color: "#004d97" }}>
                      {kelompok.kategori}
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped align-middle">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: "50px" }}>No</th>
                            <th>Nama Surat</th>
                            <th style={{ width: "150px" }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kelompok.surat.map((surat, i) => (
                            <tr key={surat.id}>
                              <td>{i + 1}</td>
                              <td>{surat.nama}</td>
                              <td>
                                <Link
                                  to={surat.path}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  Buat
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tab Favorit */}
              <div
                className="tab-pane fade mt-4"
                id="nav-favorit"
                role="tabpanel"
                aria-labelledby="nav-favorit-tab"
                tabIndex="0"
              >
                <p>Belum ada Data.</p>
              </div>

              {/* Tab Lainnya */}
              <div
                className="tab-pane fade mt-4"
                id="nav-lain"
                role="tabpanel"
                aria-labelledby="nav-lain-tab"
                tabIndex="0"
              >
                <p>Kategori surat lainnya akan ditambahkan nanti.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalamanSurat;
