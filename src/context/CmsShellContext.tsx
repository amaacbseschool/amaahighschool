import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { getPublicSiteSettingsMap, getPublicNavigationTree } from '../lib/cms';
import type { SiteSettingsMap, NavigationTreeItem } from '../types/cms';

// Audited default fallbacks matching verified production values
const DEFAULT_SITE_SETTINGS: Record<string, string | number> = {
  footer_copyright: '© 2026 AMAA High School. All Rights Reserved.',
  footer_description:
    'Illuminating young minds since 1965 with foundational moral values, academic rigor, scientific curiosity, and holistic development.',
  footer_developer_logo: '/assets/artech_logo.png',
  footer_developer_name: 'AR TECH studio',
  footer_developer_url: 'https://www.artechstudio.co.in',
  footer_newsletter_description:
    'Subscribe to our newsletter for latest notifications, examination circulars, and sports event updates.',
  footer_newsletter_title: 'NEWSLETTER',
  navbar_cta_text: 'APPLY FOR 2025–26',
  site_address: 'Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar',
  site_board_recognition: 'State Board Recognized High School (Grades VI to Class X)',
  site_brand_subtitle: 'English Medium High School',
  site_diamond_jubilee_text: 'Diamond Jubilee • 60 Years of Excellence',
  site_email: 'info@amaaschool.edu',
  site_email_admissions: 'admissions@amaaschool.edu',
  site_established_year: 1965,
  site_facebook: 'https://facebook.com',
  site_hours: 'Mon – Sat: 8:00 AM – 4:00 PM',
  site_instagram: 'https://instagram.com',
  site_linkedin: 'https://linkedin.com',
  site_logo: '/assets/logo.png',
  site_motto: 'Lead Kindly Light',
  site_name: 'A.M.A. Adinarayana English Medium High School',
  site_phone: '+91 75440 10044',
  site_phone_secondary: '+91 75440 10045',
  site_short_name: 'A.M.A. Adinarayana',
  site_youtube: 'https://youtube.com',
  topbar_admin_portal_label: 'Admin Portal',
  topbar_campus_desk_label: 'Campus Desk',
};

// Initial navigation tree fallback ensuring robust, instantaneous initial render
const DEFAULT_NAVIGATION_ITEMS: NavigationTreeItem[] = [
  { id: 'def-1', label: 'Home', path: '/', parent_id: null, sort_order: 1, is_visible: true, icon: null, target: '_self', children: [] },
  {
    id: 'def-2',
    label: 'About',
    path: '/about',
    parent_id: null,
    sort_order: 2,
    is_visible: true,
    icon: null,
    target: '_self',
    children: [
      { id: 'def-2-1', label: 'Our Story', path: '/about#our-story', parent_id: 'def-2', sort_order: 1, is_visible: true, icon: null, target: '_self' },
      { id: 'def-2-2', label: 'Vision & Mission', path: '/about#vision-mission', parent_id: 'def-2', sort_order: 2, is_visible: true, icon: null, target: '_self' },
      { id: 'def-2-3', label: 'Administration', path: '/administration', parent_id: 'def-2', sort_order: 3, is_visible: true, icon: null, target: '_self' },
      { id: 'def-2-4', label: 'Leadership', path: '/about#leadership', parent_id: 'def-2', sort_order: 4, is_visible: true, icon: null, target: '_self' },
      { id: 'def-2-5', label: 'Values', path: '/about#values', parent_id: 'def-2', sort_order: 5, is_visible: true, icon: null, target: '_self' },
      { id: 'def-2-6', label: 'History', path: '/about#history', parent_id: 'def-2', sort_order: 6, is_visible: true, icon: null, target: '_self' },
    ],
  },
  {
    id: 'def-3',
    label: 'Academics',
    path: '/academics',
    parent_id: null,
    sort_order: 3,
    is_visible: true,
    icon: null,
    target: '_self',
    children: [
      { id: 'def-3-1', label: 'Curriculum', path: '/academics#curriculum', parent_id: 'def-3', sort_order: 1, is_visible: true, icon: null, target: '_self' },
      { id: 'def-3-2', label: 'Academic Stages', path: '/academics#stages', parent_id: 'def-3', sort_order: 2, is_visible: true, icon: null, target: '_self' },
      { id: 'def-3-3', label: 'Teaching & Learning', path: '/academics#pedagogy', parent_id: 'def-3', sort_order: 3, is_visible: true, icon: null, target: '_self' },
      { id: 'def-3-4', label: 'Faculty & Mentors', path: '/academics#faculty', parent_id: 'def-3', sort_order: 4, is_visible: true, icon: null, target: '_self' },
    ],
  },
  {
    id: 'def-4',
    label: 'Campus',
    path: '/campus',
    parent_id: null,
    sort_order: 4,
    is_visible: true,
    icon: null,
    target: '_self',
    children: [
      { id: 'def-4-1', label: 'Classrooms', path: '/campus#classrooms', parent_id: 'def-4', sort_order: 1, is_visible: true, icon: null, target: '_self' },
      { id: 'def-4-2', label: 'Laboratories', path: '/campus#laboratories', parent_id: 'def-4', sort_order: 2, is_visible: true, icon: null, target: '_self' },
      { id: 'def-4-3', label: 'Library', path: '/campus#library', parent_id: 'def-4', sort_order: 3, is_visible: true, icon: null, target: '_self' },
      { id: 'def-4-4', label: 'Sports', path: '/campus#sports', parent_id: 'def-4', sort_order: 4, is_visible: true, icon: null, target: '_self' },
      { id: 'def-4-5', label: 'Transport', path: '/campus#transport', parent_id: 'def-4', sort_order: 5, is_visible: true, icon: null, target: '_self' },
    ],
  },
  { id: 'def-5', label: 'Gallery', path: '/gallery', parent_id: null, sort_order: 5, is_visible: true, icon: null, target: '_self', children: [] },
  { id: 'def-6', label: 'Alumni', path: '/alumni', parent_id: null, sort_order: 6, is_visible: true, icon: null, target: '_self', children: [] },
  { id: 'def-7', label: 'Contact', path: '/contact', parent_id: null, sort_order: 7, is_visible: true, icon: null, target: '_self', children: [] },
];

export interface CmsShellContextValue {
  settings: SiteSettingsMap;
  navigation: NavigationTreeItem[];
  loading: boolean;
  error: string | null;
  getSetting: (key: string, fallback?: string) => string;
}

const CmsShellContext = createContext<CmsShellContextValue | null>(null);

export interface CmsShellProviderProps {
  children: React.ReactNode;
}

export const CmsShellProvider: React.FC<CmsShellProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettingsMap>(() => ({ ...DEFAULT_SITE_SETTINGS }));
  const [navigation, setNavigation] = useState<NavigationTreeItem[]>(() => DEFAULT_NAVIGATION_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGlobalShellData() {
      try {
        const [fetchedSettings, fetchedNavigation] = await Promise.all([
          getPublicSiteSettingsMap(),
          getPublicNavigationTree(),
        ]);

        if (!isMounted) return;

        setSettings((prev) => ({
          ...prev,
          ...fetchedSettings,
        }));

        if (fetchedNavigation && fetchedNavigation.length > 0) {
          setNavigation(fetchedNavigation);
        }
        setError(null);
      } catch (err: unknown) {
        if (!isMounted) return;
        console.error('[CMS Shell] Error fetching global shell CMS data:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGlobalShellData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getSetting = useMemo(() => {
    return (key: string, fallback = ''): string => {
      const val = settings[key];
      if (val !== undefined && val !== null && val !== '') {
        return String(val);
      }
      const defaultVal = DEFAULT_SITE_SETTINGS[key];
      if (defaultVal !== undefined && defaultVal !== null) {
        return String(defaultVal);
      }
      return fallback;
    };
  }, [settings]);

  const value = useMemo<CmsShellContextValue>(
    () => ({
      settings,
      navigation,
      loading,
      error,
      getSetting,
    }),
    [settings, navigation, loading, error, getSetting]
  );

  return <CmsShellContext.Provider value={value}>{children}</CmsShellContext.Provider>;
};

export function useCmsShell(): CmsShellContextValue {
  const context = useContext(CmsShellContext);
  if (!context) {
    throw new Error('useCmsShell must be used within a CmsShellProvider');
  }
  return context;
}
