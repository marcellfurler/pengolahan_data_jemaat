let daftarBaptis = []; // Data sementara (nanti bisa diganti dengan database)

export const getAllBaptis = (req, res) => {
  res.json(daftarBaptis);
};

export const createBaptis = (req, res) => {
  const { namaLengkap, tanggalLahir, tempatLahir, namaOrangTua } = req.body;

  if (!namaLengkap || !tanggalLahir || !tempatLahir || !namaOrangTua) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  const newBaptis = {
    id: daftarBaptis.length + 1,
    namaLengkap,
    tanggalLahir,
    tempatLahir,
    namaOrangTua,
    tanggalDaftar: new Date().toISOString(),
  };

  daftarBaptis.push(newBaptis);
  res.status(201).json({ message: "Surat baptis berhasil ditambahkan", data: newBaptis });
};
