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

/**
 * Detect column boundaries from header row text items.
 * Returns array of { label, xMin, xMax } for each detected column.
 */
function detectColumnsFromHeader(headerItems: TextItem[]): Array<{ label: string; xMin: number; xMax: number }> {
  const columns: Array<{ label: string; xMin: number; xMax: number }> = [];
  
  // Sort by x position
  const sorted = [...headerItems].sort((a, b) => a.x - b.x);
  
  for (const item of sorted) {
    const trimmed = item.str.trim();
    if (!trimmed) continue;
    
    // Check if this item overlaps with an existing column
    let placed = false;
    for (const col of columns) {
      const gap = Math.abs(item.x - col.xMax);
      if (gap < 30) {
        // Same column — extend range
        col.xMax = Math.max(col.xMax, item.x + item.w);
        col.label += ' ' + trimmed;
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push({
        label: trimmed,
        xMin: item.x,
        xMax: item.x + item.w,
      });
    }
  }
  
  return columns;
}

/**
 * Assign a data-row text item to a column based on x-coordinate.
 * Uses midpoint of each column's x-range for matching.
 */
function assignToColumn(itemX: number, columns: Array<{ label: string; xMin: number; xMax: number }>): number {
  let bestIdx = -1;
  let bestDist = Infinity;
  
  for (let i = 0; i < columns.length; i++) {
    const mid = (columns[i].xMin + columns[i].xMax) / 2;
    const dist = Math.abs(itemX - mid);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }
  
  return bestIdx;
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

  const allStudents: Student[] = [];
  let globalIdx = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Extract items with positions, filtering out noise
    const rawItems: TextItem[] = textContent.items
      .filter((it: any) => it.str && it.str.trim().length > 0)
      .map((it: any) => ({
        str: it.str.trim(),
        x: Math.round(it.transform[4]),
        y: Math.round(it.transform[5]),
        w: it.width || 0,
      }))
      .filter((it) => {
        const s = it.str;
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
    rawItems.sort((a, b) => b.y - a.y || a.x - b.x);

    const rows: TextItem[][] = [];
    let currentRow: TextItem[] = [];
    let lastY = -9999;

    for (const item of rawItems) {
      if (Math.abs(item.y - lastY) > 4) {
        if (currentRow.length > 0) rows.push([...currentRow]);
        currentRow = [item];
        lastY = item.y;
      } else {
        currentRow.push(item);
      }
    }
    if (currentRow.length > 0) rows.push(currentRow);

    // Find header row and detect column boundaries
    let columns: Array<{ label: string; xMin: number; xMax: number }> = [];
    let headerFound = false;

    for (const row of rows) {
      const mergedText = row.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim();
      if (/S\s*No.*Roll.*Registration/i.test(mergedText) || /S\s*No.*Name.*Father/i.test(mergedText)) {
        columns = detectColumnsFromHeader(row);
        headerFound = true;
        break;
      }
    }

    if (!headerFound || columns.length < 5) {
      // Fallback: skip this page if we can't detect columns
      continue;
    }

    // Merge multi-line rows: when text wraps, continuation rows lack a reg number.
    // Merge them with the previous data row so all column content is together.
    const mergedRows: TextItem[][] = [];
    for (const row of rows) {
      const mergedText = row.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim();
      if (/S\s*No.*Roll.*Registration/i.test(mergedText)) continue;
      if (/S\s*No.*Name.*Father/i.test(mergedText)) continue;
      if (/^Total\s*[\d,.]+$/i.test(mergedText)) continue;

      const hasRegNo = /[A-Z]\d{2}[A-Z]\d{5,8}/i.test(mergedText.replace(/\s+/g, ''));
      if (hasRegNo) {
        mergedRows.push([...row]);
      } else if (mergedRows.length > 0) {
        // Continuation row — merge items into the previous row
        mergedRows[mergedRows.length - 1].push(...row);
      }
    }

    // Parse data rows using column positions
    for (const row of mergedRows) {
      const mergedText = row.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim();
      if (!mergedText || mergedText.length < 5) continue;

      // Must contain a registration number
      if (!/[A-Z]\d{2}[A-Z]\d{5,8}/i.test(mergedText.replace(/\s+/g, ''))) continue;

      // Build column content map: columnIndex -> concatenated text
      const colContent: Record<number, string[]> = {};
      for (const item of row) {
        const colIdx = assignToColumn(item.x, columns);
        if (colIdx >= 0) {
          if (!colContent[colIdx]) colContent[colIdx] = [];
          colContent[colIdx].push(item.str);
        }
      }

      // Extract fields from column content
      const getColText = (idx: number): string => (colContent[idx] || []).join(' ').trim();

      // Column mapping (based on HP University admission report format):
      // Col 0: S.No
      // Col 1: Roll Number  
      // Col 2: Registration No
      // Col 3: Name
      // Col 4: Father's Name
      // Col 5: Total Marks
      // Col 6: Stream
      // Col 7: Total Admission Fee
      // Col 8+: Student Category, Allotted seat category, Counselling Round, Seat Type

      const rollNo = getColText(1);
      const regNoRaw = getColText(2);
      const name = getColText(3);
      const fatherName = getColText(4);
      const streamRaw = getColText(6);
      const feeRaw = getColText(7);

      // Clean registration number
      const regNo = regNoRaw.replace(/\s+/g, '').toUpperCase();
      if (regNo.length < 5) continue;

      // Validate name
      if (!name || name.length < 2) continue;

      // Parse fee
      const feeMatch = feeRaw.match(/(\d{3,6}\.?\d*)/);
      const totalFees = feeMatch ? parseFloat(feeMatch[1]) : 7056;

      // Determine stream
      let stream = 'Arts';
      if (/Non-Medical/i.test(streamRaw)) stream = 'Non-Medical';
      else if (/Medical/i.test(streamRaw)) stream = 'Medical';
      else if (/Commer/i.test(streamRaw)) stream = 'Commerce';
      else if (/Arts/i.test(streamRaw)) stream = 'Arts';

      // Determine category from remaining columns (8+)
      const remainingCols = Object.entries(colContent)
        .filter(([k]) => parseInt(k) >= 8)
        .map(([, v]) => v.join(' '))
        .join(' ');

      let category = 'General';
      if (/SCHEDULED\s*CASTE|\(SC\)/i.test(remainingCols)) category = 'SC';
      else if (/SCHEDULED\s*TRIBE|\(ST\)/i.test(remainingCols)) category = 'ST';
      else if (/OTHER\s*BACKWARD|\(OBC\)/i.test(remainingCols)) category = 'OBC';
      else if (/ECONOMICALLY\s*WEAKER|\(EWS\)/i.test(remainingCols)) category = 'General';

      // Determine seat type
      let seatType = '';
      if (/Management\s*Quota/i.test(remainingCols)) seatType = 'Management Quota';
      else if (/HP\s*Quota/i.test(remainingCols)) seatType = 'HP Quota';
      else if (/Other\s*State/i.test(remainingCols)) seatType = 'Other State';

      // Determine counselling round
      let counsellingRound = '';
      const roundPatterns = [
        /First\s*Round/i, /Second\s*Round/i, /Third\s*Round/i, /Fourth\s*Round/i,
        /Final\s*Mop/i, /On[\s-]*Spot/i, /Open\s*Offline/i, /Management\s*Seat\s*Quota/i,
        /Mop[\s-]*Up/i,
      ];
      for (const pat of roundPatterns) {
        const m = remainingCols.match(pat);
        if (m) { counsellingRound = m[0]; break; }
      }

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
