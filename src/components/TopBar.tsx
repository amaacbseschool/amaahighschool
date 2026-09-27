import React from 'react';
import { Phone, Mail, UserCheck, ShieldCheck } from 'lucide-react';
import type { RouteType } from '../types/routes';

interface TopBarProps {
  onOpenAdmission: () => void;
  onOpenSqlConsole?: () => void;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigateRoute }) => {
  return (
    <div className="bg-[#07111e] text-slate-300 text-xs py-2 border-b border-white/10 relative z-30">
      <div className="w-[90%] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Contact info & Official Motto */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
            <span className="text-[#daa520]">"Lead Kindly Light"</span>
            <span className="text-white/40">•</span>
            <span>Estd. 1965</span>
          </div>

          <a
            href="tel:+917544010044"
            className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 text-slate-300"
          >
            <Phone className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="font-semibold tracking-wide">+91 75440 10044</span>
          </a>

          <a
            href="mailto:info@amaaschool.edu"
            className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors duration-200 text-slate-300"
          >
            <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>info@amaaschool.edu</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>State Board Recognized High School (Grades VI to Class X)</span>
          </div>
        </div>

        {/* Quick Links & Admin Portal Action */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          <a
            href="/admin"
            onClick={(e) => {
              if (onNavigateRoute) {
                e.preventDefault();
                onNavigateRoute('admin');
              }
            }}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-[#0284c7] text-white px-3 py-1 rounded-full border border-white/20 text-[11px] font-semibold transition-all shadow-subtle cursor-pointer"
            title="Staff Operations & Admin Dashboard"
          >
            <ShieldCheck className="w-3 h-3 text-[#38bdf8]" />
            <span>Admin Portal</span>
          </a>

          <a
            href="/about"
            onClick={(e) => {
              if (onNavigateRoute) {
                e.preventDefault();
                onNavigateRoute('about');
              }
            }}
            className="hidden md:inline hover:text-[#38bdf8] transition-colors cursor-pointer text-slate-300 font-medium"
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
            className="hidden md:inline hover:text-[#38bdf8] transition-colors font-medium text-slate-300 cursor-pointer"
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
            className="hidden md:inline hover:text-[#38bdf8] transition-colors cursor-pointer text-slate-300 font-medium"
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
            className="hidden sm:flex items-center gap-1 hover:text-[#38bdf8] transition-colors cursor-pointer text-slate-300 font-medium"
          >
            <UserCheck className="w-3 h-3 text-[#38bdf8]" />
            <span>Campus Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
};
