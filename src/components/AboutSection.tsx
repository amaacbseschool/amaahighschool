import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Users2,
  CalendarCheck2,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  X,
  GraduationCap,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const stats = [
    {
      value: 'Nursery – 10th',
      label: 'Secondary School',
      sub: 'Foundational to Grade 10',
      icon: Award,
    },
    {
      value: '1:20',
      label: 'Teacher Ratio',
      sub: 'Individual Student Attention',
      icon: Users2,
    },
    {
      value: '20+',
      label: 'Years of Excellence',
      sub: 'Shaping Bright Leaders',
      icon: CalendarCheck2,
    },
    {
      value: '100%',
      label: 'Commitment',
      sub: 'Board Results & Life Skills',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Campus & Student Showcase Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop"
                alt="AMAA High School Campus and Students"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/80 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1d4ed8] text-white flex items-center justify-center font-crest font-bold text-lg shadow">
                    A
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">AMAA High School</h5>
                    <p className="text-[11px] text-slate-500">Center of Intellectual & Moral Rigor</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#1d4ed8] bg-sky-50 border border-blue-200 px-2.5 py-1 rounded-full">
                  Est. 2004
                </span>
              </div>
            </div>

            {/* Decorative background accent blob */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-500/10 rounded-full filter blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-sky-400/15 rounded-full filter blur-2xl -z-10" />
          </motion.div>

          {/* Right Column: Narrative & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <span className="text-xs font-extrabold tracking-widest text-[#1d4ed8] uppercase">
                WELCOME TO
              </span>
              <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight mt-1.5">
                AMAA High School
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              AMAA High School is a premier co-educational institution dedicated to developing confident,
              compassionate, and responsible global citizens. We blend rigorous academic excellence with
              character building, cutting-edge technology, and moral grounding to prepare students for a
              thriving, purposeful future.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Guided by a vibrant pedagogical philosophy, our student-centered curriculum nurtures
              intellectual inquisitiveness, creative expression, sportsmanship, and civic ethics across all age
              groups.
            </p>

            {/* Key Metrics 4-Grid matching reference */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-[#1d4ed8] mb-1">
                      <Icon className="w-4 h-4 text-[#1d4ed8]" />
                      <span className="text-lg sm:text-xl font-black text-[#0a192f] tracking-tight">
                        {stat.value}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">{stat.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{stat.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="group inline-flex items-center gap-3 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold px-6 py-3.5 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-xs tracking-wider uppercase"
              >
                <span>READ MORE ABOUT US</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Leadership & Philosophy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#1d4ed8] uppercase tracking-wider mb-2">
              <GraduationCap className="w-5 h-5 text-[#1d4ed8]" />
              <span>Our Vision & Legacy</span>
            </div>

            <h3 className="font-crest text-2xl sm:text-3xl font-bold text-[#0a192f]">
              About AMAA High School
            </h3>

            <div className="space-y-4 text-sm text-slate-600 mt-4 leading-relaxed">
              <p>
                Founded with a resolute commitment to academic brilliance, <strong>AMAA High School</strong> has
                consistently set new benchmarks in modern secondary education. Our lush 15-acre campus serves
                as a sanctuary of learning where curiosity thrives and individuality is cherished.
              </p>

              <div className="bg-sky-50/70 p-4 rounded-xl border border-blue-100 space-y-2">
                <h4 className="font-bold text-[#0a192f] text-sm">Our Core Pillars:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1d4ed8] shrink-0" />
                    <span>Holistic Mind, Body & Character Cultivation</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1d4ed8] shrink-0" />
                    <span>Holistic Secondary School Curriculum (Nursery to 10th)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1d4ed8] shrink-0" />
                    <span>State-of-the-Art Science & AI Innovation Labs</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#1d4ed8] shrink-0" />
                    <span>100% Secure GPS Transportation & CCTV Care</span>
                  </div>
                </div>
              </div>

              <p>
                From foundational Kindergarten explorations to comprehensive Secondary School education up to Grade 10,
                our distinguished mentors ensure every student graduates with unwavering confidence, ethical strength,
                and life-ready competencies.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-[#1d4ed8] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-[#1e40af] transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
