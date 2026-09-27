import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MagneticButton } from './motion/MagneticButton';
import { TextReveal } from './motion/TextReveal';
import logoImg from '../assets/logo.png';

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
          className="relative bg-gradient-to-r from-[#0a192f] via-[#0c2340] to-[#16325c] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#d4af37]/50 overflow-hidden"
        >
          {/* Subtle Background Elements */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Official Logo + Heading */}
            <div className="flex items-center gap-5 text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                <img
                  src={logoImg}
                  alt="School Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#fef08a] tracking-wider uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>"Lead Kindly Light" • Estd. 1965</span>
                </div>
                <h3 className="font-crest text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  <TextReveal>Admissions Open for 2025–26</TextReveal>
                </h3>
              </div>
            </div>

            {/* Center: Tagline with vertical separator */}
            <div className="hidden xl:flex items-center gap-6 text-blue-100/90 border-x border-[#d4af37]/30 px-8">
              <p className="text-base font-medium max-w-xs leading-snug">
                Give your child the best foundation at A.M.A. Adinarayana Eng. Med. High School.
              </p>
            </div>

            {/* Right: Gold Gradient CTA Button */}
            <div className="shrink-0 w-full sm:w-auto text-center">
              <MagneticButton
                onClick={onOpenAdmission}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#fef08a] via-[#d4af37] to-[#b48218] hover:from-white hover:to-[#d4af37] text-[#0a192f] font-black px-8 py-4 rounded-xl shadow-glow-gold transition-all duration-300 text-xs sm:text-sm tracking-wider uppercase border-2 border-white/60"
              >
                <span>ENQUIRE NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
