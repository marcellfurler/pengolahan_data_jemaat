import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../components/NavbarComponent';
import dataJemaat from '../data/dataJemaat.json';

const HalamanTambahDataBaru = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    alamat: '',
    tanggalLahir: '',
    jenisKelamin: '',
    status: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingData = JSON.parse(localStorage.getItem('dataJemaat')) || dataJemaat;
    const newData = [...existingData, { id: Date.now(), ...formData }];
    localStorage.setItem('dataJemaat', JSON.stringify(newData));
    alert('Data jemaat baru berhasil ditambahkan!');
    navigate('/data');
  };

  return (
    <>
      <NavbarComponent />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/data" className="btn btn-secondary">
            <FontAwesomeIcon icon={faArrowLeft} /> Kembali
          </Link>
          <h3 className="text-center flex-grow-1">Tambah Data Jemaat Baru</h3>
          <div style={{ width: '80px' }}></div>
        </div>

        <div className="card shadow p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
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
                <label className="form-label">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  className="form-control"
                  value={formData.alamat}
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

              <div className="col-md-6 mb-3">
                <label className="form-label">Status Jemaat</label>
                <input
                  type="text"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                <FontAwesomeIcon icon={faSave} /> Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default HalamanTambahDataBaru;
