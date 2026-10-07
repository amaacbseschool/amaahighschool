-- ====================================================================
-- AMAA HIGH SCHOOL — CONSOLIDATED FINAL PRODUCTION ACTIVATION
-- Combines Phase 4 grants + Phase 9 security hardening into one idempotent script.
-- Safe to run multiple times (all policies use DROP IF EXISTS first).
-- ====================================================================

-- ---------------------------------------------------------------
-- SECTION 1: SECURITY DEFINER HELPER FUNCTIONS
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_super_admin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_super_admin() TO authenticated;


-- ---------------------------------------------------------------
-- SECTION 2: TABLE-LEVEL GRANTS (PHASE 4 RESTORATION)
-- These allow the RLS engine to evaluate policies at all.
-- Without these, PostgreSQL returns 42501 before even checking RLS.
-- ---------------------------------------------------------------

-- admissions_enquiries: anon INSERT only (SELECT/UPDATE/DELETE require auth)
GRANT INSERT ON public.admissions_enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admissions_enquiries TO authenticated;

-- contact_messages: anon INSERT only
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;

-- school_notices: anon SELECT only (published rows via RLS)
GRANT SELECT ON public.school_notices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_notices TO authenticated;

-- governing_body: anon SELECT only (active rows via RLS)
GRANT SELECT ON public.governing_body TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.governing_body TO authenticated;

-- alumni_members: anon SELECT + INSERT (Phase 9 RLS blocks verified=true INSERT)
GRANT SELECT, INSERT ON public.alumni_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alumni_members TO authenticated;

-- newsletter_subscribers: anon INSERT only
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;

-- admin_profiles: authenticated only (anon has no access at all)
REVOKE ALL ON public.admin_profiles FROM anon;
GRANT SELECT, UPDATE, DELETE ON public.admin_profiles TO authenticated;

-- Prevent anon from mutating notices and governing body
REVOKE INSERT, UPDATE, DELETE ON public.school_notices FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.governing_body FROM anon;
-- Prevent anon from mutating or deleting alumni
REVOKE UPDATE, DELETE ON public.alumni_members FROM anon;


-- ---------------------------------------------------------------
-- SECTION 3: admin_profiles POLICIES (PHASE 4)
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "Self read or super_admin read all admin_profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Staff can view admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.admin_profiles;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.admin_profiles;
DROP POLICY IF EXISTS "Authenticated users can view admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Staff can read admin_profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Allow read admin_profiles" ON public.admin_profiles;

CREATE POLICY "Self read or super_admin read all admin_profiles"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR public.is_super_admin()
);


-- ---------------------------------------------------------------
-- SECTION 4: ALUMNI MEMBERS POLICIES (Phase 9 hardening)
-- ---------------------------------------------------------------

-- Set verified default to false at column level
ALTER TABLE public.alumni_members
  ALTER COLUMN verified SET DEFAULT false;

-- Public INSERT: only permitted when verified=false (blocks injection of verified=true)
DROP POLICY IF EXISTS "Public can register as alumni" ON public.alumni_members;
DROP POLICY IF EXISTS "Public can insert alumni members" ON public.alumni_members;
CREATE POLICY "Public can register as alumni"
ON public.alumni_members
FOR INSERT
TO anon, authenticated
WITH CHECK (verified = false);

-- Public SELECT: only verified=true alumni visible
DROP POLICY IF EXISTS "Public can view verified alumni" ON public.alumni_members;
CREATE POLICY "Public can view verified alumni"
ON public.alumni_members
FOR SELECT
TO anon
USING (verified = true);

-- Staff full SELECT
DROP POLICY IF EXISTS "Staff can view alumni members" ON public.alumni_members;
CREATE POLICY "Staff can view alumni members"
ON public.alumni_members
FOR SELECT
TO authenticated
USING (true);

-- Admin UPDATE/DELETE only
DROP POLICY IF EXISTS "Staff can update alumni members" ON public.alumni_members;
DROP POLICY IF EXISTS "Admin staff can update alumni members" ON public.alumni_members;
CREATE POLICY "Admin staff can update alumni members"
ON public.alumni_members
FOR UPDATE
TO authenticated
USING (public.is_admin_or_super_admin())
WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Staff can delete alumni members" ON public.alumni_members;
DROP POLICY IF EXISTS "Admin staff can delete alumni members" ON public.alumni_members;
CREATE POLICY "Admin staff can delete alumni members"
ON public.alumni_members
FOR DELETE
TO authenticated
USING (public.is_admin_or_super_admin());


-- ---------------------------------------------------------------
-- SECTION 5: CONTACT MESSAGES POLICIES (Phase 9 hardening)
-- ---------------------------------------------------------------

-- Public INSERT: only status='Unread' allowed (blocks status spoofing)
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'Unread');

-- Staff SELECT (all messages)
DROP POLICY IF EXISTS "Staff can manage contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Staff can view contact messages" ON public.contact_messages;
CREATE POLICY "Staff can view contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

-- Admin UPDATE/DELETE
DROP POLICY IF EXISTS "Staff can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin staff can update contact messages" ON public.contact_messages;
CREATE POLICY "Admin staff can update contact messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (public.is_admin_or_super_admin())
WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Staff can delete contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin staff can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admin staff can delete contact messages"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (public.is_admin_or_super_admin());


-- ---------------------------------------------------------------
-- SECTION 6: ADMISSIONS ENQUIRIES POLICIES (Phase 9 hardening)
-- ---------------------------------------------------------------

-- Public INSERT: only status='Pending Review' allowed
DROP POLICY IF EXISTS "Public can insert admissions enquiries" ON public.admissions_enquiries;
CREATE POLICY "Public can insert admissions enquiries"
ON public.admissions_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'Pending Review');

-- Staff SELECT
DROP POLICY IF EXISTS "Staff can view admissions enquiries" ON public.admissions_enquiries;
CREATE POLICY "Staff can view admissions enquiries"
ON public.admissions_enquiries
FOR SELECT
TO authenticated
USING (true);

-- Admin UPDATE
DROP POLICY IF EXISTS "Staff can update admissions status and notes" ON public.admissions_enquiries;
DROP POLICY IF EXISTS "Staff can update admissions enquiries" ON public.admissions_enquiries;
DROP POLICY IF EXISTS "Admin staff can update admissions enquiries" ON public.admissions_enquiries;
CREATE POLICY "Admin staff can update admissions enquiries"
ON public.admissions_enquiries
FOR UPDATE
TO authenticated
USING (public.is_admin_or_super_admin())
WITH CHECK (public.is_admin_or_super_admin());

-- Admin DELETE
DROP POLICY IF EXISTS "Super Admins can delete admissions records" ON public.admissions_enquiries;
DROP POLICY IF EXISTS "Staff can delete admissions enquiries" ON public.admissions_enquiries;
DROP POLICY IF EXISTS "Admin staff can delete admissions records" ON public.admissions_enquiries;
CREATE POLICY "Admin staff can delete admissions records"
ON public.admissions_enquiries
FOR DELETE
TO authenticated
USING (public.is_admin_or_super_admin());


-- ---------------------------------------------------------------
-- SECTION 7: SCHOOL NOTICES POLICIES (Phase 4)
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "Public can view published notices" ON public.school_notices;
CREATE POLICY "Public can view published notices"
ON public.school_notices
FOR SELECT
TO anon
USING (published = true);

DROP POLICY IF EXISTS "Staff can manage all school notices" ON public.school_notices;
DROP POLICY IF EXISTS "Staff can view all school notices" ON public.school_notices;
CREATE POLICY "Staff can view all school notices"
ON public.school_notices
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Staff can insert school notices" ON public.school_notices;
DROP POLICY IF EXISTS "Admin staff can insert school notices" ON public.school_notices;
CREATE POLICY "Admin staff can insert school notices"
ON public.school_notices
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Staff can update school notices" ON public.school_notices;
DROP POLICY IF EXISTS "Admin staff can update school notices" ON public.school_notices;
CREATE POLICY "Admin staff can update school notices"
ON public.school_notices
FOR UPDATE
TO authenticated
USING (public.is_admin_or_super_admin())
WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Staff can delete school notices" ON public.school_notices;
DROP POLICY IF EXISTS "Admin staff can delete school notices" ON public.school_notices;
CREATE POLICY "Admin staff can delete school notices"
ON public.school_notices
FOR DELETE
TO authenticated
USING (public.is_admin_or_super_admin());


-- ---------------------------------------------------------------
-- SECTION 8: GOVERNING BODY POLICIES (Phase 4)
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "Public can view active trustees" ON public.governing_body;
CREATE POLICY "Public can view active trustees"
ON public.governing_body
FOR SELECT
TO anon
USING (is_active = true);

DROP POLICY IF EXISTS "Staff can manage governing body" ON public.governing_body;
DROP POLICY IF EXISTS "Staff can view governing body" ON public.governing_body;
CREATE POLICY "Staff can view governing body"
ON public.governing_body
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Staff can insert governing body" ON public.governing_body;
DROP POLICY IF EXISTS "Admin staff can insert governing body" ON public.governing_body;
CREATE POLICY "Admin staff can insert governing body"
ON public.governing_body
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Staff can update governing body" ON public.governing_body;
DROP POLICY IF EXISTS "Admin staff can update governing body" ON public.governing_body;
CREATE POLICY "Admin staff can update governing body"
ON public.governing_body
FOR UPDATE
TO authenticated
USING (public.is_admin_or_super_admin())
WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Staff can delete governing body" ON public.governing_body;
DROP POLICY IF EXISTS "Admin staff can delete governing body" ON public.governing_body;
CREATE POLICY "Admin staff can delete governing body"
ON public.governing_body
FOR DELETE
TO authenticated
USING (public.is_admin_or_super_admin());


-- ---------------------------------------------------------------
-- SECTION 9: NEWSLETTER SUBSCRIBERS POLICIES (Phase 4)
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public can insert newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can view subscriber list" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Staff can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Staff can view subscriber list"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Staff can update newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admin staff can update newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin staff can update newsletter subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (public.is_admin_or_super_admin())
WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Staff can delete newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admin staff can delete newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin staff can delete newsletter subscribers"
ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING (public.is_admin_or_super_admin());


-- ---------------------------------------------------------------
-- SECTION 10: ADMIN PROFILES — SUPER ADMIN MANAGEMENT (Phase 9)
-- ---------------------------------------------------------------

DROP POLICY IF EXISTS "Super admins can update admin_profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can update admin_profiles"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can delete admin_profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can delete admin_profiles"
ON public.admin_profiles
FOR DELETE
TO authenticated
USING (public.is_super_admin());


-- ---------------------------------------------------------------
-- SECTION 11: ADMISSIONS STORAGE (Phase 4)
-- ---------------------------------------------------------------

UPDATE storage.buckets
SET public = false
WHERE id = 'admissions-documents';

GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT INSERT ON storage.objects TO anon;

DROP POLICY IF EXISTS "Applicants can upload admission documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous admission upload" ON storage.objects;
DROP POLICY IF EXISTS "Applicants can upload to admissions" ON storage.objects;
CREATE POLICY "Applicants can upload admission documents"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'admissions-documents'
  AND (storage.foldername(name))[1] = 'admissions'
);

DROP POLICY IF EXISTS "Staff can access admission documents" ON storage.objects;
DROP POLICY IF EXISTS "Staff can view admission documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin staff can view admission documents" ON storage.objects;
CREATE POLICY "Admin staff can view admission documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'admissions-documents'
  AND public.is_admin_or_super_admin()
);

DROP POLICY IF EXISTS "Staff can modify admission documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin staff can update admission documents" ON storage.objects;
CREATE POLICY "Admin staff can update admission documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'admissions-documents' AND public.is_admin_or_super_admin())
WITH CHECK (bucket_id = 'admissions-documents' AND public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Staff can delete admission documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin staff can delete admission documents" ON storage.objects;
CREATE POLICY "Admin staff can delete admission documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'admissions-documents' AND public.is_admin_or_super_admin());


-- ====================================================================
-- MIGRATION COMPLETE
-- Apply supabase_phase9_cleanup_test_records.sql separately after verifying
-- ====================================================================
