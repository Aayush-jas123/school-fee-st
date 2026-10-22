import React from 'react';
import { motion } from 'framer-motion';
import type { CourseStat, CourseType } from '../types/feeSystem';
import { GraduationCap, BookOpen, Layers, ArrowRight, Building2, UserCheck, ChevronRight, Sparkles, LogOut } from 'lucide-react';
import { INSTITUTION_CONFIG, COURSE_METADATA_MAP } from '../config/institutionConfig';
import { PORTAL_THEME } from '../theme/portalTheme';

interface CourseSelectionPageProps {
  courses: CourseStat[];
  onSelectCourse: (courseCode: CourseType | 'ALL') => void;
  staffName: string;
  onLogout?: () => void;
}

/**
 * Dynamically resolves the appropriate Lucide icon component based on course metadata or code
 */
const resolveCourseIcon = (iconNameOrCode?: string) => {
  switch (iconNameOrCode?.toLowerCase()) {
    case 'jbt':
    case 'graduationcap':
      return GraduationCap;
    case 'b.ed':
    case 'bed':
    case 'bookopen':
      return BookOpen;
    default:
      return Layers;
  }
};

export const CourseSelectionPage: React.FC<CourseSelectionPageProps> = ({
  courses,
  onSelectCourse,
  staffName,
  onLogout,
}) => {
  const { classes } = PORTAL_THEME;

  return (
    <div className={classes.pageWrapper}>
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/3 w-[600px] h-[600px] ${classes.ambientGlowPink} rounded-full blur-[160px]`} />
        <div className={`absolute bottom-1/4 right-1/3 w-[500px] h-[500px] ${classes.ambientGlowChartreuse} rounded-full blur-[160px]`} />
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
            className={classes.pillBadge}
          >
            <Building2 className="w-4 h-4 text-[#FF1493]" />
            <span className="font-bold text-[#FF1493]">{INSTITUTION_CONFIG.name}</span>
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
                  className={classes.link}
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
            className={`text-3xl md:text-5xl ${classes.pageTitle}`}
          >
            Select Course Program
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className={`text-sm md:text-base ${classes.subtitle} max-w-xl mx-auto`}
          >
            Choose a course program below to access fee management, payment collection, and student records.
          </motion.p>
        </div>

        {/* Dynamic Course Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, idx) => {
            const IconComponent = resolveCourseIcon(course.iconName || course.code);
            const courseMeta = COURSE_METADATA_MAP[course.code];
            const programDisplayName = course.title?.endsWith('Program')
              ? course.title
              : `${course.title || course.code} Program`;
            const courseDescription = courseMeta?.description || course.fullName || course.title;
            const courseDuration = course.duration || courseMeta?.defaultDuration || '2 Years Degree';

            return (
              <motion.div
                key={course.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.15, duration: 0.5 }}
                onClick={() => onSelectCourse(course.code)}
                className={`group relative ${classes.card} ${classes.cardHover} flex flex-col justify-between space-y-8`}
              >
                {/* Header Icon & Program Badge */}
                <div className="flex items-center justify-between relative">
                  <div className={`${classes.iconBadge} transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-7 h-7 text-[#0a0a0a]" />
                  </div>

                  <span className={classes.tagBadge}>
                    {courseDuration}
                  </span>
                </div>

                {/* Program Details */}
                <div className="space-y-2 relative">
                  <h3 className={classes.cardTitle}>
                    {programDisplayName}
                  </h3>
                  <p className={`text-xs ${classes.mutedText} leading-relaxed`}>
                    {courseDescription}
                  </p>
                </div>

                {/* Action CTA Button */}
                <div className={classes.courseBtn}>
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
            className={classes.secondaryPillBtn}
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
