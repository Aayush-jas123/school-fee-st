import React from 'react';
import type { Student, PaymentRecord } from '../types/feeSystem';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrencyINR } from '../utils/exportUtils';

interface PrintableReceiptProps {
  student: Student;
  payment: PaymentRecord;
  onClose: () => void;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ student, payment, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl overflow-y-auto max-h-[95vh] text-slate-100 relative">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Official Institutional Fee Receipt</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <Printer className="w-4 h-4" /> Print Official Receipt
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area - White background for official printing */}
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 space-y-6 shadow-md print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-4">
            <div>
              <h1 className="text-2xl font-black text-indigo-950 uppercase tracking-wide">
                STATE COLLEGE OF EDUCATION
              </h1>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Recognized by Govt & Affiliated for JBT & B.Ed Programs
              </p>
              <p className="text-[11px] text-slate-500">Institutional Campus, Education Hub, Haryana • Contact: +91 172 2589012</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-indigo-900 text-white text-xs font-extrabold rounded-lg uppercase tracking-wider block mb-1">
                FEE RECEIPT
              </span>
              <p className="text-xs font-bold font-mono text-slate-700">No: {payment.id}</p>
              <p className="text-[11px] text-slate-500">Date: {payment.date}</p>
            </div>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p><span className="text-slate-500">Student Name:</span> <strong>{student.name}</strong></p>
              <p><span className="text-slate-500">Father's Name:</span> <strong>{student.fatherName}</strong></p>
              <p><span className="text-slate-500">Registration No:</span> <strong className="font-mono">{student.registrationNo}</strong></p>
            </div>
            <div>
              <p><span className="text-slate-500">Course Program:</span> <strong className="text-indigo-900 font-extrabold">{student.course} ({student.semester})</strong></p>
              <p><span className="text-slate-500">Roll No / Session:</span> <strong>{student.rollNo} ({student.session})</strong></p>
              <p><span className="text-slate-500">Category:</span> <strong>{student.category}</strong></p>
            </div>
          </div>

          {/* Itemized Payment Table */}
          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold">
                <th className="border border-slate-300 p-2 text-left">Particulars / Payment Breakdown</th>
                <th className="border border-slate-300 p-2 text-center">Payment Mode</th>
                <th className="border border-slate-300 p-2 text-right">Amount Paid (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2.5">
                  <p className="font-bold text-slate-900">{payment.remark || 'Tuition Fee Installment'}</p>
                  <p className="text-[10px] text-slate-500">Ref: {payment.transactionRef}</p>
                </td>
                <td className="border border-slate-300 p-2 text-center font-bold">{payment.mode}</td>
                <td className="border border-slate-300 p-2 text-right font-bold text-sm text-emerald-800">
                  {formatCurrencyINR(payment.amount)}
                </td>
              </tr>
              {payment.discountApplied && payment.discountApplied > 0 ? (
                <tr>
                  <td className="border border-slate-300 p-2 text-indigo-900 font-medium">Concession / Scholarship Discount Applied</td>
                  <td className="border border-slate-300 p-2 text-center">-</td>
                  <td className="border border-slate-300 p-2 text-right text-indigo-900 font-bold">
                    {formatCurrencyINR(payment.discountApplied)}
                  </td>
                </tr>
              ) : null}
              <tr className="bg-slate-50">
                <td colSpan={2} className="border border-slate-300 p-2 text-right font-bold text-slate-700">Total Program Fee:</td>
                <td className="border border-slate-300 p-2 text-right font-bold">{formatCurrencyINR(student.totalFees)}</td>
              </tr>
              <tr className="bg-emerald-50 text-emerald-950 font-extrabold text-sm">
                <td colSpan={2} className="border border-slate-300 p-2 text-right">Total Fee Paid Till Date:</td>
                <td className="border border-slate-300 p-2 text-right">{formatCurrencyINR(student.paidTillNow)}</td>
              </tr>
              <tr className="bg-amber-50 text-amber-950 font-bold text-xs">
                <td colSpan={2} className="border border-slate-300 p-2 text-right">Balance Outstanding Dues:</td>
                <td className="border border-slate-300 p-2 text-right">{formatCurrencyINR(student.remainingFees)}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer & QR Verification */}
          <div className="flex justify-between items-end pt-6 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-3">
              {/* QR Badge */}
              <div className="w-16 h-16 border border-slate-300 p-1 rounded-lg bg-white">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="30" height="30" fill="black" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="black" />
                  <rect x="65" y="5" width="30" height="30" fill="black" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="75" y="15" width="10" height="10" fill="black" />
                  <rect x="5" y="65" width="30" height="30" fill="black" />
                  <rect x="40" y="40" width="20" height="20" fill="black" />
                  <rect x="65" y="65" width="30" height="30" fill="black" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Digital Verified Receipt
                </p>
                <p className="text-[10px] text-slate-500">Issued by: {payment.staffName || 'Accounts Officer'}</p>
                <p className="text-[10px] text-slate-500">Computer Generated • No Physical Stamp Needed</p>
              </div>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-slate-400 w-36 mb-1"></div>
              <p className="font-bold text-slate-900">Authorized Cashier / Accountant</p>
              <p className="text-slate-500 text-[10px]">State College of Education</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
