import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  FlaskConical,
  BookMarked,
  Bus,
  Trophy,
  ArrowRight,
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  Images,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';

interface CampusSectionProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

export const CampusSection: React.FC<CampusSectionProps> = ({
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);

  const campusFacilities = [
    {
      id: 'smart-classrooms',
      title: 'Smart 4K Classrooms',
      subtitle: 'Digitally Immersive Learning Environments',
      description: 'Acoustically tuned, climate-controlled classrooms equipped with 75-inch 4K interactive touch panels and digital stylus annotation.',
      icon: Monitor,
      image: '/gallery/jai00385.webp',
      features: [
        'Interactive 4K Digital Panels with cloud lessons',
        'Ergonomic child-safe anti-fatigue furniture',
        'Acoustic soundproofing & glare-free lighting',
        'Hybrid digital connectivity for interactive masterclasses',
      ],
      spec: '100% Digitalized',
    },
    {
      id: 'science-labs',
      title: 'Modern Science & Computer Suites',
      subtitle: 'Physics, Chemistry, Biology & IT Wings',
      description: 'Individual experiment stations with certified safety apparatus, fume exhausts, digital microscopes, and networked computer workstations.',
      icon: FlaskConical,
      image: '/gallery/jai00399.webp',
      features: [
        'Certified fire-safe chemical ventilation hoods',
        'Precision optical & digital projection microscopes',
        'Sensor interface bays for data logging',
        'Dedicated practical experiment benches with certified apparatus',
      ],
      spec: 'Secondary Certified',
    },
    {
      id: 'grand-library',
      title: 'Grand Reference Library',
      subtitle: '25,000+ Literary & Research Volumes',
      description: 'Two-tier reading gallery featuring academic encyclopedias, national journals, digital e-reading carrels, and peaceful study pods.',
      icon: BookMarked,
      image: '/gallery/jai00368.webp',
      features: [
        'RFID self-checkout & digital catalog search',
        'Quiet individual research carrels with Wi-Fi',
        'Curated international children’s literature',
        'Weekly book club conclaves & debates',
      ],
      spec: '25,000+ Books',
    },
    {
      id: 'sports-complex',
      title: 'Athletic Sports Complex',
      subtitle: '400m Track, Cricket, Football & Martial Arts',
      description: 'Sprawling grass fields, certified cricket practice nets, synthetic volleyball courts, and an indoor taekwondo dojo.',
      icon: Trophy,
      image: '/gallery/jai00329.webp',
      features: [
        'Regulation 400m running track with sprint blocks',
        'Fenced turf cricket practice pitches',
        'Dedicated martial arts & yoga pavilion',
        'Professional coaches with NIS certification',
      ],
      spec: 'Olympic Guidelines',
    },
    {
      id: 'transport',
      title: 'GPS-Monitored Fleet',
      subtitle: 'Safe, Air-Cooled City Transit',
      description: 'Modern fleet covering all major city neighborhoods with real-time GPS tracking, speed governors, female attendants, and first-aid kits.',
      icon: Bus,
      image: '/gallery/jai00331.webp',
      features: [
        'Live parent mobile app tracking with ETA alerts',
        'Dedicated female attender on every route',
        'Speed governors locked to safe city limits',
        'Emergency SOS alarm & first responder kits',
      ],
      spec: '100% Monitored',
    },
  ];

  return (
    <section id="campus" className="py-20 lg:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0284c7]/10 border border-[#0284c7]/20 px-4 py-1.5 rounded-full mb-3">
              <Building2 className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="text-[11px] font-bold tracking-widest text-[#0284c7] uppercase">
                WORLD-CLASS INFRASTRUCTURE
              </span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a192f] tracking-tight mt-1">
              <TextReveal>Our Campus & Facilities</TextReveal>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              Spanning a lush 15-acre sanctuary of learning, our campus blends state-of-the-art academic suites with expansive athletic complexes and vigilant safety infrastructure.
            </p>
          </div>

          {onNavigateRoute && (
            <button
              onClick={() => onNavigateRoute('campus')}
              className="shrink-0 inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-6 py-3 rounded-full text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>EXPLORE ALL CAMPUS AMENITIES</span>
              <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
            </button>
          )}
        </motion.div>

        {/* Campus Facilities Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 mb-14">
          {campusFacilities.map((facility, idx) => {
            const Icon = facility.icon;
            const colSpan = idx === 0 ? 'md:col-span-12 lg:col-span-7' : idx === 1 ? 'md:col-span-6 lg:col-span-5' : 'md:col-span-6 lg:col-span-4';
            const isHero = idx === 0;

            return (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className={colSpan}
              >
                <div
                  className="w-full h-full flex flex-col group cursor-pointer bg-white border border-slate-200/90 rounded-3xl shadow-card hover:shadow-xl hover:border-[#0284c7]/30 overflow-hidden transition-all duration-300"
                  onClick={() => setSelectedFacility(facility)}
                >
                  {/* Photo Header */}
                  <div className={`relative ${isHero ? 'h-64 sm:h-72' : 'h-52'} overflow-hidden bg-slate-900`}>
                    <img
                      src={facility.image}
                      alt={facility.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/30 to-transparent pointer-events-none" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#0284c7] shadow-md">
                      {facility.spec}
                    </div>

                    {/* Icon & Title Overlay on Image */}
                    <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3.5 text-white">
                      <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-md group-hover:bg-[#0284c7] transition-all duration-300 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-crest text-lg sm:text-xl font-bold leading-tight text-white">
                          {facility.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                          {facility.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {facility.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      {facility.features.slice(0, isHero ? 3 : 2).map((feat, fidx) => (
                        <div key={fidx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-3 flex items-center justify-between text-xs font-bold text-[#0284c7] group-hover:text-[#0369a1] transition-colors">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
                        Explore Specifications
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#0284c7] group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Campus Safety & Security Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="bg-[#07111e] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-[#cfbb99]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-crest font-bold text-white text-base sm:text-lg">
                100% Secure Campus Perimeter & Safety Protocols
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                24/7 CCTV surveillance coverage, biometric visitor screening, GPS fleet telemetry, fire hazard compliance, and on-campus emergency medical care.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenAdmission && (
              <button
                onClick={onOpenAdmission}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold px-6 py-3 rounded-full transition-all uppercase tracking-wider cursor-pointer shadow-md hover:shadow-lg"
              >
                Schedule In-Person Tour
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Facility Detail Modal */}
      <AnimatePresence>
        {selectedFacility && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="relative h-60 overflow-hidden bg-slate-900">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/40 to-transparent" />
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="text-[11px] font-bold text-[#0284c7] uppercase tracking-wider">
                    {selectedFacility.spec}
                  </span>
                  <h3 className="font-crest text-2xl font-bold mt-1">
                    {selectedFacility.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedFacility.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedFacility.description}
                </p>

                <div>
                  <h4 className="text-xs font-bold text-[#0a192f] uppercase tracking-wider mb-3">
                    Facility Specifications & Standards:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedFacility.features.map((feat: string, fidx: number) => (
                      <div key={fidx} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#0284c7] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedFacility(null);
                      if (onNavigateRoute) {
                        onNavigateRoute('gallery');
                      } else {
                        const el = document.getElementById('gallery');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-sm"
                  >
                    <Images className="w-3.5 h-3.5 text-[#cfbb99]" />
                    <span>View in Photo Gallery</span>
                  </button>

                  <button
                    onClick={() => setSelectedFacility(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
