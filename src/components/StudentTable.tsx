import React, { useState, useMemo } from 'react';
import type { Student, CourseType, FeeStatusType } from '../types/feeSystem';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onRecordPayment?: (student: Student) => void;
  onSendReminder?: (student: Student) => void;
  selectedCourseFilter: CourseType | 'ALL';
  onCourseFilterChange: (course: CourseType | 'ALL') => void;
  selectedStatusFilter: FeeStatusType | 'ALL';
  onStatusFilterChange: (status: FeeStatusType | 'ALL') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

type SortField = 'registrationNo' | 'name' | 'rollNo' | 'totalFees' | 'paidTillNow' | 'remainingFees' | 'feeStatus' | 'nextDueDate';
type SortOrder = 'asc' | 'desc';

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onRecordPayment,
  onSendReminder,
  selectedCourseFilter,
  onCourseFilterChange,
  selectedStatusFilter,
  onStatusFilterChange,
  searchTerm,
}) => {
  const [sortField, setSortField] = useState<SortField>('registrationNo');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter students based on search, course, and status
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Course Filter
      if (selectedCourseFilter !== 'ALL' && s.course !== selectedCourseFilter) {
        return false;
      }
      // Status Filter
      if (selectedStatusFilter !== 'ALL') {
        if (selectedStatusFilter === 'Unpaid' && (s.feeStatus === 'Unpaid' || s.feeStatus === 'Overdue')) {
          // match both unpaid & overdue
        } else if (s.feeStatus !== selectedStatusFilter) {
          return false;
        }
      }
      // Search term match
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesReg = s.registrationNo.toLowerCase().includes(query);
        const matchesRoll = s.rollNo.toLowerCase().includes(query);
        const matchesPhone = s.phone.toLowerCase().includes(query);
        const matchesFather = s.fatherName.toLowerCase().includes(query);
        return matchesName || matchesReg || matchesRoll || matchesPhone || matchesFather;
      }

      return true;
    });
  }, [students, selectedCourseFilter, selectedStatusFilter, searchTerm]);

  // Sort students
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortField, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedStudents.slice(start, start + itemsPerPage);
  }, [sortedStudents, currentPage]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: FeeStatusType) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Paid
          </span>
        );
      case 'Partly Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Partly Paid
          </span>
        );
      case 'Unpaid':
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const exportCSV = () => {
    const headers = ['Registration No', 'Student Name', 'Father Name', 'Phone', 'Course', 'Semester', 'Roll No', 'Session', 'Total Fees', 'Paid', 'Remaining', 'Status', 'Next Due Date'];
    const rows = sortedStudents.map((s) => [
      s.registrationNo,
      s.name,
      s.fatherName,
      s.phone,
      s.course,
      s.semester,
      s.rollNo,
      s.session,
      s.totalFees,
      s.paidTillNow,
      s.remainingFees,
      s.feeStatus,
      s.nextDueDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `college_student_fees_${selectedCourseFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Table Top Controls & Filters */}
      <div className="p-4 md:p-6 border-b border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Student Fee Management Directory
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {sortedStudents.length} of {students.length} student records
            </p>
          </div>

          {/* Export Action & Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Filter By:
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 px-2 font-medium">Course:</span>
            {(['ALL', 'JBT', 'B.Ed'] as const).map((c) => (
              <button
                key={c}
                onClick={() => onCourseFilterChange(c)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCourseFilter === c
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {c === 'ALL' ? 'All Courses' : c}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 px-2 font-medium">Status:</span>
            {(['ALL', 'Paid', 'Partly Paid', 'Unpaid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => onStatusFilterChange(st)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  selectedStatusFilter === st
                    ? st === 'Paid'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : st === 'Partly Paid'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : st === 'Unpaid'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          {/* Table Header */}
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('registrationNo')}>
                <div className="flex items-center gap-1">
                  Reg Number <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Student Name <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4">Father / Guardian</th>
              <th className="py-3.5 px-4">Phone Number</th>
              <th className="py-3.5 px-4">Course</th>
              <th className="py-3.5 px-4">Sem / Roll</th>
              <th className="py-3.5 px-4">Session</th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('totalFees')}>
                <div className="flex items-center justify-end gap-1">
                  Total Fees <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('paidTillNow')}>
                <div className="flex items-center justify-end gap-1">
                  Paid Till Now <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('remainingFees')}>
                <div className="flex items-center justify-end gap-1">
                  Remaining <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center cursor-pointer hover:text-white" onClick={() => handleSort('feeStatus')}>
                <div className="flex items-center justify-center gap-1">
                  Fee Status <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('nextDueDate')}>
                <div className="flex items-center gap-1">
                  Next Due Date <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-400">No matching student records found</p>
                    <p className="text-xs text-slate-500">Try clearing search filters or selecting another course.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Registration No */}
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                    {student.registrationNo}
                  </td>

                  {/* Student Name */}
                  <td className="py-3.5 px-4 text-white font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <span>{student.name}</span>
                    </div>
                  </td>

                  {/* Father / Guardian */}
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {student.fatherName}
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {student.phone}
                    </span>
                  </td>

                  {/* Course */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        student.course === 'JBT'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : student.course === 'B.Ed'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {student.course}
                    </span>
                  </td>

                  {/* Sem / Roll */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-slate-200 font-semibold block">{student.semester}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{student.rollNo}</span>
                  </td>

                  {/* Academic Session */}
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {student.session}
                  </td>

                  {/* Total Fees */}
                  <td className="py-3.5 px-4 text-right font-bold text-slate-200 whitespace-nowrap">
                    {formatINR(student.totalFees)}
                  </td>

                  {/* Paid Till Now */}
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400 whitespace-nowrap">
                    {formatINR(student.paidTillNow)}
                  </td>

                  {/* Remaining Fees */}
                  <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                    <span className={student.remainingFees > 0 ? 'text-rose-400' : 'text-slate-400'}>
                      {formatINR(student.remainingFees)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(student.feeStatus)}
                  </td>

                  {/* Next Due Date */}
                  <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {student.nextDueDate}
                    </span>
                  </td>

                  {/* Action Column */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {onRecordPayment && student.remainingFees > 0 && (
                        <button
                          onClick={() => onRecordPayment(student)}
                          title="Collect Fee Payment"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                        >
                          Pay
                        </button>
                      )}
                      {onSendReminder && student.remainingFees > 0 && (
                        <button
                          onClick={() => onSendReminder(student)}
                          title="Send Fee Reminder / Notice"
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/30 transition-all cursor-pointer"
                        >
                          Notice
                        </button>
                      )}
                      <button
                        onClick={() => onViewStudent(student)}
                        title="View Full Profile & Fee Details"
                        className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditStudent(student)}
                        title="Edit Fee Record"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
          <strong className="text-white">{Math.min(currentPage * itemsPerPage, sortedStudents.length)}</strong> of{' '}
          <strong className="text-white">{sortedStudents.length}</strong> records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
