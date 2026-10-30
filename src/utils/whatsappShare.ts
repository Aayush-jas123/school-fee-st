import type { Student, PaymentRecord } from '../types/feeSystem';
import { INSTITUTION_CONFIG } from '../config/institutionConfig';
import { formatCurrencyINR } from './exportUtils';

// Default country code applied to bare 10-digit subscriber numbers
const DEFAULT_COUNTRY_CODE = '91';

/**
 * Normalizes a stored phone/WhatsApp number into wa.me format (country code + digits, no symbols).
 * Accepts "9876543210", "+91 98765 43210", "09876543210" and already-prefixed "919876543210".
 */
export function normalizeWhatsAppNumber(raw?: string): string | null {
  if (!raw) return null;

  let digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  // Strip trunk prefix zeros before applying the country code (e.g. 09876543210)
  digits = digits.replace(/^0+/, '');
  if (digits.length === 10) digits = `${DEFAULT_COUNTRY_CODE}${digits}`;

  return digits.length >= 11 && digits.length <= 15 ? digits : null;
}

export function getStudentWhatsAppNumber(student: Student): string | null {
  return normalizeWhatsAppNumber(student.whatsappNo || student.phone);
}

export function buildReceiptWhatsAppCaption(student: Student, payment: PaymentRecord): string {
  const period =
    payment.targetSemester ||
    student.currentSemester ||
    (student.course === 'JBT' ? 'Session 1' : 'Sem 1');

  return [
    `*${INSTITUTION_CONFIG.name.toUpperCase()}*`,
    'Official Fee Receipt',
    '',
    `Student: ${student.name} (${student.registrationNo})`,
    `Course: ${student.course} — ${period}`,
    `Receipt No: ${payment.id}`,
    `Date: ${payment.date}`,
    `Amount Paid: ${formatCurrencyINR(payment.amount)}`,
    `Payment Mode: ${payment.mode}`,
    `Remaining Balance: ${formatCurrencyINR(student.remainingFees)}`,
    '',
    'Your official PDF receipt is attached with this message.',
    `For any query, contact ${INSTITUTION_CONFIG.contact.helpline}.`,
  ].join('\n');
}

export function buildWhatsAppChatUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Opens a placeholder tab synchronously from a click handler.
 * WhatsApp navigation happens after the PDF is ready, so the tab must be
 * claimed during the user gesture or browsers will block it as a popup.
 */
export function openReceiptShareWindow(): Window | null {
  const win = window.open('', 'receipt_whatsapp_share');
  if (!win) return null;

  try {
    const doc = win.document;
    doc.title = 'Preparing receipt...';
    doc.body.style.cssText =
      'margin:0;display:flex;align-items:center;justify-content:center;height:100vh;' +
      'font-family:system-ui,sans-serif;background:#faf7f2;color:#57534e';
    const message = doc.createElement('p');
    message.style.fontSize = '14px';
    message.textContent = 'Preparing receipt PDF for WhatsApp...';
    doc.body.appendChild(message);
    doc.close();
  } catch {
    // Placeholder is cosmetic only - ignore DOM failures
  }

  return win;
}

/**
 * Navigates the pre-opened tab to the WhatsApp chat. Falls back to a fresh
 * window when the placeholder was blocked or already closed.
 */
export function openWhatsAppChat(
  number: string,
  text: string,
  preopenedWindow?: Window | null
): Window | null {
  const url = buildWhatsAppChatUrl(number, text);

  if (preopenedWindow && !preopenedWindow.closed) {
    preopenedWindow.location.href = url;
    return preopenedWindow;
  }

  return window.open(url, '_blank', 'noopener,noreferrer');
}
