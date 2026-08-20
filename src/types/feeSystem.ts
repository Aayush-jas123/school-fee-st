export type CourseType = 'JBT' | 'B.Ed' | 'D.El.Ed';

export type FeeStatusType = 'Paid' | 'Partly Paid' | 'Unpaid' | 'Overdue';

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
  mode: 'UPI' | 'NEFT' | 'Cash' | 'Demand Draft' | 'Cheque';
  transactionRef: string;
  remark: string;
}

export interface Student {
  id: string;
  registrationNo: string;
  name: string;
  fatherName: string;
  phone: string;
  email: string;
  course: CourseType;
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
