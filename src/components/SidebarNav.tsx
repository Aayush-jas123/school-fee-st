import React from 'react';
import { motion } from 'framer-motion';
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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCourseSelect: () => void;
  selectedCourse: CourseType | 'ALL';
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onTabChange,
  onOpenCourseSelect,
  selectedCourse,
  collapsed = false,
  onToggleCollapse,
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
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-white border-r border-stone-200/80 shrink-0 hidden md:flex flex-col justify-between sticky top-16 h-[calc(100vh-4rem)] overflow-hidden"
    >
      <div className={`flex flex-col gap-5 ${collapsed ? 'px-2 py-4' : 'p-4'}`}>
        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleCollapse}
            className={`self-end p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 transition-colors cursor-pointer ${collapsed ? 'mb-1' : ''}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </motion.button>
        )}

        {/* Course Switcher Card */}
        <motion.div
          whileHover={{ scale: collapsed ? 1.05 : 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenCourseSelect}
          className={`${collapsed ? 'p-2 mx-auto' : 'p-3.5'} rounded-2xl bg-stone-50 border border-stone-200 hover:border-stone-300 cursor-pointer group transition-all duration-300 shadow-sm`}
          title={collapsed ? (selectedCourse === 'ALL' ? 'All Programs' : `${selectedCourse} Program`) : undefined}
        >
          <div className={`flex ${collapsed ? 'justify-center' : 'items-center justify-between'}`}>
            <div className={`flex ${collapsed ? '' : 'items-center gap-2.5'}`}>
              <div className="w-8 h-8 rounded-xl bg-rose-800 text-stone-50 flex items-center justify-center font-bold text-xs transition-all group-hover:scale-110 duration-300">
                <Grid className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div>
                  <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">Active Course</p>
                  <p className="text-xs font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                    {selectedCourse === 'ALL' ? 'All Programs' : `${selectedCourse} Program`}
                  </p>
                </div>
              )}
            </div>
            {!collapsed && (
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all duration-300" />
            )}
          </div>
        </motion.div>

        {/* Navigation Section */}
        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Administration Menu
            </p>
          )}
          <nav className={`${collapsed ? 'flex flex-col items-center gap-1' : 'space-y-0.5'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={false}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onTabChange(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${collapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-2.5 rounded-xl'} text-xs font-semibold transition-all duration-200 cursor-pointer relative ${
                    isActive
                      ? 'bg-rose-800 text-stone-50 shadow-sm shadow-rose-800/10'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-stone-50' : 'text-stone-400'} transition-transform duration-200 group-hover:scale-110`} />
                  {!collapsed && <span>{item.label}</span>}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Quick Program Links */}
        {!collapsed && (
          <div>
            <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
              Quick Program Switch
            </p>
            <div className="space-y-0.5">
              {['JBT', 'B.Ed'].map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ x: 2 }}
                  onClick={onOpenCourseSelect}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-all duration-200 cursor-pointer"
                >
                  <span>{c} Course Portal</span>
                  <span className="w-2 h-2 rounded-full bg-rose-800" />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      <div className={`${collapsed ? 'px-2 pb-3' : 'p-4 pt-0'}`}>
        {!collapsed && (
          <>
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-600">
                  <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
                  Audit Logging Active
                </div>
                <p className="text-[10px] text-stone-400 leading-tight">
                  All staff changes are logged in compliance with college accounts guidelines.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('Shanti College Fee Portal v2.4')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-all duration-200 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-stone-400" />
                <span>System Version & Help</span>
              </motion.button>
            </div>
          </>
        )}
        {collapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => alert('Shanti College Fee Portal v2.4')}
            className="w-full flex items-center justify-center p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            title="System Version & Help"
          >
            <HelpCircle className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.aside>
  );
};
