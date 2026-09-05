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

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  mode: PaymentMode;
  transactionRef: string;
  remark: string;
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

