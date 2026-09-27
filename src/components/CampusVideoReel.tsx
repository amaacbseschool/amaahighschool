import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Sparkles,
  Clock,
  Images,
  Maximize2,
  X,
  ChevronRight,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';

interface CampusVideoReelProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

interface CampusSpotlight {
  id: string;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
}

export const CampusVideoReel: React.FC<CampusVideoReelProps> = ({
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const spotlights: CampusSpotlight[] = [
    {
      id: 'aerial',
      image: '/gallery/jai00311.webp',
      badge: '15-Acre Sanctuary',
      title: 'Panoramic Campus Quadrangle & Academic Wings',
      subtitle: 'Main Block • Assembly Courtyard • Green Perimeter',
      description: 'Lush tree-lined academic blocks, multi-story smart classrooms, and spacious assembly grounds hosting morning prayers and annual celebrations.',
    },
    {
      id: 'classroom',
      image: '/gallery/jai00385.webp',
      badge: 'Academic Excellence',
      title: 'Secondary Classroom & Conceptual Learning',
      subtitle: 'Grades VI to X • Mentor-Led Instruction',
      description: 'Interactive high school classrooms structured for focused peer learning, board exam rigor, and individualized mentorship.',
    },
    {
      id: 'lab',
      image: '/gallery/jai00343.webp',
      badge: 'Academic Hub',
      title: 'Digital Computer & Science Laboratories',
      subtitle: 'Hands-on Coding • Experimental Discovery',
      description: 'High-speed networked computer workstations, interactive software, and dedicated science apparatus for applied experiential learning.',
    },
    {
      id: 'ncc',
      image: '/gallery/jai00447.webp',
      badge: 'Leadership & Discipline',
      title: 'National Cadet Corps (NCC) Ceremonial Platoon',
      subtitle: 'Junior Division Cadets • National Pride',
      description: 'Parade drills, discipline training, and character-building outdoor exercises under experienced unit commanding officers.',
    },
    {
      id: 'sports',
      image: '/gallery/jai00329.webp',
      badge: 'Athletics & Play',
      title: 'Expansive Natural Turf Sports Grounds',
      subtitle: 'Cricket Nets • Athletics Track • Scenic Hill Vista',
      description: 'Championship athletic grounds surrounded by scenic hill vistas, nurturing physical fitness, sportsmanship, and teamwork.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<CampusSpotlight | null>(null);

  const dailySchedule = [
    {
      time: '08:15 AM',
      period: 'Morning Assembly & Anthem',
      desc: 'Whole-school prayer, thought for the day, and choral rendition of "Lead Kindly Light".',
      tag: 'Heritage & Values',
    },
    {
      time: '10:30 AM',
      period: 'Science & Computer Lab Discovery',
      desc: 'Secondary students designing autonomous rover micro-controllers and running physics simulations.',
      tag: 'Hands-on Science',
    },
    {
      time: '01:15 PM',
      period: 'Grand Library Research Carrels',
      desc: 'Quiet reading, literary exploration, and scientific periodical research in our 25,000-volume sanctuary.',
      tag: 'Intellectual Growth',
    },
    {
      time: '03:45 PM',
      period: 'Athletics, Cricket & Taekwondo',
      desc: 'Coached training on our regulation 400m track, martial arts dojo, and cricket practice nets.',
      tag: 'Physical Excellence',
    },
  ];

  const current = spotlights[activeIndex];

  const handleExploreGallery = () => {
    if (onNavigateRoute) {
      onNavigateRoute('gallery');
    } else {
      const el = document.getElementById('gallery');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#07111e] text-white border-b border-slate-800 relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#0284c7]/20 rounded-full blur-3xl pointer-events-none" />

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
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-3 backdrop-blur-xs">
              <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="text-[11px] font-bold tracking-widest text-[#38bdf8] uppercase">
                AUTHENTIC CAMPUS PHOTO SHOWCASE
              </span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-1">
              <TextReveal>Experience Life at AMAA</TextReveal>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              Step inside our vibrant 15-acre campus. Explore authentic photographs capturing our smart classrooms, laboratory practicals, NCC cadet drills, and spirited athletic grounds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExploreGallery}
              className="inline-flex items-center gap-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <Images className="w-4 h-4 text-[#daa520]" />
              <span>EXPLORE ALL 38 PHOTOS</span>
            </button>
          </div>
        </motion.div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Photographic Spotlight Showcase (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col space-y-4"
          >
            {/* Main Interactive Photo Card */}
            <div
              onClick={() => setLightboxPhoto(current)}
              className="group relative h-[380px] sm:h-[440px] bg-slate-900 border border-white/15 rounded-3xl hover:border-[#0284c7]/60 transition-all duration-300 overflow-hidden cursor-pointer shadow-2xl flex flex-col justify-between p-6 sm:p-8"
            >
              {/* Background Photo */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-0 overflow-hidden"
                >
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111e] via-[#07111e]/40 to-black/30" />
                </motion.div>
              </AnimatePresence>

              {/* Top Bar inside Card */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="bg-[#07111e]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-[#38bdf8] text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#daa520]" />
                  <span>{current.badge}</span>
                </div>

                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3 text-[#38bdf8]" />
                  <span>CLICK TO EXPAND</span>
                </div>
              </div>

              {/* Bottom Information Ribbon */}
              <div className="relative z-10 pt-4 border-t border-white/20 backdrop-blur-xs bg-black/30 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
                <h3 className="font-crest text-xl sm:text-2xl font-bold text-white leading-tight">
                  {current.title}
                </h3>
                <p className="text-slate-200 text-xs sm:text-sm mt-1 leading-relaxed">
                  {current.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-[#38bdf8] font-semibold">
                  <span>{current.subtitle}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Thumbnail Selector Ribbon */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {spotlights.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative rounded-xl overflow-hidden h-16 sm:h-20 border-2 transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'border-[#38bdf8] ring-2 ring-[#38bdf8]/40 scale-102 shadow-lg'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                  }`}
                  aria-label={`View ${item.title}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] sm:text-[10px] font-bold text-white truncate drop-shadow-md text-left px-1">
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Daily Schedule Breakdown (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between backdrop-blur-xs">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#38bdf8] uppercase tracking-wider mb-2">
                  <Clock className="w-4 h-4 text-[#daa520]" />
                  <span>Student Life Routine</span>
                </div>
                <h3 className="font-crest text-2xl font-bold text-white">
                  A Typical Day at AMAA
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                  Carefully balanced between rigorous academic learning, creative inquiry, library research, and team athletic play.
                </p>
              </div>

              {/* Schedule Timeline */}
              <div className="space-y-3.5 my-6">
                {dailySchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#0284c7]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#38bdf8] font-mono">
                        {item.time}
                      </span>
                      <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                    <div className="font-crest text-sm font-bold text-white">
                      {item.period}
                    </div>
                    <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              {onOpenAdmission && (
                <button
                  onClick={onOpenAdmission}
                  className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Schedule an In-Person Campus Walkthrough
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightboxPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
                aria-label="Close photo"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={lightboxPhoto.image}
                  alt={lightboxPhoto.title}
                  className="w-full h-full max-h-[70vh] object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 text-white border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                    {lightboxPhoto.badge} • {lightboxPhoto.subtitle}
                  </span>
                  <h4 className="font-crest text-xl font-bold mt-0.5">
                    {lightboxPhoto.title}
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                    {lightboxPhoto.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLightboxPhoto(null);
                    handleExploreGallery();
                  }}
                  className="shrink-0 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold px-5 py-3 rounded-full uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View Full Gallery
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
