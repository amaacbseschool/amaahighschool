import React from 'react';
import { Phone, Mail, MapPin, Database, Sparkles, UserCheck } from 'lucide-react';

interface TopBarProps {
  onOpenAdmission: () => void;
  onOpenSqlConsole: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAdmission, onOpenSqlConsole }) => {
  return (
    <div className="bg-[#0b1f3a] text-blue-50 text-xs py-2 px-4 border-b border-blue-950/60 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Contact info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="tel:+917544010044"
            className="flex items-center gap-1.5 hover:text-white transition-colors duration-200"
          >
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium tracking-wide">+91 75440 10044</span>
          </a>

          <a
            href="mailto:info@amaaschool.edu"
            className="flex items-center gap-1.5 hover:text-white transition-colors duration-200"
          >
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>info@amaaschool.edu</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 text-blue-200/80">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>Main Campus Road, Beldari, Simri Bakhtiyarpur, Patna</span>
          </div>
        </div>

        {/* Quick Links & CTA */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          <button
            onClick={onOpenSqlConsole}
            className="flex items-center gap-1.5 bg-blue-950/60 hover:bg-blue-900/60 text-sky-300 px-2.5 py-1 rounded border border-sky-400/30 text-[11px] font-medium transition-all shadow-sm"
            title="Inspect Live SQL Database"
          >
            <Database className="w-3 h-3 text-sky-400 animate-pulse" />
            <span>SQL Database</span>
          </button>

          <a href="#about" className="hidden md:inline hover:text-sky-300 transition-colors">
            Career
          </a>
          <span className="hidden md:inline text-blue-400/40">|</span>
          <a href="#gallery" className="hidden md:inline hover:text-sky-300 transition-colors">
            Alumni
          </a>
          <span className="hidden md:inline text-blue-400/40">|</span>
          <a href="#notices" className="hidden md:inline hover:text-sky-300 transition-colors">
            News & Events
          </a>
          <span className="hidden md:inline text-blue-400/40">|</span>
          <a href="#contact" className="hidden sm:flex items-center gap-1 hover:text-sky-300 transition-colors">
            <UserCheck className="w-3 h-3 text-sky-400" />
            <span>Parent Login</span>
          </a>

          <button
            onClick={onOpenAdmission}
            className="bg-white hover:bg-sky-50 text-[#1d4ed8] font-extrabold px-3.5 py-1 rounded-md shadow-md transition-all text-[11px] tracking-wide uppercase flex items-center gap-1 hover:scale-105"
          >
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>Admission Open</span>
          </button>
        </div>
      </div>
    </div>
  );
};
