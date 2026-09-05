import type { Student, CourseStat } from '../types/feeSystem';

export const INITIAL_STUDENTS: Student[] = [
  {
    "id": "STU-BED-001",
    "registrationNo": "H26A311948",
    "name": "SNEHA",
    "fatherName": "PARMJEET SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "sneha@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11643",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-002",
    "registrationNo": "H26A411044",
    "name": "NEERAJ KUMAR",
    "fatherName": "KISHAN LAL",
    "phone": "0",
    "whatsappNo": "0",
    "email": "neeraj.kumar@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17665",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-003",
    "registrationNo": "H26A498900",
    "name": "SHAMBHAVI SHARMA",
    "fatherName": "VINAY KUMAR SHARMA",
    "phone": "0",
    "whatsappNo": "0",
    "email": "shambhavi.sharma@gmail.com",
    "course": "B.Ed",
    "stream": "Medical",
    "semester": "1st Year",
    "rollNo": "11561",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-004",
    "registrationNo": "H26A598649",
    "name": "AMBIKA SAHORE",
    "fatherName": "AVINASH CHANDER SAHORE",
    "phone": "0",
    "whatsappNo": "0",
    "email": "ambika.sahore@gmail.com",
    "course": "B.Ed",
    "stream": "Medical",
    "semester": "1st Year",
    "rollNo": "17758",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-005",
    "registrationNo": "H26A691282",
    "name": "SALONI PATHANIA",
    "fatherName": "RAMESH KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "saloni.pathania@gmail.com",
    "course": "B.Ed",
    "stream": "Medical",
    "semester": "1st Year",
    "rollNo": "17776",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-006",
    "registrationNo": "H26A202620",
    "name": "BHUPINDER KAUR",
    "fatherName": "HARJEET SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "bhupinder.kaur@gmail.com",
    "course": "B.Ed",
    "stream": "Medical",
    "semester": "1st Year",
    "rollNo": "15918",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-007",
    "registrationNo": "H26A552258",
    "name": "BHAIBHAV PARDESI",
    "fatherName": "SANDEEP SINGH PARDESI",
    "phone": "0",
    "whatsappNo": "0",
    "email": "bhaibhav.pardesi@gmail.com",
    "course": "B.Ed",
    "stream": "Medical",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-008",
    "registrationNo": "H26A143208",
    "name": "SIMRAN",
    "fatherName": "TARSEM LAL",
    "phone": "0",
    "whatsappNo": "0",
    "email": "simran@gmail.com",
    "course": "B.Ed",
    "stream": "Medical",
    "semester": "1st Year",
    "rollNo": "17752",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-009",
    "registrationNo": "H26A780231",
    "name": "ANMOL BHATIA",
    "fatherName": "GURDEV SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "anmol.bhatia@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11637",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-010",
    "registrationNo": "H26A891814",
    "name": "KANIKA",
    "fatherName": "BALRAJ SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "kanika@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "10111",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-011",
    "registrationNo": "H26A418154",
    "name": "SUNIDHI CHAUHAN",
    "fatherName": "AJAY SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "sunidhi.chauhan@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11579",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-012",
    "registrationNo": "H26A318110",
    "name": "RUCHIKA THAKUR",
    "fatherName": "AJAY KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "ruchika.thakur@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "16013",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-013",
    "registrationNo": "H26A407753",
    "name": "MEETALI ATRI",
    "fatherName": "RABAN KUMAR ATRI",
    "phone": "0",
    "whatsappNo": "0",
    "email": "meetali.atri@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11659",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-014",
    "registrationNo": "H26A808969",
    "name": "RIYA CHOUDHARY",
    "fatherName": "RAJESH KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "riya.choudhary@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-015",
    "registrationNo": "H26A446741",
    "name": "ANISHA JASWAL",
    "fatherName": "BAKESH SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "anisha.jaswal@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-016",
    "registrationNo": "H26A318408",
    "name": "ANKITA",
    "fatherName": "ARUN SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "ankita@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-017",
    "registrationNo": "H26A569175",
    "name": "RITIKA",
    "fatherName": "ARUN SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "ritika@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-018",
    "registrationNo": "H26A253067",
    "name": "RITIKA SAKA",
    "fatherName": "SHAM SUNDER",
    "phone": "0",
    "whatsappNo": "0",
    "email": "ritika.saka@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-019",
    "registrationNo": "H26A713267",
    "name": "ANU BHATIA",
    "fatherName": "TEK CHAND",
    "phone": "0",
    "whatsappNo": "0",
    "email": "anu.bhatia@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-020",
    "registrationNo": "H26A264010",
    "name": "POOJA",
    "fatherName": "BIHARI LAL",
    "phone": "0",
    "whatsappNo": "0",
    "email": "pooja@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-021",
    "registrationNo": "H26A502604",
    "name": "VRITIKA THAKUR",
    "fatherName": "YOGESH RANA",
    "phone": "0",
    "whatsappNo": "0",
    "email": "vritika.thakur@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17835",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-022",
    "registrationNo": "H26A723465",
    "name": "SAZIA BEGUM",
    "fatherName": "KAMAL DEEN",
    "phone": "0",
    "whatsappNo": "0",
    "email": "sazia.begum@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11595",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "ST",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-023",
    "registrationNo": "H26A155676",
    "name": "HEENA",
    "fatherName": "SARWAN KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "heena@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11705",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-024",
    "registrationNo": "H26A219847",
    "name": "AMBIKA RUCHI",
    "fatherName": "GURBACHAN SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "ambika.ruchi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11638",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-025",
    "registrationNo": "H26A512033",
    "name": "IRFAN",
    "fatherName": "SADIQUE MOHAMMAD",
    "phone": "0",
    "whatsappNo": "0",
    "email": "irfan@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "15423",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "ST",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-026",
    "registrationNo": "H26A141306",
    "name": "DEEPIKA DEVI",
    "fatherName": "RAJESH KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "deepika.devi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11663",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-027",
    "registrationNo": "H26A530562",
    "name": "ABHISHEK",
    "fatherName": "KAMAL DEV",
    "phone": "0",
    "whatsappNo": "0",
    "email": "abhishek@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11598",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-028",
    "registrationNo": "H26A189505",
    "name": "TANISHA SHARMA",
    "fatherName": "SANJEEV KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "tanisha.sharma@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17884",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-029",
    "registrationNo": "H26A802353",
    "name": "PRIYA",
    "fatherName": "RAM PAL",
    "phone": "0",
    "whatsappNo": "0",
    "email": "priya@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11641",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-030",
    "registrationNo": "H26A718501",
    "name": "PALAK CHOUDHARY",
    "fatherName": "SUNIL KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "palak.choudhary@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11568",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-031",
    "registrationNo": "H26A622520",
    "name": "PARVEEN RANI",
    "fatherName": "VARIYAM SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "parveen.rani@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11745",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-032",
    "registrationNo": "H26A251338",
    "name": "SHAHEEN BEGUM",
    "fatherName": "SHER MOHAMMAD",
    "phone": "0",
    "whatsappNo": "0",
    "email": "shaheen.begum@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11557",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "ST",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-033",
    "registrationNo": "H26A958172",
    "name": "PREETI KUMARI",
    "fatherName": "SUNEEL KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "preeti.kumari@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11646",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-034",
    "registrationNo": "H26A988698",
    "name": "ARPIT THAKUR",
    "fatherName": "VIJAY KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "arpit.thakur@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11732",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-035",
    "registrationNo": "H26A884998",
    "name": "DIKSHA KUMARI",
    "fatherName": "MUKHTYAR SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "diksha.kumari@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11594",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-036",
    "registrationNo": "H26A575408",
    "name": "SATYAM SHARMA",
    "fatherName": "AKHILESH KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "satyam.sharma@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-037",
    "registrationNo": "H26A485426",
    "name": "NEHA JASWAL",
    "fatherName": "SATISH KUMAR JASWAL",
    "phone": "0",
    "whatsappNo": "0",
    "email": "neha.jaswal@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-038",
    "registrationNo": "H26A940382",
    "name": "ANSHIKA",
    "fatherName": "GURPAL SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "anshika@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-039",
    "registrationNo": "H26A353114",
    "name": "RAZIA BEGUM",
    "fatherName": "ABDUL HAKEEM",
    "phone": "0",
    "whatsappNo": "0",
    "email": "razia.begum@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "14051",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "ST",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-040",
    "registrationNo": "H26A477066",
    "name": "NEHA",
    "fatherName": "VINOD KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "neha@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-041",
    "registrationNo": "H26A997174",
    "name": "SHILPA THAKUR",
    "fatherName": "BHUPINDER SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "shilpa.thakur@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-042",
    "registrationNo": "H26A579318",
    "name": "MEENAKSHI BHATIA",
    "fatherName": "TEK CHAND",
    "phone": "0",
    "whatsappNo": "0",
    "email": "meenakshi.bhatia@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-043",
    "registrationNo": "H26A216867",
    "name": "JYOTI DEVI",
    "fatherName": "TILAK RAJ",
    "phone": "0",
    "whatsappNo": "0",
    "email": "jyoti.devi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-044",
    "registrationNo": "H26A422022",
    "name": "RAMA DEVI",
    "fatherName": "SARWAN KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "rama.devi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-045",
    "registrationNo": "H26A716259",
    "name": "VISHALI DEVI",
    "fatherName": "MAHINDER SINGH",
    "phone": "0",
    "whatsappNo": "0",
    "email": "vishali.devi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-046",
    "registrationNo": "H26A483818",
    "name": "ASHA DEVI",
    "fatherName": "CHAMAN LAL",
    "phone": "0",
    "whatsappNo": "0",
    "email": "asha.devi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17919",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "OBC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-047",
    "registrationNo": "H26A431302",
    "name": "NEHA RAI",
    "fatherName": "RAVINDER KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "neha.rai@gmail.com",
    "course": "B.Ed",
    "stream": "Commerce",
    "semester": "1st Year",
    "rollNo": "12745",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "SC",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-048",
    "registrationNo": "H26A424721",
    "name": "NITIKA SHARMA",
    "fatherName": "SATISH KUMAR",
    "phone": "0",
    "whatsappNo": "0",
    "email": "nitika.sharma@gmail.com",
    "course": "B.Ed",
    "stream": "Commerce",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  },
  {
    "id": "STU-BED-049",
    "registrationNo": "H26A630725",
    "name": "BHAVANA",
    "fatherName": "SUBHASH TARA SINGH RATHOD",
    "phone": "0",
    "whatsappNo": "0",
    "email": "bhavana@gmail.com",
    "course": "B.Ed",
    "stream": "Commerce",
    "semester": "1st Year",
    "rollNo": "0",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 0,
    "remainingFees": 78000,
    "feeStatus": "Unpaid",
    "nextDueDate": "2026-10-15",
    "address": "Distt. Una / Kangra / Shimla, H.P.",
    "category": "General",
    "feeBreakdown": {
      "tuitionFee": 55000,
      "admissionFee": 6000,
      "examFee": 5000,
      "libraryFee": 4000,
      "developmentFee": 5000,
      "labFee": 3000
    },
    "paymentHistory": [],
    "currentSemester": "Sem 1",
    "semesterFees": [
      {
        "semester": "Sem 1",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2026-10-15"
      },
      {
        "semester": "Sem 2",
        "year": "1st Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-03-15"
      },
      {
        "semester": "Sem 3",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2027-10-15"
      },
      {
        "semester": "Sem 4",
        "year": "2nd Year",
        "totalFee": 19500,
        "paidAmount": 0,
        "remainingAmount": 19500,
        "status": "Unpaid",
        "dueDate": "2028-03-15"
      }
    ]
  }
];

export const COURSE_DEFINITIONS: CourseStat[] = [
  {
    code: 'JBT',
    title: 'JBT',
    fullName: 'Junior Basic Training (Primary Education)',
    duration: '2 Years Diploma',
    totalStudents: 0,
    pendingStudents: 0,
    totalExpected: 0,
    totalCollected: 0,
    totalPending: 0,
    iconName: 'GraduationCap',
    colorTheme: 'emerald',
  },
  {
    code: 'B.Ed',
    title: 'B.Ed',
    fullName: 'Bachelor of Education (Secondary Teacher Education)',
    duration: '2 Years Degree (4 Semesters)',
    totalStudents: 49,
    pendingStudents: 49,
    totalExpected: 3822000,
    totalCollected: 0,
    totalPending: 3822000,
    iconName: 'BookOpen',
    colorTheme: 'indigo',
  },
];

export const MONTHLY_COLLECTION_DATA = [
  { month: 'Apr', JBT: 0, BEd: 0 },
  { month: 'May', JBT: 0, BEd: 0 },
  { month: 'Jun', JBT: 0, BEd: 0 },
  { month: 'Jul', JBT: 0, BEd: 0 },
  { month: 'Aug', JBT: 0, BEd: 0 },
  { month: 'Sep', JBT: 0, BEd: 0 },
  { month: 'Oct', JBT: 0, BEd: 0 },
  { month: 'Nov', JBT: 0, BEd: 0 },
  { month: 'Dec', JBT: 0, BEd: 0 },
  { month: 'Jan', JBT: 0, BEd: 0 },
  { month: 'Feb', JBT: 0, BEd: 0 },
  { month: 'Mar', JBT: 0, BEd: 0 },
];
