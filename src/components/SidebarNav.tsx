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
  FileSpreadsheet,
  Database,
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
    { id: 'daily_report', label: 'Daily Collection Report', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Fee Revenue Analytics', icon: BarChart3 },
    { id: 'receipts', label: 'Receipt Generator', icon: Receipt },
    { id: 'structures', label: 'Fee Structures', icon: BookOpen },
    { id: 'audit', label: 'Audit & Transaction Log', icon: ShieldAlert },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200/80 shrink-0 hidden md:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Course Switcher Card */}
        <div
          onClick={onOpenCourseSelect}
          className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 cursor-pointer group transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs transition-all">
                <Grid className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Active Course</p>
                <p className="text-xs font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                  {selectedCourse === 'ALL' ? 'All Programs' : `${selectedCourse} Program`}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Administration Menu
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Program Links */}
        <div>
          <p className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Quick Program Switch
          </p>
          <div className="space-y-0.5">
            {['JBT', 'B.Ed'].map((c) => (
              <button
                key={c}
                onClick={onOpenCourseSelect}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all duration-200 cursor-pointer"
              >
                <span>{c} Course Portal</span>
                <span className="w-2 h-2 rounded-full bg-neutral-900" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-neutral-200 space-y-2">
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-500 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-600">
            <ShieldAlert className="w-3.5 h-3.5 text-neutral-500" />
            Audit Logging Active
          </div>
          <p className="text-[10px] text-neutral-400 leading-tight">
            All staff changes are logged in compliance with college accounts guidelines.
          </p>
        </div>

        <button
          onClick={() => alert('Shanti College Fee Portal v2.4')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 transition-all duration-200"
        >
          <HelpCircle className="w-4 h-4 text-neutral-400" />
          <span>System Version & Help</span>
        </button>
      </div>
    </aside>
  );
};
