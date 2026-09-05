import React, { useState, useMemo } from 'react';
import type { Student, CourseType, FeeStatusType, SemesterFeeSlot } from '../types/feeSystem';
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
  ChevronLeft,
  ChevronRight,
  Download,
  MessageSquare,
  Check,
  X,
  Receipt,
} from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onRecordPayment?: (student: Student) => void;
  onSendReminder?: (student: Student) => void;
  onGenerateReceipt?: (student: Student) => void;
  selectedCourseFilter: CourseType | 'ALL';
  onCourseFilterChange: (course: CourseType | 'ALL') => void;
  selectedStatusFilter: FeeStatusType | 'ALL';
  onStatusFilterChange: (status: FeeStatusType | 'ALL') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isReadOnly?: boolean;
}

type SortField = 'registrationNo' | 'name' | 'rollNo' | 'totalFees' | 'paidTillNow' | 'remainingFees' | 'feeStatus' | 'nextDueDate';
type SortOrder = 'asc' | 'desc';

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onRecordPayment,
  onSendReminder,
  onGenerateReceipt,
  selectedCourseFilter,
  onCourseFilterChange,
  selectedStatusFilter,
  onStatusFilterChange,
  searchTerm,
  onSearchChange,
  isReadOnly = false,
}) => {
  const [sortField, setSortField] = useState<SortField>('registrationNo');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Inline Roll Number Edit State
  const [editingRollId, setEditingRollId] = useState<string | null>(null);
  const [tempRollVal, setTempRollVal] = useState<string>('');

  // Inline Total Fee Edit State
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [tempFeeVal, setTempFeeVal] = useState<number>(0);

  // Inline Paid Amount Edit State
  const [editingPaidId, setEditingPaidId] = useState<string | null>(null);
  const [tempPaidVal, setTempPaidVal] = useState<number>(0);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSaveRollNumber = (student: Student) => {
    onEditStudent({ ...student, rollNo: tempRollVal });
    setEditingRollId(null);
  };

  const handleSaveTotalFee = (student: Student) => {
    const total = Number(tempFeeVal);
    const paid = student.paidTillNow;
    const remaining = Math.max(0, total - paid);
    const semFee = total > 0 ? Math.round(total / 4) : 0;
    const updatedSemesterFees: SemesterFeeSlot[] = [
      { semester: 'Sem 1', year: '1st Year', totalFee: semFee, paidAmount: Math.min(paid, semFee), remainingAmount: Math.max(0, semFee - paid), status: semFee > 0 && paid >= semFee ? 'Paid' : paid > 0 ? 'Partly Paid' : 'Unpaid', dueDate: '2026-10-15' },
      { semester: 'Sem 2', year: '1st Year', totalFee: semFee, paidAmount: Math.max(0, Math.min(paid - semFee, semFee)), remainingAmount: semFee > 0 ? Math.max(0, semFee - Math.max(0, paid - semFee)) : 0, status: paid >= semFee * 2 && semFee > 0 ? 'Paid' : paid > semFee ? 'Partly Paid' : 'Unpaid', dueDate: '2027-03-15' },
      { semester: 'Sem 3', year: '2nd Year', totalFee: semFee, paidAmount: Math.max(0, Math.min(paid - semFee * 2, semFee)), remainingAmount: semFee > 0 ? Math.max(0, semFee - Math.max(0, paid - semFee * 2)) : 0, status: paid >= semFee * 3 && semFee > 0 ? 'Paid' : paid > semFee * 2 ? 'Partly Paid' : 'Unpaid', dueDate: '2027-10-15' },
      { semester: 'Sem 4', year: '2nd Year', totalFee: semFee, paidAmount: Math.max(0, paid - semFee * 3), remainingAmount: semFee > 0 ? Math.max(0, semFee - Math.max(0, paid - semFee * 3)) : 0, status: paid >= semFee * 4 && semFee > 0 ? 'Paid' : paid > semFee * 3 ? 'Partly Paid' : 'Unpaid', dueDate: '2028-03-15' },
    ];

    onEditStudent({
      ...student,
      totalFees: total,
      remainingFees: remaining,
      feeStatus: total > 0 && paid >= total ? 'Paid' : paid > 0 ? 'Partly Paid' : 'Unpaid',
      semesterFees: updatedSemesterFees,
    });
    setEditingFeeId(null);
  };

  const handleSavePaidAmount = (student: Student) => {
    const newPaid = Number(tempPaidVal);
    const total = student.totalFees;
    const remaining = Math.max(0, total - newPaid);
    const semFee = total > 0 ? Math.round(total / 4) : 0;
    const updatedSemesterFees: SemesterFeeSlot[] = [
      { semester: 'Sem 1', year: '1st Year', totalFee: semFee, paidAmount: Math.min(newPaid, semFee), remainingAmount: Math.max(0, semFee - newPaid), status: semFee > 0 && newPaid >= semFee ? 'Paid' : newPaid > 0 ? 'Partly Paid' : 'Unpaid', dueDate: '2026-10-15' },
      { semester: 'Sem 2', year: '1st Year', totalFee: semFee, paidAmount: Math.max(0, Math.min(newPaid - semFee, semFee)), remainingAmount: semFee > 0 ? Math.max(0, semFee - Math.max(0, newPaid - semFee)) : 0, status: newPaid >= semFee * 2 && semFee > 0 ? 'Paid' : newPaid > semFee ? 'Partly Paid' : 'Unpaid', dueDate: '2027-03-15' },
      { semester: 'Sem 3', year: '2nd Year', totalFee: semFee, paidAmount: Math.max(0, Math.min(newPaid - semFee * 2, semFee)), remainingAmount: semFee > 0 ? Math.max(0, semFee - Math.max(0, newPaid - semFee * 2)) : 0, status: newPaid >= semFee * 3 && semFee > 0 ? 'Paid' : newPaid > semFee * 2 ? 'Partly Paid' : 'Unpaid', dueDate: '2027-10-15' },
      { semester: 'Sem 4', year: '2nd Year', totalFee: semFee, paidAmount: Math.max(0, newPaid - semFee * 3), remainingAmount: semFee > 0 ? Math.max(0, semFee - Math.max(0, newPaid - semFee * 3)) : 0, status: newPaid >= semFee * 4 && semFee > 0 ? 'Paid' : newPaid > semFee * 3 ? 'Partly Paid' : 'Unpaid', dueDate: '2028-03-15' },
    ];

    let newStatus: FeeStatusType = 'Unpaid';
    if (total > 0 && newPaid >= total) newStatus = 'Paid';
    else if (newPaid > 0) newStatus = 'Partly Paid';

    onEditStudent({
      ...student,
      paidTillNow: newPaid,
      remainingFees: remaining,
      feeStatus: newStatus,
      semesterFees: updatedSemesterFees,
    });
    setEditingPaidId(null);
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
      if (searchTerm && searchTerm.trim() !== '') {
        const query = searchTerm.trim().toLowerCase();
        const matchesName = (s.name || '').toLowerCase().includes(query);
        const matchesReg = (s.registrationNo || '').toLowerCase().includes(query);
        const matchesRoll = (s.rollNo || '').toLowerCase().includes(query);
        const matchesPhone = (s.phone || '').toLowerCase().includes(query);
        const matchesFather = (s.fatherName || '').toLowerCase().includes(query);
        const matchesStream = (s.stream || '').toLowerCase().includes(query);
        const matchesCategory = (s.category || '').toLowerCase().includes(query);
        const matchesSem = (s.currentSemester || '').toLowerCase().includes(query);
        return matchesName || matchesReg || matchesRoll || matchesPhone || matchesFather || matchesStream || matchesCategory || matchesSem;
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
    const headers = ['Registration No', 'Student Name', 'Father Name', 'Phone', 'WhatsApp', 'Course', 'Stream', 'Current Sem', 'Roll No', 'Session', 'Total Fees', 'Paid', 'Remaining', 'Status', 'Next Due Date'];
    const rows = sortedStudents.map((s) => [
      s.registrationNo,
      s.name,
      s.fatherName,
      s.phone,
      s.whatsappNo || s.phone,
      s.course,
      s.stream || 'Arts',
      s.currentSemester || 'Sem 1',
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
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Table Top Controls & Filters */}
      <div className="p-4 md:p-6 border-b border-zinc-800/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Student Fee Management Directory
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Showing {sortedStudents.length} of {students.length} student records
            </p>
          </div>

          {/* Search Bar & Export Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Direct Table Search Bar */}
            <div className="relative flex-1 md:w-64 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Name, Reg No, Roll No, Sem..."
                className="w-full pl-9 pr-8 py-2 bg-zinc-950/60 border border-zinc-800/50 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all shadow-inner font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5 rounded-full"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 text-xs font-semibold text-zinc-200 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800/40/60">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5 text-violet-400" /> Filter By:
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl border border-zinc-700/50 text-xs">
            <span className="text-zinc-500 px-2 font-medium">Course:</span>
            {(['ALL', 'JBT', 'B.Ed'] as const).map((c) => (
              <button
                key={c}
                onClick={() => onCourseFilterChange(c)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedCourseFilter === c
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60/50'
                }`}
              >
                {c === 'ALL' ? 'All Courses' : c}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-xl border border-zinc-700/50 text-xs">
            <span className="text-zinc-500 px-2 font-medium">Status:</span>
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
                      : 'bg-violet-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60/50'
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
        <table className="w-full text-left text-xs text-zinc-300">
          {/* Table Header */}
          <thead className="bg-zinc-950/80 text-zinc-500 font-bold uppercase tracking-wider border-b border-zinc-800/50">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('registrationNo')}>
                <div className="flex items-center gap-1">
                  Reg Number <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Student Name <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3.5 px-4">Father / Guardian</th>
              <th className="py-3.5 px-4">Phone & WhatsApp</th>
              <th className="py-3.5 px-4">Course & Stream</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('rollNo')}>
                <div className="flex items-center gap-1">
                  Roll No (Editable) <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('totalFees')}>
                <div className="flex items-center justify-end gap-1">
                  Total Fees (Editable) <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('paidTillNow')}>
                <div className="flex items-center justify-end gap-1">
                  Paid Till Now (Editable) <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('remainingFees')}>
                <div className="flex items-center justify-end gap-1">
                  Remaining <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center cursor-pointer hover:text-white" onClick={() => handleSort('feeStatus')}>
                <div className="flex items-center justify-center gap-1">
                  Fee Status <ArrowUpDown className="w-3 h-3 text-zinc-600" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-800/40 font-medium">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-zinc-600">
                  <div className="max-w-xs mx-auto space-y-2">
                    <Search className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-zinc-500">No matching student records found</p>
                    <p className="text-xs text-zinc-600">Try clearing search filters or selecting another course.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => {
                const whatsapp = student.whatsappNo || student.phone;
                const cleanPhone = whatsapp.replace(/[^0-9]/g, '');
                const waLink = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
                  `Dear ${student.name}, this is an official fee update from Shanti College of Education.`
                )}`;

                return (
                  <tr key={student.id} className="hover:bg-zinc-800/30 transition-colors group">
                    {/* Registration No */}
                    <td className="py-3.5 px-4 font-mono font-bold text-violet-300">
                      {student.registrationNo}
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4 text-white font-bold whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-zinc-800/60 text-violet-400 border border-zinc-700/50 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span>{student.name}</span>
                          <span className="block text-[10px] text-zinc-500 font-normal">{student.category} Category</span>
                        </div>
                      </div>
                    </td>

                    {/* Father / Guardian */}
                    <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                      {student.fatherName}
                    </td>

                    {/* Phone & WhatsApp Direct Chat */}
                    <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] flex items-center gap-1 text-zinc-300">
                          <Phone className="w-3 h-3 text-zinc-600" />
                          {student.phone}
                        </span>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Chat on WhatsApp with ${student.name}`}
                          className="px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 flex items-center gap-1 text-[10px] font-bold transition-all"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>

                    {/* Course, Stream & Semester */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {student.course}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/20">
                          {student.currentSemester || 'Sem 1'}
                        </span>
                        {student.stream && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {student.stream}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Editable Roll No */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {editingRollId === student.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={tempRollVal}
                            onChange={(e) => setTempRollVal(e.target.value)}
                            placeholder="Enter Roll No"
                            className="w-24 bg-zinc-950/60 border border-violet-500/30 rounded px-2 py-0.5 text-xs text-white font-mono"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRollNumber(student)}
                            title="Save Roll No"
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            if (!isReadOnly) {
                              setEditingRollId(student.id);
                              setTempRollVal(student.rollNo || '');
                            }
                          }}
                          title={isReadOnly ? 'Roll Number' : 'Click to Edit Roll Number'}
                          className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2 py-1 rounded-lg border transition-all ${
                            student.rollNo
                              ? 'bg-zinc-800/60 border-zinc-700/50 text-white hover:border-violet-500/30 cursor-pointer'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 cursor-pointer'
                          }`}
                        >
                          <span>{student.rollNo || '+ Set Roll No'}</span>
                          {!isReadOnly && <Edit2 className="w-3 h-3 text-zinc-500 group-hover:text-violet-300" />}
                        </div>
                      )}
                    </td>

                    {/* Total Fees (Editable Live) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {editingFeeId === student.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={tempFeeVal}
                            onChange={(e) => setTempFeeVal(Number(e.target.value))}
                            placeholder="Enter Fee"
                            className="w-24 bg-zinc-950/60 border border-violet-500/30 rounded px-2 py-0.5 text-xs text-white font-mono text-right font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveTotalFee(student)}
                            title="Save Total Fee"
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            if (!isReadOnly) {
                              setEditingFeeId(student.id);
                              setTempFeeVal(student.totalFees || 0);
                            }
                          }}
                          title={isReadOnly ? 'Total Fee' : 'Click to Set Total Fee'}
                          className={`inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded-lg border transition-all ${
                            student.totalFees > 0
                              ? 'bg-zinc-800/60 border-zinc-700/50 text-white hover:border-violet-500/30 cursor-pointer font-bold'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 cursor-pointer font-bold'
                          }`}
                        >
                          <span>{student.totalFees > 0 ? formatINR(student.totalFees) : 'NIL / TBD (+Set Fee)'}</span>
                          {!isReadOnly && <Edit2 className="w-3 h-3 text-zinc-500 group-hover:text-violet-300" />}
                        </div>
                      )}
                    </td>

                    {/* Paid Till Now (Editable Live) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {editingPaidId === student.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={tempPaidVal}
                            onChange={(e) => setTempPaidVal(Number(e.target.value))}
                            placeholder="Enter Paid"
                            className="w-24 bg-zinc-950/60 border border-emerald-500 rounded px-2 py-0.5 text-xs text-emerald-400 font-mono text-right font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePaidAmount(student)}
                            title="Save Paid Amount"
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            if (!isReadOnly) {
                              setEditingPaidId(student.id);
                              setTempPaidVal(student.paidTillNow || 0);
                            }
                          }}
                          title={isReadOnly ? 'Paid Till Now' : 'Click to Edit / Update Amount Paid'}
                          className={`inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded-lg border transition-all ${
                            student.paidTillNow > 0
                              ? 'bg-zinc-800/60 border-zinc-700/50 text-emerald-400 hover:border-emerald-500 cursor-pointer font-bold'
                              : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500 hover:border-zinc-700/50 cursor-pointer'
                          }`}
                        >
                          <span>{formatINR(student.paidTillNow)}</span>
                          {!isReadOnly && <Edit2 className="w-3 h-3 text-zinc-600 group-hover:text-emerald-300" />}
                        </div>
                      )}
                    </td>

                    {/* Remaining Fees */}
                    <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                      <span className={student.remainingFees > 0 ? 'text-rose-400' : 'text-zinc-500'}>
                        {formatINR(student.remainingFees)}
                      </span>
                    </td>

                    {/* Fee Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(student.feeStatus)}
                    </td>

                    {/* Action Column */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {!isReadOnly && onRecordPayment && student.remainingFees > 0 && (
                          <button
                            onClick={() => onRecordPayment(student)}
                            title="Collect Fee Payment"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            Pay
                          </button>
                        )}
                        {!isReadOnly && onSendReminder && student.remainingFees > 0 && (
                          <button
                            onClick={() => onSendReminder(student)}
                            title="Send Fee Reminder / Notice"
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/30 transition-all cursor-pointer"
                          >
                            Notice
                          </button>
                        )}
                        {onGenerateReceipt && (
                          <button
                            onClick={() => onGenerateReceipt(student)}
                            title="Generate Fee Receipt"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        )}
                        <button
                          onClick={() => onViewStudent(student)}
                          title="View Full Profile & Fee Details"
                          className="px-2.5 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-600 text-violet-400 hover:text-white border border-violet-500/20 transition-all cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        {!isReadOnly && (
                          <button
                            onClick={() => onEditStudent(student)}
                            title="Edit Full Profile Record"
                            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 border border-zinc-700/50 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-zinc-800/40 bg-zinc-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <div>
          Showing <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
          <strong className="text-white">{Math.min(currentPage * itemsPerPage, sortedStudents.length)}</strong> of{' '}
          <strong className="text-white">{sortedStudents.length}</strong> records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-white font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
