import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Award,
  Globe2,
  Calendar,
  Briefcase,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Send,
  Building2,
  BookOpen,
  HeartHandshake,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

import { getPageWithSections } from '../lib/cms';
import type { CmsPageWithSections } from '../types/cms';

import { AnimatedCounter } from './motion/AnimatedCounter';
import { InteractiveCard } from './motion/InteractiveCard';
import { TextReveal } from './motion/TextReveal';
import { MagneticButton } from './motion/MagneticButton';
import logoImg from '../assets/logo.png';

interface AlumniPageProps {
  onNavigateHome: () => void;
  onOpenAdmission: () => void;
}

export interface PublicAlumniMember {
  id: string;
  full_name: string;
  batch_year: string;
  email: string;
  phone: string;
  current_role: string;
  organization: string;
  city: string;
  testimonial: string;
  created_at: string;
}

export const AlumniPage: React.FC<AlumniPageProps> = ({ onNavigateHome, onOpenAdmission }) => {
  const [alumniList, setAlumniList] = useState<PublicAlumniMember[]>([]);
  const [pageData, setPageData] = useState<CmsPageWithSections | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    fullName: '',
    batchYear: '2020',
    email: '',
    phone: '',
    currentRole: '',
    organization: '',
    city: '',
    testimonial: '',
    linkedin: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'spotlight' | 'directory' | 'reunions'>('spotlight');

  useEffect(() => {
    let isMounted = true;

    getPageWithSections('alumni')
      .then((data) => {
        if (isMounted && data) {
          setPageData(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load alumni page data:', err);
      });

    const fetchAlumni = async () => {
      try {
        const { data, error } = await supabase
          .from('alumni_members')
          .select('*')
          .eq('verified', true)
          .order('graduation_year', { ascending: false });

        if (error) {
          console.error('[Public Alumni Error] Failed to load verified alumni from Supabase:', error);
          if (isMounted) setAlumniList([]);
          return;
        }

        if (data && isMounted) {
          const mapped: PublicAlumniMember[] = data.map((m) => ({
            id: m.id,
            full_name: m.full_name,
            batch_year: m.graduation_year ? `Batch of ${m.graduation_year}` : 'Alumni',
            email: m.email,
            phone: m.phone || '',
            current_role: m.current_profession || 'Professional',
            organization: m.current_organization || 'Independent',
            city: m.location || 'Patna',
            testimonial: m.message || 'AMAA High School provided the launchpad for my journey.',
            created_at: m.created_at || new Date().toISOString(),
          }));
          setAlumniList(mapped);
        }
      } catch (err: unknown) {
        console.error('[Public Alumni Error] Unexpected exception querying alumni_members:', err);
        if (isMounted) setAlumniList([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAlumni();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroSection = pageData?.sections?.find((s) => s.section_key === 'alumni.hero');
  const heroHeading =
    heroSection?.heading || 'Connecting Six Decades of Leaders, Innovators & Achievers';
  const heroSubheading =
    heroSection?.subheading ||
    'From the historic classrooms of A.M.A. Adinarayana Eng. Med. High School to premier universities, research laboratories, and civic leadership worldwide—our alumni illuminate society under our sacred motto: "Lead Kindly Light".';
  const heroEyebrow =
    heroSection?.eyebrow || 'ALUMNI FEDERATION • ESTD. 1965 • "LEAD KINDLY LIGHT"';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const full_name = formData.fullName.trim();
    const email = formData.email.trim();
    const current_profession = formData.currentRole.trim();
    const graduation_year = parseInt(formData.batchYear, 10) || 2020;
    const phone = formData.phone.trim() || null;
    const current_organization = formData.organization.trim() || null;
    const location = formData.city.trim() || null;
    const message = formData.testimonial.trim() || null;

    if (!full_name || !email || !current_profession) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('alumni_members')
        .insert({
          full_name,
          graduation_year,
          email,
          phone,
          current_profession,
          current_organization,
          location,
          message,
        });

      if (error) {
        console.error('[Public Alumni Error] Failed to submit registration to Supabase:', error);
        setSubmitError('Unable to submit your registration at this moment. Please verify your details or try again later.');
        return;
      }

      setSubmitted(true);
      setFormData({
        fullName: '',
        batchYear: '2020',
        email: '',
        phone: '',
        currentRole: '',
        organization: '',
        city: '',
        testimonial: '',
        linkedin: '',
      });
    } catch (err: unknown) {
      console.error('[Public Alumni Error] Unexpected exception during registration:', err);
      setSubmitError('A network or unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: 'Graduated Alumni', numVal: 5000, suffix: '+', icon: Users, desc: 'Serving across 20+ countries' },
    { label: 'Graduating Batches', numVal: 25, suffix: '+', icon: GraduationCap, desc: 'Decades of academic excellence' },
    { label: 'Doctors, Engineers & Civil Servants', numVal: 1200, suffix: '+', icon: Award, desc: 'In top institutions & services' },
    { label: 'Active City Chapters', numVal: 15, suffix: '+', icon: Globe2, desc: 'Delhi, Bengaluru, Mumbai, London & more' },
  ];

  const upcomingEvents = [
    {
      title: 'Grand Alumni Homecoming & Diamond Gala 2026',
      date: 'December 19, 2026',
      time: '5:30 PM onwards',
      location: 'AMAA Main Campus Grand Auditorium & Lawns',
      desc: 'Reconnect with your educators, classmates, and relive the iconic assembly grounds with music and dinner.',
      tag: 'Flagship Event',
    },
    {
      title: 'Alumni Career Conclave: Guiding Class 10th Aspirants',
      date: 'November 14, 2026',
      time: '10:00 AM - 1:00 PM',
      location: 'Hybrid (Campus Seminar Hall & Zoom)',
      desc: 'An inspiring interactive session where alumni mentor current high school students on competitive examinations & career paths.',
      tag: 'Mentorship',
    },
    {
      title: 'Bengaluru & Hyderabad Regional Alumni Chapter Meetup',
      date: 'October 24, 2026',
      time: '6:00 PM - 9:00 PM',
      location: 'Indiranagar Club, Bengaluru',
      desc: 'An informal evening of networking and memories for AMAA alumni based in South India.',
      tag: 'Regional Meet',
    },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24">
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#44105c] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Homepage</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hover:text-[#44105c] cursor-pointer" onClick={onNavigateHome}>Home</span>
            <span>/</span>
            <span className="text-[#44105c] font-bold">Alumni Federation</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1e0e2e] via-[#350b4d] to-[#44105c] text-white py-16 lg:py-24 px-4 sm:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(228,0,70,0.18),transparent_50%)] pointer-events-none" />
        <div className="w-[90%] max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase text-[#e40046] border border-white/20 mb-6">
            <img src={logoImg} alt="School Emblem" className="w-5 h-5 object-contain" />
            <span>{heroEyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-heading max-w-4xl mx-auto">
            <TextReveal>{heroHeading}</TextReveal>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
            {heroSubheading}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              onClick={() => {
                const el = document.getElementById('register-alumni');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#e40046] hover:bg-[#c9003c] text-white font-bold px-8 py-3.5 rounded-full transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Join / Register with Alumni Network</span>
            </MagneticButton>
            <MagneticButton
              onClick={onOpenAdmission}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full border border-white/25 transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#e40046]" />
              <span>Enroll Next Generation</span>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 3. Stats Strip with AnimatedCounter */}
      <section className="relative -mt-8 w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <InteractiveCard
                key={idx}
                className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 flex items-start gap-4 transition-transform"
              >
                <div className="p-3 rounded-2xl bg-purple-50 text-[#44105c] shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                    <AnimatedCounter value={stat.numVal} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{stat.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{stat.desc}</div>
                </div>
              </InteractiveCard>
            );
          })}
        </div>
      </section>

      {/* 4. Tab Navigation */}
      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-full border border-slate-200/80 shadow-xs max-w-xl">
          <button
            onClick={() => setActiveTab('spotlight')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer text-center ${
              activeTab === 'spotlight'
                ? 'bg-[#44105c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Alumni Spotlight
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer text-center ${
              activeTab === 'directory'
                ? 'bg-[#44105c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Registry ({alumniList.length})
          </button>
          <button
            onClick={() => setActiveTab('reunions')}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer text-center ${
              activeTab === 'reunions'
                ? 'bg-[#44105c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Reunions & Events (3)
          </button>
        </div>
      </div>

      {/* 5. Main Content Area */}
      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TAB 1: SPOTLIGHT */}
        {activeTab === 'spotlight' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                Hall of Fame & Alumni Voices
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Our graduates lead global organizations, conduct cutting-edge medical and scientific research, and serve the nation with honor.
              </p>
            </div>

            {alumniList.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-card border border-slate-200/80">
                <Award className="w-10 h-10 text-purple-300 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-slate-800 text-base">
                  {isLoading ? 'Loading Verified Alumni...' : 'Alumni Profiles Being Curated'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  {isLoading
                    ? 'Retrieving verified alumni achievements from official school records...'
                    : 'New verified alumni spotlights will be published here once verified by the school administration.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alumniList.slice(0, 4).map((alumnus) => (
                  <div
                    key={alumnus.id}
                    className="bg-white rounded-3xl p-7 shadow-card border border-slate-200/80 hover:border-[#44105c] hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#44105c] to-[#e40046] text-white font-bold flex items-center justify-center text-base shadow-sm">
                            {alumnus.full_name
                              .split(' ')
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-slate-900 text-base">{alumnus.full_name}</h3>
                            <span className="inline-block bg-purple-50 text-[#44105c] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                              {alumnus.batch_year}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {alumnus.city}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-800 font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-[#e40046]" />
                          <span>{alumnus.current_role}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{alumnus.organization}</span>
                        </div>
                      </div>

                      <blockquote className="text-xs text-slate-600 italic bg-slate-50 p-4 rounded-2xl border-l-4 border-[#44105c] leading-relaxed">
                        "{alumnus.testimonial}"
                      </blockquote>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Verified AMAA High School Alumnus</span>
                      <span className="text-[#44105c] font-bold hover:underline cursor-pointer">
                        Connect via Portal →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Official Alumni Registry ({alumniList.length} Verified Records)
              </h3>
              <span className="text-xs text-slate-500">
                Data synchronized with AMAA SQL Records
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-card border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-5">Alumnus Name</th>
                      <th className="py-3.5 px-5">Graduation Batch</th>
                      <th className="py-3.5 px-5">Current Role</th>
                      <th className="py-3.5 px-5">Organization</th>
                      <th className="py-3.5 px-5">Location</th>
                      <th className="py-3.5 px-5">Registered On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {alumniList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                          {isLoading ? 'Loading verified alumni registry...' : 'No verified alumni records currently published.'}
                        </td>
                      </tr>
                    ) : (
                      alumniList.map((alumnus) => (
                        <tr key={alumnus.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-4 px-5 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {alumnus.full_name}
                          </td>
                          <td className="py-4 px-5">
                            <span className="bg-purple-50 text-[#44105c] px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                              {alumnus.batch_year}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-slate-800">{alumnus.current_role}</td>
                          <td className="py-4 px-5 text-slate-600">{alumnus.organization}</td>
                          <td className="py-4 px-5">{alumnus.city}</td>
                          <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">
                            {alumnus.created_at ? alumnus.created_at.slice(0, 10) : ''}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REUNIONS & EVENTS */}
        {activeTab === 'reunions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 shadow-card border border-slate-200/80 hover:border-[#44105c] hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block bg-[#e40046]/10 text-[#e40046] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                      {evt.tag}
                    </span>
                    <h3 className="font-heading font-bold text-slate-900 text-base leading-snug mb-3">
                      {evt.title}
                    </h3>
                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#44105c]" />
                        <span>{evt.date} • {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      {evt.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => alert(`RSVP registered for ${evt.title}! Access badges will be sent to your email.`)}
                    className="mt-6 w-full bg-[#44105c] hover:bg-[#350b4d] text-white font-bold py-3 rounded-full text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    RSVP for Event
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Alumni Registration Form */}
        <section id="register-alumni" className="mt-16 bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-slate-200/80 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 bg-[#e40046]/10 text-[#e40046] text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Stay Connected</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Register as an AMAA High School Alumnus
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Join the official directory, mentor current students, receive reunion invites, and share your journey with fellow alumni.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">Welcome back! Your alumni profile has been successfully submitted.</span>
                  <p className="mt-0.5 text-emerald-700">Your registration has been queued for verification by the school administration.</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
                <div className="text-xs">
                  <span className="font-bold">Registration submission error</span>
                  <p className="mt-0.5 text-rose-700">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Dr. Rajesh K. Sharma"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Graduating Batch Year *
                  </label>
                  <select
                    value={formData.batchYear}
                    onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none bg-white"
                  >
                    {Array.from({ length: 26 }, (_, i) => 2026 - i).map((yr) => (
                      <option key={yr} value={yr}>
                        Class of {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rajesh@example.com"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentRole}
                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                    placeholder="e.g. Software Architect / Surgeon"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Microsoft / AIIMS / Govt"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current City / Country
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Words of Advice / Memory at AMAA High School
                </label>
                <textarea
                  rows={3}
                  value={formData.testimonial}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  placeholder="Share a favorite memory of teachers, sports day, or words of encouragement for junior batches..."
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#e40046] hover:bg-[#c9003c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition-all text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Registration...' : 'Submit Alumni Registration'}</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
