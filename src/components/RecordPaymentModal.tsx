import React, { useState } from 'react';
import type { Student, PaymentMode, PaymentRecord } from '../types/feeSystem';
import { X, QrCode, CheckCircle2, DollarSign } from 'lucide-react';
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

  const [amount, setAmount] = useState<number>(student.remainingFees > 0 ? Math.min(35000, student.remainingFees) : 0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [transactionRef, setTransactionRef] = useState<string>(`UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [remark, setRemark] = useState<string>('Installment Fee Payment');
  const [discount, setDiscount] = useState<number>(0);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const calculatedRemainingAfterPayment = Math.max(0, student.remainingFees - amount - discount);

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

    const newPaymentRecord: PaymentRecord = {
      id: `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      mode: paymentMode,
      transactionRef: transactionRef || `REF-${Date.now()}`,
      remark: remark,
      discountApplied: discount > 0 ? discount : undefined,
      staffName: staffName,
    };

    const newPaidTillNow = student.paidTillNow + amount + discount;
    const newRemaining = Math.max(0, student.totalFees - newPaidTillNow);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl overflow-hidden text-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Record Fee Payment</h2>
              <p className="text-xs text-slate-400">Collect payment & issue official receipt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Summary Pill */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Student:</span>
            <span className="font-bold text-white text-sm">{student.name} ({student.course})</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Registration No:</span>
            <span className="font-mono text-indigo-400 font-semibold">{student.registrationNo}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-center">
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Fee</span>
              <span className="text-xs font-bold text-white">{formatCurrencyINR(student.totalFees)}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Paid So Far</span>
              <span className="text-xs font-bold text-emerald-400">{formatCurrencyINR(student.paidTillNow)}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Current Dues</span>
              <span className="text-xs font-bold text-amber-400">{formatCurrencyINR(student.remainingFees)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Payment Mode Selector */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Payment Method</label>
            <div className="grid grid-cols-5 gap-2">
              {(['UPI', 'Cash', 'NEFT', 'Cheque', 'Demand Draft'] as PaymentMode[]).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`py-2 px-2 rounded-xl font-semibold border transition-all text-center ${
                    paymentMode === mode
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
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
              <label className="block text-slate-300 font-medium mb-1">Amount to Collect (₹)</label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={student.remainingFees}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setAmount(student.remainingFees)}
                  className="absolute right-2 top-1.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-[10px] font-bold"
                >
                  Full Due
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Scholarship / Concession (₹)</label>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Reference & Remarks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Transaction Ref / Cheque No.</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Remark / Purpose</label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
                placeholder="e.g. 1st Installment Fee"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* UPI Live QR Button if UPI Mode selected */}
          {paymentMode === 'UPI' && (
            <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <span className="text-slate-300 font-medium">Generate Instant Student Payment QR</span>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" /> Show QR
              </button>
            </div>
          )}

          {/* Post-Payment Calculated Preview */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Remaining Balance After Payment:</span>
            <span className={`font-bold text-sm ${calculatedRemainingAfterPayment === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {formatCurrencyINR(calculatedRemainingAfterPayment)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Processing...' : 'Confirm & Collect Payment'}
            </button>
          </div>
        </form>

        {/* Dynamic UPI QR Modal overlay */}
        {showQrModal && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 relative">
              <button
                onClick={() => setShowQrModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-bold text-white">Scan & Pay via UPI</h3>
              <p className="text-xs text-slate-400">GPay, PhonePe, Paytm, BHIM</p>

              <div className="bg-white p-4 rounded-2xl inline-block border-4 border-indigo-500 shadow-xl">
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
                <p className="font-bold text-emerald-400 text-sm">{formatCurrencyINR(amount)}</p>
                <p className="text-slate-400 font-mono text-[11px]">{student.name} ({student.registrationNo})</p>
              </div>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
