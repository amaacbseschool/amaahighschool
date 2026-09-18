import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Lightbulb, Trophy, CheckCircle } from 'lucide-react';

export const AcademicsSection: React.FC = () => {
  const cards = [
    {
      icon: BookOpen,
      title: 'CBSE Curriculum',
      description:
        'Comprehensive curriculum from Nursery to Class XII designed for intellectual rigor, critical inquiry, and holistic growth.',
      points: ['NCERT Aligned', 'Continuous Evaluation', 'Olympiad Integration'],
    },
    {
      icon: GraduationCap,
      title: 'Experienced Faculty',
      description:
        'Our educators inspire, mentor, and bring out the finest capabilities in every child through personalized guidance.',
      points: ['100% Certified Masters', 'Regular Pedagogy Workshops', 'Mentorship Ratios'],
    },
    {
      icon: Lightbulb,
      title: 'Innovative Learning',
      description:
        'Activity-based, experiential, and technology-integrated pedagogical approach with practical problem solving.',
      points: ['STEM & Robotics', 'Language Audio Labs', 'Interactive Whiteboards'],
    },
    {
      icon: Trophy,
      title: 'Excellence Driven',
      description:
        'Unrelenting focus on academics, athletic sports, creative arts, and life skills for multifaceted personality development.',
      points: ['National Champions', 'State Merit Ranks', 'Leadership Councils'],
    },
  ];

  return (
    <section id="academics" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <span className="text-xs font-extrabold tracking-widest text-[#b87e1f] uppercase">
            ACADEMICS
          </span>
          <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-bold text-[#093326] tracking-tight mt-1">
            Explore. Learn. Excel.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3">
            Our progressive academic framework fosters intellectual curiosity, scientific temperament, and ethical leadership at every stage of school life.
          </p>
        </div>

        {/* 2-Column Grid: Cards (Left) + Holistic Growth Badge (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: 4 Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#f8faf8] p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-800/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/90 text-[#093326] flex items-center justify-center mb-4 group-hover:bg-[#093326] group-hover:text-amber-300 transition-colors shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#093326] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-1">
                    {card.points.map((pt, pidx) => (
                      <div key={pidx} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <CheckCircle className="w-3 h-3 text-[#d4973b]" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Circular / Crest Feature Spotlight matching reference */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div className="relative w-full max-w-md">
              {/* Circular Student Photo Frame */}
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 mx-auto rounded-full overflow-hidden border-8 border-white shadow-2xl ring-4 ring-[#d4973b]/30">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"
                  alt="Students experiencing holistic growth"
                  className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Floating Emblems */}
              <div className="absolute top-2 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-amber-300/40 text-center animate-pulse">
                <span className="text-xs font-black text-[#093326]">CBSE</span>
                <span className="block text-[9px] font-bold text-amber-600">Grade I – XII</span>
              </div>

              {/* Dark Green & Gold Banner matching reference ("Holistic Growth - Mind • Body • Values") */}
              <div className="relative -mt-10 sm:-mt-12 mx-auto max-w-xs bg-[#093326] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-amber-400/50 text-center">
                <h4 className="font-crest text-lg sm:text-xl font-bold text-white tracking-wide">
                  Holistic Growth
                </h4>
                <p className="text-xs font-semibold text-amber-300 tracking-wider mt-1 uppercase">
                  Mind • Body • Values
                </p>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  Nurturing intellectual, emotional, and social resilience in every learner.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
