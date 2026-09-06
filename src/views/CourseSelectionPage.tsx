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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-4 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-neutral-200/[0.3] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-neutral-200/[0.2] rounded-full blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200 text-xs text-neutral-500 font-medium shadow-lg backdrop-blur-sm"
          >
            <Building2 className="w-4 h-4 text-neutral-700" />
            <span className="font-bold text-neutral-900">Shanti College of Education</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-700 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> {staffName}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900"
          >
            Select Course Program
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto font-medium"
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
                className="group relative bg-neutral-50 backdrop-blur-sm border border-neutral-200 hover:border-neutral-300 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between space-y-8 card-premium"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  isJBT
                    ? 'bg-neutral-50'
                    : 'bg-neutral-50'
                }`} />

                {/* Header Icon & Program Badge */}
                <div className="flex items-center justify-between relative">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-300 group-hover:scale-110 ${
                      isJBT
                        ? 'bg-neutral-100 border-neutral-200 text-neutral-700 group-hover:shadow-neutral-900/10'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-700 group-hover:shadow-neutral-900/10'
                    }`}
                  >
                    {isJBT ? <GraduationCap className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isJBT
                        ? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {course.duration}
                  </span>
                </div>

                {/* Program Details */}
                <div className="space-y-2 relative">
                  <h3 className="text-2xl font-extrabold text-neutral-900 group-hover:text-neutral-700 transition-colors duration-300">
                    {course.title} Program
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                    {isJBT
                      ? 'Junior Basic Training (Primary Teacher Education)'
                      : 'Bachelor of Education (Secondary Teacher Education)'}
                  </p>
                </div>

                {/* Action CTA Button */}
                <div
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                    isJBT
                      ? 'bg-neutral-900 group-hover:bg-neutral-800 text-white shadow-neutral-900/20'
                      : 'bg-neutral-900 group-hover:bg-neutral-800 text-white shadow-neutral-900/20'
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 hover:text-neutral-900 text-xs font-semibold transition-all cursor-pointer shadow-md hover:shadow-neutral-900/10 hover:border-neutral-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View All Programs Overview (Read-Only)</span>
            <ChevronRight className="w-4 h-4 text-neutral-700" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
