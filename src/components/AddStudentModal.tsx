import React, { useState } from 'react';
import type { Student, CourseType } from '../types/feeSystem';
import { X, UserPlus, GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react';
import { DEFAULT_FEE_RULES } from '../utils/storage';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
  const [course, setCourse] = useState<CourseType>('JBT');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST'>('General');
  const [semester, setSemester] = useState('1st Year');
  const [session, setSession] = useState('2024-2026');
  const [address, setAddress] = useState('');
  const [initialPayment, setInitialPayment] = useState<number>(0);

  // Derive total fee based on selected course
  const currentFeeRule = DEFAULT_FEE_RULES.find((r) => r.course === course) || DEFAULT_FEE_RULES[0];
  const defaultTotalFee = course === 'JBT' ? 65000 : 78000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !fatherName || !phone) {
      alert('Please fill out student name, father name, and contact phone!');
      return;
    }

    const randNum = Math.floor(100 + Math.random() * 900);
    const regNo = `REG-2024-${course === 'JBT' ? 'JBT' : 'BED'}-${randNum}`;
    const rollNo = `${course === 'JBT' ? 'JBT' : 'BED'}-24${randNum.toString().slice(-2)}`;

    const initialPaid = Math.min(initialPayment, defaultTotalFee);
    const remaining = Math.max(0, defaultTotalFee - initialPaid);
    const feeStatus = initialPaid >= defaultTotalFee ? 'Paid' : initialPaid > 0 ? 'Partly Paid' : 'Unpaid';

    const newStudent: Student = {
      id: regNo,
      registrationNo: regNo,
      name,
      fatherName,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      course,
      semester,
      rollNo,
      session,
      totalFees: defaultTotalFee,
      paidTillNow: initialPaid,
      remainingFees: remaining,
      feeStatus,
      nextDueDate: '2026-10-15',
      address: address || 'Haryana, India',
      category,
      feeBreakdown: {
        tuitionFee: currentFeeRule.tuitionFee,
        admissionFee: currentFeeRule.admissionFee,
        examFee: currentFeeRule.examFee,
        libraryFee: currentFeeRule.libraryFee,
        developmentFee: currentFeeRule.developmentFee,
        labFee: currentFeeRule.labFee,
      },
      paymentHistory: initialPaid > 0 ? [
        {
          id: `RCP-2024-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: initialPaid,
          date: new Date().toISOString().split('T')[0],
          mode: 'UPI',
          transactionRef: `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          remark: 'Admission & Initial Token Fee',
        }
      ] : [],
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-slate-100 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">New Student Admission</h2>
              <p className="text-xs text-slate-400">Enrol new student in JBT or B.Ed program</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admission Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Course Program Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Select Program Course</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCourse('JBT')}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  course === 'JBT'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">JBT Course</h4>
                  <p className="text-[11px] text-slate-400">2 Years Diploma • Annual Fee: ₹65,000</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCourse('B.Ed')}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  course === 'B.Ed'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">B.Ed Course</h4>
                  <p className="text-[11px] text-slate-400">2 Years Degree • Annual Fee: ₹78,000</p>
                </div>
              </button>
            </div>
          </div>

          {/* Student Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Student Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Vikas Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Father's / Guardian Name *</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                required
                placeholder="e.g. Satish Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Contact Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 98765 43210"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Academic & Category */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Year / Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Academic Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="2024-2026">2024-2026</option>
                <option value="2023-2025">2023-2025</option>
              </select>
            </div>
          </div>

          {/* Residential Address */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House No, Village/Sector, District, State"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Initial Token Payment option */}
          <div className="bg-indigo-950/30 border border-indigo-800/50 p-4 rounded-2xl space-y-2">
            <label className="block text-indigo-300 font-bold">Initial Token / Admission Payment (Optional ₹)</label>
            <p className="text-[11px] text-slate-400">Enter amount if student is paying admission fee right now</p>
            <input
              type="number"
              min={0}
              max={defaultTotalFee}
              value={initialPayment}
              onChange={(e) => setInitialPayment(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Complete Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
