import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import logoGKJ from '../assets/logoGKJ.png';
import { NavbarComponent } from '../components/NavbarComponent';

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
          {/* Tombol Kembali di kiri */}
          <Link
            to="/data"
            className="btn btn-light btn-sm fw-bold position-absolute start-0 ms-3"
            style={{ color: "#004d97" }}
            title="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Kembali
          </Link>

          {/* Judul Tengah */}
          <h5 className="mb-0 fw-bold text-center flex-grow-1">BIODATA JEMAAT</h5>

          {/* Tombol Edit di kanan */}
          <Link
            to={`/edit`}
            className="btn btn-light btn-sm fw-bold position-absolute end-0 me-3"
            style={{ color: "#004d97" }}
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
