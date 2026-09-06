import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CourseType, FeeStatusType, Student, CourseStat, PaymentRecord, CourseFeeRule, AuditLogEntry } from './types/feeSystem';
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
import { UserPlus, DollarSign, Download, RefreshCw, CheckCircle2, Upload } from 'lucide-react';

import {
  getStoredStudents,
  saveStoredStudents,
  getStoredAuditLogs,
  getStoredFeeRules,
  resetToDemoData,
} from './utils/storage';
import {
  fetchStudentsFromDB,
  saveStudentToDB,
  syncAllStudentsToDB,
  fetchAuditLogsFromDB,
  addAuditLogToDB,
  fetchFeeRulesFromDB,
  saveFeeRulesToDB,
} from './services/supabaseService';
import { exportStudentsToCSV, formatCurrencyINR } from './utils/exportUtils';

export function App() {
  // Navigation & Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [staffName, setStaffName] = useState('Dr. Rajesh Sharma');
  const [activeView, setActiveView] = useState<'course_select' | 'dashboard'>('course_select');
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Filter & Selection state
  const [selectedCourse, setSelectedCourse] = useState<CourseType | 'ALL'>('ALL');
  const [selectedSession, setSelectedSession] = useState<string>('ALL');
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

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [receiptSearch, setReceiptSearch] = useState('');
  const [receiptFilter, setReceiptFilter] = useState<'ALL' | 'Paid' | 'Partly Paid' | 'Unpaid'>('ALL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Asynchronous Initial Data Fetching from Supabase Cloud / Local Database
  useEffect(() => {
    async function loadCloudData() {
      try {
        console.log('[App] Loading data from database...');
        const [fetchedStudents, fetchedLogs, fetchedRules] = await Promise.all([
          fetchStudentsFromDB(),
          fetchAuditLogsFromDB(),
          fetchFeeRulesFromDB(),
        ]);
        console.log(`[App] Loaded ${fetchedStudents.length} students from database`);
        setStudents(fetchedStudents);
        setAuditLogs(fetchedLogs);
        setFeeRules(fetchedRules);
      } catch (err) {
        console.error('Error initializing database data:', err);
      }
    }
    loadCloudData();
  }, []);

  const refreshAuditLogs = async () => {
    const logs = await fetchAuditLogsFromDB();
    setAuditLogs(logs);
  };

  // Login handler
  const handleLoginSuccess = (name: string) => {
    setStaffName(name);
    setIsLoggedIn(true);
    setActiveView('course_select');
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('course_select');
  };

  // Course Selection handler
  const handleSelectCourseFromCards = (courseCode: CourseType | 'ALL') => {
    setSelectedCourse(courseCode);
    setActiveView('dashboard');
    setCurrentTab('dashboard');
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

  // Compute available sessions from student data (sorted descending)
  const availableSessions = useMemo(() => {
    const sessions = new Set(students.map((s) => s.session).filter(Boolean));
    return Array.from(sessions).sort((a, b) => b.localeCompare(a));
  }, [students]);

  // Handle saving edited student record
  const handleSaveStudent = async (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    await saveStudentToDB(updatedStudent);
    await addAuditLogToDB({
      action: 'Student Profile Edited',
      details: `Updated fee record for ${updatedStudent.name} (${updatedStudent.registrationNo})`,
      staffName,
      type: 'STUDENT_EDIT',
    });
    refreshAuditLogs();
    showToast(`Updated student profile for ${updatedStudent.name}`);
  };

  // Handle adding new student
  const handleAddStudentSuccess = async (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    await saveStudentToDB(newStudent);
    await addAuditLogToDB({
      action: 'New Admission Registered',
      details: `Enrolled ${newStudent.name} into ${newStudent.course} program (${newStudent.registrationNo})`,
      staffName,
      type: 'STUDENT_ADD',
    });
    refreshAuditLogs();
    showToast(`Successfully enrolled ${newStudent.name} in ${newStudent.course} program!`);
  };

  // Handle payment record success
  const handlePaymentSuccess = async (updatedStudent: Student, paymentRecord: PaymentRecord) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    await saveStudentToDB(updatedStudent);
    await addAuditLogToDB({
      action: 'Fee Payment Recorded',
      details: `Collected ${formatCurrencyINR(paymentRecord.amount)} via ${paymentRecord.mode} for ${updatedStudent.name}`,
      staffName,
      type: 'PAYMENT',
    });
    refreshAuditLogs();
    setPrintableReceiptData({ student: updatedStudent, payment: paymentRecord });
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
    const existingRegNos = new Set(students.map(s => s.registrationNo));
    const newStudents = importedStudents.filter(s => !existingRegNos.has(s.registrationNo));
    const duplicates = importedStudents.filter(s => existingRegNos.has(s.registrationNo));

    // Only add NEW students (not duplicates) to avoid UNIQUE constraint violation on registration_no
    const updatedStudents = [...newStudents, ...students];
    console.log(`[Import] Total students after import: ${updatedStudents.length} (${newStudents.length} new, ${duplicates.length} duplicates skipped)`);
    setStudents(updatedStudents);
    saveStoredStudents(updatedStudents);

    // Bulk sync ALL students to Supabase to ensure persistence
    await syncAllStudentsToDB(updatedStudents);
    console.log(`[Import] Sync complete`);

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

  // Reset to default demo data
  const handleResetData = async () => {
    if (confirm('Reset all student fee records and sync full Excel dataset (49 B.Ed students) to database?')) {
      resetToDemoData();
      await syncAllStudentsToDB();
      const freshStudents = await fetchStudentsFromDB();
      setStudents(freshStudents);
      setAuditLogs(getStoredAuditLogs());
      setFeeRules(getStoredFeeRules());
      showToast('Reset & synced 49 B.Ed student records to database.');
    }
  };

  // Compute read-only state for Overview portal mode
  const isReadOnlyMode = selectedCourse === 'ALL';

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
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans antialiased selection:bg-neutral-300 selection:text-neutral-900">
      {/* Top Header Navbar */}
      <NavbarHeader
        selectedCourse={selectedCourse}
        onCourseChange={(course) => setSelectedCourse(course)}
        selectedSession={selectedSession}
        onSessionChange={(session) => setSelectedSession(session)}
        staffName={staffName}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        availableSessions={availableSessions}
      />

      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-neutral-900 px-5 py-3 rounded-2xl shadow-2xl shadow-neutral-900/10 flex items-center gap-3 font-semibold text-xs"
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
          onTabChange={(tab) => {
            if (tab === 'audit') setShowAuditModal(true);
            else setCurrentTab(tab);
          }}
          onOpenCourseSelect={() => setActiveView('course_select')}
          selectedCourse={selectedCourse}
        />

        {/* Dashboard Content Workspace */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Top Banner & Quick Executive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-3xl p-6 shadow-lg relative overflow-hidden backdrop-blur-sm"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-200/[0.3] via-transparent to-neutral-200/[0.2] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-widest bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                  {isReadOnlyMode ? 'Read-Only Overview Portal' : 'Institutional Fee Portal'}
                </span>
                <span className="text-neutral-700">•</span>
                <span className={`text-xs font-semibold ${isReadOnlyMode ? 'text-neutral-700' : 'text-neutral-700'}`}>
                  {isReadOnlyMode ? 'Viewing Live Data (Editing Locked)' : `${selectedCourse} Program Selected`}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {isReadOnlyMode
                  ? 'All Programs Overview Portal'
                  : `${selectedCourse} Program Fee Management`}
              </h1>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                {isReadOnlyMode
                  ? 'Viewing live statistical fee records & analytics for JBT & B.Ed programs in Read-Only mode. Access specific program portals to manage student records.'
                  : 'Track student fee collections, issue instant digital receipts, manage JBT & B.Ed program dues, and broadcast fee reminders.'}
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 relative z-10">
              {!isReadOnlyMode && (
                <>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-lg shadow-neutral-900/10 flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Upload className="w-4 h-4" /> Import Data
                  </button>

                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-lg shadow-neutral-900/10 flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <UserPlus className="w-4 h-4" /> New Admission
                  </button>

                  <button
                    onClick={() => {
                      const pending = dashboardStudents.find((s) => s.remainingFees > 0) || students[0];
                      setPaymentStudent(pending);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-lg shadow-neutral-900/10 flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <DollarSign className="w-4 h-4" /> Collect Fee
                  </button>
                </>
              )}

              <button
                onClick={() => exportStudentsToCSV(dashboardStudents)}
                className="px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold border border-neutral-200 transition-all duration-200 flex items-center gap-1.5 hover:border-neutral-300"
              >
                <Download className="w-3.5 h-3.5 text-neutral-700" /> Export CSV
              </button>

              {!isReadOnlyMode && (
                <button
                  onClick={handleResetData}
                  title="Reset to default demo data"
                  className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
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
              isReadOnly={isReadOnlyMode}
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
              isReadOnly={isReadOnlyMode}
            />
          )}

          {/* TAB 6: FEE STRUCTURES */}
          {currentTab === 'structures' && (
            <FeeStructureManager rules={feeRules} sessions={availableSessions} onSaveRules={handleSaveFeeRules} onApplyToAllStudents={handleApplyFeeRulesToAllStudents} isReadOnly={isReadOnlyMode} />
          )}
        </main>
      </div>

      {/* Record Payment Modal */}
      <AnimatePresence>
      {paymentStudent && !isReadOnlyMode && (
        <RecordPaymentModal
          student={paymentStudent}
          onClose={() => setPaymentStudent(null)}
          onPaymentSuccess={handlePaymentSuccess}
          staffName={staffName}
        />
      )}
      </AnimatePresence>

      {/* Add New Student Modal */}
      {showAddStudent && !isReadOnlyMode && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAddStudent={handleAddStudentSuccess}
        />
      )}

      {/* Fee Reminder Modal */}
      {reminderStudent && !isReadOnlyMode && (
        <FeeReminderModal
          student={reminderStudent}
          onClose={() => setReminderStudent(null)}
          onReminderSent={handleReminderSentSuccess}
        />
      )}

      {/* View Student Details Modal */}
      <StudentDetailModal
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(s) => setEditingStudent(s)}
        onViewReceipt={(s, p) => setPrintableReceiptData({ student: s, payment: p })}
        onCollectPayment={(s) => { setViewingStudent(null); setPaymentStudent(s); }}
        onOpenReceiptCenter={(s) => { setViewingStudent(null); setReceiptStudent(s); }}
        isReadOnly={isReadOnlyMode}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveStudent}
      />

      {/* Audit Log Modal */}
      {showAuditModal && (
        <AuditLogModal logs={auditLogs} onClose={() => setShowAuditModal(false)} />
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
      {showImportModal && !isReadOnlyMode && (
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
