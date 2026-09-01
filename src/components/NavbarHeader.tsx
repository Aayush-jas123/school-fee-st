import React from 'react';
import type { CourseType } from '../types/feeSystem';
import { Building2, Search, Bell, LogOut, ChevronDown, UserCheck, Calendar } from 'lucide-react';

interface NavbarHeaderProps {
  selectedCourse: CourseType | 'ALL';
  onCourseChange: (course: CourseType | 'ALL') => void;
  selectedSession: string;
  onSessionChange: (session: string) => void;
  staffName: string;
  onLogout: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  selectedCourse,
  onCourseChange,
  selectedSession,
  onSessionChange,
  staffName,
  onLogout,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 px-4 md:px-6 py-3 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Course Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Shanti College of Education</h2>
              <p className="text-[11px] text-slate-400 font-medium">Fee Management Portal</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Course Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value as CourseType | 'ALL')}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none shadow-sm"
            >
              <option value="ALL">All Courses (JBT & B.Ed)</option>
              <option value="JBT">JBT (Junior Basic Training)</option>
              <option value="B.Ed">B.Ed (Bachelor of Education)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Center: Search & Academic Session Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Reg No, Name, Phone..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Academic Session Filter Pill */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 text-xs px-3 py-1.5 rounded-xl text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={selectedSession}
                onChange={(e) => onSessionChange(e.target.value)}
                className="bg-transparent border-none text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-slate-900">All Sessions</option>
                <option value="2024-2026" className="bg-slate-900">Session 2024-2026</option>
                <option value="2023-2025" className="bg-slate-900">Session 2023-2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Staff User Profile & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Notification bell */}
          <button
            title="Notifications"
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-pulse" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">
              RS
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">{staffName}</p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Accounts Staff
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Logout"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-700/50 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
