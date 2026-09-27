import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { FacultySection } from '../components/FacultySection';
import { TextReveal } from '../components/motion/TextReveal';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';

interface FacultyPageProps {
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission: () => void;
}

export const FacultyPage: React.FC<FacultyPageProps> = ({
  onNavigateRoute,
  onOpenAdmission,
}) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              onClick={() => onNavigateRoute('home')}
              className="hover:text-[#0284c7] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0284c7] font-bold">Faculty & Mentors</span>
          </nav>
        </div>
      </div>

      {/* Hero Header - Deep Navy & Azure Blue */}
      <div className="bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#0369a1] text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(2,132,199,0.25),transparent_50%)] pointer-events-none" />
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
            <img src={logoImg} alt="School Emblem" className="w-5 h-5 object-contain" />
            <span className="text-[11px] font-extrabold tracking-widest text-[#38bdf8] uppercase">
              EXCELLENCE IN PEDAGOGY & MENTORSHIP
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1]">
            <TextReveal>Distinguished Faculty & Subject Masters</TextReveal>
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mt-5 leading-relaxed font-normal">
            Meet the dedicated educators, subject chairpersons, and research mentors shaping generations of young minds under our sacred motto "Lead Kindly Light."
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15 max-w-4xl">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">1:20</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Mentor-Student Ratio</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-[#cfbb99]">15+ Yrs</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Average Pedagogy Tenure</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-[#38bdf8]">100%</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Postgraduate Qualified</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">Weekly</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Office Hours & Mentoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Faculty Section */}
      <FacultySection
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />
    </div>
  );
};
