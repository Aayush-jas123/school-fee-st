import type { Student, CourseType, FeeStatusType, FeeBreakdown, SeatType } from '../types/feeSystem';
import { buildPeriodFeeSlots } from '../types/feeSystem';
import * as XLSX from 'xlsx';

// ─── Category & Seat Mapping ──────────────────────────────────────────────────

function mapCategory(raw: string): 'General' | 'OBC' | 'SC' | 'ST' {
  const upper = (raw || '').toUpperCase();
  if (upper.includes('SCHEDULED CASTE') || upper.includes('(SC)')) return 'SC';
  if (upper.includes('SCHEDULED TRIBE') || upper.includes('(ST)')) return 'ST';
  if (upper.includes('OTHER BACKWARD') || upper.includes('(OBC)')) return 'OBC';
  if (upper.includes('ECONOMICALLY WEAKER') || upper.includes('(EWS)')) return 'General';
  return 'General';
}

function mapSeatType(raw?: string): SeatType | undefined {
  if (!raw) return undefined;
  const s = raw.trim().toLowerCase();
  if (s.includes('subsidised') && !s.includes('non')) return 'Subsidised';
  if (s.includes('non-subsidised') || s.includes('nonsubsidised') || s.includes('non subsidised')) return 'Non-Subsidised';
  if (s.includes('management')) return 'Management';
  if (s.includes('normal')) return 'Normal';
  return undefined;
}

function mapStream(raw: string, course?: CourseType): string {
  const s = (raw || '').trim();
  if (course === 'JBT') {
    if (s.toLowerCase().includes('d.el.ed') || s.toLowerCase().includes('deled')) return 'D.El.Ed';
    return s || 'D.El.Ed';
  }
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

// ─── Raw Record → Student ────────────────────────────────────────────────────

interface RawRecord {
  registrationNo: string;
  rollNo: string;
  name: string;
  fatherName: string;
  stream: string;
  totalFees: number;
  paidTillNow?: number;
  category: string;
  seatType: string;
  counsellingRound: string;
  phone?: string;
  whatsappNo?: string;
  email?: string;
  address?: string;
}

function rawRecordToStudent(raw: RawRecord, course: CourseType, session: string, idx: number): Student {
  const regNo = raw.registrationNo.replace(/\s+/g, '').toUpperCase();
  const totalFees = Number(raw.totalFees || 0);
  const paidTillNow = Number(raw.paidTillNow || 0);
  const remainingFees = Math.max(0, totalFees - paidTillNow);
  const category = mapCategory(raw.category);
  const phone = (raw.phone || '').trim();
  const whatsappNo = (raw.whatsappNo || '').trim();
  const email = (raw.email || '').trim();
  const address = (raw.address || '').trim();

  let feeStatus: FeeStatusType = 'Unpaid';
  if (paidTillNow >= totalFees && totalFees > 0) {
    feeStatus = 'Paid';
  } else if (paidTillNow > 0) {
    feeStatus = 'Partly Paid';
  }

  const feeBreakdown: FeeBreakdown = {
    tuitionFee: 0,
    admissionFee: totalFees,
    examFee: 0,
    libraryFee: 0,
    developmentFee: 0,
    labFee: 0,
  };

  const periodLabel = course === 'JBT' ? 'Session 1' : 'Sem 1';

  return {
    id: generateId(regNo, course, idx),
    registrationNo: regNo,
    name: raw.name.trim().toUpperCase(),
    fatherName: raw.fatherName.trim().toUpperCase(),
    phone,
    whatsappNo,
    email,
    course,
    stream: mapStream(raw.stream, course),
    seatType: mapSeatType(raw.seatType),
    semester: periodLabel,
    currentSemester: periodLabel,
    rollNo: raw.rollNo.replace(/\s+/g, ''),
    session,
    totalFees,
    paidTillNow,
    remainingFees,
    feeStatus,
    nextDueDate: '2026-10-15',
    address,
    category,
    feeBreakdown,
    semesterFees: buildPeriodFeeSlots(course, totalFees, paidTillNow),
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

export async function parseAdmissionPDF(
  file: File,
  course: CourseType = 'B.Ed',
  session: string = '2024-2025'
): Promise<{ students: Student[]; detectedSession: string }> {
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
  const detectedSession = sessionMatch ? `${sessionMatch[1]}-${sessionMatch[2]}` : session;

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

    // Find registration number items (standard B.Ed pattern like H24A123456)
    const regNoItems = items.filter(it =>
      /^[A-Z]\d{2}[A-Z]\d{5,8}$/i.test(it.str.replace(/\s+/g, ''))
    );

    if (regNoItems.length > 0) {
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
        const totalFees = fee ? parseFloat(fee) : course === 'B.Ed' ? 7056 : 0;

        if (!name || name.length < 2 || !regNoStr) continue;

        globalIdx++;
        const student = rawRecordToStudent(
          {
            registrationNo: regNoStr,
            rollNo: sno || regNoStr,
            name,
            fatherName,
            stream,
            totalFees,
            category,
            seatType: '',
            counsellingRound: '',
          },
          course,
          detectedSession,
          globalIdx,
        );
        allStudents.push(student);
      }
    } else {
      // Fallback: Group items into horizontal lines (by y position with 5px tolerance)
      const rowGroups: { y: number; items: TextItem[] }[] = [];
      const sortedByY = [...items].sort((a, b) => b.y - a.y);

      for (const item of sortedByY) {
        let placed = false;
        for (const grp of rowGroups) {
          if (Math.abs(grp.y - item.y) <= 5) {
            grp.items.push(item);
            placed = true;
            break;
          }
        }
        if (!placed) {
          rowGroups.push({ y: item.y, items: [item] });
        }
      }

      for (const grp of rowGroups) {
        // Sort items in line by x position (left to right)
        grp.items.sort((a, b) => a.x - b.x);
        const lineParts = grp.items.map(it => it.str);

        // Check if row has at least roll number / sno and a student name
        // e.g. [1, 809, MAHAK, CAHIN SINGH RANA, D.El.Ed]
        let rollOrReg = '';
        let studentName = '';
        let fatherName = '';
        let streamStr = '';

        for (let i = 0; i < lineParts.length; i++) {
          const part = lineParts[i];
          if (!rollOrReg && /^\d{2,10}$/.test(part)) {
            rollOrReg = part;
          } else if (rollOrReg && !studentName && /^[A-Za-z\s.]{2,40}$/.test(part) && !isHeaderItem(part)) {
            studentName = part;
          } else if (studentName && !fatherName && /^[A-Za-z\s.]{2,40}$/.test(part) && !isHeaderItem(part)) {
            fatherName = part;
          } else if (fatherName && !streamStr && /^[A-Za-z\s.-]{2,20}$/.test(part)) {
            streamStr = part;
          }
        }

        if (studentName && studentName.length >= 2 && rollOrReg) {
          globalIdx++;
          const student = rawRecordToStudent(
            {
              registrationNo: rollOrReg,
              rollNo: rollOrReg,
              name: studentName,
              fatherName,
              stream: streamStr || (course === 'JBT' ? 'D.El.Ed' : 'Arts'),
              totalFees: 0,
              category: 'General',
              seatType: '',
              counsellingRound: '',
            },
            course,
            detectedSession,
            globalIdx,
          );
          allStudents.push(student);
        }
      }
    }
  }

  return { students: allStudents, detectedSession };
}

// ─── EXCEL & CSV PARSING ─────────────────────────────────────────────────────

function normalizeKey(k: string): string {
  return String(k || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findFieldValue(row: Record<string, any>, aliases: string[], excludeKeywords: string[] = []): any {
  const rowKeys = Object.keys(row);

  // 1. Exact normalized match
  for (const alias of aliases) {
    const normAlias = normalizeKey(alias);
    const matchedKey = rowKeys.find(k => normalizeKey(k) === normAlias);
    if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== '') {
      return row[matchedKey];
    }
  }

  // 2. Contains match (excluding false-positive keys like 'father' for student name)
  for (const alias of aliases) {
    const normAlias = normalizeKey(alias);
    const matchedKey = rowKeys.find(k => {
      const normK = normalizeKey(k);
      if (excludeKeywords.some(ex => normK.includes(normalizeKey(ex)))) return false;
      return normK.includes(normAlias);
    });
    if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== '') {
      return row[matchedKey];
    }
  }

  return '';
}

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
    // Read raw matrix of cells to dynamically locate the real header row
    const rawMatrix = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' });
    if (!rawMatrix || rawMatrix.length === 0) continue;

    // Scan first 15 rows to find the row with the most matching header keywords
    let headerRowIdx = 0;
    let maxMatches = 0;
    const headerKeywords = ['roll', 'reg', 'name', 'father', 'stream', 'sno', 's.no', 'fee', 'admission', 'student'];

    for (let i = 0; i < Math.min(15, rawMatrix.length); i++) {
      const row = rawMatrix[i];
      if (!Array.isArray(row)) continue;
      const matchCount = row.filter(cell => {
        const norm = normalizeKey(String(cell || ''));
        return headerKeywords.some(kw => norm.includes(normalizeKey(kw)));
      }).length;

      if (matchCount > maxMatches) {
        maxMatches = matchCount;
        headerRowIdx = i;
      }
    }

    const headerRow = (rawMatrix[headerRowIdx] || []).map(cell => String(cell || '').trim());
    const dataRows = rawMatrix.slice(headerRowIdx + 1);

    for (const r of dataRows) {
      if (!Array.isArray(r) || r.every(cell => cell === '' || cell === null || cell === undefined)) {
        continue;
      }

      // Convert row to key-value object using the trimmed headers
      const rowObj: Record<string, any> = {};
      headerRow.forEach((hdr, idx) => {
        if (hdr) rowObj[hdr] = r[idx] !== undefined ? r[idx] : '';
      });

      // Extract Student Name (explicitly exclude father/mother/parent/guardian)
      const rawName = String(
        findFieldValue(
          rowObj,
          ['Student Name', 'Candidate Name', 'Name of Student', 'Student', 'Full Name', 'Name'],
          ['father', 'mother', 'parent', 'guardian']
        ) || ''
      ).trim();

      const cleanName = rawName.replace(/\s+/g, ' ');
      const invalidNames = ['NULL', 'VACANT', 'N/A', 'NA', 'NONE', 'EMPTY', 'AVAILABLE', '-', '--'];
      if (!cleanName || cleanName.length < 2 || invalidNames.includes(cleanName.toUpperCase())) {
        continue;
      }

      // Extract Roll No & Reg No
      const rawRollNo = findFieldValue(rowObj, ['Roll Number', 'Roll No', 'RollNo', 'Roll_No', 'Roll', 'Class Roll No', 'Exam Roll No']);
      const rawRegNo = findFieldValue(rowObj, ['Registration No', 'Registration Number', 'RegistrationNo', 'Reg No', 'RegNo', 'Reg. No', 'Reg Number', 'Application No', 'Enrollment No', 'Enrolment No', 'Form No']);
      const rawSno = findFieldValue(rowObj, ['S.No', 'SNo', 'Serial No', 'Sr.No', 'Sr No', 'Sl No', 'S No']);

      let rollNo = String(rawRollNo !== '' ? rawRollNo : '').trim().replace(/\.0$/, '');
      let regNo = String(rawRegNo !== '' ? rawRegNo : '').trim().replace(/\.0$/, '');

      // JBT & General handling:
      // If registration number is missing/empty, use roll number as registration number.
      // If roll number is missing/empty, use registration number as roll number.
      if (!regNo && rollNo) {
        regNo = rollNo;
      } else if (!rollNo && regNo) {
        rollNo = regNo;
      } else if (!regNo && !rollNo) {
        const sno = String(rawSno || '').trim().replace(/\.0$/, '');
        if (sno) {
          rollNo = sno;
          regNo = sno;
        } else {
          rollNo = String(globalIdx + 1);
          regNo = String(globalIdx + 1);
        }
      }

      if (!regNo) continue;

      // Father's Name
      const rawFather = String(
        findFieldValue(rowObj, ["Father's Name", 'Father Name', 'FatherName', "Father's", 'Father', 'Guardian Name', 'Parent Name']) || ''
      ).trim();

      // Stream
      const rawStream = String(findFieldValue(rowObj, ['Stream', 'Branch', 'Trade', 'Department']) || '').trim();

      // Fees
      const rawTotalFees = findFieldValue(rowObj, ['Total Admission Fee', 'Total Admission Fees', 'Admission Fee', 'Total Fees', 'Total Fee', 'Fee', 'Fees', 'Amount']);
      const totalFees = rawTotalFees !== '' && !isNaN(Number(rawTotalFees)) ? Number(rawTotalFees) : 0;

      const rawPaid = findFieldValue(rowObj, ['Paid Till Now', 'Amount Paid', 'Paid Fee', 'Fee Paid', 'Paid', 'PaidTillNow']);
      const paidTillNow = rawPaid !== '' && !isNaN(Number(rawPaid)) ? Number(rawPaid) : 0;

      // Seat Type & Category
      const rawSeatType = String(findFieldValue(rowObj, ['Seat Type', 'SeatType', 'Allotted Seat', 'Seat Category', 'Seat', 'Quota']) || '').trim();
      const rawCategory = String(findFieldValue(rowObj, ['Category', 'Student Category', 'Social Category', 'Caste', 'Allotted Category']) || '').trim();

      // Contact details - leave empty if not in file as requested
      const rawPhone = String(findFieldValue(rowObj, ['Phone', 'Phone Number', 'Mobile', 'Mobile Number', 'Mobile No', 'Contact', 'Contact No']) || '').trim().replace(/\.0$/, '');
      const rawWhatsapp = String(findFieldValue(rowObj, ['WhatsApp', 'WhatsApp Number', 'WhatsApp No', 'WhatsAppNo']) || '').trim().replace(/\.0$/, '');
      const rawEmail = String(findFieldValue(rowObj, ['Email', 'Email Address', 'Mail']) || '').trim();
      const rawAddress = String(findFieldValue(rowObj, ['Address', 'Permanent Address', 'Residence']) || '').trim();
      const counsellingRound = String(findFieldValue(rowObj, ['Counselling Round', 'CounsellingRound', 'Round']) || '').trim();

      globalIdx++;
      const student = rawRecordToStudent(
        {
          registrationNo: regNo,
          rollNo,
          name: cleanName,
          fatherName: rawFather,
          stream: rawStream,
          totalFees,
          paidTillNow,
          category: rawCategory,
          seatType: rawSeatType,
          counsellingRound,
          phone: rawPhone,
          whatsappNo: rawWhatsapp,
          email: rawEmail,
          address: rawAddress,
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
    const seat = s.seatType || 'Not Set';
    bySeatType[seat] = (bySeatType[seat] || 0) + 1;
  }

  return { totalRecords: students.length, byStream, byCategory, bySeatType, session };
}

