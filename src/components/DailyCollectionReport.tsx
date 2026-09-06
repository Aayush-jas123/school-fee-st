import React, { useState, useMemo } from 'react';
import type { Student, PaymentRecord, PaymentMode } from '../types/feeSystem';
import {
  Calendar,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  QrCode,
  Building,
  Search,
} from 'lucide-react';
import { formatCurrencyINR } from '../utils/exportUtils';

interface DailyCollectionReportProps {
  students: Student[];
  onViewReceipt: (student: Student, payment: PaymentRecord) => void;
  staffName: string;
}

export const DailyCollectionReport: React.FC<DailyCollectionReportProps> = ({
  students,
  onViewReceipt,
  staffName,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [dateFilterMode, setDateFilterMode] = useState<'today' | 'custom' | 'all'>('today');
  const [selectedModeFilter, setSelectedModeFilter] = useState<PaymentMode | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Extract all payment transactions across all students
  const allTransactions = useMemo(() => {
    const records: { student: Student; payment: PaymentRecord }[] = [];
    students.forEach((st) => {
      st.paymentHistory.forEach((pm) => {
        records.push({ student: st, payment: pm });
      });
    });
    // Sort descending by date
    return records.sort((a, b) => new Date(b.payment.date).getTime() - new Date(a.payment.date).getTime());
  }, [students]);

  // Filter transactions based on date and payment mode
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(({ student, payment }) => {
      // Date filter
      if (dateFilterMode === 'today' && payment.date !== selectedDate) {
        return false;
      }
      if (dateFilterMode === 'custom' && payment.date !== selectedDate) {
        return false;
      }
      // Mode filter
      if (selectedModeFilter !== 'ALL' && payment.mode !== selectedModeFilter) {
        return false;
      }
      // Search term match
      if (searchTerm && searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase().trim();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesReg = student.registrationNo.toLowerCase().includes(q);
        const matchesRef = payment.transactionRef.toLowerCase().includes(q);
        const matchesReceipt = payment.id.toLowerCase().includes(q);
        return matchesName || matchesReg || matchesRef || matchesReceipt;
      }
      return true;
    });
  }, [allTransactions, dateFilterMode, selectedDate, selectedModeFilter, searchTerm]);

  // Calculate Mode Breakdown Metrics
  const totalCollected = filteredTransactions.reduce((sum, item) => sum + item.payment.amount, 0);
  const cashCollected = filteredTransactions.filter((i) => i.payment.mode === 'Cash').reduce((sum, item) => sum + item.payment.amount, 0);
  const upiCollected = filteredTransactions.filter((i) => i.payment.mode === 'UPI').reduce((sum, item) => sum + item.payment.amount, 0);
  const neftCollected = filteredTransactions.filter((i) => i.payment.mode === 'NEFT' || i.payment.mode === 'Demand Draft' || i.payment.mode === 'Cheque').reduce((sum, item) => sum + item.payment.amount, 0);

  const handlePrintDailyReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Title Banner & Filter Controls */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-neutral-700 border border-neutral-200 flex items-center justify-center font-bold shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-emerald-500/30">
                  College Accountant Portal
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-xs text-neutral-500 font-mono">Date: {selectedDate}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-neutral-900 tracking-tight">
                Daily Financial Collection Report & Audit Ledger
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintDailyReport}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-neutral-900 font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Daily Statement
            </button>
          </div>
        </div>

        {/* Date & Mode Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-neutral-50/60 p-1.5 rounded-xl border border-neutral-200 font-medium">
              <button
                onClick={() => { setDateFilterMode('today'); setSelectedDate(todayStr); }}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                  dateFilterMode === 'today' ? 'bg-violet-600 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Today ({todayStr})
              </button>
              <button
                onClick={() => setDateFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                  dateFilterMode === 'all' ? 'bg-violet-600 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setDateFilterMode('custom')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                  dateFilterMode === 'custom' ? 'bg-violet-600 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Select Specific Date
              </button>
            </div>

            {dateFilterMode === 'custom' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-neutral-50/60 border border-violet-500/30/60 rounded-xl px-3 py-1.5 text-neutral-900 font-mono font-bold focus:outline-none"
              />
            )}

            {/* Mode Filter */}
            <div className="flex items-center gap-1 bg-neutral-50/60 p-1.5 rounded-xl border border-neutral-200 font-medium">
              <span className="text-neutral-500 px-1 font-semibold">Mode:</span>
              {(['ALL', 'Cash', 'UPI', 'NEFT', 'Cheque', 'Demand Draft'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModeFilter(m)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedModeFilter === m ? 'bg-emerald-600 text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Student, Reg No, Receipt No..."
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-50/60 border border-neutral-200 rounded-xl text-neutral-900 font-medium text-xs focus:outline-none focus:border-violet-500/50"
            />
          </div>
        </div>
      </div>

      {/* Mode Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Total Collection</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-neutral-700 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-neutral-900">{formatCurrencyINR(totalCollected)}</span>
          <p className="text-[11px] text-neutral-500 mt-1">{filteredTransactions.length} payment records logged</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Cash Collections</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-neutral-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-neutral-700">{formatCurrencyINR(cashCollected)}</span>
          <p className="text-[11px] text-neutral-500 mt-1">Physical cashier desk cash</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">UPI / Online QR</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-blue-400">{formatCurrencyINR(upiCollected)}</span>
          <p className="text-[11px] text-neutral-500 mt-1">GPay, PhonePe, Paytm QR</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Bank / Cheque / DD</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-neutral-700 flex items-center justify-center font-bold">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-neutral-700">{formatCurrencyINR(neftCollected)}</span>
          <p className="text-[11px] text-neutral-500 mt-1">NEFT, Cheques & Demand Drafts</p>
        </div>
      </div>

      {/* Collective Daily Transaction Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-5 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-neutral-700" />
            Transaction Register ({filteredTransactions.length} Entries)
          </h3>
          <span className="text-xs text-neutral-500 font-mono">Accountant: {staffName}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-neutral-700">
            <thead className="bg-neutral-50/60 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Receipt No & Date</th>
                <th className="py-3 px-4">Student Name & Reg No</th>
                <th className="py-3 px-4">Course & Sem</th>
                <th className="py-3 px-4">Target Window</th>
                <th className="py-3 px-4 text-center">Payment Mode</th>
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4 text-right">Amount Paid (₹)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40/80 font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-600">
                    <div className="max-w-xs mx-auto space-y-1">
                      <Calendar className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                      <p className="font-bold text-neutral-700">No payment transactions logged for {selectedDate}</p>
                      <p className="text-[11px] text-neutral-600">Select another date or switch to "All Records" view.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(({ student, payment }) => (
                  <tr key={`${student.id}-${payment.id}`} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-neutral-700 block">{payment.id}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{payment.date}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-neutral-900 block">{student.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{student.registrationNo}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 mr-1">
                        {student.course}
                      </span>
                      <span className="text-neutral-500 text-[11px]">{student.stream || 'Arts'}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-neutral-700 border border-neutral-200">
                        {payment.targetSemester || student.currentSemester || 'Sem 1'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        payment.mode === 'Cash'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : payment.mode === 'UPI'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {payment.mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-700 whitespace-nowrap">
                      {payment.transactionRef}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-neutral-700 text-sm whitespace-nowrap">
                      {formatCurrencyINR(payment.amount)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onViewReceipt(student, payment)}
                        className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-neutral-900 font-semibold text-[11px] flex items-center gap-1 mx-auto cursor-pointer"
                      >
                        <Printer className="w-3 h-3" /> Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredTransactions.length > 0 && (
              <tfoot className="bg-neutral-50/60 text-neutral-900 font-extrabold border-t border-zinc-700/50">
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-right text-xs uppercase tracking-wider text-neutral-700">
                    Total Daily Collection ({selectedDate}):
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-700 text-sm">
                    {formatCurrencyINR(totalCollected)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
