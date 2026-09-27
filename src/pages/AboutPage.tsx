import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Target,
  Compass,
  CheckCircle2,
  Users,
  ShieldCheck,
  Calendar,
  Building2,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { TextReveal } from '../components/motion/TextReveal';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const milestones = [
    {
      year: '1965',
      title: 'Foundation of A.M.A. Adinarayana High School',
      desc: 'Founded under the sacred motto "Lead Kindly Light" to impart disciplined, values-based English medium education to children across the region.',
    },
    {
      year: '1985',
      title: 'Board Recognition & Secondary Expansion',
      desc: 'Official high school board accreditation and expansion of comprehensive physics, chemistry, and biology laboratory wings.',
    },
    {
      year: '2005',
      title: 'Athletic Infrastructure & Library Hub',
      desc: 'Development of multi-sport grounds, regulation athletic tracks, and a 25,000+ volume knowledge library.',
    },
    {
      year: '2018',
      title: 'Digital Classrooms & Science Laboratories',
      desc: 'Integration of 4K interactive smart panels and modernized science and computer laboratories for practical learning.',
    },
    {
      year: '2025–26',
      title: '60 Glorious Years of Diamond Jubilee Excellence',
      desc: 'Celebrating 60 years of transformative education, over 10,000 alumni excelling globally, and continuous 100% board pass distinction.',
    },
  ];

  const coreValues = [
    {
      title: 'Intellectual Rigor',
      desc: 'Instilling disciplined analytical thinking, scientific inquiry, and deep conceptual clarity from early childhood to Class 10.',
      icon: BookOpen,
      iconColor: 'text-[#0284c7]',
    },
    {
      title: 'Moral Integrity & Ethics',
      desc: 'Rooting education in honesty, respect, empathy, and social responsibility under our motto "Lead Kindly Light".',
      icon: ShieldCheck,
      iconColor: 'text-[#dc2626]',
    },
    {
      title: 'Future-Ready Innovation',
      desc: 'Active immersion in scientific exploration, computer literacy, and creative arts that prepare young learners for secondary and higher academic pursuits.',
      icon: Sparkles,
      iconColor: 'text-[#0284c7]',
    },
    {
      title: 'Inclusive Mentorship',
      desc: 'A student-to-teacher ratio of 1:20 ensuring every child receives tailored academic guidance and emotional care.',
      icon: Users,
      iconColor: 'text-[#cfbb99]',
    },
  ];

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
            <span className="text-[#0284c7] font-bold">About Us</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section id="our-story" className="relative bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#0369a1] text-white py-16 lg:py-24 px-4 sm:px-8 xl:px-12 overflow-hidden border-b border-sky-950">
        <div className="w-[90%] mx-auto relative z-10 text-center">
          {/* Logo & Motto Badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-6">
            <img
              src={logoImg}
              alt="School Emblem"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xs font-bold tracking-widest uppercase text-[#cfbb99]">
              "LEAD KINDLY LIGHT" • ESTD. 1965
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-crest">
            <TextReveal>60 Years of Academic Rigor & Moral Enlightenment</TextReveal>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
            Established in 1965, A.M.A. Adinarayana English Medium High School has illuminated the paths of generations of young learners under the timeless motto "Lead Kindly Light."
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAdmission}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 py-3.5 rounded-full transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#cfbb99]" />
              <span>Apply for Admission 2025–26</span>
            </button>
            <button
              onClick={() => onNavigateRoute('academics')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full border border-white/25 transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Stats Strip */}
      <section className="relative -mt-8 w-[90%] mx-auto px-2 sm:px-4 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Years of Heritage', value: 60, suffix: '+', desc: 'Diamond Jubilee (1965)' },
            { label: 'Teacher Ratio', value: 20, prefix: '1:', suffix: '', desc: 'Personalized mentoring' },
            { label: 'Global Alumni', value: 10000, suffix: '+', desc: 'AIIMS, Tech & Governance' },
            { label: 'Smart Green Campus', value: 15, suffix: ' Acres', desc: 'World-class infrastructure' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex items-start gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className="p-3 rounded-xl bg-[#0284c7]/10 text-[#0284c7] shrink-0 font-bold text-base font-modern">
                #0{idx + 1}
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0284c7] tracking-tight font-modern">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold text-[#0a192f] mt-1">{stat.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Vision & Mission Section */}
      <section id="vision-mission" className="w-[90%] mx-auto px-2 sm:px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Vision Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#0284c7] uppercase tracking-widest">
                Our Guiding Horizon
              </span>
              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-[#0a192f] mt-1 mb-4">
                Our Vision
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To be a transformative center of secondary education that empowers young minds to achieve the pinnacle of academic distinction, technological fluency, and ethical clarity, inspiring them to lead positively in an interconnected global society.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#0284c7]">
              <CheckCircle2 className="w-4 h-4 text-[#dc2626]" />
              <span>Recognised Educational Excellence</span>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#dc2626] uppercase tracking-widest">
                Our Daily Commitment
              </span>
              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-[#0a192f] mt-1 mb-4">
                Our Mission
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To provide an inclusive, safe, and academically stimulating learning ecosystem where qualified educators ignite curiosity, foster critical problem solving through hands-on science practicals and arts, and cultivate unwavering moral integrity in every student from Grade VI through Grade X.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#0284c7]">
              <CheckCircle2 className="w-4 h-4 text-[#dc2626]" />
              <span>Dedicated to Holistic Student Welfare</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Principal's Message Spotlight */}
      <section id="leadership" className="bg-white border-y border-slate-200 py-16 lg:py-24">
        <div className="w-[90%] mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Photo & Badge */}
            <div className="lg:col-span-5 text-center">
              <div className="relative inline-block overflow-hidden rounded-3xl border-4 border-slate-100 shadow-2xl">
                <img
                  src="/gallery/jai00525.webp"
                  alt="Principal & Leadership of AMAA High School"
                  className="w-72 h-96 sm:w-80 sm:h-[420px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <h4 className="font-crest text-lg font-bold">Dr. Shailendra K. Verma</h4>
                  <p className="text-xs text-[#38bdf8] font-semibold">Principal & Academic Director</p>
                  <span className="text-[10px] text-slate-300 font-mono">M.Sc., M.Ed., Ph.D. in Education</span>
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#0284c7]/10 text-[#0284c7] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Leadership Perspective</span>
              </div>
              <h2 className="font-crest text-3xl sm:text-4xl font-bold text-[#0a192f] leading-tight">
                "We don't merely instruct for examinations; we cultivate thinkers who illuminate society."
              </h2>
              <blockquote className="text-sm sm:text-base text-slate-700 leading-relaxed italic border-l-4 border-[#0284c7] pl-4">
                Dear Parents, Students, and Well-Wishers,<br /><br />
                Welcome to AMAA High School. Education is the greatest catalyst for human dignity and progress. In our classrooms, laboratories, and sports grounds, we view each child as an individual universe of boundless potential. Our responsibility is to nurture their questions, fortify their resilience, and anchor them in timeless moral values.
              </blockquote>
              <p className="text-xs text-slate-500 leading-relaxed">
                As we advance into an era shaped by artificial intelligence and scientific leaps, we remain steadfast in our dedication to humanistic empathy, athletic vigor, and artistic sensibility.
              </p>

              {/* Governing Body Link */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigateRoute('administration')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#0a192f] hover:bg-[#0284c7] px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                  <span>Meet the Governing Body & Trustees</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Core Pillars 4-Grid */}
      <section id="values" className="w-[90%] mx-auto px-2 sm:px-4 py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#0284c7] uppercase bg-[#0284c7]/10 px-3.5 py-1 rounded-full">
            INSTITUTIONAL PILLARS
          </span>
          <h2 className="font-crest text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a192f] mt-3">
            Foundations of Student Success
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                    <Icon className={`w-6 h-6 ${val.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-[#0a192f] text-base">{val.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Milestones Timeline */}
      <section id="history" className="bg-[#07111e] text-white py-16 lg:py-24 border-t border-slate-800">
        <div className="w-[90%] mx-auto px-2 sm:px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#cfbb99] uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full">
              JOURNEY OVER TIME
            </span>
            <h2 className="font-crest text-3xl sm:text-4xl font-bold text-white mt-3">
              Milestones of Growth (1965 – Present)
            </h2>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-white/10">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col sm:flex-row items-start ${
                  idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
                } gap-6 sm:gap-10`}
              >
                {/* Center Badge Dot */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0284c7] border-4 border-[#07111e] text-white flex items-center justify-center z-10 shadow-md">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>

                {/* Content Box */}
                <div className="ml-10 sm:ml-0 sm:w-1/2 bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10 shadow-card backdrop-blur-xs">
                  <span className="inline-block bg-[#0284c7]/20 text-[#38bdf8] font-bold text-xs px-3 py-0.5 rounded-full mb-2">
                    {m.year}
                  </span>
                  <h4 className="font-bold text-base text-white">{m.title}</h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
