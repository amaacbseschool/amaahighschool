import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';
import { useCmsShell } from '../context/CmsShellContext';

interface NavbarProps {
  currentRoute?: RouteType;
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission: () => void;
  onOpenSearch: () => void;
}

interface DropdownItem {
  title: string;
  desc: string;
  route?: RouteType;
  hashTarget?: string;
  href?: string;
  action?: () => void;
}

interface NavItem {
  label: string;
  route: RouteType;
  href: string;
  dropdown?: DropdownItem[];
}

const DROPDOWN_DESCRIPTIONS: Record<string, string> = {
  'Our Story': '60 years of academic excellence since 1965',
  'Vision & Mission': 'Guiding principles and institutional commitments',
  'Administration': 'Governing body members & trust operations',
  'Leadership': "Principal's message and school governance",
  'Values': 'The pillars of character and integrity we build',
  'History': 'Key milestones from 1965 to Diamond Jubilee',
  'Curriculum': 'Holistic learning framework for Grades VI to Class 10',
  'Academic Stages': 'Middle (Grades VI–VIII) & Secondary (Grades IX–X) wings',
  'Teaching & Learning': 'Our pedagogical philosophy and methodology',
  'Faculty & Mentors': 'Experienced subject specialists and mentors',
  'Classrooms': 'Smart 4K interactive digital learning studios',
  'Laboratories': 'Physics, Chemistry, Biology & Computer workstation suites',
  'Library': '25,000+ volumes, journals & digital research carrels',
  'Sports': '400m track, cricket, football & martial arts complex',
  'Transport': 'GPS-monitored city-wide fleet with parent tracking',
};

function parsePathToRoute(path: string): { route: RouteType; hashTarget?: string } {
  if (!path || path === '/') {
    return { route: 'home' };
  }
  const [cleanPath, hash] = path.split('#');
  const normalized = cleanPath.replace(/^\/+|\/+$/g, '').toLowerCase();

  let route: RouteType = 'home';
  switch (normalized) {
    case 'about':
      route = 'about';
      break;
    case 'academics':
      route = 'academics';
      break;
    case 'faculty':
      route = 'faculty';
      break;
    case 'campus':
    case 'facilities':
      route = 'campus';
      break;
    case 'student-life':
      route = 'student-life';
      break;
    case 'gallery':
      route = 'gallery';
      break;
    case 'achievements':
      route = 'achievements';
      break;
    case 'news-events':
      route = 'news-events';
      break;
    case 'alumni':
      route = 'alumni';
      break;
    case 'administration':
      route = 'administration';
      break;
    case 'admin':
      route = 'admin';
      break;
    case 'contact':
      route = 'contact';
      break;
    default:
      route = 'home';
  }
  return { route, hashTarget: hash ? `#${hash}` : undefined };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute = 'home',
  onNavigateRoute,
  onOpenAdmission,
  onOpenSearch,
}) => {
  const { getSetting, navigation } = useCmsShell();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const shortName = getSetting('site_short_name', 'A.M.A. Adinarayana');
  const brandSubtitle = getSetting('site_brand_subtitle', 'English Medium High School');
  const establishedYear = getSetting('site_established_year', '1965');
  const ctaText = getSetting('navbar_cta_text', 'APPLY FOR 2025–26');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = useMemo(() => {
    return navigation
      .filter((root) => root.is_visible)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((root) => {
        const { route } = parsePathToRoute(root.path);
        const hasChildren = root.children && root.children.length > 0;

        const dropdown: DropdownItem[] | undefined = hasChildren
          ? root.children!
              .filter((child) => child.is_visible)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((child) => {
                const { route: childRoute, hashTarget } = parsePathToRoute(child.path);
                return {
                  title: child.label,
                  desc: DROPDOWN_DESCRIPTIONS[child.label] || '',
                  route: childRoute,
                  hashTarget,
                  href: child.path,
                };
              })
          : undefined;

        return {
          label: root.label,
          href: root.path,
          route,
          dropdown: dropdown && dropdown.length > 0 ? dropdown : undefined,
        };
      });
  }, [navigation]);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-card border-b border-slate-200/90 py-2.5'
          : 'bg-white py-3.5 border-b border-slate-200'
      }`}
    >
      <div className="w-[90%] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <motion.a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateRoute('home');
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center gap-3.5 shrink-0 cursor-pointer group"
        >
          <img
            src={logoImg}
            alt={`${shortName} Crest`}
            className="w-13 h-13 sm:w-14 sm:h-14 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
          />
          <div className="flex flex-col">
            <span className="font-crest text-lg sm:text-xl font-extrabold tracking-tight text-[#1b2213] group-hover:text-[#354024] transition-colors leading-tight">
              {shortName}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-slate-500 tracking-wide">
                {brandSubtitle}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-[11px] font-bold text-[#cfbb99] hidden sm:inline">
                Estd. {establishedYear}
              </span>
            </div>
          </div>
        </motion.a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;

            return (
              <div
                key={item.label}
                className="relative py-2"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateRoute(item.route);
                  }}
                  className={`flex items-center gap-1 text-sm font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer py-2 px-3 rounded-xl relative ${
                    isActive
                      ? 'text-[#354024] font-bold bg-[#354024]/10'
                      : 'text-slate-700 hover:text-[#354024] hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.dropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180 text-[#354024]' : 'text-slate-400'
                      }`}
                    />
                  )}
                </a>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-80 bg-white shadow-2xl rounded-2xl border border-slate-200 p-2 z-50 overflow-hidden"
                    >
                      <div className="space-y-0.5">
                        {item.dropdown.map((subItem, idx) => (
                          <a
                            key={idx}
                            href={subItem.href || '#'}
                            onClick={(e) => {
                              e.preventDefault();
                              if (subItem.action) {
                                subItem.action();
                              } else if (subItem.route) {
                                onNavigateRoute(subItem.route, subItem.hashTarget);
                                setActiveDropdown(null);
                              }
                            }}
                            className="block p-3 rounded-xl hover:bg-[#354024]/5 transition-colors group/sub cursor-pointer"
                          >
                            <div className="text-xs font-bold text-[#1b2213] group-hover/sub:text-[#354024] flex items-center justify-between">
                              <span>{subItem.title}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#354024] opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-1 transition-all" />
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              {subItem.desc}
                            </p>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Action Buttons: Search & Primary Apply CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-[#354024] hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            title="Search Site"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAdmission}
            className="inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={onOpenAdmission}
            className="bg-[#354024] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span>Apply</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer border border-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden bg-white border-t border-slate-200 px-5 pt-4 pb-8 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto"
          >
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-slate-100 pb-2.5">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    onNavigateRoute(item.route);
                  }}
                  className={`block text-sm font-semibold py-1.5 cursor-pointer ${
                    currentRoute === item.route
                      ? 'text-[#354024] font-bold'
                      : 'text-slate-800'
                  }`}
                >
                  {item.label}
                </a>
                {item.dropdown && (
                  <div className="pl-3 mt-1.5 space-y-2">
                    {item.dropdown.map((sub, idx) => (
                      <a
                        key={idx}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          if (sub.action) {
                            sub.action();
                          } else if (sub.route) {
                            onNavigateRoute(sub.route, sub.hashTarget);
                          }
                        }}
                        className="block text-xs text-slate-600 hover:text-[#354024] py-0.5 cursor-pointer"
                      >
                        • {sub.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmission();
                }}
                className="w-full bg-[#354024] hover:bg-[#252d19] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
