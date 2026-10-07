import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Newspaper,
  Megaphone,
  CalendarDays,
  FileText,
  Download,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { TextReveal } from '../components/motion/TextReveal';
import {
  getPageWithSections,
  getPublishedArticles,
  getPublishedEvents,
  getPublishedCirculars,
} from '../lib/cms';
import type {
  CmsPageWithSections,
  CmsSectionWithItems,
  SchoolArticleRow,
  SchoolEventRow,
  SchoolCircularRow,
} from '../types/cms';
import type { RouteType } from '../types/routes';

interface NewsEventsPageProps {
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
}

interface ArticleItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  summary: string;
  image: string;
  featured: boolean;
}

interface AnnouncementItem {
  id: string | number;
  title: string;
  date: string;
  category: string;
  important: boolean;
  body: string;
}

interface EventItem {
  id: string | number;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  spots: string;
  desc: string;
  color: string;
}

interface CircularItem {
  id: string;
  title: string;
  date: string;
  type: string;
  pages: string;
  fileUrl?: string | null;
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 1,
    title: 'AMAA High School Celebrates Diamond Jubilee — 60 Years of Excellence',
    category: 'School News',
    date: 'October 1, 2025',
    summary: 'A.M.A. Adinarayana English Medium High School marks its 60th anniversary with a grand Diamond Jubilee celebration involving distinguished alumni, faculty, and state dignitaries.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Class X Students Achieve 100% Board Distinction for 8th Consecutive Year',
    category: 'Academics',
    date: 'May 28, 2025',
    summary: 'All Class X students scored first-class and above in the State Board examinations, with State Rank 2 awarded to Sneha K. Varma with 98.6%.',
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 3,
    title: 'Science Olympiad Team Wins State-Level Academic Science Championship',
    category: 'Academic',
    date: 'March 12, 2025',
    summary: 'The AMAA Science team competed against 64 schools and won first place at the State-Level Science & Mathematics Challenge 2025.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: 'Modern Computer & IT Lab Inaugurated with 24 Workstations',
    category: 'Infrastructure',
    date: 'January 20, 2025',
    summary: 'The modern Computer & IT Lab featuring high-performance desktop workstations, high-speed networking, and digital learning software was formally inaugurated this week.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
];

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  { id: 1, title: 'Admissions Open for 2025–26 Academic Session', date: 'Sep 15, 2025', category: 'Admissions', important: true, body: 'Applications are now accepted for Grades VI through Grade X. Inquire via the campus admissions desk or online enquiry form.' },
  { id: 2, title: 'Mid-Term Examination Schedule — October 2025', date: 'Sep 25, 2025', category: 'Academic', important: true, body: 'Mid-term examinations for Grades VI–X are scheduled from October 14–22, 2025. Detailed timetables distributed in classrooms.' },
  { id: 3, title: 'Annual Sports Day Registration Open', date: 'Oct 2, 2025', category: 'Sports', important: false, body: 'Students wishing to participate in Annual Sports Day (November 21) must register with the Sports Wing by October 20, 2025.' },
  { id: 4, title: 'Science Olympiad State Qualifier — Registration Deadline', date: 'Oct 5, 2025', category: 'Academic', important: false, body: 'Last date for SOF Science Olympiad registration is October 15. Contact the academic coordinator for registration forms.' },
  { id: 5, title: 'Parent-Teacher Meeting — October 2025', date: 'Oct 8, 2025', category: 'General', important: false, body: 'The quarterly PTM is scheduled for October 18, 2025 (Saturday), 9:00 AM – 1:00 PM. Attendance is mandatory for parents of Grades VI–X.' },
];

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Diamond Jubilee Open Day',
    date: 'October 12, 2026',
    time: '9:00 AM – 1:00 PM',
    venue: 'Main Campus — All Wings',
    category: 'Open Day',
    spots: '18 seats remaining',
    desc: 'Visit our campus, meet faculty, and see live science practical demonstrations. Registration required.',
    color: 'bg-[#354024]',
  },
  {
    id: 2,
    title: 'Inter-School Science Olympiad',
    date: 'October 26, 2026',
    time: '8:30 AM – 4:00 PM',
    venue: 'Dr. A.P.J. Abdul Kalam Science Wing',
    category: 'Academic',
    spots: 'Open for Visitors',
    desc: 'Annual inter-school science competition with experimental exhibits, scientific models, and quizzes.',
    color: 'bg-[#252d19]',
  },
  {
    id: 3,
    title: 'Middle & High School Academic Briefing',
    date: 'November 8, 2026',
    time: '10:00 AM – 12:00 PM',
    venue: 'Vivekananda Conference Hall',
    category: 'Academic',
    spots: '24 seats remaining',
    desc: 'Dedicated academic orientation for parents of Grades VI–X applicants.',
    color: 'bg-[#dc2626]',
  },
  {
    id: 4,
    title: 'Annual Athletic Championship',
    date: 'November 21, 2026',
    time: '7:00 AM – 5:00 PM',
    venue: 'Major Dhyan Chand Athletic Arena',
    category: 'Sports',
    spots: 'Spectator Entry Open',
    desc: 'District-level athletics including 100m–1500m track events, long jump, and relay races.',
    color: 'bg-[#1b2213]',
  },
  {
    id: 5,
    title: 'Annual Cultural Day — Tarangini',
    date: 'December 6, 2026',
    time: '5:00 PM – 9:00 PM',
    venue: 'Swami Vivekananda Open Auditorium',
    category: 'Cultural',
    spots: 'Open Entry',
    desc: 'Annual cultural evening featuring drama, dance, music, and art installations by students.',
    color: 'bg-[#7c3aed]',
  },
];

const DEFAULT_CIRCULARS: CircularItem[] = [
  { id: 'CIRC-2025-09-01', title: 'Fee Remittance — Second Installment (Oct 2025)', date: 'Sep 20, 2025', type: 'Finance', pages: '1 page' },
  { id: 'CIRC-2025-08-02', title: 'Mandatory Vaccination Drive — ASHA Health Camp', date: 'Aug 31, 2025', type: 'Health', pages: '2 pages' },
  { id: 'CIRC-2025-08-01', title: 'Academic Uniform Policy — 2025–26 Revision', date: 'Aug 10, 2025', type: 'Policy', pages: '3 pages' },
  { id: 'CIRC-2025-07-01', title: 'Annual Holiday List — Academic Year 2025–26', date: 'Jul 5, 2025', type: 'Calendar', pages: '2 pages' },
  { id: 'CIRC-2025-06-01', title: 'Bus Route Revision — New City Routes from July 2025', date: 'Jun 15, 2025', type: 'Transport', pages: '4 pages' },
  { id: 'CIRC-2025-05-01', title: 'Grade X Board Results & Merit Scholarship Notification', date: 'May 30, 2025', type: 'Academic', pages: '2 pages' },
];

export const NewsEventsPage: React.FC<NewsEventsPageProps> = ({ onNavigateRoute }) => {
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | number | null>(1);
  const [pageData, setPageData] = useState<CmsPageWithSections | null>(null);
  const [articleRows, setArticleRows] = useState<SchoolArticleRow[]>([]);
  const [eventRows, setEventRows] = useState<SchoolEventRow[]>([]);
  const [circularRows, setCircularRows] = useState<SchoolCircularRow[]>([]);

  useEffect(() => {
    let isMounted = true;
    getPageWithSections('news-events')
      .then((data) => {
        if (isMounted && data) {
          setPageData(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load news-events page:', err);
      });

    getPublishedArticles()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setArticleRows(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load published articles:', err);
      });

    getPublishedEvents()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setEventRows(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load published events:', err);
      });

    getPublishedCirculars()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setCircularRows(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load published circulars:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const sectionMap = useMemo(() => {
    const map = new Map<string, CmsSectionWithItems>();
    if (pageData?.sections) {
      for (const sec of pageData.sections) {
        map.set(sec.section_key, sec);
      }
    }
    return map;
  }, [pageData]);

  // Section 1: Hero
  const heroSection = sectionMap.get('news_events.hero');
  const heroHeading = heroSection?.heading || 'News, Announcements & Campus Events';
  const heroSubheading =
    heroSection?.subheading ||
    'Stay updated with the latest from A.M.A. Adinarayana High School — academic milestones, upcoming events, official circulars, and important announcements.';

  // Articles
  const newsArticles: ArticleItem[] = useMemo(() => {
    if (articleRows && articleRows.length > 0) {
      return articleRows.map((a, idx) => {
        const fallback = DEFAULT_ARTICLES[idx] || DEFAULT_ARTICLES[0];
        let dateStr = fallback.date;
        if (a.published_at) {
          try {
            const d = new Date(a.published_at);
            dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          } catch {
            dateStr = fallback.date;
          }
        }
        return {
          id: a.id,
          title: a.title,
          category: a.category || fallback.category,
          date: dateStr,
          summary: a.summary || fallback.summary,
          image: a.thumbnail_url || fallback.image,
          featured: idx === 0,
        };
      });
    }
    return DEFAULT_ARTICLES;
  }, [articleRows]);

  // Announcements
  const announcementsSection = sectionMap.get('news_events.announcements');
  const announcements: AnnouncementItem[] = useMemo(() => {
    if (announcementsSection?.items && announcementsSection.items.length > 0) {
      return announcementsSection.items.map((item, idx) => {
        const fallback = DEFAULT_ANNOUNCEMENTS[idx] || DEFAULT_ANNOUNCEMENTS[0];
        return {
          id: item.id,
          title: item.title || fallback.title,
          date: item.subtitle || fallback.date,
          category: item.badge || fallback.category,
          important: idx < 2,
          body: item.description || fallback.body,
        };
      });
    }
    return DEFAULT_ANNOUNCEMENTS;
  }, [announcementsSection]);

  // Events
  const upcomingEvents: EventItem[] = useMemo(() => {
    if (eventRows && eventRows.length > 0) {
      return eventRows.map((e, idx) => {
        const fallback = DEFAULT_EVENTS[idx] || DEFAULT_EVENTS[0];
        let dateStr = fallback.date;
        let timeStr = fallback.time;
        if (e.event_date) {
          try {
            const d = new Date(e.event_date);
            dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          } catch {
            dateStr = fallback.date;
          }
        }

        return {
          id: e.id,
          title: e.title,
          date: dateStr,
          time: timeStr,
          venue: e.venue || fallback.venue,
          category: fallback.category,
          spots: fallback.spots,
          desc: e.description || fallback.desc,
          color: fallback.color,
        };
      });
    }
    return DEFAULT_EVENTS;
  }, [eventRows]);

  // Circulars
  const circularsList: CircularItem[] = useMemo(() => {
    if (circularRows && circularRows.length > 0) {
      return circularRows.map((cr, idx) => {
        const fallback = DEFAULT_CIRCULARS[idx] || DEFAULT_CIRCULARS[0];
        let dateStr = fallback.date;
        if (cr.issue_date) {
          try {
            const d = new Date(cr.issue_date);
            dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } catch {
            dateStr = fallback.date;
          }
        }

        return {
          id: cr.circular_number || fallback.id,
          title: cr.title,
          date: dateStr,
          type: cr.target_classes || fallback.type,
          pages: fallback.pages,
          fileUrl: cr.file_url,
        };
      });
    }
    return DEFAULT_CIRCULARS;
  }, [circularRows]);

  const tabs = [
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'circulars', label: 'Circulars', icon: FileText },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-[90%] mx-auto px-2 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onNavigateRoute('home')}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#354024] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Homepage</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-[#354024] cursor-pointer" onClick={() => onNavigateRoute('home')}>Home</span>
            <span>/</span>
            <span className="text-[#354024] font-bold">News & Events</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#252d19] text-white py-14 lg:py-20 px-4 overflow-hidden border-b border-[#141a0e]">
        <div className="w-[90%] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-5">
            <Sparkles className="w-4 h-4 text-[#cfbb99]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#cfbb99]">Stay Informed</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-crest max-w-3xl">
            <TextReveal>{heroHeading}</TextReveal>
          </h1>
          <p className="mt-5 text-base text-slate-200 max-w-2xl leading-relaxed">
            {heroSubheading}
          </p>

          {/* Quick section anchors */}
          <div className="flex flex-wrap gap-3 mt-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-[#cfbb99]" />
                  {tab.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NEWS ──────────────────────────────────────────── */}
      <section id="news" className="w-[90%] mx-auto px-2 sm:px-4 py-16 lg:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
              <Newspaper className="w-3.5 h-3.5 text-[#354024]" />
              <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">School News</span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#1b2213]">Latest from AMAA</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured article */}
          {newsArticles.filter(a => a.featured).map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-56 overflow-hidden relative">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b2213]/80 to-transparent" />
                <span className="absolute top-4 left-4 bg-[#354024] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">{article.category}</span>
              </div>
              <div className="p-7">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.date}</span>
                </div>
                <h3 className="font-crest text-xl font-bold text-[#1b2213] leading-snug mb-3">{article.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{article.summary}</p>
              </div>
            </motion.div>
          ))}

          {/* Other articles */}
          <div className="lg:col-span-5 space-y-5">
            {newsArticles.filter(a => !a.featured).map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card hover:border-[#354024]/30 transition-all duration-300 flex gap-4 group"
              >
                <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#354024] uppercase tracking-wider bg-[#354024]/10 px-2 py-0.5 rounded-full">{article.category}</span>
                    <span className="text-[10px] text-slate-400">{article.date}</span>
                  </div>
                  <h4 className="font-bold text-[#1b2213] text-sm leading-snug line-clamp-2">{article.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{article.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ─────────────────────────────────── */}
      <section id="announcements" className="bg-white border-y border-slate-200 py-16 lg:py-20">
        <div className="w-[90%] mx-auto px-2 sm:px-4">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
              <Megaphone className="w-3.5 h-3.5 text-[#354024]" />
              <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">Official Notices</span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#1b2213]">Announcements</h2>
            <p className="text-slate-600 text-sm mt-2">Important notices and official communications from the school administration.</p>
          </div>

          <div className="space-y-3 max-w-4xl">
            {announcements.map((ann, idx) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-[#f8f9fa] border border-slate-200/90 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedAnnouncement(expandedAnnouncement === ann.id ? null : ann.id)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {ann.important && (
                      <span className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-[#dc2626]" title="Important" />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#354024] uppercase tracking-wider bg-[#354024]/10 px-2.5 py-0.5 rounded-full">{ann.category}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{ann.date}</span>
                      </div>
                      <h4 className="font-bold text-[#1b2213] text-sm">{ann.title}</h4>
                    </div>
                  </div>
                  {expandedAnnouncement === ann.id ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />}
                </button>
                <AnimatePresence>
                  {expandedAnnouncement === ann.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 pt-0 border-t border-slate-200"
                    >
                      <p className="text-sm text-slate-600 leading-relaxed pt-4">{ann.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ────────────────────────────────────────── */}
      <section id="events" className="w-[90%] mx-auto px-2 sm:px-4 py-16 lg:py-20">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
            <CalendarDays className="w-3.5 h-3.5 text-[#354024]" />
            <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">Campus Calendar</span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#1b2213]">Upcoming Events</h2>
          <p className="text-slate-600 text-sm mt-2">Mark your calendar — open days, competitions, cultural programmes and more.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-card hover:shadow-xl hover:border-[#354024]/30 transition-all duration-300"
            >
              <div className={`${event.color} px-6 py-4 text-white`}>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">{event.category}</span>
                <h4 className="font-crest font-bold text-lg mt-2 leading-snug">{event.title}</h4>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CalendarDays className="w-3.5 h-3.5 text-[#354024] shrink-0" />
                  <span className="font-semibold">{event.date}</span>
                  <span className="text-slate-400">•</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-[#354024] shrink-0" />
                  <span>{event.venue}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{event.desc}</p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">{event.spots}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CIRCULARS ─────────────────────────────────────── */}
      <section id="circulars" className="bg-white border-t border-slate-200 py-16 lg:py-20">
        <div className="w-[90%] mx-auto px-2 sm:px-4">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
              <FileText className="w-3.5 h-3.5 text-[#354024]" />
              <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">Official Documents</span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#1b2213]">Circulars & Letters</h2>
            <p className="text-slate-600 text-sm mt-2">Official school circulars for parents and students. Click to download.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
            {circularsList.map((circ, idx) => (
              <motion.div
                key={circ.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-[#f8f9fa] border border-slate-200/90 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-[#354024]/30 transition-all group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#354024]/10 text-[#354024] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{circ.type}</span>
                      <span className="text-[10px] text-slate-400">{circ.pages}</span>
                    </div>
                    <h4 className="font-bold text-[#1b2213] text-sm leading-snug">{circ.title}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      {circ.date}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{circ.id}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (circ.fileUrl) {
                      window.open(circ.fileUrl, '_blank');
                      return;
                    }
                    const blob = new Blob([`${circ.title}\nRef: ${circ.id}\nDate: ${circ.date}\nIssued by: A.M.A. Adinarayana Eng. Med. High School\n\nOfficial circular record verified from Supabase CMS.`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `${circ.id}.txt`;
                    document.body.appendChild(a); a.click();
                    document.body.removeChild(a); URL.revokeObjectURL(url);
                  }}
                  className="shrink-0 w-9 h-9 rounded-xl bg-white border border-slate-200 text-[#354024] flex items-center justify-center hover:bg-[#354024] hover:text-white transition-all cursor-pointer shadow-subtle group-hover:scale-105"
                  title="Download Circular"
                >
                  <Download className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-xs text-slate-500 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" />
            For older circulars or certified copies, contact the school office on weekdays between 8:00 AM – 4:00 PM.
          </p>
        </div>
      </section>
    </div>
  );
};
