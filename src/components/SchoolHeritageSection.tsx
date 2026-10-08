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
  Landmark,
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
  { value: 60, suffix: '+', label: 'Years Heritage', sublabel: 'Six uninterrupted decades of transformative education since 1965' },
  { value: 100, suffix: '%', label: 'Board Pass Rate', sublabel: 'Consistently exceptional Class X state board results' },
  { value: 10000, suffix: '+', label: 'Global Alumni', sublabel: 'Leaders across medicine, technology, IAS and public service' },
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
          sublabel: st.description || fallback.sublabel,
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
      {/* Decorative ambient ambient gradients */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#354024]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-24 w-96 h-96 bg-[#cfbb99]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[92%] max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* 1. SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2213] tracking-tight">
            <TextReveal>{heading}</TextReveal>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl mx-auto">
            {subheading}
          </p>
        </motion.div>

        {/* 2. GRAND FULL-SIZE PHOTO ARCHITECTURAL SHOWCASE (NOT A SQUEEZED CARD) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-16 sm:mb-20"
        >
          <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl border border-slate-200/90 group bg-slate-950">
            {/* The Landscape Architectural Photograph in Full Glory */}
            <img
              src={imageUrl}
              alt="A.M.A. Adinarayana High School Historic Quadrangle and Academic Block"
              className="w-full h-[360px] sm:h-[480px] md:h-[560px] lg:h-[640px] object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-103"
            />

            {/* Depth Vignette & Atmospheric Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/40 pointer-events-none" />

            {/* Top Heritage Badges */}
            <div className="absolute top-4 sm:top-7 left-4 sm:left-7 right-4 sm:right-7 flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg">
                <img src={logoImg} alt="Crest" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                <span className="text-xs sm:text-sm font-bold text-white tracking-widest uppercase">
                  ESTD. 1965
                </span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-xs text-[#cfbb99] font-medium hidden sm:inline">
                  Historic Quadrangle
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-[#dc2626] text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  60 YEARS OF EXCELLENCE
                </span>
              </div>
            </div>

            {/* Bottom Panoramic Plaque / Caption Ribbon */}
            <div className="absolute bottom-4 sm:bottom-7 left-4 sm:left-7 right-4 sm:right-7 z-10">
              <div className="bg-black/65 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#cfbb99] uppercase tracking-wider mb-1">
                    <Landmark className="w-4 h-4 text-[#cfbb99]" />
                    <span>Main Academic Quadrangle & Grounds • Estd. 1965</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-3xl">
                    Six uninterrupted decades of academic distinction, disciplined character formation, and ethical leadership in North Coastal Andhra Pradesh.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      if (onNavigateRoute) {
                        onNavigateRoute('gallery');
                      } else {
                        const el = document.getElementById('gallery');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-[#1b2213] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    <Images className="w-4 h-4" />
                    <span>View Archives</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. EDITORIAL NARRATIVE & METRICS SPREAD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
          {/* Left: Ethos, Sacred Quote & Actions (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#354024] uppercase tracking-wider mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#354024]" />
                <span>FOUNDING ETHOS & PHILOSOPHY</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">{badgePhilosophy}</span>
              </div>

              <h3 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2213] tracking-tight leading-tight">
                “Lead Kindly Light”
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#9e8760] tracking-wider uppercase mt-1.5">
                The Sacred Inscription & Moral Compass of A.M.A. Adinarayana
              </p>
            </div>

            {/* Editorial Quote */}
            <div className="relative pl-6 sm:pl-8 border-l-4 border-[#354024] py-2 bg-slate-50/70 rounded-r-2xl">
              <p className="font-serif text-base sm:text-lg lg:text-xl text-slate-800 italic leading-relaxed">
                {quoteText}
              </p>
              <div className="mt-3 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                — {quoteAuthor}
              </div>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Founded under the benevolent patronage of A.M.A. Adinarayana, the institution has stood for sixty uninterrupted years as an enduring beacon of intellectual vigor, disciplined values, and holistic human growth.
            </p>

            {/* CTAs */}
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
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1b2213] hover:text-[#354024] uppercase tracking-wider transition-colors py-3.5 px-4 cursor-pointer"
                >
                  <span>{secondaryCtaText}</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Right: Key Verified Statistics Cards (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[#fbf9f5] border border-[#cfbb99]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <span className="text-xs font-bold text-[#354024] uppercase tracking-wider">
                Institutional Milestones
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Verified Records
              </span>
            </div>

            {statItems.map((stat, idx) => (
              <div
                key={idx}
                className={`${idx !== statItems.length - 1 ? 'border-b border-slate-200/70 pb-5' : ''}`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2213] font-modern">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#354024] uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                {stat.sublabel && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {stat.sublabel}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* 4. FOUR CORE HERITAGE PILLARS */}
        <div className="pt-10 border-t border-slate-200">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#354024]">
              Foundations of Character
            </span>
            <h4 className="font-crest text-2xl sm:text-3xl font-extrabold text-[#1b2213] mt-1">
              Four Pillars of Our Educational Journey
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="p-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-300 flex flex-col justify-between group shadow-subtle hover:shadow-md"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100/90 border border-slate-200/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className={`w-5 h-5 ${pillar.iconColor}`} />
                    </div>
                    <h5 className="font-crest text-lg font-bold text-[#1b2213] group-hover:text-[#354024] transition-colors">
                      {pillar.title}
                    </h5>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-[#354024] transition-colors">
                    <span>Pillar 0{idx + 1}</span>
                    <span className="text-[#354024] font-bold text-sm">→</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
