import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';

const SUPABASE_URL = 'https://twozlscntgxiydbdcjkt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hztiNPS-PmeFQdETCR_djg_PSKuXste';

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyAllFixes() {
  console.log('====================================================');
  console.log('PHASE 9.1 LIVE DATABASE VERIFICATION');
  console.log('====================================================\n');

  // 1. Check Public Grants
  console.log('--- 1. PUBLIC OPERATIONAL SELECT GRANTS ---');
  const { data: notices, error: noticeErr } = await anonClient
    .from('school_notices')
    .select('id, title, published')
    .limit(5);
  console.log('school_notices (published rows):', {
    success: !noticeErr,
    count: notices?.length,
    error: noticeErr ? `${noticeErr.code}: ${noticeErr.message}` : null,
  });

  const { data: unpubNotices } = await anonClient
    .from('school_notices')
    .select('id')
    .eq('published', false);
  console.log('school_notices (unpublished rows visible):', unpubNotices?.length ?? 0);

  const { data: trustees, error: trustErr } = await anonClient
    .from('governing_body')
    .select('id, full_name, is_active')
    .limit(5);
  console.log('governing_body (active trustees):', {
    success: !trustErr,
    count: trustees?.length,
    error: trustErr ? `${trustErr.code}: ${trustErr.message}` : null,
  });

  const { data: inactTrustees } = await anonClient
    .from('governing_body')
    .select('id')
    .eq('is_active', false);
  console.log('governing_body (inactive trustees visible):', inactTrustees?.length ?? 0);

  const { data: alumni, error: alumErr } = await anonClient
    .from('alumni_members')
    .select('id, full_name, verified')
    .limit(5);
  console.log('alumni_members (verified alumni):', {
    success: !alumErr,
    count: alumni?.length,
    error: alumErr ? `${alumErr.code}: ${alumErr.message}` : null,
  });

  const { data: unverAlumni } = await anonClient
    .from('alumni_members')
    .select('id')
    .eq('verified', false);
  console.log('alumni_members (unverified alumni visible):', unverAlumni?.length ?? 0);

  // 2. Test Alumni Verification Security
  console.log('\n--- 2. ALUMNI VERIFICATION SECURITY TESTS ---');
  // Probe A: Attempt to register with verified = true
  const probeTrueId = `audit-test-true-${Date.now()}`;
  const { data: resTrue, error: errTrue, status: statusTrue } = await anonClient
    .from('alumni_members')
    .insert([{
      full_name: 'Security Probe True',
      graduation_year: 2024,
      email: `${probeTrueId}@example.com`,
      current_profession: 'Security Auditor',
      verified: true
    }]);
  console.log('Alumni insert with verified=true (Expect DENIED):', {
    status: statusTrue,
    blocked: statusTrue === 401 || statusTrue === 403 || errTrue?.code === '42501',
    error: errTrue ? `${errTrue.code}: ${errTrue.message}` : 'None'
  });

  // Probe B: Attempt to register with verified = false (standard public registration)
  const probeFalseId = `audit-test-false-${Date.now()}`;
  const { data: resFalse, error: errFalse, status: statusFalse } = await anonClient
    .from('alumni_members')
    .insert([{
      full_name: 'Security Probe Standard Registration',
      graduation_year: 2024,
      email: `${probeFalseId}@example.com`,
      current_profession: 'Security Auditor',
      verified: false
    }])
    .select('id');
  console.log('Alumni insert with verified=false (Expect ALLOWED):', {
    status: statusFalse,
    allowed: statusFalse === 201,
    createdRecordId: resFalse?.[0]?.id,
    error: errFalse ? `${errFalse.code}: ${errFalse.message}` : 'None'
  });

  // 3. Operational Forms Mutations
  console.log('\n--- 3. OPERATIONAL FORMS ANON MUTATION TESTS ---');
  const { status: cUpdStat, error: cUpdErr } = await anonClient
    .from('contact_messages')
    .update({ status: 'Resolved' })
    .neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('contact_messages anon UPDATE (Expect DENIED):', {
    status: cUpdStat,
    blocked: cUpdStat === 401 || cUpdStat === 403 || cUpdErr?.code === '42501',
    error: cUpdErr?.message
  });

  const { status: cDelStat, error: cDelErr } = await anonClient
    .from('contact_messages')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('contact_messages anon DELETE (Expect DENIED):', {
    status: cDelStat,
    blocked: cDelStat === 401 || cDelStat === 403 || cDelErr?.code === '42501',
    error: cDelErr?.message
  });

  // 4. CMS Mutations
  console.log('\n--- 4. CMS ANON MUTATION PROTECTION ---');
  const { status: cmsUpdStat, error: cmsUpdErr } = await anonClient
    .from('cms_pages')
    .update({ title: 'Hacked' })
    .eq('slug', 'home');
  console.log('cms_pages anon UPDATE (Expect DENIED):', {
    status: cmsUpdStat,
    blocked: cmsUpdStat === 401 || cmsUpdStat === 403 || cmsUpdErr?.code === '42501',
    error: cmsUpdErr?.message
  });
}

verifyAllFixes().catch(console.error);
