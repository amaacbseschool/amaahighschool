import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  X,
  CalendarCheck2,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';

interface EventsSectionProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

interface SchoolEvent {
  id: number;
  title: string;
  category: 'Flagship' | 'Academic' | 'Sports' | 'Cultural';
  date: {
    day: string;
    month: string;
    year: string;
  };
  time: string;
  venue: string;
  description: string;
  badge: string;
  isImportant?: boolean;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  onNavigateRoute,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const events: SchoolEvent[] = [
    {
      id: 1,
      title: 'Diamond Jubilee Commemoration Gala & Banquet',
      category: 'Flagship',
      date: { day: '25', month: 'SEP', year: '2026' },
      time: '05:00 PM – 09:00 PM IST',
      venue: 'Vivekananda Grand Auditorium & Main Campus Lawn',
      description:
        'Commemorating 60 glorious years of A.M.A. Adinarayana High School (1965–2025). Featuring keynote reflections by distinguished alumni, an archival documentary screening, and commemorative Diamond Jubilee medal presentations.',
      badge: 'Diamond Jubilee Flagship',
      isImportant: true,
    },
    {
      id: 2,
      title: 'Inter-School Science Olympiad & Academic Expo',
      category: 'Academic',
      date: { day: '28', month: 'SEP', year: '2026' },
      time: '09:30 AM – 03:30 PM IST',
      venue: 'Dr. A.P.J. Abdul Kalam Science Wing',
      description:
        'Over 25 regional high schools congregating for competitive science quizzes, physics and chemistry model exhibits, and experiential project displays judged by senior university educators.',
      badge: 'Science Olympiad',
      isImportant: false,
    },
    {
      id: 3,
      title: 'Annual Athletic Championship & Track Trials',
      category: 'Sports',
      date: { day: '05', month: 'OCT', year: '2026' },
      time: '08:00 AM – 02:00 PM IST',
      venue: 'Major Dhyan Chand Sports Grounds',
      description:
        'The premier sporting highlight of the school year. 400m sprint heats, inter-house 4x100m relay championships, taekwondo self-defense demonstrations, and ceremonial march-past.',
      badge: 'Athletics & Martial Arts',
      isImportant: true,
    },
    {
      id: 4,
      title: 'Annual Cultural Extravaganza & Theatre Fest "Kalarava"',
      category: 'Cultural',
      date: { day: '18', month: 'OCT', year: '2026' },
      time: '04:30 PM – 08:30 PM IST',
      venue: 'Open-Air Amphitheatre & Cultural Stage',
      description:
        'A spellbinding evening celebrating multi-lingual Indian folk and classical dance ensembles, choral symphony, and secondary student dramatic adaptations.',
      badge: 'Arts & Symphony',
      isImportant: false,
    },
  ];

  const categories = ['All', 'Flagship', 'Academic', 'Sports', 'Cultural'];

  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter((evt) => evt.category === activeCategory);

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setSelectedEvent(null);
    }, 2000);
  };

  return (
    <section id="events" className="py-20 lg:py-28 bg-[#f8f9fa] relative overflow-hidden">
      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0284c7]/10 text-[#0284c7] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-4 h-4" />
              <span>Institutional Calendar & Highlights</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-1">
              <TextReveal>Events & Celebrations</TextReveal>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              Experience the energy, intellectual vibrancy, and cultural richness of our school calendar through upcoming conclaves, academic symposiums, and sports championships.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200/80 shadow-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0284c7] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bento Grid for Events */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((evt, idx) => {
              const colSpan =
                filteredEvents.length === 1
                  ? 'md:col-span-12'
                  : idx === 0
                  ? 'md:col-span-12 lg:col-span-7'
                  : idx === 1
                  ? 'md:col-span-12 lg:col-span-5'
                  : 'md:col-span-12 lg:col-span-6';

              const isFlagship = evt.isImportant || evt.id === 1;

              return (
                <motion.div
                  key={evt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className={`${colSpan} p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-xl hover:border-[#0284c7]`}
                >
                  <div className="relative z-10">
                    {/* Top Strip: Date Block + Badges */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Calendar Date Block */}
                      <div className="w-16 h-18 rounded-2xl bg-[#07111e] text-white flex flex-col items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-[10px] font-extrabold text-[#38bdf8] uppercase tracking-wider">
                          {evt.date.month}
                        </span>
                        <span className="text-2xl font-black leading-none font-mono mt-0.5">
                          {evt.date.day}
                        </span>
                        <span className="text-[9px] text-slate-300 mt-1 font-medium">
                          {evt.date.year}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-[#0284c7] px-3 py-0.5 rounded-full">
                            {evt.badge}
                          </span>
                          {isFlagship && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#dc2626] text-white px-3 py-0.5 rounded-full shadow-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-snug group-hover:text-[#0284c7] transition-colors">
                          {evt.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                      {evt.description}
                    </p>
                  </div>

                  {/* Time & Venue Meta Footer */}
                  <div className="relative z-10 pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284c7] hover:text-white bg-sky-50 hover:bg-[#0284c7] px-4 py-2 rounded-full cursor-pointer transition-colors"
                      >
                        <span>RSVP & View Full Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                        Complimentary Entry
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {onNavigateRoute && (
          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigateRoute('gallery')}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold px-7 py-3 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <span>Explore Annual Events & Fest Media Archive</span>
              <ArrowRight className="w-4 h-4 text-[#0284c7]" />
            </button>
          </div>
        )}
      </div>

      {/* Event Details & RSVP Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-7 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-[#0284c7] uppercase tracking-wider mb-2">
                <CalendarCheck2 className="w-4 h-4" />
                <span>{selectedEvent.badge}</span>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {selectedEvent.title}
              </h3>

              <div className="my-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2 text-xs text-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Date: {selectedEvent.date.day} {selectedEvent.date.month} {selectedEvent.date.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Time: {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Venue: {selectedEvent.venue}</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                {selectedEvent.description}
              </p>

              {rsvpSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>RSVP Confirmed! We look forward to welcoming you.</span>
                </div>
              ) : (
                <form onSubmit={handleRsvp} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7] outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold py-3.5 rounded-full uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                  >
                    Confirm RSVP & Add to Calendar
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
