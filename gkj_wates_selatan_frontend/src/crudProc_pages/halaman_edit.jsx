import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { NavbarComponent } from "../components/NavbarComponent";

const EditJemaat = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state || !state.data) {
      alert("Data jemaat tidak ditemukan!");
      navigate("/data");
    }
  }, [state, navigate]);

  const [formData, setFormData] = useState(
    state?.data || {
      NIK: "",
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
    }
  );

  // ✅ file sertifikat baru
  const [selectedFile, setSelectedFile] = useState(null);
  // ✅ simpan status awal (sebelum diubah)
  const [initialStatus, setInitialStatus] = useState({
    baptis: formData.statusBaptis,
    sidi: formData.statusSidi,
    nikah: formData.statusNikah,
  });

  // 🔹 Update value form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Upload file
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 🔹 Submit ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nik = formData.NIK || formData.nik;
    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Tentukan jenis status yang baru diaktifkan
    if (initialStatus.baptis !== "Baptis" && formData.statusBaptis === "Baptis")
      formDataToSend.append("statusType", "baptis");
    else if (initialStatus.sidi !== "Sidi" && formData.statusSidi === "Sidi")
      formDataToSend.append("statusType", "sidi");
    else if (initialStatus.nikah !== "Menikah" && formData.statusNikah === "Menikah")
      formDataToSend.append("statusType", "nikah");

    if (selectedFile) formDataToSend.append("sertifikat", selectedFile);

    try {
      const res = await fetch(`http://localhost:5000/api/jemaat/${nik}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Data jemaat berhasil diperbarui!");
        navigate("/data");
      } else {
        alert("❌ " + (data.message || "Gagal memperbarui data jemaat."));
      }
    } catch (err) {
      console.error("❌ Error saat update:", err);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="container my-5">
        <div className="card shadow border-0 mb-4" style={{ borderRadius: "12px" }}>
          <div
            className="card-header text-white d-flex align-items-center justify-content-center position-relative"
            style={{
              backgroundColor: "#004d97",
              borderBottom: "none",
              height: "60px",
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-light btn-sm fw-bold position-absolute start-0 ms-3"
              style={{ color: "#004d97" }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Kembali
            </button>

            <h5 className="mb-0 fw-bold text-center flex-grow-1">
              EDIT DATA JEMAAT
            </h5>
          </div>

          <div className="card-body p-4 bg-light">
            <form onSubmit={handleSubmit} className="row g-3">
              {/* Kolom kiri */}
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
                  value={formData.tanggalLahir?.substring(0, 10) || ""}
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

              {/* Kolom kanan */}
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
                <label className="form-label fw-bold mt-3">Foto Profil</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setFormData({ ...formData, foto: e.target.files[0] })}
                />
              </div>

              {/* Status Gerejawi */}
              <div className="col-12">
                <hr />
                <h6 className="fw-bold text-primary mb-3">Status Gerejawi</h6>
                <div className="row">
                  
                  {/* Baptis */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Status Baptis</label>
                    <select
                      name="statusBaptis"
                      value={formData.statusBaptis}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Belum Baptis</option>
                      <option value="Baptis">Baptis</option>
                    </select>

                    {/* 🔹 Input sertifikat hanya muncul kalau awalnya belum baptis lalu diubah ke Baptis */}
                    {initialStatus.baptis !== "Baptis" &&
                      formData.statusBaptis === "Baptis" && (
                        <div className="mt-3">
                          <label className="form-label fw-bold">
                            Upload Sertifikat Baptis
                          </label>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                  </div>

                  {/* Sidi */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Status Sidi</label>
                    <select
                      name="statusSidi"
                      value={formData.statusSidi}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Belum Sidi</option>
                      <option value="Sidi">Sidi</option>
                    </select>

                    {initialStatus.sidi !== "Sidi" &&
                      formData.statusSidi === "Sidi" && (
                        <div className="mt-3">
                          <label className="form-label fw-bold">
                            Upload Sertifikat Sidi
                          </label>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                  </div>

                  {/* Nikah */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Status Nikah</label>
                    <select
                      name="statusNikah"
                      value={formData.statusNikah}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Belum Nikah</option>
                      <option value="Menikah">Menikah</option>
                    </select>

                    {initialStatus.nikah !== "Menikah" &&
                      formData.statusNikah === "Menikah" && (
                        <div className="mt-3">
                          <label className="form-label fw-bold">
                            Upload Sertifikat Nikah
                          </label>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
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
