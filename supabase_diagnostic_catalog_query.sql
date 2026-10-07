-- ====================================================================
-- DIAGNOSTIC CATALOG QUERY
-- Run this in Supabase SQL Editor to see the EXACT live state of
-- grants and RLS policies for the 3 affected tables.
-- ====================================================================

-- 1. Table-level privileges for the anon role
SELECT
  table_name,
  privilege_type,
  grantee
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
  AND table_name IN (
    'alumni_members',
    'contact_messages',
    'admissions_enquiries'
  )
ORDER BY table_name, grantee, privilege_type;

-- 2. RLS policies on the 3 affected tables
SELECT
  tablename,
  policyname,
  cmd AS command,
  roles,
  qual AS using_expr,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'alumni_members',
    'contact_messages',
    'admissions_enquiries'
  )
ORDER BY tablename, cmd, policyname;

-- 3. Column definition for alumni_members.verified
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'alumni_members'
  AND column_name = 'verified';

-- 4. Check for any RESTRICTIVE policies (these override permissive ones)
SELECT
  tablename,
  policyname,
  permissive,
  cmd,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('alumni_members', 'contact_messages', 'admissions_enquiries')
  AND permissive = 'RESTRICTIVE'
ORDER BY tablename;
