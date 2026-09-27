import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ZoomIn, Sparkles, Camera } from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';
import { SCHOOL_PHOTOS, type SchoolPhoto } from '../data/schoolGalleryData';

interface StudentLifeGalleryProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

export const StudentLifeGallery: React.FC<StudentLifeGalleryProps> = ({ onNavigateRoute }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<SchoolPhoto | null>(null);

  // Curated showcase of featured authentic photos
  const featuredIds = [
    'jai00447', // NCC March Past Drill
    'jai00343', // Computer Lab Practical
    'jai00385', // Smart Class Multimedia
    'jai00368', // School Reading Room
    'jai00311', // Aerial Campus Panorama
    'jai00486', // Fire Safety Assembly
    'jai00501', // Student Police Cadets
    'jai00392', // Honours & Trophy Cabinet
    'jai00329', // Athletic Sports Ground
  ];

  const showcaseItems = SCHOOL_PHOTOS.filter((p) => featuredIds.includes(p.id));

  const categories = ['All', 'NCC & Cadets', 'Academics & Labs', 'Campus & Grounds', 'Events & Safety'];

  const filteredItems =
    activeCategory === 'All'
      ? showcaseItems
      : showcaseItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#f8f9fa] border-b border-slate-200 relative">
      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
              <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">
                AUTHENTIC VISUAL CHRONICLE
              </span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a192f] tracking-tight mt-1">
              <TextReveal>Life &amp; Learning at AMAA</TextReveal>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
              Real moments from our 15-acre campus: smart interactive classrooms, high-tech IT suites, NCC ceremonial march-past, and disaster preparedness assemblies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white border border-slate-200 p-1.5 rounded-full shadow-subtle">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#354024] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#354024] hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {onNavigateRoute && (
              <button
                onClick={() => onNavigateRoute('gallery')}
                className="inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-subtle hover:shadow-md transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>EXPLORE ALL 38 PHOTOS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#cfbb99]" />
              </button>
            )}
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedPhoto(item)}
              className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-card bg-slate-900 border border-slate-200/90 hover:shadow-xl hover:border-[#354024]/40 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-95 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/95 via-[#0a192f]/30 to-transparent" />

              {/* Category Pill Tag */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#354024] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {item.badge}
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#354024] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Text info bottom */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[10px] font-bold text-[#cfbb99] uppercase tracking-widest mb-1">
                  {item.category}
                </div>
                <h4 className="font-crest text-base sm:text-lg font-bold leading-snug group-hover:text-white transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigateRoute?.('gallery')}
            className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-bold px-7 py-3 rounded-full text-xs uppercase tracking-wider shadow-card hover:shadow-lg transition-all cursor-pointer group"
          >
            <span>Browse Full Campus Archives ({SCHOOL_PHOTOS.length} high-res photographs)</span>
            <ArrowRight className="w-4 h-4 text-[#354024] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden border border-slate-200 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-80 sm:h-[460px] bg-black">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#354024] uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-[#cfbb99]" />
                    <span>{selectedPhoto.badge} • {selectedPhoto.category}</span>
                  </div>
                  <h3 className="font-crest text-xl font-bold text-[#0a192f]">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
                    {selectedPhoto.caption}
                  </p>
                </div>

                {onNavigateRoute && (
                  <button
                    onClick={() => {
                      setSelectedPhoto(null);
                      onNavigateRoute('gallery');
                    }}
                    className="shrink-0 inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    <span>View in Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
