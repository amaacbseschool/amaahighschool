import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Music2,
  Paintbrush,
  Mic2,
  BookOpen,
  Cpu,
  Leaf,
  Trophy,
  Activity,
  Users,
  Camera,
  Star,
  CheckCircle2,
  Dumbbell,
} from 'lucide-react';
import { TextReveal } from '../components/motion/TextReveal';
import { GalleryPage } from './GalleryPage';
import { getPageWithSections } from '../lib/cms';
import type { CmsPageWithSections, CmsSectionWithItems } from '../types/cms';
import type { RouteType } from '../types/routes';

interface StudentLifePageProps {
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission: () => void;
}

const DEFAULT_ACTIVITIES = [
  { icon: Music2, title: 'Performing Arts', desc: 'Classical vocal & instrumental training, symphonic band, and annual cultural performances on the main stage.', tag: 'Arts & Music' },
  { icon: Paintbrush, title: 'Visual Arts Studio', desc: 'Drawing, watercolour, sculpture, digital art, and annual art exhibitions showcasing student creativity.', tag: 'Fine Arts' },
  { icon: Mic2, title: 'Debate & Elocution', desc: 'Inter-house debates, MUN participation, public speaking and competitive elocution rounds at state level.', tag: 'Communication' },
  { icon: BookOpen, title: 'Literary Club', desc: 'Book discussions, creative writing workshops, school magazine editing, and national essay competitions.', tag: 'Literature' },
  { icon: Cpu, title: 'Science & Computer Club', desc: 'Hands-on scientific models, computer coding workshops, tech exhibitions, and inter-school science competitions.', tag: 'Science & IT' },
  { icon: Leaf, title: 'Eco & Nature Club', desc: 'School garden maintenance, environmental awareness campaigns, and district-level eco science fairs.', tag: 'Environment' },
];

const DEFAULT_SPORTS = [
  { name: 'Athletics (Track & Field)', icon: Activity, detail: '400m track, sprint, relay, long jump, high jump — with NIS-certified coaches.' },
  { name: 'Cricket', icon: Trophy, detail: 'Year-round cricket nets, district U-16 teams, and state inter-school tournaments.' },
  { name: 'Football', icon: Trophy, detail: 'Full-size turf ground, inter-house leagues, and district championship squads.' },
  { name: 'Taekwondo & Martial Arts', icon: Dumbbell, detail: 'Certified black-belt instruction, indoor dojo, state gold medal holders.' },
  { name: 'Volleyball & Badminton', icon: Activity, detail: 'Synthetic courts, coached sessions, and state under-14 representation.' },
  { name: 'Yoga & Fitness', icon: Dumbbell, detail: 'Daily morning yoga, flexibility training, and stress management for all grades.' },
];

const DEFAULT_ARTS = [
  { year: 'Tarangini (Annual Day)', desc: 'Grand cultural evening with drama, dance, music, fashion show, and talent awards — over 500 performers each year.' },
  { year: 'Republic Day Programme', desc: 'Patriotic stage performances, flag hoisting, special assembly, and certificate distribution for achievers.' },
  { year: 'Diwali & Ugadi Celebrations', desc: 'Cultural unity programmes celebrating major Indian festivals with rangoli, food fairs, and art competitions.' },
  { year: 'Science Mela & Expo', desc: 'Annual school-wide science fair with working models, experiments, and a public showcase for parents.' },
];

const DEFAULT_CLUBS = [
  { name: 'Computer & Coding Club', members: '45+ Members', meets: 'Every Saturday', lead: 'Mr. Anand Kumar (CS Dept.)' },
  { name: 'Nature & Ecology Club', members: '38 Members', meets: 'Every Thursday', lead: 'Ms. Radha Iyer (Biology)' },
  { name: 'Debate & MUN Club', members: '52 Members', meets: 'Tuesdays & Fridays', lead: 'Mr. Venkata Rao (English)' },
  { name: 'Literary & Magazine Club', members: '30 Members', meets: 'Every Wednesday', lead: 'Ms. Sunita Bose (Language)' },
  { name: 'Art & Photography Club', members: '27 Members', meets: 'Every Saturday', lead: 'Ms. Kavitha Nair (Fine Arts)' },
  { name: 'Taekwondo & Fitness Club', members: '60 Members', meets: 'Daily (Morning)', lead: 'Mr. Rajesh Shetty (NIS Coach)' },
];

export const StudentLifePage: React.FC<StudentLifePageProps> = ({
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const [pageData, setPageData] = useState<CmsPageWithSections | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPageWithSections('student-life')
      .then((data) => {
        if (isMounted && data) {
          setPageData(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load student-life page data:', err);
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
  const heroSection = sectionMap.get('student_life.hero');
  const heroHeading = heroSection?.heading || 'Vibrant Student Life at AMAA';
  const heroSubheading =
    heroSection?.subheading ||
    'Education at AMAA extends far beyond textbooks. We nurture athletes, artists, debaters, coders, and creators — building whole human beings who lead with character.';

  // Section 2: Activities
  const activitiesSection = sectionMap.get('student_life.activities');
  const activitiesHeading = activitiesSection?.heading || 'Activities & Programmes';
  const activitiesList = useMemo(() => {
    if (activitiesSection?.items && activitiesSection.items.length > 0) {
      return activitiesSection.items.map((item, idx) => {
        const fallback = DEFAULT_ACTIVITIES[idx] || DEFAULT_ACTIVITIES[0];
        return {
          icon: fallback.icon,
          title: item.title || fallback.title,
          desc: item.description || fallback.desc,
          tag: item.badge || fallback.tag,
        };
      });
    }
    return DEFAULT_ACTIVITIES;
  }, [activitiesSection]);

  // Section 3: Sports
  const sportsSection = sectionMap.get('student_life.sports');
  const sportsHeading = sportsSection?.heading || 'Athletics & Sports';
  const sportsList = useMemo(() => {
    if (sportsSection?.items && sportsSection.items.length > 0) {
      return sportsSection.items.map((item, idx) => {
        const fallback = DEFAULT_SPORTS[idx] || DEFAULT_SPORTS[0];
        return {
          name: item.title || fallback.name,
          icon: fallback.icon,
          detail: item.description || fallback.detail,
        };
      });
    }
    return DEFAULT_SPORTS;
  }, [sportsSection]);

  // Section 4: Arts & Culture
  const artsSection = sectionMap.get('student_life.arts');
  const artsHeading = artsSection?.heading || 'Arts & Cultural Programmes';
  const artsList = useMemo(() => {
    if (artsSection?.items && artsSection.items.length > 0) {
      return artsSection.items.map((item, idx) => {
        const fallback = DEFAULT_ARTS[idx] || DEFAULT_ARTS[0];
        return {
          year: item.title || fallback.year,
          desc: item.description || fallback.desc,
        };
      });
    }
    return DEFAULT_ARTS;
  }, [artsSection]);

  // Section 5: Clubs
  const clubsSection = sectionMap.get('student_life.clubs');
  const clubsHeading = clubsSection?.heading || 'Clubs & Interest Groups';
  const clubsList = useMemo(() => {
    if (clubsSection?.items && clubsSection.items.length > 0) {
      return clubsSection.items.map((item, idx) => {
        const fallback = DEFAULT_CLUBS[idx] || DEFAULT_CLUBS[0];
        return {
          name: item.title || fallback.name,
          members: item.badge || fallback.members,
          meets: item.subtitle || fallback.meets,
          lead: item.description || fallback.lead,
        };
      });
    }
    return DEFAULT_CLUBS;
  }, [clubsSection]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-[90%] mx-auto px-2 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onNavigateRoute('home')}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#354024] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Homepage</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-[#354024] cursor-pointer" onClick={() => onNavigateRoute('home')}>Home</span>
            <span>/</span>
            <span className="text-[#354024] font-bold">Student Life</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#252d19] text-white py-16 lg:py-24 px-4 overflow-hidden border-b border-[#141a0e]">
        <div className="w-[90%] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-5">
            <Sparkles className="w-4 h-4 text-[#cfbb99]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#cfbb99]">Beyond the Classroom</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-crest max-w-4xl">
            <TextReveal>{heroHeading}</TextReveal>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            {heroSubheading}
          </p>

          {/* Section anchors */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { id: 'activities', label: 'Activities' },
              { id: 'sports', label: 'Sports' },
              { id: 'arts', label: 'Arts & Culture' },
              { id: 'clubs', label: 'Clubs' },
              { id: 'gallery', label: 'Gallery' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVITIES ────────────────────────────────────── */}
      <section id="activities" className="w-[90%] mx-auto px-2 sm:px-4 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
            <Star className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">Co-curricular Enrichment</span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#1b2213]">{activitiesHeading}</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">Holistic development through clubs, creative arts, competitions, and environmental stewardship.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activitiesList.map((act, idx) => {
            const Icon = act.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-card hover:border-[#354024]/40 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#354024]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#354024]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#354024] bg-[#354024]/10 border border-[#354024]/20 px-3 py-1 rounded-full">
                    {act.tag}
                  </span>
                </div>
                <h3 className="font-crest font-bold text-lg text-[#1b2213] mb-2">{act.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{act.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── SPORTS ────────────────────────────────────────── */}
      <section id="sports" className="bg-[#141a0e] text-white py-16 lg:py-20 border-y border-[#252d19]">
        <div className="w-[90%] mx-auto px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-3">
              <Trophy className="w-3.5 h-3.5 text-[#cfbb99]" />
              <span className="text-[11px] font-bold tracking-widest text-[#cfbb99] uppercase">Physical Education & Athletics</span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-white">{sportsHeading}</h2>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl">Building grit, teamwork, and lifelong fitness through competitive and recreational sports programmes.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportsList.map((sp, idx) => {
              const Icon = sp.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:border-white/25 hover:bg-white/8 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#cfbb99]" />
                  </div>
                  <h3 className="font-crest font-bold text-lg text-white mb-2">{sp.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{sp.detail}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ARTS & CULTURE ────────────────────────────────── */}
      <section id="arts" className="w-[90%] mx-auto px-2 sm:px-4 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
            <Music2 className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">Annual Cultural Calendar</span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#1b2213]">{artsHeading}</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">AMAA celebrates India's rich artistic heritage while nurturing modern creative expression through year-round cultural programming.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {artsList.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-card hover:border-[#354024]/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[#354024] shrink-0" />
                <h4 className="font-crest font-bold text-[#1b2213] text-base">{item.year}</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Authentic School Life & Activity strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { src: '/gallery/jai00447.webp', label: 'NCC Cadet March Past' },
            { src: '/gallery/jai00486.webp', label: 'Disaster Safety Drill' },
            { src: '/gallery/jai00385.webp', label: 'Smart Digital Class' },
            { src: '/gallery/jai00343.webp', label: 'IT Workstation Lab' },
          ].map((item, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden h-48 group shadow-card bg-slate-900 border border-slate-200">
              <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold truncate">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLUBS ─────────────────────────────────────────── */}
      <section id="clubs" className="bg-white border-y border-slate-200 py-16 lg:py-20">
        <div className="w-[90%] mx-auto px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
              <Users className="w-3.5 h-3.5 text-[#cfbb99]" />
              <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">Student Clubs & Societies</span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#1b2213]">{clubsHeading}</h2>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl">Six active student-led clubs meeting regularly, open to all students from Grades V onwards.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clubsList.map((club, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                whileHover={{ y: -3 }}
                className="bg-[#f8f9fa] border border-slate-200/90 rounded-2xl p-6 hover:border-[#354024]/40 transition-all"
              >
                <h4 className="font-bold text-[#1b2213] text-sm mb-3">{club.name}</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#354024] shrink-0" />
                    <span>{club.members}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-[#cfbb99] shrink-0" />
                    <span>Meets: {club.meets}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#354024] shrink-0" />
                    <span>{club.lead}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────────── */}
      <div id="gallery">
        {/* Section header overlay before the GalleryPage renders */}
        <div className="w-[90%] mx-auto px-2 sm:px-4 pt-16 pb-6">
          <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
            <Camera className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">Photo Gallery</span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl font-extrabold text-[#1b2213]">Campus Life in Pictures</h2>
          <p className="text-slate-600 text-sm mt-2">Browse highlights from academics, sports, cultural events, and everyday life at AMAA.</p>
        </div>
        {/* Embed the full Gallery component without its header/hero */}
        <GalleryPage onNavigateRoute={onNavigateRoute} embedded />
      </div>

      {/* Admissions CTA */}
      <div className="w-[90%] mx-auto px-2 sm:px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#252d19] text-white rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#cfbb99] mb-2">Become Part of AMAA</div>
            <h3 className="font-crest text-2xl sm:text-3xl font-bold text-white">Join a School Where Life Happens in Full Colour</h3>
            <p className="text-sm text-slate-200 mt-2 max-w-lg">Admissions open for Grades VI to Grade X — Academic Session 2025–26.</p>
          </div>
          <button
            onClick={onOpenAdmission}
            className="shrink-0 inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-8 py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <span>Apply for 2025–26</span>
            <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
