import React from "react";
import { Link } from "react-router-dom";

import logoGKJ from './assets/logoGKJ.png';
import backgroundimg2 from './assets/gkjwatesselatan2.png';
import { NavbarComponentLogin } from './components/NavbarComponent';


// Komponen Navbar


// Komponen Form Login
const LoginForm = () => {
    return (
        <div className="card shadow-sm p-4" style={{ // Padding diubah menjadi p-4
            width: '400px', // Lebar dikurangi
            backgroundColor: '#f0f0f0', // Warna background sedikit lebih gelap
            border: 'none',
            textAlign: 'center',
            borderRadius: '10px', // Sudut membulat
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Efek timbul
        }}>
            {/* Logo Gereja di atas Form */}
            <img
                src={logoGKJ}
                alt="Logo GKJ Besar"
                width="90" // Ukuran logo sedikit disesuaikan
                height="90" // Ukuran logo sedikit disesuaikan
                className="d-block mx-auto mb-4"
                style={{ objectFit: 'cover' }}
            />
            
            {/* Nama Pengguna */}
            <div className="mb-3 text-start">
                <label htmlFor="usernameInput" className="form-label">Nama Pengguna</label>
                <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    id="usernameInput" 
                    placeholder="Masukkan Nama Pengguna" 
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '10px' }} // Tinggi input sedikit disesuaikan
                />
            </div>

            {/* Kata Sandi */}
            <div className="mb-4 text-start">
                <label htmlFor="passwordInput" className="form-label">Kata Sandi</label>
                <input 
                    type="password" 
                    className="form-control form-control-lg" 
                    id="passwordInput" 
                    placeholder="Masukkan Kata Sandi" 
                    style={{ backgroundColor: '#e9ecef', border: 'none', height: '10px' }} // Tinggi input sedikit disesuaikan
                />
            </div>

            {/* Tombol Masuk */}
            <Link to="/data" style={{ color: "white", textDecoration: "none" }}>
            <button 
                type="button" // Gunakan 'button' karena ini bukan form submit
                className="btn btn-info btn-lg w-100 fw-bold shadow-sm" 
                style={{ 
                    backgroundColor: 'rgba(108, 117, 125, 0.7)', borderColor: 'rgba(108, 117, 125, 0.7)',
                    color: 'white', 
                    padding: '10px' 
                }} 
                // Hapus (e) => { e.preventDefault(); ... } agar navigasi Link berfungsi
                onClick={() => { console.log("Tombol Masuk diklik"); }} // Biarkan hanya console.log
            >
                MASUK
            </button>
            </Link>

        </div>
    );
};

// Komponen Halaman Login Utama
const HalamanLogin = () => {
    return (
        <>
            {/* Memuat Bootstrap CSS dari CDN */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
                crossOrigin="anonymous" 
            />

            <NavbarComponentLogin />
            
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

                    {/* Konten Daftar */}
                    <div className="position-relative text-center" style={{ zIndex: 2 }}>
                      <Link to="/daftar" style={{ color: "white", textDecoration: "none"}}>
                          <button 
                            className="btn btn-info btn-lg fw-bold shadow-lg mb-4"
                            style={{ 
                                backgroundColor: '#004d99', 
                                borderColor: '#004d99', 
                                color: 'white', 
                                padding: '15px 40px',
                                fontSize: '1.5rem'
                            }}
                            onClick={() => console.log("Tombol Daftar di sidebar diklik")}
                        >
                            DAFTAR
                        </button>
                      </Link>                        
                        <p className="lead mb-5" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                            Saya belum memiliki akun, saya akan <a href="/daftar" className="text-white text-decoration-underline fw-bold">DAFTAR</a>
                        </p>
                        <Link to="/" style={{ color: "white", textDecoration: "none"}}>
                          <a href="#" className="text-white mt-5 d-block text-decoration-none" style={{ fontSize: '1.1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                            &larr; Kembali ke halaman awal
                          </a>
                        </Link>    

                    </div>
                </div>

                {/* Kolom Kanan: Form Login */}
                <div 
                    className="d-flex justify-content-center align-items-center p-5" 
                    style={{ 
                        flex: 1,
                        backgroundColor: '#f8f9fa',
                        padding: '50px 0',
                    }}
                >
                    {/* Menambahkan div container untuk menggeser form ke atas */}
                    <div style={{ marginTop: '-10vh' }}>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HalamanLogin;