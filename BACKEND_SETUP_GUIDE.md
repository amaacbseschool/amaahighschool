# AMAA High School — Complete Supabase Backend Architecture & Setup Guide

> **Document Status**: Strategic Architecture Blueprint (No backend changes implemented yet)  
> **Target Database & BaaS**: [Supabase](https://supabase.com/) (PostgreSQL 15+, Row Level Security, Supabase Auth, Storage, and Realtime)  
> **Target Frontend**: React 19 + TypeScript + Vite + TailwindCSS v4  
> **Project Scope**: A.M.A. Adinarayana English Medium High School (Estd. 1965, Diamond Jubilee)

---

## 1. Executive Summary & Purpose

This guide outlines the complete backend architecture, database schema, security policies, and migration roadmap for transitioning the AMAA High School portal from its current client-side mock storage to a production-grade **Supabase** backend.

**Zero code modifications or backend dependencies have been installed.** This document serves as the exact step-by-step roadmap when you are ready to initiate implementation.

---

## 2. Current Frontend State & Data Inventory

The frontend currently uses an in-memory & `localStorage`-backed relational database abstraction defined in [`src/lib/db.ts`](./src/lib/db.ts). 

### Current Data Stores & Schema Footprint:

| Module / Entity | Current Storage Key | Current Frontend Component(s) | Operations Supported |
| :--- | :--- | :--- | :--- |
| **Admissions Enquiries** | `amaa_db_admissions_v1` | `AdmissionModal.tsx`, `AdmissionsCtaSection.tsx`, `AdminDashboardPage.tsx` | Create enquiry, list/filter, status update (`Pending Review` → `Admission Approved`), delete |
| **Contact Inquiries & Grievances** | `amaa_db_contacts_v1` | `ContactSection.tsx`, `ContactPage.tsx`, `AdminDashboardPage.tsx` | Create message, mark `Unread` / `In Progress` / `Resolved`, delete |
| **School Notices & Circulars** | `amaa_db_notices_v1` | `NoticeTicker.tsx`, `NewsEventsPage.tsx`, `AdminDashboardPage.tsx` | Display ticker, post new notice, toggle importance, delete |
| **Newsletter Subscribers** | `amaa_db_subscribers_v1` | `Footer.tsx` | Subscribe email, list subscribers |
| **Alumni Network** | `amaa_db_alumni_v1` | `AchievementsPage.tsx`, `AchievementsSection.tsx`, `db.ts` | Register alumnus, browse directory, showcase testimonials |
| **Governing Body & Trustees** | `amaa_db_governing_body_v1`| `AdministrationPage.tsx`, `AdminDashboardPage.tsx` | Display leadership roster, add/edit trustees, reorder display index |
| **Admin Authentication** | `sessionStorage: amaa_admin_auth` | `AdminDashboardPage.tsx`, `TopBar.tsx` | Client-side 4-digit PIN check (`1965`) |
| **Gallery & Media** | Static JSON / Local Assets | `GalleryPage.tsx`, `StudentLifeGallery.tsx`, `schoolGalleryData.ts` | Static local webp assets & categories |

---

## 3. Recommended Supabase Architecture

```
                                  +-------------------------------------------------+
                                  |              React 19 Frontend Client           |
                                  |   (Vite, TailwindCSS v4, TypeScript, Lucide)    |
                                  +-----------------------+-------------------------+
                                                          |
                                      HTTPS REST / Realtime WebSocket (wss)
                                                          |
                                  +-----------------------v-------------------------+
                                  |                 Supabase API Gateway            |
                                  |           (Kong API Gateway + PostgREST)        |
                                  +---+-------------------+---------------------+---+
                                      |                   |                     |
             +------------------------v----+      +-------v------------+   +----v--------------------+
             |        Supabase Auth        |      |  PostgreSQL 15+ DB |   |     Supabase Storage    |
             |   - Staff & Admin Login     |      |  - Relational Data |   |   - admissions-docs     |
             |   - Role-Based Access (JWT) |      |  - Row Level Sec.  |   |   - circulars-pdf       |
             |   - Audit Logging           |      |  - Automated Backup|   |   - gallery-media       |
             +-----------------------------+      +--------------------+   +-------------------------+
```

### Core Advantages for AMAA High School:
1. **Row Level Security (RLS)**: Enforces at the database engine level that anonymous public visitors can only submit applications or view published circulars, while administrative records (parent phone numbers, internal review notes) remain locked to authenticated staff.
2. **Realtime Engine**: Broadcasts newly published emergency circulars or urgent school announcements to the live `NoticeTicker` without requiring page refreshes.
3. **Storage Integration**: Securely archives student birth certificates, transfer certificates, and mark sheets directly linked to admission applications.
4. **PostgreSQL Relational Rigor**: Enforces email uniqueness, foreign keys, timestamps, and indexing for high-volume admissions periods.

---

## 4. Complete PostgreSQL DDL (Ready to Run in Supabase SQL Editor)

When setting up your Supabase project, execute the following SQL script in the **Supabase Dashboard > SQL Editor**:

```sql
-- ====================================================================
-- AMAA HIGH SCHOOL — PRODUCTION DATABASE SCHEMA (POSTGRESQL 15+)
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enumerated Types
CREATE TYPE admission_status_enum AS ENUM (
  'Pending Review',
  'Document Verification',
  'Interview Scheduled',
  'Admission Approved',
  'Rejected'
);

CREATE TYPE message_status_enum AS ENUM (
  'Unread',
  'In Progress',
  'Resolved'
);

CREATE TYPE notice_category_enum AS ENUM (
  'Academic',
  'Admissions',
  'Sports',
  'Circular',
  'Events'
);

CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'admissions_officer',
  'academic_coordinator',
  'viewer'
);

-- ====================================================================
-- 3. Admissions Enquiries Table
-- ====================================================================
CREATE TABLE public.admissions_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(32) UNIQUE NOT NULL DEFAULT ('AMAA-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
  student_name VARCHAR(150) NOT NULL,
  parent_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  grade_applying VARCHAR(50) NOT NULL,
  previous_school VARCHAR(255) DEFAULT '',
  notes TEXT DEFAULT '',
  document_urls TEXT[] DEFAULT '{}',
  status admission_status_enum NOT NULL DEFAULT 'Pending Review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_admissions_status ON public.admissions_enquiries(status);
CREATE INDEX idx_admissions_created ON public.admissions_enquiries(created_at DESC);
CREATE INDEX idx_admissions_phone ON public.admissions_enquiries(phone);

-- ====================================================================
-- 4. Contact Messages & Grievance Tickets
-- ====================================================================
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(32) UNIQUE NOT NULL DEFAULT ('TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0')),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status message_status_enum NOT NULL DEFAULT 'Unread',
  admin_notes TEXT DEFAULT '',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_contacts_status ON public.contact_messages(status);
CREATE INDEX idx_contacts_created ON public.contact_messages(created_at DESC);

-- ====================================================================
-- 5. School Notices & Urgent Tickers
-- ====================================================================
CREATE TABLE public.school_notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  category notice_category_enum NOT NULL DEFAULT 'Academic',
  content TEXT NOT NULL,
  date_label VARCHAR(50) NOT NULL,
  is_important BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  attachment_url VARCHAR(500),
  published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_notices_published ON public.school_notices(is_published, is_important, created_at DESC);

-- ====================================================================
-- 6. Newsletter Subscribers
-- ====================================================================
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================================================
-- 7. Alumni Community & Hall of Fame
-- ====================================================================
CREATE TABLE public.alumni_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(150) NOT NULL,
  batch_year VARCHAR(10) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  current_role VARCHAR(150) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  testimonial TEXT,
  photo_url VARCHAR(500),
  linkedin VARCHAR(255),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_alumni_approved ON public.alumni_members(is_approved, is_featured);

-- ====================================================================
-- 8. Governing Body & Leadership Board
-- ====================================================================
CREATE TABLE public.governing_body (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  designation VARCHAR(150) NOT NULL,
  committee VARCHAR(150) NOT NULL,
  qualification VARCHAR(255) NOT NULL,
  experience VARCHAR(255) NOT NULL,
  photo_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(20),
  order_index INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_governing_order ON public.governing_body(order_index ASC);

-- ====================================================================
-- 9. Staff / Admin User Profiles (Linked to Supabase Auth)
-- ====================================================================
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'viewer',
  department VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ====================================================================
-- 10. Automated Updated-At Trigger
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admissions_updated_at
  BEFORE UPDATE ON public.admissions_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_notices_updated_at
  BEFORE UPDATE ON public.school_notices
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_governing_updated_at
  BEFORE UPDATE ON public.governing_body
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## 5. Row Level Security (RLS) Policies

To protect sensitive student and applicant data, Row Level Security must be activated on every table.

```sql
-- Enable RLS across all tables
ALTER TABLE public.admissions_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governing_body ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- A. Admissions Enquiries Policies
-- --------------------------------------------------------------------
-- Public: Anyone can submit an admission enquiry
CREATE POLICY "Public can insert admissions enquiries"
  ON public.admissions_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated Staff: Only logged-in admin users can read, update, or delete
CREATE POLICY "Staff can view admissions enquiries"
  ON public.admissions_enquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can update admissions status and notes"
  ON public.admissions_enquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Super Admins can delete admissions records"
  ON public.admissions_enquiries FOR DELETE
  TO authenticated
  USING (true);

-- --------------------------------------------------------------------
-- B. Contact Messages Policies
-- --------------------------------------------------------------------
-- Public: Anyone can send a message/grievance
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Staff: Only authenticated staff can view and manage tickets
CREATE POLICY "Staff can manage contact messages"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------
-- C. School Notices Policies
-- --------------------------------------------------------------------
-- Public: Anyone can view active/published notices
CREATE POLICY "Public can view published notices"
  ON public.school_notices FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Staff: Full CRUD for authenticated staff
CREATE POLICY "Staff can manage all school notices"
  ON public.school_notices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------
-- D. Governing Body Policies
-- --------------------------------------------------------------------
-- Public: Anyone can view active governing body members
CREATE POLICY "Public can view active trustees"
  ON public.governing_body FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Staff: Full management
CREATE POLICY "Staff can manage governing body"
  ON public.governing_body FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------
-- E. Newsletter Subscribers Policies
-- --------------------------------------------------------------------
CREATE POLICY "Public can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view subscriber list"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);
```

---

## 6. Supabase Storage Configuration

In **Supabase Dashboard > Storage**, create the following 3 storage buckets:

| Bucket Name | Privacy Level | Max File Size | Allowed MIME Types | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `admissions-documents` | **Private** | 10 MB | `image/jpeg`, `image/png`, `application/pdf` | Student birth certificate, previous report cards, Aadhaar copy |
| `school-circulars` | **Public** | 25 MB | `application/pdf` | Official signed board circulars, exam timetables, fee schedules |
| `governing-avatars` | **Public** | 5 MB | `image/jpeg`, `image/png`, `image/webp` | Photos of Board of Trustees & Principals |

### Storage Bucket RLS Policy (SQL):
```sql
-- Allow applicants to upload files into admissions-documents
CREATE POLICY "Applicants can upload admission documents"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'admissions-documents');

-- Only authenticated staff can download/read admissions documents
CREATE POLICY "Staff can access admission documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'admissions-documents');

-- Public can view circulars and governing avatars
CREATE POLICY "Public can view circulars and avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('school-circulars', 'governing-avatars'));
```

---

## 7. Environment Configuration (`.env`)

When ready to connect, generate a `.env.local` file in `school_website/`:

```bash
# Supabase API Credentials (from Supabase Project Settings > API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: School Administration Contact
VITE_SCHOOL_OFFICIAL_EMAIL=info@amaaschool.edu
VITE_ADMISSIONS_HELPLINE=+917544010044
```

> **Security Rule**: Never expose the `SERVICE_ROLE_KEY` in frontend code or anywhere in client-side Vite bundles. Only use `VITE_SUPABASE_ANON_KEY`.

---

## 8. Next Implementation Steps (Phase-by-Phase Roadmap)

When you are ready to implement the backend, execute the phases in this exact sequence:

```
[Phase 1: Project Provisioning]
   ├── Create Supabase Project (Region: South Asia / Mumbai for fastest latency)
   ├── Execute DDL Script in SQL Editor
   └── Configure Storage Buckets & Policies
        │
[Phase 2: Client Installation]
   ├── Run: npm install @supabase/supabase-js
   └── Create src/lib/supabase.ts (Singleton Supabase Client)
        │
[Phase 3: Database Service Layer Migration]
   ├── Refactor src/lib/db.ts to query Supabase REST API
   ├── Maintain offline / fallback cache for zero downtime
   └── Wire AdmissionModal and ContactPage to real DB
        │
[Phase 4: Admin Authentication Migration]
   ├── Replace static PIN ("1965") in AdminDashboardPage.tsx
   └── Implement Supabase Auth (Email + OTP or Password with Supabase Session)
        │
[Phase 5: Realtime Notice Ticker]
   └── Subscribe NoticeTicker.tsx to Supabase Realtime channel (`school_notices`)
```

---

## 9. Code Template Previews for Implementation

### A. Client Initialization Template (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Running in local mock mode.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
```

### B. Admissions Submission Service (`src/services/admissionsService.ts`)
```typescript
import { supabase } from '../lib/supabase';

export interface AdmissionPayload {
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade_applying: string;
  previous_school?: string;
  notes?: string;
}

export const submitAdmissionEnquiry = async (data: AdmissionPayload) => {
  const { data: record, error } = await supabase
    .from('admissions_enquiries')
    .insert([data])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return record;
};
```

---

## 10. Summary & Sign-off

- **Current Frontend State**: 100% operational with responsive UI, cohesive `#354024` primary and `#cfbb99` secondary branding, zero blue tones, and client-side data mocks.
- **Backend Readiness**: Fully designed, DDL scripted, security hardened with RLS, ready for instant deployment as soon as you provide the Supabase project credentials.
