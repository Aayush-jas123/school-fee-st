import React from 'react';
import type { CourseType } from '../types/feeSystem';
import {
  LayoutDashboard,
  Grid,
  Users,
  Receipt,
  BarChart3,
  BookOpen,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCourseSelect: () => void;
  selectedCourse: CourseType | 'ALL';
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onTabChange,
  onOpenCourseSelect,
  selectedCourse,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'analytics', label: 'Fee Revenue Analytics', icon: BarChart3 },
    { id: 'receipts', label: 'Receipt Generator', icon: Receipt },
    { id: 'structures', label: 'Fee Structures', icon: BookOpen },
    { id: 'audit', label: 'Audit & Transaction Log', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Course Switcher Card */}
        <div
          onClick={onOpenCourseSelect}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/80 border border-slate-700/70 hover:border-indigo-500/50 cursor-pointer group transition-all shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                <Grid className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Active Course</p>
                <p className="text-xs font-bold text-white group-hover:text-indigo-300">
                  {selectedCourse === 'ALL' ? 'All Programs' : `${selectedCourse} Program`}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Administration Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Program Links */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Quick Program Switch
          </p>
          <div className="space-y-1">
            {['JBT', 'B.Ed'].map((c) => (
              <button
                key={c}
                onClick={onOpenCourseSelect}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <span>{c} Course Portal</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            Audit Logging Active
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            All staff changes are logged in compliance with college accounts guidelines.
          </p>
        </div>

        <button
          onClick={() => alert('Shanti College Fee Portal v2.4')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>System Version & Help</span>
        </button>
      </div>
    </aside>
  );
};
