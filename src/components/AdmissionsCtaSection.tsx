import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';
import type { CmsSectionWithItems } from '../types/cms';
import { useCmsShell } from '../context/CmsShellContext';

interface AdmissionsCtaSectionProps {
  cmsSection?: CmsSectionWithItems;
  onOpenAdmission: () => void;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

const DEFAULT_STEPS = [
  {
    step: '01',
    title: 'Online Enquiry',
    desc: 'Fill out our 60-second digital application token or call our admissions cell directly.',
  },
  {
    step: '02',
    title: 'Campus Walkthrough',
    desc: 'Tour our 15-acre campus, 4K smart classrooms, science laboratories, and athletic grounds.',
  },
  {
    step: '03',
    title: 'Child Interaction',
    desc: 'A friendly, non-intimidating observation session to assess child curiosity and grade readiness.',
  },
  {
    step: '04',
    title: 'Confirmed Seat',
    desc: 'Complete fee clearance, document verification, and receive your welcome orientation kit.',
  },
];

export const AdmissionsCtaSection: React.FC<AdmissionsCtaSectionProps> = ({
  cmsSection,
  onOpenAdmission,
  onNavigateRoute,
}) => {
  const { getSetting } = useCmsShell();
  const sitePhone = getSetting('site_phone', '+91 75440 10044');
  const sitePhoneSecondary = getSetting('site_phone_secondary', '+91 75440 10045');
  const admissionsEmail = getSetting('site_email_admissions', 'admissions@amaaschool.edu');
  const siteAddress = getSetting('site_address', 'Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar');

  const [prospectusDownloaded, setProspectusDownloaded] = useState(false);

  const eyebrow = cmsSection?.eyebrow || 'ADMISSIONS OPEN • ACADEMIC SESSION 2025–26';
  const heading = cmsSection?.heading || 'Give Your Child the Foundation of a Lifetime';
  const subheading =
    cmsSection?.subheading ||
    'Join our 60-year legacy of academic brilliance, moral character, and future-ready innovation under the sacred invocation "Lead Kindly Light". Admissions open for Grades VI to Grade X.';
  const ctaText = cmsSection?.cta_text || 'APPLY ONLINE FOR 2025–26';
  const secondaryCtaText = cmsSection?.secondary_cta_text || 'DOWNLOAD PROSPECTUS (PDF)';

  const steps = useMemo(() => {
    if (cmsSection?.items && cmsSection.items.length >= 4) {
      return cmsSection.items.map((it, idx) => ({
        step: it.subtitle ? it.subtitle.replace(/^Step\s*/i, '') : DEFAULT_STEPS[idx].step,
        title: it.title || DEFAULT_STEPS[idx].title,
        desc: it.description || DEFAULT_STEPS[idx].desc,
      }));
    }
    return DEFAULT_STEPS;
  }, [cmsSection]);

  const handleDownloadProspectus = (e: React.MouseEvent) => {
    e.preventDefault();
    setProspectusDownloaded(true);
    const prospectusText = `A.M.A. ADINARAYANA ENGLISH MEDIUM HIGH SCHOOL
ESTD. 1965 • "LEAD KINDLY LIGHT" • DIAMOND JUBILEE
-------------------------------------------------------
Official Prospectus & Admissions Guide 2025–26

Wings & Grades:
- Middle School: Grades VI to VIII (Ages 11–14)
- Secondary School: Grades IX & X (State Board Excellence)

Hallmarks:
- 100% Secondary Board Pass Record across multiple decades
- 1:20 Mentor-Student Ratio with dedicated individual attention
- 15-Acre Smart Green Campus with 4K interactive digital classrooms
- Modern Science & Computer laboratories, & 25,000-volume library
- Regulation 400m athletic track, cricket nets, and taekwondo dojo
- GPS-monitored city-wide bus transport fleet

Admissions Office:
Phone: ${sitePhone} / ${sitePhoneSecondary}
Email: ${admissionsEmail}
Campus Address: ${siteAddress}
`;

    const blob = new Blob([prospectusText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AMAA_High_School_Prospectus_2025-26.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setProspectusDownloaded(false), 3000);
  };

  return (
    <section id="admissions-cta" className="py-20 lg:py-28 bg-[#f8f9fa] relative overflow-hidden">
      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Main CTA Hero Bento Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="relative bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#252d19] rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl overflow-hidden mb-16 border border-[#1b2213]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-[#cfbb99]" />
                <span className="text-xs font-bold tracking-widest text-white uppercase">
                  {eyebrow}
                </span>
              </div>

              <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                <TextReveal>{heading}</TextReveal>
              </h2>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
                {subheading}
              </p>

              {/* Badges Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#cfbb99] shrink-0" />
                  <span>1:20 Mentor-Student Attention</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#cfbb99] shrink-0" />
                  <span>State Board 100% Pass Record</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#cfbb99] shrink-0" />
                  <span>City-Wide GPS Bus Transport</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={onOpenAdmission}
                  className="inline-flex items-center justify-center gap-3 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-8 py-4 rounded-full text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
                </button>

                <button
                  onClick={handleDownloadProspectus}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-4 rounded-full border border-white/20 text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#cfbb99]" />
                  <span>{prospectusDownloaded ? 'Prospectus Downloaded ✓' : secondaryCtaText}</span>
                </button>
              </div>
            </div>

            {/* Right Contact Quick Box */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-7 sm:p-8 text-left space-y-4 relative overflow-hidden backdrop-blur-xs">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 flex items-center justify-center">
                  <img
                    src={logoImg}
                    alt="School Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-crest text-sm font-bold text-white">Admissions Helpdesk</h4>
                  <p className="text-[11px] text-slate-300">Mon – Sat: 8:30 AM to 4:30 PM</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-200 relative z-10">
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-[#cfbb99] shrink-0" />
                  <a href={`tel:${sitePhone.replace(/\s+/g, '')}`} className="hover:text-white font-bold transition-colors">
                    {sitePhone} / {sitePhoneSecondary}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#cfbb99] shrink-0" />
                  <span>{siteAddress}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Merit concessions for Olympiad & Sports achievers</span>
                </div>
              </div>

              {onNavigateRoute && (
                <button
                  onClick={() => onNavigateRoute('contact')}
                  className="w-full text-center text-xs text-[#cfbb99] hover:underline font-bold pt-2 block relative z-10 cursor-pointer"
                >
                  Contact School Admissions Helpdesk →
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 4-Step Admission Journey Bento Grid */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h3 className="font-crest text-2xl sm:text-3xl font-bold text-[#1b2213]">
              Simple 4-Step Enrollment Roadmap
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Clear, transparent, and hassle-free admission procedure designed for parents.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-card hover:shadow-xl hover:border-[#354024]/30 transition-all duration-300 relative group overflow-hidden"
              >
                <span className="text-3xl font-mono font-extrabold text-[#354024] group-hover:text-[#dc2626] transition-colors block mb-3">
                  {s.step}
                </span>
                <h4 className="font-crest text-lg font-bold text-[#1b2213]">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
