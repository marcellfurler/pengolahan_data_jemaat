import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";

const PencalonanMajelis = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    hari: "",
    tanggal: "",
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    namaSuamiIstri: "",
    majelisI: "",
    majelisII: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/surat/hasil/calon-majelis", { state: data });
  };

  return (
    <div>
      <NavbarComponent />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          {/* === HEADER === */}
          <div
            className="card-header d-flex justify-content-between align-items-center text-white py-3 px-4"
            style={{ backgroundColor: "#004d97" }}
          >
            {/* Tombol kembali */}
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate(-1)}
              style={{ fontWeight: "bold" }}
            >
              ← Kembali
            </button>

            {/* Judul */}
            <h4 className="mb-0 text-center flex-grow-1">
              Form Surat Pencalonan Majelis
            </h4>

            {/* Spacer biar seimbang */}
            <div style={{ width: "90px" }}></div>
          </div>

          {/* === BODY FORM === */}
          <div className="card-body px-4 py-4">
            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold mb-3 text-primary">
                🗓️ Data Pemanggilan Majelis
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Hari</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hari"
                    value={data.hari}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggal"
                    value={data.tanggal}
                    onChange={handleChange}
                    // required
                  />
                </div>
              </div>

              <hr className="my-4" />

              <h5 className="fw-bold mb-3 text-success">
                🙋‍♂️ Data Calon Majelis
              </h5>
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
                  <textarea
                    className="form-control"
                    name="alamat"
                    rows="2"
                    value={data.alamat}
                    onChange={handleChange}
                    // required
                  ></textarea>
                </div>
              </div>

              <hr className="my-4" />

              <h5 className="fw-bold mb-3 text-danger">
                ✍️ Tanda Tangan dan Persetujuan
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nama Suami/Istri</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaSuamiIstri"
                    value={data.namaSuamiIstri}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Majelis I (Mengetahui)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="majelisI"
                    value={data.majelisI}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Majelis II (Mengetahui)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="majelisII"
                    value={data.majelisII}
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

export default PencalonanMajelis;
