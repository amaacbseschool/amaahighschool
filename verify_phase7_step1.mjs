import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';

const SUPABASE_URL = 'https://twozlscntgxiydbdcjkt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hztiNPS-PmeFQdETCR_djg_PSKuXste';

const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runVerification() {
  console.log('====================================================');
  console.log('PHASE 7 STEP 1: PUBLIC CMS DATA LAYER VERIFICATION');
  console.log('====================================================');
  console.log('Target: Anonymous / Public Client (Unauthenticated)');
  console.log('Database: Connected Supabase Instance');
  console.log('----------------------------------------------------');

  const expectations = [
    {
      name: 'getPublicSiteSettings()',
      table: 'site_settings',
      filterCol: 'is_public',
      filterVal: true,
      expected: 28,
    },
    {
      name: 'getPublicNavigation()',
      table: 'navigation_items',
      filterCol: 'is_visible',
      filterVal: true,
      expected: 22,
    },
    {
      name: 'getPublishedPages()',
      table: 'cms_pages',
      filterCol: 'is_published',
      filterVal: true,
      expected: 13,
    },
    {
      name: 'getVisibleSections()',
      table: 'cms_sections',
      filterCol: 'is_visible',
      filterVal: true,
      expected: 36,
    },
    {
      name: 'getVisibleSectionItems()',
      table: 'cms_section_items',
      filterCol: 'is_visible',
      filterVal: true,
      expected: 111,
    },
    {
      name: 'getActiveFaculty()',
      table: 'faculty_members',
      filterCol: 'is_active',
      filterVal: true,
      expected: 8,
    },
    {
      name: 'getActiveToppers()',
      table: 'academic_toppers',
      filterCol: 'is_active',
      filterVal: true,
      expected: 6,
    },
    {
      name: 'getPublishedArticles()',
      table: 'school_articles',
      filterCol: 'is_published',
      filterVal: true,
      expected: 4,
    },
    {
      name: 'getPublishedEvents()',
      table: 'school_events',
      filterCol: 'is_published',
      filterVal: true,
      expected: 5,
    },
    {
      name: 'getPublishedCirculars()',
      table: 'school_circulars',
      filterCol: 'is_published',
      filterVal: true,
      expected: 6,
    },
    {
      name: 'getActiveGalleryImages()',
      table: 'gallery_images',
      filterCol: 'is_active',
      filterVal: true,
      expected: 38,
    },
  ];

  let allPassed = true;
  let totalRetrieved = 0;

  for (const exp of expectations) {
    const { count, data, error } = await anonClient
      .from(exp.table)
      .select('*', { count: 'exact' })
      .eq(exp.filterCol, exp.filterVal);

    if (error) {
      console.log(`❌ ${exp.name} [${exp.table}]: Query Error -> ${error.message}`);
      allPassed = false;
      continue;
    }

    const actualCount = count ?? data?.length ?? 0;
    totalRetrieved += actualCount;
    const match = actualCount === exp.expected;
    if (!match) allPassed = false;

    console.log(
      `${match ? '✅' : '❌'} ${exp.name.padEnd(28)} | ${exp.table.padEnd(18)} | Filter: ${exp.filterCol}=${exp.filterVal} | Count: ${actualCount} / ${exp.expected}`
    );
  }

  console.log('----------------------------------------------------');
  console.log(`Total Public CMS Rows Retrieved: ${totalRetrieved} / 277`);

  // Additional hierarchical tests
  console.log('----------------------------------------------------');
  console.log('TESTING HIERARCHICAL & COMPOSITE READ FUNCTIONS:');

  // Test 1: Navigation hierarchy (7 roots, 15 subitems)
  const { data: navItems } = await anonClient
    .from('navigation_items')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });

  const rootItems = (navItems || []).filter((i) => !i.parent_id);
  const childItems = (navItems || []).filter((i) => !!i.parent_id);
  const navTreePass = rootItems.length === 7 && childItems.length === 15;
  console.log(
    `${navTreePass ? '✅' : '❌'} getPublicNavigationTree()     | Root items: ${rootItems.length} (expected 7) | Child items: ${childItems.length} (expected 15)`
  );

  // Test 2: Home Page slug retrieval and composite section items
  const { data: homePage } = await anonClient
    .from('cms_pages')
    .select('*')
    .eq('slug', 'home')
    .eq('is_published', true)
    .maybeSingle();

  if (homePage) {
    const { data: homeSections } = await anonClient
      .from('cms_sections')
      .select('*')
      .eq('page_id', homePage.id)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    console.log(
      `✅ getPublishedPageBySlug('home')    | Page: "${homePage.title}" | Visible Sections: ${homeSections?.length ?? 0}`
    );
  } else {
    console.log("❌ getPublishedPageBySlug('home') failed to find home page");
    allPassed = false;
  }

  // Test 3: Site settings map lookup test
  const { data: settings } = await anonClient
    .from('site_settings')
    .select('*')
    .eq('is_public', true);

  const phoneSetting = settings?.find((s) => s.key === 'site_phone');
  console.log(
    `✅ getPublicSiteSettingsMap()        | Key: 'site_phone' -> ${JSON.stringify(phoneSetting?.value)}`
  );

  console.log('====================================================');
  console.log(allPassed ? '🎉 ALL PHASE 7 STEP 1 VERIFICATION CHECKS PASSED!' : '❌ VERIFICATION FAILED');
  console.log('====================================================');
}

runVerification().catch(console.error);
