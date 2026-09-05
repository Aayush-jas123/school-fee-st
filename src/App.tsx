import { useState, useMemo, useEffect } from 'react';
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
import { AuditLogModal } from './components/AuditLogModal';
import { PrintableReceipt } from './components/PrintableReceipt';
import { Receipt, Printer, UserPlus, DollarSign, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

import {
  getStoredStudents,
  saveStoredStudents,
  getStoredAuditLogs,
  addAuditLog,
  getStoredFeeRules,
  saveFeeRules,
  resetToDemoData,
} from './utils/storage';
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

  // Data State with LocalStorage Persistence
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
  const [printableReceiptData, setPrintableReceiptData] = useState<{ student: Student; payment: PaymentRecord } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync students to localStorage whenever updated
  useEffect(() => {
    saveStoredStudents(students);
  }, [students]);

  // Sync audit logs
  const refreshAuditLogs = () => {
    setAuditLogs(getStoredAuditLogs());
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

  // Handle saving edited student record
  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    addAuditLog({
      action: 'Student Profile Edited',
      details: `Updated fee record for ${updatedStudent.name} (${updatedStudent.registrationNo})`,
      staffName,
      type: 'STUDENT_EDIT',
    });
    refreshAuditLogs();
    showToast(`Updated student profile for ${updatedStudent.name}`);
  };

  // Handle adding new student
  const handleAddStudentSuccess = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    addAuditLog({
      action: 'New Admission Registered',
      details: `Enrolled ${newStudent.name} into ${newStudent.course} program (${newStudent.registrationNo})`,
      staffName,
      type: 'STUDENT_ADD',
    });
    refreshAuditLogs();
    showToast(`Successfully enrolled ${newStudent.name} in ${newStudent.course} program!`);
  };

  // Handle payment record success
  const handlePaymentSuccess = (updatedStudent: Student, paymentRecord: PaymentRecord) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    addAuditLog({
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
  const handleReminderSentSuccess = (updatedStudent: Student, channel: string) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    addAuditLog({
      action: 'Fee Reminder Dispatched',
      details: `Dispatched ${channel} overdue reminder notice to ${updatedStudent.name}`,
      staffName,
      type: 'REMINDER',
    });
    refreshAuditLogs();
    showToast(`Dispatched ${channel} fee reminder to ${updatedStudent.name}`);
  };

  // Handle updating fee rules
  const handleSaveFeeRules = (updatedRules: CourseFeeRule[]) => {
    setFeeRules(updatedRules);
    saveFeeRules(updatedRules);
    addAuditLog({
      action: 'Fee Structure Rules Updated',
      details: 'Modified prescribed program fee components & category scholarship rules',
      staffName,
      type: 'SETTINGS',
    });
    refreshAuditLogs();
    showToast('Updated program fee rules across institution');
  };

  // Reset to default demo data
  const handleResetData = () => {
    if (confirm('Reset all student fee records and logs back to default institutional demo data?')) {
      resetToDemoData();
      setStudents(getStoredStudents());
      setAuditLogs(getStoredAuditLogs());
      setFeeRules(getStoredFeeRules());
      showToast('Reset system to default institutional demo data.');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
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
      />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-semibold text-xs animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  {isReadOnlyMode ? 'Read-Only Overview Portal' : 'Institutional Fee Portal'}
                </span>
                <span className="text-slate-600">•</span>
                <span className={`text-xs font-semibold ${isReadOnlyMode ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isReadOnlyMode ? 'Viewing Live Data (Editing Locked)' : `${selectedCourse} Program Selected`}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {isReadOnlyMode
                  ? 'All Programs Overview Portal'
                  : `${selectedCourse} Program Fee Management`}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
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
                    onClick={() => setShowAddStudent(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" /> New Admission
                  </button>

                  <button
                    onClick={() => {
                      const pending = dashboardStudents.find((s) => s.remainingFees > 0) || students[0];
                      setPaymentStudent(pending);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4" /> Collect Fee
                  </button>
                </>
              )}

              <button
                onClick={() => exportStudentsToCSV(dashboardStudents)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" /> Export CSV
              </button>

              {!isReadOnlyMode && (
                <button
                  onClick={handleResetData}
                  title="Reset to default demo data"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: MAIN DASHBOARD */}
          {currentTab === 'dashboard' && (
            <DashboardSummaryCards students={dashboardStudents} />
          )}

          {/* TAB 2: DIRECTORY ONLY */}
          {currentTab === 'students' && (
            <StudentTable
              students={students}
              onViewStudent={(s) => setViewingStudent(s)}
              onEditStudent={(s) => setEditingStudent(s)}
              onRecordPayment={(s) => setPaymentStudent(s)}
              onSendReminder={(s) => setReminderStudent(s)}
              selectedCourseFilter={selectedCourse}
              onCourseFilterChange={(c) => setSelectedCourse(c)}
              selectedStatusFilter={selectedStatus}
              onStatusFilterChange={(st) => setSelectedStatus(st)}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isReadOnly={isReadOnlyMode}
            />
          )}

          {/* TAB 3: REVENUE ANALYTICS */}
          {currentTab === 'analytics' && (
            <div className="space-y-6">
              <AnalyticsCharts students={dashboardStudents} />
              <DashboardSummaryCards students={dashboardStudents} />
            </div>
          )}

          {/* TAB 4: RECEIPT GENERATOR */}
          {currentTab === 'receipts' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Official Fee Receipt Generator</h3>
                    <p className="text-xs text-slate-400">Generate, view, and print official fee payment receipts for JBT & B.Ed students</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {students.slice(0, 8).map((st) => {
                  const lastPayment = st.paymentHistory[0] || {
                    id: `RCP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                    amount: st.paidTillNow,
                    date: '2024-07-15',
                    mode: 'UPI' as const,
                    transactionRef: 'UPI/409182736',
                    remark: 'Tuition Fee Installment',
                  };
                  return (
                    <div key={st.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                      <div>
                        <p className="font-bold text-white text-sm">{st.name}</p>
                        <p className="text-slate-400 font-mono text-[11px]">{st.registrationNo} ({st.course})</p>
                        <p className="text-emerald-400 font-bold mt-1">Paid So Far: {formatCurrencyINR(st.paidTillNow)}</p>
                      </div>
                      <button
                        onClick={() => setPrintableReceiptData({ student: st, payment: lastPayment })}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                      >
                        <Printer className="w-3.5 h-3.5" /> View Receipt
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: FEE STRUCTURES */}
          {currentTab === 'structures' && (
            <FeeStructureManager rules={feeRules} onSaveRules={handleSaveFeeRules} isReadOnly={isReadOnlyMode} />
          )}
        </main>
      </div>

      {/* Record Payment Modal */}
      {paymentStudent && !isReadOnlyMode && (
        <RecordPaymentModal
          student={paymentStudent}
          onClose={() => setPaymentStudent(null)}
          onPaymentSuccess={handlePaymentSuccess}
          staffName={staffName}
        />
      )}

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
