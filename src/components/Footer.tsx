import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import artechLogo from '../assets/artech_logo.png';
import { db } from '../lib/db';
import type { RouteType } from '../types/routes';

interface FooterProps {
  onOpenAdmission: () => void;
  onOpenSqlConsole?: () => void;
  onNavigateRoute?: (route: RouteType, hashTarget?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmission, onNavigateRoute }) => {
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

  const handleNav = (route: RouteType) => {
    if (onNavigateRoute) {
      onNavigateRoute(route);
    }
  };

  return (
    <footer className="bg-[#07111e] text-slate-300 pt-16 pb-8 border-t border-slate-800 relative z-10">
      <div className="w-[90%] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: School Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 flex items-center justify-center backdrop-blur-xs">
                <img
                  src={logoImg}
                  alt="A.M.A. Adinarayana Eng. Med. High School Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-crest text-base font-bold text-white tracking-wider block leading-tight">
                  A.M.A. ADINARAYANA
                </span>
                <span className="font-crest text-xs font-bold text-[#38bdf8] tracking-widest block mt-0.5">
                  ENG. MED. HIGH SCHOOL
                </span>
                <span className="text-[10px] font-bold text-[#daa520] uppercase tracking-wider block mt-1">
                  "Lead Kindly Light" • Estd. 1965
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Illuminating young minds since 1965 with foundational moral values, academic rigor, scientific curiosity, and holistic development.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0284c7] text-white flex items-center justify-center transition-colors border border-white/20"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0284c7] text-white flex items-center justify-center transition-colors border border-white/20"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0284c7] text-white flex items-center justify-center transition-colors border border-white/20"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#0284c7] text-white flex items-center justify-center transition-colors border border-white/20"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              EXPLORE PAGES
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('administration')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer text-[#38bdf8]/90 font-medium">
                  Administration & Trust
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('academics')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Academics & Wings
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('campus')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Campus & Facilities
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Campus Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmission} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer text-[#38bdf8] font-semibold">
                  Online Admission Enquiry
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('student-life')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Student Life & NCC
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('achievements')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Achievements
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('news-events')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  News & Events
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('alumni')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Alumni Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: High School Academic Wings */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              HIGH SCHOOL WINGS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('academics')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Middle School Wing (Grades 6–8)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('academics')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Secondary Board (Grades 9–10)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('campus')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Science & Computer Laboratories
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('student-life')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  NCC & Student Police Cadets
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('academics')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Academic Curriculum & Pedagogy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('campus')} className="hover:text-[#38bdf8] transition-colors text-left cursor-pointer">
                  Digital Library & Labs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('administration')} className="text-[#38bdf8] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  Staff & Administration Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              CONTACT US
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <span>Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>+91 75440 10044</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>info@amaaschool.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <span>Mon – Sat: 8:00 AM – 4:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 5: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              NEWSLETTER
            </h4>
            <p className="text-xs text-slate-400">
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
                  className="w-full bg-white/10 rounded-xl text-xs px-3.5 py-3 border border-white/20 focus:border-[#0284c7] focus:outline-hidden pr-10 text-white placeholder-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg transition-all flex items-center justify-center font-bold cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {subscribedMsg && (
                <div className="flex items-center gap-1.5 text-[11px] text-white bg-emerald-950/80 p-2 rounded-lg border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{subscribedMsg}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Copyright, Legal & Developer Credits */}
        <div className="pt-8 mt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-5 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} AMAA High School. All Rights Reserved.</p>

          {/* Developed by AR TECH studio with Logo & URL */}
          <a
            href="https://www.artechstudio.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#0284c7]/40 px-4 py-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer"
            title="Visit AR TECH studio official website"
          >
            <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
              Developed by
            </span>
            <img
              src={artechLogo}
              alt="AR TECH studio logo"
              className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-xs"
            />
            <span className="font-semibold text-xs tracking-wider text-white group-hover:text-[#38bdf8] transition-colors">
              AR TECH studio
            </span>
          </a>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Mandatory Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
