import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BaptisDewasa = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    namaAyah: "",
    namaIbu: "",
    namaPasangan: "",
    tempatNikah: "",
    hariPelayanan: "",
    tanggalPelayanan: "",
    waktuPelayanan: "",
    tempatPelayanan: "",
    pembimbing: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/surat/hasil/baptis-dewasa", { state: formData });
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          <div
            className="card-header d-flex align-items-center justify-content-between text-white px-4 py-3"
            style={{ backgroundColor: "#004d97" }}
          >
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/surat")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Kembali
            </button>

            <h4 className="mb-0 flex-grow-1 text-center me-4">
              ✝️ Form Permohonan Baptis Dewasa
            </h4>
            <div style={{ width: "75px" }}></div>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* === Data Diri === */}
              <h5 className="text-primary mb-3 fw-bold">🧍 Data Diri</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahir"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Alamat</label>
                <input
                  type="text"
                  className="form-control"
                  name="alamat"
                  onChange={handleChange}
                />
              </div>

              {/* === Orang Tua === */}
              <h5 className="text-primary mb-3 fw-bold">👨‍👩‍👧 Data Orang Tua</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyah"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbu"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* === Pasangan (Opsional) === */}
              <h5 className="text-primary mb-3 fw-bold">💍 Data Pasangan (Jika Sudah Menikah)</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Suami/Istri</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaPasangan"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tempat Nikah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatNikah"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tanggal Nikah</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalNikah"
                    onChange={handleChange}
                  />
                </div>
              </div>


              {/* === Jadwal === */}
              <h5 className="text-primary mb-3 fw-bold">📅 Jadwal Pelayanan</h5>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Hari</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hariPelayanan"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalPelayanan"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Waktu / Pukul</label>
                  <input
                    type="time"
                    className="form-control"
                    name="waktuPelayanan"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Tempat Pelayanan</label>
                <input
                  type="text"
                  className="form-control"
                  name="tempatPelayanan"
                  onChange={handleChange}
                />
              </div>

              {/* === Pembimbing === */}
              <h5 className="text-primary mb-3 fw-bold">👨‍🏫 Pembimbing</h5>
              <div className="mb-3">
                <label className="form-label">Nama Pembimbing Katekisasi</label>
                <input
                  type="text"
                  className="form-control"
                  name="pembimbing"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaptisDewasa;
