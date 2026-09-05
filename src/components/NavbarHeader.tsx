import React from 'react';
import type { CourseType } from '../types/feeSystem';
import { Building2, Search, Bell, LogOut, ChevronDown, UserCheck, Calendar, Database, Zap, X } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarHeaderProps {
  selectedCourse: CourseType | 'ALL';
  onCourseChange: (course: CourseType | 'ALL') => void;
  selectedSession: string;
  onSessionChange: (session: string) => void;
  staffName: string;
  onLogout: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  availableSessions?: string[];
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
  availableSessions = [],
}) => {
  const isSupabaseActive = isSupabaseConfigured();

  return (
    <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 text-zinc-100 sticky top-0 z-30 px-4 md:px-6 py-3 shadow-lg shadow-black/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Course Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white leading-tight">Shanti College of Education</h2>
                {isSupabaseActive ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" /> Live
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-500 border border-zinc-700/50">
                    <Database className="w-3 h-3 text-zinc-500" /> Local
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">Fee Management Portal</p>
            </div>
          </div>

          <div className="h-6 w-px bg-zinc-800/60 hidden md:block" />

          {/* Course Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value as CourseType | 'ALL')}
              className="bg-zinc-900/80 border border-zinc-800/60 text-zinc-200 text-xs font-semibold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-violet-500/50 cursor-pointer appearance-none shadow-sm transition-colors"
            >
              <option value="ALL">All Courses (JBT & B.Ed)</option>
              <option value="JBT">JBT (Junior Basic Training)</option>
              <option value="B.Ed">B.Ed (Bachelor of Education)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Center: Search & Academic Session Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Reg No, Name, Phone..."
              className="w-full pl-9 pr-8 py-1.5 bg-zinc-900/60 border border-zinc-800/50 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Academic Session Filter Pill */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800/50 text-xs px-3 py-1.5 rounded-xl text-zinc-400">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              <select
                value={selectedSession}
                onChange={(e) => onSessionChange(e.target.value)}
                className="bg-transparent border-none text-zinc-200 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-zinc-900">All Sessions</option>
                {availableSessions.map((sess) => (
                  <option key={sess} value={sess} className="bg-zinc-900">Session {sess}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: Staff User Profile & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Notification bell */}
          <button
            title="Notifications"
            className="w-9 h-9 rounded-xl bg-zinc-900/60 border border-zinc-800/50 text-zinc-400 hover:text-white hover:border-zinc-700 flex items-center justify-center relative transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-pulse" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center justify-center font-bold text-xs">
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
            className="p-2 rounded-xl bg-zinc-900/60 hover:bg-rose-950/30 border border-zinc-800/50 hover:border-rose-700/40 text-zinc-500 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
