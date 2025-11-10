import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from './components/NavbarComponent';
import logoGKJ from './assets/logoGKJ.png';

const TabelDataJemaat = () => {
  const [dataJemaat, setDataJemaat] = useState([]); // 🔹 ubah: pakai state
  const [loading, setLoading] = useState(true);

  // 🔹 ambil data dari backend
  useEffect(() => {
    fetch("http://localhost:5000/api/jemaat")
      .then((res) => res.json())
      .then((data) => {
        setDataJemaat(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Gagal mengambil data jemaat:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-5">⏳ Memuat data jemaat...</p>;
  }

  return (
    <div className="container-fluid mt-5 mb-5 px-4">
      <div className="card border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-sm table-hover mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>No</th>
                  <th>Nama Jemaat</th>
                  <th>Tempat, Tanggal Lahir</th>
                  <th>Pepanthan</th>
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
                    <td>{index + 1}</td>
                    <td>{data.nama}</td>
                    <td>
                      {data.tempatLahir}, {new Date(data.tanggalLahir).toLocaleDateString("id-ID")}
                    </td>

                    <td>{data.namaPepanthan || '-'}</td>

                    <td>
                      {data.statusSidi === 'Sidi' ? (
                        <Link 
                          to="/sertifikat-sidi" 
                          state={{ nik: data.NIK, nama: data.nama }} // ✅ kirim 'nik' kecil
                          className="text-primary"
                          onClick={() => console.log("🔗 Mengirim NIK (Sidi):", data.NIK)}
                        >
                          {data.statusSidi}
                        </Link>
                      ) : (
                        <span>{data.statusSidi || 'Belum Sidi'}</span>
                      )}
                    </td>


                    <td>
                      {data.statusBaptis === 'Baptis' ? (
                        <Link 
                          to="/sertifikat-baptis"
                          state={{ nik: data.NIK, nama: data.nama }} 
                          className="text-primary"
                          onClick={() => console.log("🔗 Mengirim NIK:", data.NIK)}
                        >
                          {data.statusBaptis}
                        </Link>
                      ) : (
                        <span>{data.statusBaptis || 'Belum Baptis'}</span>
                      )}
                    </td>

                    <td>
                      {data.statusNikah === 'Menikah' ? (
                      <Link 
                        to="/sertifikat-nikah" 
                        state={{ nik: data.NIK, nama: data.nama }} 
                        className="text-primary"
                        onClick={() => console.log("🔗 Mengirim NIK:", data.NIK)}
                      >
                        {data.statusNikah}
                      </Link>



                      ) : (
                        <span>{data.statusNikah || 'Belum Menikah'}</span>
                      )}
                    </td>


                    <td>{data.namaPelayanan || '-'}</td>

                    <td>
                      <Link
                        to="/detail"
                        state={{ data }}
                        className="text-primary"
                        title="Lihat Detail"
                      >
                        detail
                      </Link>
                    </td>

                    <td>
                      <Link 
                        to="/edit" 
                        state={{ data }} // ✅ kirim seluruh data jemaat ke halaman edit
                        className="text-primary"
                        title="Edit Data"
                      >
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
};

const HalamanData = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <NavbarComponent />
      <TabelDataJemaat />
    </div>
  );
};

export default HalamanData;