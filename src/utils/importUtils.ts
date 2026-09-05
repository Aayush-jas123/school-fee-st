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

  const allStudents: Student[] = [];
  let globalIdx = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Extract items with positions, filtering out noise
    const items = textContent.items
      .filter((it: any) => it.str && it.str.trim().length > 0)
      .map((it: any) => ({
        str: it.str,
        x: Math.round(it.transform[4]),
        y: Math.round(it.transform[5]),
        w: it.width || 0,
      }))
      .filter((it: any) => {
        const s = it.str;
        // Skip headers, footers, page numbers, college name
        if (/^Page\s*\d+\s*of\s*\d+$/i.test(s)) return false;
        if (/\d{2}\/\d{2}\/\d{4}$/.test(s)) return false;
        if (/HIMACHAL\s*PRADESH/i.test(s)) return false;
        if (/SHIMLA/i.test(s)) return false;
        if (/B\.Ed\s*Admission/i.test(s)) return false;
        if (/Online\s*Counselling/i.test(s)) return false;
        if (/Shanti\s*College/i.test(s)) return false;
        if (/Kailash\s*Nagar/i.test(s)) return false;
        if (/Tehsil\s*Amb/i.test(s)) return false;
        if (/^College\s*Name$/i.test(s)) return false;
        if (/^Total$/i.test(s)) return false;
        return true;
      });

    // Group items into rows by y-position proximity
    items.sort((a: any, b: any) => b.y - a.y || a.x - b.x);

    const rows: any[][] = [];
    let currentRow: any[] = [];
    let lastY = -9999;

    for (const item of items) {
      if (Math.abs(item.y - lastY) > 4) {
        if (currentRow.length > 0) rows.push([...currentRow]);
        currentRow = [item];
        lastY = item.y;
      } else {
        currentRow.push(item);
      }
    }
    if (currentRow.length > 0) rows.push(currentRow);

    // Sort each row by x position and merge text
    for (const row of rows) {
      row.sort((a: any, b: any) => a.x - b.x);
      (row as any).mergedText = row.map((it: any) => it.str).join(' ').replace(/\s+/g, ' ').trim();
      (row as any).avgY = row.reduce((s: number, it: any) => s + it.y, 0) / row.length;
    }

    // Sort rows top to bottom
    rows.sort((a: any, b: any) => b.avgY - a.avgY);

    // Parse each row to extract student data
    for (const row of rows) {
      const text = (row as any).mergedText as string;
      if (!text || text.length < 5) continue;

      // Skip header rows
      if (/S\s*No.*Roll.*Registration/i.test(text)) continue;
      if (/S\s*No.*Name.*Father/i.test(text)) continue;
      if (/^Total\s*[\d,.]+$/i.test(text)) continue;

      // Try to find registration number pattern
      const regMatch = text.match(/[A-Z]\s*\d{2}\s*[A-Z]\s*\d{5,8}/i);
      if (!regMatch) continue;

      const regNo = regMatch[0].replace(/\s+/g, '');

      // Extract roll number (number before registration number)
      const beforeReg = text.substring(0, regMatch.index!);
      const rollMatch = beforeReg.match(/(\d{4,7})\s*$/);
      const rollNo = rollMatch ? rollMatch[1] : '';

      // Extract name and father's name (consecutive ALL-CAPS words after roll/reg)
      const afterReg = text.substring(regMatch.index! + regMatch[0].length);

      // Find name: first sequence of ALL-CAPS words (2+ letters each)
      const nameMatch = afterReg.match(/\s*([A-Z][A-Z]+(?:\s+[A-Z][A-Z]+)+)/);
      let name = '';
      let fatherName = '';
      let restAfterNames = afterReg;

      if (nameMatch) {
        const allCapsWords = nameMatch[1].trim().split(/\s+/);
        // Split: first few words = name, remaining = father's name
        // Heuristic: name is typically 1-3 words, father's name is 2-3 words
        const splitPoint = Math.min(Math.ceil(allCapsWords.length / 2), 3);
        name = allCapsWords.slice(0, splitPoint).join(' ');
        fatherName = allCapsWords.slice(splitPoint).join(' ');
        restAfterNames = afterReg.substring(nameMatch.index! + nameMatch[0].length);
      }

      // Extract marks (number, possibly with decimal) — used for validation
      const marksMatch = restAfterNames.match(/(\d{2,3}(?:\.\d+)?)\s*/);
      void marksMatch; // marks available for future use

      // Extract stream
      let stream = 'Arts';
      const streamMatch = restAfterNames.match(/(Non-Medical|Non-Medical|Medical|Arts|Commerce|Commer\s*ce)/i);
      if (streamMatch) {
        stream = streamMatch[1];
      }

      // Extract fee amount
      const feeMatch = restAfterNames.match(/(\d{3,6}\.\d{2})/);
      const totalFees = feeMatch ? parseFloat(feeMatch[1]) : 7056;

      // Extract category
      let category = 'General';
      if (/SCHEDULED\s*CASTE|\(SC\)/i.test(restAfterNames)) category = 'SC';
      else if (/SCHEDULED\s*TRIBE|\(ST\)/i.test(restAfterNames)) category = 'ST';
      else if (/OTHER\s*BACKWARD|\(OBC\)/i.test(restAfterNames)) category = 'OBC';
      else if (/ECONOMICALLY\s*WEAKER|\(EWS\)/i.test(restAfterNames)) category = 'General';

      // Extract seat type
      let seatType = '';
      if (/Management\s*Quota/i.test(restAfterNames)) seatType = 'Management Quota';
      else if (/HP\s*Quota/i.test(restAfterNames)) seatType = 'HP Quota';
      else if (/Other\s*State/i.test(restAfterNames)) seatType = 'Other State';

      // Extract counselling round
      let counsellingRound = '';
      const roundPatterns = [
        /First\s*Round/i, /Second\s*Round/i, /Third\s*Round/i, /Fourth\s*Round/i,
        /Final\s*Mop/i, /On[\s-]*Spot/i, /Open\s*Offline/i, /Management\s*Seat\s*Quota/i,
        /Mop[\s-]*Up/i,
      ];
      for (const pat of roundPatterns) {
        const m = restAfterNames.match(pat);
        if (m) { counsellingRound = m[0]; break; }
      }

      if (!name || name.length < 2) continue;
      if (!regNo || regNo.length < 5) continue;

      globalIdx++;
      const student = rawRecordToStudent(
        {
          registrationNo: regNo,
          rollNo,
          name,
          fatherName,
          stream,
          totalFees,
          category,
          seatType,
          counsellingRound,
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
