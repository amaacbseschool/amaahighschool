import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';
import type { CmsSectionWithItems } from '../types/cms';

interface TestimonialsSectionProps {
  cmsSection?: CmsSectionWithItems;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

interface Testimonimonial {
  id: number;
  name: string;
  role: string;
  category: 'Parents' | 'Alumni' | 'Students';
  tag: string;
  batchOrGrade: string;
  rating: number;
  content: string;
  avatarBg: string;
  initials: string;
}

const DEFAULT_TESTIMONIALS: Testimonimonial[] = [
  {
    id: 1,
    name: 'Dr. Priya Sharma, MBBS, MS',
    role: 'Senior Consultant Cardiologist, AIIMS New Delhi',
    category: 'Alumni',
    tag: 'Healthcare Leader',
    batchOrGrade: 'Alumna • Batch of 2012',
    rating: 5,
    content:
      'AMAA High School provided the bedrock of disciplined scientific inquiry, analytical rigor, and human empathy that defines my medical practice today. The science faculty laid foundations that carried me through AIIMS.',
    avatarBg: 'bg-[#354024]',
    initials: 'PS',
  },
  {
    id: 2,
    name: 'Mr. Rajesh & Dr. Sunita Kulkarni',
    role: 'Parents of Rohan Kulkarni (Grade IX)',
    category: 'Parents',
    tag: 'Parent Trust',
    batchOrGrade: 'Parent Community',
    rating: 5,
    content:
      'Enrolling our son in AMAA High School was the single best decision for his overall personality. The harmonious blend of rigorous academic curriculum, modern science and computer laboratories, and strong moral values under the motto "Lead Kindly Light" is unmatched.',
    avatarBg: 'bg-[#dc2626]',
    initials: 'RK',
  },
  {
    id: 3,
    name: 'Vikramaditya Roy, B.Tech, M.S.',
    role: 'Principal Cloud Systems Architect, Seattle, USA',
    category: 'Alumni',
    tag: 'Tech Executive',
    batchOrGrade: 'Alumnus • Batch of 2014',
    rating: 5,
    content:
      'The computer applications lab and mathematics training gave me a decade-long head start. The focus on fundamental concepts over rote learning is AMAA High School’s greatest secret.',
    avatarBg: 'bg-[#1b2213]',
    initials: 'VR',
  },
  {
    id: 4,
    name: 'Mrs. Lakshmi Narayanan',
    role: 'Mother of Ananya (Class X) & Karthik (Class VI)',
    category: 'Parents',
    tag: 'Multi-Child Trust',
    batchOrGrade: 'Parent Community',
    rating: 5,
    content:
      'What sets AMAA apart is the individual care. The 1:20 mentor ratio is not just on paper—teachers know each student by name, monitor their emotional well-being, and provide personalized extra guidance.',
    avatarBg: 'bg-[#354024]',
    initials: 'LN',
  },
  {
    id: 5,
    name: 'Sneha K. Varma',
    role: 'Class X Secondary Board State Rank 2 (98.6%)',
    category: 'Students',
    tag: 'Board Achiever',
    batchOrGrade: 'Class of 2025',
    rating: 5,
    content:
      'The teachers were always approachable for doubts even after regular hours. Regular diagnostic tests, calm encouragement, and state-of-the-art labs gave our batch the clarity to achieve 100% board distinction.',
    avatarBg: 'bg-[#1b2213]',
    initials: 'SV',
  },
];

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ cmsSection }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const eyebrow = cmsSection?.eyebrow || 'VOICES OF TRUST & EXCELLENCE';
  const heading = cmsSection?.heading || 'What Parents & Alumni Say';
  const subheading =
    cmsSection?.subheading ||
    'Discover authentic experiences from families whose children thrive at AMAA High School, and distinguished alumni making an impact across the globe.';

  const testimonials: Testimonimonial[] = useMemo(() => {
    if (cmsSection?.items && cmsSection.items.length >= 5) {
      return cmsSection.items.map((item, idx) => {
        const fallback = DEFAULT_TESTIMONIALS[idx] || DEFAULT_TESTIMONIALS[0];
        const tag = item.badge ? item.badge.split('•')[0].trim() : fallback.tag;

        return {
          id: idx + 1,
          name: item.title || fallback.name,
          role: item.subtitle || fallback.role,
          category: fallback.category,
          tag,
          batchOrGrade: fallback.batchOrGrade,
          rating: fallback.rating,
          content: item.description || fallback.content,
          avatarBg: fallback.avatarBg,
          initials: fallback.initials,
        };
      });
    }
    return DEFAULT_TESTIMONIALS;
  }, [cmsSection]);

  const categories = ['All', 'Parents', 'Alumni', 'Students'];

  const filteredTestimonials = useMemo(() => {
    return activeCategory === 'All'
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory);
  }, [testimonials, activeCategory]);

  // Reset scroll and index when category changes
  useEffect(() => {
    setActiveIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const firstChild = container.children[0] as HTMLElement;
    if (!firstChild) return;
    const itemWidth = firstChild.offsetWidth + 16; // width + gap
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex >= 0 && newIndex < filteredTestimonials.length && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const targetChild = container.children[index] as HTMLElement;
    if (targetChild) {
      targetChild.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    setActiveIndex(index);
  };

  const scrollPrev = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    } else if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (activeIndex < filteredTestimonials.length - 1) {
      scrollToIndex(activeIndex + 1);
    } else if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-28 bg-[#f8f9fa] border-b border-slate-200 relative overflow-hidden">
      <div className="w-[92%] max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
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

          {/* Category Filters */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1 sm:p-1.5 rounded-full border border-slate-200 shadow-subtle overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-[#354024] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#354024] hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile swipe hint tag */}
            <div className="flex md:hidden items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
              <MoveHorizontal className="w-3 h-3 text-[#354024]" />
              <span>Swipe</span>
            </div>
          </div>
        </motion.div>

        {/* Carousel on Mobile, Bento Grid on Desktop */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scroll-smooth pb-3 md:pb-0 -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <AnimatePresence mode="popLayout">
            {filteredTestimonials.map((t, idx) => {
              const colSpan =
                filteredTestimonials.length === 1
                  ? 'lg:col-span-12'
                  : idx === 0
                  ? 'lg:col-span-8'
                  : 'lg:col-span-4';

              const isFeatured = idx === 0;

              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:shrink md:snap-align-none ${colSpan} bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 lg:p-8 shadow-card hover:shadow-xl hover:border-[#354024]/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    {/* Top Row: Stars + Category Badge */}
                    <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#354024]/10 text-[#354024] px-2.5 sm:px-3 py-1 rounded-full">
                        {t.tag}
                      </span>
                    </div>

                    {/* Quote Text */}
                    <p
                      className={`text-slate-700 leading-relaxed italic mb-5 sm:mb-6 ${
                        isFeatured ? 'text-xs sm:text-sm lg:text-base' : 'text-xs sm:text-sm'
                      }`}
                    >
                      "{t.content}"
                    </p>
                  </div>

                  {/* Author Footer */}
                  <div className="relative z-10 pt-3.5 sm:pt-4 border-t border-slate-100 flex items-center gap-3 sm:gap-3.5">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${t.avatarBg} text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center shrink-0 shadow-md`}
                    >
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-crest text-sm sm:text-base font-bold text-[#1b2213] leading-tight truncate">
                        {t.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
                        {t.role}
                      </p>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#354024] block mt-0.5">
                        {t.batchOrGrade}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Mobile Carousel Controls: Dot Indicators + Next/Prev Arrows */}
        <div className="flex md:hidden items-center justify-between mt-3 px-1">
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {filteredTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i ? 'w-6 bg-[#354024]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrow Buttons (44px min tap target compliant) */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              disabled={activeIndex === 0}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              disabled={activeIndex === filteredTestimonials.length - 1}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verified Institution Trust Badge Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-10 sm:mt-14 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h5 className="font-crest font-bold text-[#0f172a] text-sm sm:text-base">
                Recognised by State Board • 60-Year Legacy of Parent Satisfaction
              </h5>
              <p className="text-xs text-slate-600 mt-0.5">
                Over 98% of surveyed parents recommend AMAA High School for holistic development and academic rigor.
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-200 shrink-0 shadow-subtle">
            4.9 / 5.0 Parent Rating ★
          </div>
        </motion.div>
      </div>
    </section>
  );
};
