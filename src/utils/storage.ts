import type { Student, AuditLogEntry, CourseFeeRule } from '../types/feeSystem';
import { INITIAL_STUDENTS } from '../data/mockStudents';

const STUDENTS_STORAGE_KEY = 'school_fee_system_students_v3';
const STUDENTS_BACKUP_KEY = 'school_fee_system_students_recovery_bak';
const AUDIT_LOG_STORAGE_KEY = 'school_fee_system_audit_v2';
const FEE_RULES_STORAGE_KEY = 'school_fee_system_rules_v2';

export const DEFAULT_FEE_RULES: CourseFeeRule[] = [
  {
    course: 'JBT',
    session: '2026-2027',
    tuitionFee: 45000,
    admissionFee: 5000,
    examFee: 4000,
    libraryFee: 3000,
    developmentFee: 5000,
    labFee: 3000,
    lateFeePerDay: 50,
    seatTypeFees: [
      { seatType: 'Subsidised', additionalFee: 0 },
      { seatType: 'Non-Subsidised', additionalFee: 15000 },
      { seatType: 'Management', additionalFee: 30000 },
    ],
    scholarshipDiscounts: {
      SC: 10000,
      ST: 10000,
      OBC: 5000,
      General: 0,
    },
  },
  {
    course: 'B.Ed',
    session: '2026-2027',
    tuitionFee: 55000,
    admissionFee: 6000,
    examFee: 5000,
    libraryFee: 4000,
    developmentFee: 5000,
    labFee: 3000,
    lateFeePerDay: 75,
    seatTypeFees: [
      { seatType: 'Normal', additionalFee: 0 },
      { seatType: 'Management', additionalFee: 25000 },
    ],
    scholarshipDiscounts: {
      SC: 12000,
      ST: 12000,
      OBC: 6000,
      General: 0,
    },
  },
];

// Initial default audit log entries - empty by default to prevent hardcoded transactions
export const DEFAULT_AUDIT_LOG: AuditLogEntry[] = [];

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`[Storage] Loaded ${parsed.length} students from localStorage`);
        return parsed;
      }
    }

    // Try secondary recovery backup before falling back to mock data
    const backupRaw = localStorage.getItem(STUDENTS_BACKUP_KEY);
    if (backupRaw) {
      const backupParsed = JSON.parse(backupRaw);
      if (Array.isArray(backupParsed) && backupParsed.length > 0) {
        console.log(`[Storage] Recovered ${backupParsed.length} students from recovery backup key`);
        localStorage.setItem(STUDENTS_STORAGE_KEY, backupRaw);
        return backupParsed;
      }
    }

    console.log('[Storage] No data in localStorage, initializing with INITIAL_STUDENTS');
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STUDENTS_BACKUP_KEY, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  } catch (err) {
    console.error('Error loading students from localStorage:', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  try {
    if (!Array.isArray(students)) return;
    const serialized = JSON.stringify(students);
    localStorage.setItem(STUDENTS_STORAGE_KEY, serialized);
    if (students.length > 0) {
      localStorage.setItem(STUDENTS_BACKUP_KEY, serialized);
    }
    console.log(`[Storage] Saved ${students.length} students to localStorage & recovery backup`);
  } catch (err) {
    console.error('Error saving students to localStorage:', err);
  }
}

export function getStoredAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((l) => l.id !== 'LOG-1001' && l.id !== 'LOG-1002');
    }
    return [];
  } catch (err) {
    console.error('Error loading audit logs:', err);
    return [];
  }
}

export function saveStoredAuditLogs(logs: AuditLogEntry[]): void {
  try {
    if (!Array.isArray(logs)) return;
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(logs.slice(0, 300)));
  } catch (err) {
    console.error('Error saving audit logs to localStorage:', err);
  }
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): AuditLogEntry {
  try {
    const current = getStoredAuditLogs();
    const uniqueSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const newLog: AuditLogEntry = {
      ...entry,
      id: entry.id || `LOG-${Date.now()}-${uniqueSuffix}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      staffName: entry.staffName || 'System Admin',
    };
    // Keep max 300 logs to prevent localStorage quota exhaustion
    const updated = [newLog, ...current.filter((l) => l.id !== newLog.id)].slice(0, 300);
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  } catch (err) {
    console.error('Error writing audit log:', err);
    return {
      ...entry,
      id: entry.id || `LOG-${Date.now()}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      staffName: entry.staffName || 'System Admin',
    };
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
    localStorage.setItem(STUDENTS_BACKUP_KEY, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(DEFAULT_AUDIT_LOG));
    localStorage.setItem(FEE_RULES_STORAGE_KEY, JSON.stringify(DEFAULT_FEE_RULES));
  } catch (err) {
    console.error('Error resetting demo data:', err);
  }
}
