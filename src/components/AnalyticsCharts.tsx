import React from 'react';
import type { Student } from '../types/feeSystem';
import { MONTHLY_COLLECTION_DATA } from '../data/mockStudents';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp } from 'lucide-react';

interface AnalyticsChartsProps {
  students: Student[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ students }) => {
  // Compute Payment Status distribution dynamically from active students
  const paidCount = students.filter((s) => s.feeStatus === 'Paid').length;
  const partlyPaidCount = students.filter((s) => s.feeStatus === 'Partly Paid').length;
  const unpaidCount = students.filter((s) => s.feeStatus === 'Unpaid' || s.feeStatus === 'Overdue').length;

  const paymentStatusData = [
    { name: 'Fully Paid', value: paidCount, color: '#10b981' },
    { name: 'Partly Paid', value: partlyPaidCount, color: '#f59e0b' },
    { name: 'Unpaid / Overdue', value: unpaidCount, color: '#ef4444' },
  ];

  const formatINR = (val: number) => {
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs text-slate-200">
          <p className="font-bold text-white mb-1">{label || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span>{entry.name || 'Count'}:</span>
              <span className="font-bold">
                {typeof entry.value === 'number' && entry.value > 1000
                  ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(entry.value)
                  : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Payment Status Distribution Chart (Donut Chart) */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              Student Payment Status Ratio
            </h3>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300">
              Live Distribution
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Proportion of Fully Paid, Partly Paid, and Unpaid student records.
          </p>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs font-semibold text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Ring Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-2xl font-extrabold text-white">{students.length}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Students</span>
            </div>
          </div>
        </div>

        {/* Legend Summary Pills */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center text-xs">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="block font-bold text-sm">{paidCount}</span>
            <span className="text-[10px]">Paid</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <span className="block font-bold text-sm">{partlyPaidCount}</span>
            <span className="text-[10px]">Partly Paid</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="block font-bold text-sm">{unpaidCount}</span>
            <span className="text-[10px]">Unpaid</span>
          </div>
        </div>
      </div>

      {/* Monthly Collection Trend Chart */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Monthly Fee Collection Trend (₹)
            </h3>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
              FY 2024-2025
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Comparison of monthly fee collections across JBT and B.Ed programs.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_COLLECTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={formatINR} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={30}
                  formatter={(value) => <span className="text-xs font-semibold text-slate-300">{value}</span>}
                />
                <Bar dataKey="JBT" fill="#10b981" radius={[4, 4, 0, 0]} name="JBT Program" />
                <Bar dataKey="BEd" fill="#6366f1" radius={[4, 4, 0, 0]} name="B.Ed Program" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Insight */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Peak Collection Month: <strong className="text-slate-200">July (₹5.6 Lakhs)</strong></span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Updated as of today</span>
        </div>
      </div>
    </div>
  );
};
