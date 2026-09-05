import type { Student, AuditLogEntry, CourseFeeRule } from '../types/feeSystem';
import { INITIAL_STUDENTS } from '../data/mockStudents';

const STUDENTS_STORAGE_KEY = 'school_fee_system_students_v3';
const AUDIT_LOG_STORAGE_KEY = 'school_fee_system_audit_v2';
const FEE_RULES_STORAGE_KEY = 'school_fee_system_rules_v2';

export const DEFAULT_FEE_RULES: CourseFeeRule[] = [
  {
    course: 'JBT',
    tuitionFee: 45000,
    admissionFee: 5000,
    examFee: 4000,
    libraryFee: 3000,
    developmentFee: 5000,
    labFee: 3000,
    lateFeePerDay: 50,
    scholarshipDiscounts: {
      SC: 10000,
      ST: 10000,
      OBC: 5000,
      General: 0,
    },
  },
  {
    course: 'B.Ed',
    tuitionFee: 55000,
    admissionFee: 6000,
    examFee: 5000,
    libraryFee: 4000,
    developmentFee: 5000,
    labFee: 3000,
    lateFeePerDay: 75,
    scholarshipDiscounts: {
      SC: 12000,
      ST: 12000,
      OBC: 6000,
      General: 0,
    },
  },
];

// Initial default audit log entries
const DEFAULT_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'LOG-1001',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    action: 'System Initialized',
    details: 'Institutional Fee Management portal active with JBT & B.Ed modules',
    staffName: 'System Admin',
    type: 'SETTINGS',
  },
  {
    id: 'LOG-1002',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    action: 'Payment Recorded',
    details: 'Collected ₹35,000 via UPI for student Aarav Sharma (JBT)',
    staffName: 'Dr. Rajesh Sharma',
    type: 'PAYMENT',
  },
];

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading students from localStorage:', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students to localStorage:', err);
  }
}

export function getStoredAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(DEFAULT_AUDIT_LOG));
      return DEFAULT_AUDIT_LOG;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading audit logs:', err);
    return DEFAULT_AUDIT_LOG;
  }
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  try {
    const current = getStoredAuditLogs();
    const newLog: AuditLogEntry = {
      ...entry,
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...current];
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error writing audit log:', err);
  }
}

export function getStoredFeeRules(): CourseFeeRule[] {
  try {
    const raw = localStorage.getItem(FEE_RULES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FEE_RULES_STORAGE_KEY, JSON.stringify(DEFAULT_FEE_RULES));
      return DEFAULT_FEE_RULES;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_FEE_RULES;
  }
}

export function saveFeeRules(rules: CourseFeeRule[]): void {
  try {
    localStorage.setItem(FEE_RULES_STORAGE_KEY, JSON.stringify(rules));
  } catch (err) {
    console.error('Error saving fee rules:', err);
  }
}

export function resetToDemoData(): void {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(DEFAULT_AUDIT_LOG));
    localStorage.setItem(FEE_RULES_STORAGE_KEY, JSON.stringify(DEFAULT_FEE_RULES));
  } catch (err) {
    console.error('Error resetting demo data:', err);
  }
}
