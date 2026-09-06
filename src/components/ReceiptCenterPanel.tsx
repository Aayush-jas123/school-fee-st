import React, { useMemo, useState } from 'react';
import type { Student, PaymentRecord } from '../types/feeSystem';
import {
  Receipt,
  Search,
  DollarSign,
  Printer,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  CreditCard,
  Calendar,
  FileText,
  X,
} from 'lucide-react';

interface ReceiptCenterPanelProps {
  students: Student[];
  receiptSearch: string;
  setReceiptSearch: (v: string) => void;
  receiptFilter: 'ALL' | 'Paid' | 'Partly Paid' | 'Unpaid';
  setReceiptFilter: (v: 'ALL' | 'Paid' | 'Partly Paid' | 'Unpaid') => void;
  onCollectFee: (student: Student) => void;
  onGenerateReceipt: (student: Student) => void;
  onViewReceipt: (student: Student, payment: PaymentRecord) => void;
  isReadOnly: boolean;
}

export const ReceiptCenterPanel: React.FC<ReceiptCenterPanelProps> = ({
  students,
  receiptSearch,
  setReceiptSearch,
  receiptFilter,
  setReceiptFilter,
  onCollectFee,
  onGenerateReceipt,
  onViewReceipt,
  isReadOnly,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (receiptFilter !== 'ALL' && s.feeStatus !== receiptFilter) return false;
      if (receiptSearch.trim()) {
        const q = receiptSearch.trim().toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.registrationNo.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q) ||
          (s.fatherName || '').toLowerCase().includes(q) ||
          (s.currentSemester || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [students, receiptFilter, receiptSearch]);

  const totalCollected = filteredStudents.reduce((sum, s) => sum + s.paidTillNow, 0);
  const totalPending = filteredStudents.reduce((sum, s) => sum + s.remainingFees, 0);
  const totalPayments = filteredStudents.reduce((sum, s) => sum + s.paymentHistory.length, 0);

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const getStatusIcon = (status: string) => {
    if (status === 'Paid') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    if (status === 'Partly Paid') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
    return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
  };

  const getStatusBadge = (status: string) => {
    const base = 'px-2 py-0.5 rounded-full text-[10px] font-bold border';
    if (status === 'Paid') return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
    if (status === 'Partly Paid') return `${base} bg-amber-50 text-amber-700 border-amber-200`;
    return `${base} bg-rose-50 text-rose-700 border-rose-200`;
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl shadow-lg overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-neutral-200 bg-neutral-50/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-violet-600/10 text-violet-600 flex items-center justify-center font-bold border border-violet-200">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-neutral-900">Fee Collection & Receipt Center</h3>
              <p className="text-xs text-neutral-500">
                Collect fees, generate receipts, and view payment history for each student
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Students</span>
            <span className="text-lg font-extrabold text-neutral-900 block">{filteredStudents.length}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Total Collected</span>
            <span className="text-lg font-extrabold text-emerald-700 block">{formatINR(totalCollected)}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Total Pending</span>
            <span className="text-lg font-extrabold text-rose-700 block">{formatINR(totalPending)}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-neutral-200">
            <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Transactions</span>
            <span className="text-lg font-extrabold text-neutral-900 block">{totalPayments}</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={receiptSearch}
              onChange={(e) => setReceiptSearch(e.target.value)}
              placeholder="Search student name, reg no, roll no..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-zinc-500 focus:outline-none focus:border-violet-400 transition-all font-medium"
            />
            {receiptSearch && (
              <button
                onClick={() => setReceiptSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
            {(['ALL', 'Paid', 'Partly Paid', 'Unpaid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setReceiptFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  receiptFilter === st
                    ? st === 'Paid'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : st === 'Partly Paid'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : st === 'Unpaid'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-violet-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 hover:bg-white/60'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="divide-y divide-neutral-200 max-h-[65vh] overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 space-y-2">
            <Search className="w-10 h-10 text-neutral-400 mx-auto" />
            <p className="text-sm font-semibold">No students match your search</p>
            <p className="text-xs text-neutral-400">Try adjusting filters or search terms</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isExpanded = expandedId === student.id;
            const lastPayment = student.paymentHistory[0];
            const semSlots = student.semesterFees || [];

            return (
              <div key={student.id} className="transition-colors">
                {/* Student Row */}
                <div
                  className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50/80 transition-colors ${
                    isExpanded ? 'bg-violet-50/40' : ''
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : student.id)}
                >
                  {/* Left: Student Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold text-sm shrink-0 border border-neutral-200">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900 text-sm">{student.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                          {student.course}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                          {student.currentSemester || (student.course === 'JBT' ? 'Session 1' : 'Sem 1')}
                        </span>
                        <span className={getStatusBadge(student.feeStatus)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(student.feeStatus)}
                            {student.feeStatus}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-neutral-500">
                        <span className="font-mono font-bold text-neutral-600">{student.registrationNo}</span>
                        <span>Roll: {student.rollNo || 'Pending'}</span>
                        <span>{student.fatherName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Fee Summary */}
                  <div className="flex items-center gap-4 md:gap-6 text-xs shrink-0">
                    <div className="text-center">
                      <span className="text-[10px] text-neutral-500 block">Total Fee</span>
                      <span className="font-bold text-neutral-900">{formatINR(student.totalFees)}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-neutral-500 block">Paid</span>
                      <span className="font-bold text-emerald-700">{formatINR(student.paidTillNow)}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-neutral-500 block">Pending</span>
                      <span className="font-bold text-rose-700">{formatINR(student.remainingFees)}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-neutral-500 block">Payments</span>
                      <span className="font-bold text-neutral-900">{student.paymentHistory.length}</span>
                    </div>
                  </div>

                  {/* Right: Quick Actions */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {!isReadOnly && student.remainingFees > 0 && (
                      <button
                        onClick={() => onCollectFee(student)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        Collect Fee
                      </button>
                    )}
                    <button
                      onClick={() => onGenerateReceipt(student)}
                      className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : student.id)}
                      className="p-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border border-neutral-200 transition-all cursor-pointer"
                      title="Expand payment details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="px-4 md:px-6 pb-5 bg-neutral-50/60 border-t border-neutral-200/60">
                    {/* Semester-wise breakdown */}
                    {semSlots.length > 0 && (
                      <div className="mt-4 mb-4">
                        <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Semester-wise Fee Status
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {semSlots.map((slot) => (
                            <div
                              key={slot.semester}
                              className={`p-3 rounded-xl border text-xs ${
                                slot.status === 'Paid'
                                  ? 'bg-emerald-50 border-emerald-200'
                                  : slot.status === 'Partly Paid'
                                  ? 'bg-amber-50 border-amber-200'
                                  : 'bg-white border-neutral-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-neutral-900">{slot.semester}</span>
                                <span className={getStatusBadge(slot.status)}>{slot.status}</span>
                              </div>
                              <div className="space-y-0.5 text-[11px]">
                                <div className="flex justify-between">
                                  <span className="text-neutral-500">Fee:</span>
                                  <span className="font-bold">{formatINR(slot.totalFee)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-500">Paid:</span>
                                  <span className="font-bold text-emerald-700">{formatINR(slot.paidAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-500">Due:</span>
                                  <span className="font-bold text-rose-700">{formatINR(slot.remainingAmount)}</span>
                                </div>
                              </div>
                              {/* Progress bar */}
                              <div className="mt-2 w-full bg-white rounded-full h-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    slot.status === 'Paid' ? 'bg-emerald-500' : slot.status === 'Partly Paid' ? 'bg-amber-500' : 'bg-neutral-300'
                                  }`}
                                  style={{ width: `${slot.totalFee > 0 ? Math.min(100, (slot.paidAmount / slot.totalFee) * 100) : 0}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Payment History */}
                    {student.paymentHistory.length > 0 ? (
                      <div>
                        <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" /> Payment History ({student.paymentHistory.length} transactions)
                        </h4>
                        <div className="space-y-2">
                          {[...student.paymentHistory].reverse().map((rec) => (
                            <div
                              key={rec.id}
                              className="bg-white p-3 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono font-bold text-neutral-700">{rec.id}</span>
                                    {rec.targetSemester && (
                                      <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 font-bold text-[10px] border border-violet-200">
                                        {rec.targetSemester}
                                      </span>
                                    )}
                                    {rec.installmentNo && (
                                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-bold text-[10px] border border-neutral-200">
                                        EMI #{rec.installmentNo}
                                      </span>
                                    )}
                                    <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 text-[10px] border border-neutral-200">
                                      {rec.mode}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-neutral-500 mt-0.5 truncate">
                                    {rec.remark} • Ref: {rec.transactionRef} • {rec.date}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-extrabold text-emerald-700 text-sm">{formatINR(rec.amount)}</span>
                                <button
                                  onClick={() => onViewReceipt(student, rec)}
                                  className="px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-[10px] flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                                >
                                  <Printer className="w-3 h-3" />
                                  Receipt
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-neutral-500 space-y-2">
                        <FileText className="w-8 h-8 text-neutral-400 mx-auto" />
                        <p className="text-xs font-semibold">No payment records yet</p>
                        <p className="text-[11px] text-neutral-400">
                          {!isReadOnly ? 'Click "Collect Fee" to record the first payment for this student.' : 'Payments will appear here once recorded.'}
                        </p>
                      </div>
                    )}

                    {/* Quick Actions Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-200">
                      <div className="text-[11px] text-neutral-500">
                        Last updated: {lastPayment ? lastPayment.date : 'No payments'} •{' '}
                        {student.paymentHistory.length} transaction{student.paymentHistory.length !== 1 ? 's' : ''} recorded
                      </div>
                      <div className="flex items-center gap-2">
                        {!isReadOnly && student.remainingFees > 0 && (
                          <button
                            onClick={() => onCollectFee(student)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                          >
                            <DollarSign className="w-3 h-3" />
                            Collect Fee
                          </button>
                        )}
                        <button
                          onClick={() => onGenerateReceipt(student)}
                          className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                        >
                          <Printer className="w-3 h-3" />
                          Generate Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
