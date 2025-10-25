import React from "react";
import { Link } from "react-router-dom";

import logoGKJ from './assets/logoGKJ.png';
import backgroundimg2 from './assets/gkjwatesselatan2.png';

// Komponen Navbar (sama seperti halaman login)
const NavbarComponent = () => (
  <header>
    <nav className="navbar navbar-expand-lg navbar-lightt" style={{ height: '80px', backgroundColor: '#ecececff' }}>
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#004d99' }}>
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
        </a>

      </div>
    </nav>
  </header>
);

// Komponen Form Daftar
const RegisterForm = () => {
    return (
        <div className="card shadow-sm p-4" style={{ 
            width: '400px', 
            backgroundColor: '#f0f0f0', 
            border: 'none',
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
            {/* Logo GKJ di atas Form */}
            <img
                src={logoGKJ}
                alt="Logo GKJ Besar"
                width="90"
                height="90"
                className="d-block mx-auto mb-3" // Mengubah mb-2 ke mb-3 untuk jarak yang lebih baik
                style={{ objectFit: 'cover' }}
            />
            
            {/* Nama Lengkap */}
            <div className="mb-2 text-start">
                <label htmlFor="namaLengkapInput" className="form-label">Nama Lengkap</label>
                <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    id="namaLengkapInput" 
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '50px' }} // Menyesuaikan tinggi input
                />
            </div>

            {/* Nama Pengguna */}
            <div className="mb-2 text-start">
                <label htmlFor="usernameInput" className="form-label">Nama Pengguna</label>
                <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    id="usernameInput" 
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '50px' }} // Menyesuaikan tinggi input
                />
            </div>

            {/* Nomor HP / Email */}
            <div className="mb-2 text-start">
                <label htmlFor="emailInput" className="form-label">Nomor HP/ Email</label>
                <input 
                    type="email" 
                    className="form-control form-control-lg" 
                    id="emailInput" 
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '50px' }} // Menyesuaikan tinggi input
                />
            </div>

            {/* Kata Sandi */}
            <div className="mb-2 text-start"> {/* Mengubah mb-2 ke mb-4 untuk jarak tombol */}
                <label htmlFor="passwordInput" className="form-label">Kata Sandi</label>
                <input 
                    type="password" 
                    className="form-control form-control-lg" 
                    id="passwordInput" 
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '50px' }} // Menyesuaikan tinggi input
                />
            </div>

            {/* Tombol Daftar */}
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
                <button 
                    type="button" 
                    className="btn btn-info btn-lg w-100 fw-bold shadow-sm" 
                    style={{ backgroundColor: '#004d99', borderColor: '#004d99', color: 'white', padding: '12px' }} // Menyesuaikan padding tombol
                    onClick={(e) => {console.log("Tombol Daftar diklik"); }}
                >
                    DAFTAR
                </button>
            </Link>            
        </div>
    );
};

// Komponen Halaman Daftar Utama
const HalamanDaftar = () => {
    return (
        <>
            {/* Memuat Bootstrap CSS dari CDN */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
                crossOrigin="anonymous" 
            />

            <NavbarComponent />
            
            {/* Konten Utama: Menggunakan flexbox untuk layout 100vh */}
            <div className="d-flex" style={{ height: 'calc(100vh - 80px)' }}>
                
                {/* Kolom Kiri: Gambar Latar */}
                <div 
                    className="d-flex flex-column justify-content-center align-items-center text-white p-5"
                    style={{
                        flex: 1,
                        backgroundImage: `url(${backgroundimg2})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        backgroundAttachment: 'fixed'
                    }}
                >
                    {/* Overlay */}
                    <div 
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(0, 77, 153, 0.4)',
                            zIndex: 1,
                        }}
                    />

                    {/* Konten Login */}
                    <div className="position-relative text-center" style={{ zIndex: 2 }}>
                        <Link to="/login" style={{ textDecoration: "none"}}>
                            <button 
                                className="btn btn-light btn-lg fw-bold shadow-lg mb-4"
                                style={{ 
                                    backgroundColor: 'rgba(108, 117, 125, 0.7)',  
                                    color: 'white', 
                                    padding: '15px 40px',
                                    fontSize: '1.5rem'
                                }}
                                onClick={() => console.log("Tombol Masuk di sidebar diklik")}
                            >
                                MASUK
                            </button>
                        </Link>
                        
                        <p className="lead mb-5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                            Saya sudah memiliki akun, saya akan <a href="/login" className="text-white text-decoration-underline fw-bold">MASUK</a>
                        </p>

                        <Link to="/" style={{ color: "white", textDecoration: "none"}}>
                            <a href="#" className="text-white mt-5 d-block text-decoration-none" style={{ fontSize: '1.1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                                &larr; Kembali ke halaman awal
                            </a>
                        </Link>
                    </div>
                </div>

                {/* Kolom Kanan: Form Daftar */}
                <div 
                    className="d-flex justify-content-center align-items-center p-5" 
                    style={{ 
                        flex: 1,
                        backgroundColor: '#f8f9fa',
                    }}
                >
                    <div className="mt-5"> {/* Mengubah style `marginTop: '-10vh'` menjadi kelas `mt-5` */}
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HalamanDaftar;