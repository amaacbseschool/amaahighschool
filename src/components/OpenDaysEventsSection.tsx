import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import { TextReveal } from './motion/TextReveal';
import type { RouteType } from '../types/routes';

interface OpenDaysEventsSectionProps {
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

interface EventItem {
  id: number;
  title: string;
  category: 'Open Day' | 'Academic' | 'Sports' | 'Celebration';
  date: {
    day: string;
    month: string;
    year: string;
  };
  time: string;
  venue: string;
  description: string;
  badge: string;
  badgeColor: string;
  spotsLeft: string;
}

export const OpenDaysEventsSection: React.FC<OpenDaysEventsSectionProps> = ({
  onNavigateRoute: _onNavigateRoute,
  onOpenAdmission,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [childGrade, setChildGrade] = useState('Grade I');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const events: EventItem[] = [
    {
      id: 1,
      title: 'Diamond Jubilee Open Day & Campus Discovery Tour',
      category: 'Open Day',
      date: { day: '12', month: 'OCT', year: '2026' },
      time: '09:30 AM – 01:00 PM IST',
      venue: 'Main Campus & Smart 4K Classrooms',
      description:
        'Meet Principal & Senior Faculty, tour our 15-acre campus, experience hands-on science laboratories, and discover our 60-year heritage of 100% board excellence.',
      badge: 'Flagship Open Day',
      badgeColor: 'bg-[#dc2626] text-white',
      spotsLeft: '18 seats remaining',
    },
    {
      id: 2,
      title: 'Inter-School Science Olympiad & Academic Showcase',
      category: 'Academic',
      date: { day: '26', month: 'OCT', year: '2026' },
      time: '10:00 AM – 03:30 PM IST',
      venue: 'Dr. A.P.J. Abdul Kalam Science Wing',
      description:
        'Over 25 regional schools presenting student scientific models, chemistry exhibits, and physics inquiry experiments evaluated by university educators.',
      badge: 'Science Olympiad',
      badgeColor: 'bg-[#0284c7] text-white',
      spotsLeft: 'Open for Visitors',
    },
    {
      id: 3,
      title: 'High School & Secondary Academic Briefing Session',
      category: 'Open Day',
      date: { day: '08', month: 'NOV', year: '2026' },
      time: '10:30 AM – 12:30 PM IST',
      venue: 'Vivekananda Conference Hall',
      description:
        'Comprehensive breakdown of our 1:20 mentor ratio, curriculum roadmap, sports facilities, bus routes, and interactive evaluation philosophy for 2025–26.',
      badge: 'Admissions 2025–26',
      badgeColor: 'bg-[#dc2626] text-white',
      spotsLeft: '24 seats remaining',
    },
    {
      id: 4,
      title: 'Annual Athletic Championship & March-Past Finals',
      category: 'Sports',
      date: { day: '21', month: 'NOV', year: '2026' },
      time: '08:00 AM – 02:00 PM IST',
      venue: 'Major Dhyan Chand Athletic Arena',
      description:
        'Regulation 400m sprint heats, high jump records, taekwondo self-defence demonstration, and the presentation of the coveted Diamond Jubilee House Trophy.',
      badge: 'Sports Showcase',
      badgeColor: 'bg-[#0a192f] text-white',
      spotsLeft: 'Spectator Entry Open',
    },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !parentPhone) return;
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedEvent(null);
      setParentName('');
      setParentPhone('');
    }, 2500);
  };

  return (
    <section id="open-days" className="py-20 lg:py-28 bg-[#f8f9fa] border-b border-slate-200 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0284c7]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0284c7]/10 border border-[#0284c7]/20 px-3.5 py-1.5 rounded-full mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="text-[11px] font-bold tracking-widest text-[#0284c7] uppercase">
                EXPERIENCE THE HERITAGE FIRST-HAND
              </span>
            </div>
            <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a192f] tracking-tight">
              <TextReveal>Open Days & Campus Events</TextReveal>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
              Nothing compares to visiting our campus in person. Walk through 4K smart classrooms, speak with department heads, explore our athletic grounds, and see why families have trusted us for 60 years.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmission}
              className="inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>APPLY FOR 2025–26</span>
              <ArrowRight className="w-4 h-4 text-[#cfbb99]" />
            </button>
          </div>
        </motion.div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-card hover:shadow-xl hover:border-[#0284c7]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header row: Date Badge + Category Badge */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3.5">
                    {/* Modern Style Date Badge */}
                    <div className="w-14 h-16 bg-[#0a192f] group-hover:bg-[#0284c7] text-white rounded-xl flex flex-col items-center justify-center shadow-md transition-colors duration-300 shrink-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#cfbb99]">
                        {evt.date.month}
                      </span>
                      <span className="text-2xl font-black leading-none mt-0.5">
                        {evt.date.day}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${evt.badgeColor} mb-1`}>
                        {evt.badge}
                      </span>
                      <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.time}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                    {evt.spotsLeft}
                  </span>
                </div>

                <h3 className="font-crest text-xl font-bold text-[#0a192f] group-hover:text-[#0284c7] transition-colors leading-snug mb-2.5">
                  {evt.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {evt.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-5">
                  <MapPin className="w-4 h-4 text-[#dc2626] shrink-0" />
                  <span>{evt.venue}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Free Admission • Families Welcome</span>
                <button
                  onClick={() => setSelectedEvent(evt)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0284c7] group-hover:text-[#0369a1] uppercase tracking-wider hover:underline cursor-pointer"
                >
                  <span>BOOK OPEN DAY</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-200"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[11px] font-bold text-[#0284c7] uppercase tracking-wider">
                  Campus Visit Registration
                </span>
                <h3 className="font-crest text-xl font-bold text-[#0a192f] mt-1">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>📅 {selectedEvent.date.day} {selectedEvent.date.month} {selectedEvent.date.year}</span>
                  <span>•</span>
                  <span>⏰ {selectedEvent.time}</span>
                </p>
              </div>

              {bookingConfirmed ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-bold text-base">Open Day Spot Reserved!</div>
                  <div className="text-xs text-emerald-700">
                    A confirmation SMS & gate pass has been sent to your phone number. We look forward to welcoming you!
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Contact Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Grade of Interest *
                    </label>
                    <select
                      value={childGrade}
                      onChange={(e) => setChildGrade(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10"
                    >
                      <option value="Middle (Grades 6-8)">Middle School: Grades 6 – 8</option>
                      <option value="Secondary (Grades 9-10)">Secondary School: Grades 9 – 10</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-all shadow-md hover:shadow-lg cursor-pointer mt-4"
                  >
                    Confirm My Attendance (Free)
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
