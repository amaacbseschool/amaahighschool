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

async function verifyCounts() {
  console.log('====================================================');
  console.log('CMS DATABASE SEED ROW COUNT VERIFICATION');
  console.log('====================================================');
  
  let totalRows = 0;
  for (const table of CMS_TABLES) {
    const { count, data, error, status } = await anonClient
      .from(table)
      .select('*', { count: 'exact' });
    
    if (error) {
      console.log(`❌ [${table}]: Status ${status} | Error: ${error.message}`);
    } else {
      console.log(`📊 [${table}]: Status ${status} | Row Count: ${count ?? data?.length ?? 0}`);
      totalRows += (count ?? data?.length ?? 0);
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Total CMS Rows Seeded: ${totalRows}`);
  console.log('====================================================');
}

verifyCounts().catch(console.error);
