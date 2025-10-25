import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import logoGKJ from '../assets/logoGKJ.png';

const NavbarComponent = () => (
  <header style={{ position: 'sticky', top: 0, zIndex: 1030 }}>
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm"
      style={{
        height: '80px',
        backgroundColor: '#ececec',
        margin: 0,
        padding: 0,
      }}
    >
      <div className="container-fluid container py-0">
        {/* Logo dan Nama Gereja */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#004d99',
          }}
        >
          <img
            src={logoGKJ}
            alt="Logo GKJ"
            width="60"
            height="60"
            className="d-inline-block align-text-top rounded-circle me-3"
            style={{ objectFit: 'cover' }}
          />
          <div>
            <span className="d-block">GEREJA KRISTEN JAWA</span>
            <span className="d-block">WATES SELATAN</span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="lead nav-link active" aria-current="page" to="#" style={{ fontSize: '1.1rem' }}>Data</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#" style={{ fontSize: '1.1rem' }}>Statistik</Link>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '1.1rem' }}>
                Tambah Data Baru
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="#">Permohonan Pelayanan Pertobatan</Link></li>
                <li><Link className="dropdown-item" to="#">Permohonan Pelayanan Baptis Anak</Link></li>
                <li><Link className="dropdown-item" to="#">Pemberitahuan Kelahiran</Link></li>
                <li><Link className="dropdown-item" to="#">Permohonan Bimbingan Katekisasi</Link></li>
                <li><Link className="dropdown-item" to="#">Kesangguppan Pencalonan Majelis</Link></li>
                <li><Link className="dropdown-item" to="#">Permohonan Pindah Gereja (Atestasi)</Link></li>
                <li><Link className="dropdown-item" to="#">Permohonan Peneguhan & Pemberkatan Pernikahan</Link></li>
                <li><Link className="dropdown-item" to="#">Permohonan Pengakuan Percaya (Sidi)</Link></li>
                <li><Link className="dropdown-item" to="#">Permohonan Baptis Dewasa</Link></li>
                <li><Link className="dropdown-item" to="#">Berita Acara Pertunangan</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '1.1rem' }}>
                Hello Jimm :D
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="#">Informasi Admin</Link></li>
                <li><Link className="dropdown-item" to="/">Log out</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
);

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
          <h5 className="mb-0 fw-bold text-center flex-grow-1">
            EDIT DATA JEMAAT
          </h5>
          <Link
            to="/detail"
            className="btn btn-light btn-sm fw-bold text-primary position-absolute end-0 me-3"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Kembali
          </Link>
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
  );
};

export default EditJemaat;