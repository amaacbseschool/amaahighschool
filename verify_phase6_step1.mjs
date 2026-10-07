import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';

const SUPABASE_URL = 'https://twozlscntgxiydbdcjkt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hztiNPS-PmeFQdETCR_djg_PSKuXste';

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CMS_TABLES = [
  'site_settings',
  'navigation_items',
  'cms_pages',
  'cms_sections',
  'cms_section_items',
  'faculty_members',
  'academic_toppers',
  'school_articles',
  'school_events',
  'school_circulars',
  'gallery_images',
];

async function verifyTableExistence() {
  console.log('\n--- 1. TABLE EXISTENCE & HTTP STATUS CHECK ---');
  let missing = [];
  for (const table of CMS_TABLES) {
    const { status, error, data } = await anonClient.from(table).select('*').limit(1);
    const errCode = error?.code || 'None';
    const errMsg = error?.message || 'None';
    if (status === 404) {
      console.log(`❌ [${table}]: HTTP ${status} | Error Code: ${errCode} | Message: ${errMsg}`);
      missing.push(table);
    } else {
      console.log(`✅ [${table}]: HTTP ${status} | Error Code: ${errCode} | Message: ${errMsg} | Rows: ${data?.length ?? 0}`);
    }
  }
  return missing;
}

async function verifyAnonymousMutationDenied() {
  console.log('\n--- 2. ANONYMOUS MUTATION (INSERT/UPDATE/DELETE) RESTRICTION CHECK ---');
  
  // Test INSERT on site_settings
  const { error: insertError, status: insertStatus } = await anonClient
    .from('site_settings')
    .insert([{ key: 'illegal_anon_key', value: { test: true } }]);
  console.log(`Anon INSERT on site_settings: Status ${insertStatus}, Error: ${insertError ? insertError.message : 'NONE'}`);

  // Test INSERT on faculty_members
  const { error: facError, status: facStatus } = await anonClient
    .from('faculty_members')
    .insert([{ name: 'Unauthorized Anon Faculty' }]);
  console.log(`Anon INSERT on faculty_members: Status ${facStatus}, Error: ${facError ? facError.message : 'NONE'}`);

  // Test INSERT on cms_pages
  const { error: pageError, status: pageStatus } = await anonClient
    .from('cms_pages')
    .insert([{ slug: 'unauthorized-slug', title: 'Unauthorized' }]);
  console.log(`Anon INSERT on cms_pages: Status ${pageStatus}, Error: ${pageError ? pageError.message : 'NONE'}`);

  // Test UPDATE
  const { error: updateError, status: updateStatus } = await anonClient
    .from('site_settings')
    .update({ description: 'Hacked' })
    .neq('id', '00000000-0000-0000-0000-000000000000');
  console.log(`Anon UPDATE on site_settings: Status ${updateStatus}, Error: ${updateError ? updateError.message : 'NONE'}`);

  // Test DELETE
  const { error: deleteError, status: deleteStatus } = await anonClient
    .from('site_settings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  console.log(`Anon DELETE on site_settings: Status ${deleteStatus}, Error: ${deleteError ? deleteError.message : 'NONE'}`);
}

async function main() {
  const missing = await verifyTableExistence();
  if (missing.length === 0) {
    await verifyAnonymousMutationDenied();
  } else {
    console.log(`\n⚠️  ${missing.length} tables are currently pending execution in Supabase SQL editor.`);
  }
}

main().catch(console.error);
