import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'; 
import logoGKJ from '../assets/logoGKJ.png';
import { NavbarComponent } from '../components/NavbarComponent';



const EditJemaat = () => {
  const { nik } = useParams();
  const [formData, setFormData] = useState({
    nama: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    golonganDarah: "",
    wargaNegara: "",
    telepon: "",
    alamat: "",
    pepanthan: "",
    statusSidi: "",
    statusBaptis: "",
    statusNikah: "",
    statusPelayanan: "",
    foto: "",
  });

  useEffect(() => {
    // Ambil data dari JSON (dummy sementara)
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const jemaat = data.find((item) => item.nik === nik);
        if (jemaat) setFormData(jemaat);
      });
  }, [nik]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Data jemaat berhasil disimpan! (Simulasi)");
  };

  return (
    <>
      {/* TAMBAHKAN NavbarComponent di sini */}
      <NavbarComponent />
      
      <div className="container my-5">
        {/* Header Card */}
        <div
          className="card shadow border-0 mb-4"
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <div
            className="card-header text-white d-flex align-items-center justify-content-center position-relative"
            style={{
              backgroundColor: "#004d97",
              borderBottom: "none",
              height: "60px",
              padding: "0 1rem",
            }}
          >
            {/* Tombol Kembali di sebelah kiri */}
            <Link
              to="/data"
              className="btn btn-light btn-sm fw-bold position-absolute start-0 ms-3"
              style={{color:"#004d97"}}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Kembali
            </Link>

            <h5 className="mb-0 fw-bold text-center flex-grow-1">
              EDIT DATA JEMAAT
            </h5>
          </div>

          {/* Body Form */}
          <div className="card-body p-4 bg-light">
            <form onSubmit={handleSubmit} className="row g-3">
              {/* Kolom Kiri */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="form-control"
                  required
                />

                <label className="form-label fw-bold mt-3">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  className="form-control"
                />

                <label className="form-label fw-bold mt-3">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  className="form-control"
                />

                <label className="form-label fw-bold mt-3">Jenis Kelamin</label>
                <select
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Pilih...</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>

                <label className="form-label fw-bold mt-3">Agama</label>
                <input
                  type="text"
                  name="agama"
                  value={formData.agama}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Kolom Kanan */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Golongan Darah</label>
                <input
                  type="text"
                  name="golonganDarah"
                  value={formData.golonganDarah}
                  onChange={handleChange}
                  className="form-control"
                />

                <label className="form-label fw-bold mt-3">Telepon</label>
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  className="form-control"
                />

                <label className="form-label fw-bold mt-3">Alamat</label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                ></textarea>

                <label className="form-label fw-bold mt-3">Pepanthan</label>
                <input
                  type="text"
                  name="pepanthan"
                  value={formData.pepanthan}
                  onChange={handleChange}
                  className="form-control"
                />

                <label className="form-label fw-bold mt-3">Foto (URL)</label>
                <input
                  type="text"
                  name="foto"
                  value={formData.foto}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://..."
                />
              </div>

              {/* Bagian Status */}
              <div className="col-12">
                <hr />
                <h6 className="fw-bold text-primary mb-3">Status Gerejawi</h6>

                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Status Baptis</label>
                    <input
                      type="text"
                      name="statusBaptis"
                      value={formData.statusBaptis}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold">Status Sidi</label>
                    <input
                      type="text"
                      name="statusSidi"
                      value={formData.statusSidi}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold">Status Nikah</label>
                    <input
                      type="text"
                      name="statusNikah"
                      value={formData.statusNikah}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="col-12 text-end mt-4">
                <button
                  type="submit"
                  className="btn fw-bold text-white px-4"
                  style={{
                    backgroundColor: "#004d97",
                    borderRadius: "8px",
                  }}
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
  
};



export default EditJemaat;