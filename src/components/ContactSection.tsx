import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { addContactMessage } from '../lib/submissions';
import { TextReveal } from './motion/TextReveal';
import { MagneticButton } from './motion/MagneticButton';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await addContactMessage({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSubmitted(true);
      onRecordAdded();
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact message:', error);
      setErrorMessage(
        'Unable to dispatch your message right now. Please check your network connection and try again, or reach our front office desk directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#f8fafc] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#354024]/5 border border-[#354024]/20 px-3.5 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#354024]" />
            <span className="text-[11px] font-extrabold tracking-widest text-[#354024] uppercase">
              GET IN TOUCH
            </span>
          </div>
          <h2 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b2213] tracking-tight mt-1">
            <TextReveal>Connect With Our Campus</TextReveal>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Schedule a personalized campus tour, ask questions about enrollment, or speak with our academic counselors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#354024]/5 text-[#354024] flex items-center justify-center shrink-0 border border-[#354024]/20">
                <MapPin className="w-6 h-6 text-[#354024]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Campus Location</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  AMAA High School Campus, Beldari, Simri Bakhtiyarpur, Patna – 801113, Bihar, India
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#354024]/5 text-[#354024] flex items-center justify-center shrink-0 border border-[#354024]/20">
                <Phone className="w-6 h-6 text-[#354024]" />
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

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#354024]/5 text-[#354024] flex items-center justify-center shrink-0 border border-[#354024]/20">
                <Mail className="w-6 h-6 text-[#354024]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Official Correspondence</h4>
                <p className="text-xs text-slate-600 mt-1">
                  General: <span className="text-[#354024] font-medium">info@amaaschool.edu</span>
                </p>
                <p className="text-xs text-slate-600">
                  Admissions: <span className="text-[#354024] font-medium">admissions@amaaschool.edu</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#354024]/5 text-[#354024] flex items-center justify-center shrink-0 border border-[#354024]/20">
                <Clock className="w-6 h-6 text-[#354024]" />
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

          {/* Right: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-crest text-xl sm:text-2xl font-bold text-[#1b2213]">
                  Send an Inquiry
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Direct message our principal or admissions department.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#354024] bg-[#354024]/5 px-3 py-1 rounded-full border border-[#354024]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#354024]" />
                <span>SQL Persisted</span>
              </div>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-[#354024]/5 rounded-2xl border border-slate-200 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#354024] mx-auto" />
                <h4 className="font-crest text-lg font-bold text-[#1b2213]">
                  Message Logged Successfully!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your inquiry has been stored in our communications database. Our front office counselor will respond within 24 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setErrorMessage(null);
                  }}
                  className="mt-2 text-xs font-bold text-[#354024] hover:underline cursor-pointer"
                >
                  Send another query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <span className="font-bold">Notice:</span>
                    <span>{errorMessage}</span>
                  </div>
                )}
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
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none"
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
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none"
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
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none"
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
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none"
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
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-none resize-none"
                  />
                </div>

                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group inline-flex items-center justify-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Recording Query...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                      <span>Dispatch Message</span>
                    </>
                  )}
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
