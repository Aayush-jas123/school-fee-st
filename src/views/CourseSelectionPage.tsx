import React from 'react';
import { motion } from 'framer-motion';
import type { CourseStat, CourseType } from '../types/feeSystem';
import { GraduationCap, BookOpen, ArrowRight, Building2, UserCheck, ChevronRight, Sparkles, LogOut } from 'lucide-react';

interface CourseSelectionPageProps {
  courses: CourseStat[];
  onSelectCourse: (courseCode: CourseType | 'ALL') => void;
  staffName: string;
  onLogout?: () => void;
}

export const CourseSelectionPage: React.FC<CourseSelectionPageProps> = ({
  courses,
  onSelectCourse,
  staffName,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#7FFF00] p-4 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#FF1493]/[0.08] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[#7FFF00]/[0.05] rounded-full blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #7FFF00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a] border border-[#FF1493] text-xs font-medium shadow-[0_0_20px_rgba(255,20,147,0.25)] backdrop-blur-sm"
          >
            <Building2 className="w-4 h-4 text-[#FF1493]" />
            <span className="font-bold text-[#FF1493]">Shanti College of Education</span>
            <span className="text-[#FF1493]/50">•</span>
            <span className="text-[#7FFF00] flex items-center gap-1 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-[#7FFF00]" /> {staffName}
            </span>
            {onLogout && (
              <>
                <span className="text-[#FF1493]/50">•</span>
                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="text-[#7FFF00] hover:text-[#FF1493] transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <LogOut className="w-3 h-3 text-[#7FFF00]" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#FF1493] drop-shadow-[0_0_25px_rgba(255,20,147,0.25)]"
          >
            Select Course Program
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-sm md:text-base text-[#7FFF00] max-w-xl mx-auto font-medium"
          >
            Choose a course program below to access fee management, payment collection, and student records.
          </motion.p>
        </div>

        {/* Course Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => {
            const isJBT = course.code === 'JBT';
            const programDisplayName = course.title.endsWith('Program') ? course.title : `${course.title} Program`;
            return (
              <motion.div
                key={course.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
                onClick={() => onSelectCourse(course.code)}
                className="group relative bg-[#0a0a0a] border-2 border-[#FF1493] hover:border-[#7FFF00] rounded-3xl p-8 shadow-[0_0_35px_rgba(255,20,147,0.25)] hover:shadow-[0_0_55px_rgba(255,20,147,0.45)] transition-all duration-500 cursor-pointer flex flex-col justify-between space-y-8"
              >
                {/* Header Icon & Program Badge */}
                <div className="flex items-center justify-between relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#FF1493] text-[#0a0a0a] shadow-lg shadow-[#FF1493]/30 transition-all duration-300 group-hover:scale-110">
                    {isJBT ? <GraduationCap className="w-7 h-7 text-[#0a0a0a]" /> : <BookOpen className="w-7 h-7 text-[#0a0a0a]" />}
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#000000] text-[#7FFF00] border border-[#FF1493]/70">
                    {course.duration}
                  </span>
                </div>

                {/* Program Details */}
                <div className="space-y-2 relative">
                  <h3 className="text-2xl font-extrabold text-[#FF1493] group-hover:text-[#7FFF00] transition-colors duration-300">
                    {programDisplayName}
                  </h3>
                  <p className="text-xs text-[#7FFF00]/90 font-medium leading-relaxed">
                    {isJBT
                      ? 'Junior Basic Training (Primary Teacher Education)'
                      : 'Bachelor of Education (Secondary Teacher Education)'}
                  </p>
                </div>

                {/* Action CTA Button */}
                <div className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg bg-[#FF1493] hover:bg-[#FF1493]/90 text-[#0a0a0a] shadow-[#FF1493]/30 active:scale-[0.99]">
                  <span>Access {programDisplayName} Portal</span>
                  <ArrowRight className="w-4 h-4 text-[#0a0a0a] group-hover:translate-x-1 transition-transform duration-300" />
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0a0a0a] hover:bg-[#000000] border-2 border-[#FF1493] hover:border-[#7FFF00] text-[#7FFF00] hover:text-[#FF1493] text-xs font-bold transition-all cursor-pointer shadow-[0_0_25px_rgba(255,20,147,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7FFF00]" />
            <span>View All Programs Overview (Read-Only)</span>
            <ChevronRight className="w-4 h-4 text-[#7FFF00]" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
