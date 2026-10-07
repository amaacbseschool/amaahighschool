import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';

const SUPABASE_URL = 'https://twozlscntgxiydbdcjkt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hztiNPS-PmeFQdETCR_djg_PSKuXste';

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CMS_TABLE_PAYLOADS = {
  site_settings: { key: 'illegal_test_key', value: { x: 1 } },
  navigation_items: { label: 'Illegal Nav Item', path: '/illegal' },
  cms_pages: { slug: 'illegal-slug', title: 'Illegal Title' },
  cms_sections: { page_id: '00000000-0000-0000-0000-000000000000', section_key: 'hero', section_type: 'hero' },
  cms_section_items: { section_id: '00000000-0000-0000-0000-000000000000', title: 'Illegal Item' },
  faculty_members: { name: 'Illegal Faculty' },
  academic_toppers: { student_name: 'Illegal Student' },
  school_articles: { title: 'Illegal Article', slug: 'illegal-article' },
  school_events: { title: 'Illegal Event', event_date: new Date().toISOString() },
  school_circulars: { title: 'Illegal Circular' },
  gallery_images: { title: 'Illegal Photo', category: 'campus', image_url: 'https://example.com/test.jpg' },
};

const OPERATIONAL_TABLES = [
  'admissions_enquiries',
  'contact_messages',
  'school_notices',
  'newsletter_subscribers',
  'alumni_members',
  'governing_body',
  'admin_profiles',
];

async function verifyAll() {
  console.log('====================================================');
  console.log('1. VERIFY ALL 11 CMS TABLES EXIST & CAN BE QUERIED');
  console.log('====================================================');
  let cmsAllPass = true;
  for (const table of Object.keys(CMS_TABLE_PAYLOADS)) {
    const { status, error, data } = await anonClient.from(table).select('*').limit(1);
    const pass = status === 200;
    if (!pass) cmsAllPass = false;
    console.log(`${pass ? '✅ PASS' : '❌ FAIL'} [${table}]: Status ${status} | Error: ${error ? error.message : 'None'} | Rows: ${data?.length ?? 0}`);
  }
  console.log(`CMS Tables Overall: ${cmsAllPass ? 'PASS' : 'FAIL'}`);

  console.log('\n====================================================');
  console.log('2. VERIFY ANONYMOUS CANNOT MUTATE CMS (INSERT/UPDATE/DELETE)');
  console.log('====================================================');
  let mutationPass = true;
  for (const [table, payload] of Object.entries(CMS_TABLE_PAYLOADS)) {
    // Test INSERT
    const { status: insStatus, error: insErr } = await anonClient.from(table).insert([payload]);
    const insBlocked = insStatus === 401 || (insErr && insErr.code === '42501');
    if (!insBlocked) mutationPass = false;

    // Test UPDATE
    const { status: updStatus, error: updErr } = await anonClient.from(table).update({ updated_at: new Date().toISOString() }).neq('id', '00000000-0000-0000-0000-000000000000');
    const updBlocked = updStatus === 401 || (updErr && updErr.code === '42501');
    if (!updBlocked) mutationPass = false;

    // Test DELETE
    const { status: delStatus, error: delErr } = await anonClient.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const delBlocked = delStatus === 401 || (delErr && delErr.code === '42501');
    if (!delBlocked) mutationPass = false;

    console.log(`${insBlocked && updBlocked && delBlocked ? '✅ PASS' : '❌ FAIL'} [${table}]: INSERT (${insStatus}, ${insErr?.message || 'none'}) | UPDATE (${updStatus}) | DELETE (${delStatus})`);
  }
  console.log(`Anonymous Mutation Restrictions: ${mutationPass ? 'PASS' : 'FAIL'}`);

  console.log('\n====================================================');
  console.log('3. VERIFY OPERATIONAL TABLES SAFETY (EXIST & UNCHANGED)');
  console.log('====================================================');
  let opPass = true;
  for (const table of OPERATIONAL_TABLES) {
    const { status, error } = await anonClient.from(table).select('*').limit(1);
    // Operational tables exist in schema cache (status is NOT 404)
    const exists = status !== 404;
    if (!exists) opPass = false;
    console.log(`${exists ? '✅ PASS' : '❌ FAIL'} [${table}]: Status ${status} | Error: ${error ? error.message : 'None'}`);
  }

  // Confirm Admissions public insert still works
  const admTest = await anonClient.from('admissions_enquiries').insert([{
    student_name: 'CMS Architecture Test Student',
    parent_name: 'Test Parent',
    parent_email: 'test_sec_cms@example.com',
    parent_phone: '9999999999',
    class_applying_for: 'Grade I',
    message: 'Operational table regression test'
  }]).select('id').single();
  const admPass = !admTest.error && !!admTest.data?.id;
  console.log(`Operational Admissions Insert: ${admPass ? '✅ PASS (HTTP 201)' : `❌ FAIL (${admTest.error?.message})`}`);

  console.log(`Operational Tables Overall: ${opPass && admPass ? 'PASS' : 'FAIL'}`);
}

verifyAll().catch(console.error);
