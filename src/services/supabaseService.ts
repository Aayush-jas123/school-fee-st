import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Student, AuditLogEntry, CourseFeeRule, FeeBreakdown, PaymentRecord } from '../types/feeSystem';
import {
  getStoredStudents,
  saveStoredStudents,
  getStoredAuditLogs,
  addAuditLog as addStoredAuditLog,
  getStoredFeeRules,
  saveFeeRules as saveStoredFeeRules,
} from '../utils/storage';

// Helper to convert database row (snake_case) to Student interface (camelCase)
const mapRowToStudent = (row: any): Student => {
  return {
    id: row.id,
    registrationNo: row.registration_no,
    name: row.name,
    fatherName: row.father_name,
    phone: row.phone,
    email: row.email || '',
    course: row.course,
    semester: row.semester,
    rollNo: row.roll_no,
    session: row.session,
    totalFees: Number(row.total_fees || 0),
    paidTillNow: Number(row.paid_till_now || 0),
    remainingFees: Number(row.remaining_fees || 0),
    feeStatus: row.fee_status,
    nextDueDate: row.next_due_date || '',
    address: row.address || '',
    category: row.category || 'General',
    feeBreakdown: (row.fee_breakdown as FeeBreakdown) || {
      tuitionFee: 0,
      admissionFee: 0,
      examFee: 0,
      libraryFee: 0,
      developmentFee: 0,
      labFee: 0,
    },
    paymentHistory: (row.payment_history as PaymentRecord[]) || [],
    discountAmount: Number(row.discount_amount || 0),
    scholarshipApplied: row.scholarship_applied || undefined,
    lastReminderSent: row.last_reminder_sent || undefined,
    notes: row.notes || undefined,
  };
};

// Helper to convert Student interface to database row format (snake_case)
const mapStudentToRow = (student: Student) => {
  return {
    id: student.id,
    registration_no: student.registrationNo,
    name: student.name,
    father_name: student.fatherName,
    phone: student.phone,
    email: student.email,
    course: student.course,
    semester: student.semester,
    roll_no: student.rollNo,
    session: student.session,
    total_fees: student.totalFees,
    paid_till_now: student.paidTillNow,
    remaining_fees: student.remainingFees,
    fee_status: student.feeStatus,
    next_due_date: student.nextDueDate || null,
    address: student.address,
    category: student.category,
    fee_breakdown: student.feeBreakdown,
    payment_history: student.paymentHistory,
    discount_amount: student.discountAmount || 0,
    scholarship_applied: student.scholarshipApplied || null,
    last_reminder_sent: student.lastReminderSent || null,
    notes: student.notes || null,
    updated_at: new Date().toISOString(),
  };
};

// Async Student Operations
export async function fetchStudentsFromDB(): Promise<Student[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, falling back to local storage:', error.message);
        return getStoredStudents();
      }

      if (data && data.length > 0) {
        const students = data.map(mapRowToStudent);
        saveStoredStudents(students); // Sync to local storage backup
        return students;
      }
    } catch (err) {
      console.warn('Supabase connection failed, falling back to local storage:', err);
    }
  }
  return getStoredStudents();
}

export async function saveStudentToDB(student: Student): Promise<void> {
  // Always update LocalStorage immediately for responsive UI
  const current = getStoredStudents();
  const index = current.findIndex((s) => s.id === student.id);
  let updatedList: Student[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = student;
  } else {
    updatedList = [student, ...current];
  }
  saveStoredStudents(updatedList);

  // Sync to Supabase if available
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = mapStudentToRow(student);
      const { error } = await supabase.from('students').upsert(row);
      if (error) console.error('Error saving student to Supabase:', error.message);
    } catch (err) {
      console.error('Failed to sync student to Supabase:', err);
    }
  }
}

// Async Audit Log Operations
export async function fetchAuditLogsFromDB(): Promise<AuditLogEntry[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as AuditLogEntry[];
      }
    } catch (err) {
      console.warn('Audit logs fetch failed from Supabase:', err);
    }
  }
  return getStoredAuditLogs();
}

export async function addAuditLogToDB(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  addStoredAuditLog(entry);

  if (isSupabaseConfigured() && supabase) {
    try {
      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        action: entry.action,
        details: entry.details,
        staff_name: entry.staffName,
        type: entry.type,
      };
      await supabase.from('audit_logs').insert([newLog]);
    } catch (err) {
      console.error('Error inserting audit log to Supabase:', err);
    }
  }
}

// Async Fee Rules Operations
export async function fetchFeeRulesFromDB(): Promise<CourseFeeRule[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('fee_rules').select('*');
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          course: row.course,
          tuitionFee: Number(row.tuition_fee),
          admissionFee: Number(row.admission_fee),
          examFee: Number(row.exam_fee),
          libraryFee: Number(row.library_fee),
          developmentFee: Number(row.development_fee),
          labFee: Number(row.lab_fee),
          lateFeePerDay: Number(row.late_fee_per_day),
          scholarshipDiscounts: row.scholarship_discounts,
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch fee rules from Supabase:', err);
    }
  }
  return getStoredFeeRules();
}

export async function saveFeeRulesToDB(rules: CourseFeeRule[]): Promise<void> {
  saveStoredFeeRules(rules);

  if (isSupabaseConfigured() && supabase) {
    try {
      const rows = rules.map((r) => ({
        course: r.course,
        tuition_fee: r.tuitionFee,
        admission_fee: r.admissionFee,
        exam_fee: r.examFee,
        library_fee: r.libraryFee,
        development_fee: r.developmentFee,
        lab_fee: r.labFee,
        late_fee_per_day: r.lateFeePerDay,
        scholarship_discounts: r.scholarshipDiscounts,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('fee_rules').upsert(rows);
    } catch (err) {
      console.error('Failed to sync fee rules to Supabase:', err);
    }
  }
}
