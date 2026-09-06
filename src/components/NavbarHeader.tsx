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
    <header className="bg-white/80 backdrop-blur-xl border-b border-neutral-200/80 text-neutral-900 sticky top-0 z-30 px-4 md:px-6 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Course Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-neutral-900 leading-tight">Shanti College of Education</h2>
                {isSupabaseActive ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white">
                    <Zap className="w-3 h-3" /> Live
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-500 border border-neutral-200">
                    <Database className="w-3 h-3" /> Local
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">Fee Management Portal</p>
            </div>
          </div>

          <div className="h-6 w-px bg-neutral-200 hidden md:block" />

          {/* Course Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value as CourseType | 'ALL')}
              className="bg-neutral-50 border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-neutral-400 cursor-pointer appearance-none shadow-sm transition-colors"
            >
              <option value="ALL">All Courses (JBT & B.Ed)</option>
              <option value="JBT">JBT (Junior Basic Training)</option>
              <option value="B.Ed">B.Ed (Bachelor of Education)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Center: Search & Academic Session Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Reg No, Name, Phone..."
              className="w-full pl-9 pr-8 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Academic Session Filter Pill */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 text-xs px-3 py-1.5 rounded-xl text-neutral-500">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={selectedSession}
                onChange={(e) => onSessionChange(e.target.value)}
                className="bg-transparent border-none text-neutral-700 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL" className="bg-white">All Sessions</option>
                {availableSessions.map((sess) => (
                  <option key={sess} value={sess} className="bg-white">Session {sess}</option>
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
            className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 flex items-center justify-center relative transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-neutral-900 absolute top-2 right-2 animate-pulse" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
              RS
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-neutral-900 leading-tight">{staffName}</p>
              <p className="text-[10px] text-neutral-500 font-medium flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Accounts Staff
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Logout"
            className="p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 text-neutral-500 hover:text-neutral-700 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
