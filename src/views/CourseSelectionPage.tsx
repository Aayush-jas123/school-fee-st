import React from 'react';
import { motion } from 'framer-motion';
import type { CourseStat, CourseType } from '../types/feeSystem';
import { GraduationCap, BookOpen, ArrowRight, Building2, UserCheck, ChevronRight, Sparkles } from 'lucide-react';

interface CourseSelectionPageProps {
  courses: CourseStat[];
  onSelectCourse: (courseCode: CourseType | 'ALL') => void;
  staffName: string;
}

export const CourseSelectionPage: React.FC<CourseSelectionPageProps> = ({
  courses,
  onSelectCourse,
  staffName,
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-violet-600/[0.06] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-blue-600/[0.04] rounded-full blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-4xl relative z-10 space-y-10"
      >
        {/* Header Branding & Welcome */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/60 text-xs text-zinc-400 font-medium shadow-lg backdrop-blur-sm"
          >
            <Building2 className="w-4 h-4 text-violet-400" />
            <span className="font-bold text-white">Shanti College of Education</span>
            <span className="text-zinc-700">•</span>
            <span className="text-violet-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> {staffName}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white"
          >
            Select Course Program
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-sm md:text-base text-zinc-500 max-w-xl mx-auto font-medium"
          >
            Choose a course program below to access fee management, payment collection, and student records.
          </motion.p>
        </div>

        {/* Course Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => {
            const isJBT = course.code === 'JBT';
            return (
              <motion.div
                key={course.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
                onClick={() => onSelectCourse(course.code)}
                className="group relative bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 hover:border-violet-500/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-violet-500/5 transition-all duration-500 cursor-pointer flex flex-col justify-between space-y-8 card-premium"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  isJBT
                    ? 'bg-gradient-to-br from-emerald-500/[0.03] to-transparent'
                    : 'bg-gradient-to-br from-violet-500/[0.03] to-transparent'
                }`} />

                {/* Header Icon & Program Badge */}
                <div className="flex items-center justify-between relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-300 group-hover:scale-110 ${
                      isJBT
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:shadow-emerald-500/10'
                        : 'bg-violet-500/10 border-violet-500/20 text-violet-400 group-hover:shadow-violet-500/10'
                    }`}
                  >
                    {isJBT ? <GraduationCap className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isJBT
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    }`}
                  >
                    {course.duration}
                  </span>
                </div>

                {/* Program Details */}
                <div className="space-y-2 relative">
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-violet-200 transition-colors duration-300">
                    {course.title} Program
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    {isJBT
                      ? 'Junior Basic Training (Primary Teacher Education)'
                      : 'Bachelor of Education (Secondary Teacher Education)'}
                  </p>
                </div>

                {/* Action CTA Button */}
                <div
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                    isJBT
                      ? 'bg-zinc-800/80 group-hover:bg-emerald-600 text-zinc-300 group-hover:text-white shadow-emerald-950/20'
                      : 'bg-zinc-800/80 group-hover:bg-violet-600 text-zinc-300 group-hover:text-white shadow-violet-950/20'
                  }`}
                >
                  <span>Access {course.title} Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overview Option Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-center pt-4"
        >
          <button
            onClick={() => onSelectCourse('ALL')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-950/30 hover:bg-violet-900/30 border border-violet-500/20 text-violet-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-md hover:shadow-violet-500/10 hover:border-violet-500/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View All Programs Overview (Read-Only)</span>
            <ChevronRight className="w-4 h-4 text-violet-400" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
