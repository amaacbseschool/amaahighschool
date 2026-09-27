import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';

interface TestimonialsSectionProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

interface Testimonial {
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

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const testimonials: Testimonial[] = [
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
      avatarBg: 'bg-[#0284c7]',
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
      avatarBg: 'bg-[#0a192f]',
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
      avatarBg: 'bg-[#0284c7]',
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
      avatarBg: 'bg-[#0a192f]',
      initials: 'SV',
    },
  ];

  const categories = ['All', 'Parents', 'Alumni', 'Students'];

  const filteredTestimonials =
    activeCategory === 'All'
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory);

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#f8f9fa] border-b border-slate-200 relative overflow-hidden">
      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0284c7]/10 border border-[#0284c7]/20 px-4 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
              <span className="text-[11px] font-bold tracking-widest text-[#0284c7] uppercase">
                VOICES OF TRUST & EXCELLENCE
              </span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a192f] tracking-tight mt-1">
              <TextReveal>What Parents & Alumni Say</TextReveal>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              Discover authentic experiences from families whose children thrive at AMAA High School, and distinguished alumni making an impact across the globe.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-subtle">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0284c7] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#0284c7] hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bento Grid for Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
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
                  className={`${colSpan} bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-card hover:shadow-xl hover:border-[#0284c7]/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    {/* Top Row: Stars + Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0284c7]/10 text-[#0284c7] px-3 py-1 rounded-full">
                        {t.tag}
                      </span>
                    </div>

                    {/* Quote Text */}
                    <p
                      className={`text-slate-700 leading-relaxed italic mb-6 ${
                        isFeatured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                      }`}
                    >
                      "{t.content}"
                    </p>
                  </div>

                  {/* Author Footer */}
                  <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 ${t.avatarBg} text-white font-bold text-sm rounded-2xl flex items-center justify-center shrink-0 shadow-md`}
                    >
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-crest text-base font-bold text-[#0a192f] leading-tight truncate">
                        {t.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {t.role}
                      </p>
                      <span className="text-[11px] font-bold text-[#0284c7] block mt-0.5">
                        {t.batchOrGrade}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Verified Institution Trust Badge Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-14 bg-white p-7 rounded-3xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-crest font-bold text-[#0f172a] text-base">
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
