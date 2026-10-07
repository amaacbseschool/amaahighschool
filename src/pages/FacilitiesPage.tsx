import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  FlaskConical,
  BookMarked,
  Bus,
  Trophy,
  Music,
  ShieldCheck,
  HeartPulse,
  Droplets,
  Camera,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Home,
  Building,
} from 'lucide-react';
import { MagneticButton } from '../components/motion/MagneticButton';
import { TextReveal } from '../components/motion/TextReveal';
import logoImg from '../assets/logo.png';
import { getPageWithSections } from '../lib/cms';
import type { CmsPageWithSections, CmsSectionWithItems } from '../types/cms';
import type { RouteType } from '../types/routes';

interface FacilitiesPageProps {
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
}

interface FacilityItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  features: string[];
  stats: { label: string; value: string };
}

const DEFAULT_FACILITIES: FacilityItem[] = [
  {
    id: 'smart-classrooms',
    title: 'Next-Gen Smart Classrooms',
    category: 'Academic',
    description: 'Acoustically treated, climate-controlled learning studios featuring 4K interactive touch panels and hybrid streaming systems.',
    icon: Monitor,
    image: '/gallery/jai00385.webp',
    features: [
      'Interactive 4K Digital Panels with multi-touch styluses',
      'Ergonomic child-safe modular furniture for flexible seating',
      'High-speed Wi-Fi 6 connectivity with educational firewalls',
      'Acoustic sound dampening and anti-glare balanced illumination',
    ],
    stats: { label: 'Interactive Panels', value: '45+ Units' },
  },
  {
    id: 'science-labs',
    title: 'Integrated Science Laboratories',
    category: 'Laboratories',
    description: 'Dedicated Physics, Chemistry, and Biology research suites equipped with modern sensory apparatus and emergency safety showers.',
    icon: FlaskConical,
    image: '/gallery/jai00399.webp',
    features: [
      'Individual apparatus workstations (1:1 student-to-equipment ratio)',
      'Individual practical experiment benches with certified safety apparatus',
      'Chemical fume hoods, safety eyewash, and certified first-aid kits',
      'High-resolution digital microscopes with digital capture & projection',
    ],
    stats: { label: 'Workstations', value: '60 Seats' },
  },
  {
    id: 'library',
    title: 'Digital & Heritage Learning Library',
    category: 'Academic',
    description: 'A serene sanctum housing over 25,000 physical volumes, international scientific periodicals, and high-speed digital research terminals.',
    icon: BookMarked,
    image: '/gallery/jai00368.webp',
    features: [
      'Over 25,000 curated titles across literature, science, and humanities',
      'E-library subscriptions to JSTOR, National Geographic, and Britannica',
      'Acoustically insulated individual study carrels',
      'Junior reading corner with pictorial storytelling resources',
    ],
    stats: { label: 'Books & Resources', value: '25,000+' },
  },
  {
    id: 'sports-complex',
    title: 'Olympic-Standard Sports Complex',
    category: 'Athletics',
    description: 'Multi-sport athletic grounds comprising synthetic track, basketball arena, cricket pitch, badminton courts, and indoor martial arts dojo.',
    icon: Trophy,
    image: '/gallery/jai00329.webp',
    features: [
      'Regulation 200m all-weather athletic running track',
      'Floodlit synthetic surface basketball & tennis courts',
      'Natural turf football ground and turf cricket batting nets',
      'Taekwondo and karate dojo with certified safety flooring',
    ],
    stats: { label: 'Dedicated Area', value: '4+ Acres' },
  },
  {
    id: 'transport',
    title: 'GPS-Monitored Fleet Transport',
    category: 'Safety',
    description: 'Safe, GPS-tracked, speed-governed air-conditioned fleet covering major nodal pickup points across the municipal district.',
    icon: Bus,
    image: '/gallery/jai00331.webp',
    features: [
      'Live parent bus-tracking smartphone application',
      'Mandatory verified female attendants on every trip route',
      'Onboard high-definition CCTV cameras & speed limiters',
      'Emergency response panic buttons and certified first-aid equipment',
    ],
    stats: { label: 'City Routes', value: '22 Lines' },
  },
  {
    id: 'performing-arts',
    title: 'Auditorium & Fine Arts Pavilion',
    category: 'Cultural',
    description: 'An open-air amphitheater stage and quadrangle with acoustic architecture for morning assemblies and grand school events.',
    icon: Music,
    image: '/gallery/jai00308.webp',
    features: [
      'Dolby surround acoustic sound architecture and wireless mics',
      'Motorized stage lighting trusses and programmable spotlights',
      'Dedicated vocal, instrumental (piano/violin/tabla) practice cubicles',
      'Spacious classical and western dance mirror rehearsal hall',
    ],
    stats: { label: 'Seating Capacity', value: '800 Seats' },
  },
  {
    id: 'water-purification',
    title: 'Commercial RO Drinking Water Plant',
    category: 'Safety',
    description: 'In-house heavy-duty reverse osmosis water purification plant with multi-stage mineral filtration delivering 100% pure drinking water.',
    icon: ShieldCheck,
    image: '/gallery/jai00405.webp',
    features: [
      'Continuous industrial 10,000 LPH multi-membrane filtration',
      'Chilled stainless-steel touchless water stations across campus',
      'Daily digital water purity and TDS testing certifications',
      'Direct pipe distribution to all academic blocks and dining halls',
    ],
    stats: { label: 'Purity Standard', value: '100% Certified' },
  },
];

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ onNavigateRoute }) => {
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [pageData, setPageData] = useState<CmsPageWithSections | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPageWithSections('campus')
      .then((data) => {
        if (isMounted && data) {
          setPageData(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load campus facilities page data:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const sectionMap = useMemo(() => {
    const map = new Map<string, CmsSectionWithItems>();
    if (pageData?.sections) {
      for (const sec of pageData.sections) {
        map.set(sec.section_key, sec);
      }
    }
    return map;
  }, [pageData]);

  const heroSection = sectionMap.get('campus.hero');
  const heroHeading = heroSection?.heading || 'State-of-the-Art Learning Spaces';
  const heroSubheading =
    heroSection?.subheading ||
    'Every square foot of our 15-acre campus is purposely engineered to inspire intellectual curiosity, ensure child safety, and provide an enriching environment for holistic growth.';

  const gridSection = sectionMap.get('campus.facilities_grid');
  const facilitiesList: FacilityItem[] = useMemo(() => {
    if (gridSection?.items && gridSection.items.length > 0) {
      const defaultMap = new Map<string, FacilityItem>();
      for (const def of DEFAULT_FACILITIES) {
        defaultMap.set(def.title.toLowerCase().trim(), def);
      }

      return gridSection.items.map((item, idx) => {
        const fallback = defaultMap.get((item.title || '').toLowerCase().trim()) || DEFAULT_FACILITIES[idx] || DEFAULT_FACILITIES[0];
        return {
          id: fallback.id,
          title: item.title || fallback.title,
          category: fallback.category,
          description: item.description || fallback.description,
          icon: fallback.icon,
          image: item.image_url || fallback.image,
          features: fallback.features,
          stats: {
            label: fallback.stats.label,
            value: item.badge || fallback.stats.value,
          },
        };
      });
    }
    return DEFAULT_FACILITIES;
  }, [gridSection]);

  const categories = ['All', 'Academic', 'Laboratories', 'Athletics', 'Cultural', 'Safety'];

  const filteredFacilities =
    filter === 'All' ? facilitiesList : facilitiesList.filter((f) => f.category === filter);

  // Maps facility.id → the anchor hash used in navbar dropdown links
  const facilityAnchorMap: Record<string, string> = {
    'smart-classrooms': 'classrooms',
    'science-labs': 'laboratories',
    'library': 'library',
    'sports-complex': 'sports',
    'transport': 'transport',
    'performing-arts': 'safety',
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Breadcrumb Bar */}
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
            <span className="text-[#354024] font-bold">Campus Facilities</span>
          </nav>
        </div>
      </div>

      {/* Hero Header - Deep Navy & Azure Blue */}
      <div className="bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#252d19] text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(53,64,36,0.25),transparent_50%)] pointer-events-none" />
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
            <img src={logoImg} alt="School Emblem" className="w-5 h-5 object-contain" />
            <span className="text-[11px] font-extrabold tracking-widest text-[#cfbb99] uppercase">
              WORLD-CLASS CAMPUS INFRASTRUCTURE
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1]">
            <TextReveal>{heroHeading}</TextReveal>
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mt-5 leading-relaxed font-normal">
            {heroSubheading}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15 max-w-4xl">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">15+ Acres</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Lush Green Campus</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-[#cfbb99]">100%</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Smart Digital Classrooms</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">25,000+</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Library Volumes</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-[#cfbb99]">24/7</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">CCTV & Resident Nurse</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Facilities Grid with Filter */}
      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        {/* Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#354024] uppercase tracking-wider mb-2">
              <Building className="w-4 h-4" />
              <span>Campus Directory</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Explore Campus Facilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select an area to view infrastructure specifications, safety standards, and student amenities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-full border border-slate-200/90 shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-[#354024] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((fac) => {
            const Icon = fac.icon;
            return (
              <div
                id={facilityAnchorMap[fac.id] ?? fac.id}
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                className="bg-white rounded-3xl border border-slate-200/80 group cursor-pointer shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Photo container with zoom */}
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    {/* Category pill */}
                    <div className="absolute top-4 left-4 bg-[#1b2213]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                      {fac.category}
                    </div>

                    {/* Metric pill */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#354024] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                      {fac.stats.value}
                    </div>

                    {/* Icon badge */}
                    <div className="absolute -bottom-4 left-6 w-12 h-12 rounded-2xl bg-[#354024] group-hover:bg-[#252d19] text-white flex items-center justify-center shadow-lg border-2 border-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 pt-9">
                    <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-[#354024] transition-colors leading-snug">
                      {fac.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                      {fac.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                      {fac.features.slice(0, 2).map((feat, fidx) => (
                        <div key={fidx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#354024] group-hover:text-[#252d19] transition-colors">
                    <span>Inspect Specifications</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety, Health & Security Assurance Section */}
        <div className="mt-20 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#dc2626]/10 text-[#dc2626] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Safety Protocols</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Student Well-Being & Security Assurance
            </h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              We maintain rigorous, audited safety guidelines to ensure every child learns within a protected, nurturing, and sanitized environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-[#354024]/10 text-[#354024] flex items-center justify-center mb-4">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">24/7 CCTV Surveillance</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                300+ high-definition cameras monitoring entry gates, corridors, perimeters, and common zones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-[#354024]/10 text-[#354024] flex items-center justify-center mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Full-Time Medical Infirmary</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Staffed by a licensed resident nurse, with tie-ups to prime multispeciality hospitals nearby.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-[#354024]/10 text-[#354024] flex items-center justify-center mb-4">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Purified RO Water & Hygiene</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Commercial multi-stage reverse osmosis filtration systems with bi-weekly laboratory purity testing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-[#354024]/10 text-[#354024] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Verified Personnel & Security</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Complete police verification and biometric badge authentication for all faculty, drivers, and guards.
              </p>
            </div>
          </div>
        </div>

        {/* Schedule a Tour CTA */}
        <div className="mt-14 bg-gradient-to-r from-[#141a0e] via-[#1b2213] to-[#252d19] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,rgba(53,64,36,0.25),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <span className="text-xs font-bold text-[#cfbb99] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
              Experience It In Person
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold mt-3">
              Want to experience our campus firsthand?
            </h3>
            <p className="text-slate-200 text-sm max-w-xl mt-2 leading-relaxed">
              Book a guided campus walkthrough with our admissions team. Experience our laboratories, library, and interactive classrooms in person.
            </p>
          </div>
          <MagneticButton
            onClick={() => onNavigateRoute('contact')}
            className="shrink-0 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-8 py-4 text-xs uppercase tracking-wider rounded-full transition-all inline-flex items-center gap-2 shadow-lg cursor-pointer relative z-10"
          >
            <span>BOOK CAMPUS TOUR</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </div>

      {/* Facility Inspection Modal */}
      <AnimatePresence>
        {selectedFacility && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden text-slate-900"
            >
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-60 rounded-2xl overflow-hidden mb-5">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#cfbb99] bg-black/40 px-2 py-0.5 rounded-full">
                    {selectedFacility.category} Amenity Overview
                  </span>
                  <h3 className="font-heading text-2xl font-bold mt-1">{selectedFacility.title}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedFacility.description}
              </p>

              <div className="mt-5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1b2213] mb-3">
                  <Sparkles className="w-4 h-4 text-[#cfbb99]" />
                  <span>Technical Specifications & Operational Standards</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {selectedFacility.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Key Metric: <strong className="text-slate-900">{selectedFacility.stats.label} ({selectedFacility.stats.value})</strong>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSelectedFacility(null);
                      onNavigateRoute('contact');
                    }}
                    className="flex-1 sm:flex-none text-center bg-[#354024] hover:bg-[#252d19] text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors shadow-sm"
                  >
                    Inquire About Facility
                  </button>
                  <button
                    onClick={() => setSelectedFacility(null)}
                    className="bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-full text-xs hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
