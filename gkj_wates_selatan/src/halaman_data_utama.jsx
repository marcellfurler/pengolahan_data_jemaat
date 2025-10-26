import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";


// Impor logo
import logoGKJ from './assets/logoGKJ.png';

// Impor data jemaat dari file JSON
import dataJemaat from './data/dataJemaat.json';
import { NavbarComponent } from './components/NavbarComponent';
 // 🔹 import navbar

// --- Komponen Navbar ---


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
                  <td>{data.tempatLahir}, {data.tanggalLahir} </td>
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
