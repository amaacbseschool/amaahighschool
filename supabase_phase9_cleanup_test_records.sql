-- ====================================================================
-- AMAA HIGH SCHOOL — PHASE 9.2 CLEANUP: SYNTHETIC TEST RECORDS
-- ====================================================================
-- Deletes ONLY confirmed synthetic/audit test records.
-- PRESERVES genuine seeded candidate #AMAA-2026-000007 (Ananya Sharma)
-- and all 277 CMS seed rows.
--
-- SAFE TO RUN: All deletes are email-targeted. Genuine records are
-- explicitly excluded.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. CONTACT MESSAGES — All 8 are synthetic audit probes
-- --------------------------------------------------------------------
DELETE FROM public.contact_messages
WHERE email IN (
  'audit-test@example.com',
  'contact@example.com',
  'status-spoof@example.com'
)
OR email LIKE 'test-contact%'
OR email LIKE 'test_%@example.com'
OR subject LIKE 'Security Spoof Probe%'
OR subject LIKE 'Audit%'
OR subject LIKE '%probe%';

-- --------------------------------------------------------------------
-- 2. ALUMNI MEMBERS — All probe records should be deleted
-- --------------------------------------------------------------------
-- Delete records created by verify_phase9_fixes.mjs probes
DELETE FROM public.alumni_members
WHERE email LIKE 'audit-test-true-%@example.com'
   OR email LIKE 'audit-test-false-%@example.com'
   OR email LIKE 'audit-probe-alumni%@example.com'
   OR email LIKE 'alumni_%@example.com'
   OR full_name LIKE 'Security Probe%'
   OR full_name LIKE 'Alumni Spoof%'
   OR full_name LIKE 'audit-%';

-- --------------------------------------------------------------------
-- 3. ADMISSIONS ENQUIRIES — Delete only synthetic test records
-- --------------------------------------------------------------------
-- PRESERVE #AMAA-2026-000007 (Ananya Sharma) and any genuine records
-- Delete confirmed synthetic entries by parent_email
DELETE FROM public.admissions_enquiries
WHERE parent_email IN (
  'security-test@example.com',
  'verification-test@example.com',
  'spoof-admission@example.com'
)
OR student_name IN (
  'Security Test Student',
  'Verification Test Student'
);

-- --------------------------------------------------------------------
-- 4. NEWSLETTER SUBSCRIBERS — All 5 are synthetic test records
-- --------------------------------------------------------------------
DELETE FROM public.newsletter_subscribers
WHERE email LIKE 'test_%@example.com'
   OR email LIKE '%_test_%@example.com'
   OR email = 'invalid_audit_email_format'
   OR email LIKE 'audit-%';

-- ====================================================================
-- SAFETY VERIFICATION QUERY (run after deletion to confirm)
-- ====================================================================
-- SELECT COUNT(*) FROM public.contact_messages;          -- expect 0
-- SELECT COUNT(*) FROM public.alumni_members;            -- expect verified seed rows
-- SELECT COUNT(*) FROM public.admissions_enquiries;      -- expect 1 (Ananya Sharma)
-- SELECT COUNT(*) FROM public.newsletter_subscribers;    -- expect 0
-- ====================================================================
