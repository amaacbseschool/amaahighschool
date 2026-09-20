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
  GraduationCap,
  Compass,
  PhoneCall,
  CheckCircle2,
  Award,
  ShieldCheck,
} from 'lucide-react';

interface HeroSliderProps {
  onOpenAdmission: () => void;
  onExploreCampus: () => void;
}

interface Slide {
  image: string;
  video?: string;
  badge: string;
  titlePrefix: string;
  titleAccent: string;
  subtitle: string;
  category: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onOpenAdmission, onExploreCampus }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-4318-large.mp4',
      badge: 'Academic Session 2025–2026 Admissions Open',
      titlePrefix: 'Inspiring Excellence,',
      titleAccent: 'Building Futures',
      subtitle: 'At AMAA High School, we nurture young minds with strong moral values, modern experiential learning, and boundless opportunities to lead.',
      category: 'Campus & Infrastructure',
    },
    {
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
      badge: 'Comprehensive Curriculum (Nursery to 10th Grade)',
      titlePrefix: 'Empowering Young Minds,',
      titleAccent: 'Shaping Leaders',
      subtitle: 'Cultivating analytical thinking, scientific curiosity, and artistic creativity with world-class faculty and student-centric pedagogy.',
      category: 'Academic Pedagogy',
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop',
      badge: 'World-Class 15-Acre Modern Campus',
      titlePrefix: 'Holistic Growth,',
      titleAccent: 'Limitless Horizons',
      subtitle: 'State-of-the-art sports complex, robotics research centres, and digital classrooms designed to unlock every child’s highest potential.',
      category: 'STEM & Innovation',
    },
  ];

  const featurePillars = [
    {
      icon: Monitor,
      title: 'Smart Classrooms',
      desc: 'Interactive 4K digital displays for all',
    },
    {
      icon: Users,
      title: 'Experienced Faculty',
      desc: '100% qualified mentors who inspire',
    },
    {
      icon: Bus,
      title: 'Safe GPS Transport',
      desc: 'Real-time tracked fleet for security',
    },
    {
      icon: Flower2,
      title: 'Holistic Development',
      desc: 'Mind • Body • Values balanced growth',
    },
    {
      icon: FlaskConical,
      title: 'Modern STEM Labs',
      desc: 'Equipped robotics & science labs',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, isAutoplay]);

  return (
    <div 
      className="relative bg-[#0a192f] overflow-hidden selection:bg-blue-600 selection:text-white"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* Dynamic Ambient Background Glow Elements for Depth */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-sky-400/15 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-700/20 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Subtle fine mesh grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Main Hero Viewport */}
      <div className="relative min-h-[620px] md:min-h-[700px] lg:min-h-[760px] flex items-center">
        {/* Background Slide Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0 z-0"
          >
            {slides[currentSlide].video ? (
              <video
                key={slides[currentSlide].video}
                src={slides[currentSlide].video}
                poster={slides[currentSlide].image}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <img
                src={slides[currentSlide].image}
                alt="AMAA High School Campus"
                className="w-full h-full object-cover object-center"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Subtle Bottom Vignette to seamlessly blend with the section below */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0a192f] to-transparent pointer-events-none z-10" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 w-full">
          <div className="max-w-3xl">
            {/* Elegant Institutional Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-10 h-[2px] bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.22em] text-sky-200 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Recognised High School (Nursery to 10th Grade) • Estd. 1998
              </span>
            </motion.div>

            {/* Typography with Left Accent Architectural Line */}
            <div className="border-l-[3px] border-sky-400/80 pl-5 sm:pl-7">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
              >
                {slides[currentSlide].titlePrefix}{' '}
                <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-100 to-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                  {slides[currentSlide].titleAccent}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                key={`sub-${currentSlide}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-white/95 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
              >
                {slides[currentSlide].subtitle}
              </motion.p>
            </div>

            {/* CTAs with Glow and Shadows */}
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 pl-0 sm:pl-7"
            >
              <button
                onClick={onOpenAdmission}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#1d4ed8] to-[#0284c7] hover:from-[#1e40af] hover:to-[#0369a1] text-white font-black px-7 py-4 rounded-xl shadow-glow-blue transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl text-xs sm:text-sm tracking-wider uppercase border border-white/30"
              >
                <GraduationCap className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
                <span>ADMISSION OPEN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreCampus}
                className="group inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-7 py-4 rounded-xl border border-white/40 hover:border-white/80 transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm tracking-wider uppercase shadow-floating-card"
              >
                <Compass className="w-4 h-4 text-sky-300 group-hover:rotate-45 transition-transform" />
                <span>EXPLORE CAMPUS</span>
                <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
              </button>

              {/* Direct Helpline Quick Chip */}
              <a
                href="tel:+917544010044"
                className="hidden sm:inline-flex items-center gap-2 glass-badge hover:bg-white/20 text-sky-200 px-4 py-3.5 rounded-xl text-xs font-semibold transition-all border border-white/25 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-sky-300" />
                <span>+91 75440 10044</span>
              </a>
            </motion.div>

            {/* Institutional Trust & Accreditation Strip (Minimalist, Inline - No Cards) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-white/90 text-xs sm:text-sm font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pl-0 sm:pl-7"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Recognised High School</span>
              </div>
              <span className="hidden sm:inline text-white/30">•</span>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Exemplary A+ Rating</span>
              </div>
              <span className="hidden sm:inline text-white/30">•</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>15-Acre Smart Campus</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/60 hover:bg-blue-700/80 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all hover:scale-110 shadow-floating-card"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/60 hover:bg-blue-700/80 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all hover:scale-110 shadow-floating-card"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentSlide === idx ? 'w-9 bg-sky-300 shadow-glow-sky' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Minimalist Slide Counter (Right Aligned) */}
        <div className="absolute bottom-16 sm:bottom-20 right-6 sm:right-12 z-20 hidden md:flex items-center gap-3 text-white text-xs font-mono font-bold tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <span className="text-sky-300 text-sm">0{currentSlide + 1}</span>
          <span className="w-8 h-[1px] bg-white/40" />
          <span className="text-white/60">0{slides.length}</span>
        </div>
      </div>

      {/* Floating 5 Key Pillars Highlight Bar with Professional 3D Shadows */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 mb-6">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-pillar border border-blue-100/80 p-3 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-200/80">
            {featurePillars.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3.5 p-3 sm:p-4 rounded-xl hover:bg-sky-50/80 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#1d4ed8] flex items-center justify-center shrink-0 border border-blue-200 group-hover:bg-[#1d4ed8] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-glow-blue">
                    <Icon className="w-6 h-6 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight group-hover:text-[#1d4ed8] transition-colors">
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
