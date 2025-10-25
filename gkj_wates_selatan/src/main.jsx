import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HalamanUtama from './halaman_utama'
import HalamanLogin from './halaman_login'
import HalamanDaftar from './halaman_daftar'
import HalamanData from './halaman_data_utama'
import HalamanDetail from './statusDetail_pages/halaman_detail'
import HalamanEdit from './statusDetail_pages/halaman_edit'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HalamanUtama />} />
        <Route path="/login" element={<HalamanLogin />} />
        <Route path="/daftar" element={<HalamanDaftar />} />
        <Route path="/data" element={<HalamanData />} />
        <Route path="/detail" element={<HalamanDetail />} />
        <Route path="/edit" element={<HalamanEdit />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

