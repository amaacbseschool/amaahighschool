import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  Shield,
  Music,
  Heart,
  ZoomIn,
  X,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import { MagneticButton } from './motion/MagneticButton';
import type { RouteType } from '../types/routes';

interface StudentLifeSectionProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

interface LifeItem {
  id: number;
  title: string;
  category: 'Sports' | 'Clubs' | 'Cultural' | 'Leadership';
  image: string;
  caption: string;
}

export const StudentLifeSection: React.FC<StudentLifeSectionProps> = ({
  onNavigateRoute,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<LifeItem | null>(null);

  const houses = [
    {
      name: 'Godavari House',
      motto: 'Wisdom & Grace',
      color: 'bg-[#354024]',
      textColor: 'text-[#354024]',
      bgLight: 'bg-[#354024]/10 border-[#354024]/20',
      symbol: '🌊',
    },
    {
      name: 'Krishna House',
      motto: 'Courage & Valour',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50 border-emerald-200',
      symbol: '🌿',
    },
    {
      name: 'Kaveri House',
      motto: 'Purity & Truth',
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50 border-amber-200',
      symbol: '✨',
    },
    {
      name: 'Ganga House',
      motto: 'Strength & Service',
      color: 'bg-rose-600',
      textColor: 'text-rose-600',
      bgLight: 'bg-rose-50 border-rose-200',
      symbol: '🔥',
    },
  ];

  const clubs = [
    {
      name: 'Science & Discovery Guild',
      icon: Flame,
      desc: 'Hands-on scientific models, practical experiments, and inter-school science symposiums.',
    },
    {
      name: 'Literary & Debating Society',
      icon: Award,
      desc: 'Honing public oratory, Model United Nations diplomacy, and creative writing.',
    },
    {
      name: 'Symphony & Performing Arts',
      icon: Music,
      desc: 'Classical vocal music, school brass band, and dramatic theatre arts.',
    },
    {
      name: 'Eco-Warriors & Green Council',
      icon: Heart,
      desc: 'Campus tree planting, rainwater recycling, and solar energy research.',
    },
  ];

  const lifeItems: LifeItem[] = [
    {
      id: 1,
      title: 'Annual Athletic Championship & Sports Grounds',
      category: 'Sports',
      image: '/gallery/jai00329.webp',
      caption: 'Students training on our sprawling natural turf sports ground with scenic mountain backdrop.',
    },
    {
      id: 2,
      title: 'Digital IT & Computer Coding Workbench',
      category: 'Clubs',
      image: '/gallery/jai00343.webp',
      caption: 'Secondary students learning computational thinking, algorithms, and practical IT tools.',
    },
    {
      id: 3,
      title: 'Assembly Stage & Cultural Celebration Pavilion',
      category: 'Cultural',
      image: '/gallery/jai00308.webp',
      caption: 'Celebration of rich cultural diversity and musical heritage during Diamond Jubilee.',
    },
    {
      id: 4,
      title: 'National Cadet Corps (NCC) Ceremonial Troop',
      category: 'Leadership',
      image: '/gallery/jai00447.webp',
      caption: 'Rigorous cadet platoon drill promoting discipline, national pride, and character.',
    },
    {
      id: 5,
      title: 'Secondary Academic Classroom & Peer Mentorship',
      category: 'Leadership',
      image: '/gallery/jai00385.webp',
      caption: 'Focused secondary board students collaborating under dedicated mentor guidance.',
    },
    {
      id: 6,
      title: 'Campus Emergency Preparedness & Safety Drill',
      category: 'Clubs',
      image: '/gallery/jai00486.webp',
      caption: 'Hands-on disaster management training conducted by visiting civic fire safety officers.',
    },
  ];

  const categories = ['All', 'Sports', 'Clubs', 'Cultural', 'Leadership'];

  const filteredItems =
    activeCategory === 'All'
      ? lifeItems
      : lifeItems.filter((item) => item.category === activeCategory);

  return (
    <section id="student-life" className="py-20 lg:py-28 bg-[#f7f3eb] border-b border-[#ded7c8] relative overflow-hidden">
      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#ded7c8] border border-[#cfc6b5] px-3.5 py-1 mb-3">
              <Sparkles className="w-4 h-4 text-[#8f6e32]" />
              <span className="text-[11px] font-extrabold tracking-widest text-[#1c2228] uppercase">
                EXPERIENCE BEYOND CLASSROOMS
              </span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c2228] tracking-tight mt-1">
              <TextReveal>Vibrant Student Life & Culture</TextReveal>
            </h2>
            <p className="text-stone-700 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              At AMAA High School, education thrives far beyond textbooks. Through our House System, vibrant clubs, performing arts, and athletic tournaments, every student discovers their passions.
            </p>
          </div>

          {onNavigateRoute && (
            <MagneticButton
              onClick={() => onNavigateRoute('gallery')}
              className="shrink-0 inline-flex items-center gap-2 bg-[#fbf9f5] hover:bg-[#ece6db] text-[#1c2228] font-bold px-5 py-3 border border-[#cfc6b5] text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer"
            >
              <span>VIEW COMPLETE PHOTO GALLERY</span>
              <ArrowRight className="w-4 h-4 text-[#8f6e32]" />
            </MagneticButton>
          )}
        </motion.div>

        {/* The 4-House System Strip */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ece6db] border border-[#cfc6b5] flex items-center justify-center text-[#8f6e32]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-crest text-2xl font-bold text-[#1c2228]">
                  The Four School Houses
                </h3>
                <span className="text-xs text-stone-600 font-medium">Instilling camaraderie, leadership & athletic spirit since 1965</span>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#1c2228] bg-[#ece6db] border border-[#cfc6b5] px-3 py-1.5">
              <Award className="w-3.5 h-3.5 text-[#8f6e32]" />
              <span>Annual House Rolling Trophy</span>
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {houses.map((house, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="relative bg-[#fbf9f5] border border-[#cfc6b5] p-6 shadow-matte-sm hover:border-[#8f6e32] transition-all duration-300 group overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 bg-[#ece6db] border border-[#ded7c8] flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform">
                    {house.symbol}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">House</span>
                    <span className={`w-3.5 h-3.5 ${house.color} ring-2 ring-[#cfc6b5]`} />
                  </div>
                </div>

                <div className="relative z-10">
                  <h4 className="font-crest text-xl font-bold text-[#1c2228] group-hover:text-[#8f6e32] transition-colors">
                    {house.name}
                  </h4>
                  <div className={`inline-block text-xs font-bold uppercase tracking-wider mt-1.5 px-2.5 py-0.5 bg-[#ece6db] border border-[#ded7c8] text-[#1c2228]`}>
                    {house.motto}
                  </div>
                  <p className="text-[11px] text-stone-600 mt-3 leading-relaxed">
                    Active participation in inter-house athletics, debates, science exhibitions, and annual cultural revues.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Student Clubs Asymmetric Bento Grid */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <span className="text-xs font-bold text-[#8f6e32] uppercase tracking-wider block mb-1">
                CO-CURRICULAR EXCELLENCE
              </span>
              <h3 className="font-crest text-2xl font-bold text-[#1c2228]">
                Student Societies & Discovery Guilds
              </h3>
            </div>
            <span className="text-xs text-stone-600 hidden sm:block">40+ Student-led Initiatives</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Club 1: Science & Discovery Guild - 7 cols */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -4 }}
              className="md:col-span-7 bg-[#fbf9f5] border border-[#cfc6b5] p-7 shadow-matte-sm hover:border-[#8f6e32] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 bg-[#1c2228] text-[#c29d5b] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#8f6e32] group-hover:text-white transition-all">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ece6db] text-[#1c2228] border border-[#cfc6b5] px-3 py-1">
                  Featured Guild
                </span>
              </div>

              <div className="relative z-10">
                <h4 className="font-crest text-xl font-bold text-[#1c2228]">
                  {clubs[0].name}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {clubs[0].desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#ded7c8]">
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">Arduino & Raspberry Pi</span>
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">Autonomous Drones</span>
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">Regional Tech Champions</span>
                </div>
              </div>
            </motion.div>

            {/* Club 2: Literary & Debating Society - 5 cols */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -4 }}
              className="md:col-span-5 bg-[#fbf9f5] border border-[#cfc6b5] p-7 shadow-matte-sm hover:border-[#8f6e32] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 bg-[#8f6e32] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ece6db] text-[#8f6e32] border border-[#cfc6b5] px-3 py-1">
                  Oratory & MUN
                </span>
              </div>

              <div className="relative z-10">
                <h4 className="font-crest text-xl font-bold text-[#1c2228]">
                  {clubs[1].name}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {clubs[1].desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#ded7c8]">
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">Oxford Debating Style</span>
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">National Youth Parliament</span>
                </div>
              </div>
            </motion.div>

            {/* Club 3: Symphony & Performing Arts - 5 cols */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="md:col-span-5 bg-[#fbf9f5] border border-[#cfc6b5] p-7 shadow-matte-sm hover:border-[#8f6e32] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 bg-[#506e57] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Music className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ece6db] text-[#506e57] border border-[#cfc6b5] px-3 py-1">
                  Fine Arts
                </span>
              </div>

              <div className="relative z-10">
                <h4 className="font-crest text-xl font-bold text-[#1c2228]">
                  {clubs[2].name}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {clubs[2].desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#ded7c8]">
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">School Brass Band</span>
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">Carnatic & Hindustani</span>
                </div>
              </div>
            </motion.div>

            {/* Club 4: Eco-Warriors & Green Council - 7 cols */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -4 }}
              className="md:col-span-7 bg-[#fbf9f5] border border-[#cfc6b5] p-7 shadow-matte-sm hover:border-[#8f6e32] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 bg-[#782727] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ece6db] text-[#782727] border border-[#cfc6b5] px-3 py-1">
                  Sustainability
                </span>
              </div>

              <div className="relative z-10">
                <h4 className="font-crest text-xl font-bold text-[#1c2228]">
                  {clubs[3].name}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {clubs[3].desc}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#ded7c8]">
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">Campus Solar Research</span>
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">Zero-Waste Composting</span>
                  <span className="text-[10px] font-medium text-stone-700 bg-[#ece6db] border border-[#ded7c8] px-2.5 py-1">Water Conservation</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filterable Media Bento Grid */}
        <div>
          {/* Category Filter Chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#1c2228] text-white border border-[#1c2228]'
                      : 'bg-[#fbf9f5] text-stone-700 hover:bg-[#ece6db] border border-[#cfc6b5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="text-xs text-stone-600 font-medium">Click any photo to enlarge</span>
          </motion.div>

          {/* Photo Bento Mosaic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
                const colSpan =
                  idx === 0
                    ? 'lg:col-span-7 h-80'
                    : idx === 1
                    ? 'lg:col-span-5 h-80'
                    : idx === 2
                    ? 'lg:col-span-4 h-72'
                    : idx === 3
                    ? 'lg:col-span-4 h-72'
                    : idx === 4
                    ? 'lg:col-span-4 h-72'
                    : 'lg:col-span-12 h-72';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -20 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={`${colSpan} group relative overflow-hidden bg-stone-900 border border-[#cfc6b5] shadow-matte-sm hover:border-[#8f6e32] transition-all duration-300 cursor-pointer`}
                    onClick={() => setSelectedPhoto(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 filter brightness-95"
                    />

                    {/* Gradient scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c2228]/95 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                    {/* Category Chip */}
                    <div className="absolute top-4 left-4 bg-[#fbf9f5] border border-[#cfc6b5] px-3 py-1 text-[10px] font-bold text-[#1c2228] uppercase tracking-wider shadow-xs">
                      {item.category}
                    </div>

                    {/* Top Right Zoom Icon */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                      <div className="w-8 h-8 bg-black/60 border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Text Overlay */}
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <h4 className="font-crest text-base sm:text-lg font-bold leading-snug drop-shadow-sm group-hover:text-[#c29d5b] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-300 mt-1 line-clamp-1 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#fbf9f5] max-w-3xl w-full overflow-hidden shadow-2xl relative border border-[#cfc6b5]"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black text-white p-2 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-96">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 bg-[#fbf9f5]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8f6e32] uppercase tracking-wider bg-[#ece6db] px-2.5 py-1 border border-[#cfc6b5]">
                    {selectedPhoto.category}
                  </span>
                </div>
                <h3 className="font-crest text-2xl font-bold text-[#1c2228] mt-3">
                  {selectedPhoto.title}
                </h3>
                <p className="text-stone-700 text-sm mt-2 leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
