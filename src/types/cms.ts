// ====================================================================
// AMAA HIGH SCHOOL — CMS TYPE DEFINITIONS (Phase 6 Architecture)
// ====================================================================

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface SiteSettingRow {
  id: string;
  key: string;
  value: JsonValue;
  description: string | null;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NavigationItemRow {
  id: string;
  label: string;
  path: string;
  parent_id: string | null;
  sort_order: number;
  is_visible: boolean;
  icon: string | null;
  target: string;
  created_at?: string;
  updated_at?: string;
}

export interface CmsPageRow {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CmsSectionRow {
  id: string;
  page_id: string;
  section_key: string;
  section_type: string;
  eyebrow: string | null;
  heading: string | null;
  subheading: string | null;
  content_html: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  secondary_cta_text: string | null;
  secondary_cta_url: string | null;
  badge: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CmsSectionItemRow {
  id: string;
  section_id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  content: string | null;
  image_url: string | null;
  badge: string | null;
  icon_name: string | null;
  link_url: string | null;
  link_text: string | null;
  metadata: Record<string, JsonValue>;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FacultyMemberRow {
  id: string;
  name: string;
  designation: string | null;
  department: string | null;
  qualification: string | null;
  experience: string | null;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  office_hours: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicTopperRow {
  id: string;
  student_name: string;
  academic_year: string | null;
  class_level: string | null;
  score: string | null;
  rank_badge: string | null;
  quote: string | null;
  photo_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolArticleRow {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  body: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolEventRow {
  id: string;
  title: string;
  event_date: string;
  end_date: string | null;
  venue: string | null;
  audience: string | null;
  description: string | null;
  action_text: string | null;
  action_url: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolCircularRow {
  id: string;
  circular_number: string | null;
  title: string;
  issue_date: string | null;
  target_classes: string | null;
  file_url: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImageRow {
  id: string;
  title: string;
  category: string | null;
  image_url: string;
  caption: string | null;
  year: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// --------------------------------------------------------------------
// Composite & Hierarchical Helper Types
// --------------------------------------------------------------------

export interface NavigationTreeItem extends NavigationItemRow {
  children?: NavigationTreeItem[];
}

export interface CmsSectionWithItems extends CmsSectionRow {
  items: CmsSectionItemRow[];
}

export interface CmsPageWithSections extends CmsPageRow {
  sections: CmsSectionWithItems[];
}

export type SiteSettingsMap = Record<string, JsonValue>;

