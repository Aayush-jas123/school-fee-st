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

export interface SemesterFeeSlot {
  semester: SemesterName;
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
  targetSemester?: SemesterName;
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
  currentSemester?: SemesterName;
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

