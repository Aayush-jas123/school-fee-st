import React, { useState } from 'react';
import type { Student, PaymentRecord } from '../types/feeSystem';
import {
  X,
  User,
  Printer,
  Clock,
  Edit,
  Building,
  MessageSquare,
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onViewReceipt?: (student: Student, payment: PaymentRecord) => void;
  isReadOnly?: boolean;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose, onEdit, onViewReceipt, isReadOnly = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'semesters' | 'breakdown' | 'history'>('overview');

  if (!student) return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const cleanWhatsapp = (student.whatsappNo || student.phone || '').replace(/\D/g, '');
  const waLink = cleanWhatsapp ? `https://wa.me/91${cleanWhatsapp.slice(-10)}` : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-5 md:p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-white">{student.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    student.course === 'JBT'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {student.course} Program
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {student.currentSemester || 'Sem 1'}
                </span>
                {student.stream && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {student.stream}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Reg No: <strong className="text-indigo-300">{student.registrationNo}</strong> | Roll No: <strong className="text-slate-300">{student.rollNo || 'Pending'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-950/60 border-b border-slate-800 p-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total 2-Yr Fee</span>
            <span className="text-base font-bold text-white">{student.totalFees > 0 ? formatINR(student.totalFees) : 'NIL (TBD)'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Paid</span>
            <span className="text-base font-bold text-emerald-400">{formatINR(student.paidTillNow)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Remaining Fees</span>
            <span className="text-base font-bold text-amber-400">{student.totalFees > 0 ? formatINR(student.remainingFees) : 'TBD'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Semester</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {student.currentSemester || 'Sem 1'} ({student.feeStatus})
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-6 text-xs font-semibold text-slate-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent hover:text-slate-200'
            }`}
          >
            Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('semesters')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'semesters' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent hover:text-slate-200'
            }`}
          >
            4-Semester Fee Ledger
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'breakdown' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent hover:text-slate-200'
            }`}
          >
            Annual Headwise Breakdown
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'history' ? 'border-indigo-500 text-indigo-400 font-bold' : 'border-transparent hover:text-slate-200'
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
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Student Profile Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Full Name:</span>
                      <span className="font-bold text-white">{student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Father / Guardian:</span>
                      <span className="font-medium text-slate-200">{student.fatherName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span className="font-semibold text-slate-200">{student.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone Number:</span>
                      <span className="font-mono text-slate-200">{student.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">WhatsApp No.:</span>
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-400 font-mono hover:underline font-bold"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {student.whatsappNo || student.phone}
                        </a>
                      ) : (
                        <span className="font-mono text-slate-400">{student.whatsappNo || student.phone || 'N/A'}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email Address:</span>
                      <span className="font-mono text-indigo-300">{student.email}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Permanent Address:</span>
                      <span className="text-slate-300">{student.address}</span>
                    </div>
                  </div>
                </div>

                {/* Academic & Fee Schedule */}
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <Building className="w-3.5 h-3.5 text-emerald-400" /> Academic Schedule
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Course Program:</span>
                      <span className="font-bold text-white">{student.course} (2-Year Degree)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stream:</span>
                      <span className="font-bold text-amber-300">{student.stream || 'Arts'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Semester:</span>
                      <span className="font-semibold text-indigo-400">{student.currentSemester || 'Sem 1'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class Roll Number:</span>
                      <span className="font-mono text-slate-200 font-bold">{student.rollNo || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Academic Session:</span>
                      <span className="font-semibold text-slate-200">{student.session}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Next Payment Due Date:</span>
                      <span className="font-mono font-bold text-amber-400">{student.nextDueDate}</span>
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
                <p className="text-slate-400">
                  Detailed 4-Semester Fee Window Ledger (2-Year B.Ed Degree Session 2026-2028):
                </p>
                <span className="text-slate-300 font-bold">
                  {student.totalFees > 0 ? `Sem Fee: ${formatINR(Math.round(student.totalFees / 4))} / Sem` : 'Sem Fee: NIL (TBD)'}
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
                          ? 'bg-indigo-950/30 border-indigo-500/60 ring-1 ring-indigo-500/30'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">{slot.semester}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({is1stYear ? '1st Year' : '2nd Year'})</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[9px] font-bold border border-indigo-500/30">
                              Active
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Prescribed Fee:</span>
                          <span className="font-bold text-white">{slot.totalFee > 0 ? formatINR(slot.totalFee) : 'NIL (TBD)'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Paid Amount:</span>
                          <span className="font-bold text-emerald-400">{formatINR(slot.paidAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Semester Due:</span>
                          <span className={`font-bold ${slot.remainingAmount === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {slot.totalFee > 0 ? formatINR(slot.remainingAmount) : 'TBD'}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isPaid ? 'bg-emerald-500' : isPartly ? 'bg-amber-500' : 'bg-slate-700'
                            }`}
                            style={{ width: `${slot.totalFee > 0 ? Math.min(100, (slot.paidAmount / slot.totalFee) * 100) : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Installment Logs under Semester Card */}
                      {semInstallments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-[11px]">
                          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                            Installment Logs ({semInstallments.length}):
                          </span>
                          <div className="space-y-1.5">
                            {semInstallments.map((inst, idx) => (
                              <div
                                key={inst.id || idx}
                                className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-indigo-300">
                                      Installment #{inst.installmentNo || idx + 1}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                                      {inst.mode}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-mono">{inst.date} • {inst.id}</span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className="font-extrabold text-emerald-400">{formatINR(inst.amount)}</span>
                                  {onViewReceipt && (
                                    <button
                                      onClick={() => onViewReceipt(student, inst)}
                                      className="p-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-colors cursor-pointer"
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
              <p className="text-xs text-slate-400">
                Itemized breakdown of annual fees charged for the {student.course} program:
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Fee Component</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-3 font-medium">Tuition & Academic Training Fee</td>
                      <td className="p-3 text-right font-bold text-white">{formatINR(student.feeBreakdown.tuitionFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Admission & Registration Charges</td>
                      <td className="p-3 text-right font-bold text-white">{formatINR(student.feeBreakdown.admissionFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">University Examination Fee</td>
                      <td className="p-3 text-right font-bold text-white">{formatINR(student.feeBreakdown.examFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Library & Digital Learning Resources</td>
                      <td className="p-3 text-right font-bold text-white">{formatINR(student.feeBreakdown.libraryFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Campus Development & Sports Fund</td>
                      <td className="p-3 text-right font-bold text-white">{formatINR(student.feeBreakdown.developmentFee)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Practical Laboratory & Skill Training</td>
                      <td className="p-3 text-right font-bold text-white">{formatINR(student.feeBreakdown.labFee)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-bold border-t border-slate-700">
                    <tr>
                      <td className="p-3">Total Course 2-Year Fee</td>
                      <td className="p-3 text-right text-sm text-indigo-400">{formatINR(student.totalFees)}</td>
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
                <div className="text-center py-8 text-slate-500 space-y-2">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-400">No payment receipts logged yet</p>
                  <p className="text-[11px] text-slate-500">Payments will appear here as soon as transactions are processed.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {student.paymentHistory.map((rec) => (
                    <div key={rec.id} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-400">{rec.id}</span>
                          {rec.targetSemester && (
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 text-[10px]">
                              {rec.targetSemester}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">{rec.mode}</span>
                        </div>
                        <p className="text-slate-300 font-medium">{rec.remark}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Ref: {rec.transactionRef} | Staff: {rec.staffName || 'Admin'}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-emerald-400 block">{formatINR(rec.amount)}</span>
                        <span className="text-[10px] text-slate-400">{rec.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 md:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={handlePrintReceipt}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Print Fee Receipt
          </button>

          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-md transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Student Record
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
