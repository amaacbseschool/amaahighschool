import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Sparkles,
  ChevronRight,
  Home,
  Compass,
} from 'lucide-react';
import { db } from '../lib/db';
import { MagneticButton } from '../components/motion/MagneticButton';
import { TextReveal } from '../components/motion/TextReveal';
import logoImg from '../assets/logo.png';
import type { RouteType } from '../types/routes';

interface ContactPageProps {
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onRecordAdded: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateRoute,
  onRecordAdded,
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [tourBooked, setTourBooked] = useState(false);
  const [tourData, setTourData] = useState({
    parent_name: '',
    phone: '',
    date: '',
    time_slot: 'Morning (9:30 AM – 11:30 AM)',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      db.addContactMessage({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      onRecordAdded();
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 500);
  };

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.addContactMessage({
      full_name: tourData.parent_name,
      email: 'tour-booking@internal.school',
      phone: tourData.phone,
      subject: `Campus Tour Request: ${tourData.date} (${tourData.time_slot})`,
      message: `Parent requested in-person guided campus walkthrough on ${tourData.date} during ${tourData.time_slot}.`,
    });
    setTourBooked(true);
    onRecordAdded();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              onClick={() => onNavigateRoute('home')}
              className="hover:text-[#354024] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#354024] font-bold">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Hero Header - Deep Navy & Azure Blue */}
      <div className="bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#252d19] text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(2,132,199,0.25),transparent_50%)] pointer-events-none" />
        <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6">
            <img src={logoImg} alt="School Emblem" className="w-5 h-5 object-contain" />
            <span className="text-[11px] font-extrabold tracking-widest text-[#cfbb99] uppercase">
              STUDENT SERVICES & FRONT DESK
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1]">
            <TextReveal>Connect With Our Campus</TextReveal>
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mt-5 leading-relaxed font-normal">
            We invite you to reach out to the admissions office and administration at A.M.A. Adinarayana Eng. Med. High School. We are here to guide your child's journey.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15 max-w-4xl">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">&lt; 24h</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Response Time</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-[#cfbb99]">6 Days</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Visiting Desk Open</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">Direct</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Counselor Helplines</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">Guided</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Campus Walkthroughs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[90%] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between group hover:border-[#354024] hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#354024] flex items-center justify-center mb-5 group-hover:bg-[#354024] group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Campus Address</h3>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                AMAA High School Campus, Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar, India
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-[#354024] font-bold">
              GPS: 25.5941° N, 85.1376° E
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between group hover:border-[#354024] hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#354024] flex items-center justify-center mb-5 group-hover:bg-[#354024] group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Telephone Lines</h3>
              <div className="text-xs text-slate-600 mt-2.5 space-y-1.5">
                <p>Front Office: <strong className="text-slate-900">+91 75440 10044</strong></p>
                <p>Admissions: <strong className="text-slate-900">+91 75440 10045</strong></p>
                <p>Principal's Office: <strong className="text-slate-900">+91 75440 10046</strong></p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-[#354024] font-bold">
              Direct Inward Dialing
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between group hover:border-[#354024] hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#354024] flex items-center justify-center mb-5 group-hover:bg-[#354024] group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Electronic Mail</h3>
              <div className="text-xs text-slate-600 mt-2.5 space-y-1.5">
                <p>General: <span className="text-[#354024] font-semibold">info@amaaschool.edu</span></p>
                <p>Admissions: <span className="text-[#354024] font-semibold">admissions@amaaschool.edu</span></p>
                <p>Careers: <span className="text-[#354024] font-semibold">careers@amaaschool.edu</span></p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-[#354024] font-bold">
              Secure Institutional Server
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card flex flex-col justify-between group hover:border-[#354024] hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#354024] flex items-center justify-center mb-5 group-hover:bg-[#354024] group-hover:text-white transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Office Timings</h3>
              <div className="text-xs text-slate-600 mt-2.5 space-y-1.5">
                <p>Mon – Fri: <strong>8:00 AM – 4:00 PM</strong></p>
                <p>Saturday: <strong>8:30 AM – 1:30 PM</strong></p>
                <p className="text-slate-500">Sundays & Govt Holidays: Closed</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-emerald-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Counseling Desk Open</span>
            </div>
          </div>
        </div>

        {/* Form + Tour Scheduler Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Message Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card relative">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#354024] uppercase tracking-wider">
                  Direct Inquiries
                </span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-1">
                  Send a Written Inquiry
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Leave a message for academic coordination or student services.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#354024] bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SQL Persisted</span>
              </div>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-sky-50/70 rounded-2xl border border-sky-100 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#354024] mx-auto" />
                <h4 className="font-heading text-xl font-bold text-slate-900">
                  Inquiry Dispatched Successfully!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your message has been stored in our communications database. Our front office counselor will respond within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#354024] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mrs. Neha Kulkarni"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="neha@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98220 99887"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject Matter *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bus Routes / Fee Details"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Detailed Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your questions or notes here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none resize-none"
                  />
                </div>

                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group inline-flex items-center justify-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white font-bold py-4 rounded-full shadow-lg transition-all text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Recording Query...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                      <span>DISPATCH INQUIRY</span>
                    </>
                  )}
                </MagneticButton>
              </form>
            )}
          </div>

          {/* Campus Tour Booking Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#252d19] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-[#cfbb99] uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Experience Our Campus</span>
              </div>
              <h3 className="font-heading text-2xl font-bold">Schedule a Campus Visit</h3>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                Take a 45-minute guided walkthrough with an academic counselor. View our smart classrooms, science suites, and sports grounds.
              </p>

              {tourBooked ? (
                <div className="mt-6 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-base">Campus Tour Scheduled!</h4>
                  <p className="text-xs text-slate-200">
                    We look forward to welcoming you on <span className="font-bold text-white">{tourData.date}</span> during <span className="font-bold text-white">{tourData.time_slot}</span>.
                  </p>
                  <button
                    onClick={() => setTourBooked(false)}
                    className="text-xs text-[#cfbb99] hover:underline pt-2 inline-block font-bold cursor-pointer"
                  >
                    Reschedule or book another date
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTourSubmit} className="mt-6 space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-200 mb-1">
                      Parent / Guardian Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Verma"
                      value={tourData.parent_name}
                      onChange={(e) => setTourData({ ...tourData, parent_name: e.target.value })}
                      className="w-full p-3 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:bg-white/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-200 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={tourData.phone}
                      onChange={(e) => setTourData({ ...tourData, phone: e.target.value })}
                      className="w-full p-3 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:bg-white/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-200 mb-1">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-300 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={tourData.date}
                        onChange={(e) => setTourData({ ...tourData, date: e.target.value })}
                        className="w-full pl-10 pr-3 py-3 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:bg-white/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-200 mb-1">
                      Preferred Slot
                    </label>
                    <select
                      value={tourData.time_slot}
                      onChange={(e) => setTourData({ ...tourData, time_slot: e.target.value })}
                      className="w-full p-3 text-xs rounded-xl bg-[#0a192f] border border-white/20 text-white outline-none"
                    >
                      <option value="Morning (9:30 AM – 11:30 AM)">Morning (9:30 AM – 11:30 AM)</option>
                      <option value="Afternoon (1:30 PM – 3:30 PM)">Afternoon (1:30 PM – 3:30 PM)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#354024] hover:bg-[#252d19] text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-colors shadow-lg mt-2 cursor-pointer"
                  >
                    CONFIRM TOUR REQUEST
                  </button>
                </form>
              )}
            </div>

            {/* Location Map Preview */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                <Compass className="w-4 h-4 text-[#354024]" />
                <span>How to Reach Our Campus</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Located 1.5 km off the State Highway near Simri Bakhtiyarpur railway junction. Ample visitor parking available within the main north gate.
              </p>
              <div className="mt-4">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#354024] hover:text-[#252d19] transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
