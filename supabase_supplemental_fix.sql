-- ====================================================================
-- AMAA HIGH SCHOOL — SUPPLEMENTAL FIX SQL
-- Targets only the 3 remaining failures from the live verification:
--
-- FAILURE 1: contact_messages anon INSERT → 42501 (GRANT missing)
-- FAILURE 2: admissions_enquiries anon INSERT → 42501 (GRANT missing)
-- FAILURE 3: alumni_members verified=false INSERT → RLS violation
--            (policy WITH CHECK (verified = false) blocks verified=false rows)
--            + verified=true INSERT still succeeds (RLS not working correctly)
-- ====================================================================

-- ------------------------------------------------------------------
-- FIX 1: RESTORE GRANTS for contact_messages and admissions_enquiries
-- ------------------------------------------------------------------
GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.admissions_enquiries TO anon;

-- ------------------------------------------------------------------
-- FIX 2: REPAIR alumni_members INSERT RLS policy
-- The policy WITH CHECK (verified = false) is correct for blocking
-- verified=true injections, but it requires that the INSERT explicitly
-- sets verified=false OR relies on the column DEFAULT.
-- The issue: when verified is not provided, PostgreSQL evaluates the
-- WITH CHECK against the final stored value. If DEFAULT false is set
-- correctly, (verified = false) SHOULD pass. But the evidence shows
-- verified=false INSERT is also blocked (RLS error), suggesting the
-- DEFAULT was not applied or there's a different conflict.
--
-- Solution: use a more permissive but secure check:
-- Allow INSERT when verified IS NOT TRUE (i.e. false or null)
-- This correctly allows verified=false or no verified field,
-- and blocks verified=true.
-- ------------------------------------------------------------------

-- Re-apply DEFAULT false explicitly
ALTER TABLE public.alumni_members
  ALTER COLUMN verified SET DEFAULT false;

-- Drop and recreate with correct WITH CHECK expression
DROP POLICY IF EXISTS "Public can register as alumni" ON public.alumni_members;
DROP POLICY IF EXISTS "Public can insert alumni members" ON public.alumni_members;

CREATE POLICY "Public can register as alumni"
ON public.alumni_members
FOR INSERT
TO anon, authenticated
WITH CHECK (verified IS NOT TRUE);

-- ------------------------------------------------------------------
-- FIX 3: Ensure contact_messages INSERT policy exists
-- ------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'Unread');

-- ------------------------------------------------------------------
-- FIX 4: Ensure admissions INSERT policy exists
-- ------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can insert admissions enquiries" ON public.admissions_enquiries;
CREATE POLICY "Public can insert admissions enquiries"
ON public.admissions_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'Pending Review');

-- ====================================================================
-- END OF SUPPLEMENTAL FIX
-- After applying this, re-run: node verify_final_production.mjs
-- ====================================================================
