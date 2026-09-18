import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

interface AdmissionBannerProps {
  onOpenAdmission: () => void;
}

export const AdmissionBanner: React.FC<AdmissionBannerProps> = ({ onOpenAdmission }) => {
  return (
    <section id="admission-info" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-[#4f000b] via-[#660708] to-[#800d1e] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-red-500/30 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-400/15 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Icon + Heading */}
            <div className="flex items-center gap-5 text-left">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white text-[#ba181b] flex items-center justify-center shrink-0 shadow-lg border-2 border-red-100">
                <GraduationCap className="w-9 h-9 text-[#ba181b]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300 tracking-wider uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Limited Seats Available</span>
                </div>
                <h3 className="font-crest text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  Admissions Open for <br className="hidden sm:inline" />
                  <span className="text-red-100 font-serif">Academic Year 2025–26</span>
                </h3>
              </div>
            </div>

            {/* Center: Tagline with vertical separator */}
            <div className="hidden xl:flex items-center gap-6 text-red-100/90 border-x border-red-400/30 px-8">
              <p className="text-base font-medium max-w-xs leading-snug">
                Give your child the best start for a bright tomorrow at AMAA High School.
              </p>
            </div>

            {/* Right: White Button with Red Text */}
            <div className="shrink-0 w-full sm:w-auto text-center">
              <button
                onClick={onOpenAdmission}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 bg-white hover:bg-red-50 text-[#ba181b] font-black px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm tracking-wider uppercase border border-white"
              >
                <span>ENQUIRE NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
