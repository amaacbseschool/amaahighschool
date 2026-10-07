const SUPABASE_URL = 'https://twozlscntgxiydbdcjkt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hztiNPS-PmeFQdETCR_djg_PSKuXste';

async function req(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return {
    status: res.status,
    headers: res.headers,
    data,
  };
}

async function runAudit() {
  console.log('=== LIVE DATABASE SECURITY & CMS AUDIT ===\n');

  // 1. CMS Tables Count & Visibility
  console.log('--- 1. CMS TABLES ROW COUNTS ---');
  const cmsTables = [
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
  let totalCmsRows = 0;
  for (const table of cmsTables) {
    const res = await req(`${table}?select=*`, {
      headers: { Prefer: 'count=exact' },
    });
    const range = res.headers.get('content-range');
    const count = range ? parseInt(range.split('/')[1], 10) : res.data?.length || 0;
    totalCmsRows += count;
    console.log(`[${table}]: Status ${res.status} | Count: ${count}`);
  }
  console.log(`Total CMS Seed Rows across 11 tables: ${totalCmsRows} (Target: 277)\n`);

  // 2. Operational Tables Visibility (school_notices, governing_body, alumni_members)
  console.log('--- 2. OPERATIONAL TABLES ANON VISIBILITY ---');
  const noticesRes = await req('school_notices?select=id,title,published');
  console.log('school_notices anon SELECT:', {
    status: noticesRes.status,
    count: Array.isArray(noticesRes.data) ? noticesRes.data.length : null,
    error: noticesRes.status !== 200 ? noticesRes.data : null,
  });

  const governingRes = await req('governing_body?select=id,full_name,is_active');
  console.log('governing_body anon SELECT:', {
    status: governingRes.status,
    count: Array.isArray(governingRes.data) ? governingRes.data.length : null,
    error: governingRes.status !== 200 ? governingRes.data : null,
  });

  const alumniRes = await req('alumni_members?select=id,full_name,verified');
  console.log('alumni_members anon SELECT:', {
    status: alumniRes.status,
    count: Array.isArray(alumniRes.data) ? alumniRes.data.length : null,
    error: alumniRes.status !== 200 ? alumniRes.data : null,
  });

  const adminProfilesRes = await req('admin_profiles?select=*');
  console.log('admin_profiles anon SELECT (Expect 401/403 or empty):', {
    status: adminProfilesRes.status,
    count: Array.isArray(adminProfilesRes.data) ? adminProfilesRes.data.length : null,
    error: adminProfilesRes.status !== 200 ? adminProfilesRes.data : null,
  });

  // 3. Status Spoofing Tests
  console.log('\n--- 3. STATUS SPOOFING PROBES ---');
  const probeContactSpoof = await req('contact_messages', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Status Spoof Probe',
      email: 'status-spoof@example.com',
      subject: 'Security Spoof Probe',
      message: 'Testing status spoofing prevention',
      status: 'Resolved', // Privileged status
    }),
  });
  console.log('contact_messages status="Resolved" insert:', {
    status: probeContactSpoof.status,
    data: probeContactSpoof.data,
  });

  const probeAdmissionsSpoof = await req('admissions_enquiries', {
    method: 'POST',
    body: JSON.stringify({
      student_name: 'Status Spoof Student',
      parent_name: 'Parent Spoof',
      parent_email: 'spoof-admission@example.com',
      parent_phone: '9999999999',
      grade_applying_for: 'Grade 1',
      status: 'Admission Approved', // Privileged status
    }),
  });
  console.log('admissions_enquiries status="Admission Approved" insert:', {
    status: probeAdmissionsSpoof.status,
    data: probeAdmissionsSpoof.data,
  });

  // 4. Alumni Verified Injection Probe
  console.log('\n--- 4. ALUMNI VERIFIED INJECTION PROBE ---');
  const probeAlumniTrue = await req('alumni_members', {
    method: 'POST',
    body: JSON.stringify({
      full_name: 'Alumni Spoof True',
      email: 'alumni-true-spoof@example.com',
      graduation_year: 2020,
      verified: true, // Privileged status
    }),
  });
  console.log('alumni_members verified=true insert:', {
    status: probeAlumniTrue.status,
    data: probeAlumniTrue.data,
  });

  // 5. Query All Operational Records to Identify Test Records
  console.log('\n--- 5. OPERATIONAL RECORDS AUDIT ---');
  // Admissions
  const admRes = await req('admissions_enquiries?select=id,student_name,parent_name,parent_email,created_at,status');
  console.log('admissions_enquiries records (status ' + admRes.status + '):', admRes.data);

  // Contact
  const cntRes = await req('contact_messages?select=id,name,email,subject,status,created_at');
  console.log('contact_messages records (status ' + cntRes.status + '):', cntRes.data);

  // Subscribers
  const subRes = await req('newsletter_subscribers?select=id,email,is_active,created_at');
  console.log('newsletter_subscribers records (status ' + subRes.status + '):', subRes.data);

  // Alumni
  const almRes = await req('alumni_members?select=id,full_name,email,verified,graduation_year');
  console.log('alumni_members records (status ' + almRes.status + '):', almRes.data);
}

runAudit().catch(console.error);
