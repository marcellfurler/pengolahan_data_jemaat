import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";


// Impor logo
import logoGKJ from './assets/logoGKJ.png';

// Impor data jemaat dari file JSON
import dataJemaat from './data/dataJemaat.json';

// --- Komponen Navbar ---
const NavbarComponent = () => (
  <header>
    <nav className="navbar navbar-expand-lg navbar-light" style={{ height: '80px', backgroundColor: '#ecececff' }}>
      <div className="container-fluid container">
        {/* Logo dan Nama Gereja */}
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#004d99' }}>
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

        {/* Toggler (untuk mobile view) */}
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

        {/* Menu navigasi */}
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
                <li><Link className="dropdown-item" to="#">Permohonan Pelayanan Peneguhan dan Pemberkatan Pernikahan</Link></li>
                <li><Link className="dropdown-item" to="#">Permohonan Pelayanan Pengakuan Percaya (Sidi)</Link></li>
                <li><Link className="dropdown-item" to="#">Permohonan Pelayanan Pengakuan Percaya dan Baptis Dewasa</Link></li>
                <li><Link className="dropdown-item" to="#">Berita Acara Pertunangan</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '1.1rem' }}>
                Visualisasi
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="#">Organisasi</Link></li>
                <li><Link className="dropdown-item" to="#">Demografi</Link></li>
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

// --- Komponen Tabel Data Jemaat ---
const TabelDataJemaat = () => (
  <div className="container-fluid mt-4 mb-5 px-4">
    <div className="card border-0">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-sm table-hover mb-0">
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th>No</th>
                <th>NIK</th>
                <th>Nama Jemaat</th>
                <th>Tempat, Tanggal Lahir</th>
                <th>Pepanthan</th>
                <th>Kontak</th>
                <th>Status Sidi</th>
                <th>Status Baptis</th>
                <th>Status Pernikahan</th>
                <th>Status Pelayanan</th>
                <th>Inf. Lengkap</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {dataJemaat.map((data, index) => (
                <tr key={index} style={{ fontSize: '0.9rem' }}>
                  <td>{data.no}</td>
                  <td>{data.nik.slice(0, 4)} . . .</td>
                  <td>{data.nama}</td>
                  <td>{data.ttl}</td>
                  <td>{data.pepanthan}</td>
                  <td>{data.kontak}</td>

                  <td>
                    {data.statusSidi === 'Sidi' ? (
                      <Link to={`/detail-jemaat/${data.nik}?status=sidi`} className='text-primary' title="Lihat Data Sidi">
                        {data.statusSidi}
                      </Link>
                    ) : (
                      <span>{data.statusSidi}</span>
                    )}
                  </td>

                  <td>
                    {data.statusBaptis === 'Baptis' ? (
                      <Link to={`/detail-jemaat/${data.nik}?status=baptis`} className='text-primary' title="Lihat Data Baptis">
                        {data.statusBaptis}
                      </Link>
                    ) : (
                      <span>{data.statusBaptis}</span>
                    )}
                  </td>

                  <td>
                    {(data.statusNikah === 'Menikah' || data.statusNikah === 'Cerai') ? (
                      <Link to={`/detail-jemaat/${data.nik}?status=nikah`} className='text-primary' title="Lihat Data Pernikahan">
                        {data.statusNikah}
                      </Link>
                    ) : (
                      <span>{data.statusNikah}</span>
                    )}
                  </td>

                  <td>{data.statusPelayanan}</td>

                  <td>
                    <Link 
                      to="/detail" 
                      state={{ data }} // 👈 kirim objek jemaat ke halaman detail
                      className="text-primary" 
                      title="Lihat Detail"
                    >
                      detail
                    </Link>
                  </td>

                  <td>
                    <Link to={`/edit`} className="text-primary" title="Edit Data">
                      edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// --- Komponen utama ---
const HalamanData = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <NavbarComponent />
      <TabelDataJemaat />
    </div>
  );
};

export default HalamanData;
