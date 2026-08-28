import type { Student } from '../types/feeSystem';

export function exportStudentsToCSV(students: Student[], filename = 'student_fee_records.csv'): void {
  const headers = [
    'Registration No',
    'Student Name',
    'Father Name',
    'Course',
    'Semester',
    'Roll No',
    'Session',
    'Phone',
    'Email',
    'Category',
    'Total Fees (INR)',
    'Paid Till Now (INR)',
    'Remaining Fees (INR)',
    'Fee Status',
    'Next Due Date',
  ];

  const rows = students.map((s) => [
    `"${s.registrationNo}"`,
    `"${s.name}"`,
    `"${s.fatherName}"`,
    `"${s.course}"`,
    `"${s.semester}"`,
    `"${s.rollNo}"`,
    `"${s.session}"`,
    `"${s.phone}"`,
    `"${s.email}"`,
    `"${s.category}"`,
    s.totalFees,
    s.paidTillNow,
    s.remainingFees,
    `"${s.feeStatus}"`,
    `"${s.nextDueDate}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
