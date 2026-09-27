import React, { useState } from 'react';
import { Monitor, FlaskConical, BookMarked, Bus, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { InteractiveCard } from './motion/InteractiveCard';
import { MagneticButton } from './motion/MagneticButton';
import { TextReveal } from './motion/TextReveal';

export const FacilitiesSection: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);

  const facilities = [
    {
      id: 'smart-classrooms',
      title: 'Smart Classrooms',
      description: 'Digital classrooms with smart boards, interactive displays, and audio-visual aids.',
      icon: Monitor,
      image: '/gallery/jai00385.webp',
      features: [
        'Interactive 4K Digital Panels',
        'Ergonomic child-safe furniture',
        'Climate-controlled acoustic environments',
        'Smart interactive digital displays',
      ],
    },
    {
      id: 'science-labs',
      title: 'Science Laboratories',
      description: 'Well-equipped labs to encourage scientific curiosity, experimentation, and innovation.',
      icon: FlaskConical,
      image: '/gallery/jai00399.webp',
      features: [
        'Separate Physics, Chemistry & Biology suites',
        'Dedicated practical experiment benches',
        'Certified high safety ventilation & showers',
        'Student-to-apparatus ratio of 1:1',
      ],
    },
    {
      id: 'library',
      title: 'Library & Learning Hub',
      description: 'A rich collection of books, encyclopedias, and digital databases to nurture reading and research.',
      icon: BookMarked,
      image: '/gallery/jai00368.webp',
      features: [
        'Over 25,000 titles and fiction/non-fiction',
        'Subscribed international science journals',
        'Silent individual research carrels',
        'Dedicated reading and study lounges',
      ],
    },
    {
      id: 'transport',
      title: 'GPS-Tracked Fleet Transport',
      description: 'Safe, reliable, and GPS-enabled air-conditioned bus transport across all major city routes.',
      icon: Bus,
      image: '/gallery/jai00331.webp',
      features: [
        'Real-time GPS parent tracking app',
        'Speed governors and onboard CCTV cameras',
        'Trained female attendants on every route',
        'First-aid trained emergency drivers',
      ],
    },
  ];

  return (
    <section id="facilities" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8]" />
            <span className="text-[11px] font-extrabold tracking-widest text-[#1d4ed8] uppercase">
              CAMPUS INFRASTRUCTURE
            </span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight mt-1">
            <TextReveal>World-Class Infrastructure</TextReveal>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
            Designed to empower 21st-century learners with cutting-edge academic infrastructure, athletic facilities, and secure student-first spaces.
          </p>
        </div>

        {/* 4 Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac) => {
            const Icon = fac.icon;
            return (
              <InteractiveCard
                key={fac.id}
                onClick={() => setSelectedFacility(fac)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-blue-400 group cursor-pointer"
              >
                {/* Image Container with zoom & aspect ratio */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                  {/* Circular Icon badge in royal blue */}
                  <div className="absolute -bottom-4 left-5 w-11 h-11 rounded-xl bg-[#1d4ed8] text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:bg-[#0a192f] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 pt-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1d4ed8] transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1d4ed8]">
                    <span>Explore details</span>
                    <ArrowRight className="w-4 h-4 text-[#1d4ed8] group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </InteractiveCard>
            );
          })}
        </div>

        {/* View All Facilities Button */}
        <div className="mt-12 text-center">
          <MagneticButton
            onClick={() => setSelectedFacility(facilities[0])}
            className="inline-flex items-center gap-2 bg-white hover:bg-sky-50 text-slate-800 hover:text-[#1d4ed8] font-bold px-7 py-3 rounded-xl border-2 border-slate-200 hover:border-[#1d4ed8] transition-all text-xs uppercase tracking-wider shadow-sm hover:shadow"
          >
            <span>VIEW ALL FACILITIES</span>
            <ArrowRight className="w-4 h-4 text-[#1d4ed8]" />
          </MagneticButton>
        </div>
      </div>

      {/* Facility Details Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedFacility(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <img
                src={selectedFacility.image}
                alt={selectedFacility.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                  Infrastructure Highlight
                </span>
                <h3 className="font-crest text-xl font-bold">{selectedFacility.title}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedFacility.description}
            </p>

            <div className="mt-4 bg-sky-50/70 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1d4ed8] mb-3">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>Key Specifications & Amenities</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedFacility.features.map((feat: string, fidx: number) => (
                  <div key={fidx} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1d4ed8] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedFacility(null)}
                className="bg-[#1d4ed8] text-white font-bold px-5 py-2.5 rounded-lg text-xs hover:bg-[#1e40af] transition-colors"
              >
                Close Facility Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
