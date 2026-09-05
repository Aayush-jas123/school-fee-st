-- ==============================================================================
-- SHANTI COLLEGE OF EDUCATION - INSTITUTIONAL FEE SYSTEM SUPABASE SETUP
-- Copy and paste this script into your Supabase project's SQL Editor and click "Run".
-- ==============================================================================

-- 1. Create 'students' Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    registration_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    course TEXT NOT NULL CHECK (course IN ('JBT', 'B.Ed')),
    semester TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    session TEXT NOT NULL,
    total_fees NUMERIC NOT NULL DEFAULT 0,
    paid_till_now NUMERIC NOT NULL DEFAULT 0,
    remaining_fees NUMERIC NOT NULL DEFAULT 0,
    fee_status TEXT NOT NULL CHECK (fee_status IN ('Paid', 'Partly Paid', 'Unpaid', 'Overdue')),
    next_due_date DATE,
    address TEXT,
    category TEXT CHECK (category IN ('General', 'OBC', 'SC', 'ST')),
    fee_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    payment_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    discount_amount NUMERIC DEFAULT 0,
    scholarship_applied TEXT,
    last_reminder_sent TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'audit_logs' Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    staff_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('PAYMENT', 'STUDENT_ADD', 'STUDENT_EDIT', 'REMINDER', 'SETTINGS'))
);

-- 3. Create 'fee_rules' Table
CREATE TABLE IF NOT EXISTS public.fee_rules (
    course TEXT PRIMARY KEY CHECK (course IN ('JBT', 'B.Ed')),
    tuition_fee NUMERIC NOT NULL DEFAULT 0,
    admission_fee NUMERIC NOT NULL DEFAULT 0,
    exam_fee NUMERIC NOT NULL DEFAULT 0,
    library_fee NUMERIC NOT NULL DEFAULT 0,
    development_fee NUMERIC NOT NULL DEFAULT 0,
    lab_fee NUMERIC NOT NULL DEFAULT 0,
    late_fee_per_day NUMERIC NOT NULL DEFAULT 50,
    scholarship_discounts JSONB NOT NULL DEFAULT '{"SC": 10000, "ST": 10000, "OBC": 5000, "General": 0}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & Public Access Policies for Web Application
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_rules ENABLE ROW LEVEL SECURITY;

-- Create Policies allowing anonymous/public read, insert, update access for web portal operations
CREATE POLICY "Allow public select on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert on students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Allow public select on audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on fee_rules" ON public.fee_rules FOR SELECT USING (true);
CREATE POLICY "Allow public upsert on fee_rules" ON public.fee_rules FOR ALL USING (true);

-- Insert Default Prescribed Fee Rules for JBT & B.Ed
INSERT INTO public.fee_rules (course, tuition_fee, admission_fee, exam_fee, library_fee, development_fee, lab_fee, late_fee_per_day, scholarship_discounts)
VALUES 
    ('JBT', 45000, 5000, 4000, 3000, 5000, 3000, 50, '{"SC": 10000, "ST": 10000, "OBC": 5000, "General": 0}'::jsonb),
    ('B.Ed', 55000, 6000, 5000, 4000, 5000, 3000, 75, '{"SC": 12000, "ST": 12000, "OBC": 6000, "General": 0}'::jsonb)
ON CONFLICT (course) DO NOTHING;

-- Seed Initial Student Records (JBT & B.Ed)
INSERT INTO public.students (
    id, registration_no, name, father_name, phone, email, course, semester, roll_no, session, 
    total_fees, paid_till_now, remaining_fees, fee_status, next_due_date, address, category, 
    fee_breakdown, payment_history
) VALUES 
(
    'STU-JBT-001', 'REG-2024-JBT-01', 'Aarav Sharma', 'Sanjay Sharma', '9816012345', 'aarav.sharma@gmail.com',
    'JBT', '1st Year', 'JBT-24-001', '2024-2026', 65000, 35000, 30000, 'Partly Paid', '2024-11-15',
    'VPO Chamiyana, Tehsil & Distt Shimla, HP', 'General',
    '{"tuitionFee": 45000, "admissionFee": 5000, "examFee": 4000, "libraryFee": 3000, "developmentFee": 5000, "labFee": 3000}'::jsonb,
    '[{"id": "RCP-2024-101", "amount": 35000, "date": "2024-07-15", "mode": "UPI", "transactionRef": "UPI/409182736", "remark": "1st Installment Paid"}]'::jsonb
),
(
    'STU-BED-001', 'REG-2024-BED-01', 'Ananya Thakur', 'Rajinder Thakur', '9816067890', 'ananya.thakur@gmail.com',
    'B.Ed', '1st Semester', 'BED-24-001', '2024-2026', 78000, 78000, 0, 'Paid', '2025-03-31',
    'Lower Bazaar, Solan, HP', 'SC',
    '{"tuitionFee": 55000, "admissionFee": 6000, "examFee": 5000, "libraryFee": 4000, "developmentFee": 5000, "labFee": 3000}'::jsonb,
    '[{"id": "RCP-2024-201", "amount": 78000, "date": "2024-07-20", "mode": "NEFT", "transactionRef": "NEFT/SBIN890123", "remark": "Full Annual Fee Paid"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
