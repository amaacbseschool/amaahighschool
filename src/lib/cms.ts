// ====================================================================
// AMAA HIGH SCHOOL — PUBLIC CMS DATA ACCESS LAYER (Phase 7 Step 1)
// ====================================================================
// Read-only queries interfacing directly with Supabase CMS tables.
// Strictly enforces public visibility and active/published constraints.
// ====================================================================

import { supabase } from './supabase';
import type {
  SiteSettingRow,
  SiteSettingsMap,
  NavigationItemRow,
  NavigationTreeItem,
  CmsPageRow,
  CmsSectionRow,
  CmsSectionItemRow,
  CmsPageWithSections,
  CmsSectionWithItems,
  FacultyMemberRow,
  AcademicTopperRow,
  SchoolArticleRow,
  SchoolEventRow,
  SchoolCircularRow,
  GalleryImageRow,
} from '../types/cms';

// --------------------------------------------------------------------
// 1. SITE SETTINGS
// --------------------------------------------------------------------

/**
 * Fetches all public site settings (site_settings.is_public = true).
 */
export async function getPublicSiteSettings(): Promise<SiteSettingRow[]> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('is_public', true)
      .order('key', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch public site settings:', err);
    throw new Error(`Unable to load site settings: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Fetches all public site settings and maps them into a key-value dictionary.
 */
export async function getPublicSiteSettingsMap(): Promise<SiteSettingsMap> {
  const settings = await getPublicSiteSettings();
  const map: SiteSettingsMap = {};
  for (const item of settings) {
    map[item.key] = item.value;
  }
  return map;
}

// --------------------------------------------------------------------
// 2. NAVIGATION
// --------------------------------------------------------------------

/**
 * Fetches all visible navigation items (navigation_items.is_visible = true).
 */
export async function getPublicNavigation(): Promise<NavigationItemRow[]> {
  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch public navigation items:', err);
    throw new Error(`Unable to load navigation items: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Fetches public navigation and organizes it into a root-parent hierarchical tree.
 */
export async function getPublicNavigationTree(): Promise<NavigationTreeItem[]> {
  const items = await getPublicNavigation();
  const rootItems: NavigationTreeItem[] = [];
  const childMap = new Map<string, NavigationTreeItem[]>();

  for (const item of items) {
    if (!item.parent_id) {
      rootItems.push({ ...item, children: [] });
    } else {
      const list = childMap.get(item.parent_id) || [];
      list.push(item);
      childMap.set(item.parent_id, list);
    }
  }

  for (const root of rootItems) {
    root.children = childMap.get(root.id) || [];
  }

  return rootItems;
}

// --------------------------------------------------------------------
// 3. PAGES
// --------------------------------------------------------------------

/**
 * Fetches all published pages (cms_pages.is_published = true).
 */
export async function getPublishedPages(): Promise<CmsPageRow[]> {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('is_published', true)
      .order('title', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch published pages:', err);
    throw new Error(`Unable to load published pages: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Fetches a single published page by slug (cms_pages.slug = slug AND is_published = true).
 */
export async function getPublishedPageBySlug(slug: string): Promise<CmsPageRow | null> {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[CMS] Failed to fetch published page by slug "${slug}":`, err);
    throw new Error(`Unable to load page "${slug}": ${err instanceof Error ? err.message : String(err)}`);
  }
}

// --------------------------------------------------------------------
// 4. SECTIONS & SECTION ITEMS
// --------------------------------------------------------------------

/**
 * Fetches all visible sections for a page (cms_sections.page_id = pageId AND is_visible = true).
 */
export async function getVisibleSections(pageId: string): Promise<CmsSectionRow[]> {
  try {
    const { data, error } = await supabase
      .from('cms_sections')
      .select('*')
      .eq('page_id', pageId)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error(`[CMS] Failed to fetch visible sections for pageId "${pageId}":`, err);
    throw new Error(`Unable to load sections: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Fetches all visible repeating items for a section (cms_section_items.section_id = sectionId AND is_visible = true).
 */
export async function getVisibleSectionItems(sectionId: string): Promise<CmsSectionItemRow[]> {
  try {
    const { data, error } = await supabase
      .from('cms_section_items')
      .select('*')
      .eq('section_id', sectionId)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error(`[CMS] Failed to fetch visible section items for sectionId "${sectionId}":`, err);
    throw new Error(`Unable to load section items: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Composite function: Fetches a published page along with all its visible sections and child items.
 */
export async function getPageWithSections(slug: string): Promise<CmsPageWithSections | null> {
  const page = await getPublishedPageBySlug(slug);
  if (!page) {
    return null;
  }

  const sections = await getVisibleSections(page.id);
  if (sections.length === 0) {
    return { ...page, sections: [] };
  }

  const sectionIds = sections.map((s) => s.id);
  try {
    const { data: allItems, error } = await supabase
      .from('cms_section_items')
      .select('*')
      .in('section_id', sectionIds)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    const itemsBySection = new Map<string, CmsSectionItemRow[]>();
    for (const item of allItems || []) {
      const list = itemsBySection.get(item.section_id) || [];
      list.push(item);
      itemsBySection.set(item.section_id, list);
    }

    const sectionsWithItems: CmsSectionWithItems[] = sections.map((sec) => ({
      ...sec,
      items: itemsBySection.get(sec.id) || [],
    }));

    return {
      ...page,
      sections: sectionsWithItems,
    };
  } catch (err) {
    console.error(`[CMS] Failed to fetch items for page sections ("${slug}"):`, err);
    throw new Error(`Unable to load full page content: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// --------------------------------------------------------------------
// 5. FACULTY MEMBERS
// --------------------------------------------------------------------

/**
 * Fetches all active faculty members (faculty_members.is_active = true).
 */
export async function getActiveFaculty(): Promise<FacultyMemberRow[]> {
  try {
    const { data, error } = await supabase
      .from('faculty_members')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch active faculty members:', err);
    throw new Error(`Unable to load faculty members: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// --------------------------------------------------------------------
// 6. ACADEMIC TOPPERS
// --------------------------------------------------------------------

/**
 * Fetches all active academic toppers (academic_toppers.is_active = true).
 */
export async function getActiveToppers(): Promise<AcademicTopperRow[]> {
  try {
    const { data, error } = await supabase
      .from('academic_toppers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch active toppers:', err);
    throw new Error(`Unable to load academic toppers: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// --------------------------------------------------------------------
// 7. SCHOOL ARTICLES / NEWS
// --------------------------------------------------------------------

/**
 * Fetches all published school articles (school_articles.is_published = true).
 */
export async function getPublishedArticles(): Promise<SchoolArticleRow[]> {
  try {
    const { data, error } = await supabase
      .from('school_articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch published articles:', err);
    throw new Error(`Unable to load school articles: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Fetches a single published article by slug (school_articles.slug = slug AND is_published = true).
 */
export async function getPublishedArticleBySlug(slug: string): Promise<SchoolArticleRow | null> {
  try {
    const { data, error } = await supabase
      .from('school_articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[CMS] Failed to fetch article by slug "${slug}":`, err);
    throw new Error(`Unable to load article "${slug}": ${err instanceof Error ? err.message : String(err)}`);
  }
}

// --------------------------------------------------------------------
// 8. SCHOOL EVENTS
// --------------------------------------------------------------------

/**
 * Fetches all published school events (school_events.is_published = true).
 */
export async function getPublishedEvents(): Promise<SchoolEventRow[]> {
  try {
    const { data, error } = await supabase
      .from('school_events')
      .select('*')
      .eq('is_published', true)
      .order('event_date', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch published events:', err);
    throw new Error(`Unable to load school events: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// --------------------------------------------------------------------
// 9. SCHOOL CIRCULARS
// --------------------------------------------------------------------

/**
 * Fetches all published school circulars (school_circulars.is_published = true).
 */
export async function getPublishedCirculars(): Promise<SchoolCircularRow[]> {
  try {
    const { data, error } = await supabase
      .from('school_circulars')
      .select('*')
      .eq('is_published', true)
      .order('issue_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch published circulars:', err);
    throw new Error(`Unable to load circulars: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// --------------------------------------------------------------------
// 10. GALLERY IMAGES
// --------------------------------------------------------------------

/**
 * Fetches all active gallery images (gallery_images.is_active = true), optionally filtered by category.
 */
export async function getActiveGalleryImages(category?: string): Promise<GalleryImageRow[]> {
  try {
    let query = supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('[CMS] Failed to fetch active gallery images:', err);
    throw new Error(`Unable to load gallery images: ${err instanceof Error ? err.message : String(err)}`);
  }
}
