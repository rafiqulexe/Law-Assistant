import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const BANGLA = /[ঀ-৿]/;

// Writes plain text into an A4 PDF with simple line wrapping and paging.
export async function downloadTextAsPdf(text, filename, title) {
  // jsPDF's built-in fonts have no Bangla letters, so Bangla is drawn by the browser instead.
  if (BANGLA.test(text) || BANGLA.test(title || '')) {
    await downloadRenderedPdf(text, filename, title);
    return;
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 50;
  const pageHeight = doc.internal.pageSize.getHeight();
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  if (title) {
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text(title, margin, y);
    y += 28;
  }

  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, width);
  for (const line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 15;
  }

  doc.save(filename);
}

// Lays the text out in a hidden A4-wide block, captures it as an image and cuts it into pages.
async function downloadRenderedPdf(text, filename, title) {
  const block = document.createElement('div');
  block.style.cssText =
    'position:fixed;left:-10000px;top:0;width:794px;padding:56px;box-sizing:border-box;' +
    'background:#fff;color:#000;font:15px/1.7 "Noto Sans Bengali","Nirmala UI","Vrinda",sans-serif;' +
    'white-space:pre-wrap;word-wrap:break-word;';
  if (title) {
    const heading = document.createElement('div');
    heading.style.cssText = 'font-size:20px;font-weight:700;margin-bottom:18px;';
    heading.textContent = title;
    block.appendChild(heading);
  }
  const body = document.createElement('div');
  body.textContent = text;
  block.appendChild(body);
  document.body.appendChild(block);

  try {
    const canvas = await html2canvas(block, { scale: 2, backgroundColor: '#ffffff' });
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    // Canvas pixels that fit on one PDF page at full page width.
    const sliceHeight = Math.floor((canvas.width * pageHeight) / pageWidth);

    for (let top = 0, page = 0; top < canvas.height; top += sliceHeight, page += 1) {
      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = Math.min(sliceHeight, canvas.height - top);
      slice.getContext('2d').drawImage(canvas, 0, -top);
      if (page > 0) doc.addPage();
      const height = (slice.height * pageWidth) / canvas.width;
      doc.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pageWidth, height);
    }
    doc.save(filename);
  } finally {
    block.remove();
  }
}
