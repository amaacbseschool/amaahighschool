// ====================================================================
// LIVE DATABASE DIAGNOSTIC — read-only behavioral probe
// No writes to permanent data. All test rows are created and
// immediately deleted within the same run.
// ====================================================================
const URL = 'https://twozlscntgxiydbdcjkt.supabase.co';
const KEY = 'sb_publishable_hztiNPS-PmeFQdETCR_djg_PSKuXste';

async function req(method, path, body, extra = {}) {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...extra,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

function errSummary(r) {
  if (r.status >= 200 && r.status < 300) {
    const row = Array.isArray(r.data) ? r.data[0] : null;
    return `HTTP ${r.status} OK${row ? ` | verified=${row.verified} status=${row.status}` : ''}`;
  }
  return `HTTP ${r.status} | code=${r.data?.code} hint="${(r.data?.hint||'').slice(0,60)}" msg="${(r.data?.message||'').slice(0,80)}"`;
}

// Interpret the error to determine root cause
function interpret(r, expectedSuccess) {
  if (expectedSuccess) {
    if (r.status === 200 || r.status === 201) return '✅ ALLOWED (correct)';
    if (r.data?.code === '42501' && r.data?.hint?.includes('GRANT')) return '❌ BLOCKED — table-level GRANT missing';
    if (r.data?.code === '42501') return '❌ BLOCKED — RLS WITH CHECK failed';
    return `❌ BLOCKED — unexpected: ${r.status}`;
  } else {
    if (r.data?.code === '42501' && r.data?.hint?.includes('GRANT')) return '✅ DENIED — table-level GRANT missing (side-effect deny)';
    if (r.data?.code === '42501') return '✅ DENIED — RLS WITH CHECK rejected';
    if (r.status === 401 || r.status === 403) return '✅ DENIED';
    return `❌ ALLOWED (security gap!) — HTTP ${r.status}`;
  }
}

const ts = Date.now();

async function run() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  LIVE DATABASE BEHAVIORAL DIAGNOSTIC');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ─── alumni_members ──────────────────────────────────────────────
  console.log('─── TABLE: public.alumni_members ───────────────────────────────\n');

  const a1 = await req('POST', 'alumni_members', {
    full_name: `DIAG_NoVerified_${ts}`,
    email: `diag-no-verified-${ts}@diag.test`,
    graduation_year: 2020,
  });
  console.log(`INSERT (no verified field):`);
  console.log(`  Raw: ${errSummary(a1)}`);
  console.log(`  Interpretation: ${interpret(a1, true)}`);
  const id_a1 = Array.isArray(a1.data) ? a1.data[0]?.id : null;

  const a2 = await req('POST', 'alumni_members', {
    full_name: `DIAG_VerFalse_${ts}`,
    email: `diag-ver-false-${ts}@diag.test`,
    graduation_year: 2020,
    verified: false,
  });
  console.log(`\nINSERT (verified=false explicitly):`);
  console.log(`  Raw: ${errSummary(a2)}`);
  console.log(`  Interpretation: ${interpret(a2, true)}`);
  const id_a2 = Array.isArray(a2.data) ? a2.data[0]?.id : null;

  const a3 = await req('POST', 'alumni_members', {
    full_name: `DIAG_VerTrue_${ts}`,
    email: `diag-ver-true-${ts}@diag.test`,
    graduation_year: 2020,
    verified: true,
  });
  console.log(`\nINSERT (verified=true — should be DENIED):`);
  console.log(`  Raw: ${errSummary(a3)}`);
  console.log(`  Interpretation: ${interpret(a3, false)}`);
  const id_a3 = Array.isArray(a3.data) ? a3.data[0]?.id : null;

  // Cleanup test alumni inserts
  for (const id of [id_a1, id_a2, id_a3].filter(Boolean)) {
    const d = await req('DELETE', `alumni_members?id=eq.${id}`, undefined, { Prefer: 'return=minimal' });
    console.log(`  [cleanup] Deleted alumni id=${id} → HTTP ${d.status}`);
  }

  // ─── DIAGNOSIS: What does the alumni INSERT error tell us? ────────
  console.log('\n  DIAGNOSIS:');
  if (a1.data?.code === '42501' && (a1.data?.hint || '').includes('GRANT')) {
    console.log('  → alumni: NO table-level GRANT INSERT for anon (both denials are grant-level)');
  } else if (a1.data?.code === '42501' && !(a1.data?.hint || '').includes('GRANT')) {
    console.log('  → alumni: GRANT INSERT exists, but RLS WITH CHECK is rejecting the row');
    if (a2.data?.code === '42501') {
      console.log('  → verified=false is also rejected by RLS — policy condition may be incorrect');
      console.log('    Possible cause: WITH CHECK (verified = false) but DEFAULT not applied,');
      console.log('    OR there is a conflicting RESTRICTIVE policy overriding the permissive one');
    }
    if (a3.status === 201) {
      console.log('  → verified=true INSERT succeeds → the blocking policy is NOT the "Public can register" one,');
      console.log('    OR there is a second policy WITH CHECK (true) that still exists and overrides');
    }
  }

  // ─── contact_messages ────────────────────────────────────────────
  console.log('\n─── TABLE: public.contact_messages ──────────────────────────────\n');

  const c1 = await req('POST', 'contact_messages', {
    name: `DIAG_${ts}`,
    email: `diag-contact-${ts}@diag.test`,
    subject: 'Diagnostic probe',
    message: 'Diagnostic test.',
  });
  console.log(`INSERT (no status):`);
  console.log(`  Raw: ${errSummary(c1)}`);
  console.log(`  Interpretation: ${interpret(c1, true)}`);
  const id_c1 = Array.isArray(c1.data) ? c1.data[0]?.id : null;

  const c2 = await req('POST', 'contact_messages', {
    name: `DIAG_Unread_${ts}`,
    email: `diag-unread-${ts}@diag.test`,
    subject: 'Diagnostic probe',
    message: 'Diagnostic test.',
    status: 'Unread',
  });
  console.log(`\nINSERT (status='Unread'):`);
  console.log(`  Raw: ${errSummary(c2)}`);
  console.log(`  Interpretation: ${interpret(c2, true)}`);
  const id_c2 = Array.isArray(c2.data) ? c2.data[0]?.id : null;

  const c3 = await req('POST', 'contact_messages', {
    name: `DIAG_Resolved_${ts}`,
    email: `diag-resolved-${ts}@diag.test`,
    subject: 'Diagnostic probe',
    message: 'Diagnostic test.',
    status: 'Resolved',
  });
  console.log(`\nINSERT (status='Resolved' — should be DENIED):`);
  console.log(`  Raw: ${errSummary(c3)}`);
  console.log(`  Interpretation: ${interpret(c3, false)}`);
  const id_c3 = Array.isArray(c3.data) ? c3.data[0]?.id : null;

  for (const id of [id_c1, id_c2, id_c3].filter(Boolean)) {
    const d = await req('DELETE', `contact_messages?id=eq.${id}`, undefined, { Prefer: 'return=minimal' });
    console.log(`  [cleanup] Deleted contact id=${id} → HTTP ${d.status}`);
  }

  console.log('\n  DIAGNOSIS:');
  if (c1.data?.hint?.includes('GRANT')) {
    console.log('  → contact_messages: NO table-level GRANT INSERT for anon');
    console.log('    The "Public can submit contact messages" RLS policy may exist,');
    console.log('    but RLS is never evaluated because the GRANT itself is absent.');
  }

  // ─── admissions_enquiries ─────────────────────────────────────────
  console.log('\n─── TABLE: public.admissions_enquiries ───────────────────────────\n');

  const d1 = await req('POST', 'admissions_enquiries', {
    student_name: `DIAG_${ts}`,
    parent_name: `DIAG_Parent_${ts}`,
    parent_email: `diag-admit-${ts}@diag.test`,
    parent_phone: '9000000000',
    class_applying_for: 'Grade 6',
    status: 'Pending Review',
  });
  console.log(`INSERT (status='Pending Review'):`);
  console.log(`  Raw: ${errSummary(d1)}`);
  console.log(`  Interpretation: ${interpret(d1, true)}`);
  const id_d1 = Array.isArray(d1.data) ? d1.data[0]?.id : null;

  const d2 = await req('POST', 'admissions_enquiries', {
    student_name: `DIAG_Spoof_${ts}`,
    parent_name: `DIAG_Parent_${ts}`,
    parent_email: `diag-spoof-${ts}@diag.test`,
    parent_phone: '9000000000',
    class_applying_for: 'Grade 6',
    status: 'Admission Approved',
  });
  console.log(`\nINSERT (status='Admission Approved' — should be DENIED):`);
  console.log(`  Raw: ${errSummary(d2)}`);
  console.log(`  Interpretation: ${interpret(d2, false)}`);
  const id_d2 = Array.isArray(d2.data) ? d2.data[0]?.id : null;

  for (const id of [id_d1, id_d2].filter(Boolean)) {
    const rd = await req('DELETE', `admissions_enquiries?id=eq.${id}`, undefined, { Prefer: 'return=minimal' });
    console.log(`  [cleanup] Deleted admission id=${id} → HTTP ${rd.status}`);
  }

  console.log('\n  DIAGNOSIS:');
  if (d1.data?.hint?.includes('GRANT')) {
    console.log('  → admissions_enquiries: NO table-level GRANT INSERT for anon');
  }

  // ─── SUMMARY ──────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  DIAGNOSTIC SUMMARY — LIVE DATABASE STATE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // alumni
  const alumniGrantMissing = a1.data?.hint?.includes('GRANT');
  const alumniRlsBlocking = !alumniGrantMissing && a1.data?.code === '42501';
  const alumniTrueOpen = a3.status === 201;

  console.log('alumni_members:');
  console.log(`  GRANT INSERT to anon: ${alumniGrantMissing ? '❌ MISSING' : '✅ PRESENT'}`);
  console.log(`  RLS blocking verified=false: ${alumniRlsBlocking ? '❌ YES (policy bug)' : '✅ NO'}`);
  console.log(`  verified=true injection open: ${alumniTrueOpen ? '❌ YES (CRITICAL)' : '✅ NO'}`);

  // contact
  const contactGrantMissing = c1.data?.hint?.includes('GRANT');
  const resolvedDenied = c3.status !== 200 && c3.status !== 201;
  console.log('\ncontact_messages:');
  console.log(`  GRANT INSERT to anon: ${contactGrantMissing ? '❌ MISSING' : '✅ PRESENT'}`);
  console.log(`  status=Resolved blocked: ${resolvedDenied ? '✅ YES' : '❌ NO (spoofing open)'}`);

  // admissions
  const admitGrantMissing = d1.data?.hint?.includes('GRANT');
  const approvedDenied = d2.status !== 200 && d2.status !== 201;
  console.log('\nadmissions_enquiries:');
  console.log(`  GRANT INSERT to anon: ${admitGrantMissing ? '❌ MISSING' : '✅ PRESENT'}`);
  console.log(`  status=Admission Approved blocked: ${approvedDenied ? '✅ YES' : '❌ NO (spoofing open)'}`);

  console.log('\n═══════════════════════════════════════════════════════════════');
}

run().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
