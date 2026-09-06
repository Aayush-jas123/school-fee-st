import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Student, PaymentMode, PaymentRecord, SemesterName, SemesterFeeSlot } from '../types/feeSystem';
import { X, QrCode, CheckCircle2, DollarSign, Layers, Receipt, Clock } from 'lucide-react';
import { formatCurrencyINR } from '../utils/exportUtils';

interface RecordPaymentModalProps {
  student: Student | null;
  onClose: () => void;
  onPaymentSuccess: (updatedStudent: Student, paymentRecord: PaymentRecord) => void;
  staffName: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  student,
  onClose,
  onPaymentSuccess,
  staffName,
}) => {
  if (!student) return null;

  // Find default semester slot (first unpaid or current)
  const defaultSem = student.currentSemester || 'Sem 1';
  const [selectedSemester, setSelectedSemester] = useState<SemesterName>(defaultSem);

  const currentSemSlot = (student.semesterFees || []).find(s => s.semester === selectedSemester) || {
    semester: selectedSemester,
    year: selectedSemester === 'Sem 1' || selectedSemester === 'Sem 2' ? ('1st Year' as const) : ('2nd Year' as const),
    totalFee: 19500,
    paidAmount: 0,
    remainingAmount: 19500,
    status: 'Unpaid' as const,
    dueDate: '2026-10-15',
  };

  const defaultAmount = currentSemSlot.remainingAmount > 0 ? Math.min(19500, currentSemSlot.remainingAmount) : 0;
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [transactionRef, setTransactionRef] = useState<string>(`UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [remark, setRemark] = useState<string>(`${selectedSemester} Fee Payment`);
  const [discount, setDiscount] = useState<number>(0);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSemesterChange = (sem: SemesterName) => {
    setSelectedSemester(sem);
    const slot = (student.semesterFees || []).find(s => s.semester === sem);
    const semRemaining = slot ? slot.remainingAmount : 19500;
    setAmount(semRemaining > 0 ? semRemaining : 0);
    setRemark(`${sem} Fee Payment`);
  };

  // Compute EMI history for selected semester
  const semesterEmiHistory = useMemo(() => {
    const targetSlot = (student.semesterFees || []).find(s => s.semester === selectedSemester);
    if (targetSlot?.installments && targetSlot.installments.length > 0) {
      return targetSlot.installments;
    }
    return student.paymentHistory.filter(p => p.targetSemester === selectedSemester).reverse();
  }, [student, selectedSemester]);

  const emiCount = semesterEmiHistory.length;
  const emiTotalPaid = semesterEmiHistory.reduce((sum, e) => sum + e.amount, 0);

  const calculatedSemRemainingAfterPayment = Math.max(0, currentSemSlot.remainingAmount - amount - discount);
  const calculatedTotalRemainingAfterPayment = Math.max(0, student.remainingFees - amount - discount);

  const handleModeChange = (mode: PaymentMode) => {
    setPaymentMode(mode);
    const randNum = Math.floor(1000000000 + Math.random() * 9000000000);
    if (mode === 'UPI') setTransactionRef(`UPI/${randNum}`);
    else if (mode === 'NEFT') setTransactionRef(`NEFT/SBIN${randNum.toString().slice(-6)}`);
    else if (mode === 'Cash') setTransactionRef(`CASH-REF-${Math.floor(100 + Math.random() * 900)}`);
    else if (mode === 'Cheque') setTransactionRef(`CHQ-${Math.floor(100000 + Math.random() * 900000)}`);
    else setTransactionRef(`DD-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 && discount <= 0) {
      alert('Please enter a valid payment amount or discount!');
      return;
    }

    setIsSubmitting(true);

    const targetSlot = (student.semesterFees || []).find(s => s.semester === selectedSemester);
    const existingSlotInstallments = targetSlot?.installments || student.paymentHistory.filter(p => p.targetSemester === selectedSemester);
    const installmentNo = existingSlotInstallments.length + 1;

    const newPaymentRecord: PaymentRecord = {
      id: `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      mode: paymentMode,
      transactionRef: transactionRef || `REF-${Date.now()}`,
      remark: remark,
      discountApplied: discount > 0 ? discount : undefined,
      staffName: staffName,
      targetSemester: selectedSemester,
      installmentNo: installmentNo,
    };

    const updatedSemesterFees = (student.semesterFees || []).map((slot) => {
      if (slot.semester === selectedSemester) {
        const newPaid = slot.paidAmount + amount + discount;
        const newRem = Math.max(0, slot.totalFee - newPaid);
        let newSemStatus: SemesterFeeSlot['status'] = 'Partly Paid';
        if (newRem <= 0) newSemStatus = 'Paid';
        else if (newPaid === 0) newSemStatus = 'Unpaid';

        const prevInstallments = slot.installments || student.paymentHistory.filter(p => p.targetSemester === selectedSemester);

        return {
          ...slot,
          paidAmount: newPaid,
          remainingAmount: newRem,
          status: newSemStatus,
          installments: [...prevInstallments, newPaymentRecord],
        };
      }
      return slot;
    });

    const newPaidTillNow = updatedSemesterFees.reduce((sum, s) => sum + s.paidAmount, 0);
    const newRemaining = Math.max(0, student.totalFees - newPaidTillNow);

    // Advance current semester if selected semester becomes fully paid and next semester exists
    let nextSemester = student.currentSemester;
    if (selectedSemester === student.currentSemester) {
      const currentSlot = updatedSemesterFees.find(s => s.semester === selectedSemester);
      if (currentSlot && currentSlot.status === 'Paid') {
        if (selectedSemester === 'Sem 1') nextSemester = 'Sem 2';
        else if (selectedSemester === 'Sem 2') nextSemester = 'Sem 3';
        else if (selectedSemester === 'Sem 3') nextSemester = 'Sem 4';
      }
    }

    let newStatus: Student['feeStatus'] = 'Partly Paid';
    if (newRemaining <= 0) {
      newStatus = 'Paid';
    } else if (newPaidTillNow === 0) {
      newStatus = 'Unpaid';
    }

    const updatedStudent: Student = {
      ...student,
      paidTillNow: newPaidTillNow,
      remainingFees: newRemaining,
      feeStatus: newStatus,
      currentSemester: nextSemester,
      semesterFees: updatedSemesterFees,
      paymentHistory: [newPaymentRecord, ...student.paymentHistory],
      discountAmount: (student.discountAmount || 0) + discount,
    };

    setTimeout(() => {
      onPaymentSuccess(updatedStudent, newPaymentRecord);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white backdrop-blur-xl border border-neutral-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl shadow-neutral-900/10 overflow-hidden text-neutral-900 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-violet-500/20 text-neutral-700 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Record Fee Payment</h2>
              <p className="text-xs text-neutral-500">Collect Semester Fee & Issue Official Digital Receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Summary Pill */}
        <div className="bg-neutral-50/70 rounded-2xl p-4 border border-neutral-200 mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">Student:</span>
            <span className="font-bold text-neutral-900 text-sm">{student.name} ({student.course})</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">Father's Name / Reg No:</span>
            <span className="font-mono text-neutral-700 font-semibold">{student.fatherName} | {student.registrationNo}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200 text-center">
            <div className="bg-white p-2 rounded-xl border border-neutral-200">
              <span className="text-[10px] text-neutral-500 block">Total Degree Fee</span>
              <span className="text-xs font-bold text-neutral-900">{student.totalFees > 0 ? formatCurrencyINR(student.totalFees) : 'NIL (TBD)'}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-neutral-200">
              <span className="text-[10px] text-neutral-500 block">Total Paid So Far</span>
              <span className="text-xs font-bold text-neutral-700">{formatCurrencyINR(student.paidTillNow)}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-neutral-200">
              <span className="text-[10px] text-neutral-500 block">Overall Balance</span>
              <span className="text-xs font-bold text-neutral-700">{student.totalFees > 0 ? formatCurrencyINR(student.remainingFees) : 'TBD'}</span>
            </div>
          </div>
        </div>

        {/* Target Semester Window Selector */}
        <div className="mb-5">
          <label className="block text-neutral-700 font-semibold text-xs mb-1.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-neutral-700" /> Select Target Semester Payment Window:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'] as SemesterName[]).map((sem) => {
              const slot = (student.semesterFees || []).find(s => s.semester === sem);
              const isSelected = selectedSemester === sem;
              const isPaid = slot?.status === 'Paid';
              const isPartly = slot?.status === 'Partly Paid';

              return (
                <button
                  type="button"
                  key={sem}
                  onClick={() => handleSemesterChange(sem)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500/30 text-neutral-900 ring-2 ring-violet-500/40'
                      : 'bg-neutral-50/60 border-neutral-200 text-neutral-500 hover:border-zinc-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{sem}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isPaid
                        ? 'bg-emerald-500/20 text-neutral-700 border border-emerald-500/30'
                        : isPartly
                        ? 'bg-amber-500/20 text-neutral-700 border border-amber-500/30'
                        : 'bg-rose-500/20 text-neutral-700 border border-rose-500/30'
                    }`}>
                      {slot?.status || 'Unpaid'}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    Due: <span className="text-neutral-900 font-mono font-medium">{slot && slot.totalFee > 0 ? formatCurrencyINR(slot.remainingAmount) : 'TBD'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* EMI History for Selected Semester */}
        {emiCount > 0 && (
          <div className="mb-5 bg-neutral-50/50 p-3 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
              <Receipt className="w-4 h-4 text-neutral-700" />
              Previous EMI Installments for {selectedSemester} ({emiCount} paid):
            </div>
            <div className="space-y-1.5">
              {semesterEmiHistory.map((inst, idx) => (
                <div key={inst.id || idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-neutral-200 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-neutral-700 font-bold text-[10px]">EMI #{inst.installmentNo || idx + 1}</span>
                    <span className="text-neutral-500 font-mono">{inst.date}</span>
                    <span className="text-neutral-600">{inst.mode}</span>
                  </div>
                  <span className="font-bold text-neutral-700">{formatCurrencyINR(inst.amount)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-neutral-200 text-[11px]">
              <span className="text-neutral-500">Total Paid via EMIs so far:</span>
              <span className="font-bold text-neutral-700">{formatCurrencyINR(emiTotalPaid)} of {formatCurrencyINR(currentSemSlot.totalFee)}</span>
            </div>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quick Option: Full Sem vs Custom Installment */}
          <div className="bg-neutral-50/50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-neutral-900">{selectedSemester} Fee: {currentSemSlot.totalFee > 0 ? formatCurrencyINR(currentSemSlot.totalFee) : 'NIL / TBD'}</div>
              <div className="text-[11px] text-neutral-500">Current Semester Remaining: <span className="text-neutral-700 font-bold">{currentSemSlot.totalFee > 0 ? formatCurrencyINR(currentSemSlot.remainingAmount) : 'TBD'}</span></div>
            </div>
            {currentSemSlot.remainingAmount > 0 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAmount(currentSemSlot.remainingAmount)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-neutral-700 border border-emerald-500/40 text-xs font-bold"
                >
                  1-Click Full Sem Payment ({formatCurrencyINR(currentSemSlot.remainingAmount)})
                </button>
              </div>
            )}
          </div>

          {/* Payment Mode Selector */}
          <div>
            <label className="block text-neutral-700 font-medium mb-1.5">Payment Method</label>
            <div className="grid grid-cols-5 gap-2">
              {(['UPI', 'Cash', 'NEFT', 'Cheque', 'Demand Draft'] as PaymentMode[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`py-2 px-2 rounded-xl font-semibold border transition-all text-center ${
                    paymentMode === mode
                      ? 'bg-violet-600 border-violet-500/30 text-neutral-900 shadow-lg shadow-violet-600/20'
                      : 'bg-neutral-50/60 border-neutral-200 text-neutral-500 hover:border-zinc-700/50 hover:text-neutral-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Discount Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Amount to Collect (₹)</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={currentSemSlot.remainingAmount || 19500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="w-full bg-neutral-50/60 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-bold text-sm focus:outline-none focus:border-violet-500/50"
                />
                <button
                  type="button"
                  onClick={() => setAmount(currentSemSlot.remainingAmount)}
                  className="absolute right-2 top-1.5 px-2 py-0.5 rounded bg-violet-500/20 text-neutral-700 hover:bg-violet-500/30 text-[10px] font-bold"
                >
                  Full Sem
                </button>
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Scholarship / Concession (₹)</label>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-neutral-50/60 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-bold text-sm focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Reference & Remarks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Transaction Ref / Cheque No.</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                required
                className="w-full bg-neutral-50/60 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-mono focus:outline-none focus:border-violet-500/50"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Remark / Purpose</label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
                placeholder="e.g. Sem 1 Installment Fee"
                className="w-full bg-neutral-50/60 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* UPI Live QR Button if UPI Mode selected */}
          {paymentMode === 'UPI' && (
            <div className="bg-violet-950/30 border border-violet-800/40 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-neutral-700" />
                <span className="text-neutral-700 font-medium">Generate Dynamic Payment QR ({selectedSemester})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-neutral-900 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" /> Show QR
              </button>
            </div>
          )}

          {/* Next EMI Number Preview */}
          <div className="bg-violet-950/20 p-2.5 rounded-xl border border-violet-800/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-700" />
              <span className="text-neutral-700">This will be recorded as <strong className="text-neutral-700">EMI #{emiCount + 1}</strong> for {selectedSemester}</span>
            </div>
            <span className="text-neutral-500">
              After payment: <strong className={calculatedSemRemainingAfterPayment === 0 ? 'text-neutral-700' : 'text-neutral-700'}>{formatCurrencyINR(calculatedSemRemainingAfterPayment)} pending</strong>
            </span>
          </div>

          {/* Post-Payment Calculated Preview */}
          <div className="bg-neutral-50/60 p-3 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-500 block font-medium">{selectedSemester} Balance After Payment:</span>
              <span className={`font-bold text-sm ${calculatedSemRemainingAfterPayment === 0 ? 'text-neutral-700' : 'text-neutral-700'}`}>
                {formatCurrencyINR(calculatedSemRemainingAfterPayment)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block font-medium">Overall 2-Yr Balance:</span>
              <span className={`font-bold text-sm ${calculatedTotalRemainingAfterPayment === 0 ? 'text-neutral-700' : 'text-neutral-800'}`}>
                {formatCurrencyINR(calculatedTotalRemainingAfterPayment)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-zinc-700/60 text-neutral-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-neutral-900 font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Processing...' : 'Confirm & Print Receipt'}
            </button>
          </div>
        </form>

        {/* Dynamic UPI QR Modal overlay */}
        {showQrModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 relative">
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-bold text-neutral-900">Scan & Pay via UPI</h3>
              <p className="text-xs text-neutral-500">GPay, PhonePe, Paytm, BHIM</p>

              <div className="bg-white p-4 rounded-2xl inline-block border-4 border-violet-500/30 shadow-lg">
                {/* SVG QR Code Simulation */}
                <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  {/* Position detection patterns */}
                  <rect x="5" y="5" width="30" height="30" fill="black" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="black" />

                  <rect x="65" y="5" width="30" height="30" fill="black" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="75" y="15" width="10" height="10" fill="black" />

                  <rect x="5" y="65" width="30" height="30" fill="black" />
                  <rect x="10" y="70" width="20" height="20" fill="white" />
                  <rect x="15" y="75" width="10" height="10" fill="black" />

                  {/* Random grid data pattern */}
                  <rect x="40" y="10" width="15" height="10" fill="black" />
                  <rect x="45" y="25" width="10" height="10" fill="black" />
                  <rect x="10" y="45" width="25" height="10" fill="black" />
                  <rect x="45" y="45" width="20" height="20" fill="indigo" />
                  <rect x="70" y="45" width="20" height="10" fill="black" />
                  <rect x="40" y="70" width="25" height="20" fill="black" />
                  <rect x="70" y="70" width="20" height="20" fill="black" />
                </svg>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-neutral-700 text-sm">{formatCurrencyINR(amount)}</p>
                <p className="text-neutral-500 font-mono text-[11px]">{student.name} ({student.registrationNo})</p>
              </div>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-neutral-900 rounded-xl text-xs font-semibold"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
