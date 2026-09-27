import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  Award,
  Medal,
  Star,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { TextReveal } from '../components/motion/TextReveal';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import type { RouteType } from '../types/routes';

interface AchievementsPageProps {
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission: () => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const toppers = [
    {
      name: 'Sneha K. Varma',
      score: '98.6%',
      badge: 'State Rank 2 • Board Class X',
      quote: 'AMAA faculty treated every doubt with patience. Regular model exams gave me unwavering confidence.',
      field: 'Aspiring Biomedical Researcher',
      year: 'Class of 2025',
      image: '/toppers/sneha_varma.webp',
    },
    {
      name: 'Aditya R. Prasad',
      score: '98.2%',
      badge: 'Math & Science Centum (100/100)',
      quote: 'The computer club and science practical labs taught me the practical side of complex formulas.',
      field: 'National Cyber Olympiad Gold',
      year: 'Class of 2025',
      image: '/toppers/aditya_prasad.webp',
    },
    {
      name: 'Meghana Sen',
      score: '97.8%',
      badge: 'All-Rounder Award Winner',
      quote: 'Balancing athletics track meets with daily study schedules was made possible by our supportive mentors.',
      field: 'State Level Sprinter & Orator',
      year: 'Class of 2025',
      image: '/toppers/meghana_sen.webp',
    },
    {
      name: 'Ravi Teja Nalluri',
      score: '97.4%',
      badge: 'Science Distinction',
      quote: 'Our teachers never gave up on any student. Personal attention is what sets AMAA apart.',
      field: 'IIT-JEE Foundation Scholar',
      year: 'Class of 2024',
      image: '/toppers/raviteja_nalluri.webp',
    },
    {
      name: 'Divya Srinivasan',
      score: '96.9%',
      badge: 'Language & Arts Topper',
      quote: 'The literary club and drama wing built my confidence far beyond the classroom.',
      field: 'Aspiring Civil Services',
      year: 'Class of 2024',
      image: '/toppers/divya_srinivasan.webp',
    },
    {
      name: 'Harshith Reddy',
      score: '96.6%',
      badge: 'Mathematics Centum',
      quote: 'Daily diagnostic tests and individual feedback helped me identify and close every gap.',
      field: 'State Math Olympiad Silver',
      year: 'Class of 2023',
      image: '/toppers/harshith_reddy.webp',
    },
  ];

  const olympiadAwards = [
    { category: 'Science Olympiad (SOF)', medals: '48 Gold / Silver', years: '2018–2025' },
    { category: 'National Cyber Olympiad', medals: '32 State Ranks', years: '2019–2025' },
    { category: 'Mathematics Olympiad', medals: '27 Gold / Distinction', years: '2017–2025' },
    { category: 'NTSE State Selection', medals: '11 Scholars', years: '2015–2025' },
    { category: 'National Science Exhibition', medals: '8 State Prizes', years: '2020–2025' },
    { category: 'Art & Creative Writing', medals: '14 National Awards', years: '2018–2025' },
  ];

  const sportsHonours = [
    { sport: 'Athletics (Track & Field)', prize: 'District Championship × 9', icon: '🏃' },
    { sport: 'Cricket', prize: 'State U-16 Shield × 3', icon: '🏏' },
    { sport: 'Taekwondo', prize: 'State Gold × 7', icon: '🥋' },
    { sport: 'Football', prize: 'District Gold × 5', icon: '⚽' },
    { sport: 'Volleyball', prize: 'Inter-School Cup × 4', icon: '🏐' },
    { sport: 'Badminton', prize: 'State Under-14 × 2', icon: '🏸' },
  ];

  const alumniProdigies = [
    { name: 'Dr. Priya Sharma, MBBS, MS', batch: 'Batch of 2012', role: 'Senior Consultant Cardiologist', org: 'AIIMS New Delhi', tag: 'Healthcare Pioneer' },
    { name: 'Vikramaditya Roy, B.Tech, M.S.', batch: 'Batch of 2014', role: 'Principal Systems Architect', org: 'Global Technology Enterprise', tag: 'Tech Innovator' },
    { name: 'Ananya Deshmukh, IAS', batch: 'Batch of 2010', role: 'District Magistrate & Collector', org: 'Government Administration', tag: 'Public Governance' },
    { name: 'Maj. Siddharth Menon', batch: 'Batch of 2008', role: 'Squadron Commander', org: 'Indian Armed Forces', tag: 'National Defence' },
  ];

  const stats = [
    { value: 100, suffix: '%', label: 'Board Pass Record', sub: 'Unbroken multi-decade tradition', icon: ShieldCheck, dark: true },
    { value: 92, suffix: '%', label: 'First Class & Distinctions', sub: 'Class X secondary aggregate', icon: Award, dark: false },
    { value: 140, suffix: '+', label: 'Olympiad Medals', sub: 'SOF, NTSE & National level', icon: Medal, dark: false },
    { value: 45, suffix: '+', label: 'Sports Trophies', sub: 'Athletics, cricket, taekwondo', icon: Trophy, dark: false },
    { value: 10000, suffix: '+', label: 'Global Alumni', sub: 'Across medicine, tech & governance', icon: GraduationCap, dark: false },
    { value: 60, suffix: '+', label: 'Years of Excellence', sub: 'Diamond Jubilee legacy', icon: BookOpen, dark: false },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-[90%] mx-auto px-2 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onNavigateRoute('home')}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#0284c7] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Homepage</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-[#0284c7] cursor-pointer" onClick={() => onNavigateRoute('home')}>Home</span>
            <span>/</span>
            <span className="text-[#0284c7] font-bold">Achievements</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#0369a1] text-white py-16 lg:py-24 px-4 overflow-hidden border-b border-sky-950">
        <div className="w-[90%] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
            <Trophy className="w-4 h-4 text-[#cfbb99]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#cfbb99]">Tradition of Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-crest">
            <TextReveal>Academic Distinctions & Board Honours</TextReveal>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Consistently outperforming state averages — our students secure top ranks in secondary board exams, Olympiads, athletic championships, and cultural competitions.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAdmission}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 py-3.5 rounded-full transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#cfbb99]" />
              <span>Apply for Admission 2025–26</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Stats Grid */}
      <section className="relative -mt-8 w-[90%] mx-auto px-2 sm:px-4 z-20 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                whileHover={{ y: -4 }}
                className={`p-7 rounded-3xl flex items-start gap-5 shadow-card border transition-all duration-300 ${
                  stat.dark
                    ? 'bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#0369a1] text-white border-sky-900'
                    : 'bg-white text-[#0a192f] border-slate-200/90 hover:border-[#0284c7]/30'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.dark ? 'bg-white/10 text-[#cfbb99]' : 'bg-[#0284c7]/10 text-[#0284c7]'}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className={`text-3xl font-extrabold tracking-tight font-modern ${stat.dark ? 'text-white' : 'text-[#0284c7]'}`}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className={`font-crest font-bold text-sm mt-0.5 ${stat.dark ? 'text-white' : 'text-[#0a192f]'}`}>{stat.label}</div>
                  <div className={`text-xs mt-0.5 ${stat.dark ? 'text-slate-300' : 'text-slate-500'}`}>{stat.sub}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Board Toppers */}
      <section className="w-[90%] mx-auto px-2 sm:px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#0284c7]/10 border border-[#0284c7]/20 px-4 py-1.5 rounded-full mb-3">
            <Star className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="text-[11px] font-bold tracking-widest text-[#0284c7] uppercase">Class X Board Roll of Honour</span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#0a192f]">Recent Secondary Board Star Toppers</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">Our students consistently rank among the top in the state board examinations, achieving centum scores and district first positions.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {toppers.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              whileHover={{ y: -5 }}
              className="group bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-xl hover:border-[#0284c7]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Student Portrait + Score + Badge */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative shrink-0 w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 ring-4 ring-slate-100/80 group-hover:ring-[#0284c7]/20 transition-all">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent py-0.5 text-center">
                      <span className="text-[9px] font-bold text-sky-300">AMAA Star</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#0284c7] font-modern leading-none">
                        {t.score}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-[#dc2626]/10 text-[#dc2626] px-2.5 py-0.5 rounded-full truncate max-w-full">
                      {t.badge}
                    </span>
                  </div>
                </div>

                <h4 className="font-crest text-lg font-bold text-[#0a192f] group-hover:text-[#0284c7] transition-colors">
                  {t.name}
                </h4>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  {t.field}
                </div>

                <p className="text-xs text-slate-700 mt-3.5 italic leading-relaxed border-l-2 border-[#0284c7] pl-3 py-1 bg-slate-50/80 rounded-r-xl">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#0284c7] font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0284c7]" />
                  <span>State Board Distinction</span>
                </div>
                <span className="text-slate-400 text-[11px] font-medium">{t.year}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Olympiad Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#0284c7]/10 border border-[#0284c7]/20 px-4 py-1.5 rounded-full mb-3">
            <Medal className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="text-[11px] font-bold tracking-widest text-[#0284c7] uppercase">National & State Level Competitions</span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#0a192f]">Olympiad & Academic Honours</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {olympiadAwards.map((o, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card hover:border-[#0284c7]/40 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#cfbb99] shrink-0" />
                <h4 className="font-bold text-[#0a192f] text-sm">{o.category}</h4>
              </div>
              <div className="text-xl font-extrabold text-[#0284c7] font-modern">{o.medals}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">{o.years}</div>
            </motion.div>
          ))}
        </div>

        {/* Sports Trophies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#0284c7]/10 border border-[#0284c7]/20 px-4 py-1.5 rounded-full mb-3">
            <Trophy className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="text-[11px] font-bold tracking-widest text-[#0284c7] uppercase">Inter-School & State Sports</span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#0a192f]">Sports Championship Honours</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {sportsHonours.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card hover:border-[#0284c7]/40 transition-all duration-300 flex items-start gap-4"
            >
              <span className="text-3xl shrink-0">{s.icon}</span>
              <div>
                <h4 className="font-bold text-[#0a192f] text-sm">{s.sport}</h4>
                <div className="text-xs font-bold text-[#0284c7] mt-1">{s.prize}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alumni Leadership Strip */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="bg-[#07111e] text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-800"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider rounded-full mb-2">
                <GraduationCap className="w-4 h-4 text-[#cfbb99]" />
                <span>Global Impact & Leadership</span>
              </div>
              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-white">Six Decades of Leaders Shaping the World</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">From pioneering medicine and scientific research to public administration and national defence, AMAA alumni embody <em>"Lead Kindly Light"</em>.</p>
            </div>
            <button
              onClick={() => onNavigateRoute('alumni')}
              className="shrink-0 inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <span>Visit Alumni Network</span>
              <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {alumniProdigies.map((alum, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white/5 border border-white/10 hover:border-[#0284c7]/50 p-5 rounded-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#0284c7] px-2.5 py-1 rounded-full">{alum.tag}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{alum.batch}</span>
                </div>
                <h4 className="font-crest text-base font-bold text-white leading-snug">{alum.name}</h4>
                <p className="text-xs text-[#38bdf8] font-medium mt-1">{alum.role}</p>
                <div className="text-[11px] text-slate-300 mt-3 pt-2 border-t border-white/10 font-medium">{alum.org}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h4 className="font-crest text-xl font-bold text-[#0a192f]">Be Part of the Next Batch of Distinction Holders</h4>
            <p className="text-sm text-slate-600 mt-1">Admissions open for Academic Session 2025–26 for Grades VI to Grade X.</p>
          </div>
          <button
            onClick={onOpenAdmission}
            className="shrink-0 inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-8 py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <span>Apply for 2025–26</span>
            <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
          </button>
        </motion.div>
      </section>
    </div>
  );
};
