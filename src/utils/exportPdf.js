const PDFDocument = require('pdfkit');
const fs = require('fs');

const exportPdf = async (data, filePath) => {
    try {
        const doc = new PDFDocument();

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Tambahkan konten ke PDF
        doc.fontSize(16).text('Data Penerima Bantuan', { align: 'center' });
        doc.moveDown();

        data.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.name} (${item.email})`);
        });

        // Akhiri dokumen
        doc.end();

        stream.on('finish', () => {
            console.log(`PDF file has been written to ${filePath}`);
        });
    } catch (error) {
        console.error('Error exporting PDF:', error);
    }
};

export default exportPdf;

