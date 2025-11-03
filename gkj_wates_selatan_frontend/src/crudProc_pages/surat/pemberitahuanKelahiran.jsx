import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../components/NavbarComponent";

const PemberitahuanKelahiran = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaAyah: "",
    namaIbu: "",
    alamat: "",
    namaAnak: "",
    jenisKelamin: "",
    anakKe: "",
    keteranganAnakKe: "",
    hariLahir: "",
    tanggalLahir: "",
    waktuLahir: "",
    tempatLahir: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/surat/hasil/pemberitahuan-kelahiran", { state: formData });
  };

  return (
    <div>
      <NavbarComponent />

      <div className="container mt-5 mb-5">
        <div className="card shadow-lg">
          {/* === HEADER CARD === */}
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
              👶 Form Surat Pemberitahuan Kelahiran
            </h4>

            {/* Spacer biar seimbang */}
            <div style={{ width: "90px" }}></div>
          </div>

          {/* === BODY CARD === */}
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Nama Ayah & Ibu */}
                <h5 className="fw-bold mb-3" style={{ color: "#004d97" }}>
                  Data Orang Tua
                </h5>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAyah"
                    value={formData.namaAyah}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaIbu"
                    value={formData.namaIbu}
                    onChange={handleChange}
                  />
                </div>

                {/* Alamat */}
                <div className="col-md-12 mb-4">
                  <label className="form-label">Alamat</label>
                  <textarea
                    className="form-control"
                    name="alamat"
                    rows="2"
                    value={formData.alamat}
                    onChange={handleChange}
                  />
                </div>

                <hr className="my-4" />

                {/* Data Anak */}
                <h5 className="fw-bold mb-3" style={{ color: "#004d97" }}>
                  Data Anak
                </h5>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Anak</label>
                  <input
                    type="text"
                    className="form-control"
                    name="namaAnak"
                    value={formData.namaAnak}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    className="form-select"
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                  >
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Anak Ke</label>
                  <input
                    type="number"
                    className="form-control"
                    name="anakKe"
                    value={formData.anakKe}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-8 mb-3">
                  <label className="form-label">Keterangan Anak Ke</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="contoh: dari 3 bersaudara"
                    name="keteranganAnakKe"
                    value={formData.keteranganAnakKe}
                    onChange={handleChange}
                  />
                </div>

                <hr className="my-4" />

                {/* Waktu & Tempat Lahir */}
                <h5 className="fw-bold mb-3" style={{ color: "#004d97" }}>
                  Waktu & Tempat Kelahiran
                </h5>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Hari Lahir</label>
                  <input
                    type="text"
                    className="form-control"
                    name="hariLahir"
                    value={formData.hariLahir}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Waktu / Pukul</label>
                  <input
                    type="time"
                    className="form-control"
                    name="waktuLahir"
                    value={formData.waktuLahir}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Tempat Kelahiran</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary">
                  Kirim Pemberitahuan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PemberitahuanKelahiran;
