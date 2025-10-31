// src/components/NavbarComponent.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import logoGKJ from '../assets/logoGKJ.png'; // perhatikan path-nya
// import backgroundimg2 from '../assets/gkjwatesselatan2.png';

export const NavbarComponent = () => (
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
          <div className="d-none d-sm-block text-truncate"> 
            <span className="d-block" style={{ lineHeight: '1.2' }}>GEREJA KRISTEN JAWA</span>
            <span className="d-block" style={{ lineHeight: '1.2' }}>WATES SELATAN</span>
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
              <Link className="lead nav-link active" aria-current="page" to="/data" style={{ fontSize: '1.1rem' }}>Data</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#" style={{ fontSize: '1.1rem' }}>Statistik</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dataBaru" style={{ fontSize: '1.1rem' }}>Data Baru</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/surat" style={{ fontSize: '1.1rem' }}>Surat</Link>
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


export const NavbarComponentLogin = () => (
  <header>
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ height: '80px' }}>
      <div className="container-fluid container-lg"> {/* Menggunakan container-fluid untuk mobile, container-lg untuk desktop */}
        
        {/* Konten Navbar Brand */}
        <a className="navbar-brand d-flex align-items-center" href="#" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#004d99' }}>
          <img
            src={logoGKJ}
            alt="Logo GKJ"
            width="60"
            height="60"
            className="d-inline-block align-text-top rounded-circle me-3 flex-shrink-0" // flex-shrink-0 agar logo tidak mengecil
            style={{ objectFit: 'cover' }}
          />
          {/* Judul Gereja, disembunyikan di layar sangat kecil, tampil di layar kecil ke atas */}
          <div className="d-none d-sm-block text-truncate"> 
            <span className="d-block" style={{ lineHeight: '1.2' }}>GEREJA KRISTEN JAWA</span>
            <span className="d-block" style={{ lineHeight: '1.2' }}>WATES SELATAN</span>
          </div>
          {/* Hanya menampilkan 'GKJ' di layar sangat kecil (<576px) */}
          <div className="d-sm-none"> 
            <span className="d-block" style={{ lineHeight: '1.2' }}>GKJ WATES SELATAN</span>
          </div>
        </a>
        
        {/* Tambahkan elemen lain di sini jika ada menu navigasi lain, menggunakan navbar-toggler untuk tombol hamburger */}
        
      </div>
    </nav>
  </header>
);
// export default NavbarComponent;
