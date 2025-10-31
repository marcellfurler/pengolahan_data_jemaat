import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const FormPermohonanPertobatan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    pekerjaan: "",
    tempatBaptis: "",
    tanggalBaptis: "",
    tempatSidi: "",
    tanggalSidi: "",
    wargaGereja: "",
    hariPelayanan: "",
    tanggalPelayanan: "",
    waktuPelayanan: "",
    tempatPelayanan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/surat/hasil/pertobatan", { state: formData });
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          <div
            className="card-header text-white d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "#004d97" }}
          >
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate(-1)}
            >
              ← Kembali
            </button>
            <h5 className="mb-0 flex-grow-1 text-center">
              ✝️ Form Permohonan Pertobatan
            </h5>
            <div style={{ width: "80px" }}></div>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* === Identitas Diri === */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    name="nama"
                    className="form-control"
                    value={formData.nama}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    name="tempatLahir"
                    className="form-control"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    className="form-control"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Alamat</label>
                  <textarea
                    name="alamat"
                    className="form-control"
                    rows="2"
                    value={formData.alamat}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Pekerjaan</label>
                  <input
                    type="text"
                    name="pekerjaan"
                    className="form-control"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                  />
                </div>

                {/* === Data Baptis dan Sidi === */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Baptis</label>
                  <input
                    type="text"
                    name="tempatBaptis"
                    className="form-control"
                    value={formData.tempatBaptis}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Baptis</label>
                  <input
                    type="date"
                    name="tanggalBaptis"
                    className="form-control"
                    value={formData.tanggalBaptis}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Sidi</label>
                  <input
                    type="text"
                    name="tempatSidi"
                    className="form-control"
                    value={formData.tempatSidi}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Sidi</label>
                  <input
                    type="date"
                    name="tanggalSidi"
                    className="form-control"
                    value={formData.tanggalSidi}
                    onChange={handleChange}
                  />
                </div>

                {/* === Data Gereja === */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Warga Gereja</label>
                  <input
                    type="text"
                    name="wargaGereja"
                    className="form-control"
                    value={formData.wargaGereja}
                    onChange={handleChange}
                  />
                </div>

                {/* === Jadwal Pelayanan === */}
                <hr className="my-4" />
                <h6 className="fw-bold text-primary mb-3">🕊 Jadwal Pelayanan Pertobatan</h6>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Hari / Tanggal</label>
                  <input
                    type="text"
                    name="hariPelayanan"
                    className="form-control"
                    value={formData.hariPelayanan}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Tanggal Pelayanan</label>
                  <input
                    type="date"
                    name="tanggalPelayanan"
                    className="form-control"
                    value={formData.tanggalPelayanan}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Waktu / Pukul</label>
                  <input
                    type="text"
                    name="waktuPelayanan"
                    className="form-control"
                    value={formData.waktuPelayanan}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Tempat</label>
                  <input
                    type="text"
                    name="tempatPelayanan"
                    className="form-control"
                    value={formData.tempatPelayanan}
                    onChange={handleChange}
                  />
                </div>

                <div className="text-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    style={{ backgroundColor: "#004d97" }}
                  >
                    Kirim Permohonan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPermohonanPertobatan;
