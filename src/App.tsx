import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CourseType, FeeStatusType, Student, CourseStat, PaymentRecord, CourseFeeRule, AuditLogEntry } from './types/feeSystem';
import { buildPeriodFeeSlots, getAllAvailableSessions } from './types/feeSystem';
import { COURSE_DEFINITIONS } from './data/mockStudents';
import { LoginPage } from './views/LoginPage';
import { CourseSelectionPage } from './views/CourseSelectionPage';
import { NavbarHeader } from './components/NavbarHeader';
import { SidebarNav } from './components/SidebarNav';
import { DashboardSummaryCards } from './components/DashboardSummaryCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { StudentTable } from './components/StudentTable';
import { StudentDetailModal } from './components/StudentDetailModal';
import { EditStudentModal } from './components/EditStudentModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { AddStudentModal } from './components/AddStudentModal';
import { FeeReminderModal } from './components/FeeReminderModal';
import { FeeStructureManager } from './components/FeeStructureManager';
import { DailyCollectionReport } from './components/DailyCollectionReport';
import { AuditLogModal } from './components/AuditLogModal';
import { PrintableReceipt } from './components/PrintableReceipt';
import { StudentReceiptModal } from './components/StudentReceiptModal';
import { ImportDataModal } from './components/ImportDataModal';
import { ReceiptCenterPanel } from './components/ReceiptCenterPanel';
import { BackupRestorePanel } from './components/BackupRestorePanel';
import { UserPlus, DollarSign, Download, RefreshCw, CheckCircle2, Upload } from 'lucide-react';

import {
  getStoredStudents,
  saveStoredStudents,
  getStoredAuditLogs,
  getStoredFeeRules,
} from './utils/storage';
import {
  fetchStudentsFromDB,
  saveStudentToDB,
  deleteStudentFromDB,
  syncAllStudentsToDB,
  fetchAuditLogsFromDB,
  addAuditLogToDB,
  fetchFeeRulesFromDB,
  saveFeeRulesToDB,
  getSupabaseReachable,
} from './services/supabaseService';
import { exportStudentsToCSV, formatCurrencyINR } from './utils/exportUtils';

export function App() {
  // Navigation & Authentication state (Persisted across refreshes)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shanti_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.isLoggedIn === true;
      }
    } catch {}
    return false;
  });

  const [staffName, setStaffName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('shanti_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.staffName) return parsed.staffName;
      }
    } catch {}
    return 'Dr. Rajesh Sharma';
  });

  const [userRole, setUserRole] = useState<'admin' | 'clerk'>(() => {
    try {
      const saved = localStorage.getItem('shanti_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role) return parsed.role;
      }
    } catch {}
    return 'admin';
  });

  const [activeView, setActiveView] = useState<'course_select' | 'dashboard'>(() => {
    try {
      const saved = localStorage.getItem('shanti_active_view');
      if (saved === 'dashboard' || saved === 'course_select') return saved;
    } catch {}
    return 'course_select';
  });

  const [currentTab, setCurrentTab] = useState('dashboard');

  // Filter & Selection state (Persisted across refreshes)
  const [selectedCourse, setSelectedCourse] = useState<CourseType | 'ALL'>(() => {
    try {
      const saved = localStorage.getItem('shanti_selected_course');
      if (saved === 'JBT' || saved === 'B.Ed' || saved === 'ALL') return saved as CourseType | 'ALL';
    } catch {}
    return 'ALL';
  });

  const [selectedSession, setSelectedSession] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('shanti_selected_session');
      if (saved) return saved;
    } catch {}
    return 'ALL';
  });

  const [selectedStatus, setSelectedStatus] = useState<FeeStatusType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Data State with Supabase / LocalStorage Persistence
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getStoredAuditLogs());
  const [feeRules, setFeeRules] = useState<CourseFeeRule[]>(() => getStoredFeeRules());

  // Modal States
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  const [reminderStudent, setReminderStudent] = useState<Student | null>(null);
  const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [receiptStudent, setReceiptStudent] = useState<Student | null>(null);
  const [printableReceiptData, setPrintableReceiptData] = useState<{ student: Student; payment: PaymentRecord } | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar-collapsed') === 'true'; } catch { return false; }
  });
  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try { localStorage.setItem('sidebar-collapsed', String(next)); } catch {}
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [receiptSearch, setReceiptSearch] = useState('');
  const [receiptFilter, setReceiptFilter] = useState<'ALL' | 'Paid' | 'Partly Paid' | 'Unpaid'>('ALL');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    try {
      return localStorage.getItem('shanti_last_sync_time') || '';
    } catch {
      return '';
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Bi-directional Cloud Synchronization
  const handleSyncCloudData = async (showNotification = true) => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      console.log('[App] Synchronizing live data with database...');
      const [fetchedStudents, fetchedLogs, fetchedRules] = await Promise.all([
        fetchStudentsFromDB(),
        fetchAuditLogsFromDB(),
        fetchFeeRulesFromDB(),
      ]);

      const isLive = getSupabaseReachable();
      setIsDbConnected(isLive);
      setStudents(fetchedStudents);
      setAuditLogs(fetchedLogs);
      setFeeRules(fetchedRules);

      const nowTime = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSyncTime(nowTime);
      try {
        localStorage.setItem('shanti_last_sync_time', nowTime);
      } catch {}

      if (showNotification) {
        if (isLive) {
          showToast(`Synced ${fetchedStudents.length} students & ${fetchedLogs.length} audit entries from Cloud Database`);
        } else {
          showToast(`Working locally: Loaded ${fetchedStudents.length} students from storage`);
        }
      }
    } catch (err) {
      console.error('[App] Synchronization error:', err);
      setIsDbConnected(false);
      if (showNotification) {
        showToast('Sync error: Using locally cached records');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Asynchronous Initial Data Fetching from Supabase Cloud / Local Database
  useEffect(() => {
    handleSyncCloudData(false);
  }, []);

  const refreshAuditLogs = async () => {
    const logs = await fetchAuditLogsFromDB();
    setAuditLogs(logs);
  };

  // Login handler
  const handleLoginSuccess = (name: string, role: 'admin' | 'clerk') => {
    setStaffName(name);
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveView('course_select');
    try {
      localStorage.setItem('shanti_auth_session', JSON.stringify({
        isLoggedIn: true,
        staffName: name,
        role,
        timestamp: Date.now(),
      }));
      localStorage.setItem('shanti_active_view', 'course_select');
    } catch (e) {
      console.warn('Failed to persist auth session:', e);
    }
  };

  // Logout handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('shanti_auth_session');
      localStorage.removeItem('shanti_active_view');
      localStorage.removeItem('shanti_selected_course');
      localStorage.removeItem('shanti_selected_session');
    } catch (e) {
      console.warn('Failed to clear auth session:', e);
    }
    setIsLoggedIn(false);
    setActiveView('course_select');
  };

  // Course Selection handler
  const handleSelectCourseFromCards = (courseCode: CourseType | 'ALL') => {
    setSelectedCourse(courseCode);
    setActiveView('dashboard');
    setCurrentTab('dashboard');
    try {
      localStorage.setItem('shanti_selected_course', courseCode);
      localStorage.setItem('shanti_active_view', 'dashboard');
    } catch (e) {
      console.warn('Failed to persist active view:', e);
    }
  };

  const handleCourseChange = (course: CourseType | 'ALL') => {
    setSelectedCourse(course);
    try {
      localStorage.setItem('shanti_selected_course', course);
    } catch {}
  };

  const handleSessionChange = (session: string) => {
    setSelectedSession(session);
    try {
      localStorage.setItem('shanti_selected_session', session);
    } catch {}
  };

  // Compute live course statistics for JBT & B.Ed
  const courseStats: CourseStat[] = useMemo(() => {
    return COURSE_DEFINITIONS.map((def) => {
      const courseStudents = students.filter((s) => s.course === def.code);
      const totalStudents = courseStudents.length;
      const pendingStudents = courseStudents.filter((s) => s.feeStatus !== 'Paid').length;
      const totalExpected = courseStudents.reduce((acc, s) => acc + s.totalFees, 0);
      const totalCollected = courseStudents.reduce((acc, s) => acc + s.paidTillNow, 0);
      const totalPending = courseStudents.reduce((acc, s) => acc + s.remainingFees, 0);

      return {
        ...def,
        totalStudents,
        pendingStudents,
        totalExpected,
        totalCollected,
        totalPending,
      };
    });
  }, [students]);

  // Filtered Students for the dashboard and table
  const dashboardStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedCourse !== 'ALL' && s.course !== selectedCourse) return false;
      if (selectedSession !== 'ALL' && s.session !== selectedSession) return false;
      return true;
    });
  }, [students, selectedCourse, selectedSession]);

  // Compute available sessions from standard institutional sessions, fee rules, and student data (sorted descending)
  const availableSessions = useMemo(() => {
    return getAllAvailableSessions(students, feeRules);
  }, [students, feeRules]);

  // Handle saving edited student record
  const handleSaveStudent = async (updatedStudent: Student) => {
    const studentWithTimestamp: Student = {
      ...updatedStudent,
      updatedAt: new Date().toISOString(),
    };
    setStudents((prev) => prev.map((s) => (s.id === studentWithTimestamp.id ? studentWithTimestamp : s)));
    await saveStudentToDB(studentWithTimestamp);
    await addAuditLogToDB({
      action: 'Student Profile Edited',
      details: `Updated fee record for ${studentWithTimestamp.name} (${studentWithTimestamp.registrationNo})`,
      staffName,
      type: 'STUDENT_EDIT',
    });
    refreshAuditLogs();
    showToast(`Updated student profile for ${studentWithTimestamp.name}`);
  };

  // Handle removing / deleting a student from course
  const handleDeleteStudent = async (studentId: string, registrationNo?: string, studentName?: string, courseName?: string) => {
    // 1. Immediately remove from local state and storage
    const currentStored = getStoredStudents();
    const updated = currentStored.filter(
      (s) => s.id !== studentId && (!registrationNo || s.registrationNo !== registrationNo)
    );
    setStudents(updated);
    saveStoredStudents(updated);

    if (editingStudent?.id === studentId) setEditingStudent(null);
    if (viewingStudent?.id === studentId) setViewingStudent(null);

    // 2. Remove from Supabase cloud database
    await deleteStudentFromDB(studentId, registrationNo);

    // 3. Record audit log
    await addAuditLogToDB({
      action: 'Student Removed from Course',
      details: `Removed ${studentName || 'Student'} (${registrationNo || studentId}) from ${courseName || 'Course'} program`,
      staffName,
      type: 'STUDENT_EDIT',
    });
    refreshAuditLogs();

    showToast(`Removed ${studentName || 'Student'} from ${courseName || 'Course'} program`);
  };

  // Handle adding new student
  const handleAddStudentSuccess = async (newStudent: Student) => {
    const studentWithTimestamp: Student = {
      ...newStudent,
      updatedAt: new Date().toISOString(),
    };
    // 1. Immediately persist to localStorage synchronously
    const currentStored = getStoredStudents();
    const updated = [studentWithTimestamp, ...currentStored.filter(s => s.id !== studentWithTimestamp.id && s.registrationNo !== studentWithTimestamp.registrationNo)];
    setStudents(updated);
    saveStoredStudents(updated);

    // 2. Adjust course and session filter so user sees the new student immediately
    if (studentWithTimestamp.course && selectedCourse !== 'ALL' && selectedCourse !== studentWithTimestamp.course) {
      setSelectedCourse(studentWithTimestamp.course);
    }
    if (studentWithTimestamp.session && selectedSession !== 'ALL' && selectedSession !== studentWithTimestamp.session) {
      setSelectedSession(studentWithTimestamp.session);
    }

    // 3. Sync to Supabase cloud database
    await saveStudentToDB(studentWithTimestamp);
    await addAuditLogToDB({
      action: 'New Admission Registered',
      details: `Enrolled ${studentWithTimestamp.name} into ${studentWithTimestamp.course} program (${studentWithTimestamp.registrationNo})`,
      staffName,
      type: 'STUDENT_ADD',
    });
    refreshAuditLogs();
    showToast(`Successfully enrolled ${studentWithTimestamp.name} in ${studentWithTimestamp.course} program!`);
  };

  // Handle payment record success
  const handlePaymentSuccess = async (updatedStudent: Student, paymentRecord: PaymentRecord) => {
    const studentWithTimestamp: Student = {
      ...updatedStudent,
      updatedAt: new Date().toISOString(),
    };
    setStudents((prev) => prev.map((s) => (s.id === studentWithTimestamp.id ? studentWithTimestamp : s)));
    await saveStudentToDB(studentWithTimestamp);
    await addAuditLogToDB({
      action: 'Fee Payment Recorded',
      details: `Collected ${formatCurrencyINR(paymentRecord.amount)} via ${paymentRecord.mode} for ${studentWithTimestamp.name} (${paymentRecord.id})`,
      staffName,
      type: 'PAYMENT',
    });
    refreshAuditLogs();
    setPrintableReceiptData({ student: studentWithTimestamp, payment: paymentRecord });
    showToast(`Payment of ${formatCurrencyINR(paymentRecord.amount)} recorded successfully!`);
  };

  // Handle reminder sent success
  const handleReminderSentSuccess = async (updatedStudent: Student, channel: string) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    await saveStudentToDB(updatedStudent);
    await addAuditLogToDB({
      action: 'Fee Reminder Dispatched',
      details: `Dispatched ${channel} overdue reminder notice to ${updatedStudent.name}`,
      staffName,
      type: 'REMINDER',
    });
    refreshAuditLogs();
    showToast(`Dispatched ${channel} fee reminder to ${updatedStudent.name}`);
  };

  // Handle updating fee rules
  const handleSaveFeeRules = async (updatedRules: CourseFeeRule[]) => {
    setFeeRules(updatedRules);
    await saveFeeRulesToDB(updatedRules);
    await addAuditLogToDB({
      action: 'Fee Structure Rules Updated',
      details: 'Modified prescribed program fee components & category scholarship rules',
      staffName,
      type: 'SETTINGS',
    });
    refreshAuditLogs();
    showToast('Updated program fee rules across institution');
  };

  // Apply fee rules to all students
  const handleApplyFeeRulesToAllStudents = async (rules: CourseFeeRule[]) => {
    const updatedStudents = students.map((student) => {
      const rule = rules.find((r) => r.course === student.course && r.session === student.session);
      if (!rule) return student;

      // Calculate seat type premium
      const seatPremium = student.seatType
        ? (rule.seatTypeFees?.find((sf) => sf.seatType === student.seatType)?.additionalFee || 0)
        : 0;

      const baseFee = rule.tuitionFee;
      const effectiveFeeBeforeDiscount = baseFee + seatPremium;
      const discount = rule.scholarshipDiscounts[student.category] || 0;
      const effectiveFee = effectiveFeeBeforeDiscount - discount;

      let feeStatus: FeeStatusType = 'Unpaid';
      if (student.paidTillNow >= effectiveFee) {
        feeStatus = 'Paid';
      } else if (student.paidTillNow > 0) {
        feeStatus = 'Partly Paid';
      }

      return {
        ...student,
        totalFees: effectiveFee,
        feeBreakdown: {
          tuitionFee: rule.tuitionFee,
          admissionFee: rule.admissionFee,
          examFee: rule.examFee,
          libraryFee: rule.libraryFee,
          developmentFee: rule.developmentFee,
          labFee: rule.labFee,
        },
        discountAmount: discount,
        scholarshipApplied: student.category !== 'General' ? `${student.category} Category` : undefined,
        remainingFees: Math.max(0, effectiveFee - student.paidTillNow),
        feeStatus,
        semesterFees: buildPeriodFeeSlots(student.course, effectiveFee, student.paidTillNow, rule.periodFees),
      };
    });

    setStudents(updatedStudents);
    saveStoredStudents(updatedStudents);
    await syncAllStudentsToDB(updatedStudents);
    await addAuditLogToDB({
      action: 'Fee Structure Applied to All Students',
      details: `Recalculated fees for ${updatedStudents.length} students based on updated fee rules`,
      staffName,
      type: 'SETTINGS',
    });
    refreshAuditLogs();
    showToast(`Applied new fee structure to ${updatedStudents.length} students`);
  };

  // Handle bulk import from PDF/Excel
  const handleImportStudents = async (importedStudents: Student[]) => {
    console.log(`[Import] Starting import of ${importedStudents.length} students`);
    // Read directly from storage to prevent any stale state closures
    const currentStored = getStoredStudents();
    const baseList = currentStored.length >= students.length ? currentStored : students;

    const existingRegNos = new Set(
      baseList.map((s) => (s.registrationNo || '').trim().toUpperCase()).filter(Boolean)
    );

    const newStudents: Student[] = [];
    const duplicates: Student[] = [];

    for (const student of importedStudents) {
      const regKey = (student.registrationNo || '').trim().toUpperCase();
      if (!regKey || existingRegNos.has(regKey)) {
        duplicates.push(student);
      } else {
        existingRegNos.add(regKey);
        newStudents.push({
          ...student,
          registrationNo: regKey,
          id: student.id || `IMP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        });
      }
    }

    const updatedStudents = [...newStudents, ...baseList];
    console.log(`[Import] Total students after import: ${updatedStudents.length} (${newStudents.length} new, ${duplicates.length} duplicates skipped)`);

    // Immediately persist to local storage & backup
    setStudents(updatedStudents);
    saveStoredStudents(updatedStudents);

    // Adjust view filters so user immediately sees the imported records
    if (newStudents.length > 0) {
      if (newStudents[0].course && selectedCourse !== 'ALL' && selectedCourse !== newStudents[0].course) {
        setSelectedCourse(newStudents[0].course);
      }
      if (newStudents[0].session && selectedSession !== 'ALL' && selectedSession !== newStudents[0].session) {
        setSelectedSession(newStudents[0].session);
      }
    }

    // Bulk sync ALL students to Supabase to ensure cloud persistence
    await syncAllStudentsToDB(updatedStudents);
    console.log(`[Import] Cloud sync complete`);

    await addAuditLogToDB({
      action: 'Bulk Student Import',
      details: `Imported ${importedStudents.length} students from file (${newStudents.length} new, ${duplicates.length} duplicates skipped)`,
      staffName,
      type: 'STUDENT_ADD',
    });
    refreshAuditLogs();
    setShowImportModal(false);
    showToast(`Successfully imported ${newStudents.length} new student records! (${duplicates.length} duplicates skipped)`);
  };

  // Compute read-only state for Overview portal mode OR clerk user
  const isReadOnlyMode = selectedCourse === 'ALL';
  const isClerkUser = userRole === 'clerk';
  const blockEditing = isReadOnlyMode || isClerkUser;

  // Render Login Page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render Course Selection Page if activeView === 'course_select'
  if (activeView === 'course_select') {
    return (
      <CourseSelectionPage
        courses={courseStats}
        onSelectCourse={handleSelectCourseFromCards}
        staffName={staffName}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased selection:bg-rose-800/10 selection:text-stone-900">
      {/* Top Header Navbar */}
      <NavbarHeader
        selectedCourse={selectedCourse}
        onCourseChange={handleCourseChange}
        selectedSession={selectedSession}
        onSessionChange={handleSessionChange}
        staffName={staffName}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        availableSessions={availableSessions}
        userRole={userRole}
        isDbLive={isDbConnected}
        onSyncCloudData={() => handleSyncCloudData(true)}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
      />

      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 bg-rose-800 text-stone-50 px-5 py-3 rounded-2xl shadow-2xl shadow-rose-800/10 flex items-center gap-3 font-semibold text-xs"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <SidebarNav
          currentTab={currentTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          onTabChange={(tab) => {
            if (tab === 'audit') setShowAuditModal(true);
            else setCurrentTab(tab);
          }}
          onOpenCourseSelect={() => {
            setActiveView('course_select');
            try { localStorage.setItem('shanti_active_view', 'course_select'); } catch {}
          }}
          selectedCourse={selectedCourse}
        />

        {/* Dashboard Content Workspace */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Top Banner & Quick Executive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-stone-200 rounded-3xl p-6 shadow-lg relative overflow-hidden backdrop-blur-sm"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-800/[0.03] via-transparent to-amber-700/[0.03] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-widest bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {blockEditing ? (isClerkUser ? 'Clerk View-Only Access' : 'Read-Only Overview Portal') : 'Institutional Fee Portal'}
                </span>
                <span className="text-stone-500">•</span>
                <span className={`text-xs font-semibold ${blockEditing ? 'text-stone-500' : 'text-stone-700'}`}>
                  {blockEditing ? (isClerkUser ? 'Viewing All Data (Editing Locked)' : 'Viewing Live Data (Editing Locked)') : `${selectedCourse} Program Selected`}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
                {blockEditing
                  ? (isClerkUser ? `${selectedCourse === 'ALL' ? 'All Programs' : selectedCourse} — View-Only Mode`
                  : 'All Programs Overview Portal')
                  : `${selectedCourse} Program Fee Management`}
              </h1>
              <p className="text-xs text-stone-500 mt-1 max-w-xl">
                {blockEditing
                  ? (isClerkUser
                    ? 'You are logged in with clerk privileges. All data is visible but editing, payments, and record modifications are restricted.'
                    : 'Viewing live statistical fee records & analytics for JBT & B.Ed programs in Read-Only mode. Access specific program portals to manage student records.')
                  : 'Track student fee collections, issue instant digital receipts, manage JBT & B.Ed program dues, and broadcast fee reminders.'}
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 relative z-10">
              {!blockEditing && (
                <>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-stone-50 text-xs font-bold shadow-lg shadow-rose-800/10 flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Upload className="w-4 h-4" /> Import Data
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowAddStudent(true)}
                    className="px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-stone-50 text-xs font-bold shadow-lg shadow-rose-800/10 flex items-center gap-1.5 cursor-pointer transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" /> New Admission
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const pending = dashboardStudents.find((s) => s.remainingFees > 0) || students[0];
                      setPaymentStudent(pending);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-stone-50 text-xs font-bold shadow-lg shadow-rose-800/10 flex items-center gap-1.5 cursor-pointer transition-all duration-200"
                  >
                    <DollarSign className="w-4 h-4" /> Collect Fee
                  </motion.button>
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => exportStudentsToCSV(dashboardStudents)}
                className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-all duration-200 flex items-center gap-1.5 hover:border-stone-300"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" /> Export CSV
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSyncCloudData(true)}
                disabled={isSyncing}
                title={lastSyncTime ? `Last synced with cloud at ${lastSyncTime}` : 'Sync live database records'}
                className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 transition-all duration-200 flex items-center gap-2 hover:border-stone-300 cursor-pointer shadow-xs disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-rose-800 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
                {isDbConnected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Database Connected" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* TAB 1: MAIN DASHBOARD */}
          {currentTab === 'dashboard' && (
            <DashboardSummaryCards students={dashboardStudents} />
          )}

          {/* TAB 2: DIRECTORY ONLY */}
          {currentTab === 'students' && (
            <StudentTable
              students={dashboardStudents}
              onViewStudent={(s) => setViewingStudent(s)}
              onEditStudent={(s) => setEditingStudent(s)}
              onRecordPayment={(s) => setPaymentStudent(s)}
              onSendReminder={(s) => setReminderStudent(s)}
              onGenerateReceipt={(s) => setReceiptStudent(s)}
              selectedCourseFilter={selectedCourse}
              onCourseFilterChange={(c) => setSelectedCourse(c)}
              selectedStatusFilter={selectedStatus}
              onStatusFilterChange={(st) => setSelectedStatus(st)}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isReadOnly={blockEditing}
            />
          )}

          {/* TAB 3: DAILY FINANCIAL COLLECTION & AUDIT REPORT */}
          {currentTab === 'daily_report' && (
            <DailyCollectionReport
              students={students}
              staffName={staffName}
              onViewReceipt={(st, pm) => setPrintableReceiptData({ student: st, payment: pm })}
            />
          )}

          {/* TAB 4: REVENUE ANALYTICS */}
          {currentTab === 'analytics' && (
            <div className="space-y-6">
              <AnalyticsCharts students={dashboardStudents} />
              <DashboardSummaryCards students={dashboardStudents} />
            </div>
          )}

          {/* TAB 5: RECEIPT GENERATOR & FEE COLLECTION CENTER */}
          {currentTab === 'receipts' && (
            <ReceiptCenterPanel
              students={students}
              receiptSearch={receiptSearch}
              setReceiptSearch={setReceiptSearch}
              receiptFilter={receiptFilter}
              setReceiptFilter={setReceiptFilter}
              onCollectFee={(s) => setPaymentStudent(s)}
              onGenerateReceipt={(s) => setReceiptStudent(s)}
              onViewReceipt={(s, p) => setPrintableReceiptData({ student: s, payment: p })}
              isReadOnly={blockEditing}
            />
          )}

          {/* TAB 6: FEE STRUCTURES */}
          {currentTab === 'structures' && (
            <FeeStructureManager rules={feeRules} sessions={availableSessions} onSaveRules={handleSaveFeeRules} onApplyToAllStudents={handleApplyFeeRulesToAllStudents} isReadOnly={blockEditing} />
          )}

          {/* TAB 7: BACKUP & RESTORE */}
          {currentTab === 'backup' && (
            <BackupRestorePanel
              students={students}
              feeRules={feeRules}
              auditLogs={auditLogs}
              onRestore={(restoredStudents, restoredRules) => {
                setStudents(restoredStudents);
                if (restoredRules.length > 0) setFeeRules(restoredRules);
                refreshAuditLogs();
                showToast(`Backup restored: ${restoredStudents.length} students loaded`);
              }}
              isReadOnly={blockEditing}
            />
          )}
        </main>
      </div>

      {/* Record Payment Modal */}
      <AnimatePresence>
      {paymentStudent && !blockEditing && (
        <RecordPaymentModal
          student={paymentStudent}
          onClose={() => setPaymentStudent(null)}
          onPaymentSuccess={handlePaymentSuccess}
          staffName={staffName}
        />
      )}
      </AnimatePresence>

      {/* Add New Student Modal */}
      {showAddStudent && !blockEditing && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAddStudent={handleAddStudentSuccess}
          availableSessions={availableSessions}
        />
      )}

      {/* Fee Reminder Modal */}
      {reminderStudent && !blockEditing && (
        <FeeReminderModal
          student={reminderStudent}
          onClose={() => setReminderStudent(null)}
          onReminderSent={handleReminderSentSuccess}
        />
      )}

      {/* View Student Details Modal */}
      {viewingStudent && (
        <StudentDetailModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
          onEdit={(s) => setEditingStudent(s)}
          onViewReceipt={(s, p) => setPrintableReceiptData({ student: s, payment: p })}
          onCollectPayment={(s) => { setViewingStudent(null); setPaymentStudent(s); }}
          onOpenReceiptCenter={(s) => { setViewingStudent(null); setReceiptStudent(s); }}
          isReadOnly={blockEditing}
        />
      )}

      {/* Edit Student Modal */}
      {editingStudent && !blockEditing && (
      <EditStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveStudent}
        onDelete={handleDeleteStudent}
        availableSessions={availableSessions}
      />
      )}

      {/* Audit Log Modal */}
      {showAuditModal && (
        <AuditLogModal
          logs={auditLogs}
          onClose={() => setShowAuditModal(false)}
          onRefresh={refreshAuditLogs}
        />
      )}

      {/* Student Receipt Generation Modal */}
      {receiptStudent && (
        <StudentReceiptModal
          student={receiptStudent}
          onClose={() => setReceiptStudent(null)}
          onGenerateReceipt={(st, pm) => {
            setReceiptStudent(null);
            setPrintableReceiptData({ student: st, payment: pm });
          }}
        />
      )}

      {/* Import Data Modal */}
      {showImportModal && !blockEditing && (
        <ImportDataModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportStudents}
          existingStudentIds={new Set(students.map(s => s.registrationNo))}
        />
      )}

      {/* Printable Receipt Overlay */}
      {printableReceiptData && (
        <PrintableReceipt
          student={printableReceiptData.student}
          payment={printableReceiptData.payment}
          onClose={() => setPrintableReceiptData(null)}
        />
      )}
    </div>
  );
}

export default App;
