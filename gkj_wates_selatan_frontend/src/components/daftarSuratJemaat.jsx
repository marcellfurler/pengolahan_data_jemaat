import React, { useState } from "react";

export const DaftarSuratJemaat = () => {
  const [filter, setFilter] = useState("");
  const [suratJemaat, setSuratJemaat] = useState([
    { id: 1, nama: "Surat Baptis Anak", tahun: 2024, bulan: "Juli" },
    { id: 2, nama: "Surat Nikah", tahun: 2025, bulan: "Januari" },
    { id: 3, nama: "Surat Pertobatan", tahun: 2025, bulan: "Maret" },
  ]);

  const filteredSurat = suratJemaat.filter((surat) =>
    surat.nama.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h5 style={{ color: "#004d97" }}>📑 Daftar Surat Jemaat</h5>
        <input
          type="text"
          placeholder="Cari surat..."
          className="form-control w-25"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Nama Surat</th>
              <th>Bulan</th>
              <th>Tahun</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurat.map((surat, i) => (
              <tr key={surat.id}>
                <td>{i + 1}</td>
                <td>{surat.nama}</td>
                <td>{surat.bulan}</td>
                <td>{surat.tahun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
