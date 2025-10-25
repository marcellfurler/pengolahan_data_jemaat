// src/utils/functions.jsx

// Fungsi untuk memvalidasi format email
export const isValidEmail = (email) => {
    // Regex sederhana untuk validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Fungsi untuk memformat tanggal
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Fungsi untuk mencari lagu berdasarkan judul atau lirik (contoh sederhana)
export const searchSongs = (songs, query) => {
    if (!query) {
        return songs;
    }
    const lowerCaseQuery = query.toLowerCase();
    return songs.filter(song =>
        song.title.toLowerCase().includes(lowerCaseQuery) ||
        song.lyrics.toLowerCase().includes(lowerCaseQuery)
    );
};