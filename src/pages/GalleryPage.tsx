import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  X,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Home,
  Camera,
  Search,
  Maximize2,
  ExternalLink,
  Layers,
  Award,
  Building,
  GraduationCap,
  Shield,
  Flame,
} from 'lucide-react';
import { MagneticButton } from '../components/motion/MagneticButton';
import { TextReveal } from '../components/motion/TextReveal';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';
import {
  SCHOOL_PHOTOS,
  GALLERY_CATEGORIES,
  type GalleryCategory,
} from '../data/schoolGalleryData';

interface GalleryPageProps {
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  /** When true, suppresses breadcrumb and hero — for embedding inside other pages */
  embedded?: boolean;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigateRoute, embedded = false }) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleOpenLightbox = (idx: number) => {
    setSelectedPhotoIndex(idx);
    setIsZoomed(false);
  };

  // Filtered photos based on category and search query
  const filteredPhotos = useMemo(() => {
    return SCHOOL_PHOTOS.filter((photo) => {
      const matchesCategory = activeCategory === 'All' || photo.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const selectedPhoto =
    selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
        );
        setIsZoomed(false);
      } else if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
      setIsZoomed(false);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
      setIsZoomed(false);
    }
  };

  // Counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SCHOOL_PHOTOS.length };
    GALLERY_CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = SCHOOL_PHOTOS.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Campus & Grounds':
        return <Building className="w-3.5 h-3.5" />;
      case 'Academics & Labs':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'NCC & Cadets':
        return <Shield className="w-3.5 h-3.5" />;
      case 'Events & Safety':
        return <Flame className="w-3.5 h-3.5" />;
      case 'Leadership & Honours':
        return <Award className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} bg-[#f8f9fa] pb-24`}>
      {/* Breadcrumb — hidden when embedded */}
      {!embedded && (
        <div className="bg-white border-b border-slate-200">
          <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <button
                onClick={() => onNavigateRoute('home')}
                className="hover:text-[#354024] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#354024] font-bold">Campus Visual Chronicle</span>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Header - Deep Navy & Azure Blue — hidden when embedded */}
      {!embedded && (
        <div className="bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#252d19] text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(2,132,199,0.28),transparent_50%)] pointer-events-none" />
          <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
              <img src={logoImg} alt="School Emblem" className="w-5 h-5 object-contain" />
              <span className="text-[11px] font-extrabold tracking-widest text-[#cfbb99] uppercase">
                AUTHENTIC CAMPUS ARCHIVE • 38 PHOTOGRAPHS
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1]">
              <TextReveal>Inside A.M.A. Adinarayana High School</TextReveal>
            </h1>
            <p className="text-slate-200 text-base sm:text-lg max-w-2xl mt-5 leading-relaxed font-normal">
              Explore authentic high-resolution moments from our 15-acre campus: smart interactive classrooms, science &amp; IT laboratories, NCC marching drills, emergency preparedness assemblies, and trophy cabinets honoring 60 years of heritage.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15 max-w-4xl">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-white">15-Acre</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">Lush Green Campus</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-[#cfbb99]">1965</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">Diamond Jubilee Estd.</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-white">NCC &amp; SPC</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">Cadet Corps Guilds</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">Smart Digital Suites</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Spotlight Card */}
      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-xl group">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
              <img
                src="/gallery/jai00311.webp"
                alt="AMAA High School Campus"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4">
                <span className="bg-[#354024] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                  Featured Panorama
                </span>
              </div>
            </div>
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-[#0a192f] text-white">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#cfbb99] uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-[#cfbb99]" />
                  <span>Campus Landmark</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  A Magnificent 15-Acre Sanctuary for Holistic Growth
                </h3>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  Surrounded by scenic green hills, A.M.A. Adinarayana High School features multi-tiered academic blocks, full-scale athletics fields, dedicated computer &amp; science wings, and shaded assembly quadrangles.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full text-slate-200">
                    4K Smart Classrooms
                  </span>
                  <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full text-slate-200">
                    High-Tech Computer Lab
                  </span>
                  <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full text-slate-200">
                    NCC Cadet Platoon
                  </span>
                  <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full text-slate-200">
                    Industrial RO Plant
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span className="text-white font-bold">{SCHOOL_PHOTOS.length} Authentic Photos</span> in this gallery
                </div>
                <button
                  onClick={() => {
                    const idx = filteredPhotos.findIndex((p) => p.id === 'jai00311');
                    if (idx !== -1) setSelectedPhotoIndex(idx);
                  }}
                  className="inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Gallery Controls: Filter Tabs & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#354024] uppercase tracking-wider mb-1">
              <Camera className="w-4 h-4" />
              <span>Campus Chronicle</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Photographic Archive
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Showing {filteredPhotos.length} of {SCHOOL_PHOTOS.length} high-resolution photographs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search photos (e.g. lab, cadet, bus)..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-full focus:outline-none focus:border-[#354024] focus:ring-2 focus:ring-[#354024]/20 transition-all text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedPhotoIndex(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#354024] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-slate-700 font-bold text-base">No photographs found</h4>
            <p className="text-slate-500 text-xs mt-1">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-[#354024] text-white text-xs font-bold rounded-full hover:bg-[#252d19] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPhotos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
                onClick={() => {
                  setSelectedPhotoIndex(idx);
                  setIsZoomed(false);
                }}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-xl hover:border-[#354024]/40 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {photo.badge}
                    </span>
                  </div>

                  {/* Hover Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-11 h-11 rounded-full bg-[#354024] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#354024]">
                        {photo.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {photo.filename}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-slate-900 text-sm group-hover:text-[#354024] transition-colors leading-snug">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Featured Campus Stories Section */}
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 text-[#354024] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5 text-[#354024]" />
              <span>Campus Life Chronicles</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-900">
              Featured Campus Stories &amp; Practical Workshops
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Photographic chronicles from disaster preparedness drills, NCC platoon assemblies, and hands-on laboratory innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => {
                const targetIdx = filteredPhotos.findIndex((p) => p.id === 'jai00486');
                handleOpenLightbox(targetIdx >= 0 ? targetIdx : 0);
              }}
              className="rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 group relative cursor-pointer hover:border-[#354024] shadow-card hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img
                  src="/gallery/jai00486.webp"
                  alt="Fire Safety Workshop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#354024] transition-all border border-white/30">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white">
                <span className="text-[10px] font-bold text-[#354024] uppercase">Safety &amp; Disaster Drill</span>
                <h4 className="font-heading font-bold text-slate-900 text-sm mt-1 group-hover:text-[#354024] transition-colors">
                  Fire Safety Demonstration &amp; Live Training
                </h4>
                <p className="text-xs text-slate-500 mt-1">Visiting Fire Brigade • Courtyard Practical</p>
              </div>
            </div>

            <div
              onClick={() => {
                const targetIdx = filteredPhotos.findIndex((p) => p.id === 'jai00447');
                handleOpenLightbox(targetIdx >= 0 ? targetIdx : 0);
              }}
              className="rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 group relative cursor-pointer hover:border-[#354024] shadow-card hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img
                  src="/gallery/jai00447.webp"
                  alt="NCC March Past"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#354024] transition-all border border-white/30">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white">
                <span className="text-[10px] font-bold text-[#354024] uppercase">Cadet Platoon</span>
                <h4 className="font-heading font-bold text-slate-900 text-sm mt-1 group-hover:text-[#354024] transition-colors">
                  NCC Cadets Ceremonial March Past
                </h4>
                <p className="text-xs text-slate-500 mt-1">Parade Ground • State Cadet Unit</p>
              </div>
            </div>

            <div
              onClick={() => {
                const targetIdx = filteredPhotos.findIndex((p) => p.id === 'jai00343');
                handleOpenLightbox(targetIdx >= 0 ? targetIdx : 0);
              }}
              className="rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 group relative cursor-pointer hover:border-[#354024] shadow-card hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img
                  src="/gallery/jai00343.webp"
                  alt="Computer Lab Session"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#354024] transition-all border border-white/30">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white">
                <span className="text-[10px] font-bold text-[#354024] uppercase">IT &amp; Digital Literacy</span>
                <h4 className="font-heading font-bold text-slate-900 text-sm mt-1 group-hover:text-[#354024] transition-colors">
                  Computer Laboratory Practical Sessions
                </h4>
                <p className="text-xs text-slate-500 mt-1">Networked Terminals • Hands-on Coding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admissions CTA strip */}
        <div className="mt-16 bg-gradient-to-r from-[#07111e] via-[#0a192f] to-[#252d19] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,rgba(2,132,199,0.25),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <span className="text-xs font-bold text-[#cfbb99] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              ADMISSIONS OPEN 2025–26
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold mt-3">
              Experience the AMAA Environment in Person
            </h3>
            <p className="text-slate-200 text-sm max-w-xl mt-2 leading-relaxed">
              Schedule a guided campus walkthrough to experience our digital classrooms, sports fields, and laboratories firsthand.
            </p>
          </div>
          <MagneticButton
            onClick={() => onNavigateRoute('contact')}
            className="shrink-0 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-8 py-4 text-xs uppercase tracking-wider rounded-full shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer relative z-10"
          >
            <span>SCHEDULE CAMPUS VISIT</span>
            <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
          </MagneticButton>
        </div>
      </div>

      {/* Lightbox Modal with Full-Screen Zoom and Filmstrip */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            onClick={() => {
              setSelectedPhotoIndex(null);
              setIsZoomed(false);
            }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-3 sm:p-6"
          >
            {/* Top Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between gap-4 py-2 px-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 z-20"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#cfbb99] uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-md">
                  {selectedPhoto.category}
                </span>
                <span className="text-xs text-slate-300 font-semibold truncate hidden sm:inline">
                  {selectedPhoto.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono mr-2">
                  {selectedPhotoIndex !== null ? selectedPhotoIndex + 1 : 0} / {filteredPhotos.length}
                </span>

                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                <a
                  href={selectedPhoto.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Open full-resolution image"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => {
                    setSelectedPhotoIndex(null);
                    setIsZoomed(false);
                  }}
                  className="w-9 h-9 rounded-full bg-[#dc2626] text-white hover:bg-red-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Gallery Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photo Viewing Area */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex-1 flex items-center justify-center overflow-hidden my-3"
            >
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#354024] text-white flex items-center justify-center transition-all shadow-xl cursor-pointer"
                title="Previous image (Left Arrow)"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              {/* Image */}
              <motion.div
                key={selectedPhoto.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className={`relative max-w-6xl max-h-[72vh] flex items-center justify-center transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-grab' : 'scale-100'
                }`}
              >
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              </motion.div>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-[#354024] text-white flex items-center justify-center transition-all shadow-xl cursor-pointer"
                title="Next image (Right Arrow)"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>

            {/* Caption & Filmstrip Bottom Footer */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-white z-20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#cfbb99] bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedPhoto.badge}
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-white">
                      {selectedPhoto.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    {selectedPhoto.caption}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono shrink-0">
                  File: {selectedPhoto.filename}
                </div>
              </div>

              {/* Filmstrip thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/20">
                {filteredPhotos.map((thumb, tIdx) => (
                  <button
                    key={thumb.id}
                    onClick={() => {
                      setSelectedPhotoIndex(tIdx);
                      setIsZoomed(false);
                    }}
                    className={`shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      tIdx === selectedPhotoIndex
                        ? 'border-[#354024] scale-105 shadow-md'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb.image} alt={thumb.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
