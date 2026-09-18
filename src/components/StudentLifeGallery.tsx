import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ZoomIn, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'Sports' | 'Academics' | 'Cultural' | 'Campus';
  image: string;
  caption: string;
}

export const StudentLifeGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Athletic Sports & Track Champions',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
      caption: 'Students competing in the annual 400m sprint and high jump championships.',
    },
    {
      id: 2,
      title: 'Robotics & Collaborative Project Lab',
      category: 'Academics',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
      caption: 'Secondary students designing automated obstacle-avoiding robotic vehicles.',
    },
    {
      id: 3,
      title: 'Annual Day Celebrations & School Band',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      caption: 'Symphonic orchestra and vocal ensemble performing at the school foundation day.',
    },
    {
      id: 4,
      title: 'Classical & Folk Dance Ensemble',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
      caption: 'Celebrating rich regional heritage and national unity through expressive choreography.',
    },
    {
      id: 5,
      title: 'Taekwondo, Karate & Self-Defence',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=800&auto=format&fit=crop',
      caption: 'Rigorous martial arts discipline fostering agility, respect, and physical fitness.',
    },
  ];

  const categories = ['All', 'Academics', 'Sports', 'Cultural'];

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#fffbfa] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with View Gallery CTA on right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#ba181b] uppercase">
              STUDENT LIFE
            </span>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-bold text-[#660708] tracking-tight mt-1">
              Learning Beyond Classrooms
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-2">
              Cultivating well-rounded personalities through competitive athletics, performing arts, leadership clubs, and cultural festivals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 bg-white border border-red-100 p-1 rounded-xl shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#ba181b] text-white shadow'
                      : 'text-slate-600 hover:text-[#ba181b]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedPhoto(galleryItems[0])}
              className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-slate-800 hover:text-[#ba181b] font-bold px-4 py-2 rounded-xl border border-slate-200 text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <span>VIEW GALLERY</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ba181b]" />
            </button>
          </div>
        </div>

        {/* 5-Photo Strip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPhoto(item)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 bg-slate-900 border-2 border-transparent hover:border-[#ba181b]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Category Pill Tag */}
              <div className="absolute top-3 left-3 bg-[#ba181b]/95 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/30 shadow">
                {item.category}
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Text info bottom */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h4 className="text-xs font-bold leading-snug group-hover:text-red-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full overflow-hidden border border-red-900/50 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-red-600 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-80 sm:h-96 bg-black">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>{selectedPhoto.category} Spotlight</span>
                </div>
                <h3 className="font-crest text-xl font-bold text-white">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
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
