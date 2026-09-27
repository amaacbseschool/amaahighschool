import React, { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { TextReveal } from '../components/motion/TextReveal';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import { FacultySection } from '../components/FacultySection';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';

interface AcademicsPageProps {
  onNavigateHome: () => void;
  onOpenAdmission: () => void;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({
  onNavigateHome,
  onOpenAdmission,
  onNavigateRoute,
}) => {
  const [activeWing, setActiveWing] = useState<'middle' | 'secondary'>('middle');

  const wings = {
    middle: {
      title: 'Middle School Wing',
      grades: 'Grade 6 through Grade 8',
      age: 'Age 11 to 14 Years',
      desc: 'Focusing on specialized sciences, abstract algebra, geometry, social studies, and introductory computer programming with real-world applications.',
      highlights: [
        'Dedicated Physics, Chemistry and Biology laboratory experiments',
        'Foundation courses for Olympiads, NTSE, and talent exams',
        'Inter-house debate conclaves, essay symposiums, and quizzes',
        'Computer & science club workshops and practical demonstrations',
      ],
      curriculumFocus: ['Advanced Science (PCB)', 'Algebra & Geometry', 'Social Studies & Civics', 'Introductory Python & Computer Literacy'],
    },
    secondary: {
      title: 'Secondary Board Wing',
      grades: 'Grade 9 & Grade 10',
      age: 'Age 14 to 16 Years',
      desc: 'Rigorous academic preparation aligned with State Board benchmarks, intense diagnostic mock examinations, peer-study circles, and career orientation for higher secondary streams.',
      highlights: [
        'Decades of unbroken 100% board clearance record',
        'Over 90% of students scoring distinction and first-class marks',
        'Targeted doubt-clearing sessions and model question clinics',
        'Career counseling seminars with alumni from IITs, AIIMS, and NITs',
      ],
      curriculumFocus: ['Physical Sciences Mastery', 'Secondary Mathematics', 'Social Sciences & Economics', 'Language Excellence'],
    },
  };

  const currentWing = wings[activeWing];

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-[90%] mx-auto px-2 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#0284c7] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Homepage</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-[#0284c7] cursor-pointer" onClick={onNavigateHome}>Home</span>
            <span>/</span>
            <span className="text-[#0284c7] font-bold">Academics</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section id="curriculum" className="relative bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#0369a1] text-white py-16 lg:py-24 px-4 sm:px-8 xl:px-12 overflow-hidden border-b border-sky-950">
        <div className="w-[90%] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-6">
            <img
              src={logoImg}
              alt="School Emblem"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xs font-bold tracking-widest uppercase text-[#cfbb99]">
              A.M.A. ADINARAYANA ACADEMICS • "LEAD KINDLY LIGHT" (ESTD. 1965)
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-crest">
            <TextReveal>Nurturing Intellectual Rigor & Lifelong Curiosity</TextReveal>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
            From foundational conceptual mastery in Middle School through Class 10 secondary board distinction, our pedagogy translates our motto <strong className="text-[#38bdf8]">"Lead Kindly Light"</strong> into rigorous intellect, moral clarity, and future technologies.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAdmission}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 py-3.5 rounded-full transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#cfbb99]" />
              <span>Enroll for Session 2025–26</span>
            </button>
            {onNavigateRoute && (
              <button
                onClick={() => onNavigateRoute('campus')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full border border-white/25 transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer backdrop-blur-xs"
              >
                <span>Explore Laboratories</span>
                <ChevronRight className="w-4 h-4 text-[#cfbb99]" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Metrics Strip */}
      <section className="relative -mt-8 w-[90%] mx-auto px-2 sm:px-4 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Secondary Board Pass Rate', value: 100, suffix: '%', desc: 'Unbroken 1st class honors' },
            { label: 'Student-Teacher Ratio', value: 20, prefix: '1:', suffix: '', desc: 'Mentorship in every classroom' },
            { label: 'Hands-on Lab Experiments', value: 120, suffix: '+', desc: 'Annual per-student practicals' },
            { label: 'Olympiad & Academic Awards', value: 45, suffix: '+', desc: 'State & national honors won' },
          ].map((m, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex items-start gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className="p-3 rounded-xl bg-[#0284c7]/10 text-[#0284c7] shrink-0 font-bold text-base font-modern">
                #0{idx + 1}
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0284c7] tracking-tight font-modern">
                  <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} />
                </div>
                <div className="text-xs font-bold text-[#0a192f] mt-1">{m.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Wing-by-Wing Curriculum Section */}
      <section id="stages" className="w-[90%] mx-auto px-2 sm:px-4 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase bg-[#0284c7]/10 px-3.5 py-1 rounded-full">
            PROGRESSIVE LEARNING STAGES
          </span>
          <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#0f172a] mt-3">
            High School Curriculum Stages (Grades VI to X)
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Each stage is developmentally tailored to build on previously mastered milestones while introducing deeper scientific and mathematical inquiries.
          </p>
        </div>

        {/* Wing Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10 bg-white p-2 rounded-full border border-slate-200 shadow-subtle max-w-xl mx-auto">
          {[
            { id: 'middle', label: 'Middle School (Grades 6 – 8)' },
            { id: 'secondary', label: 'Secondary Board (Grades 9 & 10)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveWing(tab.id as any)}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                activeWing === tab.id
                  ? 'bg-[#0284c7] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0284c7] hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Wing Card */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#0284c7]/10 text-[#0284c7] text-xs font-bold px-3 py-1 rounded-full">
                  {currentWing.grades}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentWing.age}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-crest">
                {currentWing.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {currentWing.desc}
              </p>

              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                  Key Pedagogical Highlights:
                </h4>
                {currentWing.highlights.map((hl, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#f8f9fa] p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                Core Subject Focus
              </h4>
              <div className="space-y-2">
                {currentWing.curriculumFocus.map((f, fIdx) => (
                  <div key={fIdx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between shadow-subtle">
                    <span>{f}</span>
                    <span className="text-[#0284c7] font-bold">✓</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenAdmission}
                className="w-full mt-4 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Inquire for {currentWing.grades}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Distinguished Academic Faculty & Mentors */}
      <FacultySection
        onNavigateRoute={onNavigateRoute}
        onOpenAdmission={onOpenAdmission}
      />
    </div>
  );
};
