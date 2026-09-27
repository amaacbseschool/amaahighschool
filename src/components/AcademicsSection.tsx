import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users2,
  BrainCircuit,
  Compass,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';

interface AcademicsSectionProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

export const AcademicsSection: React.FC<AcademicsSectionProps> = ({
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  const stages = [
    {
      id: 'middle',
      title: 'Middle School',
      gradeRange: 'Grades VI – VIII',
      ageRange: 'Ages 11 – 14',
      badge: 'Analytical Discovery',
      icon: BrainCircuit,
      badgeColor: 'bg-purple-100 text-purple-800',
      tagline: 'Subject specialization, lab practicals, and Olympiad readiness.',
      description:
        'Students explore independent thinking, abstract reasoning, and systematic science. Introduction to certified laboratory apparatus, computer programming, and debate conclaves.',
      ratio: '1:20',
      subjects: [
        'Physics, Chemistry, Biology',
        'Algebra & Geometry',
        'Social Studies & History',
        'Computer Applications & Coding',
      ],
      outcomes: [
        'Direct laboratory experimentation and data logging',
        'Preparation for National Cyber & Science Olympiads',
        'Inter-house public speaking and leadership guilds',
      ],
    },
    {
      id: 'secondary',
      title: 'Secondary Board Wing',
      gradeRange: 'Grades IX – X',
      ageRange: 'Ages 14 – 16',
      badge: 'Board Excellence',
      icon: Trophy,
      badgeColor: 'bg-rose-100 text-[#dc2626]',
      tagline: 'Unbroken 100% board distinction and career gateway preparation.',
      description:
        'Intensive State Board preparation with daily doubt resolution, rigorous diagnostic mock tests, and personalized mentoring to secure top state ranks and medical/engineering foundations.',
      ratio: '1:20',
      subjects: [
        'Advanced Physical Sciences',
        'Advanced Mathematics',
        'Economics & Social Sciences',
        'English Language & Literature',
      ],
      outcomes: [
        'Unbroken 100% Class X secondary board clearance record',
        '92% students securing first-class and distinctions',
        'Personalized roadmap for IIT-JEE, NEET & Olympiads',
      ],
    },
  ];

  const coreGuarantees = [
    {
      icon: Users2,
      number: '1:20',
      title: 'Individual Attention',
      desc: 'Small class batches ensure teachers know every child’s learning speed and doubts.',
    },
    {
      icon: Trophy,
      number: '100%',
      title: 'Board Pass Record',
      desc: 'Unbroken multi-decade tradition of zero failures and top distinction honors.',
    },
    {
      icon: BookOpen,
      number: '4K',
      title: 'Smart Digital Suites',
      desc: 'Interactive touch panels, modern laboratories, and fully equipped computer workstations.',
    },
  ];

  const currentStage = stages[selectedStageIndex];
  const StageIcon = currentStage.icon;

  return (
    <section id="academics" className="py-20 lg:py-28 bg-[#f8f9fa] border-b border-slate-200 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#354024]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#354024]/10 border border-[#354024]/20 px-4 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#cfbb99]" />
              <span className="text-[11px] font-bold tracking-widest text-[#354024] uppercase">
                ACADEMIC PATHWAYS • GRADES VI TO X
              </span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1b2213] tracking-tight">
              <TextReveal>Explore. Learn. Excel.</TextReveal>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              We guide students from Grade VI analytical discovery through Class X secondary board distinctions. Select a wing below to explore curriculum, subjects, and outcomes.
            </p>
          </div>

          {onNavigateRoute && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateRoute('home', '#faculty')}
                className="inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white font-bold px-6 py-3 rounded-full text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>MEET OUR FACULTY</span>
                <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
              </button>

              <button
                onClick={() => onNavigateRoute('academics')}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1b2213] font-bold px-5 py-3 rounded-full border border-slate-200 text-xs tracking-wider uppercase transition-all cursor-pointer shadow-subtle"
              >
                <span>VIEW SYLLABUS</span>
                <ArrowRight className="w-4 h-4 text-[#354024]" />
              </button>
            </div>
          )}
        </div>

        {/* 3 Core Academic Guarantees - Quick scan for parents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {coreGuarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#354024]/10 text-[#354024] flex items-center justify-center shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#354024] font-modern">
                      {item.number}
                    </span>
                    <span className="font-crest font-bold text-sm text-[#1b2213]">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Academic Wings Selector */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-card overflow-hidden">
          {/* Step Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-slate-200 bg-slate-50/60 p-2 gap-2">
            {stages.map((stage, idx) => {
              const isSelected = selectedStageIndex === idx;
              const TabIcon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageIndex(idx)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-white text-[#1b2213] shadow-md border border-slate-200 ring-2 ring-[#354024]/20'
                      : 'hover:bg-white/60 text-slate-600'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#354024] text-white'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    <TabIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-[#354024] uppercase tracking-wider">
                      {stage.gradeRange}
                    </div>
                    <div className="font-crest font-bold text-sm sm:text-base text-[#1b2213] truncate">
                      {stage.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Content Display */}
          <div className="p-6 sm:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left: Clear Narrative & Outcomes */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${currentStage.badgeColor}`}>
                        {currentStage.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {currentStage.ageRange}
                      </span>
                      <span className="text-xs font-bold text-[#354024] bg-[#354024]/10 px-3 py-1 rounded-full">
                        Mentor Ratio: {currentStage.ratio}
                      </span>
                    </div>

                    <h3 className="font-crest text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1b2213] leading-tight">
                      {currentStage.title} ({currentStage.gradeRange})
                    </h3>

                    <p className="text-sm sm:text-base font-semibold text-[#354024] mt-2">
                      {currentStage.tagline}
                    </p>

                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                      {currentStage.description}
                    </p>
                  </div>

                  {/* Core Subjects Chips */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      Key Subjects & Learning Areas:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentStage.subjects.map((sub, sidx) => (
                        <div
                          key={sidx}
                          className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1b2213]"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#354024] shrink-0" />
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Learning Outcomes */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      What Your Child Achieves:
                    </h4>
                    <div className="space-y-2">
                      {currentStage.outcomes.map((outcome, oidx) => (
                        <div key={oidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Stage Visual Spotlight Card & Fast Action */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#252d19] text-white p-7 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between text-center relative overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white mx-auto mb-4 backdrop-blur-xs">
                    <StageIcon className="w-8 h-8 text-[#cfbb99]" />
                  </div>

                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    Academic Wing Spotlight
                  </span>

                  <h4 className="font-crest text-2xl font-bold mt-1 text-white">
                    {currentStage.title}
                  </h4>

                  <div className="my-6 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs text-left space-y-2 text-xs text-slate-200">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-300">Grades Offered:</span>
                      <span className="font-bold text-white">{currentStage.gradeRange}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-300">Target Ages:</span>
                      <span className="font-bold text-white">{currentStage.ageRange}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-slate-300">Teacher Ratio:</span>
                      <span className="font-bold text-[#cfbb99]">{currentStage.ratio}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-300">Curriculum:</span>
                      <span className="font-bold text-white">AP State Board</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={onOpenAdmission}
                      className="w-full bg-[#354024] hover:bg-[#252d19] text-white font-bold py-3.5 rounded-full uppercase tracking-wider text-xs transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Enrol in {currentStage.title}</span>
                      <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
                    </button>

                    {onNavigateRoute && (
                      <button
                        onClick={() => onNavigateRoute('contact')}
                        className="w-full text-xs text-white/80 hover:text-white font-semibold underline underline-offset-4 cursor-pointer"
                      >
                        Contact Academic Office for Inquiries →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Navigation Footer Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-subtle text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#354024]" />
            <span>Need personalized counseling for your child's grade transition?</span>
          </div>
          <button
            onClick={onOpenAdmission}
            className="text-[#354024] hover:text-[#252d19] font-bold uppercase tracking-wider hover:underline cursor-pointer"
          >
            Speak with our Academic Counselor →
          </button>
        </div>
      </div>
    </section>
  );
};
