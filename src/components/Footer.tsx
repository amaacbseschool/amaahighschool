import React, { useState } from 'react';
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { db } from '../lib/db';

interface FooterProps {
  onOpenAdmission: () => void;
  onOpenSqlConsole: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmission, onOpenSqlConsole }) => {
  const [email, setEmail] = useState('');
  const [subscribedMsg, setSubscribedMsg] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const res = db.addNewsletterSubscriber(email);
    setSubscribedMsg(res.message);
    setEmail('');

    setTimeout(() => {
      setSubscribedMsg(null);
    }, 4000);
  };

  return (
    <footer className="bg-[#052018] text-emerald-100/80 pt-16 pb-8 border-t border-emerald-900/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Column 1: School Identity matching reference */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="AMAA High School Crest"
                className="w-12 h-12 object-contain filter drop-shadow-md"
              />
              <div>
                <span className="font-crest text-xl font-bold text-white tracking-wider block leading-none">
                  AMAA
                </span>
                <span className="font-crest text-xs font-semibold text-amber-400 tracking-widest block mt-0.5">
                  HIGH SCHOOL
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/70 leading-relaxed max-w-xs">
              Nurturing young minds with strong values, academic excellence, and boundless holistic development.
            </p>

            {/* Social Icons matching reference */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-amber-400 hover:text-slate-950 text-emerald-300 flex items-center justify-center transition-colors border border-emerald-700/40"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-amber-400 hover:text-slate-950 text-emerald-300 flex items-center justify-center transition-colors border border-emerald-700/40"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-amber-400 hover:text-slate-950 text-emerald-300 flex items-center justify-center transition-colors border border-emerald-700/40"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-amber-400 hover:text-slate-950 text-emerald-300 flex items-center justify-center transition-colors border border-emerald-700/40"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links matching reference */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black tracking-widest text-amber-400 uppercase">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-300 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#academics" className="hover:text-amber-300 transition-colors">Academics</a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-amber-300 transition-colors">Facilities</a>
              </li>
              <li>
                <button onClick={onOpenAdmission} className="hover:text-amber-300 text-left transition-colors">
                  Admissions
                </button>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-300 transition-colors">Gallery</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-300 transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Information matching reference */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black tracking-widest text-amber-400 uppercase">
              INFORMATION
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#contact" className="hover:text-amber-300 transition-colors">Fee Structure</a>
              </li>
              <li>
                <button onClick={onOpenAdmission} className="hover:text-amber-300 text-left transition-colors">
                  Admission Process
                </button>
              </li>
              <li>
                <a href="#notices" className="hover:text-amber-300 transition-colors">School Calendar</a>
              </li>
              <li>
                <a href="#notices" className="hover:text-amber-300 transition-colors">News & Events</a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-300 transition-colors">Career Opportunities</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-300 transition-colors">Alumni Network</a>
              </li>
              <li>
                <button onClick={onOpenSqlConsole} className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                  Staff & SQL Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us matching reference */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black tracking-widest text-amber-400 uppercase">
              CONTACT US
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-200/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 75440 10044</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@amaaschool.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon – Sat: 8:00 AM – 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 5: Newsletter matching reference */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black tracking-widest text-amber-400 uppercase">
              NEWSLETTER
            </h4>
            <p className="text-xs text-emerald-200/70">
              Subscribe to our newsletter for latest notifications, examination circulars, and sports event updates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#06241a] text-xs px-3.5 py-2.5 rounded-lg border border-emerald-700/60 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none pr-10 text-white placeholder-emerald-400/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 rounded-md transition-colors flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribedMsg && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-emerald-950/80 p-2 rounded-lg border border-amber-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{subscribedMsg}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Copyright and Legal matching reference */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-400/60">
          <p>© {new Date().getFullYear()} AMAA High School. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-emerald-200 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-emerald-200 transition-colors">Terms & Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-emerald-200 transition-colors">CBSE Mandatory Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
