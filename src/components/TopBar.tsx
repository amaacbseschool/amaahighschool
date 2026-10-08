import React from 'react';
import { Phone, Mail, UserCheck, ShieldCheck } from 'lucide-react';
import type { RouteType } from '../types/routes';
import { useCmsShell } from '../context/CmsShellContext';

interface TopBarProps {
  onOpenAdmission: () => void;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigateRoute }) => {
  const { getSetting } = useCmsShell();

  const motto = getSetting('site_motto', 'Lead Kindly Light');
  const establishedYear = getSetting('site_established_year', '1965');
  const phone = getSetting('site_phone', '+91 75440 10044');
  const secondaryPhone = getSetting('site_phone_secondary', '+91 75440 10045');
  const email = getSetting('site_email', 'info@amaaschool.edu');
  const boardRecognition = getSetting(
    'site_board_recognition',
    'State Board Recognized High School (Grades VI to Class X)'
  );
  const campusDeskLabel = getSetting('topbar_campus_desk_label', 'Campus Desk');

  const cleanPhone = phone.replace(/\s+/g, '');

  return (
    <div className="bg-[#141a0e] text-slate-300 text-xs py-2 border-b border-white/10 relative z-30">
      <div className="w-[90%] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Contact info & Official Motto */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
            <span className="text-[#cfbb99]">"{motto}"</span>
            <span className="text-white/40">•</span>
            <span>Estd. {establishedYear}</span>
          </div>

          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 text-slate-300"
            title={secondaryPhone ? `Secondary: ${secondaryPhone}` : undefined}
          >
            <Phone className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="font-semibold tracking-wide">{phone}</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors duration-200 text-slate-300"
          >
            <Mail className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span>{email}</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{boardRecognition}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          <a
            href="/about"
            onClick={(e) => {
              if (onNavigateRoute) {
                e.preventDefault();
                onNavigateRoute('about');
              }
            }}
            className="hidden md:inline hover:text-[#cfbb99] transition-colors cursor-pointer text-slate-300 font-medium"
          >
            About Us
          </a>
          <span className="hidden md:inline text-white/20">•</span>
          <a
            href="/alumni"
            onClick={(e) => {
              if (onNavigateRoute) {
                e.preventDefault();
                onNavigateRoute('alumni');
              }
            }}
            className="hidden md:inline hover:text-[#cfbb99] transition-colors font-medium text-slate-300 cursor-pointer"
          >
            Alumni Portal
          </a>
          <span className="hidden md:inline text-white/20">•</span>
          <a
            href="/student-life"
            onClick={(e) => {
              if (onNavigateRoute) {
                e.preventDefault();
                onNavigateRoute('student-life');
              }
            }}
            className="hidden md:inline hover:text-[#cfbb99] transition-colors cursor-pointer text-slate-300 font-medium"
          >
            Student Life
          </a>
          <span className="hidden md:inline text-white/20">•</span>
          <a
            href="/contact"
            onClick={(e) => {
              if (onNavigateRoute) {
                e.preventDefault();
                onNavigateRoute('contact');
              }
            }}
            className="hidden sm:flex items-center gap-1 hover:text-[#cfbb99] transition-colors cursor-pointer text-slate-300 font-medium"
          >
            <UserCheck className="w-3 h-3 text-[#cfbb99]" />
            <span>{campusDeskLabel}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

