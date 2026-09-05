import type { Student, CourseStat } from '../types/feeSystem';

export const INITIAL_STUDENTS: Student[] = [
  {
    "id": "STU-BED-001",
    "registrationNo": "H26A311948",
    "name": "SNEHA",
    "fatherName": "PARMJEET SINGH",
    "phone": "9816001101",
    "whatsappNo": "9816001101",
    "email": "sneha@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11643",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B001",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182701",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-002",
    "registrationNo": "H26A411044",
    "name": "NEERAJ KUMAR",
    "fatherName": "SHRI FATHER NEERAJ",
    "phone": "9816002102",
    "whatsappNo": "9816002102",
    "email": "neerajkumar@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17665",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B002",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182702",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-003",
    "registrationNo": "H26A400411",
    "name": "KISHAN LAL",
    "fatherName": "SHRI FATHER KISHAN",
    "phone": "9816003103",
    "whatsappNo": "9816003103",
    "email": "kishanlal@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11561",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B003",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182703",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-004",
    "registrationNo": "H26A498900",
    "name": "SHAMBH AVI SHARMA",
    "fatherName": "VINAY KUMAR SHARMA",
    "phone": "9816004104",
    "whatsappNo": "9816004104",
    "email": "shambhavisharma@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17758",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B004",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182704",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-005",
    "registrationNo": "H26A598649",
    "name": "B.Ed Student 5",
    "fatherName": "SHRI FATHER B.Ed",
    "phone": "9816005105",
    "whatsappNo": "9816005105",
    "email": "b.edstudent5@gmail.com",
    "course": "B.Ed",
    "stream": "Medical",
    "semester": "1st Year",
    "rollNo": "17776",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B005",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182705",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-006",
    "registrationNo": "H26A691282",
    "name": "AMBIKA SAHORE",
    "fatherName": "AVINASH CHANDER SAHORE",
    "phone": "9816006106",
    "whatsappNo": "9816006106",
    "email": "ambikasahore@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "15918",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B006",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182706",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-007",
    "registrationNo": "H26A400959",
    "name": "SALONI PATHANI A",
    "fatherName": "RAMESH KUMAR",
    "phone": "9816007107",
    "whatsappNo": "9816007107",
    "email": "salonipathania@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B007",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182707",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-008",
    "registrationNo": "H26A202620",
    "name": "BHUPIND ER KAUR",
    "fatherName": "HARJEET SINGH",
    "phone": "9816008108",
    "whatsappNo": "9816008108",
    "email": "bhupinderkaur@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17752",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B008",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182708",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-009",
    "registrationNo": "H26A143208",
    "name": "SANDEEP SINGH PARDESI",
    "fatherName": "SIMRAN",
    "phone": "9816009109",
    "whatsappNo": "9816009109",
    "email": "sandeepsinghpardesi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11637",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B009",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182709",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-010",
    "registrationNo": "H26A401370",
    "name": "TARSEM LAL",
    "fatherName": "PARMJEET SINGH",
    "phone": "9816010110",
    "whatsappNo": "9816010110",
    "email": "tarsemlal@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "10111",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B010",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182710",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-011",
    "registrationNo": "H26A780231",
    "name": "ANMOL BHATIA",
    "fatherName": "PARMJEET SINGH",
    "phone": "9816011111",
    "whatsappNo": "9816011111",
    "email": "anmolbhatia@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11579",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B011",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182711",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-012",
    "registrationNo": "H26A891814",
    "name": "GURDEV SINGH",
    "fatherName": "KANIKA",
    "phone": "9816012112",
    "whatsappNo": "9816012112",
    "email": "gurdevsingh@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "16013",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B012",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182712",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-013",
    "registrationNo": "H26A418154",
    "name": "BALRAJ SINGH",
    "fatherName": "SUNIDHI CHAUHA N",
    "phone": "9816013113",
    "whatsappNo": "9816013113",
    "email": "balrajsingh@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11659",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B013",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182713",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-014",
    "registrationNo": "H26A318110",
    "name": "AJAY SINGH",
    "fatherName": "RUCHIKA THAKUR",
    "phone": "9816014114",
    "whatsappNo": "9816014114",
    "email": "ajaysingh@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B014",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182714",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-015",
    "registrationNo": "H26A407753",
    "name": "AJAY KUMAR",
    "fatherName": "MEETALI ATRI",
    "phone": "9816015115",
    "whatsappNo": "9816015115",
    "email": "ajaykumar@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B015",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182715",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-016",
    "registrationNo": "H26A808969",
    "name": "RABAN KUMAR ATRI",
    "fatherName": "RIYA CHOUDH ARY",
    "phone": "9816016116",
    "whatsappNo": "9816016116",
    "email": "rabankumaratri@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B016",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182716",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-017",
    "registrationNo": "H26A446741",
    "name": "RAJESH KUMAR",
    "fatherName": "RIYA CHOUDH ARY",
    "phone": "9816017117",
    "whatsappNo": "9816017117",
    "email": "rajeshkumar@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B017",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182717",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-018",
    "registrationNo": "H26A318408",
    "name": "ANISHA JASWAL",
    "fatherName": "BAKESH SINGH",
    "phone": "9816018118",
    "whatsappNo": "9816018118",
    "email": "anishajaswal@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B018",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182718",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-019",
    "registrationNo": "H26A569175",
    "name": "ANKITA",
    "fatherName": "ARUN SINGH",
    "phone": "9816019119",
    "whatsappNo": "9816019119",
    "email": "ankita@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B019",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182719",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-020",
    "registrationNo": "H26A253067",
    "name": "RITIKA",
    "fatherName": "RITIKA SAKA",
    "phone": "9816020120",
    "whatsappNo": "9816020120",
    "email": "ritika@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B020",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182720",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-021",
    "registrationNo": "H26A713267",
    "name": "ANU BHATIA",
    "fatherName": "TEK CHAND",
    "phone": "9816021121",
    "whatsappNo": "9816021121",
    "email": "anubhatia@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17835",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B021",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182721",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-022",
    "registrationNo": "H26A264010",
    "name": "POOJA",
    "fatherName": "BIHARI LAL",
    "phone": "9816022122",
    "whatsappNo": "9816022122",
    "email": "pooja@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11595",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B022",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182722",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-023",
    "registrationNo": "H26A502604",
    "name": "VRITIKA THAKUR",
    "fatherName": "SHRI FATHER VRITIKA",
    "phone": "9816023123",
    "whatsappNo": "9816023123",
    "email": "vritikathakur@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11705",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B023",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182723",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-024",
    "registrationNo": "H26A723465",
    "name": "YOGESH RANA",
    "fatherName": "SAZIA BEGUM",
    "phone": "9816024124",
    "whatsappNo": "9816024124",
    "email": "yogeshrana@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11638",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B024",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182724",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-025",
    "registrationNo": "H26A155676",
    "name": "KAMAL DEEN",
    "fatherName": "SHRI FATHER KAMAL",
    "phone": "9816025125",
    "whatsappNo": "9816025125",
    "email": "kamaldeen@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "15423",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B025",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182725",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-026",
    "registrationNo": "H26A411044",
    "name": "HEENA",
    "fatherName": "SARWAN KUMAR",
    "phone": "9816026126",
    "whatsappNo": "9816026126",
    "email": "heena@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11663",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B026",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182726",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-027",
    "registrationNo": "H26A219847",
    "name": "AMBIKA RUCHI",
    "fatherName": "GURBACHAN SINGH",
    "phone": "9816027127",
    "whatsappNo": "9816027127",
    "email": "ambikaruchi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11598",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B027",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182727",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-028",
    "registrationNo": "H26A512033",
    "name": "IRFAN",
    "fatherName": "SADIQUE MOHAMMAD",
    "phone": "9816028128",
    "whatsappNo": "9816028128",
    "email": "irfan@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "17884",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B028",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182728",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-029",
    "registrationNo": "H26A141306",
    "name": "DEEPIKA DEVI",
    "fatherName": "SHRI FATHER DEEPIKA",
    "phone": "9816029129",
    "whatsappNo": "9816029129",
    "email": "deepikadevi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11641",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B029",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182729",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-030",
    "registrationNo": "H26A189505",
    "name": "ABHISHE K",
    "fatherName": "KAMAL DEV",
    "phone": "9816030130",
    "whatsappNo": "9816030130",
    "email": "abhishek@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11568",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B030",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182730",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-031",
    "registrationNo": "H26A802353",
    "name": "TANISHA SHARMA",
    "fatherName": "SANJEEV KUMAR",
    "phone": "9816031131",
    "whatsappNo": "9816031131",
    "email": "tanishasharma@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11745",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B031",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182731",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-032",
    "registrationNo": "H26A718501",
    "name": "PRIYA",
    "fatherName": "RAM PAL",
    "phone": "9816032132",
    "whatsappNo": "9816032132",
    "email": "priya@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11557",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B032",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182732",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-033",
    "registrationNo": "H26A622520",
    "name": "PALAK CHOUDH ARY",
    "fatherName": "SUNIL KUMAR",
    "phone": "9816033133",
    "whatsappNo": "9816033133",
    "email": "palakchoudhary@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "11646",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B033",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182733",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-034",
    "registrationNo": "H26A251338",
    "name": "PARVEE N RANI",
    "fatherName": "VARIYAM SINGH",
    "phone": "9816034134",
    "whatsappNo": "9816034134",
    "email": "parveenrani@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11732",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B034",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182734",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-035",
    "registrationNo": "H26A958172",
    "name": "SHAHEE N BEGUM",
    "fatherName": "SHER MOHAMMAD",
    "phone": "9816035135",
    "whatsappNo": "9816035135",
    "email": "shaheenbegum@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "11594",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B035",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182735",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-036",
    "registrationNo": "H26A988698",
    "name": "PREETI KUMARI",
    "fatherName": "SUNEEL KUMAR",
    "phone": "9816036136",
    "whatsappNo": "9816036136",
    "email": "preetikumari@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B036",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182736",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-037",
    "registrationNo": "H26A884998",
    "name": "ARPIT THAKUR",
    "fatherName": "VIJAY KUMAR",
    "phone": "9816037137",
    "whatsappNo": "9816037137",
    "email": "arpitthakur@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B037",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182737",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-038",
    "registrationNo": "H26A575408",
    "name": "DIKSHA KUMARI",
    "fatherName": "MUKHTYAR SINGH",
    "phone": "9816038138",
    "whatsappNo": "9816038138",
    "email": "dikshakumari@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B038",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182738",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-039",
    "registrationNo": "H26A485426",
    "name": "SATYAM SHARMA",
    "fatherName": "AKHILESH KUMAR",
    "phone": "9816039139",
    "whatsappNo": "9816039139",
    "email": "satyamsharma@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "14051",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B039",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182739",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-040",
    "registrationNo": "H26A940382",
    "name": "NEHA JASWAL",
    "fatherName": "SATISH KUMAR JASWAL",
    "phone": "9816040140",
    "whatsappNo": "9816040140",
    "email": "nehajaswal@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B040",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182740",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-041",
    "registrationNo": "H26A353114",
    "name": "ANSHIKA",
    "fatherName": "GURPAL SINGH",
    "phone": "9816041141",
    "whatsappNo": "9816041141",
    "email": "anshika@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B041",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182741",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-042",
    "registrationNo": "H26A569175",
    "name": "RAZIA BEGUM",
    "fatherName": "ABDUL HAKEEM",
    "phone": "9816042142",
    "whatsappNo": "9816042142",
    "email": "raziabegum@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B042",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182742",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-043",
    "registrationNo": "H26A477066",
    "name": "NEHA",
    "fatherName": "VINOD KUMAR",
    "phone": "9816043143",
    "whatsappNo": "9816043143",
    "email": "neha@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B043",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182743",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-044",
    "registrationNo": "H26A997174",
    "name": "SHILPA THAKUR",
    "fatherName": "VRITIKA THAKUR",
    "phone": "9816044144",
    "whatsappNo": "9816044144",
    "email": "shilpathakur@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B044",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182744",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-045",
    "registrationNo": "H26A579318",
    "name": "BHUPINDER SINGH",
    "fatherName": "MEENAK SHI BHATIA",
    "phone": "9816045145",
    "whatsappNo": "9816045145",
    "email": "bhupindersingh@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B045",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182745",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-046",
    "registrationNo": "H26A216867",
    "name": "JYOTI DEVI",
    "fatherName": "TILAK RAJ",
    "phone": "9816046146",
    "whatsappNo": "9816046146",
    "email": "jyotidevi@gmail.com",
    "course": "B.Ed",
    "stream": "Non-Medical",
    "semester": "1st Year",
    "rollNo": "17919",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B046",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182746",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-047",
    "registrationNo": "H26A422022",
    "name": "RAMA DEVI",
    "fatherName": "VISHALI DEVI",
    "phone": "9816047147",
    "whatsappNo": "9816047147",
    "email": "ramadevi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "12745",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 20000,
    "remainingFees": 58000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-10-15",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B047",
        "amount": 20000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182747",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-048",
    "registrationNo": "H26A483818",
    "name": "ASHA DEVI",
    "fatherName": "CHAMAN LAL",
    "phone": "9816048148",
    "whatsappNo": "9816048148",
    "email": "ashadevi@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 78000,
    "remainingFees": 0,
    "feeStatus": "Paid",
    "nextDueDate": "2025-03-31",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B048",
        "amount": 78000,
        "date": "2024-07-25",
        "mode": "UPI",
        "transactionRef": "UPI/409182748",
        "remark": "1st Installment Paid"
      }
    ]
  },
  {
    "id": "STU-BED-049",
    "registrationNo": "H26A431302",
    "name": "NEHA RAI",
    "fatherName": "RAVINDER KUMAR",
    "phone": "9816049149",
    "whatsappNo": "9816049149",
    "email": "neharai@gmail.com",
    "course": "B.Ed",
    "stream": "Arts",
    "semester": "1st Year",
    "rollNo": "",
    "session": "2026-2027",
    "totalFees": 78000,
    "paidTillNow": 45000,
    "remainingFees": 33000,
    "feeStatus": "Partly Paid",
    "nextDueDate": "2024-11-30",
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
    "paymentHistory": [
      {
        "id": "RCP-2024-B049",
        "amount": 45000,
        "date": "2024-07-25",
        "mode": "NEFT",
        "transactionRef": "UPI/409182749",
        "remark": "1st Installment Paid"
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
    duration: '2 Years Degree',
    totalStudents: 49,
    pendingStudents: 0,
    totalExpected: 0,
    totalCollected: 0,
    totalPending: 0,
    iconName: 'BookOpen',
    colorTheme: 'indigo',
  },
];

export const MONTHLY_COLLECTION_DATA = [
  { month: 'Apr', JBT: 120000, BEd: 240000 },
  { month: 'May', JBT: 180000, BEd: 320000 },
  { month: 'Jun', JBT: 150000, BEd: 280000 },
  { month: 'Jul', JBT: 220000, BEd: 340000 },
  { month: 'Aug', JBT: 280000, BEd: 410000 },
  { month: 'Sep', JBT: 250000, BEd: 390000 },
  { month: 'Oct', JBT: 310000, BEd: 480000 },
  { month: 'Nov', JBT: 290000, BEd: 450000 },
  { month: 'Dec', JBT: 340000, BEd: 520000 },
  { month: 'Jan', JBT: 210000, BEd: 360000 },
  { month: 'Feb', JBT: 190000, BEd: 310000 },
  { month: 'Mar', JBT: 160000, BEd: 290000 },
];
