import React from 'react';
import { Phone, Mail, MapPin, Database, Sparkles, UserCheck } from 'lucide-react';

interface TopBarProps {
  onOpenAdmission: () => void;
  onOpenSqlConsole: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAdmission, onOpenSqlConsole }) => {
  return (
    <div className="bg-[#06241a] text-emerald-100/90 text-xs py-2 px-4 border-b border-emerald-800/40 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Contact info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="tel:+917544010044"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors duration-200"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium tracking-wide">+91 75440 10044</span>
          </a>

          <a
            href="mailto:info@amaaschool.edu"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors duration-200"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>info@amaaschool.edu</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 text-emerald-300/80">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Main Campus Road, Beldari, Simri Bakhtiyarpur, Patna</span>
          </div>
        </div>

        {/* Quick Links & CTA */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          <button
            onClick={onOpenSqlConsole}
            className="flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-800/80 text-amber-300 px-2.5 py-1 rounded border border-amber-400/30 text-[11px] font-medium transition-all shadow-sm"
            title="Inspect Live SQL Database"
          >
            <Database className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>SQL Database</span>
          </button>

          <a href="#about" className="hidden md:inline hover:text-amber-400 transition-colors">
            Career
          </a>
          <span className="hidden md:inline text-emerald-700">|</span>
          <a href="#gallery" className="hidden md:inline hover:text-amber-400 transition-colors">
            Alumni
          </a>
          <span className="hidden md:inline text-emerald-700">|</span>
          <a href="#notices" className="hidden md:inline hover:text-amber-400 transition-colors">
            News & Events
          </a>
          <span className="hidden md:inline text-emerald-700">|</span>
          <a href="#contact" className="hidden sm:flex items-center gap-1 hover:text-amber-400 transition-colors">
            <UserCheck className="w-3 h-3 text-amber-400" />
            <span>Parent Login</span>
          </a>

          <button
            onClick={onOpenAdmission}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1 rounded shadow-md hover:shadow-amber-500/20 transition-all text-[11px] tracking-wide uppercase flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Admission Open</span>
          </button>
        </div>
      </div>
    </div>
  );
};
