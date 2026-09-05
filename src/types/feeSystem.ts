export type CourseType = 'JBT' | 'B.Ed';

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
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  libraryFee: number;
  developmentFee: number;
  labFee: number;
  lateFeePerDay: number;
  scholarshipDiscounts: {
    SC: number;
    ST: number;
    OBC: number;
    General: number;
  };
}

