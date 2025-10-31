import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BaptisAnak = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaAyah: "",
    namaIbu: "",
    alamat: "",
    namaAnak: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
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
    navigate("/surat/hasil/baptis-anak", { state: formData });
    };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          {/* Header Card dengan tombol kembali */}
          <div
            className="card-header d-flex align-items-center justify-content-between text-white py-3"
            style={{ backgroundColor: "#004d97" }}
          >
            {/* Tombol Kembali */}
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate("/surat")}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Kembali
            </button>

            {/* Judul di Tengah */}
            <h4 className="mb-0 flex-grow-1 text-center me-4">
              ✝️ Form Permohonan Baptis Anak
            </h4>

            {/* Spacer agar posisi tombol kiri & judul seimbang */}
            <div style={{ width: "75px" }}></div>
          </div>

          {/* Body Form */}
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <h5 className="text-primary mb-3 fw-bold">
                🧑‍🤝‍👩 Data Orang Tua
              </h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyah"
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbu"
                    onChange={handleChange}
                    // required
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
                //   required
                />
              </div>

              <h5 className="text-primary mb-3 fw-bold">👶 Data Anak</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nama Anak</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAnak"
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    className="form-select"
                    onChange={handleChange}
                    // required
                  >
                    <option value="">-- Pilih Jenis Kelamin --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahir"
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    onChange={handleChange}
                    // required
                  />
                </div>
              </div>

              <h5 className="text-primary mb-3 fw-bold">
                📅 Jadwal Pelayanan Baptis
              </h5>
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Hari</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hariPelayanan"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalPelayanan"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Waktu</label>
                  <input
                    type="time"
                    className="form-control"
                    name="waktuPelayanan"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tempat</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatPelayanan"
                    onChange={handleChange}
                  />
                </div>
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

export default BaptisAnak;
