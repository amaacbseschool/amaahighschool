import React, { useState, useEffect, useMemo } from 'react';
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
import { getPageWithSections } from '../lib/cms';
import type { CmsPageWithSections, CmsSectionWithItems } from '../types/cms';
import type { RouteType } from '../types/routes';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission: () => void;
}

const DEFAULT_MILESTONES = [
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

const DEFAULT_VALUES = [
  {
    title: 'Intellectual Rigor',
    desc: 'Instilling disciplined analytical thinking, scientific inquiry, and deep conceptual clarity from early childhood to Class 10.',
    icon: BookOpen,
    iconColor: 'text-[#354024]',
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
    iconColor: 'text-[#354024]',
  },
  {
    title: 'Inclusive Mentorship',
    desc: 'A student-to-teacher ratio of 1:20 ensuring every child receives tailored academic guidance and emotional care.',
    icon: Users,
    iconColor: 'text-[#cfbb99]',
  },
];

const DEFAULT_STATS = [
  { label: 'Years of Heritage', value: 60, suffix: '+', prefix: '', desc: 'Diamond Jubilee (1965)' },
  { label: 'Teacher Ratio', value: 20, prefix: '1:', suffix: '', desc: 'Personalized mentoring' },
  { label: 'Global Alumni', value: 10000, suffix: '+', prefix: '', desc: 'AIIMS, Tech & Governance' },
  { label: 'Smart Green Campus', value: 15, suffix: ' Acres', prefix: '', desc: 'World-class infrastructure' },
];

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const [pageData, setPageData] = useState<CmsPageWithSections | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPageWithSections('about')
      .then((data) => {
        if (isMounted && data) {
          setPageData(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load about page with sections:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const sectionMap = useMemo(() => {
    const map = new Map<string, CmsSectionWithItems>();
    if (pageData?.sections) {
      for (const sec of pageData.sections) {
        map.set(sec.section_key, sec);
      }
    }
    return map;
  }, [pageData]);

  // Section 1: Hero
  const heroSection = sectionMap.get('about.hero');
  const heroHeading = heroSection?.heading || '60 Years of Academic Rigor & Moral Enlightenment';
  const heroSubheading =
    heroSection?.subheading ||
    'Established in 1965, A.M.A. Adinarayana English Medium High School has illuminated the paths of generations of young learners under the timeless motto "Lead Kindly Light."';
  const heroCtaText = heroSection?.cta_text || 'Apply for Admission 2025–26';
  const heroSecondaryCtaText = heroSection?.secondary_cta_text || 'Explore Curriculum';

  // Section 2: Stats Strip
  const statsSection = sectionMap.get('about.stats');
  const statsList = useMemo(() => {
    if (statsSection?.items && statsSection.items.length > 0) {
      return statsSection.items.map((item, idx) => {
        const fallback = DEFAULT_STATS[idx] || DEFAULT_STATS[0];
        const rawBadge = (item.badge || '').trim();
        let value = fallback.value;
        let prefix = fallback.prefix;
        let suffix = fallback.suffix;

        if (rawBadge.startsWith('1:')) {
          prefix = '1:';
          const num = parseInt(rawBadge.replace('1:', '').trim(), 10);
          if (!isNaN(num)) value = num;
          suffix = '';
        } else {
          const match = rawBadge.match(/^([0-9,]+)(.*)$/);
          if (match) {
            value = parseInt(match[1].replace(/,/g, ''), 10);
            suffix = match[2];
            prefix = '';
          }
        }

        return {
          label: item.title || fallback.label,
          value,
          prefix,
          suffix,
          desc: item.description || fallback.desc,
        };
      });
    }
    return DEFAULT_STATS;
  }, [statsSection]);

  // Section 3: Vision & Mission
  const visionMissionSection = sectionMap.get('about.vision_mission');
  const visionItem = visionMissionSection?.items?.[0];
  const missionItem = visionMissionSection?.items?.[1];

  const visionTitle = visionItem?.title || 'Our Vision';
  const visionDesc =
    visionItem?.description ||
    'To be a transformative center of secondary education that empowers young minds to achieve the pinnacle of academic distinction, technological fluency, and ethical clarity, inspiring them to lead positively in an interconnected global society.';
  const visionBadge = visionItem?.badge || 'Recognised Educational Excellence';

  const missionTitle = missionItem?.title || 'Our Mission';
  const missionDesc =
    missionItem?.description ||
    'To provide an inclusive, safe, and academically stimulating learning ecosystem where qualified educators ignite curiosity, foster critical problem solving through hands-on science practicals and arts, and cultivate unwavering moral integrity in every student from Grade VI through Grade X.';
  const missionBadge = missionItem?.badge || 'Dedicated to Holistic Student Welfare';

  // Section 4: Leadership Spotlight
  const leadershipSection = sectionMap.get('about.leadership');
  const leadershipQuote =
    leadershipSection?.heading ||
    `"We don't merely instruct for examinations; we cultivate thinkers who illuminate society."`;
  const leadershipSubheading =
    leadershipSection?.subheading ||
    'Dr. Shailendra K. Verma, Principal & Academic Director (M.Sc., M.Ed., Ph.D. in Education)';
  const leadershipImg = leadershipSection?.image_url || '/gallery/jai00525.webp';
  const leadershipCtaText = leadershipSection?.cta_text || 'Meet the Governing Body & Trustees';

  // Parse Dr. Shailendra K. Verma info
  const { leaderName, leaderRole, leaderQual } = useMemo(() => {
    if (leadershipSubheading.includes('(')) {
      const parts = leadershipSubheading.split('(');
      const nameAndRole = parts[0].trim();
      const qual = parts[1].replace(')', '').trim();
      const commaIdx = nameAndRole.indexOf(',');
      if (commaIdx !== -1) {
        return {
          leaderName: nameAndRole.substring(0, commaIdx).trim(),
          leaderRole: nameAndRole.substring(commaIdx + 1).trim(),
          leaderQual: qual,
        };
      }
      return { leaderName: nameAndRole, leaderRole: 'Principal & Academic Director', leaderQual: qual };
    }
    return {
      leaderName: 'Dr. Shailendra K. Verma',
      leaderRole: 'Principal & Academic Director',
      leaderQual: 'M.Sc., M.Ed., Ph.D. in Education',
    };
  }, [leadershipSubheading]);

  const leadershipBody = useMemo(() => {
    if (leadershipSection?.content_html) {
      const paragraphs = leadershipSection.content_html
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);
      return paragraphs;
    }
    return [
      'Dear Parents, Students, and Well-Wishers,\n\nWelcome to AMAA High School. Education is the greatest catalyst for human dignity and progress. In our classrooms, laboratories, and sports grounds, we view each child as an individual universe of boundless potential. Our responsibility is to nurture their questions, fortify their resilience, and anchor them in timeless moral values.',
      'As we advance into an era shaped by artificial intelligence and scientific leaps, we remain steadfast in our dedication to humanistic empathy, athletic vigor, and artistic sensibility.',
    ];
  }, [leadershipSection]);

  // Section 5: Values Grid
  const valuesSection = sectionMap.get('about.values');
  const valuesHeading = valuesSection?.heading || 'Foundations of Student Success';
  const valuesList = useMemo(() => {
    if (valuesSection?.items && valuesSection.items.length > 0) {
      return valuesSection.items.map((item, idx) => {
        const fallback = DEFAULT_VALUES[idx] || DEFAULT_VALUES[0];
        return {
          title: item.title || fallback.title,
          desc: item.description || fallback.desc,
          icon: fallback.icon,
          iconColor: fallback.iconColor,
        };
      });
    }
    return DEFAULT_VALUES;
  }, [valuesSection]);

  // Section 6: History / Timeline
  const historySection = sectionMap.get('about.history');
  const historyHeading = historySection?.heading || 'Milestones of Growth (1965 – Present)';
  const historyMilestones = useMemo(() => {
    if (historySection?.items && historySection.items.length > 0) {
      return historySection.items.map((item, idx) => {
        const fallback = DEFAULT_MILESTONES[idx] || DEFAULT_MILESTONES[0];
        return {
          year: item.badge || fallback.year,
          title: item.title || fallback.title,
          desc: item.description || fallback.desc,
        };
      });
    }
    return DEFAULT_MILESTONES;
  }, [historySection]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-[90%] mx-auto px-2 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#354024] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Homepage</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-[#354024] cursor-pointer" onClick={onNavigateHome}>Home</span>
            <span>/</span>
            <span className="text-[#354024] font-bold">About Us</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section id="our-story" className="relative bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#252d19] text-white py-16 lg:py-24 px-4 sm:px-8 xl:px-12 overflow-hidden border-b border-[#141a0e]">
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
            <TextReveal>{heroHeading}</TextReveal>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
            {heroSubheading}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAdmission}
              className="bg-[#354024] hover:bg-[#252d19] text-white font-bold px-8 py-3.5 rounded-full transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#cfbb99]" />
              <span>{heroCtaText}</span>
            </button>
            <button
              onClick={() => onNavigateRoute('academics')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full border border-white/25 transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <span>{heroSecondaryCtaText}</span>
              <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Stats Strip */}
      <section className="relative -mt-8 w-[90%] mx-auto px-2 sm:px-4 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsList.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex items-start gap-4 hover:-translate-y-1 transition-transform"
            >
              <div className="p-3 rounded-xl bg-[#354024]/10 text-[#354024] shrink-0 font-bold text-base font-modern">
                #0{idx + 1}
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#354024] tracking-tight font-modern">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold text-[#1b2213] mt-1">{stat.label}</div>
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
              <div className="w-12 h-12 rounded-2xl bg-[#354024]/10 text-[#354024] flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#354024] uppercase tracking-widest">
                Our Guiding Horizon
              </span>
              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-[#1b2213] mt-1 mb-4">
                {visionTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {visionDesc}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#354024]">
              <CheckCircle2 className="w-4 h-4 text-[#dc2626]" />
              <span>{visionBadge}</span>
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
              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-[#1b2213] mt-1 mb-4">
                {missionTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {missionDesc}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#354024]">
              <CheckCircle2 className="w-4 h-4 text-[#dc2626]" />
              <span>{missionBadge}</span>
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
                  src={leadershipImg}
                  alt="Principal & Leadership of AMAA High School"
                  className="w-72 h-96 sm:w-80 sm:h-[420px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b2213] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <h4 className="font-crest text-lg font-bold">{leaderName}</h4>
                  <p className="text-xs text-[#cfbb99] font-semibold">{leaderRole}</p>
                  <span className="text-[10px] text-slate-300 font-mono">{leaderQual}</span>
                </div>
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#354024]/10 text-[#354024] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-[#354024]" />
                <span>Leadership Perspective</span>
              </div>
              <h2 className="font-crest text-3xl sm:text-4xl font-bold text-[#1b2213] leading-tight">
                {leadershipQuote}
              </h2>
              {leadershipBody.map((paragraph, pIdx) => {
                if (pIdx === 0) {
                  return (
                    <blockquote key={pIdx} className="text-sm sm:base text-slate-700 leading-relaxed italic border-l-4 border-[#354024] pl-4 whitespace-pre-line">
                      {paragraph}
                    </blockquote>
                  );
                }
                return (
                  <p key={pIdx} className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}

              {/* Governing Body Link */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigateRoute('administration')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#1b2213] hover:bg-[#354024] px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-[#cfbb99]" />
                  <span>{leadershipCtaText}</span>
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
          <span className="text-xs font-bold tracking-widest text-[#354024] uppercase bg-[#354024]/10 px-3.5 py-1 rounded-full">
            INSTITUTIONAL PILLARS
          </span>
          <h2 className="font-crest text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1b2213] mt-3">
            {valuesHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valuesList.map((val, idx) => {
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
                  <h3 className="font-bold text-[#1b2213] text-base">{val.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Milestones Timeline */}
      <section id="history" className="bg-[#141a0e] text-white py-16 lg:py-24 border-t border-slate-800">
        <div className="w-[90%] mx-auto px-2 sm:px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#cfbb99] uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full">
              JOURNEY OVER TIME
            </span>
            <h2 className="font-crest text-3xl sm:text-4xl font-bold text-white mt-3">
              {historyHeading}
            </h2>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-white/10">
            {historyMilestones.map((m, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col sm:flex-row items-start ${
                  idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
                } gap-6 sm:gap-10`}
              >
                {/* Center Badge Dot */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#354024] border-4 border-[#141a0e] text-white flex items-center justify-center z-10 shadow-md">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>

                {/* Content Box */}
                <div className="ml-10 sm:ml-0 sm:w-1/2 bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10 shadow-card backdrop-blur-xs">
                  <span className="inline-block bg-[#354024]/20 text-[#cfbb99] font-bold text-xs px-3 py-0.5 rounded-full mb-2">
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
