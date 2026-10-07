-- ====================================================================
-- AMAA HIGH SCHOOL — PHASE 9.1 PRODUCTION SECURITY FIXES
-- ====================================================================
-- This migration hardens database-level authorization and public grants:
-- 1. Hardens alumni registration to strictly enforce verified = false
-- 2. Grants public SELECT on school_notices, governing_body, alumni_members
-- 3. Enables super_admin UPDATE & DELETE on admin_profiles
-- 4. Hardens public form status defaults on contact_messages & admissions
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. ALUMNI VERIFICATION SECURITY
-- --------------------------------------------------------------------
-- Ensure alumni default is unverified (verified = false)
ALTER TABLE public.alumni_members 
  ALTER COLUMN verified SET DEFAULT false;

-- Restrict public inserts: anonymous submissions CANNOT set verified = true
DROP POLICY IF EXISTS "Public can register as alumni" ON public.alumni_members;
CREATE POLICY "Public can register as alumni"
ON public.alumni_members
FOR INSERT
TO anon, authenticated
WITH CHECK (verified = false);


-- --------------------------------------------------------------------
-- 2. PUBLIC OPERATIONAL SELECT GRANTS
-- --------------------------------------------------------------------
-- Explicitly grant SELECT privileges to the anon role for public-facing tables.
-- Underlying RLS policies ensure only active/published/verified rows are returned.
GRANT SELECT ON public.school_notices TO anon;
GRANT SELECT ON public.governing_body TO anon;
GRANT SELECT ON public.alumni_members TO anon;

-- Safeguard: Ensure anon CANNOT mutate notices or governing body
REVOKE INSERT, UPDATE, DELETE ON public.school_notices FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.governing_body FROM anon;
REVOKE UPDATE, DELETE ON public.alumni_members FROM anon;


-- --------------------------------------------------------------------
-- 3. ADMIN_PROFILES SUPER_ADMIN ROLE MANAGEMENT
-- --------------------------------------------------------------------
-- Allow super_admin to update staff details and role assignments
DROP POLICY IF EXISTS "Super admins can update admin_profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can update admin_profiles"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- Allow super_admin to delete staff profiles
DROP POLICY IF EXISTS "Super admins can delete admin_profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can delete admin_profiles"
ON public.admin_profiles
FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- Ensure table-level permissions allow authenticated role to evaluate RLS
GRANT UPDATE, DELETE ON public.admin_profiles TO authenticated;


-- --------------------------------------------------------------------
-- 4. CONTACT & ADMISSIONS FORM STATUS CONSTRAINTS
-- --------------------------------------------------------------------
-- Restrict anonymous contact submissions to status = 'Unread'
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'Unread');

-- Restrict anonymous admission enquiries to status = 'Pending Review'
DROP POLICY IF EXISTS "Public can insert admissions enquiries" ON public.admissions_enquiries;
CREATE POLICY "Public can insert admissions enquiries"
ON public.admissions_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'Pending Review');
