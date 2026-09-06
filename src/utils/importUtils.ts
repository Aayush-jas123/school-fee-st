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

  const allStudents: Student[] = [];
  let globalIdx = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Extract ALL items with positions
    const allItems: TextItem[] = textContent.items
      .filter((it: any) => it.str && it.str.trim().length > 0)
      .map((it: any) => ({
        str: it.str.trim(),
        x: Math.round(it.transform[4]),
        y: Math.round(it.transform[5]),
        w: it.width || 0,
      }));

    // Filter out noise items
    const items = allItems.filter((it) => {
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

    // ── Strategy: Find registration number items, then use x-position to extract name/father ──
    
    // Sort all items by y (top to bottom), then x (left to right)
    items.sort((a, b) => b.y - a.y || a.x - b.x);

    // Group items into visual rows using a generous y-tolerance
    const rows: TextItem[][] = [];
    let currentRow: TextItem[] = [];
    let lastY = -9999;

    for (const item of items) {
      if (Math.abs(item.y - lastY) > 6) {
        if (currentRow.length > 0) rows.push([...currentRow]);
        currentRow = [item];
        lastY = item.y;
      } else {
        currentRow.push(item);
      }
    }
    if (currentRow.length > 0) rows.push(currentRow);

    // For each row, sort items by x position
    for (const row of rows) {
      row.sort((a, b) => a.x - b.x);
    }

    // Find the header row to detect column x-ranges
    // The header might span multiple visual rows, so check consecutive pairs
    let nameColRange = { min: 0, max: 0 };
    let fatherColRange = { min: 0, max: 0 };
    let headerDetected = false;

    for (let i = 0; i < rows.length; i++) {
      const text = rows[i].map(it => it.str).join(' ');
      // Check single row
      if (/Name.*Father|Father.*Name/i.test(text) && /Reg|Roll/i.test(text)) {
        // Found header in single row — detect name/father columns
        const nameItem = rows[i].find(it => /^Name$/i.test(it.str));
        const fatherItem = rows[i].find(it => /Father/i.test(it.str));
        if (nameItem && fatherItem) {
          // Name column: from name item x to father item x
          nameColRange = { min: nameItem.x - 10, max: fatherItem.x - 5 };
          // Father column: from father item x to next column
          const nextItem = rows[i].find(it => it.x > fatherItem.x + 20 && !/Father/i.test(it.str));
          fatherColRange = { min: fatherItem.x - 10, max: nextItem ? nextItem.x - 5 : fatherItem.x + 200 };
          headerDetected = true;
          break;
        }
      }
      // Check two consecutive rows merged (header might be split)
      if (i + 1 < rows.length) {
        const mergedText = [...rows[i], ...rows[i + 1]].map(it => it.str).join(' ');
        if (/Name.*Father|Father.*Name/i.test(mergedText) && /Reg|Roll/i.test(mergedText)) {
          const allHeaderItems = [...rows[i], ...rows[i + 1]].sort((a, b) => a.x - b.x);
          const nameItem = allHeaderItems.find(it => /^Name$/i.test(it.str));
          const fatherItem = allHeaderItems.find(it => /Father/i.test(it.str));
          if (nameItem && fatherItem) {
            nameColRange = { min: nameItem.x - 10, max: fatherItem.x - 5 };
            const nextItem = allHeaderItems.find(it => it.x > fatherItem.x + 20 && !/Father/i.test(it.str));
            fatherColRange = { min: fatherItem.x - 10, max: nextItem ? nextItem.x - 5 : fatherItem.x + 200 };
            headerDetected = true;
            break;
          }
        }
      }
    }

    // Process data rows
    // Merge continuation rows (rows without reg number) with previous data row
    const mergedRows: TextItem[][] = [];
    for (const row of rows) {
      const text = row.map(it => it.str).join(' ');
      // Skip header rows
      if (/S\s*No.*Roll.*Reg|Name.*Father/i.test(text)) continue;
      if (/^Total\s*[\d,.]+$/i.test(text)) continue;

      const hasRegNo = row.some(it => /[A-Z]\d{2}[A-Z]\d{5,8}/i.test(it.str.replace(/\s+/g, '')));
      if (hasRegNo) {
        mergedRows.push([...row]);
      } else if (mergedRows.length > 0) {
        // Continuation row — merge into previous
        mergedRows[mergedRows.length - 1].push(...row);
      }
    }

    for (const row of mergedRows) {
      // Sort by x
      row.sort((a, b) => a.x - b.x);

      // Find registration number item
      const regItem = row.find(it => /[A-Z]\d{2}[A-Z]\d{5,8}/i.test(it.str.replace(/\s+/g, '')));
      if (!regItem) continue;

      const regNo = regItem.str.replace(/\s+/g, '').toUpperCase();
      if (regNo.length < 5) continue;

      // Find roll number: item just before reg number (numeric)
      const regIdx = row.indexOf(regItem);
      let rollNo = '';
      if (regIdx > 0) {
        const prevItem = row[regIdx - 1];
        if (/^\d{4,7}$/.test(prevItem.str)) {
          rollNo = prevItem.str;
        }
      }

      // Extract name and father's name using column ranges
      let name = '';
      let fatherName = '';

      if (headerDetected && nameColRange.max > 0) {
        // Use detected column ranges
        const nameItems = row.filter(it => it.x >= nameColRange.min && it.x < nameColRange.max && it !== regItem);
        const fatherItems = row.filter(it => it.x >= fatherColRange.min && it.x < fatherColRange.max);
        name = nameItems.map(it => it.str).join(' ').trim();
        fatherName = fatherItems.map(it => it.str).join(' ').trim();
      } else {
        // Fallback: use x-position heuristic relative to reg number
        // Name is typically 50-200px to the right of reg number
        // Father's name is typically 200-400px to the right of reg number
        const itemsAfterReg = row.filter(it => it.x > regItem.x + regItem.w && it !== regItem);
        
        // Find stream/fee items to determine boundary
        const streamItem = itemsAfterReg.find(it => /Medical|Non|Arts|Commer/i.test(it.str));
        const feeItem = itemsAfterReg.find(it => /\d{4,5}\.?\d*$/i.test(it.str));
        const boundaryX = streamItem ? streamItem.x : feeItem ? feeItem.x - 50 : regItem.x + 350;

        const nameFatherItems = itemsAfterReg.filter(it => it.x < boundaryX);
        
        // Split name/father: find the midpoint of ALL-CAPS word items
        const capsItems = nameFatherItems.filter(it => /^[A-Z][A-Z\s]*$/.test(it.str) && it.str.length >= 2);
        if (capsItems.length >= 2) {
          const midX = (capsItems[0].x + capsItems[capsItems.length - 1].x) / 2;
          const nameItems = capsItems.filter(it => it.x < midX);
          const fatherItems = capsItems.filter(it => it.x >= midX);
          name = nameItems.map(it => it.str).join(' ').trim();
          fatherName = fatherItems.map(it => it.str).join(' ').trim();
        } else if (capsItems.length === 1) {
          name = capsItems[0].str;
        }
      }

      if (!name || name.length < 2) continue;

      // Extract stream
      const allText = row.map(it => it.str).join(' ');
      let stream = 'Arts';
      if (/Non-Medical/i.test(allText)) stream = 'Non-Medical';
      else if (/Medical/i.test(allText)) stream = 'Medical';
      else if (/Commer/i.test(allText)) stream = 'Commerce';
      else if (/Arts/i.test(allText)) stream = 'Arts';

      // Extract fee
      const feeMatch = allText.match(/(\d{4,5}\.\d{2})/);
      const totalFees = feeMatch ? parseFloat(feeMatch[1]) : 7056;

      // Determine category
      let category = 'General';
      if (/SCHEDULED\s*CASTE|\(SC\)/i.test(allText)) category = 'SC';
      else if (/SCHEDULED\s*TRIBE|\(ST\)/i.test(allText)) category = 'ST';
      else if (/OTHER\s*BACKWARD|\(OBC\)/i.test(allText)) category = 'OBC';
      else if (/ECONOMICALLY\s*WEAKER|\(EWS\)/i.test(allText)) category = 'General';

      // Determine seat type
      let seatType = '';
      if (/Management\s*Quota/i.test(allText)) seatType = 'Management Quota';
      else if (/HP\s*Quota/i.test(allText)) seatType = 'HP Quota';
      else if (/Other\s*State/i.test(allText)) seatType = 'Other State';

      // Determine counselling round
      let counsellingRound = '';
      const roundPatterns = [
        /First\s*Round/i, /Second\s*Round/i, /Third\s*Round/i, /Fourth\s*Round/i,
        /Final\s*Mop/i, /On[\s-]*Spot/i, /Open\s*Offline/i, /Management\s*Seat\s*Quota/i,
        /Mop[\s-]*Up/i,
      ];
      for (const pat of roundPatterns) {
        const m = allText.match(pat);
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
