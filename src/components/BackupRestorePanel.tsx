import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  Database,
  Calendar,
  Users,
  GraduationCap,
  IndianRupee,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Wifi,
  WifiOff,
} from 'lucide-react';
import type { Student, CourseFeeRule, AuditLogEntry } from '../types/feeSystem';
import { formatCurrencyINR } from '../utils/exportUtils';
import { saveStoredStudents, saveFeeRules } from '../utils/storage';
import { syncAllStudentsToDB, saveFeeRulesToDB } from '../services/supabaseService';

interface BackupRestorePanelProps {
  students: Student[];
  feeRules: CourseFeeRule[];
  auditLogs: AuditLogEntry[];
  onRestore: (students: Student[], feeRules: CourseFeeRule[]) => void;
  isReadOnly?: boolean;
}

interface BackupData {
  version: string;
  exportedAt: string;
  exportedBy: string;
  students: Student[];
  feeRules: CourseFeeRule[];
  auditLogs: AuditLogEntry[];
}

export const BackupRestorePanel: React.FC<BackupRestorePanelProps> = ({
  students,
  feeRules,
  auditLogs,
  onRestore,
  isReadOnly = false,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [restoreMessage, setRestoreMessage] = useState('');
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [restoreFileName, setRestoreFileName] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<BackupData | null>(null);

  // Track online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Group students by session
  const sessionGroups = useMemo(() => {
    const groups = new Map<string, Student[]>();
    students.forEach((s) => {
      const session = s.session || 'Unknown';
      if (!groups.has(session)) groups.set(session, []);
      groups.get(session)!.push(s);
    });
    // Sort sessions descending
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [students]);

  // Compute per-session stats
  const sessionStats = useMemo(() => {
    return sessionGroups.map(([session, sessionStudents]) => {
      const totalFees = sessionStudents.reduce((sum, s) => sum + s.totalFees, 0);
      const totalPaid = sessionStudents.reduce((sum, s) => sum + s.paidTillNow, 0);
      const totalPending = totalFees - totalPaid;
      const paidCount = sessionStudents.filter((s) => s.feeStatus === 'Paid').length;
      const unpaidCount = sessionStudents.filter((s) => s.feeStatus === 'Unpaid').length;
      const partlyPaidCount = sessionStudents.filter((s) => s.feeStatus === 'Partly Paid').length;
      return { session, count: sessionStudents.length, totalFees, totalPaid, totalPending, paidCount, unpaidCount, partlyPaidCount };
    });
  }, [sessionGroups]);

  // Download full backup as JSON
  const handleDownloadBackup = () => {
    const backup: BackupData = {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      exportedBy: 'Shanti College Fee System',
      students,
      feeRules,
      auditLogs,
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `fee-system-backup-${dateStr}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle file selection for restore
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreFileName(file.name);
    setRestoreStatus('idle');
    setRestoreMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as BackupData;

        // Validate backup structure
        if (!data.students || !Array.isArray(data.students)) {
          throw new Error('Invalid backup: missing students array');
        }

        setPreviewData(data);
      } catch (err) {
        setRestoreStatus('error');
        setRestoreMessage('Invalid backup file. Please select a valid JSON backup.');
        setPreviewData(null);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  // Apply restored data
  const handleApplyRestore = async () => {
    if (!previewData) return;

    try {
      const restoredStudents = previewData.students;
      const restoredRules = previewData.feeRules || [];

      // Update localStorage
      saveStoredStudents(restoredStudents);
      if (restoredRules.length > 0) {
        saveFeeRules(restoredRules);
      }

      // Sync to Supabase
      await syncAllStudentsToDB(restoredStudents);
      if (restoredRules.length > 0) {
        await saveFeeRulesToDB(restoredRules);
      }

      // Notify parent
      onRestore(restoredStudents, restoredRules);

      setRestoreStatus('success');
      setRestoreMessage(`Restored ${restoredStudents.length} students successfully!`);
      setPreviewData(null);
      setRestoreFileName(null);
    } catch (err) {
      setRestoreStatus('error');
      setRestoreMessage('Failed to restore data. Please try again.');
    }
  };

  const toggleSession = (session: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(session)) next.delete(session);
      else next.add(session);
      return next;
    });
  };

  const storageUsed = useMemo(() => {
    try {
      const data = localStorage.getItem('school_fee_system_students_v3') || '';
      const bytes = new Blob([data]).size;
      if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${bytes} B`;
    } catch {
      return 'Unknown';
    }
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-800 text-stone-50 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Backup & Data Center</h2>
              <p className="text-xs text-stone-500 mt-0.5">Download backups, restore data, and view session-wise records</p>
            </div>
          </div>

          {/* Online/Offline Status */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border ${
            isOnline
              ? 'bg-stone-100 text-stone-700 border-stone-200'
              : 'bg-stone-50 text-stone-600 border-stone-200'
          }`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {isOnline ? 'Online — Syncing Active' : 'Offline — Using Local Data'}
          </div>
        </div>

        {/* Storage Info Bar */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 text-[10px] font-semibold uppercase tracking-wider">
              <HardDrive className="w-3.5 h-3.5" /> Local Storage
            </div>
            <p className="text-sm font-bold text-stone-900 mt-1">{storageUsed}</p>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 text-[10px] font-semibold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" /> Total Students
            </div>
            <p className="text-sm font-bold text-stone-900 mt-1">{students.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 text-[10px] font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> Sessions
            </div>
            <p className="text-sm font-bold text-stone-900 mt-1">{sessionGroups.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 text-[10px] font-semibold uppercase tracking-wider">
              <IndianRupee className="w-3.5 h-3.5" /> Total Fees
            </div>
            <p className="text-sm font-bold text-stone-900 mt-1">
              {formatCurrencyINR(students.reduce((sum, s) => sum + s.totalFees, 0))}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Download Backup */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Download Full Backup</h3>
              <p className="text-[11px] text-stone-500">Export all students, fee rules & logs as JSON</p>
            </div>
          </div>

          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            Creates a complete snapshot of your fee management data including all student records,
            payment histories, fee structures, and audit logs. Store this file safely for disaster recovery.
          </p>

          <button
            onClick={handleDownloadBackup}
            className="w-full px-4 py-3 rounded-xl bg-rose-800 hover:bg-rose-700 text-stone-50 text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            <FileJson className="w-4 h-4" />
            Download Backup ({students.length} students)
          </button>
        </motion.div>

        {/* Restore from Backup */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Restore from Backup</h3>
              <p className="text-[11px] text-stone-500">Load a previously exported backup file</p>
            </div>
          </div>

          {restoreStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium mb-3">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {restoreMessage}
            </div>
          )}

          {restoreStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium mb-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {restoreMessage}
            </div>
          )}

          {previewData && (
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 mb-3 space-y-1">
              <p className="font-semibold">Preview: {previewData.students.length} students found</p>
              <p>Backup date: {new Date(previewData.exportedAt).toLocaleString()}</p>
              <p>Fee rules: {previewData.feeRules?.length || 0} rules</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="w-full px-4 py-3 rounded-xl bg-rose-800 hover:bg-rose-700 text-stone-50 text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200">
              <Upload className="w-4 h-4" />
              {restoreFileName ? `File: ${restoreFileName}` : 'Select Backup File (.json)'}
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isReadOnly}
              />
            </label>

            {previewData && !isReadOnly && (
              <button
                onClick={handleApplyRestore}
                className="w-full px-4 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-stone-50 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Apply Restored Data
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Session-wise Data Browser */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Session-wise Data Browser</h3>
            <p className="text-[11px] text-stone-500">View all student records organized by academic session</p>
          </div>
        </div>

        <div className="space-y-3">
          {sessionStats.map(({ session, count, totalFees, totalPaid, totalPending, paidCount, unpaidCount, partlyPaidCount }) => {
            const isExpanded = expandedSessions.has(session);
            const sessionStudents = sessionGroups.find(([s]) => s === session)?.[1] || [];

            return (
              <div key={session} className="border border-stone-200 rounded-2xl overflow-hidden">
                {/* Session Header */}
                <button
                  onClick={() => toggleSession(session)}
                  className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-800 text-stone-50 flex items-center justify-center text-xs font-bold">
                      {session.slice(0, 4)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-stone-900">{session}</p>
                      <p className="text-[11px] text-stone-500">{count} students</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 text-[11px]">
                      <span className="text-stone-700 font-semibold">{paidCount} Paid</span>
                      <span className="text-stone-600 font-semibold">{partlyPaidCount} Partly</span>
                      <span className="text-stone-500 font-semibold">{unpaidCount} Unpaid</span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-stone-900">{formatCurrencyINR(totalPaid)}</p>
                      <p className="text-[10px] text-stone-500">of {formatCurrencyINR(totalFees)}</p>
                    </div>
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-stone-400" />
                      : <ChevronRight className="w-4 h-4 text-stone-400" />
                    }
                  </div>
                </button>

                {/* Expanded Session Details */}
                {isExpanded && (
                  <div className="border-t border-stone-100 bg-stone-50/50">
                    {/* Session Stats Bar */}
                    <div className="grid grid-cols-3 gap-px bg-stone-200 border-b border-stone-200">
                      <div className="bg-white p-3 text-center">
                        <p className="text-[10px] text-stone-400 font-semibold uppercase">Expected</p>
                        <p className="text-sm font-bold text-stone-900">{formatCurrencyINR(totalFees)}</p>
                      </div>
                      <div className="bg-white p-3 text-center">
                        <p className="text-[10px] text-stone-400 font-semibold uppercase">Collected</p>
                        <p className="text-sm font-bold text-stone-900">{formatCurrencyINR(totalPaid)}</p>
                      </div>
                      <div className="bg-white p-3 text-center">
                        <p className="text-[10px] text-stone-400 font-semibold uppercase">Pending</p>
                        <p className="text-sm font-bold text-stone-700">{formatCurrencyINR(totalPending)}</p>
                      </div>
                    </div>

                    {/* Student List */}
                    <div className="max-h-80 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-stone-100 z-10">
                          <tr>
                            <th className="text-left px-4 py-2 text-stone-500 font-semibold">Reg. No</th>
                            <th className="text-left px-4 py-2 text-stone-500 font-semibold">Name</th>
                            <th className="text-left px-4 py-2 text-stone-500 font-semibold hidden md:table-cell">Course</th>
                            <th className="text-right px-4 py-2 text-stone-500 font-semibold">Total</th>
                            <th className="text-right px-4 py-2 text-stone-500 font-semibold">Paid</th>
                            <th className="text-right px-4 py-2 text-stone-500 font-semibold">Pending</th>
                            <th className="text-center px-4 py-2 text-stone-500 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessionStudents.map((student) => (
                            <tr key={student.id} className="border-t border-stone-100 hover:bg-white transition-colors">
                              <td className="px-4 py-2.5 font-mono text-stone-700">{student.registrationNo}</td>
                              <td className="px-4 py-2.5 font-medium text-stone-900">{student.name}</td>
                              <td className="px-4 py-2.5 text-stone-600 hidden md:table-cell">
                                <span className="inline-flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" />
                                  {student.course}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-right text-stone-700">{formatCurrencyINR(student.totalFees)}</td>
                              <td className="px-4 py-2.5 text-right text-stone-700 font-medium">{formatCurrencyINR(student.paidTillNow)}</td>
                              <td className="px-4 py-2.5 text-right text-stone-600 font-medium">{formatCurrencyINR(student.remainingFees)}</td>
                              <td className="px-4 py-2.5 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  student.feeStatus === 'Paid'
                                    ? 'bg-stone-100 text-stone-700'
                                    : student.feeStatus === 'Partly Paid'
                                    ? 'bg-stone-100 text-stone-700'
                                    : student.feeStatus === 'Overdue'
                                    ? 'bg-stone-200 text-stone-700'
                                    : 'bg-stone-100 text-stone-600'
                                }`}>
                                  {student.feeStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {sessionGroups.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No student data available</p>
            <p className="text-xs mt-1">Import or restore data to see session-wise records</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
