import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Menu, X, GraduationCap, PhoneCall } from 'lucide-react';

interface NavbarProps {
  onOpenAdmission: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmission, onOpenSearch }) => {
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

  const navItems = [
    { label: 'HOME', href: '#' },
    { label: 'ABOUT US', href: '#about' },
    {
      label: 'ACADEMICS',
      href: '#academics',
      dropdown: [
        { title: 'CBSE Curriculum', desc: 'Holistic curriculum from Nursery to Class XII', href: '#academics' },
        { title: 'Faculty & Mentors', desc: 'Highly qualified and dedicated educators', href: '#academics' },
        { title: 'Pedagogy & Labs', desc: 'Experiential learning & innovation labs', href: '#facilities' },
        { title: 'Academic Calendar', desc: 'Examinations, olympiads and sessions', href: '#notices' },
      ],
    },
    {
      label: 'FACILITIES',
      href: '#facilities',
      dropdown: [
        { title: 'Smart Classrooms', desc: 'Digital audio-visual interactive boards', href: '#facilities' },
        { title: 'Science Laboratories', desc: 'Physics, Chemistry, Biology & Robotics', href: '#facilities' },
        { title: 'Library & Resource Hub', desc: 'Rich collection of books & e-learning', href: '#facilities' },
        { title: 'GPS Fleet Transport', desc: 'Safe, tracked buses covering all city routes', href: '#facilities' },
      ],
    },
    {
      label: 'ADMISSIONS',
      href: '#admission-info',
      dropdown: [
        { title: 'Admission Procedure 2025-26', desc: 'Step-by-step enrollment guide', href: '#admission-info' },
        { title: 'Fee Structure', desc: 'Transparent fee schedule and installments', href: '#contact' },
        { title: 'Online Application Form', desc: 'Apply directly through our portal', action: onOpenAdmission },
        { title: 'Scholarships & Sibling Aid', desc: 'Merit and sports scholarship criteria', href: '#admission-info' },
      ],
    },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'CONTACT US', href: '#contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/80 py-2.5'
          : 'bg-white py-3.5 shadow-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3.5 group">
          <img
            src="/logo.svg"
            alt="AMAA High School Crest"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md"
          />
          <div className="flex flex-col">
            <span className="font-crest text-xl sm:text-2xl font-black tracking-wider text-[#093326] leading-none">
              AMAA
            </span>
            <span className="font-crest text-xs sm:text-sm font-semibold tracking-widest text-[#b87e1f] mt-0.5">
              HIGH SCHOOL
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-medium hidden sm:block">
              Affiliated to CBSE, New Delhi
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group py-2"
              onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={item.href}
                className="flex items-center gap-1 text-[13px] font-bold text-slate-700 hover:text-[#093326] transition-colors tracking-wider"
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#b87e1f] group-hover:rotate-180 transition-transform duration-200" />
                )}
              </a>

              {/* Dropdown Menu */}
              {item.dropdown && activeDropdown === item.label && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-2.5 transform opacity-100 translate-y-0 transition-all duration-200 z-50">
                  <div className="space-y-1">
                    {item.dropdown.map((subItem, idx) => (
                      <a
                        key={idx}
                        href={subItem.href || '#'}
                        onClick={(e) => {
                          if (subItem.action) {
                            e.preventDefault();
                            subItem.action();
                          }
                        }}
                        className="block p-2.5 rounded-lg hover:bg-[#f4f8f5] transition-colors group/sub"
                      >
                        <div className="text-xs font-bold text-slate-800 group-hover/sub:text-[#093326] flex items-center justify-between">
                          <span>{subItem.title}</span>
                          <span className="text-[#d4973b] opacity-0 group-hover/sub:opacity-100 transition-opacity">
                            →
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{subItem.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-600 hover:text-[#093326] hover:bg-slate-100 rounded-full transition-colors"
            title="Search Site"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAdmission}
            className="bg-[#093326] hover:bg-[#0e4432] text-amber-300 hover:text-amber-200 text-xs font-bold px-4 py-2.5 rounded-lg border border-amber-400/40 shadow-sm transition-all duration-200 flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>ENQUIRE NOW</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={onOpenAdmission}
            className="bg-[#093326] text-amber-400 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-[#093326] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-slate-100 pb-2">
              <a
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-800 hover:text-[#093326] py-1"
              >
                {item.label}
              </a>
              {item.dropdown && (
                <div className="pl-3 mt-1 space-y-1.5">
                  {item.dropdown.map((sub, idx) => (
                    <a
                      key={idx}
                      href={sub.href || '#'}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (sub.action) sub.action();
                      }}
                      className="block text-xs text-slate-600 hover:text-[#093326] py-0.5"
                    >
                      • {sub.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmission();
              }}
              className="w-full bg-[#093326] text-amber-300 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              Apply for Admission 2025–26
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
