import React, { useState } from 'react';
import type { Student, PaymentRecord, SemesterFeeSlot } from '../types/feeSystem';
import {
  X,
  Receipt,
  FileText,
  CreditCard,
  Calendar,
  Hash,
  User,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
} from 'lucide-react';

interface StudentReceiptModalProps {
  student: Student;
  onClose: () => void;
  onGenerateReceipt: (student: Student, payment: PaymentRecord) => void;
}

export const StudentReceiptModal: React.FC<StudentReceiptModalProps> = ({
  student,
  onClose,
  onGenerateReceipt,
}) => {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'payments' | 'semester' | 'statement'>('payments');

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  // Build semester fee slots
  const semesterSlots: SemesterFeeSlot[] =
    student.semesterFees && student.semesterFees.length > 0
      ? student.semesterFees
      : [
          { semester: 'Sem 1', year: '1st Year', totalFee: Math.round(student.totalFees / 4), paidAmount: 0, remainingAmount: Math.round(student.totalFees / 4), status: 'Unpaid' as const, dueDate: '2026-10-15' },
          { semester: 'Sem 2', year: '1st Year', totalFee: Math.round(student.totalFees / 4), paidAmount: 0, remainingAmount: Math.round(student.totalFees / 4), status: 'Unpaid' as const, dueDate: '2027-03-15' },
          { semester: 'Sem 3', year: '2nd Year', totalFee: Math.round(student.totalFees / 4), paidAmount: 0, remainingAmount: Math.round(student.totalFees / 4), status: 'Unpaid' as const, dueDate: '2027-10-15' },
          { semester: 'Sem 4', year: '2nd Year', totalFee: Math.round(student.totalFees / 4), paidAmount: 0, remainingAmount: Math.round(student.totalFees / 4), status: 'Unpaid' as const, dueDate: '2028-03-15' },
        ];

  // Generate a synthetic "full statement" payment record
  const generateFullStatement = (): PaymentRecord => {
    const totalPaid = student.paidTillNow;
    return {
      id: `STMT-${student.registrationNo}-${new Date().getFullYear()}`,
      amount: totalPaid,
      date: new Date().toISOString().split('T')[0],
      mode: 'Cash',
      transactionRef: `FULL-STATEMENT-${Date.now()}`,
      remark: 'Complete Fee Statement — All Payments Consolidated',
      targetSemester: student.currentSemester || 'Sem 1',
      staffName: 'Accounts Office',
    };
  };

  // Handle generating receipt for selected payment
  const handleGenerateSelected = () => {
    if (!selectedPaymentId) return;
    const payment = student.paymentHistory.find((p) => p.id === selectedPaymentId);
    if (payment) {
      onGenerateReceipt(student, payment);
    }
  };

  // Handle generating full fee statement
  const handleGenerateStatement = () => {
    const statement = generateFullStatement();
    onGenerateReceipt(student, statement);
  };

  const selectedPayment = student.paymentHistory.find((p) => p.id === selectedPaymentId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-3xl w-full max-w-4xl shadow-2xl text-zinc-100 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-slate-950 to-indigo-950/40 border-b border-zinc-800/50 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                Receipt Generation Center
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Generate official fee receipts for{' '}
                <span className="text-violet-300 font-bold">{student.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Quick Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-zinc-950/50 border-b border-zinc-800/50 p-4 gap-3 text-xs">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Student Name</span>
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-violet-400" />
              {student.name}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Registration No</span>
            <span className="text-sm font-bold font-mono text-violet-300">{student.registrationNo}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Course / Semester</span>
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              {student.course} — {student.currentSemester || 'Sem 1'}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Total Paid / Remaining</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-400">{formatINR(student.paidTillNow)}</span>
              <span className="text-[10px] text-zinc-600">/</span>
              <span className="text-sm font-bold text-amber-400">{formatINR(student.remainingFees)}</span>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-zinc-800/50 bg-zinc-950/60/30 px-6 gap-6 text-xs font-semibold text-zinc-500">
          <button
            onClick={() => setActiveSection('payments')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'payments' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Payment-wise Receipt ({student.paymentHistory.length})
          </button>
          <button
            onClick={() => setActiveSection('semester')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'semester' ? 'border-violet-500/30 text-violet-400 font-bold' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Semester-wise Receipt
          </button>
          <button
            onClick={() => setActiveSection('statement')}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'statement' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Full Fee Statement
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[55vh] overflow-y-auto space-y-4">
          {/* SECTION 1: Payment-wise Receipt Selection */}
          {activeSection === 'payments' && (
            <div className="space-y-4">
              {student.paymentHistory.length === 0 ? (
                <div className="text-center py-10 text-zinc-600 space-y-3">
                  <AlertCircle className="w-10 h-10 text-zinc-700 mx-auto" />
                  <p className="text-sm font-semibold text-zinc-500">No payment records found</p>
                  <p className="text-xs text-zinc-600">Receipts will be available once payments are recorded for this student.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-zinc-500">
                    Select a specific payment transaction to generate its official receipt:
                  </p>

                  {/* Selection List */}
                  <div className="space-y-2.5">
                    {[...student.paymentHistory].reverse().map((rec) => {
                      const isSelected = selectedPaymentId === rec.id;
                      return (
                        <div
                          key={rec.id}
                          onClick={() => setSelectedPaymentId(rec.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30'
                              : 'bg-zinc-950/50 border-zinc-800/50 hover:border-zinc-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800/60 text-zinc-500'
                              }`}>
                                {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-bold text-violet-300 text-xs">{rec.id}</span>
                                  {rec.targetSemester && (
                                    <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold border border-violet-500/20 text-[10px]">
                                      {rec.targetSemester}
                                    </span>
                                  )}
                                  {rec.installmentNo && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[10px]">
                                      EMI #{rec.installmentNo}
                                    </span>
                                  )}
                                  <span className="px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-300 font-semibold text-[10px]">
                                    {rec.mode}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                                  {rec.remark} • Ref: {rec.transactionRef}
                                </p>
                                <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                                  {rec.date} • Staff: {rec.staffName || 'Admin'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-extrabold text-emerald-400 block">
                                {formatINR(rec.amount)}
                              </span>
                              {rec.discountApplied && rec.discountApplied > 0 && (
                                <span className="text-[10px] text-amber-400 font-semibold">
                                  +{formatINR(rec.discountApplied)} concession
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Generate Button */}
                  {selectedPaymentId && selectedPayment && (
                    <div className="sticky bottom-0 bg-zinc-900/50/95 backdrop-blur-sm border-t border-zinc-800/50 -mx-6 px-6 py-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-zinc-500">
                          Selected: <span className="font-bold text-emerald-400">{formatINR(selectedPayment.amount)}</span>
                          {' '}for <span className="font-bold text-violet-300">{selectedPayment.targetSemester || 'Fee'}</span>
                          {' '}on <span className="font-mono">{selectedPayment.date}</span>
                        </div>
                        <button
                          onClick={handleGenerateSelected}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                          Generate Receipt
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* SECTION 2: Semester-wise Receipt */}
          {activeSection === 'semester' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">
                Generate a semester-wise receipt showing all payments for a specific semester:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {semesterSlots.map((slot) => {
                  const semPayments = student.paymentHistory.filter(
                    (p) => p.targetSemester === slot.semester
                  );
                  const isPaid = slot.status === 'Paid';
                  const isPartly = slot.status === 'Partly Paid';

                  return (
                    <div
                      key={slot.semester}
                      className={`p-4 rounded-2xl border space-y-3 ${
                        isPaid
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : isPartly
                          ? 'bg-amber-950/20 border-amber-800/40'
                          : 'bg-zinc-950/50 border-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">{slot.semester}</span>
                          <span className="text-[10px] text-zinc-500 font-medium">({slot.year})</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isPartly
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Semester Fee:</span>
                          <span className="font-bold text-white">{slot.totalFee > 0 ? formatINR(slot.totalFee) : 'TBD'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Paid:</span>
                          <span className="font-bold text-emerald-400">{formatINR(slot.paidAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Pending:</span>
                          <span className="font-bold text-amber-400">
                            {slot.remainingAmount > 0 ? formatINR(slot.remainingAmount) : 'CLEARED'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-600">
                          <span>Payments: {semPayments.length}</span>
                          <span>Due: {slot.dueDate}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-zinc-900/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isPaid ? 'bg-emerald-500' : isPartly ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                          style={{
                            width: `${slot.totalFee > 0 ? Math.min(100, (slot.paidAmount / slot.totalFee) * 100) : 0}%`,
                          }}
                        />
                      </div>

                      {/* Generate Semester Receipt Button */}
                      {semPayments.length > 0 && (
                        <button
                          onClick={() => {
                            // Create a synthetic payment representing the semester summary
                            const semReceipt: PaymentRecord = {
                              id: `SEM-${slot.semester.replace(' ', '')}-${student.registrationNo}`,
                              amount: slot.paidAmount,
                              date: semPayments[semPayments.length - 1]?.date || new Date().toISOString().split('T')[0],
                              mode: semPayments[0]?.mode || 'Cash',
                              transactionRef: `SEM-RECEIPT-${slot.semester.replace(' ', '')}-${Date.now()}`,
                              remark: `${slot.semester} (${slot.year}) — Consolidated Semester Fee Receipt`,
                              targetSemester: slot.semester,
                              staffName: 'Accounts Office',
                            };
                            onGenerateReceipt(student, semReceipt);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Generate Semester Receipt
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: Full Fee Statement */}
          {activeSection === 'statement' && (
            <div className="space-y-5">
              <p className="text-xs text-zinc-500">
                Generate a comprehensive fee statement covering the entire 2-year program with all payment details:
              </p>

              {/* Statement Preview Card */}
              <div className="bg-zinc-950/70 p-5 rounded-2xl border border-zinc-800/50 space-y-4">
                <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-3">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-white text-sm">Complete Fee Statement Preview</h4>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Total Program Fee</span>
                    <span className="text-base font-extrabold text-white block mt-1">{formatINR(student.totalFees)}</span>
                  </div>
                  <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/30">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Total Collected</span>
                    <span className="text-base font-extrabold text-emerald-400 block mt-1">{formatINR(student.paidTillNow)}</span>
                  </div>
                  <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-800/30">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Outstanding</span>
                    <span className="text-base font-extrabold text-amber-400 block mt-1">{formatINR(student.remainingFees)}</span>
                  </div>
                  <div className="bg-violet-950/20 p-3 rounded-xl border border-indigo-800/30">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Total Transactions</span>
                    <span className="text-base font-extrabold text-violet-400 block mt-1">{student.paymentHistory.length}</span>
                  </div>
                </div>

                {/* Semester Summary Table */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800/50">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-900/50 text-zinc-500 font-bold border-b border-zinc-800/50">
                      <tr>
                        <th className="p-2.5">Semester</th>
                        <th className="p-2.5 text-center">Year</th>
                        <th className="p-2.5 text-right">Total Fee</th>
                        <th className="p-2.5 text-right">Paid</th>
                        <th className="p-2.5 text-right">Pending</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40 text-zinc-300">
                      {semesterSlots.map((slot) => (
                        <tr key={slot.semester} className="hover:bg-zinc-800/60/40">
                          <td className="p-2.5 font-bold text-white">{slot.semester}</td>
                          <td className="p-2.5 text-center">{slot.year}</td>
                          <td className="p-2.5 text-right font-mono">{slot.totalFee > 0 ? formatINR(slot.totalFee) : 'TBD'}</td>
                          <td className="p-2.5 text-right font-mono text-emerald-400">{formatINR(slot.paidAmount)}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-amber-400">
                            {slot.remainingAmount > 0 ? formatINR(slot.remainingAmount) : '—'}
                          </td>
                          <td className="p-2.5 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                slot.status === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : slot.status === 'Partly Paid'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {slot.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-zinc-900/50 font-bold border-t border-zinc-700/50 text-white">
                      <tr>
                        <td colSpan={2} className="p-2.5 text-right">Program Total:</td>
                        <td className="p-2.5 text-right font-mono">{formatINR(student.totalFees)}</td>
                        <td className="p-2.5 text-right font-mono text-emerald-400">{formatINR(student.paidTillNow)}</td>
                        <td className="p-2.5 text-right font-mono text-amber-400">{formatINR(student.remainingFees)}</td>
                        <td className="p-2.5"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Fee Breakdown */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800/50">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-900/50 text-zinc-500 font-bold border-b border-zinc-800/50">
                      <tr>
                        <th className="p-2.5">Fee Component</th>
                        <th className="p-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40 text-zinc-300">
                      <tr><td className="p-2.5">Tuition & Academic Training</td><td className="p-2.5 text-right font-bold text-white">{formatINR(student.feeBreakdown.tuitionFee)}</td></tr>
                      <tr><td className="p-2.5">Admission & Registration</td><td className="p-2.5 text-right font-bold text-white">{formatINR(student.feeBreakdown.admissionFee)}</td></tr>
                      <tr><td className="p-2.5">University Examination</td><td className="p-2.5 text-right font-bold text-white">{formatINR(student.feeBreakdown.examFee)}</td></tr>
                      <tr><td className="p-2.5">Library & Digital Resources</td><td className="p-2.5 text-right font-bold text-white">{formatINR(student.feeBreakdown.libraryFee)}</td></tr>
                      <tr><td className="p-2.5">Campus Development Fund</td><td className="p-2.5 text-right font-bold text-white">{formatINR(student.feeBreakdown.developmentFee)}</td></tr>
                      <tr><td className="p-2.5">Practical Lab & Skill Training</td><td className="p-2.5 text-right font-bold text-white">{formatINR(student.feeBreakdown.labFee)}</td></tr>
                    </tbody>
                    <tfoot className="bg-zinc-900/50 font-bold border-t border-zinc-700/50 text-white">
                      <tr>
                        <td className="p-2.5">Total 2-Year Fee</td>
                        <td className="p-2.5 text-right text-sm text-violet-400">{formatINR(student.totalFees)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Generate Full Statement Button */}
              <button
                onClick={handleGenerateStatement}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-600/30 transition-all"
              >
                <Download className="w-4 h-4" />
                Generate Complete Fee Statement Receipt
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 bg-zinc-950/60 border-t border-zinc-800/50 flex items-center justify-between text-xs">
          <p className="text-zinc-600">
            {student.paymentHistory.length} payment{student.paymentHistory.length !== 1 ? 's' : ''} recorded •{' '}
            {formatINR(student.paidTillNow)} total collected
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
