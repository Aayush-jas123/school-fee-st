import React, { useState, useEffect } from 'react';
import type { Student, CourseType, FeeStatusType } from '../types/feeSystem';
import { X, Save, CheckCircle2 } from 'lucide-react';

interface EditStudentModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onSave }) => {
  if (!student) return null;

  const [formData, setFormData] = useState<Student>({ ...student });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setFormData({ ...student });
  }, [student]);

  const handleChange = (field: keyof Student, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'totalFees' || field === 'paidTillNow') {
        const total = field === 'totalFees' ? Number(value) : prev.totalFees;
        const paid = field === 'paidTillNow' ? Number(value) : prev.paidTillNow;
        updated.remainingFees = Math.max(0, total - paid);

        // Auto calculate status suggestion
        if (paid >= total && total > 0) {
          updated.feeStatus = 'Paid';
        } else if (paid > 0) {
          updated.feeStatus = 'Partly Paid';
        } else {
          updated.feeStatus = 'Unpaid';
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      onSave(formData);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl text-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white">Edit Student Fee Record</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Registration No: <strong className="text-indigo-400">{student.registrationNo}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {showToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 p-3 text-center text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Record updated in prototype state successfully!
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Father / Guardian Name</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Course Program */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Course Program</label>
              <select
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value as CourseType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="JBT">JBT (Junior Basic Training)</option>
                <option value="B.Ed">B.Ed (Bachelor of Education)</option>
              </select>
            </div>

            {/* Semester / Year */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Semester / Year</label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Total Fees */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Total Fee Amount (₹)</label>
              <input
                type="number"
                value={formData.totalFees}
                onChange={(e) => handleChange('totalFees', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Paid Till Now */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Paid Till Now (₹)</label>
              <input
                type="number"
                value={formData.paidTillNow}
                onChange={(e) => handleChange('paidTillNow', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Remaining Balance (Calculated) */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Remaining Balance (₹)</label>
              <input
                type="number"
                value={formData.remainingFees}
                disabled
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-rose-400 font-mono font-bold cursor-not-allowed"
              />
            </div>

            {/* Fee Status */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Fee Status</label>
              <select
                value={formData.feeStatus}
                onChange={(e) => handleChange('feeStatus', e.target.value as FeeStatusType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:border-indigo-500 focus:outline-none"
              >
                <option value="Paid">Paid (Green)</option>
                <option value="Partly Paid">Partly Paid (Yellow)</option>
                <option value="Unpaid">Unpaid (Red)</option>
                <option value="Overdue">Overdue (Red Alert)</option>
              </select>
            </div>

            {/* Next Due Date */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Next Payment Due Date</label>
              <input
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => handleChange('nextDueDate', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Student Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-indigo-500 focus:outline-none"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Permanent Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes (Prototype)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
