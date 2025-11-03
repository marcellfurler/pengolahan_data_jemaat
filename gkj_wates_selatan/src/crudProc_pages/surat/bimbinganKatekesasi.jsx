import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";

const BimbinganKatekesasi = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    namaAyah: "",
    namaIbu: "",
    tanggalBaptis: "",
    tempatBaptis: "",
    hariBimbingan: "",
    waktuBimbingan: "",
    tempatBimbingan: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/surat/hasil/katekisasi", { state: data });
  };

  return (
    <div>
      <NavbarComponent />

      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          {/* === HEADER FORM === */}
          <div
            
            style={{ backgroundColor: "#004d97" }}
          >
            <div className="card-header d-flex align-items-center justify-content-between text-white px-4 py-3">
              <button
                className="btn btn-light btn-sm fw-bold"
                onClick={() => navigate(-1)}
              >
                ←Kembali
              </button>
              <h4 className="text-center flex-grow-1 m-0 w-100">
                📖 Form Permohonan Bimbingan Katekisasi
              </h4>
            </div>
          </div>

          {/* === BODY FORM === */}
          <div className="card-body px-4 py-4">
            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold mb-3 text-primary">🧍 Data Jemaat</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={data.nama}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Tempat Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahir"
                    value={data.tempatLahir}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    value={data.tanggalLahir}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label fw-bold">Alamat</label>
                  <input
                    type="text"
                    className="form-control"
                    name="alamat"
                    value={data.alamat}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyah"
                    value={data.namaAyah}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbu"
                    value={data.namaIbu}
                    onChange={handleChange}
                    // required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Tanggal Baptis Anak</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalBaptis"
                    value={data.tanggalBaptis}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Tempat Baptis Anak</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBaptis"
                    value={data.tempatBaptis}
                    onChange={handleChange}
                    // required
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h5 className="fw-bold mb-3 text-success">📅 Jadwal Bimbingan</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-bold">Hari</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hariBimbingan"
                    value={data.hariBimbingan}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Waktu / Pukul</label>
                  <input
                    type="time"
                    className="form-control"
                    name="waktuBimbingan"
                    value={data.waktuBimbingan}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Tempat</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatBimbingan"
                    value={data.tempatBimbingan}
                    onChange={handleChange}
                    // required
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

export default BimbinganKatekesasi;
