-- ====================================================================
-- AMAA HIGH SCHOOL — PHASE 4 SECURITY HARDENING (DATABASE/RLS ONLY)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. SECURITY DEFINER HELPER FUNCTIONS
-- --------------------------------------------------------------------

-- Safe super_admin check avoiding recursive RLS evaluation
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

-- Safe admin or super_admin check
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


-- --------------------------------------------------------------------
-- 2. HARDEN admin_profiles SELECT POLICY
-- --------------------------------------------------------------------

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


-- --------------------------------------------------------------------
-- 3. ENFORCE VIEWER READ-ONLY AT DATABASE LEVEL
-- --------------------------------------------------------------------

-- Ensure table-level GRANTs allow RLS evaluation
GRANT INSERT ON public.admissions_enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.admissions_enquiries TO authenticated;

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;

GRANT SELECT ON public.school_notices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_notices TO authenticated;

GRANT SELECT ON public.governing_body TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.governing_body TO authenticated;

GRANT SELECT, INSERT ON public.alumni_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alumni_members TO authenticated;

GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;


-- A. admissions_enquiries
DROP POLICY IF EXISTS "Public can insert admissions enquiries" ON public.admissions_enquiries;
CREATE POLICY "Public can insert admissions enquiries"
ON public.admissions_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can view admissions enquiries" ON public.admissions_enquiries;
CREATE POLICY "Staff can view admissions enquiries"
ON public.admissions_enquiries
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Staff can update admissions status and notes" ON public.admissions_enquiries;
DROP POLICY IF EXISTS "Staff can update admissions enquiries" ON public.admissions_enquiries;
DROP POLICY IF EXISTS "Admin staff can update admissions enquiries" ON public.admissions_enquiries;
CREATE POLICY "Admin staff can update admissions enquiries"
ON public.admissions_enquiries
FOR UPDATE
TO authenticated
USING (public.is_admin_or_super_admin())
WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Super Admins can delete admissions records" ON public.admissions_enquiries;
DROP POLICY IF EXISTS "Staff can delete admissions enquiries" ON public.admissions_enquiries;
DROP POLICY IF EXISTS "Admin staff can delete admissions records" ON public.admissions_enquiries;
CREATE POLICY "Admin staff can delete admissions records"
ON public.admissions_enquiries
FOR DELETE
TO authenticated
USING (public.is_admin_or_super_admin());


-- B. contact_messages
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can manage contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Staff can view contact messages" ON public.contact_messages;
CREATE POLICY "Staff can view contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

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


-- C. school_notices
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


-- D. governing_body
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


-- E. alumni_members
DROP POLICY IF EXISTS "Public can register as alumni" ON public.alumni_members;
DROP POLICY IF EXISTS "Public can insert alumni members" ON public.alumni_members;
CREATE POLICY "Public can register as alumni"
ON public.alumni_members
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view verified alumni" ON public.alumni_members;
CREATE POLICY "Public can view verified alumni"
ON public.alumni_members
FOR SELECT
TO anon
USING (verified = true);

DROP POLICY IF EXISTS "Staff can view alumni members" ON public.alumni_members;
CREATE POLICY "Staff can view alumni members"
ON public.alumni_members
FOR SELECT
TO authenticated
USING (true);

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


-- F. newsletter_subscribers
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


-- --------------------------------------------------------------------
-- 4. HARDEN admissions-documents STORAGE POLICIES
-- --------------------------------------------------------------------

-- Ensure admissions-documents bucket is private
UPDATE storage.buckets
SET public = false
WHERE id = 'admissions-documents';

GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT INSERT ON storage.objects TO anon;

-- Anonymous and authenticated applicant uploads:
-- Restricted to bucket 'admissions-documents' AND folder prefix 'admissions/'
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

-- Staff read/download: Only admin and super_admin (Viewer and Public DENIED)
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

-- Staff update/replace: Only admin and super_admin (Viewer and Public DENIED)
DROP POLICY IF EXISTS "Staff can modify admission documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin staff can update admission documents" ON storage.objects;

CREATE POLICY "Admin staff can update admission documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'admissions-documents'
  AND public.is_admin_or_super_admin()
)
WITH CHECK (
  bucket_id = 'admissions-documents'
  AND public.is_admin_or_super_admin()
);

-- Staff delete: Only admin and super_admin (Viewer and Public DENIED)
DROP POLICY IF EXISTS "Staff can delete admission documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin staff can delete admission documents" ON storage.objects;

CREATE POLICY "Admin staff can delete admission documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'admissions-documents'
  AND public.is_admin_or_super_admin()
);
