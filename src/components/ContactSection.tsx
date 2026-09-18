import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { db } from '../lib/db';

interface ContactSectionProps {
  onRecordAdded: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onRecordAdded }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#f8faf8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold tracking-widest text-[#b87e1f] uppercase">
            GET IN TOUCH
          </span>
          <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-bold text-[#093326] tracking-tight mt-1">
            Connect With Our Campus
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Schedule a personalized campus tour, ask questions about enrollment, or speak with our academic counselors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#093326]/10 text-[#093326] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-[#093326]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Campus Location</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  AMAA High School Campus, Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar, India
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#093326]/10 text-[#093326] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-[#093326]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Telephone Lines</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Main Desk: <strong className="text-slate-800">+91 75440 10044</strong>
                </p>
                <p className="text-xs text-slate-600">
                  Admissions Helpline: <strong className="text-slate-800">+91 75440 10045</strong>
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#093326]/10 text-[#093326] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-[#093326]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Official Correspondence</h4>
                <p className="text-xs text-slate-600 mt-1">
                  General: <span className="text-[#093326] font-medium">info@amaaschool.edu</span>
                </p>
                <p className="text-xs text-slate-600">
                  Admissions: <span className="text-[#093326] font-medium">admissions@amaaschool.edu</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#093326]/10 text-[#093326] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-[#093326]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Visiting Hours</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Monday – Saturday: <strong>8:00 AM – 4:00 PM</strong>
                </p>
                <p className="text-xs text-slate-500">Sunday & Public Holidays: Closed</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Inquiry Form (Connected to SQL) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xl relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-crest text-xl sm:text-2xl font-bold text-[#093326]">
                  Send an Inquiry
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Direct message our principal or admissions department.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SQL Persisted</span>
              </div>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-[#f4f8f5] rounded-2xl border border-emerald-900/10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-crest text-lg font-bold text-[#093326]">
                  Message Logged Successfully!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your inquiry has been stored in our communications database. Our front office counselor will respond within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#093326] hover:underline"
                >
                  Send another query
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
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#093326] focus:ring-1 focus:ring-[#093326] outline-none"
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
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#093326] focus:ring-1 focus:ring-[#093326] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98220 99887"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#093326] focus:ring-1 focus:ring-[#093326] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Campus Tour / Fee Structure"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#093326] focus:ring-1 focus:ring-[#093326] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your questions or notes here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#093326] focus:ring-1 focus:ring-[#093326] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group inline-flex items-center justify-center gap-2 bg-[#093326] hover:bg-[#0e4432] text-amber-300 font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Recording Query...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                      <span>Dispatch Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
