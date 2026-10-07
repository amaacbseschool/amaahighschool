import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Medal,
  Star,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { AnimatedCounter } from './motion/AnimatedCounter';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';
import type { CmsSectionWithItems } from '../types/cms';

interface AchievementsSectionProps {
  cmsSection?: CmsSectionWithItems;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  cmsSection,
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const eyebrow = cmsSection?.eyebrow || 'ACADEMIC DISTINCTIONS & BOARD HONORS';
  const heading = cmsSection?.heading || 'Tradition of Excellence';
  const subheading =
    cmsSection?.subheading ||
    'Consistently outperforming state averages, our students secure top ranks in secondary board exams, Olympiads, and athletic meets.';
  const ctaText = cmsSection?.cta_text || 'VIEW ACADEMIC HONORS';

  const bentoStats = useMemo(() => {
    const items = cmsSection?.items;
    const parseNum = (str: string, defaultVal: number, defaultSuff: string) => {
      const match = str.trim().match(/^([0-9,]+)(.*)$/);
      if (match) {
        return {
          value: parseInt(match[1].replace(/,/g, ''), 10),
          suffix: match[2],
        };
      }
      return { value: defaultVal, suffix: defaultSuff };
    };

    const card1Item = items && items[0];
    const card2Item = items && items[1];
    const card3Item = items && items[2];
    const card4Item = items && items[3];

    return {
      card1: {
        ...parseNum(card1Item?.badge || '100%', 100, '%'),
        badge: 'HALLMARK OF EXCELLENCE',
        title: card1Item?.title || 'Secondary Board Pass Rate',
        desc:
          card1Item?.description ||
          'Unbroken 100% board passing record maintained across decades, with 9 out of 10 students achieving premier first-class and distinction honors.',
      },
      card2: {
        ...parseNum(card2Item?.badge || '92%', 92, '%'),
        badge: 'Secondary Aggregate',
        title: card2Item?.title || 'Distinctions & First Class Honors',
        desc:
          card2Item?.description ||
          'Over nine out of ten graduating students score in the topmost distinction tier in Class X board exams, securing state top ranks.',
      },
      card3: {
        ...parseNum(card3Item?.badge || '140+', 140, '+'),
        title: card3Item?.title || 'Olympiad State & National Medals',
        desc:
          card3Item?.description ||
          'SOF Science, Mathematics, Cyber and National Talent Search Examination (NTSE) state honors.',
      },
      card4: {
        ...parseNum(card4Item?.badge || '45+', 45, '+'),
        title: card4Item?.title || 'Sports Championships & Trophies',
        desc:
          card4Item?.description ||
          'Athletics track championships, taekwondo gold medals, district cricket and football shields.',
      },
    };
  }, [cmsSection]);

  const toppers = [
    {
      name: 'Sneha K. Varma',
      score: '98.6%',
      badge: 'State Rank 2 • Board Class X',
      quote: 'AMAA faculty treated every doubt with patience. Regular model exams gave me unwavering confidence.',
      field: 'Aspiring Biomedical Researcher',
      image: '/toppers/sneha_varma.webp',
      year: 'Class of 2025',
    },
    {
      name: 'Aditya R. Prasad',
      score: '98.2%',
      badge: 'Math & Science Centum (100/100)',
      quote: 'The computer club and science practical labs taught me the practical side of complex formulas.',
      field: 'National Cyber Olympiad Gold',
      image: '/toppers/aditya_prasad.webp',
      year: 'Class of 2025',
    },
    {
      name: 'Meghana Sen',
      score: '97.8%',
      badge: 'All-Rounder Award Winner',
      quote: 'Balancing athletics track meets with daily study schedules was made possible by our supportive mentors.',
      field: 'State Level Sprinter & Orator',
      image: '/toppers/meghana_sen.webp',
      year: 'Class of 2025',
    },
  ];

  const alumniProdigies = [
    {
      name: 'Dr. Priya Sharma, MBBS, MS',
      batch: 'Batch of 2012',
      role: 'Senior Consultant Cardiologist',
      org: 'AIIMS New Delhi',
      tag: 'Healthcare Pioneer',
    },
    {
      name: 'Vikramaditya Roy, B.Tech, M.S.',
      batch: 'Batch of 2014',
      role: 'Principal Systems Architect',
      org: 'Global Technology Enterprise',
      tag: 'Tech Innovator',
    },
    {
      name: 'Ananya Deshmukh, IAS',
      batch: 'Batch of 2010',
      role: 'District Magistrate & Collector',
      org: 'Government Administration',
      tag: 'Public Governance',
    },
    {
      name: 'Maj. Siddharth Menon',
      batch: 'Batch of 2008',
      role: 'Squadron Commander',
      org: 'Indian Armed Forces',
      tag: 'National Defence',
    },
  ];

  return (
    <section id="achievements" className="py-20 lg:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
              <Trophy className="w-3.5 h-3.5 text-[#cfbb99]" />
              <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2213] tracking-tight mt-1">
              <TextReveal>{heading}</TextReveal>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              {subheading}
            </p>
          </div>

          {onNavigateRoute && (
            <button
              onClick={() => onNavigateRoute('academics')}
              className="shrink-0 inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-6 py-3 rounded-full text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
            </button>
          )}
        </motion.div>

        {/* Bento Grid for Stat Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          {/* Card 1: 100% Board Pass Rate (Hero Centerpiece - 6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="md:col-span-12 lg:col-span-6 bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#252d19] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden group flex flex-col justify-between border border-[#1b2213]"
          >
            <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#cfbb99] shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest bg-[#dc2626] text-white px-3.5 py-1.5 rounded-full">
                {bentoStats.card1.badge}
              </span>
            </div>

            <div className="relative z-10">
              <div className="flex items-baseline gap-2">
                <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-modern">
                  <AnimatedCounter value={bentoStats.card1.value} suffix={bentoStats.card1.suffix} />
                </div>
                <span className="text-xs font-bold text-[#cfbb99] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  Unbroken Legacy
                </span>
              </div>

              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-white mt-3">
                {bentoStats.card1.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed max-w-md">
                {bentoStats.card1.desc}
              </p>

              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/15">
                <span className="text-[11px] font-medium text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  ✓ 100% Secondary Clearance
                </span>
                <span className="text-[11px] font-medium text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  ✓ Zero Failures Recorded
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: 92% Distinctions & First Class (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="md:col-span-12 lg:col-span-6 bg-[#f8f9fa] border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-card hover:border-[#354024]/40 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
              <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 text-[#354024] flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#354024]/10 text-[#354024] px-3.5 py-1.5 rounded-full">
                {bentoStats.card2.badge}
              </span>
            </div>

            <div className="relative z-10">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#1b2213] tracking-tight font-modern">
                <AnimatedCounter value={bentoStats.card2.value} suffix={bentoStats.card2.suffix} />
              </div>

              <h3 className="font-crest text-2xl font-bold text-[#1b2213] mt-2">
                {bentoStats.card2.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {bentoStats.card2.desc}
              </p>

              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200">
                <span className="text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full">
                  ✓ Centum 100/100 in Math
                </span>
                <span className="text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full">
                  ✓ Science Centum Scores
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: 140+ Olympiad Medals (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="md:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-card hover:border-[#354024]/40 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-[#354024] flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
                <Medal className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 text-[#cfbb99]" />
            </div>

            <div className="relative z-10">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1b2213] tracking-tight font-modern">
                <AnimatedCounter value={bentoStats.card3.value} suffix={bentoStats.card3.suffix} />
              </div>
              <h4 className="font-crest text-xl font-bold text-[#1b2213] mt-1">
                {bentoStats.card3.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {bentoStats.card3.desc}
              </p>
            </div>
          </motion.div>

          {/* Card 4: 45+ Sports Trophies (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="md:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-card hover:border-[#354024]/40 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-[#cfbb99] flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <Sparkles className="w-4 h-4 text-[#354024]" />
            </div>

            <div className="relative z-10">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1b2213] tracking-tight font-modern">
                <AnimatedCounter value={bentoStats.card4.value} suffix={bentoStats.card4.suffix} />
              </div>
              <h4 className="font-crest text-xl font-bold text-[#1b2213] mt-1">
                {bentoStats.card4.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {bentoStats.card4.desc}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Board Toppers Bento Grid */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#354024] uppercase tracking-wider mb-1">
                <Star className="w-4 h-4 text-[#cfbb99]" />
                <span>Class X Board Roll of Honor</span>
              </div>
              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-[#1b2213]">
                Recent Secondary Board Star Toppers
              </h3>
            </div>
            {onOpenAdmission ? (
              <button
                onClick={onOpenAdmission}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#354024] bg-white border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer shadow-subtle"
              >
                <span>Merit Scholarships 2025–26</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#cfbb99]" />
              </button>
            ) : (
              <span className="hidden sm:block text-xs font-bold text-slate-600">100% Pass Rate Record</span>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Topper 1: Sneha K. Varma - 7 cols */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="lg:col-span-7 bg-white border-2 border-[#354024]/30 rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#354024] font-modern">
                      {toppers[0].score}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class X Board</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#dc2626] text-white px-3.5 py-1.5 rounded-full shadow-sm">
                    {toppers[0].badge}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md border-2 border-[#354024]/30 ring-4 ring-[#354024]/10 group">
                    <img
                      src={toppers[0].image}
                      alt={toppers[0].name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent py-0.5 text-center">
                      <span className="text-[9px] font-bold text-amber-300 flex items-center justify-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-300" /> Rank 2
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-crest text-2xl font-bold text-[#1b2213]">
                      {toppers[0].name}
                    </h4>
                    <div className="text-xs font-bold text-slate-500 mt-0.5">
                      {toppers[0].field}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 mt-2.5 italic leading-relaxed border-l-2 border-[#354024] pl-3 py-1 bg-slate-50/80 rounded-r-xl">
                      "{toppers[0].quote}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#354024] font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#354024]" />
                  <span>State Board X Distinction</span>
                </div>
                <span className="text-slate-500 text-[11px]">{toppers[0].year}</span>
              </div>
            </motion.div>

            {/* Topper 2: Aditya R. Prasad - 5 cols */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#354024] font-modern">
                      {toppers[1].score}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class X Board</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#1b2213] px-3 py-1 rounded-full">
                    {toppers[1].badge}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border border-slate-200 ring-4 ring-slate-100 group">
                    <img
                      src={toppers[1].image}
                      alt={toppers[1].name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent py-0.5 text-center">
                      <span className="text-[9px] font-bold text-[#cfbb99]">100/100</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-crest text-xl font-bold text-[#1b2213]">
                      {toppers[1].name}
                    </h4>
                    <div className="text-xs font-bold text-slate-500 mt-0.5">
                      {toppers[1].field}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 mt-2 italic leading-relaxed border-l-2 border-slate-300 pl-3 py-1 bg-slate-50/80 rounded-r-xl">
                      "{toppers[1].quote}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#354024] font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#354024]" />
                  <span>Centum 100/100 Math & Science</span>
                </div>
                <span className="text-slate-500 text-[11px]">{toppers[1].year}</span>
              </div>
            </motion.div>

            {/* Topper 3: Meghana Sen - 12 cols wide */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
              whileHover={{ y: -4 }}
              className="lg:col-span-12 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                  <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border border-slate-200 ring-4 ring-slate-100 group">
                    <img
                      src={toppers[2].image}
                      alt={toppers[2].name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent py-0.5 text-center">
                      <span className="text-[9px] font-bold text-amber-300 flex items-center justify-center gap-0.5">
                        <Trophy className="w-2.5 h-2.5" /> Award
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#354024] font-modern">
                        {toppers[2].score}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#354024]/10 text-[#354024] px-2.5 py-0.5 rounded-full">
                        {toppers[2].badge}
                      </span>
                    </div>
                    <h4 className="font-crest text-xl font-bold text-[#1b2213]">
                      {toppers[2].name}
                    </h4>
                    <div className="text-xs font-bold text-slate-500 mt-0.5">
                      {toppers[2].field}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7">
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed border-l-2 border-[#354024] pl-4 py-1.5 bg-slate-50/80 rounded-r-xl">
                    "{toppers[2].quote}"
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#354024]">
                    <CheckCircle2 className="w-4 h-4 text-[#354024]" />
                    <span>State Level Athletics & Oratory Champion • Class X Distinction</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Prominent Alumni Leadership Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="bg-[#141a0e] text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 mb-10 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider rounded-full mb-2">
                <GraduationCap className="w-4 h-4 text-[#cfbb99]" />
                <span>GLOBAL IMPACT & LEADERSHIP</span>
              </div>
              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-white">
                Six Decades of Leaders Shaping the World
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                From pioneering medicine and scientific research to public administration and national defense, AMAA alumni embody our motto <em>"Lead Kindly Light"</em>.
              </p>
            </div>

            {onNavigateRoute && (
              <button
                onClick={() => onNavigateRoute('alumni')}
                className="shrink-0 inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>VISIT ALUMNI NETWORK</span>
                <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
              </button>
            )}
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {alumniProdigies.map((alum, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white/5 border border-white/10 hover:border-[#354024]/50 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#354024] px-2.5 py-1 rounded-full">
                      {alum.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{alum.batch}</span>
                  </div>
                  <h4 className="font-crest text-base font-bold text-white leading-snug">
                    {alum.name}
                  </h4>
                  <p className="text-xs text-[#cfbb99] font-medium mt-1">{alum.role}</p>
                </div>
                <div className="text-[11px] text-slate-300 mt-3 pt-2 border-t border-white/10 font-medium">
                  {alum.org}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
