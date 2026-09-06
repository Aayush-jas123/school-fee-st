import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Student, PaymentRecord } from '../types/feeSystem';
import {
  X,
  User,
  Printer,
  Clock,
  Edit,
  Building,
  MessageSquare,
  DollarSign,
  Receipt,
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onViewReceipt?: (student: Student, payment: PaymentRecord) => void;
  onCollectPayment?: (student: Student) => void;
  onOpenReceiptCenter?: (student: Student) => void;
  isReadOnly?: boolean;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose, onEdit, onViewReceipt, onCollectPayment, onOpenReceiptCenter, isReadOnly = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'semesters' | 'breakdown' | 'history'>('overview');

  if (!student) return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleOpenReceiptCenter = () => {
    if (onOpenReceiptCenter && student) {
      onClose();
      onOpenReceiptCenter(student);
    }
  };

  const handleCollectFee = () => {
    if (onCollectPayment && student) {
      onClose();
      onCollectPayment(student);
    }
  };

  const cleanWhatsapp = (student.whatsappNo || student.phone || '').replace(/\D/g, '');
  const waLink = cleanWhatsapp ? `https://wa.me/91${cleanWhatsapp.slice(-10)}` : null;

  return (
    <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white border border-neutral-200 rounded-3xl w-full max-w-3xl shadow-2xl shadow-neutral-900/10 text-neutral-900 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-neutral-50/60 border-b border-neutral-200 flex items-start justify-between relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-xl font-bold shadow-lg shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-neutral-900">{student.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    student.course === 'JBT'
                      ? 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                  }`}
                >
                  {student.course} Program
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-500/20 text-neutral-700 border border-neutral-200">
                  {student.currentSemester || 'Sem 1'}
                </span>
                {student.stream && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {student.stream}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                Reg No: <strong className="text-neutral-700">{student.registrationNo}</strong> | Roll No: <strong className="text-neutral-700">{student.rollNo || 'Pending'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-zinc-700/60 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-neutral-50/50 border-b border-neutral-200 p-4 gap-3 text-xs">
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Total 2-Yr Fee</span>
            <span className="text-base font-bold text-neutral-900">{student.totalFees > 0 ? formatINR(student.totalFees) : 'NIL (TBD)'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Total Paid</span>
            <span className="text-base font-bold text-neutral-700">{formatINR(student.paidTillNow)}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Remaining Fees</span>
            <span className="text-base font-bold text-neutral-700">{student.totalFees > 0 ? formatINR(student.remainingFees) : 'TBD'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Active Semester</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-bold bg-violet-500/20 text-neutral-700 border border-neutral-200">
              {student.currentSemester || 'Sem 1'} ({student.feeStatus})
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-neutral-200 bg-neutral-50/60/30 px-6 gap-6 text-xs font-semibold text-neutral-500">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'border-neutral-200 text-neutral-700 font-bold' : 'border-transparent hover:text-neutral-800'
            }`}
          >
            Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('semesters')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'semesters' ? 'border-neutral-200 text-neutral-700 font-bold' : 'border-transparent hover:text-neutral-800'
            }`}
          >
            4-Semester Fee Ledger
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'breakdown' ? 'border-neutral-200 text-neutral-700 font-bold' : 'border-transparent hover:text-neutral-800'
            }`}
          >
            Annual Headwise Breakdown
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'history' ? 'border-neutral-200 text-neutral-700 font-bold' : 'border-transparent hover:text-neutral-800'
            }`}
          >
            Payment Logs ({student.paymentHistory.length})
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Personal Information */}
                <div className="bg-neutral-50/50 p-4 rounded-2xl border border-neutral-200 space-y-3">
                  <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                    <User className="w-3.5 h-3.5 text-neutral-700" /> Student Profile Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Full Name:</span>
                      <span className="font-bold text-neutral-900">{student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Father / Guardian:</span>
                      <span className="font-medium text-neutral-800">{student.fatherName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Category:</span>
                      <span className="font-semibold text-neutral-800">{student.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Phone Number:</span>
                      <span className="font-mono text-neutral-800">{student.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500">WhatsApp No.:</span>
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-neutral-700 font-mono hover:underline font-bold"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {student.whatsappNo || student.phone}
                        </a>
                      ) : (
                        <span className="font-mono text-neutral-500">{student.whatsappNo || student.phone || 'N/A'}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Email Address:</span>
                      <span className="font-mono text-neutral-700">{student.email}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200">
                      <span className="text-neutral-500 block mb-0.5">Permanent Address:</span>
                      <span className="text-neutral-700">{student.address}</span>
                    </div>
                  </div>
                </div>

                {/* Academic & Fee Schedule */}
                <div className="bg-neutral-50/50 p-4 rounded-2xl border border-neutral-200 space-y-3">
                  <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                    <Building className="w-3.5 h-3.5 text-neutral-700" /> Academic Schedule
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Course Program:</span>
                      <span className="font-bold text-neutral-900">{student.course} (2-Year Degree)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Stream:</span>
                      <span className="font-bold text-neutral-700">{student.stream || 'Arts'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Current Semester:</span>
                      <span className="font-semibold text-neutral-700">{student.currentSemester || 'Sem 1'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Class Roll Number:</span>
                      <span className="font-mono text-neutral-800 font-bold">{student.rollNo || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Academic Session:</span>
                      <span className="font-semibold text-neutral-800">{student.session}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Next Payment Due Date:</span>
                      <span className="font-mono font-bold text-neutral-700">{student.nextDueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 4-SEMESTER FEE LEDGER */}
          {activeTab === 'semesters' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-neutral-500">
                  Detailed 4-Semester Fee Window Ledger (2-Year B.Ed Degree Session 2026-2028):
                </p>
                <span className="text-neutral-700 font-bold">
                  {student.totalFees > 0 ? `Sem Fee: ${formatINR(Math.round((student.totalFees - (student.discountAmount || 0)) / 4))} / Sem` : 'Sem Fee: NIL (TBD)'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(student.semesterFees || [
                  { semester: 'Sem 1', year: '1st Year', totalFee: 0, paidAmount: 0, remainingAmount: 0, status: 'Unpaid', dueDate: '2026-10-15' },
                  { semester: 'Sem 2', year: '1st Year', totalFee: 0, paidAmount: 0, remainingAmount: 0, status: 'Unpaid', dueDate: '2027-03-15' },
                  { semester: 'Sem 3', year: '2nd Year', totalFee: 0, paidAmount: 0, remainingAmount: 0, status: 'Unpaid', dueDate: '2027-10-15' },
                  { semester: 'Sem 4', year: '2nd Year', totalFee: 0, paidAmount: 0, remainingAmount: 0, status: 'Unpaid', dueDate: '2028-03-15' },
                ]).map((slot) => {
                  const isCurrent = student.currentSemester === slot.semester;
                  const isPaid = slot.status === 'Paid';
                  const isPartly = slot.status === 'Partly Paid';
                  const is1stYear = slot.year === '1st Year';

                  // Itemized installment records for this specific semester slot
                  const semInstallments = slot.installments && slot.installments.length > 0
                    ? slot.installments
                    : student.paymentHistory.filter(p => p.targetSemester === slot.semester);

                  return (
                    <div
                      key={slot.semester}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-neutral-50 border-neutral-200/60 ring-1 ring-neutral-200'
                          : 'bg-neutral-50/50 border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-neutral-900">{slot.semester}</span>
                          <span className="text-[10px] text-neutral-500 font-medium">({is1stYear ? '1st Year' : '2nd Year'})</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-neutral-700 text-[9px] font-bold border border-neutral-200">
                              Active
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                              : isPartly
                              ? 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                              : 'bg-rose-500/20 text-neutral-700 border border-rose-500/30'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Prescribed Fee:</span>
                          <span className="font-bold text-neutral-900">{slot.totalFee > 0 ? formatINR(slot.totalFee) : 'NIL (TBD)'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Paid Amount:</span>
                          <span className="font-bold text-neutral-700">{formatINR(slot.paidAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Semester Due:</span>
                          <span className={`font-bold ${slot.remainingAmount === 0 ? 'text-neutral-700' : 'text-neutral-700'}`}>
                            {slot.totalFee > 0 ? formatINR(slot.remainingAmount) : 'TBD'}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isPaid ? "bg-neutral-900" : isPartly ? "bg-neutral-400" : "bg-neutral-300"
                            }`}
                            style={{ width: `${slot.totalFee > 0 ? Math.min(100, (slot.paidAmount / slot.totalFee) * 100) : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Installment Logs under Semester Card */}
                      {semInstallments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-200 space-y-2 text-[11px]">
                          <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider block">
                            Installment Logs ({semInstallments.length}):
                          </span>
                          <div className="space-y-1.5">
                            {semInstallments.map((inst, idx) => (
                              <div
                                key={inst.id || idx}
                                className="bg-white p-2 rounded-xl border border-neutral-200 flex items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-neutral-700">
                                      Installment #{inst.installmentNo || idx + 1}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-500 font-mono">
                                      {inst.mode}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-neutral-600 font-mono">{inst.date} • {inst.id}</span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className="font-extrabold text-neutral-700">{formatINR(inst.amount)}</span>
                                  {onViewReceipt && (
                                    <button
                                      onClick={() => onViewReceipt(student, inst)}
                                      className="p-1 rounded bg-violet-600/30 hover:bg-violet-600 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
                                      title="Print Receipt"
                                    >
                                      <Printer className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: FEE STRUCTURE BREAKDOWN */}
          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-500">
                Itemized breakdown of annual fees charged for the {student.course} program:
              </p>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50/50">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white text-neutral-500 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="p-3">Fee Component</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-neutral-700">
                    <tr>
                      <td className="p-3 font-medium">Tuition & Academic Training Fee</td>
                      <td className="p-3 text-right font-bold text-neutral-900">{formatINR(student.feeBreakdown.tuitionFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Admission & Registration Charges</td>
                      <td className="p-3 text-right font-bold text-neutral-900">{formatINR(student.feeBreakdown.admissionFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">University Examination Fee</td>
                      <td className="p-3 text-right font-bold text-neutral-900">{formatINR(student.feeBreakdown.examFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Library & Digital Learning Resources</td>
                      <td className="p-3 text-right font-bold text-neutral-900">{formatINR(student.feeBreakdown.libraryFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Campus Development & Sports Fund</td>
                      <td className="p-3 text-right font-bold text-neutral-900">{formatINR(student.feeBreakdown.developmentFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Practical Laboratory & Skill Training</td>
                      <td className="p-3 text-right font-bold text-neutral-900">{formatINR(student.feeBreakdown.labFee)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-white text-neutral-900 font-bold border-t border-neutral-200">
                    <tr>
                      <td className="p-3">Total Course 2-Year Fee</td>
                      <td className="p-3 text-right text-sm text-neutral-700">{formatINR(student.totalFees)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {student.paymentHistory.length === 0 ? (
                <div className="text-center py-8 text-neutral-600 space-y-2">
                  <Clock className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs font-semibold text-neutral-500">No payment receipts logged yet</p>
                  <p className="text-[11px] text-neutral-600">Payments will appear here as soon as transactions are processed.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Summary Header */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                      <span className="text-[10px] text-neutral-500 block">Total Payments</span>
                      <span className="text-sm font-bold text-neutral-700">{student.paymentHistory.length}</span>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                      <span className="text-[10px] text-neutral-500 block">Total Collected</span>
                      <span className="text-sm font-bold text-neutral-700">{formatINR(student.paidTillNow)}</span>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                      <span className="text-[10px] text-neutral-500 block">Still Pending</span>
                      <span className="text-sm font-bold text-neutral-700">{formatINR(student.remainingFees)}</span>
                    </div>
                  </div>

                  {/* Payment Records with Running Balance */}
                  {[...student.paymentHistory].reverse().map((rec, idx, arr) => {
                    // Calculate running balance: totalFees minus sum of payments up to this point
                    const paymentsUpToThis = arr.slice(0, idx + 1).reduce((sum, r) => sum + r.amount, 0);
                    const runningBalance = Math.max(0, student.totalFees - paymentsUpToThis);

                    return (
                      <div key={rec.id} className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-neutral-700">{rec.id}</span>
                            {rec.targetSemester && (
                              <span className="px-2 py-0.5 rounded bg-violet-500/20 text-neutral-700 font-bold border border-neutral-200 text-[10px]">
                                {rec.targetSemester}
                              </span>
                            )}
                            {rec.installmentNo && (
                              <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-bold border border-neutral-200 text-[10px]">
                                EMI #{rec.installmentNo}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-semibold text-[10px]">{rec.mode}</span>
                          </div>
                          <p className="text-neutral-700 font-medium">{rec.remark}</p>
                          <p className="text-[10px] text-neutral-600 font-mono">Ref: {rec.transactionRef} | Staff: {rec.staffName || 'Admin'}</p>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="text-sm font-extrabold text-neutral-700 block">{formatINR(rec.amount)}</span>
                          <span className="text-[10px] text-neutral-500 block">{rec.date}</span>
                          <span className="text-[10px] text-neutral-700 font-semibold block">Balance: {formatINR(runningBalance)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 md:p-6 bg-neutral-50/60 border-t border-neutral-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {!isReadOnly && student.remainingFees > 0 && onCollectPayment && (
              <button
                onClick={handleCollectFee}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition-colors cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                Collect Fee
              </button>
            )}
            {onOpenReceiptCenter && (
              <button
                onClick={handleOpenReceiptCenter}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-md transition-colors cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                Generate Receipt
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-900 font-semibold shadow-md transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Student Record
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-zinc-700/60 text-neutral-700 font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
};
