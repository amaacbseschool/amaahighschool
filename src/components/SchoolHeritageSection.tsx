import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Award,
  Users,
  ShieldCheck,
  Images,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import { AnimatedCounter } from './motion/AnimatedCounter';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';
import type { CmsSectionWithItems } from '../types/cms';

interface SchoolHeritageSectionProps {
  cmsSection?: CmsSectionWithItems;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

const DEFAULT_PILLARS = [
  {
    title: 'Rooted in Values',
    desc: 'Guided by our sacred motto "Lead Kindly Light", character formation and ethical integrity accompany every academic triumph.',
    icon: ShieldCheck,
    iconColor: 'text-[#354024]',
    badgeColor: 'bg-[#354024]/10 text-[#354024]',
  },
  {
    title: 'Academic Distinction',
    desc: 'Unbroken tradition of 100% board pass results, state merit ranks, and Olympiad medals over multiple decades.',
    icon: Award,
    iconColor: 'text-[#dc2626]',
    badgeColor: 'bg-[#dc2626]/10 text-[#dc2626]',
  },
  {
    title: 'Global Alumni Legacy',
    desc: 'Our graduates thrive across top institutions like AIIMS, Google DeepMind, Indian Administrative Services, and the Armed Forces.',
    icon: Users,
    iconColor: 'text-[#354024]',
    badgeColor: 'bg-[#354024]/10 text-[#354024]',
  },
  {
    title: 'Compassionate Mentorship',
    desc: 'A dedicated 1:20 educator ratio ensures that every child receives individualized encouragement, empathy, and intellectual guidance.',
    icon: HeartHandshake,
    iconColor: 'text-[#cfbb99]',
    badgeColor: 'bg-[#cfbb99]/20 text-[#9e8760]',
  },
];

const DEFAULT_STATS = [
  { value: 60, suffix: '+', label: 'Years Heritage' },
  { value: 100, suffix: '%', label: 'Board Pass Rate' },
  { value: 10000, suffix: '+', label: 'Global Alumni' },
];

const COLOR_MAP: Record<number, { iconColor: string; badgeColor: string }> = {
  0: { iconColor: 'text-[#354024]', badgeColor: 'bg-[#354024]/10 text-[#354024]' },
  1: { iconColor: 'text-[#dc2626]', badgeColor: 'bg-[#dc2626]/10 text-[#dc2626]' },
  2: { iconColor: 'text-[#354024]', badgeColor: 'bg-[#354024]/10 text-[#354024]' },
  3: { iconColor: 'text-[#cfbb99]', badgeColor: 'bg-[#cfbb99]/20 text-[#9e8760]' },
};

export const SchoolHeritageSection: React.FC<SchoolHeritageSectionProps> = ({
  cmsSection,
  onNavigateRoute,
}) => {
  const eyebrow = cmsSection?.eyebrow || 'DIAMOND JUBILEE • 60 YEARS OF EXCELLENCE';
  const heading = cmsSection?.heading || 'School Heritage & Founding Ethos';
  const subheading =
    cmsSection?.subheading ||
    'Since 1965, A.M.A. Adinarayana English Medium High School has illuminated young minds under the timeless invocation "Lead Kindly Light". We combine traditional moral fortitude with contemporary academic excellence.';
  const imageUrl = cmsSection?.image_url || '/gallery/jai00286.webp';
  const badgePhilosophy = cmsSection?.badge || 'Tamaso Ma Jyotirgamaya';
  const ctaText = cmsSection?.cta_text || 'EXPLORE PHOTO ARCHIVES';
  const secondaryCtaText = cmsSection?.secondary_cta_text || 'Read Full History';

  const defaultQuote =
    '“True education is not merely the transmission of facts, but the ignition of intellect, character, and humanitarian empathy that guides an individual through life like a kindly light.”';
  const defaultQuoteAuthor = 'Institutional Motto, Estd. 1965';

  const { quoteText, quoteAuthor } = useMemo(() => {
    if (cmsSection?.content_html) {
      const parts = cmsSection.content_html.split('—');
      if (parts.length > 1) {
        return {
          quoteText: parts[0].trim(),
          quoteAuthor: parts[1].trim(),
        };
      }
      return { quoteText: cmsSection.content_html, quoteAuthor: defaultQuoteAuthor };
    }
    return { quoteText: defaultQuote, quoteAuthor: defaultQuoteAuthor };
  }, [cmsSection]);

  const statItems = useMemo(() => {
    if (cmsSection?.items && cmsSection.items.length >= 3) {
      const stats = cmsSection.items.slice(0, 3);
      return stats.map((st, idx) => {
        const rawBadge = (st.badge || '').trim();
        const numMatch = rawBadge.match(/^([0-9,]+)(.*)$/);
        const fallback = DEFAULT_STATS[idx];
        const numVal = numMatch ? parseInt(numMatch[1].replace(/,/g, ''), 10) : fallback.value;
        const suffix = numMatch ? numMatch[2] : fallback.suffix;
        return {
          value: numVal,
          suffix,
          label: st.title || fallback.label,
        };
      });
    }
    return DEFAULT_STATS;
  }, [cmsSection]);

  const heritagePillars = useMemo(() => {
    if (cmsSection?.items && cmsSection.items.length >= 7) {
      const pillars = cmsSection.items.slice(3, 7);
      return pillars.map((p, idx) => {
        const fallback = DEFAULT_PILLARS[idx];
        const colors = COLOR_MAP[idx % 4];
        return {
          title: p.title || fallback.title,
          desc: p.description || fallback.desc,
          icon: fallback.icon,
          iconColor: colors.iconColor,
          badgeColor: colors.badgeColor,
        };
      });
    }
    return DEFAULT_PILLARS;
  }, [cmsSection]);

  return (
    <section id="heritage" className="py-20 lg:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Decorative ambient blue light */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#354024]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2213] tracking-tight">
            <TextReveal>{heading}</TextReveal>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
            {subheading}
          </p>
        </motion.div>

        {/* Unboxed Editorial Showcase Layout */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Photographic Archival Visual (5 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img
                  src={imageUrl}
                  alt="A.M.A. Adinarayana High School Campus Quadrangle"
                  className="w-full h-[380px] sm:h-[440px] lg:h-[500px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <div className="inline-flex items-center gap-2 bg-black/65 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-lg">
                    <img src={logoImg} alt="Crest" className="w-5 h-5 object-contain" />
                    <span className="text-[11px] font-bold text-white tracking-widest uppercase">
                      ESTD. 1965
                    </span>
                  </div>
                  <span className="bg-[#dc2626] text-white text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    60 YEARS
                  </span>
                </div>

                {/* Bottom Archival Caption */}
                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-white">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#cfbb99] uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
                      <span>Diamond Jubilee Milestone</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      Sixty uninterrupted years of academic distinction, ethical leadership, and character formation.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Editorial Content & Ethos directly on page (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col justify-center space-y-6"
            >
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-2 text-xs font-bold text-[#354024] uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#354024]" />
                  <span>FOUNDING ETHOS & PHILOSOPHY</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-normal">{badgePhilosophy}</span>
                </div>

                {/* Main Heading */}
                <h3 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2213] tracking-tight leading-tight">
                  “Lead Kindly Light”
                </h3>
                <p className="text-xs font-semibold text-[#cfbb99] tracking-wider uppercase mt-1.5">
                  The Sacred Inscription of A.M.A. Adinarayana
                </p>
              </div>

              {/* Editorial Quote */}
              <div className="relative pl-6 border-l-4 border-[#354024] py-1">
                <p className="font-serif text-base sm:text-lg text-slate-700 italic leading-relaxed">
                  {quoteText}
                </p>
                <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  — {quoteAuthor}
                </div>
              </div>

              {/* 3 Metric Stats with Clean Dividers */}
              <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-200">
                <div className="text-left">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#354024] font-modern">
                    <AnimatedCounter value={statItems[0].value} suffix={statItems[0].suffix} />
                  </div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                    {statItems[0].label}
                  </div>
                </div>

                <div className="text-left border-l border-slate-200 pl-4 sm:pl-6">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#1b2213] font-modern">
                    <AnimatedCounter value={statItems[1].value} suffix={statItems[1].suffix} />
                  </div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                    {statItems[1].label}
                  </div>
                </div>

                <div className="text-left border-l border-slate-200 pl-4 sm:pl-6">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#cfbb99] font-modern">
                    <AnimatedCounter value={statItems[2].value} suffix={statItems[2].suffix} />
                  </div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">
                    {statItems[2].label}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    if (onNavigateRoute) {
                      onNavigateRoute('gallery');
                    } else {
                      const el = document.getElementById('gallery');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group inline-flex items-center gap-2.5 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Images className="w-4 h-4 text-white" />
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {onNavigateRoute && (
                  <button
                    onClick={() => onNavigateRoute('about')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1b2213] hover:text-[#354024] uppercase tracking-wider transition-colors py-3.5 px-4 cursor-pointer"
                  >
                    <span>{secondaryCtaText}</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4 Core Heritage Pillars - Clean Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-200">
          {heritagePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${pillar.iconColor}`} />
                  </div>
                  <h4 className="font-crest text-base font-bold text-[#1b2213] group-hover:text-[#354024] transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-[#354024] transition-colors">
                  <span>Pillar 0{idx + 1}</span>
                  <span className="text-[#354024] font-bold">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

