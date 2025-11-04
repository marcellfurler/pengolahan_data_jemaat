// src/components/printSurat.jsx
export const printSurat = (elementId, jenisSurat = "Surat", namaPengaju = "") => {
  const element = document.getElementById(elementId);

  if (!element) {
    alert("❌ Elemen surat tidak ditemukan!");
    return;
  }

  const printContent = element.innerHTML;
  const printWindow = window.open("", "_blank");
  const fileName = `${jenisSurat.replace(/\s+/g, "-")}_${namaPengaju || "Jemaat"}`;

  printWindow.document.write(`
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          @media print {
            @page { size: A4; margin: 20mm; }
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              color: #000;
              margin: 0;
              padding: 0;
            }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: none; padding: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="page">${printContent}</div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  // Tunggu sedikit agar browser render dulu
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
