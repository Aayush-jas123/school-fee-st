import React from 'react';
import { motion } from 'framer-motion';
import type { Student } from '../types/feeSystem';
import { Users, IndianRupee, Wallet, Clock, CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';

interface DashboardSummaryCardsProps {
  students: Student[];
}

export const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({ students }) => {
  const totalStudents = students.length;
  const totalFeeExpected = students.reduce((acc, s) => acc + s.totalFees, 0);
  const totalFeeCollected = students.reduce((acc, s) => acc + s.paidTillNow, 0);
  const totalPendingFees = students.reduce((acc, s) => acc + s.remainingFees, 0);

  const fullyPaidStudents = students.filter((s) => s.feeStatus === 'Paid').length;
  const partlyPaidStudents = students.filter((s) => s.feeStatus === 'Partly Paid').length;
  const unpaidStudents = students.filter((s) => s.feeStatus === 'Unpaid' || s.feeStatus === 'Overdue').length;

  const collectionPercentage = totalFeeExpected > 0 ? Math.round((totalFeeCollected / totalFeeExpected) * 100) : 0;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      id: 'total_students',
      title: 'Total Students',
      value: totalStudents.toString(),
      subtext: 'Enrolled in current selection',
      icon: Users,
      accent: 'violet',
    },
    {
      id: 'expected_fee',
      title: 'Total Fee Expected',
      value: formatINR(totalFeeExpected),
      subtext: 'Annual gross curriculum fees',
      icon: Wallet,
      accent: 'blue',
    },
    {
      id: 'collected_fee',
      title: 'Total Fee Collected',
      value: formatINR(totalFeeCollected),
      subtext: `${collectionPercentage}% of total expected fee`,
      icon: IndianRupee,
      accent: 'emerald',
    },
    {
      id: 'pending_fee',
      title: 'Total Pending Fees',
      value: formatINR(totalPendingFees),
      subtext: 'Outstanding balance across students',
      icon: Clock,
      accent: 'rose',
    },
    {
      id: 'fully_paid',
      title: 'Fully Paid Students',
      value: fullyPaidStudents.toString(),
      subtext: `${totalStudents > 0 ? Math.round((fullyPaidStudents / totalStudents) * 100) : 0}% clearance rate`,
      icon: CheckCircle,
      accent: 'emerald',
      statusTag: 'Paid Status',
    },
    {
      id: 'partly_paid',
      title: 'Partly Paid Students',
      value: partlyPaidStudents.toString(),
      subtext: 'Active installment plans',
      icon: AlertTriangle,
      accent: 'amber',
      statusTag: 'Partly Paid',
    },
    {
      id: 'unpaid',
      title: 'Unpaid / Overdue',
      value: unpaidStudents.toString(),
      subtext: 'Requires fee reminder alert',
      icon: XCircle,
      accent: 'rose',
      statusTag: 'Unpaid Dues',
    },
  ];

  const accentStyles: Record<string, { iconBg: string; border: string; tagBg: string; tagText: string; tagBorder: string }> = {
    violet: { iconBg: 'bg-violet-600', border: 'hover:border-neutral-200', tagBg: 'bg-neutral-100', tagText: 'text-neutral-700', tagBorder: 'border-neutral-200' },
    blue: { iconBg: 'bg-blue-600', border: 'hover:border-neutral-200', tagBg: 'bg-neutral-100', tagText: 'text-neutral-700', tagBorder: 'border-neutral-200' },
    emerald: { iconBg: 'bg-emerald-600', border: 'hover:border-neutral-200', tagBg: 'bg-neutral-100', tagText: 'text-neutral-700', tagBorder: 'border-neutral-200' },
    rose: { iconBg: 'bg-rose-600', border: 'hover:border-rose-500/30', tagBg: 'bg-neutral-100', tagText: 'text-neutral-700', tagBorder: 'border-neutral-200' },
    amber: { iconBg: 'bg-amber-500', border: 'hover:border-neutral-200', tagBg: 'bg-neutral-100', tagText: 'text-neutral-700', tagBorder: 'border-neutral-200' },
  };

  return (
    <div className="space-y-4">
      {/* Top Banner stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl p-4 md:px-6 shadow-lg backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center font-bold border border-neutral-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Overall Fee Collection Progress</h3>
            <p className="text-xs text-neutral-500">Real-time breakdown based on current active filters</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-neutral-500 block text-[11px]">Collection Target</span>
            <span className="text-neutral-700 font-extrabold text-sm">{collectionPercentage}% Achieved</span>
          </div>
          <div className="w-32 bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${collectionPercentage}%` }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="bg-neutral-900 h-full rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Grid of 7 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const style = accentStyles[card.accent];
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              className={`bg-white border border-neutral-200 rounded-2xl p-4 md:p-5 shadow-lg transition-all duration-300 relative overflow-hidden group card-premium ${style.border}`}
            >
              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 bg-neutral-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="flex items-center justify-between mb-3 relative">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl ${style.iconBg} text-neutral-900 flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mb-2 relative">
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {card.value}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 relative">
                <span>{card.subtext}</span>
                {card.statusTag && (
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${style.tagBg} ${style.tagText} ${style.tagBorder}`}>
                    {card.statusTag}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
