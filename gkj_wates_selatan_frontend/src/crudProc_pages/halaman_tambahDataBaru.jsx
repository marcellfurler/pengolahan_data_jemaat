import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faArrowRight, faImage } from "@fortawesome/free-solid-svg-icons";
import { NavbarComponent } from "../components/NavbarComponent";
import dataJemaat from "../data/dataJemaat.json";

const HalamanTambahDataBaru = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    alamat: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    kontak: "",
    pepanthan: "",
    statusJemaat: "",
    statusSidi: "",
    statusBaptis: "",
    statusNikah: "",
    dataPelayanan: {},
    dataNikah: {},
    dataSidi: {},
    dataBaptis: {},
    foto: "",
  });

  // Fungsi ubah input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

    const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result);
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1 → Step berikutnya
  const handleNext = (e) => {
    e.preventDefault();

    // Jika dia petugas pelayanan
    if (
      formData.statusJemaat === "Pendeta" ||
      formData.statusJemaat === "Majelis" ||
      formData.statusJemaat === "Koordinator Pelayanan"
    ) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  // Step 2 → Step 3
  const handleNextAfterPelayanan = (e) => {
    e.preventDefault();
    setStep(3);
  };

  // Tombol kembali
  const handleBack = (e) => {
    e.preventDefault();
    if (step === 2) setStep(1);
    else if (step === 3) {
      if (
        formData.statusJemaat === "Pendeta" ||
        formData.statusJemaat === "Majelis" ||
        formData.statusJemaat === "Koordinator Pelayanan"
      ) {
        setStep(2);
      } else {
        setStep(1);
      }
    }
  };

  // Simpan data
  const handleSubmit = (e) => {
    e.preventDefault();
    const existingData = JSON.parse(localStorage.getItem("dataJemaat")) || dataJemaat;
    const newData = [...existingData, { id: Date.now(), ...formData }];
    localStorage.setItem("dataJemaat", JSON.stringify(newData));
    alert("Data jemaat baru berhasil ditambahkan!");
    navigate("/data");
  };

  // Progress bar
  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  // Kondisi untuk menampilkan form di Step 3
  const showNikah =
    formData.statusNikah === "Menikah" ||
    formData.statusNikah === "Cerai Gugat" ||
    formData.statusNikah === "Cerai Talak" ||
    formData.statusNikah === "Cerai Meninggal";

  const showSidi = formData.statusSidi === "Sidi";
  const showBaptis = formData.statusBaptis === "Baptis";

  return (
    <>
      <NavbarComponent />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          {step === 1 ? (
            <Link to="/data" className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} /> Kembali
            </Link>
          ) : (
            <button onClick={handleBack} className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} /> Kembali
            </button>
          )}

          <h3 className="text-center flex-grow-1">
            {step === 1
              ? "Tambah Data Jemaat Baru"
              : step === 2
              ? "Form Data Pelayanan"
              : "Form Data Tambahan"}
          </h3>

          <div style={{ width: "80px" }}></div>
        </div>

        {/* Indikator langkah */}
        <div className="mb-4">
          <div className="progress" style={{ height: "20px" }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
              role="progressbar"
              style={{ width: `${progress}%` }}
            >
              Step {step} / 3
            </div>
          </div>
        </div>

        <div className="card shadow p-4">
          {/* STEP 1 – DATA UTAMA */}
          {step === 1 && (
            <form onSubmit={handleNext}>
              <div className="row">
                {/* Data utama seperti sebelumnya */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    name="nama"
                    className="form-control"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">NIK</label>
                  <input
                    type="text"
                    name="nik"
                    className="form-control"
                    value={formData.nik}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tempat Lahir</label>
                  <input
                    type="text"
                    name="tempatLahir"
                    className="form-control"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    className="form-control"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    className="form-control"
                    value={formData.alamat}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    className="form-select"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                {/* Input Foto */}
                <div className="col-md-3 mb-3">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faImage} className="me-2" />
                    Upload Foto Jemaat
                  </label>
                  <input
                  name="foto"
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleFotoUpload}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Agama</label>
                  <select
                    name="agama"
                    className="form-select"
                    value={formData.agama}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Kontak</label>
                  <input
                    type="text"
                    name="kontak"
                    className="form-control"
                    value={formData.kontak}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Pepanthan</label>
                  <select
                    name="pepanthan"
                    className="form-select"
                    value={formData.pepanthan}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Pepanthan Induk Depok">Pepanthan Induk Depok</option>
                    <option value="Pepanthan Triharjo">Pepanthan Triharjo</option>
                    <option value="Pepanthan Galur">Pepanthan Galur</option>
                    <option value="Pepanthan Wonogiri">Pepanthan Wonogiri</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Status Jemaat</label>
                  <select
                    name="statusJemaat"
                    className="form-select"
                    value={formData.statusJemaat}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Jemaat Biasa">Jemaat Biasa</option>
                    <option value="Pendeta">Pendeta</option>
                    <option value="Majelis">Majelis</option>
                    <option value="Koordinator Pelayanan">Koordinator Pelayanan</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Status Nikah</label>
                  <select
                    name="statusNikah"
                    className="form-select"
                    value={formData.statusNikah}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Cerai Gugat">Cerai Gugat</option>
                    <option value="Cerai Talak">Cerai Talak</option>
                    <option value="Cerai Meninggal">Cerai Meninggal</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Status Sidi</label>
                  <select
                    name="statusSidi"
                    className="form-select"
                    value={formData.statusSidi}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Sidi">Sidi</option>
                    <option value="Belum Sidi">Belum Sidi</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Status Baptis</label>
                  <select
                    name="statusBaptis"
                    className="form-select"
                    value={formData.statusBaptis}
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Baptis">Baptis</option>
                    <option value="Belum Baptis">Belum Baptis</option>
                  </select>
                </div>
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Next <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 – DATA PELAYANAN */}
          {step === 2 && (
            <form onSubmit={handleNextAfterPelayanan}>
              <h5 className="text-center flex-grow-1 mb-3">Form Data Pelayanan</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tahun Pentahbisan</label>
                  <input
                    type="text"
                    name="dataPelayanan.tahunPentahbisan"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Riwayat Pendidikan</label>
                  <input
                    type="text"
                    name="dataPelayanan.riwayatPendidikan"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Riwayat Pelayanan</label>
                  <textarea
                    name="dataPelayanan.riwayatPelayanan"
                    className="form-control"
                    rows="3"
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Jabatan</label>
                  <select
                    name="dataPelayanan.jabatan"
                    className="form-select"
                    onChange={handleChange}
                  >
                    <option value="">-- Pilih Jabatan --</option>
                    <option value="Ketua Majelis Jemaat">Ketua Majelis Jemaat</option>
                    <option value="Pendeta Jemaat">Pendeta Jemaat</option>
                    <option value="Pendeta Pembantu">Pendeta Pembantu</option>
                    <option value="Pendeta Emeritus">Pendeta Emeritus</option>
                  </select>
                </div>
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Next <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 – DATA TAMBAHAN (DINAMIS) */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* TAMPILKAN HANYA SESUAI STATUS */}
                {showNikah && (
                  <>
                  <h5 className="text-center flex-grow-1 mb-3">Form Informasi Pernikahan</h5>
                    <br /><br />
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Nomor Surat</label>
                      <input
                        type="text"
                        name="dataNikah.nomorSuratNikah"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Tanggal Pernikahan</label>
                      <input
                        type="date"
                        name="dataNikah.tanggalNikah"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Nama Pendeta yang melayani</label>
                      <input
                        type="text"
                        name="dataNikah.pendetaNikah"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Gereja Asal Pernikahan</label>
                      <input
                        type="text"
                        name="dataNikah.gerejaAsalNikah"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Nama Pasangan</label>
                      <input
                        type="text"
                        name="dataNikah.namaPasangan"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <br /><br /><br /><br />
                  </>
                )}

                {showSidi && (
                  <>
                  <h5 className="text-center flex-grow-1 mb-3">Form Informasi Sidi</h5>
                    <br /><br />
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Nomor Surat</label>
                      <input
                        type="text"
                        name="dataSidi.nomorSuratSidi"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Tanggal Sidi</label>
                      <input
                        type="date"
                        name="dataSidi.tanggalSidi"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Gereja Asal Sidi</label>
                      <input
                        type="text"
                        name="dataSidi.gererjaAsalSidi"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Pendeta yang Melayani Sidi</label>
                      <input
                        type="text"
                        name="dataSidi.pendetaSidi"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <br /><br /><br /><br></br>
                  </>
                )}

                {showBaptis && (
                  <>
                  <h5 className="text-center flex-grow-1 mb-3">Form Informasi Baptis</h5>
                  <br /><br />
                  <div className="col-md-3 mb-3">
                      <label className="form-label">Nomor Surat</label>
                      <input
                        type="text"
                        name="dataSidi.nomorSuratBaptis"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Tanggal Baptis</label>
                      <input
                        type="date"
                        name="dataBaptis.tanggalBaptis"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Gereja Asal Baptis</label>
                      <input
                        type="text"
                        name="dataSidi.gererjaAsalBaptis"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Pendeta yang Membaptis</label>
                      <input
                        type="text"
                        name="dataBaptis.pendetaBaptis"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-success">
                  <FontAwesomeIcon icon={faSave} /> Simpan Data
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default HalamanTambahDataBaru;
