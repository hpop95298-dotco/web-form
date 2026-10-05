-- ============================================================================
-- IEEE Innovation University Student Branch
-- Web Development Journey Registration System - Complete PostgreSQL Schema DDL
-- ============================================================================

-- 1. Create custom Enum types for application status
CREATE TYPE application_status_enum AS ENUM (
  'Submitted',
  'Under Review',
  'Accepted',
  'Waitlisted',
  'Rejected'
);

-- 2. Create sequence for human-readable reference codes (WDJ-2026-0001, etc.)
CREATE SEQUENCE IF NOT EXISTS application_code_seq START WITH 1 INCREMENT BY 1;

-- 3. Create main applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference Code
  application_code VARCHAR(50) NOT NULL UNIQUE DEFAULT ('WDJ-2026-' || LPAD(NEXTVAL('application_code_seq')::TEXT, 4, '0')),

  -- Student Information
  full_name VARCHAR(255) NOT NULL,
  university_id VARCHAR(100) NOT NULL UNIQUE,
  university_email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  faculty VARCHAR(150) NOT NULL,
  academic_year VARCHAR(50) NOT NULL,
  
  -- Technical Background
  programming_level VARCHAR(50) NOT NULL,
  web_development_experience VARCHAR(150) NOT NULL,
  technologies TEXT[] DEFAULT '{}'::TEXT[],
  other_technologies TEXT DEFAULT '',
  has_web_project VARCHAR(50) NOT NULL,
  project_description TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  
  -- Interests & Motivation
  interest_reason TEXT NOT NULL,
  interest_areas TEXT[] DEFAULT '{}'::TEXT[],
  
  -- Requirements
  has_laptop VARCHAR(10) NOT NULL,
  
  -- Status & Audit Timestamps
  status application_status_enum NOT NULL DEFAULT 'Submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Application Status History Table
CREATE TABLE IF NOT EXISTS public.application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  old_status VARCHAR(50) NOT NULL,
  new_status VARCHAR(50) NOT NULL,
  changed_by VARCHAR(255) NOT NULL DEFAULT 'admin@ieee-innovation.edu',
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Admin Audit Log Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  admin_email VARCHAR(255) NOT NULL DEFAULT 'admin@ieee-innovation.edu',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Create Indexes
CREATE INDEX IF NOT EXISTS idx_applications_code ON public.applications (application_code);
CREATE INDEX IF NOT EXISTS idx_applications_university_id ON public.applications (university_id);
CREATE INDEX IF NOT EXISTS idx_applications_university_email ON public.applications (LOWER(university_email));
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON public.applications (submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_faculty ON public.applications (faculty);
CREATE INDEX IF NOT EXISTS idx_applications_academic_year ON public.applications (academic_year);
CREATE INDEX IF NOT EXISTS idx_status_history_app_id ON public.application_status_history (application_id);

-- 7. Automatically update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_applications_timestamp
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- Security Specification:
-- - Anyone (anon/public) can INSERT new applications during active registration.
-- - Public CANNOT SELECT, UPDATE, or DELETE student applications (Privacy Protection).
-- - Authenticated Admin users have full SELECT, UPDATE, DELETE privileges.
-- ============================================================================

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Applications RLS
CREATE POLICY "Allow public submission" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow admin read applications" ON public.applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin update applications" ON public.applications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin delete applications" ON public.applications FOR DELETE TO authenticated USING (true);

-- History RLS
CREATE POLICY "Allow admin read history" ON public.application_status_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin insert history" ON public.application_status_history FOR INSERT TO authenticated WITH CHECK (true);

-- Audit RLS
CREATE POLICY "Allow admin read audit" ON public.admin_audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin insert audit" ON public.admin_audit_logs FOR INSERT TO authenticated WITH CHECK (true);
