-- ====================================================================
-- AMAA HIGH SCHOOL — PHASE 6: WEBSITE CMS DATABASE ARCHITECTURE
-- STEP 1: DDL, INDEXES, TRIGGERS & ROW LEVEL SECURITY (RLS)
-- ====================================================================

-- --------------------------------------------------------------------
-- 0. TRIGGER FUNCTION FOR UPDATED_AT
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- --------------------------------------------------------------------
-- 1. TABLE: site_settings
-- Global school configuration, topbar, navbar, footer, contact numbers
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 2. TABLE: navigation_items
-- Header & footer navigation hierarchy, dropdowns, and link paths
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  path TEXT,
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_navigation_items_updated_at ON public.navigation_items;
CREATE TRIGGER trigger_navigation_items_updated_at
  BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 3. TABLE: cms_pages
-- High-level page registry, routing slugs, SEO meta tags
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_cms_pages_updated_at ON public.cms_pages;
CREATE TRIGGER trigger_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 4. TABLE: cms_sections
-- Visual sections per page with ordering, visibility, copy & CTAs
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  section_type TEXT NOT NULL,
  eyebrow TEXT,
  heading TEXT,
  subheading TEXT,
  content_html TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_url TEXT,
  secondary_cta_text TEXT,
  secondary_cta_url TEXT,
  badge TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT unique_page_section_key UNIQUE (page_id, section_key)
);

DROP TRIGGER IF EXISTS trigger_cms_sections_updated_at ON public.cms_sections;
CREATE TRIGGER trigger_cms_sections_updated_at
  BEFORE UPDATE ON public.cms_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 5. TABLE: cms_section_items
-- Repeating content items (slides, feature cards, testimonials, specs)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_section_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.cms_sections(id) ON DELETE CASCADE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  badge TEXT,
  icon_name TEXT,
  link_url TEXT,
  link_text TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_cms_section_items_updated_at ON public.cms_section_items;
CREATE TRIGGER trigger_cms_section_items_updated_at
  BEFORE UPDATE ON public.cms_section_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 6. TABLE: faculty_members
-- Educator roster, academic departments, qualifications & bios
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  designation TEXT,
  department TEXT,
  qualification TEXT,
  experience TEXT,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  office_hours TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_faculty_members_updated_at ON public.faculty_members;
CREATE TRIGGER trigger_faculty_members_updated_at
  BEFORE UPDATE ON public.faculty_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 7. TABLE: academic_toppers
-- Class X AP SSC board toppers, ranks, marks & photos
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_toppers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  academic_year TEXT,
  class_level TEXT,
  score TEXT,
  rank_badge TEXT,
  quote TEXT,
  photo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_academic_toppers_updated_at ON public.academic_toppers;
CREATE TRIGGER trigger_academic_toppers_updated_at
  BEFORE UPDATE ON public.academic_toppers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 8. TABLE: school_articles
-- News articles, press releases, and editorial blogs
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  summary TEXT,
  body TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_school_articles_updated_at ON public.school_articles;
CREATE TRIGGER trigger_school_articles_updated_at
  BEFORE UPDATE ON public.school_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 9. TABLE: school_events
-- Events calendar, academic milestones, parent conferences & meets
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  venue TEXT,
  audience TEXT,
  description TEXT,
  action_text TEXT,
  action_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_school_events_updated_at ON public.school_events;
CREATE TRIGGER trigger_school_events_updated_at
  BEFORE UPDATE ON public.school_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 10. TABLE: school_circulars
-- Official downloadable circulars, board schedules & timetables
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_circulars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circular_number TEXT,
  title TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_classes TEXT,
  file_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_school_circulars_updated_at ON public.school_circulars;
CREATE TRIGGER trigger_school_circulars_updated_at
  BEFORE UPDATE ON public.school_circulars
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- 11. TABLE: gallery_images
-- Campus photography catalog with categorization & captions
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  image_url TEXT NOT NULL,
  caption TEXT,
  year TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

DROP TRIGGER IF EXISTS trigger_gallery_images_updated_at ON public.gallery_images;
CREATE TRIGGER trigger_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- --------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE & FILTERING
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_cms_sections_page_id ON public.cms_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_sections_sort ON public.cms_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_sections_visible ON public.cms_sections(is_visible);

CREATE INDEX IF NOT EXISTS idx_cms_section_items_section_id ON public.cms_section_items(section_id);
CREATE INDEX IF NOT EXISTS idx_cms_section_items_sort ON public.cms_section_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_cms_section_items_visible ON public.cms_section_items(is_visible);

CREATE INDEX IF NOT EXISTS idx_nav_items_parent_id ON public.navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_nav_items_sort ON public.navigation_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_nav_items_visible ON public.navigation_items(is_visible);

CREATE INDEX IF NOT EXISTS idx_cms_pages_published ON public.cms_pages(is_published);

CREATE INDEX IF NOT EXISTS idx_faculty_department ON public.faculty_members(department);
CREATE INDEX IF NOT EXISTS idx_faculty_sort ON public.faculty_members(sort_order);
CREATE INDEX IF NOT EXISTS idx_faculty_active ON public.faculty_members(is_active);

CREATE INDEX IF NOT EXISTS idx_toppers_year ON public.academic_toppers(academic_year);
CREATE INDEX IF NOT EXISTS idx_toppers_sort ON public.academic_toppers(sort_order);
CREATE INDEX IF NOT EXISTS idx_toppers_active ON public.academic_toppers(is_active);

CREATE INDEX IF NOT EXISTS idx_articles_published ON public.school_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.school_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.school_articles(category);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.school_events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.school_events(is_published);

CREATE INDEX IF NOT EXISTS idx_circulars_issue_date ON public.school_circulars(issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_circulars_published ON public.school_circulars(is_published);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_sort ON public.gallery_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON public.gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON public.gallery_images(is_featured);


-- --------------------------------------------------------------------
-- DATABASE LEVEL ROLES & PERMISSIONS
-- --------------------------------------------------------------------
-- Enable RLS on every table
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_section_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_toppers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_circulars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Grant table-level access: anon has SELECT only, authenticated has full operations
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;

GRANT SELECT ON public.navigation_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navigation_items TO authenticated;

GRANT SELECT ON public.cms_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;

GRANT SELECT ON public.cms_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_sections TO authenticated;

GRANT SELECT ON public.cms_section_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_section_items TO authenticated;

GRANT SELECT ON public.faculty_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty_members TO authenticated;

GRANT SELECT ON public.academic_toppers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_toppers TO authenticated;

GRANT SELECT ON public.school_articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_articles TO authenticated;

GRANT SELECT ON public.school_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_events TO authenticated;

GRANT SELECT ON public.school_circulars TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.school_circulars TO authenticated;

GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;


-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. site_settings
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can view public site settings" ON public.site_settings;
CREATE POLICY "Public can view public site settings"
  ON public.site_settings FOR SELECT
  TO anon
  USING (is_public = true);

DROP POLICY IF EXISTS "Staff can view site settings" ON public.site_settings;
CREATE POLICY "Staff can view site settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert site settings" ON public.site_settings;
CREATE POLICY "Admin staff can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update site settings" ON public.site_settings;
CREATE POLICY "Admin staff can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete site settings" ON public.site_settings;
CREATE POLICY "Admin staff can delete site settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 2. navigation_items
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible navigation items" ON public.navigation_items;
CREATE POLICY "Public can view visible navigation items"
  ON public.navigation_items FOR SELECT
  TO anon
  USING (is_visible = true);

DROP POLICY IF EXISTS "Staff can view all navigation items" ON public.navigation_items;
CREATE POLICY "Staff can view all navigation items"
  ON public.navigation_items FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert navigation items" ON public.navigation_items;
CREATE POLICY "Admin staff can insert navigation items"
  ON public.navigation_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update navigation items" ON public.navigation_items;
CREATE POLICY "Admin staff can update navigation items"
  ON public.navigation_items FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete navigation items" ON public.navigation_items;
CREATE POLICY "Admin staff can delete navigation items"
  ON public.navigation_items FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 3. cms_pages
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published pages" ON public.cms_pages;
CREATE POLICY "Public can view published pages"
  ON public.cms_pages FOR SELECT
  TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "Staff can view all pages" ON public.cms_pages;
CREATE POLICY "Staff can view all pages"
  ON public.cms_pages FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert pages" ON public.cms_pages;
CREATE POLICY "Admin staff can insert pages"
  ON public.cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update pages" ON public.cms_pages;
CREATE POLICY "Admin staff can update pages"
  ON public.cms_pages FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete pages" ON public.cms_pages;
CREATE POLICY "Admin staff can delete pages"
  ON public.cms_pages FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 4. cms_sections
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible sections of published pages" ON public.cms_sections;
CREATE POLICY "Public can view visible sections of published pages"
  ON public.cms_sections FOR SELECT
  TO anon
  USING (
    is_visible = true 
    AND EXISTS (
      SELECT 1 FROM public.cms_pages p 
      WHERE p.id = page_id AND p.is_published = true
    )
  );

DROP POLICY IF EXISTS "Staff can view all sections" ON public.cms_sections;
CREATE POLICY "Staff can view all sections"
  ON public.cms_sections FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert sections" ON public.cms_sections;
CREATE POLICY "Admin staff can insert sections"
  ON public.cms_sections FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update sections" ON public.cms_sections;
CREATE POLICY "Admin staff can update sections"
  ON public.cms_sections FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete sections" ON public.cms_sections;
CREATE POLICY "Admin staff can delete sections"
  ON public.cms_sections FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 5. cms_section_items
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible section items" ON public.cms_section_items;
CREATE POLICY "Public can view visible section items"
  ON public.cms_section_items FOR SELECT
  TO anon
  USING (
    is_visible = true
    AND EXISTS (
      SELECT 1 FROM public.cms_sections s
      JOIN public.cms_pages p ON p.id = s.page_id
      WHERE s.id = section_id
        AND s.is_visible = true
        AND p.is_published = true
    )
  );

DROP POLICY IF EXISTS "Staff can view all section items" ON public.cms_section_items;
CREATE POLICY "Staff can view all section items"
  ON public.cms_section_items FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert section items" ON public.cms_section_items;
CREATE POLICY "Admin staff can insert section items"
  ON public.cms_section_items FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update section items" ON public.cms_section_items;
CREATE POLICY "Admin staff can update section items"
  ON public.cms_section_items FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete section items" ON public.cms_section_items;
CREATE POLICY "Admin staff can delete section items"
  ON public.cms_section_items FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 6. faculty_members
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active faculty members" ON public.faculty_members;
CREATE POLICY "Public can view active faculty members"
  ON public.faculty_members FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Staff can view all faculty members" ON public.faculty_members;
CREATE POLICY "Staff can view all faculty members"
  ON public.faculty_members FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert faculty members" ON public.faculty_members;
CREATE POLICY "Admin staff can insert faculty members"
  ON public.faculty_members FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update faculty members" ON public.faculty_members;
CREATE POLICY "Admin staff can update faculty members"
  ON public.faculty_members FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete faculty members" ON public.faculty_members;
CREATE POLICY "Admin staff can delete faculty members"
  ON public.faculty_members FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 7. academic_toppers
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active academic toppers" ON public.academic_toppers;
CREATE POLICY "Public can view active academic toppers"
  ON public.academic_toppers FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Staff can view all academic toppers" ON public.academic_toppers;
CREATE POLICY "Staff can view all academic toppers"
  ON public.academic_toppers FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert academic toppers" ON public.academic_toppers;
CREATE POLICY "Admin staff can insert academic toppers"
  ON public.academic_toppers FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update academic toppers" ON public.academic_toppers;
CREATE POLICY "Admin staff can update academic toppers"
  ON public.academic_toppers FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete academic toppers" ON public.academic_toppers;
CREATE POLICY "Admin staff can delete academic toppers"
  ON public.academic_toppers FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 8. school_articles
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published articles" ON public.school_articles;
CREATE POLICY "Public can view published articles"
  ON public.school_articles FOR SELECT
  TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "Staff can view all articles" ON public.school_articles;
CREATE POLICY "Staff can view all articles"
  ON public.school_articles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert articles" ON public.school_articles;
CREATE POLICY "Admin staff can insert articles"
  ON public.school_articles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update articles" ON public.school_articles;
CREATE POLICY "Admin staff can update articles"
  ON public.school_articles FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete articles" ON public.school_articles;
CREATE POLICY "Admin staff can delete articles"
  ON public.school_articles FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 9. school_events
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published events" ON public.school_events;
CREATE POLICY "Public can view published events"
  ON public.school_events FOR SELECT
  TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "Staff can view all events" ON public.school_events;
CREATE POLICY "Staff can view all events"
  ON public.school_events FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert events" ON public.school_events;
CREATE POLICY "Admin staff can insert events"
  ON public.school_events FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update events" ON public.school_events;
CREATE POLICY "Admin staff can update events"
  ON public.school_events FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete events" ON public.school_events;
CREATE POLICY "Admin staff can delete events"
  ON public.school_events FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 10. school_circulars
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published circulars" ON public.school_circulars;
CREATE POLICY "Public can view published circulars"
  ON public.school_circulars FOR SELECT
  TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "Staff can view all circulars" ON public.school_circulars;
CREATE POLICY "Staff can view all circulars"
  ON public.school_circulars FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert circulars" ON public.school_circulars;
CREATE POLICY "Admin staff can insert circulars"
  ON public.school_circulars FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update circulars" ON public.school_circulars;
CREATE POLICY "Admin staff can update circulars"
  ON public.school_circulars FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete circulars" ON public.school_circulars;
CREATE POLICY "Admin staff can delete circulars"
  ON public.school_circulars FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());


-- --------------------------------------------------------------------
-- 11. gallery_images
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active gallery images" ON public.gallery_images;
CREATE POLICY "Public can view active gallery images"
  ON public.gallery_images FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Staff can view all gallery images" ON public.gallery_images;
CREATE POLICY "Staff can view all gallery images"
  ON public.gallery_images FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin staff can insert gallery images" ON public.gallery_images;
CREATE POLICY "Admin staff can insert gallery images"
  ON public.gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can update gallery images" ON public.gallery_images;
CREATE POLICY "Admin staff can update gallery images"
  ON public.gallery_images FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_super_admin())
  WITH CHECK (public.is_admin_or_super_admin());

DROP POLICY IF EXISTS "Admin staff can delete gallery images" ON public.gallery_images;
CREATE POLICY "Admin staff can delete gallery images"
  ON public.gallery_images FOR DELETE
  TO authenticated
  USING (public.is_admin_or_super_admin());
