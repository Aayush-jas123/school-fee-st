import type { Student, CourseType, FeeStatusType, FeeBreakdown, SemesterFeeSlot, SemesterName } from '../types/feeSystem';
import * as XLSX from 'xlsx';

// ─── Category Mapping ────────────────────────────────────────────────────────

function mapCategory(raw: string): 'General' | 'OBC' | 'SC' | 'ST' {
  const upper = (raw || '').toUpperCase();
  if (upper.includes('SCHEDULED CASTE') || upper.includes('(SC)')) return 'SC';
  if (upper.includes('SCHEDULED TRIBE') || upper.includes('(ST)')) return 'ST';
  if (upper.includes('OTHER BACKWARD') || upper.includes('(OBC)')) return 'OBC';
  if (upper.includes('ECONOMICALLY WEAKER') || upper.includes('(EWS)')) return 'General';
  return 'General';
}

function mapStream(raw: string): string {
  const s = (raw || '').trim();
  if (s.toLowerCase().includes('non')) return 'Non-Medical';
  if (s.toLowerCase() === 'medical') return 'Medical';
  if (s.toLowerCase() === 'arts') return 'Arts';
  if (s.toLowerCase().includes('comm')) return 'Commerce';
  return s || 'Arts';
}

function generateId(regNo: string, course: string, idx: number): string {
  const clean = regNo.replace(/\s+/g, '').toUpperCase();
  return `IMP-${course}-${clean}-${String(idx).padStart(3, '0')}`;
}

function buildSemesterFees(totalFee: number, paidAmount: number): SemesterFeeSlot[] {
  const perSem = totalFee > 0 ? Math.round(totalFee / 4) : 0;
  let remaining = paidAmount;
  const sems: SemesterName[] = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
  const years: ('1st Year' | '2nd Year')[] = ['1st Year', '1st Year', '2nd Year', '2nd Year'];
  const dueDates = ['2026-10-15', '2027-03-15', '2027-10-15', '2028-03-15'];

  return sems.map((sem, i) => {
    const paid = Math.min(remaining, perSem);
    remaining = Math.max(0, remaining - paid);
    const status: FeeStatusType = paid >= perSem && perSem > 0 ? 'Paid' : paid > 0 ? 'Partly Paid' : 'Unpaid';
    return {
      semester: sem,
      year: years[i],
      totalFee: perSem,
      paidAmount: paid,
      remainingAmount: Math.max(0, perSem - paid),
      status,
      dueDate: dueDates[i],
    };
  });
}

// ─── Raw Record → Student ────────────────────────────────────────────────────

interface RawRecord {
  registrationNo: string;
  rollNo: string;
  name: string;
  fatherName: string;
  stream: string;
  totalFees: number;
  category: string;
  seatType: string;
  counsellingRound: string;
}

function rawRecordToStudent(raw: RawRecord, course: CourseType, session: string, idx: number): Student {
  const regNo = raw.registrationNo.replace(/\s+/g, '').toUpperCase();
  const totalFees = raw.totalFees || 7056;
  const paidTillNow = 0;
  const remainingFees = totalFees;
  const category = mapCategory(raw.category);

  const feeBreakdown: FeeBreakdown = {
    tuitionFee: 0,
    admissionFee: totalFees,
    examFee: 0,
    libraryFee: 0,
    developmentFee: 0,
    labFee: 0,
  };

  return {
    id: generateId(regNo, course, idx),
    registrationNo: regNo,
    name: raw.name.trim().toUpperCase(),
    fatherName: raw.fatherName.trim().toUpperCase(),
    phone: '',
    whatsappNo: '',
    email: '',
    course,
    stream: mapStream(raw.stream),
    semester: 'Sem 1',
    currentSemester: 'Sem 1',
    rollNo: raw.rollNo.replace(/\s+/g, ''),
    session,
    totalFees,
    paidTillNow,
    remainingFees,
    feeStatus: 'Unpaid' as FeeStatusType,
    nextDueDate: '2026-10-15',
    address: '',
    category,
    feeBreakdown,
    semesterFees: buildSemesterFees(totalFees, paidTillNow),
    paymentHistory: [],
    discountAmount: 0,
    notes: raw.counsellingRound ? `Counselling: ${raw.counsellingRound.trim()}` : undefined,
  };
}

// ─── PDF PARSING ─────────────────────────────────────────────────────────────

interface TextItem {
  str: string;
  x: number;
  y: number;
  w: number;
}

export async function parseAdmissionPDF(file: File): Promise<{ students: Student[]; detectedSession: string }> {
  const pdfjsLib = await import('pdfjs-dist');

  // Use CDN worker
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  // Detect session from first page
  const firstPageText = (await pdf.getPage(1).then(p => p.getTextContent())).items
    .map((it: any) => it.str)
    .join(' ');
  const sessionMatch = firstPageText.match(/(\d{4})\s*[-–]\s*(\d{4})/);
  const detectedSession = sessionMatch ? `${sessionMatch[1]}-${sessionMatch[2]}` : '';

  // Header items to filter out
  const HEADER_PATTERNS = [
    /^Page\s*\d+\s*of\s*\d+$/i, /\d{2}\/\d{2}\/\d{4}$/,
    /HIMACHAL\s*PRADESH/i, /SHIMLA/i, /B\.Ed\s*Admission/i,
    /Online\s*Counselling/i, /Shanti\s*College/i, /Kailash\s*Nagar/i,
    /Tehsil\s*Amb/i, /^College\s*Name$/i, /^Total$/i,
    /^Name$/i, /^Father'?s?$/i, /^Marks?$/i, /^Stream$/i,
    /^Student\s*Category$/i, /^Allotted\s*seat$/i, /^category$/i,
    /^Counselling$/i, /^Round$/i, /^Seat\s*Type$/i, /^Fee$/i,
    /^Admission$/i, /^\d{4}-\d{4}$/,
  ];

  const isHeaderItem = (s: string) => HEADER_PATTERNS.some(p => p.test(s));

  // Join text parts intelligently (handles PDF word splitting)
  const joinTextParts = (parts: string[]): string => {
    if (parts.length === 0) return '';
    let result = parts[0];
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const prev = result;
      if (prev.endsWith('-')) result = prev + part; // "Non-" + "Medical" → "Non-Medical"
      else if (part.length === 1) result = prev + part; // "SHUBHA" + "M" → "SHUBHAM"
      else if (/^[a-z]/.test(part)) result = prev + part; // continuation
      else result = prev + ' ' + part; // separate words
    }
    return result;
  };

  // Clean stream: remove leading numbers (Total Marks leaking)
  const cleanStream = (s: string): string => s.replace(/^\d+\s+/, '');

  const allStudents: Student[] = [];
  let globalIdx = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Extract items with positions, filter out headers
    const items: TextItem[] = textContent.items
      .filter((it: any) => it.str && it.str.trim().length > 0)
      .map((it: any) => ({
        str: it.str.trim(),
        x: Math.round(it.transform[4]),
        y: Math.round(it.transform[5]),
        w: it.width || 0,
      }))
      .filter(it => !isHeaderItem(it.str));

    // Find registration number items
    const regNoItems = items.filter(it =>
      /^[A-Z]\d{2}[A-Z]\d{5,8}$/i.test(it.str.replace(/\s+/g, ''))
    );
    if (regNoItems.length === 0) continue;

    // Sort by y descending (top to bottom)
    regNoItems.sort((a, b) => b.y - a.y);

    // Compute midpoints between consecutive reg nos for record boundaries
    const boundaries: number[] = [];
    for (let i = 0; i < regNoItems.length - 1; i++) {
      boundaries.push((regNoItems[i].y + regNoItems[i + 1].y) / 2);
    }

    // Process each record
    for (let i = 0; i < regNoItems.length; i++) {
      const upperBound = i === 0 ? 9999 : boundaries[i - 1];
      const lowerBound = i === regNoItems.length - 1 ? -9999 : boundaries[i];

      // Collect items within y-range, filter out leftover header text
      const recordItems = items.filter(it =>
        it.y <= upperBound && it.y > lowerBound && it.x > 100
      );

      // Assign to columns by x-position
      let sno = '', regNoStr = '';
      const nameParts: string[] = [], fatherParts: string[] = [];
      const streamParts: string[] = [], categoryParts: string[] = [];
      let fee = '';

      for (const it of recordItems) {
        const s = it.str;
        if (it.x < 170) {
          if (/^\d+$/.test(s)) sno = s;
        } else if (it.x < 260) {
          if (/^[A-Z]\d{2}[A-Z]\d{5,8}$/i.test(s.replace(/\s+/g, ''))) {
            regNoStr = s.replace(/\s+/g, '').toUpperCase();
          }
        } else if (it.x < 315) {
          nameParts.push(s);
        } else if (it.x < 390) {
          fatherParts.push(s);
        } else if (it.x >= 410 && it.x < 460) {
          streamParts.push(s);
        } else if (it.x >= 460 && it.x < 510) {
          if (/^\d+\.?\d*$/.test(s)) fee = s;
        } else if (it.x >= 510 && it.x < 580) {
          categoryParts.push(s);
        }
      }

      const name = joinTextParts(nameParts);
      const fatherName = joinTextParts(fatherParts);
      const stream = cleanStream(joinTextParts(streamParts));
      const category = joinTextParts(categoryParts);
      const totalFees = fee ? parseFloat(fee) : 7056;

      if (!name || name.length < 2 || !regNoStr) continue;

      globalIdx++;
      const student = rawRecordToStudent(
        {
          registrationNo: regNoStr,
          rollNo: sno,
          name,
          fatherName,
          stream,
          totalFees,
          category,
          seatType: '',
          counsellingRound: '',
        },
        'B.Ed',
        detectedSession,
        globalIdx,
      );
      allStudents.push(student);
    }
  }

  return { students: allStudents, detectedSession };
}

// ─── EXCEL PARSING ───────────────────────────────────────────────────────────

export async function parseAdmissionExcel(
  file: File,
  course: CourseType,
  session: string,
): Promise<Student[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const allStudents: Student[] = [];
  let globalIdx = 0;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

    for (const row of jsonData) {
      // Try to find registration number from various column name patterns
      const regNo = findField(row, ['Registration No', 'RegistrationNo', 'Reg No', 'RegNo', 'registration_no']) as string;
      if (!regNo) continue;

      const cleanRegNo = String(regNo).replace(/\s+/g, '').toUpperCase();
      if (cleanRegNo.length < 5) continue;

      const rollNo = String(findField(row, ['Roll Number', 'RollNumber', 'Roll No', 'RollNo', 'roll_no']) || '');
      const name = String(findField(row, ['Name', 'Student Name', 'name']) || '').trim().toUpperCase();
      const fatherName = String(findField(row, ["Father's Name", 'Father Name', 'FatherName', "Father's", 'father_name']) || '').trim().toUpperCase();
      const stream = String(findField(row, ['Stream', 'stream']) || 'Arts');
      const totalFees = Number(findField(row, ['Total Admission Fee', 'TotalAdmissionFee', 'Admission Fee', 'total_fees']) || 7056);
      const category = String(findField(row, ['Student Category', 'StudentCategory', 'Category', 'category']) || '');
      const seatType = String(findField(row, ['Seat Type', 'SeatType', 'seat_type']) || '');
      const counsellingRound = String(findField(row, ['Counselling Round', 'CounsellingRound', 'Round', 'counselling_round']) || '');

      if (!name || name.length < 2) continue;

      globalIdx++;
      const student = rawRecordToStudent(
        {
          registrationNo: cleanRegNo,
          rollNo,
          name,
          fatherName,
          stream,
          totalFees,
          category,
          seatType,
          counsellingRound,
        },
        course,
        session,
        globalIdx,
      );
      allStudents.push(student);
    }
  }

  return allStudents;
}

function findField(row: Record<string, any>, possibleKeys: string[]): any {
  for (const key of possibleKeys) {
    // Exact match
    if (row[key] !== undefined && row[key] !== '') return row[key];
    // Case-insensitive match
    const found = Object.keys(row).find(k => k.toLowerCase().replace(/[\s_]/g, '') === key.toLowerCase().replace(/[\s_]/g, ''));
    if (found && row[found] !== undefined && row[found] !== '') return row[found];
  }
  // Fallback: partial match
  for (const key of possibleKeys) {
    const found = Object.keys(row).find(k => k.toLowerCase().includes(key.toLowerCase()));
    if (found && row[found] !== undefined && row[found] !== '') return row[found];
  }
  return '';
}

// ─── IMPORT SUMMARY ──────────────────────────────────────────────────────────

export interface ImportSummary {
  totalRecords: number;
  byStream: Record<string, number>;
  byCategory: Record<string, number>;
  bySeatType: Record<string, number>;
  session: string;
}

export function computeImportSummary(students: Student[], session: string): ImportSummary {
  const byStream: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const bySeatType: Record<string, number> = {};

  for (const s of students) {
    byStream[s.stream || 'Arts'] = (byStream[s.stream || 'Arts'] || 0) + 1;
    byCategory[s.category] = (byCategory[s.category] || 0) + 1;
    const seat = s.notes?.includes('Management') ? 'Management Quota' : s.notes?.includes('HP') ? 'HP Quota' : 'Other';
    bySeatType[seat] = (bySeatType[seat] || 0) + 1;
  }

  return { totalRecords: students.length, byStream, byCategory, bySeatType, session };
}
