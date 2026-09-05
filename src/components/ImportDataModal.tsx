import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, FileText, FileSpreadsheet, X, ChevronRight, ChevronLeft,
  CheckCircle2, AlertCircle, Loader2, Users, BookOpen, GraduationCap,
  Calendar, Tag, Trash2, Eye,
} from 'lucide-react';
import type { Student, CourseType } from '../types/feeSystem';
import { parseAdmissionPDF, parseAdmissionExcel, computeImportSummary } from '../utils/importUtils';
import type { ImportSummary } from '../utils/importUtils';

interface ImportDataModalProps {
  onClose: () => void;
  onImport: (students: Student[]) => void;
  existingStudentIds?: Set<string>;
}

type ImportStep = 'upload' | 'configure' | 'preview' | 'importing';

const SESSION_OPTIONS = [
  '2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029',
];

const COURSE_OPTIONS: { value: CourseType; label: string; icon: typeof BookOpen }[] = [
  { value: 'B.Ed', label: 'B.Ed', icon: BookOpen },
  { value: 'JBT', label: 'JBT', icon: GraduationCap },
];

export function ImportDataModal({ onClose, onImport, existingStudentIds }: ImportDataModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'excel' | null>(null);
  const [course, setCourse] = useState<CourseType>('B.Ed');
  const [session, setSession] = useState<string>('2024-2025');
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PREVIEW_PER_PAGE = 15;

  // Detect file type on selection
  const handleFileSelect = useCallback((f: File) => {
    setError(null);
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      setFileType('pdf');
      setFile(f);
      setStep('configure');
    } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      setFileType('excel');
      setFile(f);
      setStep('configure');
    } else {
      setError('Please select a PDF, Excel (.xlsx/.xls), or CSV file.');
    }
  }, []);

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  // Parse the file
  const handleParse = async () => {
    if (!file) return;
    setStep('importing');
    setError(null);

    try {
      let students: Student[];
      let detectedSession = session;

      if (fileType === 'pdf') {
        const result = await parseAdmissionPDF(file);
        students = result.students;
        if (result.detectedSession) {
          detectedSession = result.detectedSession;
          setSession(detectedSession);
        }
      } else {
        students = await parseAdmissionExcel(file, course, session);
      }

      if (students.length === 0) {
        setError('No student records found in the file. Please check the file format.');
        setStep('configure');
        return;
      }

      // Mark duplicates
      if (existingStudentIds) {
        for (const s of students) {
          if (existingStudentIds.has(s.registrationNo)) {
            s.notes = (s.notes || '') + ' [DUPLICATE]';
          }
        }
      }

      setParsedStudents(students);
      setSummary(computeImportSummary(students, detectedSession));
      setStep('preview');
    } catch (err) {
      console.error('Import parse error:', err);
      setError(`Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStep('configure');
    }
  };

  // Confirm import
  const handleConfirmImport = () => {
    if (parsedStudents.length === 0) return;
    onImport(parsedStudents);
  };

  // Remove a student from preview
  const handleRemoveStudent = (idx: number) => {
    setParsedStudents(prev => prev.filter((_, i) => i !== idx));
  };

  const previewTotalPages = Math.ceil(parsedStudents.length / PREVIEW_PER_PAGE);
  const previewSlice = parsedStudents.slice(
    previewPage * PREVIEW_PER_PAGE,
    (previewPage + 1) * PREVIEW_PER_PAGE,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center border border-violet-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Import Student Data</h2>
              <p className="text-xs text-zinc-500">Import admission records from PDF or Excel files</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-zinc-800/40 flex items-center gap-2">
          {(['upload', 'configure', 'preview'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s || (i === 0 && step === 'importing') || (i === 1 && step === 'preview')
                  ? 'bg-violet-600 text-white'
                  : ['upload', 'configure', 'preview'].indexOf(step) > i
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                    : 'bg-zinc-800 text-zinc-600 border border-zinc-700/50'
              }`}>
                {['upload', 'configure', 'preview'].indexOf(step) > i || (i <= 1 && step === 'preview') ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs font-medium capitalize ${step === s ? 'text-white' : 'text-zinc-600'}`}>
                {s === 'upload' ? 'Upload' : s === 'configure' ? 'Configure' : 'Preview & Import'}
              </span>
              {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-violet-500 bg-violet-500/5'
                    : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-800/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                />
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-violet-400' : 'text-zinc-600'}`} />
                <h3 className="text-lg font-bold text-white mb-1">
                  {isDragging ? 'Drop your file here' : 'Drag & drop or click to browse'}
                </h3>
                <p className="text-sm text-zinc-500 mb-4">
                  Supports PDF admission reports, Excel (.xlsx/.xls), and CSV files
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-800/60 px-3 py-1.5 rounded-lg">
                    <FileText className="w-3.5 h-3.5 text-red-400" /> PDF
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-800/60 px-3 py-1.5 rounded-lg">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-800/60 px-3 py-1.5 rounded-lg">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> CSV
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CONFIGURE */}
          {step === 'configure' && (
            <div className="space-y-5">
              {/* File Info */}
              <div className="flex items-center gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-2xl p-4">
                {fileType === 'pdf' ? (
                  <FileText className="w-8 h-8 text-red-400" />
                ) : (
                  <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{file?.name}</p>
                  <p className="text-xs text-zinc-500">
                    {fileType === 'pdf' ? 'PDF Document' : 'Excel Spreadsheet'} •{' '}
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : ''}
                  </p>
                </div>
                <button
                  onClick={() => { setStep('upload'); setFile(null); setFileType(null); setError(null); }}
                  className="text-xs text-zinc-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Course Selection */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Program / Course</label>
                <div className="grid grid-cols-2 gap-3">
                  {COURSE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setCourse(opt.value)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                        course === opt.value
                          ? 'border-violet-500/50 bg-violet-500/10 text-white'
                          : 'border-zinc-700/50 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <opt.icon className={`w-5 h-5 ${course === opt.value ? 'text-violet-400' : 'text-zinc-600'}`} />
                      <span className="font-semibold text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Selection */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Academic Session / Year</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {SESSION_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => setSession(s)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        session === s
                          ? 'border-violet-500/50 bg-violet-500/10 text-violet-300'
                          : 'border-zinc-700/50 bg-zinc-800/30 text-zinc-500 hover:border-zinc-600'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {s}
                    </button>
                  ))}
                </div>
                {fileType === 'pdf' && (
                  <p className="text-[11px] text-zinc-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Session will be auto-detected from PDF header
                  </p>
                )}
              </div>

              {/* Import Mode */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Import Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                    <p className="text-xs font-semibold text-emerald-400">Append (Recommended)</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Add to existing student records</p>
                  </div>
                  <div className="p-3 rounded-xl border border-zinc-700/50 bg-zinc-800/30 opacity-50">
                    <p className="text-xs font-semibold text-zinc-500">Replace All</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">Coming soon</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PREVIEW */}
          {step === 'preview' && summary && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-violet-400" />
                    <span className="text-[11px] text-zinc-500 font-medium">Total Records</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{summary.totalRecords}</p>
                </div>
                <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-[11px] text-zinc-500 font-medium">Session</span>
                  </div>
                  <p className="text-lg font-bold text-white">{summary.session}</p>
                </div>
                <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] text-zinc-500 font-medium">Streams</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {Object.entries(summary.byStream).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </p>
                </div>
                <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] text-zinc-500 font-medium">Categories</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {Object.entries(summary.byCategory).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </p>
                </div>
              </div>

              {/* Preview Table */}
              <div className="bg-zinc-800/30 border border-zinc-700/40 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-700/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-zinc-300">Data Preview</span>
                    <span className="text-[11px] text-zinc-600">
                      Showing {previewPage * PREVIEW_PER_PAGE + 1}–{Math.min((previewPage + 1) * PREVIEW_PER_PAGE, parsedStudents.length)} of {parsedStudents.length}
                    </span>
                  </div>
                  {previewTotalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
                        disabled={previewPage === 0}
                        className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] text-zinc-500 px-2">
                        Page {previewPage + 1} / {previewTotalPages}
                      </span>
                      <button
                        onClick={() => setPreviewPage(p => Math.min(previewTotalPages - 1, p + 1))}
                        disabled={previewPage >= previewTotalPages - 1}
                        className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-zinc-800/60">
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider">#</th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Reg. No</th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Name</th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Father's Name</th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Stream</th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Category</th>
                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fee</th>
                        <th className="px-3 py-2.5 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewSlice.map((student, idx) => {
                        const globalIdx = previewPage * PREVIEW_PER_PAGE + idx;
                        const isDuplicate = student.notes?.includes('[DUPLICATE]');
                        return (
                          <tr
                            key={student.id}
                            className={`border-t border-zinc-800/40 ${isDuplicate ? 'bg-amber-500/5' : 'hover:bg-zinc-800/20'}`}
                          >
                            <td className="px-3 py-2 text-zinc-600 font-mono">{globalIdx + 1}</td>
                            <td className="px-3 py-2 text-violet-400 font-mono font-semibold">{student.registrationNo}</td>
                            <td className="px-3 py-2 text-white font-semibold">{student.name}</td>
                            <td className="px-3 py-2 text-zinc-400">{student.fatherName}</td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                student.stream === 'Non-Medical' ? 'bg-blue-500/10 text-blue-400' :
                                student.stream === 'Medical' ? 'bg-emerald-500/10 text-emerald-400' :
                                student.stream === 'Commerce' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-zinc-700/30 text-zinc-400'
                              }`}>
                                {student.stream}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                student.category === 'SC' ? 'bg-purple-500/10 text-purple-400' :
                                student.category === 'ST' ? 'bg-pink-500/10 text-pink-400' :
                                student.category === 'OBC' ? 'bg-orange-500/10 text-orange-400' :
                                'bg-zinc-700/30 text-zinc-400'
                              }`}>
                                {student.category}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-emerald-400 font-mono font-semibold">
                              ₹{student.totalFees.toLocaleString('en-IN')}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button
                                onClick={() => handleRemoveStudent(globalIdx)}
                                className="p-1 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                                title="Remove this record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {parsedStudents.some(s => s.notes?.includes('[DUPLICATE]')) && (
                <div className="flex items-start gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Duplicate records detected</p>
                    <p className="text-amber-400/70 mt-0.5">
                      Some students already exist in the database (highlighted in yellow). They will be imported with new IDs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* IMPORTING STATE */}
          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
              <p className="text-sm text-zinc-400 font-medium">Parsing file and extracting student records...</p>
              <p className="text-xs text-zinc-600">This may take a moment for large files</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== 'importing' && (
          <div className="px-6 py-4 border-t border-zinc-800/60 flex items-center justify-between">
            <button
              onClick={() => {
                if (step === 'configure') setStep('upload');
                else if (step === 'preview') setStep('configure');
                else onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {step === 'upload' ? 'Cancel' : 'Back'}
            </button>

            <div className="flex items-center gap-3">
              {step === 'configure' && (
                <button
                  onClick={handleParse}
                  disabled={!file}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-violet-600/20 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  Parse & Preview
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 'preview' && (
                <button
                  onClick={handleConfirmImport}
                  disabled={parsedStudents.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Import {parsedStudents.length} Student{parsedStudents.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
