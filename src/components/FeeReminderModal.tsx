import React, { useState } from 'react';
import type { Student } from '../types/feeSystem';
import { X, BellRing, Send, Printer, MessageSquare, Mail, Phone } from 'lucide-react';
import { formatCurrencyINR } from '../utils/exportUtils';

interface FeeReminderModalProps {
  student: Student | null;
  onClose: () => void;
  onReminderSent: (updatedStudent: Student, channel: 'WhatsApp' | 'Email' | 'SMS' | 'Printed Notice') => void;
}

export const FeeReminderModal: React.FC<FeeReminderModalProps> = ({
  student,
  onClose,
  onReminderSent,
}) => {
  if (!student) return null;

  const [channel, setChannel] = useState<'WhatsApp' | 'Email' | 'SMS' | 'Printed Notice'>('WhatsApp');
  const [customLateFee, setCustomLateFee] = useState<number>(500);
  const [graceDays, setGraceDays] = useState<number>(7);
  const [showPrintDemandNotice, setShowPrintDemandNotice] = useState<boolean>(false);
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const totalPayableWithLateFee = student.remainingFees + customLateFee;

  const getNoticeMessage = () => {
    return `OFFICIAL FEE NOTICE: Dear ${student.name} (${student.registrationNo}), your outstanding tuition fee balance for the ${student.course} program is ${formatCurrencyINR(student.remainingFees)}. A late fee penalty of ${formatCurrencyINR(customLateFee)} applies after ${graceDays} days. Please clear your dues at the earliest via online UPI or accounts branch to avoid registration suspension. - College Accounts Dept.`;
  };

  const handleSendReminder = () => {
    setBroadcastSent(true);

    const updatedStudent: Student = {
      ...student,
      lastReminderSent: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      onReminderSent(updatedStudent, channel);
      setBroadcastSent(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl overflow-hidden text-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Fee Reminder & Demand Notice</h2>
              <p className="text-xs text-slate-400">Send instant reminder or print formal letter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Alert Box */}
        <div className="bg-amber-950/30 border border-amber-800/60 rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white text-sm">{student.name} ({student.course})</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px]">
              {student.feeStatus}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Outstanding Dues:</span>
            <strong className="text-amber-400 font-bold text-sm">{formatCurrencyINR(student.remainingFees)}</strong>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Contact Phone:</span>
            <span className="font-mono text-slate-200">{student.phone}</span>
          </div>
        </div>

        {/* Channel Selection */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Notification Method</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-400' },
                { name: 'Email', icon: Mail, color: 'text-blue-400' },
                { name: 'SMS', icon: Phone, color: 'text-indigo-400' },
                { name: 'Printed Notice', icon: Printer, color: 'text-purple-400' },
              ].map((c) => {
                const IconComponent = c.icon;
                return (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => {
                      setChannel(c.name as any);
                      if (c.name === 'Printed Notice') setShowPrintDemandNotice(true);
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                      channel === c.name
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${channel === c.name ? 'text-white' : c.color}`} />
                    <span className="font-bold text-[11px]">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Late Penalty & Grace Days Config */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Late Penalty Fine (₹)</label>
              <input
                type="number"
                min={0}
                value={customLateFee}
                onChange={(e) => setCustomLateFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Grace Period (Days)</label>
              <input
                type="number"
                min={1}
                value={graceDays}
                onChange={(e) => setGraceDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Message Preview Box */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Generated Message Template</label>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed font-sans">
              {getNoticeMessage()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowPrintDemandNotice(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4" /> Print Formal Demand Notice
            </button>

            <button
              type="button"
              onClick={handleSendReminder}
              disabled={broadcastSent}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 cursor-pointer text-xs"
            >
              <Send className="w-4 h-4" />
              {broadcastSent ? 'Dispatching...' : `Broadcast ${channel}`}
            </button>
          </div>
        </div>

        {/* Printable Formal Demand Letter Overlay Modal */}
        {showPrintDemandNotice && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative print:p-0 print:shadow-none">
              <button
                onClick={() => setShowPrintDemandNotice(false)}
                className="absolute right-6 top-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 print:hidden"
              >
                <X className="w-5 h-5" />
              </button>

              {/* College Letterhead */}
              <div className="text-center border-b-2 border-indigo-900 pb-4">
                <h1 className="text-2xl font-black text-indigo-950 uppercase tracking-wide">
                  STATE COLLEGE OF EDUCATION
                </h1>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Approved by NCTE & Affiliated to State University
                </p>
                <p className="text-[11px] text-slate-500">
                  Institutional Campus, Education City, Haryana - 134109 • Accounts Wing
                </p>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Ref No: SCOE/ACCOUNTS/DEMAND/{new Date().getFullYear()}/{student.rollNo}</span>
                <span>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              <div className="text-center py-2 bg-amber-50 rounded-xl border border-amber-200">
                <h2 className="text-sm font-black text-amber-900 uppercase tracking-widest">
                  FORMAL NOTICE: OUTSTANDING TUITION FEE DEMAND
                </h2>
              </div>

              {/* Recipient Details */}
              <div className="text-xs space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p><strong>To,</strong></p>
                <p className="font-bold text-sm text-slate-900">{student.name} S/D/O {student.fatherName}</p>
                <p>Registration No: <span className="font-mono">{student.registrationNo}</span> | Roll No: {student.rollNo}</p>
                <p>Course Program: <strong>{student.course} ({student.semester})</strong> | Session: {student.session}</p>
                <p>Address: {student.address}</p>
              </div>

              {/* Breakdown Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase">Fee Dues Calculation</h3>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-300 p-2 text-left">Description</th>
                      <th className="border border-slate-300 p-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2">Total Prescribed Program Annual Fee ({student.course})</td>
                      <td className="border border-slate-300 p-2 text-right">{formatCurrencyINR(student.totalFees)}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 text-emerald-700">Less: Amount Received Till Date</td>
                      <td className="border border-slate-300 p-2 text-right text-emerald-700">({formatCurrencyINR(student.paidTillNow)})</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2 font-bold text-amber-800">Net Outstanding Balance Fee</td>
                      <td className="border border-slate-300 p-2 text-right font-bold text-amber-800">{formatCurrencyINR(student.remainingFees)}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2">Late Fee Fine Penalty (Grace Period {graceDays} Days)</td>
                      <td className="border border-slate-300 p-2 text-right">{formatCurrencyINR(customLateFee)}</td>
                    </tr>
                    <tr className="bg-indigo-50 font-black text-indigo-950 text-sm">
                      <td className="border border-slate-300 p-2">TOTAL PAYABLE DEMAND AMOUNT</td>
                      <td className="border border-slate-300 p-2 text-right">{formatCurrencyINR(totalPayableWithLateFee)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Instructions & Signature */}
              <div className="text-[11px] text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800">Important Instructions:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Please remit the total payable amount within <strong>{graceDays} days</strong> of receipt of this notice.</li>
                  <li>Payment can be made in Cash at College Accounts Window or via Online UPI / NEFT transfer.</li>
                  <li>Failure to clear fees may result in withholding of semester examination admit card.</li>
                </ul>
              </div>

              <div className="pt-8 flex justify-between items-end text-xs">
                <div>
                  <p className="font-bold text-slate-800">Verified By Accounts Dept.</p>
                  <p className="text-slate-500 text-[10px]">Official Institutional Seal</p>
                </div>
                <div className="text-center">
                  <div className="h-10 border-b border-slate-400 w-36 mb-1"></div>
                  <p className="font-bold text-slate-900">Finance Officer / Registrar</p>
                  <p className="text-slate-500 text-[10px]">State College of Education</p>
                </div>
              </div>

              {/* Print Action Bar */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print Demand Letter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
