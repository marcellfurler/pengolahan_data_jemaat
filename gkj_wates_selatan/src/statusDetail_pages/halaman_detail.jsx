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

// -----------------------------
// 🌟 DETAIL ITEM COMPONENT
// -----------------------------
const DetailListItem = ({ label, value }) => (
  <li className="list-group-item d-flex align-items-center py-2 px-3 border-0 border-bottom">
    <div className="fw-semibold text-muted" style={{ width: '150px', minWidth: '150px' }}>
      {label}
    </div>
    <div className="text-dark flex-grow-1 ps-2">
      : {value}
    </div>
  </li>
);

// -----------------------------
// 🌟 DETAIL PAGE COMPONENT
// -----------------------------
const DetailJemaat = ({ data }) => {
  const dataPribadi = [
    { label: 'NIK', value: data.nik || '-' },
    { label: 'Nama Lengkap', value: data.nama || '-' },
    { label: 'TTL', value: `${data.tempatLahir || '-'}, ${data.tanggalLahir || data.ttl || '-'}` },
    { label: 'Jenis Kelamin', value: data.jenisKelamin || '-' },
    { label: 'Agama', value: data.agama || '-' },
    { label: 'Golongan Darah', value: data.golonganDarah || '-' },
    { label: 'Warga Negara', value: data.wargaNegara || '-' },
  ];

  const dataKontak = [
    { label: 'No. Telepon', value: data.telepon || data.kontak || '-' },
    { label: 'Alamat', value: data.alamat || '-' },
  ];

  const dataGerejawi = [
    { label: 'Pepanthan', value: data.pepanthan || '-' },
    { label: 'Status Sidi', value: data.statusSidi || '-' },
    { label: 'Status Baptis', value: data.statusBaptis || '-' },
    { label: 'Status Nikah', value: data.statusNikah || '-' },
    { label: 'Status Pelayanan', value: data.statusPelayanan || '-' },
  ];

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-sm border-0 overflow-hidden">

        {/* HEADER CARD */}
        <div
        className="card-header text-white d-flex align-items-center justify-content-center position-relative"
        style={{
            backgroundColor: '#004d97',
            borderBottom: 'none',
            height: '60px',
            padding: '0 1rem',
        }}
        >
        <h5 className="mb-0 fw-bold text-center flex-grow-1">BIODATA JEMAAT</h5>

        <Link
            to={`/edit`}
            className="btn btn-light btn-sm fw-bold position-absolute end-0 me-3"
            style={{color:"#004d97"}}
            title="Edit Data"
        >
            <FontAwesomeIcon icon={faPencilAlt} className="me-1" /> Edit
        </Link>
        </div>


        {/* BODY CARD */}
        <div className="card-body p-0">
          <div className="row g-0">

            {/* FOTO */}
            <div className="col-12 col-lg-4 p-4 border-end d-flex flex-column align-items-center bg-light">
            <img
                src={data.foto || "https://placehold.co/150x150/004d99/ffffff?text=FOTO"}
                alt="Foto Profil Jemaat"
                className="img-fluid rounded-circle shadow mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <h5 className="fw-bold text-primary mb-1">{data.nama || 'Nama Jemaat'}</h5>
            <p className="text-muted small mb-0">{data.statusPelayanan || '-'}</p>
            <p className="text-muted small">Pepanthan: {data.pepanthan || '-'}</p>
            </div>

            {/* DATA DETAIL */}
            <div className="col-12 col-lg-8">
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-light fw-bold py-2 border-top-0">Data Pribadi</li>
                {dataPribadi.map((item, index) => (
                  <DetailListItem key={`pribadi-${index}`} label={item.label} value={item.value} />
                ))}

                <li className="list-group-item bg-light fw-bold py-2">Kontak & Alamat</li>
                {dataKontak.map((item, index) => (
                  <DetailListItem key={`kontak-${index}`} label={item.label} value={item.value} />
                ))}

                <li className="list-group-item bg-light fw-bold py-2">Status Gerejawi</li>
                {dataGerejawi.map((item, index) => (
                  <DetailListItem key={`gereja-${index}`} label={item.label} value={item.value} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TOMBOL KEMBALI */}
      <div className="mt-4 text-center">
        <Link to="/data" className="btn btn-outline-secondary">
          &larr; Kembali ke Daftar Jemaat
        </Link>
      </div>
    </div>
  );
};

// -----------------------------
// 🌟 MAIN PAGE
// -----------------------------
const HalamanDetail = () => {
  const location = useLocation();
  const data = location.state?.data;

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#e2e2e2' }}>
        <NavbarComponent />
        <div className="container mt-5 text-center">
          <h4>Data jemaat tidak ditemukan atau gagal dimuat dari halaman sebelumnya.</h4>
          <Link to="/data" className="btn btn-outline-secondary mt-3">
            &larr; Kembali ke Daftar Jemaat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <NavbarComponent />
      <DetailJemaat data={data} />
    </div>
  );
};

export default HalamanDetail;
