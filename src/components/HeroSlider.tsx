import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Compass,
  Images,
  Sparkles,
} from 'lucide-react';
import type { RouteType } from '../types/routes';

interface HeroSliderProps {
  onOpenAdmission: () => void;
  onExploreCampus: () => void;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

interface Slide {
  image: string;
  badge: string;
  badgeHighlight: string;
  title: string;
  highlightText: string;
  subtitle: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onOpenAdmission,
  onExploreCampus,
  onNavigateRoute,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const slides: Slide[] = [
    {
      image: '/gallery/jai00311.webp',
      badge: 'DIAMOND JUBILEE • ESTD. 1965',
      badgeHighlight: '60 Years of Heritage',
      title: 'Empowering Young Minds,',
      highlightText: 'Shaping Tomorrow',
      subtitle:
        'Sixty years of disciplined academic excellence, ethical character, and progressive learning under our sacred motto "Lead Kindly Light".',
    },
    {
      image: '/gallery/jai00385.webp',
      badge: 'GRADES VI TO X • RECOGNISED HIGH SCHOOL BOARD',
      badgeHighlight: '100% Board Distinction',
      title: 'Inspiring Curiosity,',
      highlightText: 'Building Character',
      subtitle:
        'A world-class secondary curriculum blending deep conceptual mastery, 1:20 mentor ratio, and dedicated personal care.',
    },
    {
      image: '/gallery/jai00343.webp',
      badge: '15-ACRE GREEN CAMPUS',
      badgeHighlight: 'Modern Infrastructure',
      title: 'A Premier Sanctuary for',
      highlightText: 'Lifelong Learning',
      subtitle:
        'State-of-the-art 4K smart interactive classrooms, science discovery laboratories, and championship athletic grounds.',
    },
    {
      image: '/gallery/jai00447.webp',
      badge: 'HOLISTIC EXCELLENCE',
      badgeHighlight: '10,000+ Global Alumni',
      title: 'Excellence in Academics,',
      highlightText: 'Sports & Leadership',
      subtitle:
        'Nurturing champions in academic boards, national science olympiads, inter-school athletics, and creative arts.',
    },
  ];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  };

  const changeSlide = (getNextIndex: (current: number) => number, dir: number) => {
    setDirection(dir);
    setCurrentSlide((prev) => {
      setPreviousSlide(prev);
      return getNextIndex(prev);
    });
  };

  const nextSlide = () => {
    changeSlide((prev) => (prev + 1) % slides.length, 1);
  };

  const prevSlide = () => {
    changeSlide((prev) => (prev - 1 + slides.length) % slides.length, -1);
  };

  const goToSlide = (idx: number) => {
    if (idx === currentSlide) return;
    changeSlide(() => idx, idx > currentSlide ? 1 : -1);
  };

  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      changeSlide((prev) => (prev + 1) % slides.length, 1);
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, isAutoplay]);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between bg-slate-950 text-white overflow-hidden"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* 1. Full-Bleed Photographic Slider (Smooth Zero-Flash Crossfade) */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-slate-950">
        {slides.map((slide, idx) => {
          const isCurrent = idx === currentSlide;
          const isPrevious = idx === previousSlide;
          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isCurrent
                  ? 'opacity-100 z-10'
                  : isPrevious
                  ? 'opacity-100 z-0'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
            </div>
          );
        })}
        {/* Subtle directional vignette: ensures clean text visibility on the left without darkening the photo on the right */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/75 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
      </div>

      {/* Top spacing */}
      <div className="relative z-10 pt-10 sm:pt-14" />

      {/* 2. Main Hero Content Container */}
      <div className="relative z-10 w-[90%] mx-auto py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="max-w-2xl space-y-5"
          >
            {/* Modern Glassmorphic Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 bg-black/60 hover:bg-black/75 border border-white/25 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-white uppercase">
                {slides[currentSlide].badge}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs font-bold text-[#cfbb99]">
                {slides[currentSlide].badgeHighlight}
              </span>
            </div>

            {/* High-Impact Headline: Balanced Size, Zero Hard Shadows */}
            <h1 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.16]">
              {slides[currentSlide].title}{' '}
              <span className="text-[#cfbb99]">
                {slides[currentSlide].highlightText}
              </span>
            </h1>

            {/* Clear, Crisp Subtitle */}
            <p className="text-slate-100 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl">
              {slides[currentSlide].subtitle}
            </p>

            {/* Action Buttons: Modern Pill CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenAdmission}
                className="group inline-flex items-center justify-center gap-3 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-8 py-4 rounded-full text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <span>APPLY FOR 2025–26</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreCampus}
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-7 py-4 rounded-full border border-white/30 backdrop-blur-md text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <Compass className="w-4 h-4 text-white" />
                <span>EXPLORE CAMPUS</span>
              </button>

              <button
                onClick={() => {
                  if (onNavigateRoute) {
                    onNavigateRoute('gallery');
                  } else {
                    const el = document.getElementById('gallery');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 text-white font-bold px-6 py-4 rounded-full border border-white/20 backdrop-blur-md text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                <Images className="w-4 h-4 text-[#cfbb99]" />
                <span>PHOTO GALLERY</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Slider Controls & Trust Stats */}
      <div className="relative z-20 w-[90%] mx-auto pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 bg-black/40 backdrop-blur-md px-6 py-3.5 rounded-2xl sm:rounded-full border border-white/10 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center sm:justify-start">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
              <span className="text-[#cfbb99] font-bold">Diamond Jubilee (1965–2025)</span>
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span>1:20 Mentor Ratio</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span>100% Board Pass Record</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Slide Navigation Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx
                      ? 'bg-[#cfbb99] w-7'
                      : 'bg-white/40 hover:bg-white/70 w-2'
                  }`}
                />
              ))}
            </div>

            {/* Prev/Next arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
