// components/printSertifikat.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Mengubah elemen HTML menjadi PDF dan mengunduhnya.
 * @param {string} elementId - ID elemen HTML yang ingin dicetak.
 * @param {string} fileName - Nama file PDF output.
 */
export const printSertifikat = async (elementId, fileName = "Sertifikat.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("❌ Elemen tidak ditemukan:", elementId);
    return;
  }

  try {
    // Tangkap tampilan sertifikat
    const canvas = await html2canvas(element, {
      scale: 3, // kualitas tinggi
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let position = 0;
    let remainingHeight = imgHeight;

    // Cetak semua bagian jika terlalu tinggi
    while (remainingHeight > 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
      if (remainingHeight > 0) {
        pdf.addPage();
        position = 0;
      }
    }

    // Simpan PDF
    pdf.save(fileName);
    console.log(`✅ PDF "${fileName}" berhasil diunduh!`);
  } catch (err) {
    console.error("❌ Gagal membuat PDF:", err);
  }
};
