import React from 'react';
import type { Student, PaymentRecord, SemesterFeeSlot } from '../types/feeSystem';
import { buildPeriodFeeSlots, getPeriodYear } from '../types/feeSystem';
import { Printer, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrencyINR } from '../utils/exportUtils';

interface PrintableReceiptProps {
  student: Student;
  payment: PaymentRecord;
  onClose: () => void;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ student, payment, onClose }) => {
  // Get semester fee slots for breakdown
  const effectiveFee = student.totalFees - (student.discountAmount || 0);
  const semesterSlots: SemesterFeeSlot[] = student.semesterFees && student.semesterFees.length > 0
    ? student.semesterFees
    : buildPeriodFeeSlots(student.course, effectiveFee, 0);

  // Get installments for the target period of this payment
  const targetSem = payment.targetSemester || student.currentSemester || (student.course === 'JBT' ? 'Session 1' : 'Sem 1');
  const targetSlot = semesterSlots.find(s => s.semester === targetSem);
  const semInstallments = targetSlot?.installments && targetSlot.installments.length > 0
    ? targetSlot.installments
    : student.paymentHistory.filter(p => p.targetSemester === targetSem);

  // Calculate balance after THIS payment for the target semester
  const semPaidAfterThis = targetSlot ? targetSlot.paidAmount : payment.amount;
  const semTotal = targetSlot ? targetSlot.totalFee : Math.round(effectiveFee / 4);
  const semRemaining = Math.max(0, semTotal - semPaidAfterThis);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-50/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-3xl w-full p-6 shadow-2xl overflow-y-auto max-h-[95vh] text-stone-900 relative">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-stone-700" />
            <h2 className="text-lg font-bold text-stone-900">Official Institutional Fee Receipt</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-700 text-stone-50 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-800/15"
            >
              <Printer className="w-4 h-4" /> Print Official Receipt
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area - White background for official printing */}
        <div className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 space-y-5 shadow-md print:shadow-none print:border-none print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-stone-900 pb-4">
            <div>
              <h1 className="text-2xl font-black text-stone-900 uppercase tracking-wide">
                SHANTI COLLEGE OF EDUCATION
              </h1>
              <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Recognized by Govt & Affiliated for JBT & B.Ed Programs
              </p>
              <p className="text-[11px] text-stone-600">Institutional Campus, Education Hub, Haryana • Contact: +91 172 2589012</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-rose-800 text-stone-50 text-xs font-extrabold rounded-lg uppercase tracking-wider block mb-1">
                FEE RECEIPT
              </span>
              <p className="text-xs font-bold font-mono text-slate-700">No: {payment.id}</p>
              <p className="text-[11px] text-stone-600">Date: {payment.date}</p>
              {payment.installmentNo && (
                <p className="text-[11px] text-stone-700 font-bold">Installment #{payment.installmentNo}</p>
              )}
            </div>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p><span className="text-stone-600">Student Name:</span> <strong>{student.name}</strong></p>
              <p><span className="text-stone-600">Father's Name:</span> <strong>{student.fatherName}</strong></p>
              <p><span className="text-stone-600">Registration No:</span> <strong className="font-mono">{student.registrationNo}</strong></p>
            </div>
            <div>
              <p><span className="text-stone-600">Course Program:</span> <strong className="text-stone-900 font-extrabold">{student.course} (2-Year)</strong></p>
              <p><span className="text-stone-600">Roll No / Session:</span> <strong>{student.rollNo || 'Pending'} ({student.session})</strong></p>
              <p><span className="text-stone-600">Category:</span> <strong>{student.category}</strong></p>
            </div>
          </div>

          {/* Current Payment Details */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 border-b border-stone-200 pb-1">Payment Transaction Details</h3>
            <table className="w-full text-xs border-collapse border border-slate-300">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-medium text-stone-600 w-1/3">Payment For</td>
                  <td className="border border-slate-300 p-2 font-bold">{targetSem} — {targetSlot?.year || getPeriodYear(targetSem as any)}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-medium text-stone-600">Description</td>
                  <td className="border border-slate-300 p-2">
                    <span className="font-bold">{payment.remark || 'Semester Fee Payment'}</span>
                    {payment.installmentNo ? ` (EMI Installment #${payment.installmentNo})` : ''}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-medium text-stone-600">Payment Mode</td>
                  <td className="border border-slate-300 p-2 font-bold">{payment.mode}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-medium text-stone-600">Transaction Reference</td>
                  <td className="border border-slate-300 p-2 font-mono font-bold">{payment.transactionRef}</td>
                </tr>
                <tr className="bg-stone-100">
                  <td className="border border-slate-300 p-2 font-medium text-stone-900 font-bold">Amount Paid Now</td>
                  <td className="border border-slate-300 p-2 font-extrabold text-stone-900 text-sm">
                    {formatCurrencyINR(payment.amount)}
                    {payment.discountApplied && payment.discountApplied > 0 ? ` (+ ${formatCurrencyINR(payment.discountApplied)} concession)` : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Semester-wise Fee Status Breakdown */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 border-b border-stone-200 pb-1">Semester-wise Fee Status (All 4 Semesters)</h3>
            <table className="w-full text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th className="border border-slate-300 p-2 text-left">Semester</th>
                  <th className="border border-slate-300 p-2 text-center">Year</th>
                  <th className="border border-slate-300 p-2 text-right">Total Fee</th>
                  <th className="border border-slate-300 p-2 text-right">Paid</th>
                  <th className="border border-slate-300 p-2 text-right">Pending</th>
                  <th className="border border-slate-300 p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {semesterSlots.map((slot) => {
                  const isTarget = slot.semester === targetSem;
                  return (
                    <tr key={slot.semester} className={isTarget ? 'bg-stone-100 font-semibold' : ''}>
                      <td className="border border-slate-300 p-2">
                        {slot.semester}
                        {isTarget ? ' ← Current' : ''}
                      </td>
                      <td className="border border-slate-300 p-2 text-center">{slot.year}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono">{slot.totalFee > 0 ? formatCurrencyINR(slot.totalFee) : 'TBD'}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-stone-700">{formatCurrencyINR(slot.paidAmount)}</td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold text-stone-700">{slot.remainingAmount > 0 ? formatCurrencyINR(slot.remainingAmount) : '—'}</td>
                      <td className="border border-slate-300 p-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          slot.status === 'Paid' ? 'bg-stone-100 text-stone-700 border border-stone-200' :
                          slot.status === 'Partly Paid' ? 'bg-stone-100 text-stone-700 border border-stone-200' :
                          'bg-stone-200 text-stone-700 border border-stone-300'
                        }`}>
                          {slot.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={2} className="border border-slate-300 p-2 text-right">Total (2-Year Program):</td>
                  <td className="border border-slate-300 p-2 text-right font-mono">{formatCurrencyINR(student.totalFees)}</td>
                  <td className="border border-slate-300 p-2 text-right font-mono text-stone-700">{formatCurrencyINR(student.paidTillNow)}</td>
                  <td className="border border-slate-300 p-2 text-right font-mono text-stone-700">{formatCurrencyINR(student.remainingFees)}</td>
                  <td className="border border-slate-300 p-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* EMI / Installment History for Target Semester */}
          {semInstallments.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 border-b border-stone-200 pb-1">
                EMI Installment History — {targetSem}
              </h3>
              <table className="w-full text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-300 p-2 text-center">EMI #</th>
                    <th className="border border-slate-300 p-2 text-left">Date</th>
                    <th className="border border-slate-300 p-2 text-left">Mode</th>
                    <th className="border border-slate-300 p-2 text-left">Reference</th>
                    <th className="border border-slate-300 p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {semInstallments.map((inst, idx) => {
                    const isCurrentPayment = inst.id === payment.id;
                    return (
                      <tr key={inst.id || idx} className={isCurrentPayment ? 'bg-stone-100 font-bold' : ''}>
                        <td className="border border-slate-300 p-2 text-center">
                          #{inst.installmentNo || idx + 1}
                          {isCurrentPayment ? ' (Latest)' : ''}
                        </td>
                        <td className="border border-slate-300 p-2">{inst.date}</td>
                        <td className="border border-slate-300 p-2 font-medium">{inst.mode}</td>
                        <td className="border border-slate-300 p-2 font-mono text-[10px]">{inst.transactionRef}</td>
                        <td className="border border-slate-300 p-2 text-right font-bold text-stone-700">{formatCurrencyINR(inst.amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Outstanding Summary Box */}
          <div className="border-2 border-stone-300 rounded-xl p-4 bg-stone-50 space-y-2">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Outstanding Fee Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-stone-600">Total 2-Year Program Fee:</p>
                <p className="text-base font-extrabold text-slate-900">{formatCurrencyINR(student.totalFees)}</p>
              </div>
              <div>
                <p className="text-stone-600">Total Paid Till Date:</p>
                <p className="text-base font-extrabold text-stone-900">{formatCurrencyINR(student.paidTillNow)}</p>
              </div>
              <div>
                <p className="text-stone-600">{targetSem} Pending Balance:</p>
                <p className="text-base font-extrabold text-stone-700">{semRemaining > 0 ? formatCurrencyINR(semRemaining) : 'CLEARED ✓'}</p>
              </div>
              <div>
                <p className="text-stone-600">Overall Pending Balance:</p>
                <p className="text-base font-extrabold text-stone-700">{student.remainingFees > 0 ? formatCurrencyINR(student.remainingFees) : 'ALL CLEARED ✓'}</p>
              </div>
            </div>
          </div>

          {/* Footer & QR Verification */}
          <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
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
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700" /> Digital Verified Receipt
                </p>
                <p className="text-[10px] text-stone-600">Issued by: {payment.staffName || 'Accounts Officer'}</p>
                <p className="text-[10px] text-stone-600">Computer Generated • No Physical Stamp Needed</p>
                <p className="text-[10px] text-stone-700 font-semibold">This receipt confirms payment of {formatCurrencyINR(payment.amount)} towards {targetSem}.</p>
              </div>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-slate-400 w-36 mb-1"></div>
              <p className="font-bold text-slate-900">Authorized Cashier / Accountant</p>
              <p className="text-stone-600 text-[10px]">Shanti College of Education</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
