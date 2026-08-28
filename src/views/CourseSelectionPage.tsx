import React from 'react';
import type { CourseStat, CourseType } from '../types/feeSystem';
import { GraduationCap, BookOpen, Users, AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface CourseSelectionPageProps {
  courses: CourseStat[];
  onSelectCourse: (courseCode: CourseType) => void;
  staffName: string;
}

export const CourseSelectionPage: React.FC<CourseSelectionPageProps> = ({
  courses,
  onSelectCourse,
  staffName,
}) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getCourseIcon = (code: CourseType) => {
    switch (code) {
      case 'JBT':
        return <GraduationCap className="w-8 h-8 text-emerald-400" />;
      case 'B.Ed':
        return <BookOpen className="w-8 h-8 text-blue-400" />;
      default:
        return <GraduationCap className="w-8 h-8 text-emerald-400" />;
    }
  };

  const getThemeGradient = (code: CourseType) => {
    switch (code) {
      case 'JBT':
        return 'from-emerald-900/40 via-teal-900/20 to-slate-900 hover:border-emerald-500/50 shadow-emerald-950/30';
      case 'B.Ed':
        return 'from-indigo-900/40 via-blue-900/20 to-slate-900 hover:border-indigo-500/50 shadow-indigo-950/30';
      default:
        return 'from-slate-900 to-slate-800';
    }
  };

  const getBadgeColor = (code: CourseType) => {
    switch (code) {
      case 'JBT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'B.Ed':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10">
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-indigo-300 font-medium mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Welcome back, {staffName}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Select Course Program
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            Choose a teacher training program below to access student fee records, track pending dues, analyze monthly revenue, and generate receipts.
          </p>
        </div>

        {/* 2 Featured Course Cards (JBT & B.Ed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          {courses.map((course) => {
            const collectionRate = Math.round((course.totalCollected / course.totalExpected) * 100) || 0;
            return (
              <div
                key={course.code}
                onClick={() => onSelectCourse(course.code)}
                className={`group relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer bg-gradient-to-b ${getThemeGradient(
                  course.code
                )}`}
              >
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shadow-inner">
                    {getCourseIcon(course.code)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(
                      course.code
                    )}`}
                  >
                    {course.duration}
                  </span>
                </div>

                {/* Course Name */}
                <div className="mb-6">
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{course.fullName}</p>
                </div>

                {/* Stats Breakdown Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Total Students */}
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      Total Students
                    </div>
                    <span className="text-xl font-bold text-white">{course.totalStudents}</span>
                  </div>

                  {/* Pending Fee Students */}
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      Pending Fees
                    </div>
                    <span className="text-xl font-bold text-amber-400">{course.pendingStudents} <span className="text-xs font-normal text-slate-400">students</span></span>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80 mb-6 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Total Expected Fee:</span>
                    <span className="font-semibold text-slate-200">{formatINR(course.totalExpected)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Total Pending Dues:</span>
                    <span className="font-bold text-rose-400">{formatINR(course.totalPending)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                    <span>Fee Collection Progress</span>
                    <span className="text-emerald-400">{collectionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${collectionRate}%` }}
                    />
                  </div>
                </div>

                {/* Action CTA */}
                <div className="w-full py-3 px-4 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md">
                  <span>Enter {course.title} Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Action Footer */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-200 font-semibold text-sm">All Course Fee Schedules Active</p>
              <p>Academic Session 2024-2026 & 2025-2027 fee records synced with Accounts Division.</p>
            </div>
          </div>

          <button
            onClick={() => onSelectCourse('JBT')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors shrink-0"
          >
            View All Courses Overview
          </button>
        </div>
      </div>
    </div>
  );
};
