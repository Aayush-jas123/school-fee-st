import React from 'react';
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
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      iconBg: 'bg-indigo-600',
    },
    {
      id: 'expected_fee',
      title: 'Total Fee Expected',
      value: formatINR(totalFeeExpected),
      subtext: 'Annual gross curriculum fees',
      icon: Wallet,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      iconBg: 'bg-blue-600',
    },
    {
      id: 'collected_fee',
      title: 'Total Fee Collected',
      value: formatINR(totalFeeCollected),
      subtext: `${collectionPercentage}% of total expected fee`,
      icon: IndianRupee,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-600',
    },
    {
      id: 'pending_fee',
      title: 'Total Pending Fees',
      value: formatINR(totalPendingFees),
      subtext: 'Outstanding balance across students',
      icon: Clock,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      iconBg: 'bg-rose-600',
    },
    {
      id: 'fully_paid',
      title: 'Fully Paid Students',
      value: fullyPaidStudents.toString(),
      subtext: `${totalStudents > 0 ? Math.round((fullyPaidStudents / totalStudents) * 100) : 0}% clearance rate`,
      icon: CheckCircle,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500',
      statusTag: 'Paid Status',
    },
    {
      id: 'partly_paid',
      title: 'Partly Paid Students',
      value: partlyPaidStudents.toString(),
      subtext: 'Active installment plans',
      icon: AlertTriangle,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500',
      statusTag: 'Partly Paid',
    },
    {
      id: 'unpaid',
      title: 'Unpaid / Overdue',
      value: unpaidStudents.toString(),
      subtext: 'Requires fee reminder alert',
      icon: XCircle,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      iconBg: 'bg-rose-500',
      statusTag: 'Unpaid Dues',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner stats summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Overall Fee Collection Progress</h3>
            <p className="text-xs text-slate-400">Real-time breakdown based on current active filters</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Collection Target</span>
            <span className="text-emerald-400 font-extrabold text-sm">{collectionPercentage}% Achieved</span>
          </div>
          <div className="w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of 7 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-lg transition-all duration-200 hover:border-slate-700 relative overflow-hidden group`}
            >
              {/* Subtle top indicator bar */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl ${card.iconBg} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Metric Value */}
              <div className="mb-2">
                <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {card.value}
                </span>
              </div>

              {/* Subtext info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{card.subtext}</span>
                {card.statusTag && (
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${card.color}`}>
                    {card.statusTag}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
