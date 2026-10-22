/**
 * Centralized Institutional & Portal Configuration
 * Consolidates institutional metadata, helpdesk credentials, and course definitions
 * to avoid hardcoded strings across the application.
 */

export const INSTITUTION_CONFIG = {
  name: 'Shanti College of Education',
  shortName: 'Shanti College',
  portalName: 'Staff Fee Management Portal',
  accreditation: 'Approved by NCTE & State Council',
  contact: {
    itEmail: 'admin@shanticollege.edu.in',
    helpline: 'Ext. 104 / +91 172 298104',
  },
  get copyright() {
    return `© ${new Date().getFullYear()} ${this.name} • ${this.accreditation}`;
  },
} as const;

export interface StaffCredential {
  id: string;
  password: string;
  name: string;
  role: 'admin' | 'clerk';
}

export const DEFAULT_CREDENTIALS: StaffCredential[] = [
  { id: 'admin', password: 'admin@123', name: 'Dr. Rajesh Sharma (Accounts Officer)', role: 'admin' },
  { id: 'clerk', password: 'clerk@123', name: 'Staff Viewer (Clerk)', role: 'clerk' },
];

export const COURSE_METADATA_MAP: Record<string, { description: string; defaultDuration: string }> = {
  JBT: {
    description: 'Junior Basic Training (Primary Teacher Education)',
    defaultDuration: '2 Years Degree',
  },
  'B.Ed': {
    description: 'Bachelor of Education (Secondary Teacher Education)',
    defaultDuration: '2 Years Degree',
  },
};
