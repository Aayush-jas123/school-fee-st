import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Student, AuditLogEntry, CourseFeeRule, FeeBreakdown, PaymentRecord, SeatTypeFees } from '../types/feeSystem';
import { buildPeriodFeeSlots } from '../types/feeSystem';
import { INITIAL_STUDENTS } from '../data/mockStudents';
import {
  getStoredStudents,
  saveStoredStudents,
  getStoredAuditLogs,
  addAuditLog as addStoredAuditLog,
  getStoredFeeRules,
  saveFeeRules as saveStoredFeeRules,
} from '../utils/storage';

// Helper to sanitize dates for Postgres DATE columns (must be YYYY-MM-DD or null)
const sanitizeDate = (dateStr?: string | null): string | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed || trimmed === 'N/A' || trimmed === 'null' || trimmed === 'undefined') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = Date.parse(trimmed);
  if (isNaN(parsed)) return null;
  return new Date(parsed).toISOString().slice(0, 10);
};

// Safe JSON parser helper for JSONB columns
const parseJsonField = <T>(val: any, fallback: T): T => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val as T;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

// Helper to convert database row (snake_case) to Student interface (camelCase)
const mapRowToStudent = (row: any): Student => {
  const feeBreakdown = parseJsonField<FeeBreakdown>(row.fee_breakdown, {
    tuitionFee: 0,
    admissionFee: 0,
    examFee: 0,
    libraryFee: 0,
    developmentFee: 0,
    labFee: 0,
  });

  const parsedPaymentHistory = parseJsonField<PaymentRecord[]>(row.payment_history, []);
  const parsedSemesterFees = parseJsonField<any>(row.semester_fees, null);

  return {
    id: row.id,
    registrationNo: row.registration_no,
    name: row.name,
    fatherName: row.father_name,
    phone: row.phone || '',
    whatsappNo: row.whatsapp_no || row.phone || '',
    email: row.email || '',
    course: row.course,
    stream: row.stream || 'Arts',
    seatType: row.seat_type || undefined,
    semester: row.semester,
    currentSemester: row.current_semester || row.semester || (row.course === 'JBT' ? 'Session 1' : 'Sem 1'),
    rollNo: row.roll_no || '',
    session: row.session,
    totalFees: Number(row.total_fees || 0),
    paidTillNow: Number(row.paid_till_now || 0),
    remainingFees: Number(row.remaining_fees || 0),
    feeStatus: row.fee_status,
    nextDueDate: row.next_due_date || '',
    address: row.address || '',
    category: row.category || 'General',
    feeBreakdown,
    semesterFees: parsedSemesterFees || buildPeriodFeeSlots(row.course, Number(row.total_fees || 0), Number(row.paid_till_now || 0)),
    paymentHistory: parsedPaymentHistory,
    discountAmount: Number(row.discount_amount || 0),
    scholarshipApplied: row.scholarship_applied || undefined,
    lastReminderSent: row.last_reminder_sent || undefined,
    notes: row.notes || undefined,
  };
};

// Helper to convert Student interface to database row format (snake_case)
// NOTE: seat_type is not a column in public.students table; stored in memory/metadata
const mapStudentToRow = (student: Student) => {
  return {
    id: student.id || `STU-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    registration_no: (student.registrationNo || `REG-${Date.now()}`).trim(),
    name: student.name || 'Unknown',
    father_name: student.fatherName || '-',
    phone: student.phone || '0',
    whatsapp_no: student.whatsappNo || student.phone || '',
    email: student.email || '',
    course: (student.course === 'JBT' || student.course === 'B.Ed') ? student.course : 'B.Ed',
    stream: student.stream || 'Arts',
    semester: student.semester || (student.course === 'JBT' ? 'Session 1' : 'Sem 1'),
    current_semester: student.currentSemester || student.semester || (student.course === 'JBT' ? 'Session 1' : 'Sem 1'),
    roll_no: student.rollNo || '-',
    session: student.session || '2026-2027',
    total_fees: Number(student.totalFees) || 0,
    paid_till_now: Number(student.paidTillNow) || 0,
    remaining_fees: Number(student.remainingFees) || 0,
    fee_status: ['Paid', 'Partly Paid', 'Unpaid', 'Overdue'].includes(student.feeStatus) ? student.feeStatus : 'Unpaid',
    next_due_date: sanitizeDate(student.nextDueDate),
    address: student.address || '',
    category: ['General', 'OBC', 'SC', 'ST'].includes(student.category) ? student.category : 'General',
    fee_breakdown: student.feeBreakdown || {},
    semester_fees: student.semesterFees || [],
    payment_history: student.paymentHistory || [],
    discount_amount: Number(student.discountAmount) || 0,
    scholarship_applied: student.scholarshipApplied || null,
    last_reminder_sent: student.lastReminderSent || null,
    notes: student.notes || null,
    updated_at: new Date().toISOString(),
  };
};

// Intelligently merge local and remote student lists so that no imported or recorded data is ever lost
export function mergeStudentLists(localList: Student[], remoteList: Student[]): Student[] {
  if (!localList || localList.length === 0) return remoteList || [];
  if (!remoteList || remoteList.length === 0) return localList || [];

  const map = new Map<string, Student>();
  const getKey = (s: Student) => (s.registrationNo ? s.registrationNo.trim().toUpperCase() : s.id);

  // First populate with local
  for (const student of localList) {
    const key = getKey(student);
    if (key) map.set(key, student);
  }

  // Merge remote
  for (const remote of remoteList) {
    const key = getKey(remote);
    if (!key) continue;

    const local = map.get(key);
    if (!local) {
      // Remote has student that local does not have
      map.set(key, remote);
    } else {
      // Both exist: merge without losing payments or local edits
      const localPaymentsCount = local.paymentHistory?.length || 0;
      const remotePaymentsCount = remote.paymentHistory?.length || 0;

      let preferred = remote;
      if (localPaymentsCount > remotePaymentsCount) {
        preferred = local;
      } else if (localPaymentsCount === remotePaymentsCount) {
        preferred = { ...remote, ...local };
      }

      // Merge payment histories deduplicated by id or transactionRef
      const paymentMap = new Map<string, PaymentRecord>();
      for (const p of (remote.paymentHistory || [])) {
        paymentMap.set(p.id || p.transactionRef, p);
      }
      for (const p of (local.paymentHistory || [])) {
        paymentMap.set(p.id || p.transactionRef, p);
      }
      const mergedPayments = Array.from(paymentMap.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      map.set(key, {
        ...preferred,
        paymentHistory: mergedPayments,
        seatType: local.seatType || remote.seatType,
        stream: local.stream || remote.stream || 'Arts',
        currentSemester: local.currentSemester || remote.currentSemester || 'Sem 1',
      });
    }
  }

  return Array.from(map.values());
}

// Track whether Supabase is actively responding or unavailable (e.g. invalid host / offline)
let isSupabaseReachable: boolean | null = null;

export function getSupabaseReachable(): boolean {
  return isSupabaseReachable === true;
}

// Async Student Operations
export async function fetchStudentsFromDB(): Promise<Student[]> {
  const localStudents = getStoredStudents();

  if (isSupabaseConfigured() && supabase && isSupabaseReachable !== false) {
    try {
      // First, test connection with a lightweight check
      const { data: existing, error: checkError } = await supabase.from('students').select('id').limit(1);

      if (checkError) {
        console.warn('[Supabase] Cloud database unavailable, using LocalStorage:', checkError.message);
        isSupabaseReachable = false;
        return localStudents;
      }

      // Connection succeeded
      isSupabaseReachable = true;

      // If the cloud table is completely empty (first-time setup)
      if (Array.isArray(existing) && existing.length === 0) {
        console.log('[Supabase] Cloud table empty, seeding with existing local students or defaults...');
        const toSeed = localStudents.length > 0 ? localStudents : INITIAL_STUDENTS;
        await syncAllStudentsToDB(toSeed);
        return toSeed;
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Fetch error, falling back to local storage:', error.message);
        return localStudents;
      }

      if (data && data.length > 0) {
        const fetchedStudents = data.map(mapRowToStudent);
        // CRITICAL FIX: Merge cloud records with local records so imported records are never wiped
        const mergedStudents = mergeStudentLists(localStudents, fetchedStudents);
        saveStoredStudents(mergedStudents);

        // If local had records not yet in cloud, push merged dataset to cloud in background
        if (mergedStudents.length > fetchedStudents.length) {
          console.log(`[Supabase] Pushing ${mergedStudents.length - fetchedStudents.length} local records to cloud...`);
          syncAllStudentsToDB(mergedStudents).catch((e) => console.warn('[Supabase] Background sync failed:', e));
        }

        return mergedStudents;
      }
    } catch (err: any) {
      console.warn('[Supabase] Connection failed, falling back to local storage:', err?.message || err);
      isSupabaseReachable = false;
    }
  }
  return localStudents;
}

export async function syncAllStudentsToDB(studentsList?: Student[]): Promise<boolean> {
  const studentsToSync = studentsList && studentsList.length > 0 ? studentsList : getStoredStudents();
  if (studentsToSync.length === 0) return true;

  if (isSupabaseConfigured() && supabase && isSupabaseReachable !== false) {
    try {
      console.log(`[Supabase] Syncing ${studentsToSync.length} students to Supabase in batches...`);
      const rows = studentsToSync.map(mapStudentToRow);
      const BATCH_SIZE = 50;
      let anyError = false;

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('students').upsert(batch, { onConflict: 'registration_no' });
        if (error) {
          console.error(`[Supabase] Error syncing batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message, error.details);
          anyError = true;
        }
      }

      if (!anyError) {
        console.log(`[Supabase] Successfully synced all ${studentsToSync.length} students`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[Supabase] Failed to sync all students:', err);
      return false;
    }
  } else {
    console.log('[Supabase] Not configured or offline, skipping sync (data safely stored locally)');
    return true;
  }
}

export async function saveStudentToDB(student: Student): Promise<void> {
  // Always update LocalStorage immediately for responsive UI
  const current = getStoredStudents();
  const studentKey = (student.registrationNo || '').trim().toUpperCase();
  const index = current.findIndex(
    (s) => s.id === student.id || (studentKey && (s.registrationNo || '').trim().toUpperCase() === studentKey)
  );

  let updatedList: Student[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = { ...current[index], ...student };
  } else {
    updatedList = [student, ...current];
  }
  saveStoredStudents(updatedList);

  // Sync to Supabase if available and reachable
  if (isSupabaseConfigured() && supabase && isSupabaseReachable !== false) {
    try {
      const row = mapStudentToRow(student);
      const { error } = await supabase.from('students').upsert(row, { onConflict: 'registration_no' });
      if (error) console.error('Error saving student to Supabase:', error.message, error.details);
    } catch (err) {
      console.error('Failed to sync student to Supabase:', err);
    }
  }
}

// Async Audit Log Operations
export async function fetchAuditLogsFromDB(): Promise<AuditLogEntry[]> {
  if (isSupabaseConfigured() && supabase && isSupabaseReachable !== false) {
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

  if (isSupabaseConfigured() && supabase && isSupabaseReachable !== false) {
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
  if (isSupabaseConfigured() && supabase && isSupabaseReachable !== false) {
    try {
      const { data, error } = await supabase.from('fee_rules').select('*');
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          course: row.course,
          session: row.session || '2026-2027',
          tuitionFee: Number(row.tuition_fee),
          admissionFee: Number(row.admission_fee),
          examFee: Number(row.exam_fee),
          libraryFee: Number(row.library_fee),
          developmentFee: Number(row.development_fee),
          labFee: Number(row.lab_fee),
          lateFeePerDay: Number(row.late_fee_per_day),
          seatTypeFees: (typeof row.seat_type_fees === 'string' ? JSON.parse(row.seat_type_fees) : row.seat_type_fees) as SeatTypeFees[] || [],
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

  if (isSupabaseConfigured() && supabase && isSupabaseReachable !== false) {
    try {
      const rows = rules.map((r) => ({
        course: r.course,
        session: r.session,
        tuition_fee: r.tuitionFee,
        admission_fee: r.admissionFee,
        exam_fee: r.examFee,
        library_fee: r.libraryFee,
        development_fee: r.developmentFee,
        lab_fee: r.labFee,
        late_fee_per_day: r.lateFeePerDay,
        seat_type_fees: JSON.stringify(r.seatTypeFees || []),
        scholarship_discounts: r.scholarshipDiscounts,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('fee_rules').upsert(rows);
    } catch (err) {
      console.error('Failed to sync fee rules to Supabase:', err);
    }
  }
}
