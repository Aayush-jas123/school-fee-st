import React from 'react';
import type { CourseStat, CourseType } from '../types/feeSystem';
import { GraduationCap, BookOpen, ArrowRight, Building2, UserCheck, ChevronRight } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 space-y-10">
        {/* Header Branding & Welcome */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium shadow-md">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Shanti College of Education</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> {staffName}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Select Course Program
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto font-medium">
            Choose a course program below to access fee management, payment collection, and student records.
          </p>
        </div>

        {/* 2 Clean Course Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => {
            const isJBT = course.code === 'JBT';
            return (
              <div
                key={course.code}
                onClick={() => onSelectCourse(course.code)}
                className={`group relative bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between space-y-8 ${
                  isJBT
                    ? 'hover:shadow-emerald-950/40 hover:border-emerald-500/50'
                    : 'hover:shadow-indigo-950/40 hover:border-indigo-500/50'
                }`}
              >
                {/* Header Icon & Program Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 ${
                      isJBT
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                    }`}
                  >
                    {isJBT ? <GraduationCap className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isJBT
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    }`}
                  >
                    {course.duration}
                  </span>
                </div>

                {/* Program Details */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                    {course.title} Program
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {isJBT
                      ? 'Junior Basic Training (Primary Teacher Education)'
                      : 'Bachelor of Education (Secondary Teacher Education)'}
                  </p>
                </div>

                {/* Program Summary Pill */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Prescribed Annual Fee:</span>
                  <strong className="text-white font-bold text-sm">
                    {isJBT ? '₹65,000 / Year' : '₹78,000 / Year'}
                  </strong>
                </div>

                {/* Action CTA Button */}
                <div
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isJBT
                      ? 'bg-slate-800 group-hover:bg-emerald-600 text-slate-200 group-hover:text-white shadow-emerald-950/40'
                      : 'bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white shadow-indigo-950/40'
                  }`}
                >
                  <span>Access {course.title} Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Overview Option Footer */}
        <div className="text-center pt-4">
          <button
            onClick={() => onSelectCourse('JBT')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-md"
          >
            <span>View All Programs Overview</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
