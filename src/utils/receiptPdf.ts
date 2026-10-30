import type { jsPDF } from 'jspdf';
import type { Student, PaymentRecord } from '../types/feeSystem';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/**
 * Rasterizes the receipt sheet and paginates it into an A4 PDF.
 * Long statements (EMI history, semester tables) are sliced across pages
 * instead of being cropped like a plain toDataURL snapshot would.
 */
export async function renderReceiptToPdf(element: HTMLElement): Promise<jsPDF> {
  // Loaded on demand - the PDF stack is heavy and only needed for sharing/printing
  const [{ jsPDF: JsPdfCtor }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas-pro'),
  ]);

  // The receipt sits inside a scrollable modal, so ancestors would clip the raster.
  // Render a detached copy instead; Tailwind classes carry the full styling.
  const host = document.createElement('div');
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${element.offsetWidth}px;background:#ffffff;z-index:-1;`;
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.boxShadow = 'none';
  host.appendChild(clone);
  document.body.appendChild(host);

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
  } finally {
    host.remove();
  }

  const doc = new JsPdfCtor({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageHeightPx = Math.floor((canvas.width * A4_HEIGHT_MM) / A4_WIDTH_MM);
  let renderedPx = 0;
  let pageIndex = 0;

  while (renderedPx < canvas.height) {
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedPx);
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;

    const ctx = pageCanvas.getContext('2d');
    if (!ctx) break;

    // Paint white so transparent Tailwind backgrounds do not turn grey in the PDF
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(canvas, 0, renderedPx, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

    if (pageIndex > 0) doc.addPage();
    doc.addImage(
      pageCanvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      0,
      0,
      A4_WIDTH_MM,
      (sliceHeightPx * A4_WIDTH_MM) / canvas.width
    );

    renderedPx += sliceHeightPx;
    pageIndex += 1;
  }

  return doc;
}

export function receiptPdfFilename(student: Student, payment: PaymentRecord): string {
  const safe = (value: string) => value.replace(/[^a-zA-Z0-9_-]+/g, '_');
  return `Receipt_${safe(payment.id)}_${safe(student.registrationNo)}.pdf`;
}

export function downloadPdf(doc: jsPDF, filename: string): void {
  const url = URL.createObjectURL(doc.output('blob'));
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
