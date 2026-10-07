import fs from 'fs';

// Read schoolGalleryData.ts to extract 38 photos accurately
const galleryTs = fs.readFileSync('src/data/schoolGalleryData.ts', 'utf8');

const arrayPart = galleryTs.split('SCHOOL_PHOTOS: SchoolPhoto[] = [')[1];
const items = arrayPart.split(/},\s*(?:\/\/[^\n]*)?\s*{/);

const photos = items.map((item, idx) => {
  const get = (k) => {
    const m = item.match(new RegExp(k + ":\\s*'([^']*)'"));
    return m ? m[1] : '';
  };
  return {
    id: get('id'),
    filename: get('filename'),
    image: get('image'),
    title: get('title'),
    category: get('category'),
    badge: get('badge'),
    caption: get('caption'),
    featured: item.includes('featured: true')
  };
});

console.log('Parsed photos count:', photos.length);

let sql = `-- ====================================================================
-- AMAA HIGH SCHOOL — PHASE 6: WEBSITE CMS CONTENT SEED
-- STEP 2: EXACT EXISTING WEBSITE CONTENT SEEDING (IDEMPOTENT)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. GLOBAL SITE SETTINGS (site_settings)
-- --------------------------------------------------------------------
INSERT INTO public.site_settings (key, value, description, is_public)
VALUES
  ('site_name', '"A.M.A. Adinarayana English Medium High School"'::jsonb, 'Official full name of the school', true),
  ('site_short_name', '"A.M.A. Adinarayana"'::jsonb, 'Short brand title', true),
  ('site_brand_subtitle', '"English Medium High School"'::jsonb, 'Header brand subtitle', true),
  ('site_motto', '"Lead Kindly Light"'::jsonb, 'Sacred school motto', true),
  ('site_established_year', '1965'::jsonb, 'Year of foundation', true),
  ('site_diamond_jubilee_text', '"Diamond Jubilee • 60 Years of Excellence"'::jsonb, 'Jubilee celebration headline', true),
  ('site_logo', '"/assets/logo.png"'::jsonb, 'Official crest image path', true),
  ('site_phone', '"+91 75440 10044"'::jsonb, 'Primary school telephone', true),
  ('site_phone_secondary', '"+91 75440 10045"'::jsonb, 'Secondary admissions phone', true),
  ('site_email', '"info@amaaschool.edu"'::jsonb, 'Official school inquiry email', true),
  ('site_email_admissions', '"admissions@amaaschool.edu"'::jsonb, 'Admissions cell email', true),
  ('site_address', '"Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar"'::jsonb, 'Official campus physical address', true),
  ('site_hours', '"Mon – Sat: 8:00 AM – 4:00 PM"'::jsonb, 'School front office hours', true),
  ('site_board_recognition', '"State Board Recognized High School (Grades VI to Class X)"'::jsonb, 'Regulatory board affiliation statement', true),
  ('site_facebook', '"https://facebook.com"'::jsonb, 'Official Facebook page link', true),
  ('site_instagram', '"https://instagram.com"'::jsonb, 'Official Instagram handle link', true),
  ('site_youtube', '"https://youtube.com"'::jsonb, 'Official YouTube channel link', true),
  ('site_linkedin', '"https://linkedin.com"'::jsonb, 'Official LinkedIn profile link', true),
  ('navbar_cta_text', '"APPLY FOR 2025–26"'::jsonb, 'Header main action button text', true),
  ('footer_description', '"Illuminating young minds since 1965 with foundational moral values, academic rigor, scientific curiosity, and holistic development."'::jsonb, 'Footer mission summary blurb', true),
  ('footer_newsletter_title', '"NEWSLETTER"'::jsonb, 'Footer newsletter section title', true),
  ('footer_newsletter_description', '"Subscribe to our newsletter for latest notifications, examination circulars, and sports event updates."'::jsonb, 'Footer newsletter description', true),
  ('footer_copyright', '"© 2026 AMAA High School. All Rights Reserved."'::jsonb, 'Footer legal copyright statement', true),
  ('footer_developer_name', '"AR TECH studio"'::jsonb, 'Developer credit company name', true),
  ('footer_developer_url', '"https://www.artechstudio.co.in"'::jsonb, 'Developer official website URL', true),
  ('footer_developer_logo', '"/assets/artech_logo.png"'::jsonb, 'Developer logo asset path', true),
  ('topbar_campus_desk_label', '"Campus Desk"'::jsonb, 'Top bar quick contact link label', true),
  ('topbar_admin_portal_label', '"Admin Portal"'::jsonb, 'Top bar admin portal badge label', true)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description,
    is_public = EXCLUDED.is_public,
    updated_at = TIMEZONE('utc', NOW());


-- --------------------------------------------------------------------
-- 2. NAVIGATION ITEMS (navigation_items)
-- --------------------------------------------------------------------
DELETE FROM public.navigation_items;

DO $$
DECLARE
  v_about_id UUID;
  v_academics_id UUID;
  v_campus_id UUID;
BEGIN
  -- 1. Home
  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible)
  VALUES ('Home', '/', NULL, 1, true);

  -- 2. About
  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible)
  VALUES ('About', '/about', NULL, 2, true)
  RETURNING id INTO v_about_id;

  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible) VALUES
    ('Our Story', '/about#our-story', v_about_id, 1, true),
    ('Vision & Mission', '/about#vision-mission', v_about_id, 2, true),
    ('Administration', '/administration', v_about_id, 3, true),
    ('Leadership', '/about#leadership', v_about_id, 4, true),
    ('Values', '/about#values', v_about_id, 5, true),
    ('History', '/about#history', v_about_id, 6, true);

  -- 3. Academics
  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible)
  VALUES ('Academics', '/academics', NULL, 3, true)
  RETURNING id INTO v_academics_id;

  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible) VALUES
    ('Curriculum', '/academics#curriculum', v_academics_id, 1, true),
    ('Academic Stages', '/academics#stages', v_academics_id, 2, true),
    ('Teaching & Learning', '/academics#pedagogy', v_academics_id, 3, true),
    ('Faculty & Mentors', '/academics#faculty', v_academics_id, 4, true);

  -- 4. Campus
  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible)
  VALUES ('Campus', '/campus', NULL, 4, true)
  RETURNING id INTO v_campus_id;

  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible) VALUES
    ('Classrooms', '/campus#classrooms', v_campus_id, 1, true),
    ('Laboratories', '/campus#laboratories', v_campus_id, 2, true),
    ('Library', '/campus#library', v_campus_id, 3, true),
    ('Sports', '/campus#sports', v_campus_id, 4, true),
    ('Transport', '/campus#transport', v_campus_id, 5, true);

  -- 5. Gallery
  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible)
  VALUES ('Gallery', '/gallery', NULL, 5, true);

  -- 6. Alumni
  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible)
  VALUES ('Alumni', '/alumni', NULL, 6, true);

  -- 7. Contact
  INSERT INTO public.navigation_items (label, path, parent_id, sort_order, is_visible)
  VALUES ('Contact', '/contact', NULL, 7, true);
END $$;


-- --------------------------------------------------------------------
-- 3. CMS PAGES (cms_pages)
-- --------------------------------------------------------------------
INSERT INTO public.cms_pages (slug, title, meta_title, meta_description, is_published)
VALUES
  ('home', 'A.M.A. Adinarayana English Medium High School', 'A.M.A. Adinarayana Eng. Med. High School | Estd. 1965', 'A premier English Medium High School established in 1965 under the motto "Lead Kindly Light", dedicated to academic rigor, character building, and holistic development from Grade VI to Class X.', true),
  ('about', 'About A.M.A. Adinarayana High School', 'About Us | A.M.A. Adinarayana High School', '60 Years of academic rigor, moral values, and secondary education excellence since 1965.', true),
  ('academics', 'Academics & Wings', 'Academics | A.M.A. Adinarayana High School', 'Comprehensive Middle School and Secondary Board curriculum with 100% board clearance record.', true),
  ('faculty', 'Faculty & Mentors Directory', 'Our Faculty | A.M.A. Adinarayana High School', 'Meet our distinguished educators across Sciences, Mathematics, Languages, Arts and Athletics.', true),
  ('campus', 'Campus Infrastructure & Facilities', 'Campus & Facilities | A.M.A. Adinarayana High School', 'Explore our 15-acre green sanctuary featuring 4K smart classrooms, certified science labs, and sports arena.', true),
  ('facilities', 'Campus Infrastructure & Facilities (Alias)', 'Campus Facilities | A.M.A. Adinarayana High School', 'Explore modern facilities, libraries, digital laboratories, and athletic infrastructure.', true),
  ('student-life', 'Student Life & Co-Curriculars', 'Student Life | A.M.A. Adinarayana High School', 'Nurturing whole personalities through performing arts, debate conclaves, sports teams, and NCC drills.', true),
  ('achievements', 'Achievements & Academic Distinctions', 'Achievements | A.M.A. Adinarayana High School', 'Celebrating state toppers, 100% Class X board pass results, and national Olympiad distinctions.', true),
  ('news-events', 'News, Events & Circulars', 'News & Events | A.M.A. Adinarayana High School', 'Latest notifications, academic calendars, event announcements, and downloadable school circulars.', true),
  ('gallery', 'Campus Photo Gallery', 'Photo Gallery | A.M.A. Adinarayana High School', 'A visual journey through authentic classroom discoveries, sports meets, and cultural festivals.', true),
  ('alumni', 'Alumni Network & Community', 'Alumni Network | A.M.A. Adinarayana High School', 'Connecting over 10,000 global graduates leading in medicine, technology, civil services, and defence.', true),
  ('administration', 'Administration & Governance', 'Administration | A.M.A. Adinarayana High School', 'Meet the governing body and trustees steering institutional excellence into our Diamond Jubilee.', true),
  ('contact', 'Contact Us & Campus Desk', 'Contact Us | A.M.A. Adinarayana High School', 'Get in touch with our admissions office, schedule a guided campus tour, or send general inquiries.', true)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    is_published = EXCLUDED.is_published,
    updated_at = TIMEZONE('utc', NOW());


-- --------------------------------------------------------------------
-- 4. FACULTY MEMBERS (faculty_members)
-- --------------------------------------------------------------------
DELETE FROM public.faculty_members;

INSERT INTO public.faculty_members (
  name, designation, department, qualification, experience, bio, avatar_url, email, office_hours, sort_order, is_active
) VALUES
(
  'Dr. K. S. Ramanathan',
  'Principal & Head of Institutional Rigor',
  'Leadership',
  'Ph.D. in Educational Pedagogy, M.Sc. (Physics), B.Ed.',
  '32 Years in Secondary & Higher Education',
  'Dr. Ramanathan has steered AMAA High School for over two decades with visionary leadership. A former CBSE & State Board committee advisor, he spearheaded the school’s 100% distinction record and modern science laboratory integration.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  'principal@amaahighschool.edu.in',
  'Monday & Thursday • 10:00 AM – 12:30 PM',
  1,
  true
),
(
  'Smt. Lakshmi Prasanna',
  'Vice Principal & Head of Science Suites',
  'Sciences',
  'M.Sc. in Organic Chemistry, B.Ed., State Gold Medalist',
  '24 Years of Master Pedagogy',
  'Renowned for making complex chemical kinetics intuitive through everyday experiments. Mentored more than 85 state Olympiad finalists and 200+ students who pursued medicine at AIIMS and premier universities.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  'l.prasanna@amaahighschool.edu.in',
  'Tuesday & Friday • 02:00 PM – 04:00 PM',
  2,
  true
),
(
  'Sri M. Venkat Rao',
  'Head of Mathematics & NTSE Cell',
  'Mathematics',
  'M.Sc. in Pure Mathematics, M.Phil., B.Ed.',
  '21 Years of Secondary Mathematics Mastery',
  'Sri Venkat Rao has trained 18 batches of board toppers with his signature visual geometry techniques. He directs the weekly Math Exploratorium where students build tactile models of quadratic equations and conic sections.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  'm.venkatrao@amaahighschool.edu.in',
  'Daily • 03:30 PM – 04:30 PM',
  3,
  true
),
(
  'Dr. Ananya Mukherjee',
  'Head of English & Debating Society',
  'Languages',
  'Ph.D. in Comparative Literature, Cambridge CELTA',
  '18 Years of Humanities Instruction',
  'A Cambridge CELTA certified scholar, Dr. Mukherjee leads AMAA’s celebrated Model UN delegation and Annual Shakespeare & Tagore Theatre Festival. Her students regularly publish anthologies and win national declamation trophies.',
  'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=800&auto=format&fit=crop',
  'a.mukherjee@amaahighschool.edu.in',
  'Wednesday • 11:30 AM – 01:30 PM',
  4,
  true
),
(
  'Sri Rajesh Varma',
  'Head of Computer & IT Laboratories',
  'Sciences',
  'M.Tech. in Computer Science, B.E. (Information Technology)',
  '12 Years of Computer Science Pedagogy',
  'Brings over a decade of computer science education experience. Manages our modern 24-workstation computer lab, campus network, and annual Inter-School Science & Coding Conclave.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
  'r.varma@amaahighschool.edu.in',
  'Tuesday & Thursday • 03:00 PM – 05:00 PM',
  5,
  true
),
(
  'Smt. Sunitha Kulkarni',
  'Senior Faculty in Social Sciences & Heritage',
  'Languages',
  'M.A. in History & Archeology, B.Ed.',
  '19 Years in Historical & Civic Education',
  'Known for interactive map-making workshops, historical role-playing sessions, and mock parliament conclaves. She organizes the annual heritage study expeditions across prominent architectural monuments.',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
  's.kulkarni@amaahighschool.edu.in',
  'Monday & Wednesday • 01:00 PM – 03:00 PM',
  6,
  true
),
(
  'Sri B. Satyanarayana',
  'Director of Physical Education & Martial Arts',
  'Arts & Sports',
  'M.P.Ed., NIS Certified Athletic Coach, 4th Dan Black Belt',
  '16 Years in Youth Athletic Conditioning',
  'Former university athlete and NIS coach. Oversees AMAA’s 15-acre sports ground, floodlit basketball courts, and martial arts dojo. Under his training, AMAA won 38 district athletic championships.',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
  'sports@amaahighschool.edu.in',
  'Daily • 06:30 AM – 08:00 AM & 04:00 PM – 05:30 PM',
  7,
  true
),
(
  'Smt. Padmavathi Devi',
  'Head of Cultural Traditions & Fine Arts',
  'Arts & Sports',
  'M.A. in Fine Arts, Sangeet Visharad (Classical Carnatic)',
  '15 Years in Aesthetic Mentorship',
  'An accomplished classical vocalist and painter. Directs the 60-piece student orchestra and annual cultural extravaganza "Kalarava". Her student paintings have been exhibited in state art galleries.',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
  'p.devi@amaahighschool.edu.in',
  'Friday & Saturday • 02:00 PM – 04:00 PM',
  8,
  true
);


-- --------------------------------------------------------------------
-- 5. ACADEMIC TOPPERS (academic_toppers)
-- --------------------------------------------------------------------
DELETE FROM public.academic_toppers;

INSERT INTO public.academic_toppers (
  student_name, academic_year, class_level, score, rank_badge, quote, photo_url, sort_order, is_active
) VALUES
(
  'Sneha K. Varma',
  'Class of 2025',
  'Class X Board',
  '98.6%',
  'State Rank 2 • Board Class X',
  'AMAA faculty treated every doubt with patience. Regular model exams gave me unwavering confidence.',
  '/toppers/sneha_varma.webp',
  1,
  true
),
(
  'Aditya R. Prasad',
  'Class of 2025',
  'Class X Board',
  '98.2%',
  'Math & Science Centum (100/100)',
  'The computer club and science practical labs taught me the practical side of complex formulas.',
  '/toppers/aditya_prasad.webp',
  2,
  true
),
(
  'Meghana Sen',
  'Class of 2025',
  'Class X Board',
  '97.8%',
  'All-Rounder Award Winner',
  'Balancing athletics track meets with daily study schedules was made possible by our supportive mentors.',
  '/toppers/meghana_sen.webp',
  3,
  true
),
(
  'Ravi Teja Nalluri',
  'Class of 2024',
  'Class X Board',
  '97.4%',
  'Science Distinction',
  'Our teachers never gave up on any student. Personal attention is what sets AMAA apart.',
  '/toppers/raviteja_nalluri.webp',
  4,
  true
),
(
  'Divya Srinivasan',
  'Class of 2024',
  'Class X Board',
  '96.9%',
  'Language & Arts Topper',
  'The literary club and drama wing built my confidence far beyond the classroom.',
  '/toppers/divya_srinivasan.webp',
  5,
  true
),
(
  'Harshith Reddy',
  'Class of 2023',
  'Class X Board',
  '96.6%',
  'Mathematics Centum',
  'Daily diagnostic tests and individual feedback helped me identify and close every gap.',
  '/toppers/harshith_reddy.webp',
  6,
  true
);


-- --------------------------------------------------------------------
-- 6. SCHOOL ARTICLES (school_articles)
-- --------------------------------------------------------------------
DELETE FROM public.school_articles;

INSERT INTO public.school_articles (
  title, slug, category, summary, body, thumbnail_url, published_at, is_published
) VALUES
(
  'AMAA High School Celebrates Diamond Jubilee — 60 Years of Excellence',
  'diamond-jubilee-celebration',
  'School News',
  'A.M.A. Adinarayana English Medium High School marks its 60th anniversary with a grand Diamond Jubilee celebration involving distinguished alumni, faculty, and state dignitaries.',
  'A.M.A. Adinarayana English Medium High School marked its 60th anniversary with a grand Diamond Jubilee celebration involving distinguished alumni, faculty, and state dignitaries. Established in 1965, the institution has nurtured over 10,000 graduates across the nation. The ceremony highlighted sixty years of values-based instruction, uncompromised academic excellence, and modern infrastructural milestones.',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
  '2025-10-01 09:00:00+00',
  true
),
(
  'Class X Students Achieve 100% Board Distinction for 8th Consecutive Year',
  'class-x-100-percent-distinction',
  'Academics',
  'All Class X students scored first-class and above in the State Board examinations, with State Rank 2 awarded to Sneha K. Varma with 98.6%.',
  'All Class X students scored first-class and above in the State Board examinations, with State Rank 2 awarded to Sneha K. Varma with 98.6%. Over 92% of the graduating cohort achieved distinctions with perfect centum scores in mathematics and physical sciences, cementing AMAA High School’s position as a premier academic powerhouse.',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop',
  '2025-05-28 10:30:00+00',
  true
),
(
  'Science Olympiad Team Wins State-Level Academic Science Championship',
  'science-olympiad-state-championship',
  'Academic',
  'The AMAA Science team competed against 64 schools and won first place at the State-Level Science & Mathematics Challenge 2025.',
  'The AMAA Science team competed against 64 schools and won first place at the State-Level Science & Mathematics Challenge 2025. Demonstrating exceptional theoretical understanding and experimental finesse, students built working sensor-interfaced models that received unanimous praise from university adjudicators.',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  '2025-03-12 11:00:00+00',
  true
),
(
  'Modern Computer & IT Lab Inaugurated with 24 Workstations',
  'computer-it-lab-inauguration',
  'Infrastructure',
  'The modern Computer & IT Lab featuring high-performance desktop workstations, high-speed networking, and digital learning software was formally inaugurated this week.',
  'The modern Computer & IT Lab featuring high-performance desktop workstations, high-speed networking, and digital learning software was formally inaugurated this week. Designed to support classes from Grade VI through Grade X, the facility supports coding curriculums in Python, digital robotics simulations, and computer literacy.',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
  '2025-01-20 08:30:00+00',
  true
);


-- --------------------------------------------------------------------
-- 7. SCHOOL EVENTS (school_events)
-- --------------------------------------------------------------------
DELETE FROM public.school_events;

INSERT INTO public.school_events (
  title, event_date, end_date, venue, audience, description, action_text, action_url, is_published
) VALUES
(
  'Diamond Jubilee Open Day',
  '2026-10-12 09:00:00+00',
  '2026-10-12 13:00:00+00',
  'Main Campus — All Wings',
  'Parents & Prospective Students',
  'Visit our campus, meet faculty, and see live science practical demonstrations. Registration required.',
  'Register for Open Day',
  '/contact?type=tour',
  true
),
(
  'Inter-School Science Olympiad',
  '2026-10-26 08:30:00+00',
  '2026-10-26 16:00:00+00',
  'Dr. A.P.J. Abdul Kalam Science Wing',
  'Grades VI to X Competitors & Observers',
  'Annual inter-school science competition with experimental exhibits, scientific models, and quizzes.',
  'View Competition Rules',
  '/academics',
  true
),
(
  'Middle & High School Academic Briefing',
  '2026-11-08 10:00:00+00',
  '2026-11-08 12:00:00+00',
  'Vivekananda Conference Hall',
  'Grades VI–X Enrolled & Prospective Families',
  'Dedicated academic orientation for parents of Grades VI–X applicants.',
  'RSVP Attendance',
  '/contact',
  true
),
(
  'Annual Athletic Championship',
  '2026-11-21 07:00:00+00',
  '2026-11-21 17:00:00+00',
  'Major Dhyan Chand Athletic Arena',
  'All Students, Parents & Spectators',
  'District-level athletics including 100m–1500m track events, long jump, and relay races.',
  'Download Event Schedule',
  '/student-life#sports',
  true
),
(
  'Annual Cultural Day — Tarangini',
  '2026-12-06 17:00:00+00',
  '2026-12-06 21:00:00+00',
  'Swami Vivekananda Open Auditorium',
  'School Community & Guests',
  'Annual cultural evening featuring drama, dance, music, and art installations by students.',
  'View Programme Guide',
  '/student-life#arts',
  true
);


-- --------------------------------------------------------------------
-- 8. SCHOOL CIRCULARS (school_circulars)
-- --------------------------------------------------------------------
DELETE FROM public.school_circulars;

INSERT INTO public.school_circulars (
  circular_number, title, issue_date, target_classes, file_url, is_published
) VALUES
(
  'CIRC-2025-09-01',
  'Fee Remittance — Second Installment (Oct 2025)',
  '2025-09-20',
  'All Grades (VI–X)',
  '#circular-fee-oct-2025',
  true
),
(
  'CIRC-2025-08-02',
  'Mandatory Vaccination Drive — ASHA Health Camp',
  '2025-08-31',
  'All Grades',
  '#circular-vaccination-2025',
  true
),
(
  'CIRC-2025-08-01',
  'Academic Uniform Policy — 2025–26 Revision',
  '2025-08-10',
  'Grades VI to X',
  '#circular-uniform-policy-2025',
  true
),
(
  'CIRC-2025-07-01',
  'Annual Holiday List — Academic Year 2025–26',
  '2025-07-05',
  'All Students & Staff',
  '#circular-holidays-2025-26',
  true
),
(
  'CIRC-2025-06-01',
  'Bus Route Revision — New City Routes from July 2025',
  '2025-06-15',
  'Transport Commuters',
  '#circular-bus-routes-2025',
  true
),
(
  'CIRC-2025-05-01',
  'Grade X Board Results & Merit Scholarship Notification',
  '2025-05-30',
  'Class X Outgoing Batch',
  '#circular-board-results-2025',
  true
);


-- --------------------------------------------------------------------
-- 9. GALLERY IMAGES (gallery_images)
-- --------------------------------------------------------------------
DELETE FROM public.gallery_images;

INSERT INTO public.gallery_images (
  title, category, image_url, caption, year, sort_order, is_featured, is_active
) VALUES
`;

const gallerySqlValues = photos.map((p, idx) => {
  const safeTitle = p.title.replace(/'/g, "''");
  const safeCaption = p.caption.replace(/'/g, "''");
  const safeCat = p.category.replace(/'/g, "''");
  return `(
  '${safeTitle}',
  '${safeCat}',
  '${p.image}',
  '${safeCaption}',
  '2025',
  ${idx + 1},
  ${p.featured ? 'true' : 'false'},
  true
)`;
}).join(',\n');

sql += gallerySqlValues + ';\n\n';

// Now add CMS sections and items
sql += `-- --------------------------------------------------------------------
-- 10. CMS SECTIONS & ITEMS (cms_sections & cms_section_items)
-- --------------------------------------------------------------------
DELETE FROM public.cms_sections;

DO $$
DECLARE
  v_page_home UUID;
  v_page_about UUID;
  v_page_academics UUID;
  v_page_campus UUID;
  v_page_facilities UUID;
  v_page_student_life UUID;
  v_page_achievements UUID;
  v_page_news UUID;
  v_page_gallery UUID;
  v_page_alumni UUID;
  v_page_admin UUID;
  v_page_contact UUID;

  v_sec_id UUID;
BEGIN
  -- Get Page IDs
  SELECT id INTO v_page_home FROM public.cms_pages WHERE slug = 'home';
  SELECT id INTO v_page_about FROM public.cms_pages WHERE slug = 'about';
  SELECT id INTO v_page_academics FROM public.cms_pages WHERE slug = 'academics';
  SELECT id INTO v_page_campus FROM public.cms_pages WHERE slug = 'campus';
  SELECT id INTO v_page_facilities FROM public.cms_pages WHERE slug = 'facilities';
  SELECT id INTO v_page_student_life FROM public.cms_pages WHERE slug = 'student-life';
  SELECT id INTO v_page_achievements FROM public.cms_pages WHERE slug = 'achievements';
  SELECT id INTO v_page_news FROM public.cms_pages WHERE slug = 'news-events';
  SELECT id INTO v_page_gallery FROM public.cms_pages WHERE slug = 'gallery';
  SELECT id INTO v_page_alumni FROM public.cms_pages WHERE slug = 'alumni';
  SELECT id INTO v_page_admin FROM public.cms_pages WHERE slug = 'administration';
  SELECT id INTO v_page_contact FROM public.cms_pages WHERE slug = 'contact';

  -- ==================================================================
  -- HOME PAGE SECTIONS (8 SECTIONS)
  -- ==================================================================

  -- 1. Hero Slider
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    cta_text, cta_url, secondary_cta_text, secondary_cta_url, badge, sort_order, is_visible
  ) VALUES (
    v_page_home, 'home.hero', 'hero_slider',
    'DIAMOND JUBILEE • ESTD. 1965',
    'Empowering Young Minds, Shaping Tomorrow',
    'Sixty years of disciplined academic excellence, ethical character, and progressive learning under our sacred motto "Lead Kindly Light".',
    'APPLY FOR 2025–26', '#admission-modal',
    'EXPLORE CAMPUS', '/campus',
    '60 Years of Heritage', 1, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, image_url, badge, sort_order) VALUES
  (v_sec_id, 'Empowering Young Minds, Shaping Tomorrow', 'DIAMOND JUBILEE • ESTD. 1965', 'Sixty years of disciplined academic excellence, ethical character, and progressive learning under our sacred motto "Lead Kindly Light".', '/gallery/jai00311.webp', '60 Years of Heritage', 1),
  (v_sec_id, 'Inspiring Curiosity, Building Character', 'GRADES VI TO X • RECOGNISED HIGH SCHOOL BOARD', 'A world-class secondary curriculum blending deep conceptual mastery, 1:20 mentor ratio, and dedicated personal care.', '/gallery/jai00385.webp', '100% Board Distinction', 2),
  (v_sec_id, 'A Premier Sanctuary for Lifelong Learning', '15-ACRE GREEN CAMPUS', 'State-of-the-art 4K smart interactive classrooms, science discovery laboratories, and championship athletic grounds.', '/gallery/jai00343.webp', 'Modern Infrastructure', 3),
  (v_sec_id, 'Excellence in Academics, Sports & Leadership', 'HOLISTIC EXCELLENCE', 'Nurturing champions in academic boards, national science olympiads, inter-school athletics, and creative arts.', '/gallery/jai00447.webp', '10,000+ Global Alumni', 4);

  -- 2. Heritage Section
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    content_html, image_url, cta_text, cta_url, secondary_cta_text, secondary_cta_url, badge, sort_order, is_visible
  ) VALUES (
    v_page_home, 'home.heritage', 'heritage_split',
    'DIAMOND JUBILEE • 60 YEARS OF EXCELLENCE',
    'School Heritage & Founding Ethos',
    'Since 1965, A.M.A. Adinarayana English Medium High School has illuminated young minds under the timeless invocation "Lead Kindly Light". We combine traditional moral fortitude with contemporary academic excellence.',
    '“True education is not merely the transmission of facts, but the ignition of intellect, character, and humanitarian empathy that guides an individual through life like a kindly light.” — Institutional Motto, Estd. 1965',
    '/gallery/jai00286.webp',
    'EXPLORE PHOTO ARCHIVES', '/gallery',
    'Read Full History', '/about',
    'Tamaso Ma Jyotirgamaya', 2, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, description, badge, sort_order) VALUES
  (v_sec_id, 'Years Heritage', 'Diamond Jubilee legacy since 1965', '60+', 1),
  (v_sec_id, 'Board Pass Rate', 'Unbroken Class X passing record', '100%', 2),
  (v_sec_id, 'Global Alumni', 'Graduates across AIIMS, tech and governance', '10,000+', 3),
  (v_sec_id, 'Rooted in Values', 'Guided by our sacred motto "Lead Kindly Light", character formation and ethical integrity accompany every academic triumph.', 'Pillar 01', 4),
  (v_sec_id, 'Academic Distinction', 'Unbroken tradition of 100% board pass results, state merit ranks, and Olympiad medals over multiple decades.', 'Pillar 02', 5),
  (v_sec_id, 'Global Alumni Legacy', 'Our graduates thrive across top institutions like AIIMS, Google DeepMind, Indian Administrative Services, and the Armed Forces.', 'Pillar 03', 6),
  (v_sec_id, 'Compassionate Mentorship', 'A dedicated 1:20 educator ratio ensures that every child receives individualized encouragement, empathy, and intellectual guidance.', 'Pillar 04', 7);

  -- 3. Academics Section
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    cta_text, cta_url, secondary_cta_text, secondary_cta_url, sort_order, is_visible
  ) VALUES (
    v_page_home, 'home.academics', 'academics_wings',
    'ACADEMIC PATHWAYS • GRADES VI TO X',
    'Explore. Learn. Excel.',
    'We guide students from Grade VI analytical discovery through Class X secondary board distinctions. Select a wing below to explore curriculum, subjects, and outcomes.',
    'MEET OUR FACULTY', '/faculty',
    'VIEW SYLLABUS', '/academics',
    3, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, badge, sort_order) VALUES
  (v_sec_id, 'Middle School Wing', 'Grades VI – VIII (Ages 11 – 14)', 'Subject specialization, lab practicals, and Olympiad readiness. Students explore independent thinking, abstract reasoning, and systematic science.', 'Analytical Discovery', 1),
  (v_sec_id, 'Secondary Board Wing', 'Grades IX – X (Ages 14 – 16)', 'Unbroken 100% board distinction and career gateway preparation with intensive mock exams and Olympiad tracks.', 'Board Excellence', 2),
  (v_sec_id, 'Individual Attention', '1:20 Student-Teacher Ratio', 'Small class batches ensure teachers know every child’s learning speed and doubts.', '1:20', 3),
  (v_sec_id, 'Board Pass Record', '100% Board Clearance', 'Unbroken multi-decade tradition of zero failures and top distinction honors.', '100%', 4),
  (v_sec_id, 'Smart Digital Suites', '4K Smart Interactive Classrooms', 'Interactive touch panels, modern laboratories, and fully equipped computer workstations.', '4K', 5);

  -- 4. Campus Preview
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    cta_text, cta_url, sort_order, is_visible
  ) VALUES (
    v_page_home, 'home.campus', 'facilities_grid',
    'WORLD-CLASS INFRASTRUCTURE',
    'Our Campus & Facilities',
    'Spanning a lush 15-acre sanctuary of learning, our campus blends state-of-the-art academic suites with expansive athletic complexes and vigilant safety infrastructure.',
    'EXPLORE ALL CAMPUS AMENITIES', '/campus',
    4, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, image_url, badge, sort_order) VALUES
  (v_sec_id, 'Smart 4K Classrooms', 'Digitally Immersive Learning Environments', 'Acoustically tuned, climate-controlled classrooms equipped with 75-inch 4K interactive touch panels.', '/gallery/jai00385.webp', '100% Digitalized', 1),
  (v_sec_id, 'Modern Science & Computer Suites', 'Physics, Chemistry, Biology & IT Wings', 'Individual experiment stations with certified safety apparatus, fume exhausts, and networked computer workstations.', '/gallery/jai00399.webp', 'Secondary Certified', 2),
  (v_sec_id, 'Grand Reference Library', '25,000+ Literary & Research Volumes', 'Two-tier reading gallery featuring academic encyclopedias, national journals, and peaceful study pods.', '/gallery/jai00368.webp', '25,000+ Books', 3),
  (v_sec_id, 'Athletic Sports Complex', '400m Track, Cricket, Football & Martial Arts', 'Sprawling grass fields, certified cricket practice nets, synthetic courts, and an indoor taekwondo dojo.', '/gallery/jai00329.webp', 'Olympic Guidelines', 4),
  (v_sec_id, 'GPS-Monitored Fleet', 'Safe, Air-Cooled City Transit', 'Modern fleet covering all major city neighborhoods with real-time GPS tracking and female attendants.', '/gallery/jai00331.webp', '100% Monitored', 5);

  -- 5. Student Life Gallery Showcase
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    cta_text, cta_url, sort_order, is_visible
  ) VALUES (
    v_page_home, 'home.student_life', 'gallery_showcase',
    'AUTHENTIC VISUAL CHRONICLE',
    'Life & Learning at AMAA',
    'Real moments from our 15-acre campus: smart interactive classrooms, high-tech IT suites, NCC ceremonial march-past, and disaster preparedness assemblies.',
    'EXPLORE ALL 38 PHOTOS', '/gallery',
    5, true
  );

  -- 6. Achievements Section
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    cta_text, cta_url, sort_order, is_visible
  ) VALUES (
    v_page_home, 'home.achievements', 'achievements_bento',
    'ACADEMIC DISTINCTIONS & BOARD HONORS',
    'Tradition of Excellence',
    'Consistently outperforming state averages, our students secure top ranks in secondary board exams, Olympiads, and athletic meets.',
    'VIEW ACADEMIC HONORS', '/achievements',
    6, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, badge, sort_order) VALUES
  (v_sec_id, 'Secondary Board Pass Rate', 'Unbroken Legacy Across Decades', 'Unbroken 100% board passing record maintained across decades, with 9 out of 10 students achieving distinction.', '100%', 1),
  (v_sec_id, 'Distinctions & First Class Honors', 'Class X Secondary Aggregate', 'Over nine out of ten graduating students score in the topmost distinction tier in Class X board exams.', '92%', 2),
  (v_sec_id, 'Olympiad State & National Medals', 'SOF, NTSE & Competitive Honors', 'SOF Science, Mathematics, Cyber and National Talent Search Examination state honors.', '140+', 3),
  (v_sec_id, 'Sports Championships & Trophies', 'Athletic Tournaments Won', 'District cricket, zonal athletics, inter-school badminton & taekwondo championships.', '45+', 4);

  -- 7. Testimonials Section
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    sort_order, is_visible
  ) VALUES (
    v_page_home, 'home.testimonials', 'testimonials_grid',
    'VOICES OF TRUST & EXCELLENCE',
    'What Parents & Alumni Say',
    'Discover authentic experiences from families whose children thrive at AMAA High School, and distinguished alumni making an impact across the globe.',
    7, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, badge, sort_order) VALUES
  (v_sec_id, 'Dr. Priya Sharma, MBBS, MS', 'Senior Consultant Cardiologist, AIIMS New Delhi (Batch of 2012)', 'AMAA High School provided the bedrock of disciplined scientific inquiry, analytical rigor, and human empathy that defines my medical practice today.', 'Alumni • 5 Stars', 1),
  (v_sec_id, 'Mr. Rajesh & Dr. Sunita Kulkarni', 'Parents of Rohan Kulkarni (Grade IX)', 'Enrolling our son in AMAA High School was the single best decision for his overall personality. The blend of academics, labs, and values is unmatched.', 'Parents • 5 Stars', 2),
  (v_sec_id, 'Vikramaditya Roy, B.Tech, M.S.', 'Principal Cloud Systems Architect, Seattle, USA (Batch of 2014)', 'The computer applications lab and mathematics training gave me a decade-long head start. The focus on fundamentals is AMAA’s greatest strength.', 'Alumni • 5 Stars', 3),
  (v_sec_id, 'Mrs. Lakshmi Narayanan', 'Mother of Ananya (Class X) & Karthik (Class VI)', 'What sets AMAA apart is the individual care. The 1:20 mentor ratio is not just on paper—teachers know each student by name.', 'Parents • 5 Stars', 4),
  (v_sec_id, 'Sneha K. Varma', 'Class X Secondary Board State Rank 2 (98.6%)', 'The teachers were always approachable for doubts even after regular hours. Regular diagnostic tests gave our batch the clarity to achieve 100% distinction.', 'Students • 5 Stars', 5);

  -- 8. Admissions CTA
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    cta_text, cta_url, secondary_cta_text, secondary_cta_url, sort_order, is_visible
  ) VALUES (
    v_page_home, 'home.admissions_cta', 'admissions_cta',
    'ADMISSIONS OPEN • ACADEMIC SESSION 2025–26',
    'Give Your Child the Foundation of a Lifetime',
    'Join our 60-year legacy of academic brilliance, moral character, and future-ready innovation under the sacred invocation "Lead Kindly Light". Admissions open for Grades VI to Grade X.',
    'APPLY ONLINE FOR 2025–26', '#admission-modal',
    'DOWNLOAD PROSPECTUS (PDF)', '#prospectus-download',
    8, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, sort_order) VALUES
  (v_sec_id, 'Online Enquiry', 'Step 01', 'Fill out our 60-second digital application token or call our admissions cell directly.', 1),
  (v_sec_id, 'Campus Walkthrough', 'Step 02', 'Tour our 15-acre campus, 4K smart classrooms, science laboratories, and athletic grounds.', 2),
  (v_sec_id, 'Child Interaction', 'Step 03', 'A friendly, non-intimidating observation session to assess child curiosity and grade readiness.', 3),
  (v_sec_id, 'Confirmed Seat', 'Step 04', 'Complete fee clearance, document verification, and receive your welcome orientation kit.', 4);

  -- ==================================================================
  -- ABOUT US PAGE SECTIONS (6 SECTIONS)
  -- ==================================================================

  -- 1. About Hero
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    cta_text, cta_url, secondary_cta_text, secondary_cta_url, badge, sort_order, is_visible
  ) VALUES (
    v_page_about, 'about.hero', 'page_hero',
    '"LEAD KINDLY LIGHT" • ESTD. 1965',
    '60 Years of Academic Rigor & Moral Enlightenment',
    'Established in 1965, A.M.A. Adinarayana English Medium High School has illuminated the paths of generations of young learners under the timeless motto "Lead Kindly Light."',
    'Apply for Admission 2025–26', '#admission-modal',
    'Explore Curriculum', '/academics',
    'Diamond Jubilee', 1, true
  );

  -- 2. About Stats
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, heading, sort_order, is_visible
  ) VALUES (
    v_page_about, 'about.stats', 'stats_strip',
    'Key Institutional Statistics', 2, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, badge, sort_order) VALUES
  (v_sec_id, 'Years of Heritage', 'Diamond Jubilee (1965)', '60+', 1),
  (v_sec_id, 'Teacher Ratio', 'Personalized mentoring', '1:20', 2),
  (v_sec_id, 'Global Alumni', 'AIIMS, Tech & Governance', '10,000+', 3),
  (v_sec_id, 'Smart Green Campus', 'World-class infrastructure', '15 Acres', 4);

  -- 3. Vision & Mission
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_about, 'about.vision_mission', 'vision_mission',
    'OUR GUIDING PHILOSOPHY',
    'Vision & Mission', 3, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, badge, sort_order) VALUES
  (v_sec_id, 'Our Vision', 'Our Guiding Horizon', 'To be a transformative center of secondary education that empowers young minds to achieve the pinnacle of academic distinction, technological fluency, and ethical clarity, inspiring them to lead positively in an interconnected global society.', 'Recognised Educational Excellence', 1),
  (v_sec_id, 'Our Mission', 'Our Daily Commitment', 'To provide an inclusive, safe, and academically stimulating learning ecosystem where qualified educators ignite curiosity, foster critical problem solving through hands-on science practicals and arts, and cultivate unwavering moral integrity in every student from Grade VI through Grade X.', 'Dedicated to Holistic Student Welfare', 2);

  -- 4. Leadership / Principal's Desk
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    content_html, image_url, cta_text, cta_url, sort_order, is_visible
  ) VALUES (
    v_page_about, 'about.leadership', 'leadership_spotlight',
    'LEADERSHIP PERSPECTIVE',
    '"We don''t merely instruct for examinations; we cultivate thinkers who illuminate society."',
    'Dr. Shailendra K. Verma, Principal & Academic Director (M.Sc., M.Ed., Ph.D. in Education)',
    'Dear Parents, Students, and Well-Wishers,\n\nWelcome to AMAA High School. Education is the greatest catalyst for human dignity and progress. In our classrooms, laboratories, and sports grounds, we view each child as an individual universe of boundless potential. Our responsibility is to nurture their questions, fortify their resilience, and anchor them in timeless moral values.\n\nAs we advance into an era shaped by artificial intelligence and scientific leaps, we remain steadfast in our dedication to humanistic empathy, athletic vigor, and artistic sensibility.',
    '/gallery/jai00525.webp',
    'Meet the Governing Body & Trustees', '/administration',
    4, true
  );

  -- 5. Core Values
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_about, 'about.values', 'values_grid',
    'INSTITUTIONAL PILLARS',
    'Foundations of Student Success', 5, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, description, sort_order) VALUES
  (v_sec_id, 'Intellectual Rigor', 'Instilling disciplined analytical thinking, scientific inquiry, and deep conceptual clarity from early childhood to Class 10.', 1),
  (v_sec_id, 'Moral Integrity & Ethics', 'Rooting education in honesty, respect, empathy, and social responsibility under our motto "Lead Kindly Light".', 2),
  (v_sec_id, 'Future-Ready Innovation', 'Active immersion in scientific exploration, computer literacy, and creative arts that prepare young learners for secondary and higher academic pursuits.', 3),
  (v_sec_id, 'Inclusive Mentorship', 'A student-to-teacher ratio of 1:20 ensuring every child receives tailored academic guidance and emotional care.', 4);

  -- 6. Milestones Timeline
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_about, 'about.history', 'timeline',
    'JOURNEY OVER TIME',
    'Milestones of Growth (1965 – Present)', 6, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, description, badge, sort_order) VALUES
  (v_sec_id, 'Foundation of A.M.A. Adinarayana High School', 'Founded under the sacred motto "Lead Kindly Light" to impart disciplined, values-based English medium education to children across the region.', '1965', 1),
  (v_sec_id, 'Board Recognition & Secondary Expansion', 'Official high school board accreditation and expansion of comprehensive physics, chemistry, and biology laboratory wings.', '1985', 2),
  (v_sec_id, 'Athletic Infrastructure & Library Hub', 'Development of multi-sport grounds, regulation athletic tracks, and a 25,000+ volume knowledge library.', '2005', 3),
  (v_sec_id, 'Digital Classrooms & Science Laboratories', 'Integration of 4K interactive smart panels and modernized science and computer laboratories for practical learning.', '2018', 4),
  (v_sec_id, '60 Glorious Years of Diamond Jubilee Excellence', 'Celebrating 60 years of transformative education, over 10,000 alumni excelling globally, and continuous 100% board pass distinction.', '2025–26', 5);

  -- ==================================================================
  -- ACADEMICS PAGE SECTIONS (3 SECTIONS)
  -- ==================================================================

  -- 1. Academics Hero
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading,
    cta_text, cta_url, secondary_cta_text, secondary_cta_url, sort_order, is_visible
  ) VALUES (
    v_page_academics, 'academics.hero', 'page_hero',
    'A.M.A. ADINARAYANA ACADEMICS • "LEAD KINDLY LIGHT" (ESTD. 1965)',
    'Nurturing Intellectual Rigor & Lifelong Curiosity',
    'From foundational conceptual mastery in Middle School through Class 10 secondary board distinction, our pedagogy translates our motto "Lead Kindly Light" into rigorous intellect, moral clarity, and future technologies.',
    'Enroll for Session 2025–26', '#admission-modal',
    'Explore Laboratories', '/campus',
    1, true
  );

  -- 2. Academics Stats
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, heading, sort_order, is_visible
  ) VALUES (
    v_page_academics, 'academics.stats', 'stats_strip',
    'Academic Benchmarks', 2, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, badge, sort_order) VALUES
  (v_sec_id, 'Secondary Board Pass Rate', 'Unbroken 1st class honors', '100%', 1),
  (v_sec_id, 'Student-Teacher Ratio', 'Mentorship in every classroom', '1:20', 2),
  (v_sec_id, 'Hands-on Lab Experiments', 'Annual per-student practicals', '120+', 3),
  (v_sec_id, 'Olympiad & Academic Awards', 'State & national honors won', '45+', 4);

  -- 3. Academic Wings
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_academics, 'academics.wings', 'academic_wings',
    'CURRICULUM ARCHITECTURE',
    'Middle School & Secondary Board Wings',
    'Structured developmental stages designed to guide students from analytical inquiry to board distinction.',
    3, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, badge, sort_order) VALUES
  (v_sec_id, 'Middle School Wing', 'Grade 6 through Grade 8 (Age 11 to 14 Years)', 'Focusing on specialized sciences, abstract algebra, geometry, social studies, and introductory computer programming with real-world applications.', 'Analytical Discovery', 1),
  (v_sec_id, 'Secondary Board Wing', 'Grade 9 & Grade 10 (Age 14 to 16 Years)', 'Rigorous academic preparation aligned with State Board benchmarks, intense diagnostic mock examinations, peer-study circles, and career orientation.', 'Board Excellence', 2);

  -- ==================================================================
  -- CAMPUS & FACILITIES SECTIONS (2 SECTIONS)
  -- ==================================================================

  -- 1. Campus Hero
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_campus, 'campus.hero', 'page_hero',
    'WORLD-CLASS INFRASTRUCTURE',
    'Our Campus & Facilities',
    'Spanning a lush 15-acre sanctuary of learning, our campus blends state-of-the-art academic suites with expansive athletic complexes and vigilant safety infrastructure.',
    1, true
  );

  -- 2. Facilities Grid (7 Items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_campus, 'campus.facilities_grid', 'facilities_grid',
    'MODERN AMENITIES',
    'Purpose-Built Learning Spaces', 2, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, image_url, badge, sort_order) VALUES
  (v_sec_id, 'Next-Gen Smart Classrooms', 'Digitally Immersive Learning Environments', 'Acoustically treated, climate-controlled learning studios featuring 4K interactive touch panels and hybrid streaming systems.', '/gallery/jai00385.webp', '45+ Units', 1),
  (v_sec_id, 'Integrated Science Laboratories', 'Physics, Chemistry & Biology Wings', 'Dedicated Physics, Chemistry, and Biology research suites equipped with modern sensory apparatus and emergency safety showers.', '/gallery/jai00399.webp', '60 Seats', 2),
  (v_sec_id, 'Digital & Heritage Learning Library', '25,000+ Literary & Research Volumes', 'A serene sanctum housing over 25,000 physical volumes, international scientific periodicals, and high-speed digital research terminals.', '/gallery/jai00368.webp', '25,000+ Books', 3),
  (v_sec_id, 'Olympic-Standard Sports Complex', 'Multi-Sport Athletic Grounds', 'Multi-sport athletic grounds comprising synthetic track, basketball arena, cricket pitch, badminton courts, and indoor martial arts dojo.', '/gallery/jai00329.webp', '4+ Acres', 4),
  (v_sec_id, 'GPS-Monitored Fleet Transport', 'Safe, Air-Cooled City Transit', 'Safe, GPS-tracked, speed-governed air-conditioned fleet covering major nodal pickup points across the municipal district.', '/gallery/jai00331.webp', '22 Lines', 5),
  (v_sec_id, 'Auditorium & Fine Arts Pavilion', 'Cultural Arena & Amphitheater', 'An open-air amphitheater stage and quadrangle with acoustic architecture for morning assemblies and grand school events.', '/gallery/jai00308.webp', '800 Seats', 6),
  (v_sec_id, 'Commercial RO Drinking Water Plant', 'Hygiene & Health Infrastructure', 'Heavy-duty reverse osmosis commercial water purification facility ensuring 100% certified potable mineral water across campus.', '/gallery/jai00405.webp', '100% Pure', 7);

  -- ==================================================================
  -- STUDENT LIFE SECTIONS (5 SECTIONS)
  -- ==================================================================

  -- 1. Student Life Hero
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_student_life, 'student_life.hero', 'page_hero',
    'Beyond the Classroom',
    'Vibrant Student Life at AMAA',
    'Education at AMAA extends far beyond textbooks. We nurture athletes, artists, debaters, coders, and creators — building whole human beings who lead with character.',
    1, true
  );

  -- 2. Activities (6 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_student_life, 'student_life.activities', 'feature_grid',
    'Co-curricular Enrichment',
    'Activities & Programmes', 2, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, description, badge, sort_order) VALUES
  (v_sec_id, 'Performing Arts', 'Classical vocal & instrumental training, symphonic band, and annual cultural performances on the main stage.', 'Arts & Music', 1),
  (v_sec_id, 'Visual Arts Studio', 'Drawing, watercolour, sculpture, digital art, and annual art exhibitions showcasing student creativity.', 'Fine Arts', 2),
  (v_sec_id, 'Debate & Elocution', 'Inter-house debates, MUN participation, public speaking and competitive elocution rounds at state level.', 'Communication', 3),
  (v_sec_id, 'Literary Club', 'Book discussions, creative writing workshops, school magazine editing, and national essay competitions.', 'Literature', 4),
  (v_sec_id, 'Science & Computer Club', 'Hands-on scientific models, computer coding workshops, tech exhibitions, and inter-school science competitions.', 'Science & IT', 5),
  (v_sec_id, 'Eco & Nature Club', 'School garden maintenance, environmental awareness campaigns, and district-level eco science fairs.', 'Environment', 6);

  -- 3. Sports (6 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_student_life, 'student_life.sports', 'feature_grid',
    'Physical Conditioning',
    'Athletics & Sports', 3, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, description, sort_order) VALUES
  (v_sec_id, 'Athletics (Track & Field)', '400m track, sprint, relay, long jump, high jump — with NIS-certified coaches.', 1),
  (v_sec_id, 'Cricket', 'Year-round cricket nets, district U-16 teams, and state inter-school tournaments.', 2),
  (v_sec_id, 'Football', 'Full-size turf ground, inter-house leagues, and district championship squads.', 3),
  (v_sec_id, 'Taekwondo & Martial Arts', 'Certified black-belt instruction, indoor dojo, state gold medal holders.', 4),
  (v_sec_id, 'Volleyball & Badminton', 'Synthetic courts, coached sessions, and state under-14 representation.', 5),
  (v_sec_id, 'Yoga & Fitness', 'Daily morning yoga, flexibility training, and stress management for all grades.', 6);

  -- 4. Arts & Culture (4 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_student_life, 'student_life.arts', 'feature_grid',
    'Cultural Celebrations',
    'Annual Cultural Calendar', 4, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, description, sort_order) VALUES
  (v_sec_id, 'Tarangini (Annual Day)', 'Grand cultural evening with drama, dance, music, fashion show, and talent awards — over 500 performers each year.', 1),
  (v_sec_id, 'Republic Day Programme', 'Patriotic stage performances, flag hoisting, special assembly, and certificate distribution for achievers.', 2),
  (v_sec_id, 'Diwali & Ugadi Celebrations', 'Cultural unity programmes celebrating major Indian festivals with rangoli, food fairs, and art competitions.', 3),
  (v_sec_id, 'Science Mela & Expo', 'Annual school-wide science fair with working models, experiments, and a public showcase for parents.', 4);

  -- 5. Clubs & Societies (6 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_student_life, 'student_life.clubs', 'feature_grid',
    'Student Guilds',
    'Clubs & Societies', 5, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, badge, sort_order) VALUES
  (v_sec_id, 'Computer & Coding Club', 'Meets: Every Saturday', 'Lead: Mr. Anand Kumar (CS Dept.)', '45+ Members', 1),
  (v_sec_id, 'Nature & Ecology Club', 'Meets: Every Thursday', 'Lead: Ms. Radha Iyer (Biology)', '38 Members', 2),
  (v_sec_id, 'Debate & MUN Club', 'Meets: Tuesdays & Fridays', 'Lead: Mr. Venkata Rao (English)', '52 Members', 3),
  (v_sec_id, 'Literary & Magazine Club', 'Meets: Every Wednesday', 'Lead: Ms. Sunita Bose (Language)', '30 Members', 4),
  (v_sec_id, 'Art & Photography Club', 'Meets: Every Saturday', 'Lead: Ms. Kavitha Nair (Fine Arts)', '27 Members', 5),
  (v_sec_id, 'Taekwondo & Fitness Club', 'Meets: Daily (Morning)', 'Lead: Mr. Rajesh Shetty (NIS Coach)', '60 Members', 6);

  -- ==================================================================
  -- ACHIEVEMENTS PAGE SECTIONS (4 SECTIONS)
  -- ==================================================================

  -- 1. Achievements Hero
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_achievements, 'achievements.hero', 'page_hero',
    'ACADEMIC DISTINCTIONS & BOARD HONORS',
    'Tradition of Excellence',
    'Consistently outperforming state averages, our students secure top ranks in secondary board exams, Olympiads, and athletic meets.',
    1, true
  );

  -- 2. Distinction Stats (6 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, heading, sort_order, is_visible
  ) VALUES (
    v_page_achievements, 'achievements.stats', 'stats_strip',
    'Distinction Metrics', 2, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, badge, sort_order) VALUES
  (v_sec_id, 'Board Pass Record', 'Unbroken multi-decade tradition', '100%', 1),
  (v_sec_id, 'First Class & Distinctions', 'Class X secondary aggregate', '92%', 2),
  (v_sec_id, 'Olympiad Medals', 'SOF, NTSE & National level', '140+', 3),
  (v_sec_id, 'Sports Trophies', 'Athletics, cricket, taekwondo', '45+', 4),
  (v_sec_id, 'Global Alumni', 'Across medicine, tech & governance', '10,000+', 5),
  (v_sec_id, 'Years of Excellence', 'Diamond Jubilee legacy', '60+', 6);

  -- 3. Olympiad Honors (6 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_achievements, 'achievements.olympiads', 'feature_grid',
    'COMPETITIVE EXCELLENCE',
    'Olympiad & NTSE Honors', 3, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, badge, sort_order) VALUES
  (v_sec_id, 'Science Olympiad (SOF)', 'Years: 2018–2025', '48 Gold / Silver', 1),
  (v_sec_id, 'National Cyber Olympiad', 'Years: 2019–2025', '32 State Ranks', 2),
  (v_sec_id, 'Mathematics Olympiad', 'Years: 2017–2025', '27 Gold / Distinction', 3),
  (v_sec_id, 'NTSE State Selection', 'Years: 2015–2025', '11 Scholars', 4),
  (v_sec_id, 'National Science Exhibition', 'Years: 2020–2025', '8 State Prizes', 5),
  (v_sec_id, 'Art & Creative Writing', 'Years: 2018–2025', '14 National Awards', 6);

  -- 4. Sports Championships (6 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_achievements, 'achievements.sports', 'feature_grid',
    'ATHLETIC GLORY',
    'Sports Championships & Trophies', 4, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, badge, sort_order) VALUES
  (v_sec_id, 'Athletics (Track & Field)', 'District Championship × 9', 1),
  (v_sec_id, 'Cricket', 'State U-16 Shield × 3', 2),
  (v_sec_id, 'Taekwondo', 'State Gold × 7', 3),
  (v_sec_id, 'Football', 'District Gold × 5', 4),
  (v_sec_id, 'Volleyball', 'Inter-School Cup × 4', 5),
  (v_sec_id, 'Badminton', 'State Under-14 × 2', 6);

  -- 5. Distinguished Alumni Prodigies (4 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_achievements, 'achievements.alumni', 'feature_grid',
    'PRODIGY ALUMNI',
    'Distinguished Alumni Leaders', 5, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, badge, sort_order) VALUES
  (v_sec_id, 'Dr. Priya Sharma, MBBS, MS', 'Batch of 2012 • Senior Consultant Cardiologist', 'AIIMS New Delhi', 'Healthcare Pioneer', 1),
  (v_sec_id, 'Vikramaditya Roy, B.Tech, M.S.', 'Batch of 2014 • Principal Systems Architect', 'Global Technology Enterprise', 'Tech Innovator', 2),
  (v_sec_id, 'Ananya Deshmukh, IAS', 'Batch of 2010 • District Magistrate & Collector', 'Government Administration', 'Public Governance', 3),
  (v_sec_id, 'Maj. Siddharth Menon', 'Batch of 2008 • Squadron Commander', 'Indian Armed Forces', 'National Defence', 4);

  -- ==================================================================
  -- NEWS & EVENTS PAGE SECTIONS (2 SECTIONS)
  -- ==================================================================

  -- 1. News Hero
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_news, 'news_events.hero', 'page_hero',
    'OFFICIAL DISCLOSURES & UPDATES',
    'News, Events & Circulars',
    'Stay updated with institutional milestones, upcoming sports matches, cultural galas, and official academic circulars.',
    1, true
  );

  -- 2. Announcements List (5 items)
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, sort_order, is_visible
  ) VALUES (
    v_page_news, 'news_events.announcements', 'announcements_list',
    'NOTICE BOARD',
    'Latest School Announcements', 2, true
  ) RETURNING id INTO v_sec_id;

  INSERT INTO public.cms_section_items (section_id, title, subtitle, description, badge, sort_order) VALUES
  (v_sec_id, 'Admissions Open for 2025–26 Academic Session', 'Sep 15, 2025', 'Applications are now accepted for Grades VI through Grade X. Inquire via the campus admissions desk or online enquiry form.', 'Admissions', 1),
  (v_sec_id, 'Mid-Term Examination Schedule — October 2025', 'Sep 25, 2025', 'Mid-term examinations for Grades VI–X are scheduled from October 14–22, 2025. Detailed timetables distributed in classrooms.', 'Academic', 2),
  (v_sec_id, 'Annual Sports Day Registration Open', 'Oct 2, 2025', 'Students wishing to participate in Annual Sports Day (November 21) must register with the Sports Wing by October 20, 2025.', 'Sports', 3),
  (v_sec_id, 'Science Olympiad State Qualifier — Registration Deadline', 'Oct 5, 2025', 'Last date for SOF Science Olympiad registration is October 15. Contact the academic coordinator for registration forms.', 'Academic', 4),
  (v_sec_id, 'Parent-Teacher Meeting — October 2025', 'Oct 8, 2025', 'The quarterly PTM is scheduled for October 18, 2025 (Saturday), 9:00 AM – 1:00 PM. Attendance is mandatory for parents of Grades VI–X.', 'General', 5);

  -- ==================================================================
  -- GALLERY PAGE (1 SECTION)
  -- ==================================================================
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_gallery, 'gallery.hero', 'page_hero',
    'VISUAL CHRONICLE',
    'Campus Photo Gallery',
    'Explore 38 authentic high-definition photographs capturing academic instruction, scientific discovery, NCC parades, and daily student life across our 15-acre green campus.',
    1, true
  );

  -- ==================================================================
  -- ALUMNI PAGE (1 SECTION)
  -- ==================================================================
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_alumni, 'alumni.hero', 'page_hero',
    'GLOBAL GRADUATES NETWORK',
    'AMAA Alumni Community',
    'Connecting over 10,000 alumni across six decades who are leading in medicine, technology, governance, and the armed forces.',
    1, true
  );

  -- ==================================================================
  -- ADMINISTRATION PAGE (1 SECTION)
  -- ==================================================================
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_admin, 'administration.hero', 'page_hero',
    'INSTITUTIONAL GOVERNANCE',
    'Administration & Leadership',
    'Guided by the Board of Trustees and academic directors committed to integrity, transparency, and the vision "Lead Kindly Light".',
    1, true
  );

  -- ==================================================================
  -- CONTACT PAGE (2 SECTIONS)
  -- ==================================================================
  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_contact, 'contact.hero', 'page_hero',
    'STUDENT SERVICES & FRONT DESK',
    'Connect With Our Campus',
    'We invite you to reach out to the admissions office and administration at A.M.A. Adinarayana Eng. Med. High School. We are here to guide your child''s journey.',
    1, true
  );

  INSERT INTO public.cms_sections (
    page_id, section_key, section_type, eyebrow, heading, subheading, sort_order, is_visible
  ) VALUES (
    v_page_contact, 'contact.info', 'contact_info',
    'CAMPUS INFORMATION',
    'Office Timings & Contact Desks',
    'Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar • Phone: +91 75440 10044 • Email: info@amaaschool.edu • Mon – Sat: 8:00 AM – 4:00 PM',
    2, true
  );

END $$;
`;

fs.writeFileSync('supabase_phase6_cms_seed.sql', sql, 'utf8');
console.log('Successfully written supabase_phase6_cms_seed.sql! File size:', fs.statSync('supabase_phase6_cms_seed.sql').size, 'bytes');
