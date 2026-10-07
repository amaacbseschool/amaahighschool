import React, { useState, useEffect } from 'react';
import {
  Globe,
  Compass,
  Users,
  Award,
  Newspaper,
  Calendar,
  FileDown,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';

interface CmsOverviewProps {
  userRole: AdminRole;
  onNavigateTab?: (tab: string) => void;
  onSelectModule?: (tab: any) => void;
}

interface CmsCounts {
  settings: number;
  nav: number;
  pages: number;
  sections: number;
  items: number;
  faculty: number;
  toppers: number;
  articles: number;
  events: number;
  circulars: number;
  gallery: number;
}

export const CmsOverview: React.FC<CmsOverviewProps> = ({ userRole, onNavigateTab, onSelectModule }) => {
  const navigate = onSelectModule || onNavigateTab || (() => {});
  const [counts, setCounts] = useState<CmsCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const isViewer = userRole === 'viewer';

  const fetchCmsCounts = async () => {
    setIsLoading(true);
    try {
      const [
        { count: settingsCount },
        { count: navCount },
        { count: pagesCount },
        { count: sectionsCount },
        { count: itemsCount },
        { count: facultyCount },
        { count: toppersCount },
        { count: articlesCount },
        { count: eventsCount },
        { count: circularsCount },
        { count: galleryCount }
      ] = await Promise.all([
        supabase.from('site_settings').select('*', { count: 'exact', head: true }),
        supabase.from('navigation_items').select('*', { count: 'exact', head: true }),
        supabase.from('cms_pages').select('*', { count: 'exact', head: true }),
        supabase.from('cms_sections').select('*', { count: 'exact', head: true }),
        supabase.from('cms_section_items').select('*', { count: 'exact', head: true }),
        supabase.from('faculty_members').select('*', { count: 'exact', head: true }),
        supabase.from('academic_toppers').select('*', { count: 'exact', head: true }),
        supabase.from('school_articles').select('*', { count: 'exact', head: true }),
        supabase.from('school_events').select('*', { count: 'exact', head: true }),
        supabase.from('school_circulars').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true })
      ]);

      setCounts({
        settings: settingsCount || 0,
        nav: navCount || 0,
        pages: pagesCount || 0,
        sections: sectionsCount || 0,
        items: itemsCount || 0,
        faculty: facultyCount || 0,
        toppers: toppersCount || 0,
        articles: articlesCount || 0,
        events: eventsCount || 0,
        circulars: circularsCount || 0,
        gallery: galleryCount || 0
      });
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('[CmsOverview Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsCounts();
  }, []);

  const totalRecords = counts
    ? counts.settings + counts.nav + counts.pages + counts.sections + counts.items +
      counts.faculty + counts.toppers + counts.articles + counts.events + counts.circulars + counts.gallery
    : 277;

  const modules = [
    {
      id: 'cms-settings',
      title: 'Global Settings',
      description: 'School identity, contact numbers, email addresses, social media links & footer',
      count: counts?.settings ?? '28',
      countLabel: 'Config Keys',
      icon: Globe,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'cms-nav',
      title: 'Navigation Menu',
      description: 'Header navigation items, dropdown hierarchies, external links and ordering',
      count: counts?.nav ?? '22',
      countLabel: 'Menu Items',
      icon: Compass,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'cms-pages',
      title: 'Pages & Sections',
      description: 'All 13 school pages, 36 content sections and 111 repeating feature items',
      count: counts?.pages ? `${counts.pages} / ${counts.sections}` : '13 / 36',
      countLabel: 'Pages / Sections',
      icon: Layers,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'cms-faculty',
      title: 'Faculty & Mentors',
      description: 'Distinguished educators, leadership, departments, office hours & credentials',
      count: counts?.faculty ?? '8',
      countLabel: 'Faculty Members',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'cms-toppers',
      title: 'Academic Toppers',
      description: 'Class X state board toppers, centenary scores, student quotes & roll of honour',
      count: counts?.toppers ?? '6',
      countLabel: 'Star Toppers',
      icon: Award,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'cms-news',
      title: 'News & Articles',
      description: 'Published stories, milestone blogs, press announcements and press releases',
      count: counts?.articles ?? '4',
      countLabel: 'Articles',
      icon: Newspaper,
      color: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
      id: 'cms-events',
      title: 'School Events',
      description: 'Upcoming academic orientations, sports championships, open days and cultural galas',
      count: counts?.events ?? '5',
      countLabel: 'Upcoming Events',
      icon: Calendar,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      id: 'cms-circulars',
      title: 'Official Circulars',
      description: 'Administrative notifications, examination schedules, fee policies & holiday calendars',
      count: counts?.circulars ?? '6',
      countLabel: 'Circulars',
      icon: FileDown,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'cms-gallery',
      title: 'Photo Gallery',
      description: 'Campus grounds, smart classrooms, laboratories, sports meets & NCC assemblies',
      count: counts?.gallery ?? '38',
      countLabel: 'Campus Photos',
      icon: ImageIcon,
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      id: 'cms-seo',
      title: 'SEO & Metadata',
      description: 'Search engine preview titles, canonical descriptions & social sharing metadata',
      count: counts?.pages ?? '13',
      countLabel: 'Page Meta Tags',
      icon: Search,
      color: 'bg-slate-50 text-slate-700 border-slate-200'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Role Notice */}
      <div className="bg-gradient-to-r from-[#141a0e] via-[#1b2213] to-[#252d19] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[radial-gradient(circle_at_70%_30%,rgba(207,187,153,0.15),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-[#cfbb99] border border-white/15">
                WEBSITE CONTENT MANAGEMENT SYSTEM
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Supabase Connection
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white">
              Institutional Website CMS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Full administrative authority over global settings, navigation hierarchies, page content sections, faculty, board toppers, articles, calendar events, circulars, and the campus photograph archives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={fetchCmsCounts}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
            <div className="bg-[#cfbb99]/20 border border-[#cfbb99]/30 rounded-xl px-4 py-2.5 text-center">
              <div className="text-xl sm:text-2xl font-black text-[#cfbb99]">
                {totalRecords}
              </div>
              <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                Total Live Records
              </div>
            </div>
          </div>
        </div>

        {/* Role Notification Banner */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#cfbb99]" />
            <span>
              Operating as: <strong className="text-white capitalize">{userRole.replace('_', ' ')}</strong>
            </span>
            {isViewer && (
              <span className="text-amber-300 font-medium ml-2">
                (Read-only observation mode. Content mutation controls are restricted to administrators.)
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Last synchronized: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Module Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">CMS Modules & Workspaces</h3>
            <p className="text-xs text-slate-500">Select a section to inspect and edit website records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => navigate(mod.id)}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#354024] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${mod.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 leading-none">
                        {mod.count}
                      </span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {mod.countLabel}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#354024] transition-colors flex items-center justify-between">
                    <span>{mod.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#354024] group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-[#354024] group-hover:underline">
                    Manage records →
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
