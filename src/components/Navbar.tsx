import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';

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

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute = 'home',
  onNavigateRoute,
  onOpenAdmission,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', route: 'home' },
    {
      label: 'About',
      href: '/about',
      route: 'about',
      dropdown: [
        { title: 'Our Story', desc: '60 years of academic excellence since 1965', route: 'about', hashTarget: '#our-story' },
        { title: 'Vision & Mission', desc: 'Guiding principles and institutional commitments', route: 'about', hashTarget: '#vision-mission' },
        { title: 'Administration', desc: 'Governing body members & trust operations', route: 'administration' },
        { title: 'Leadership', desc: "Principal's message and school governance", route: 'about', hashTarget: '#leadership' },
        { title: 'Values', desc: 'The pillars of character and integrity we build', route: 'about', hashTarget: '#values' },
        { title: 'History', desc: 'Key milestones from 1965 to Diamond Jubilee', route: 'about', hashTarget: '#history' },
      ],
    },
    {
      label: 'Academics',
      href: '/academics',
      route: 'academics',
      dropdown: [
        { title: 'Curriculum', desc: 'Holistic learning framework for Grades VI to Class 10', route: 'academics', hashTarget: '#curriculum' },
        { title: 'Academic Stages', desc: 'Middle (Grades VI–VIII) & Secondary (Grades IX–X) wings', route: 'academics', hashTarget: '#stages' },
        { title: 'Teaching & Learning', desc: 'Our pedagogical philosophy and methodology', route: 'academics', hashTarget: '#pedagogy' },
        { title: 'Faculty & Mentors', desc: 'Experienced subject specialists and mentors', route: 'academics', hashTarget: '#faculty' },
      ],
    },
    {
      label: 'Campus',
      href: '/campus',
      route: 'campus',
      dropdown: [
        { title: 'Classrooms', desc: 'Smart 4K interactive digital learning studios', route: 'campus', hashTarget: '#classrooms' },
        { title: 'Laboratories', desc: 'Physics, Chemistry, Biology & Computer workstation suites', route: 'campus', hashTarget: '#laboratories' },
        { title: 'Library', desc: '25,000+ volumes, journals & digital research carrels', route: 'campus', hashTarget: '#library' },
        { title: 'Sports', desc: '400m track, cricket, football & martial arts complex', route: 'campus', hashTarget: '#sports' },
        { title: 'Transport', desc: 'GPS-monitored city-wide fleet with parent tracking', route: 'campus', hashTarget: '#transport' },
      ],
    },
    { label: 'Gallery', href: '/gallery', route: 'gallery' },
    { label: 'Alumni', href: '/alumni', route: 'alumni' },
    { label: 'Contact', href: '/contact', route: 'contact' },
  ];

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
            alt="A.M.A. Adinarayana Eng. Med. High School Crest"
            className="w-13 h-13 sm:w-14 sm:h-14 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
          />
          <div className="flex flex-col">
            <span className="font-crest text-lg sm:text-xl font-extrabold tracking-tight text-[#1b2213] group-hover:text-[#354024] transition-colors leading-tight">
              A.M.A. Adinarayana
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-slate-500 tracking-wide">
                English Medium High School
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-[11px] font-bold text-[#cfbb99] hidden sm:inline">
                Estd. 1965
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
            <span>APPLY FOR 2025–26</span>
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
                <span>Apply for Admission 2025–26</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
