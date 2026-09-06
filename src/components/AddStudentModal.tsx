import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Student, CourseType, SeatType, PeriodName } from '../types/feeSystem';
import { getSeatTypesForCourse, getPeriodsForCourse, getPeriodYear } from '../types/feeSystem';
import { X, UserPlus, GraduationCap, BookOpen, CheckCircle2, Armchair } from 'lucide-react';
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
  const [currentPeriod, setCurrentPeriod] = useState<PeriodName>('Session 1');
  const [session, setSession] = useState('2026-2027');
  const [address, setAddress] = useState('');
  const [initialPayment, setInitialPayment] = useState<number>(0);

  const [whatsappNo, setWhatsappNo] = useState('');
  const [stream, setStream] = useState<string>('Arts');
  const [rollNoInput, setRollNoInput] = useState('');
  const [seatType, setSeatType] = useState<SeatType>('Normal');

  // Available seat types for selected course
  const availableSeatTypes = useMemo(() => getSeatTypesForCourse(course), [course]);
  // Available periods for selected course
  const availablePeriods = useMemo(() => getPeriodsForCourse(course), [course]);

  // Reset currentPeriod when course changes
  React.useEffect(() => {
    const periods = getPeriodsForCourse(course);
    setCurrentPeriod(periods[0]);
  }, [course]);

  // Derive total fee based on selected course + seat type
  const currentFeeRule = DEFAULT_FEE_RULES.find((r) => r.course === course) || DEFAULT_FEE_RULES[0];
  const seatAdditional = currentFeeRule.seatTypeFees?.find((sf) => sf.seatType === seatType)?.additionalFee || 0;
  const defaultTotalFee = (course === 'JBT' ? 65000 : 78000) + seatAdditional;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !fatherName || !phone) {
      alert('Please fill out student name, father name, and contact phone!');
      return;
    }

    const randNum = Math.floor(100 + Math.random() * 900);
    const regNo = `REG-2024-${course === 'JBT' ? 'JBT' : 'BED'}-${randNum}`;
    const rollNo = rollNoInput.trim() || `${course === 'JBT' ? 'JBT' : 'BED'}-24${randNum.toString().slice(-2)}`;

    const initialPaid = Math.min(initialPayment, defaultTotalFee);
    const remaining = Math.max(0, defaultTotalFee - initialPaid);
    const feeStatus = initialPaid >= defaultTotalFee ? 'Paid' : initialPaid > 0 ? 'Partly Paid' : 'Unpaid';

    const periodYear = getPeriodYear(currentPeriod);

    const newStudent: Student = {
      id: regNo,
      registrationNo: regNo,
      name,
      fatherName,
      phone,
      whatsappNo: whatsappNo || phone,
      stream,
      seatType,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      course,
      semester: periodYear,
      currentSemester: currentPeriod,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white backdrop-blur-xl border border-stone-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl shadow-rose-800/10 overflow-y-auto max-h-[90vh] text-stone-900 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">New Student Admission</h2>
              <p className="text-xs text-stone-500">Enrol new student in JBT or B.Ed program</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admission Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Course Program Selection */}
          <div>
            <label className="block text-stone-700 font-medium mb-1.5">Select Program Course</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setCourse('JBT'); setSeatType('Subsidised'); }}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  course === 'JBT'
                    ? 'bg-rose-800 border-rose-800 text-stone-50 shadow-lg shadow-rose-800/15 ring-1 ring-rose-800'
                    : 'bg-stone-50/60 border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">JBT Course</h4>
                  <p className="text-[11px] text-stone-500">2 Years Diploma • Annual Fee: ₹65,000</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setCourse('B.Ed'); setSeatType('Normal'); }}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  course === 'B.Ed'
                    ? 'bg-rose-800 border-rose-800 text-stone-50 shadow-lg shadow-rose-800/15 ring-1 ring-rose-800'
                    : 'bg-stone-50/60 border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">B.Ed Course</h4>
                  <p className="text-[11px] text-stone-500">2 Years Degree • Annual Fee: ₹78,000</p>
                </div>
              </button>
            </div>
          </div>

          {/* Seat Type Selection */}
          <div>
            <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1.5">
              <Armchair className="w-4 h-4 text-stone-700" />
              Select Seat Category
              <span className="text-[10px] text-stone-500 font-normal ml-1">
                {course === 'JBT' ? '(Subsidised / Non-Subsidised / Management)' : '(Normal / Management)'}
              </span>
            </label>
            <div className={`grid gap-3 ${availableSeatTypes.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {availableSeatTypes.map((st) => {
                const additional = currentFeeRule.seatTypeFees?.find((sf) => sf.seatType === st)?.additionalFee || 0;
                const isSelected = seatType === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSeatType(st)}
                    className={`relative p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? st === 'Management'
                          ? 'bg-stone-100 border-stone-300 shadow-lg shadow-rose-800/10 ring-1 ring-stone-300'
                          : st === 'Subsidised'
                          ? 'bg-stone-100 border-stone-300 shadow-lg shadow-rose-800/10 ring-1 ring-stone-300'
                          : 'bg-rose-800 border-rose-800 shadow-lg shadow-rose-800/15 ring-1 ring-rose-800'
                        : 'bg-stone-50/60 border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    {st === 'Management' && (
                      <span className="absolute top-2 right-2 text-stone-500 text-xs">★</span>
                    )}
                    <div className={`text-sm font-bold ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                      {st}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      {additional > 0 ? `Base + ₹${additional.toLocaleString('en-IN')}` : 'Base Fee'}
                    </div>
                    <div className="text-[11px] font-bold text-stone-700 mt-1">
                      ₹{(defaultTotalFee).toLocaleString('en-IN')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Student Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Vikas Sharma"
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Father's / Guardian Name *</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                required
                placeholder="e.g. Satish Sharma"
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Contact Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 98765 43210"
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">WhatsApp No.</label>
              <input
                type="text"
                value={whatsappNo}
                onChange={(e) => setWhatsappNo(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50"
              />
            </div>
          </div>

          {/* Academic, Stream & Category */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Stream</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50 cursor-pointer"
              >
                <option value="Arts">Arts</option>
                <option value="Medical">Medical</option>
                <option value="Non-Medical">Non-Medical</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50 cursor-pointer"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">{course === 'JBT' ? 'Session' : 'Semester'}</label>
              <select
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value as PeriodName)}
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50 cursor-pointer"
              >
                {availablePeriods.map((p) => (
                  <option key={p} value={p}>{p} ({getPeriodYear(p)})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50 cursor-pointer"
              >
                <option value="2026-2027">2026-2027</option>
                <option value="2024-2026">2024-2026</option>
                <option value="2023-2025">2023-2025</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Class Roll No.</label>
              <input
                type="text"
                value={rollNoInput}
                onChange={(e) => setRollNoInput(e.target.value)}
                placeholder="Auto or Manual"
                className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50 font-mono text-xs"
              />
            </div>
          </div>

          {/* Residential Address */}
          <div>
            <label className="block text-stone-700 font-medium mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House No, Village/Sector, District, State"
              className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-rose-800/50"
            />
          </div>

          {/* Initial Token Payment option */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-2">
            <label className="block text-stone-700 font-bold">Initial Token / Admission Payment (Optional ₹)</label>
            <p className="text-[11px] text-stone-500">Enter amount if student is paying admission fee right now</p>
            <input
              type="number"
              min={0}
              max={defaultTotalFee}
              value={initialPayment}
              onChange={(e) => setInitialPayment(Number(e.target.value))}
              className="w-full bg-stone-50/60 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-bold text-sm focus:outline-none focus:border-rose-800/50"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-stone-50 font-bold shadow-lg shadow-rose-800/10 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Complete Admission
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
