const fs = require('fs');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('public/isea-44-report.pdf'));

doc.fontSize(25).text('ISEA-44 Preliminary Science Report', 100, 100);
doc.fontSize(14).text('Location: Goa, India', 100, 140);
doc.fontSize(14).text('Captured: 2025-05-30', 100, 160);
doc.fontSize(14).text('Expedition: ISEA-44', 100, 180);

doc.moveDown();
doc.fontSize(12).text('This is a dynamically generated placeholder document containing 84 pages for the PolaRis demo.');

for (let i = 2; i <= 84; i++) {
  doc.addPage();
  doc.fontSize(20).text(`Page ${i}`, 100, 100);
  doc.fontSize(12).text('Confidential expedition data. Content redacted for public portal demo.', 100, 150);
}

doc.end();
console.log('PDF generated successfully at public/isea-44-report.pdf');
