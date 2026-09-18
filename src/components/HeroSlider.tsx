import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Monitor,
  Users,
  Bus,
  Flower2,
  FlaskConical,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HeroSliderProps {
  onOpenAdmission: () => void;
  onExploreCampus: () => void;
}

interface Slide {
  image: string;
  badge: string;
  titlePrefix: string;
  titleAccent: string;
  subtitle: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenAdmission, onExploreCampus }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop',
      badge: 'Academic Session 2025–2026 Admissions Open',
      titlePrefix: 'Inspiring Excellence,',
      titleAccent: 'Building Futures',
      subtitle: 'At AMAA High School, we nurture young minds with strong moral values, modern experiential learning, and boundless opportunities to lead.',
    },
    {
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
      badge: 'CBSE Affiliated Comprehensive Curriculum',
      titlePrefix: 'Empowering Young Minds,',
      titleAccent: 'Shaping Leaders',
      subtitle: 'Cultivating analytical thinking, scientific curiosity, and artistic creativity with world-class faculty and student-centric pedagogy.',
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop',
      badge: 'World-Class 15-Acre Green Campus',
      titlePrefix: 'Holistic Growth,',
      titleAccent: 'Limitless Horizons',
      subtitle: 'State-of-the-art sports complex, robotics research centres, and digital classrooms designed to unlock every child’s highest potential.',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const featurePillars = [
    {
      icon: Monitor,
      title: 'Smart Classrooms',
      desc: 'Technology-enabled learning for all',
    },
    {
      icon: Users,
      title: 'Experienced Faculty',
      desc: 'Qualified mentors who inspire',
    },
    {
      icon: Bus,
      title: 'Safe Transport',
      desc: 'GPS-enabled buses for secure travel',
    },
    {
      icon: Flower2,
      title: 'Holistic Development',
      desc: 'Mind • Body • Values balanced growth',
    },
    {
      icon: FlaskConical,
      title: 'Modern Labs',
      desc: 'Well-equipped labs for practical learning',
    },
  ];

  return (
    <div className="relative bg-[#07261d] overflow-hidden">
      {/* Main Hero Viewport */}
      <div className="relative min-h-[560px] md:min-h-[640px] lg:min-h-[700px] flex items-center">
        {/* Background Slide Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slides[currentSlide].image}
              alt="AMAA High School Campus"
              className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105"
            />
            {/* Elegant deep green gradients matching reference */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#06241a]/95 via-[#093326]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06241a] via-transparent to-[#06241a]/60" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Pill Badge */}
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-emerald-950/70 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full mb-6 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{slides[currentSlide].badge}</span>
            </motion.div>

            {/* Typography */}
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-crest text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]"
            >
              {slides[currentSlide].titlePrefix}{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 italic font-serif">
                {slides[currentSlide].titleAccent}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              key={`sub-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-emerald-100/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={onOpenAdmission}
                className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-7 py-3.5 rounded-lg shadow-xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm tracking-wider uppercase"
              >
                <span>ADMISSION OPEN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreCampus}
                className="group inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-7 py-3.5 rounded-lg border border-white/30 hover:border-white/60 transition-all duration-300 text-xs sm:text-sm tracking-wider uppercase"
              >
                <span>EXPLORE CAMPUS</span>
                <ArrowRight className="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating 5 Key Pillars Highlight Bar (Exact match to reference design) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 mb-6">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-3 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-200">
            {featurePillars.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3.5 p-3 sm:p-4 rounded-xl hover:bg-[#f4f8f5] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#093326]/10 text-[#093326] flex items-center justify-center shrink-0 border border-[#093326]/15 group-hover:bg-[#093326] group-hover:text-amber-300 transition-colors">
                    <Icon className="w-6 h-6 text-[#093326]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                      {pill.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {pill.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
