export type CourseType = 'JBT' | 'B.Ed';

// Seat types per course
export type BEdSeatType = 'Normal' | 'Management';
export type JBTSeatType = 'Subsidised' | 'Non-Subsidised' | 'Management';
export type SeatType = BEdSeatType | JBTSeatType;

export const BED_SEAT_TYPES: BEdSeatType[] = ['Normal', 'Management'];
export const JBT_SEAT_TYPES: JBTSeatType[] = ['Subsidised', 'Non-Subsidised', 'Management'];

export function getSeatTypesForCourse(course: CourseType): SeatType[] {
  return course === 'B.Ed' ? [...BED_SEAT_TYPES] : [...JBT_SEAT_TYPES];
}

export interface SeatTypeFees {
  seatType: SeatType;
  additionalFee: number; // premium on top of base tuitionFee
}

export type FeeStatusType = 'Paid' | 'Partly Paid' | 'Unpaid' | 'Overdue';

export type PaymentMode = 'UPI' | 'NEFT' | 'Cash' | 'Demand Draft' | 'Cheque';

export interface FeeBreakdown {
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  libraryFee: number;
  developmentFee: number;
  labFee: number;
}

export type SemesterName = 'Sem 1' | 'Sem 2' | 'Sem 3' | 'Sem 4';
export type SessionName = 'Session 1' | 'Session 2';

// Union type for any academic period label
export type PeriodName = SemesterName | SessionName;

// B.Ed has 4 semesters; JBT has 2 sessions
export const BED_PERIODS: SemesterName[] = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
export const JBT_PERIODS: SessionName[] = ['Session 1', 'Session 2'];

export function getPeriodsForCourse(course: CourseType): PeriodName[] {
  return course === 'B.Ed' ? [...BED_PERIODS] : [...JBT_PERIODS];
}

export function getNextPeriod(course: CourseType, current: PeriodName): PeriodName | null {
  const periods = getPeriodsForCourse(course);
  const idx = periods.indexOf(current as any);
  if (idx === -1 || idx >= periods.length - 1) return null;
  return periods[idx + 1];
}

export function getPeriodYear(period: PeriodName): '1st Year' | '2nd Year' {
  // B.Ed: Sem 1 & 2 → 1st Year, Sem 3 & 4 → 2nd Year
  // JBT: Session 1 → 1st Year, Session 2 → 2nd Year
  if (period === 'Sem 1' || period === 'Sem 2' || period === 'Session 1') return '1st Year';
  return '2nd Year';
}

// Build course-aware period fee slots (B.Ed → 4 semesters, JBT → 2 sessions)
export function buildPeriodFeeSlots(course: CourseType, totalFee: number, paidTillNow: number): SemesterFeeSlot[] {
  const periods = getPeriodsForCourse(course);
  const numPeriods = periods.length;
  const perPeriodFee = totalFee > 0 ? Math.round(totalFee / numPeriods) : 0;
  const dueDates = course === 'B.Ed'
    ? ['2026-10-15', '2027-03-15', '2027-10-15', '2028-03-15']
    : ['2026-10-15', '2027-10-15'];

  return periods.map((period, idx) => {
    const paidForThis = Math.max(0, Math.min(paidTillNow - perPeriodFee * idx, perPeriodFee));
    const remaining = Math.max(0, perPeriodFee - paidForThis);
    let status: FeeStatusType = 'Unpaid';
    if (perPeriodFee > 0 && paidForThis >= perPeriodFee) status = 'Paid';
    else if (paidForThis > 0) status = 'Partly Paid';

    return {
      semester: period,
      year: getPeriodYear(period),
      totalFee: perPeriodFee,
      paidAmount: paidForThis,
      remainingAmount: remaining,
      status,
      dueDate: dueDates[idx] || dueDates[0],
    };
  });
}

export interface SemesterFeeSlot {
  semester: SemesterName | SessionName;
  year: '1st Year' | '2nd Year';
  totalFee: number;
  paidAmount: number;
  remainingAmount: number;
  status: FeeStatusType;
  dueDate: string;
  installments?: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  mode: PaymentMode;
  transactionRef: string;
  remark: string;
  targetSemester?: SemesterName | SessionName;
  discountApplied?: number;
  staffName?: string;
  installmentNo?: number;
}

export interface Student {
  id: string;
  registrationNo: string;
  name: string;
  fatherName: string;
  phone: string;
  whatsappNo?: string;
  email: string;
  course: CourseType;
  stream?: string;
  seatType?: SeatType;
  semester: string;
  currentSemester?: SemesterName | SessionName;
  rollNo: string;
  session: string;
  totalFees: number;
  paidTillNow: number;
  remainingFees: number;
  feeStatus: FeeStatusType;
  nextDueDate: string;
  address: string;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  feeBreakdown: FeeBreakdown;
  semesterFees?: SemesterFeeSlot[];
  paymentHistory: PaymentRecord[];
  discountAmount?: number;
  scholarshipApplied?: string;
  lastReminderSent?: string;
  notes?: string;
}

export interface CourseStat {
  code: CourseType;
  title: string;
  fullName: string;
  duration: string;
  totalStudents: number;
  pendingStudents: number;
  totalExpected: number;
  totalCollected: number;
  totalPending: number;
  iconName: string;
  colorTheme: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  staffName: string;
  type: 'PAYMENT' | 'STUDENT_ADD' | 'STUDENT_EDIT' | 'REMINDER' | 'SETTINGS';
}

export interface CourseFeeRule {
  course: CourseType;
  session: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  libraryFee: number;
  developmentFee: number;
  labFee: number;
  lateFeePerDay: number;
  seatTypeFees: SeatTypeFees[];
  scholarshipDiscounts: {
    SC: number;
    ST: number;
    OBC: number;
    General: number;
  };
}

