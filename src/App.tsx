import { useState, useMemo } from 'react';
import type { CourseType, FeeStatusType, Student, CourseStat } from './types/feeSystem';
import { INITIAL_STUDENTS, COURSE_DEFINITIONS } from './data/mockStudents';
import { LoginPage } from './views/LoginPage';
import { CourseSelectionPage } from './views/CourseSelectionPage';
import { NavbarHeader } from './components/NavbarHeader';
import { SidebarNav } from './components/SidebarNav';
import { DashboardSummaryCards } from './components/DashboardSummaryCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { StudentTable } from './components/StudentTable';
import { StudentDetailModal } from './components/StudentDetailModal';
import { EditStudentModal } from './components/EditStudentModal';
import { Receipt, Printer } from 'lucide-react';

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

  // Data state
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  // Modal state
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

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
  const handleSelectCourseFromCards = (courseCode: CourseType) => {
    setSelectedCourse(courseCode);
    setActiveView('dashboard');
    setCurrentTab('dashboard');
  };

  // Compute live course statistics
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

  // Handle saving edited student record in prototype state
  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  // Format INR utility
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

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

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <SidebarNav
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onOpenCourseSelect={() => setActiveView('course_select')}
          selectedCourse={selectedCourse}
        />

        {/* Dashboard Content Workspace */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Breadcrumb / Program Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  College Administration Portal
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-medium text-slate-400">
                  {selectedCourse === 'ALL' ? 'All Course Programs' : `${selectedCourse} Program`}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {selectedCourse === 'ALL'
                  ? 'Institutional Fee Management Dashboard'
                  : `${selectedCourse} Course Fee Management`}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('course_select')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Change Course Program
              </button>
            </div>
          </div>

          {/* TAB 1: MAIN DASHBOARD */}
          {currentTab === 'dashboard' && (
            <>
              {/* 7 Summary Metrics Cards */}
              <DashboardSummaryCards students={dashboardStudents} />

              {/* Recharts Analytics Section */}
              <AnalyticsCharts students={dashboardStudents} />

              {/* Student Management Data Table */}
              <StudentTable
                students={students}
                onViewStudent={(s) => setViewingStudent(s)}
                onEditStudent={(s) => setEditingStudent(s)}
                selectedCourseFilter={selectedCourse}
                onCourseFilterChange={(c) => setSelectedCourse(c)}
                selectedStatusFilter={selectedStatus}
                onStatusFilterChange={(st) => setSelectedStatus(st)}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </>
          )}

          {/* TAB 2: DIRECTORY ONLY */}
          {currentTab === 'students' && (
            <StudentTable
              students={students}
              onViewStudent={(s) => setViewingStudent(s)}
              onEditStudent={(s) => setEditingStudent(s)}
              selectedCourseFilter={selectedCourse}
              onCourseFilterChange={(c) => setSelectedCourse(c)}
              selectedStatusFilter={selectedStatus}
              onStatusFilterChange={(st) => setSelectedStatus(st)}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Fee Receipt Generator</h3>
                  <p className="text-xs text-slate-400">Generate and print official fee payment receipts for staff records</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {students.slice(0, 6).map((st) => (
                  <div key={st.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{st.name}</p>
                      <p className="text-slate-400 font-mono">{st.registrationNo} ({st.course})</p>
                      <p className="text-emerald-400 font-bold mt-1">Paid: {formatINR(st.paidTillNow)}</p>
                    </div>
                    <button
                      onClick={() => setViewingStudent(st)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Receipt
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FEE STRUCTURES */}
          {currentTab === 'structures' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courseStats.map((c) => (
                <div key={c.code} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xl font-bold text-white">{c.title} Structure</h3>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold">{c.duration}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Annual Total Fee:</span>
                      <strong className="text-white">{formatINR(c.code === 'JBT' ? 65000 : c.code === 'B.Ed' ? 78000 : 58000)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Tuition Fee Component:</span>
                      <span>{formatINR(c.code === 'JBT' ? 45000 : c.code === 'B.Ed' ? 55000 : 40000)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Admission Charges:</span>
                      <span>{formatINR(c.code === 'JBT' ? 5000 : c.code === 'B.Ed' ? 6000 : 4000)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Exam & Library:</span>
                      <span>{formatINR(c.code === 'JBT' ? 7000 : c.code === 'B.Ed' ? 9000 : 7000)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectCourseFromCards(c.code)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                  >
                    View {c.code} Students
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* View Student Modal */}
      <StudentDetailModal
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(s) => setEditingStudent(s)}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveStudent}
      />
    </div>
  );
}

export default App;
