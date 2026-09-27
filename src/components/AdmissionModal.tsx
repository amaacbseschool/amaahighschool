import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Mail, Phone, BookOpen, School, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import { db } from '../lib/db';
import type { AdmissionEnquiry } from '../lib/db';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSqlConsole?: () => void;
  onRecordAdded: () => void;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  onRecordAdded,
}) => {
  const [formData, setFormData] = useState({
    student_name: '',
    parent_name: '',
    email: '',
    phone: '',
    grade_applying: 'Grade I',
    previous_school: '',
    notes: '',
  });

  const [submittedData, setSubmittedData] = useState<AdmissionEnquiry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gradeOptions = [
    'Grade VI (Middle School)',
    'Grade VII (Middle School)',
    'Grade VIII (Middle School)',
    'Grade IX (Secondary School)',
    'Grade X (Board Examination)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newRecord = db.addAdmission({
        student_name: formData.student_name,
        parent_name: formData.parent_name,
        email: formData.email,
        phone: formData.phone,
        grade_applying: formData.grade_applying,
        previous_school: formData.previous_school || 'Not Specified',
        notes: formData.notes || 'None',
      });

      setIsSubmitting(false);
      setSubmittedData(newRecord);
      onRecordAdded();

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#44105c', '#e40046', '#9333ea', '#fbbf24'],
        });
      } catch (err) {
        console.log('Confetti error:', err);
      }
    }, 500);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      student_name: '',
      parent_name: '',
      email: '',
      phone: '',
      grade_applying: 'Grade I',
      previous_school: '',
      notes: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 relative my-8 shadow-2xl text-slate-900"
        >
          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!submittedData ? (
            <div>
              <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-slate-100">
                <img
                  src={logoImg}
                  alt="Official Crest"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#e40046] uppercase tracking-wider">
                    <span>A.M.A. ADINARAYANA HIGH SCHOOL</span>
                    <span>•</span>
                    <span>ESTD. 1965</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                    Online Admission Application
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    "Lead Kindly Light" • Session 2025–26 Enrolment
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student's Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.student_name}
                        onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                      />
                    </div>
                  </div>

                  {/* Parent Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent / Guardian Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={formData.parent_name}
                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="parent@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Grade Applying For */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Grade / Class Seeking *
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={formData.grade_applying}
                        onChange={(e) => setFormData({ ...formData, grade_applying: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none bg-white"
                      >
                        {gradeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Previous School */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Previous School & Board
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. St. Jude / State Board"
                        value={formData.previous_school}
                        onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes / Queries */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Inquiries or Bus Route Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g. Seeking school bus transport route near East Colony; interest in sports academy."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#44105c] focus:ring-1 focus:ring-[#44105c] outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group inline-flex items-center justify-center gap-2 bg-[#e40046] hover:bg-[#c9003c] text-white font-bold py-3.5 rounded-full transition-all text-xs uppercase tracking-wider disabled:opacity-50 shadow-lg cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Persisting Application to Database...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>SUBMIT ADMISSION APPLICATION</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Confirmation State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#44105c] bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Application Persisted to Database
                </span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-3">
                  Admission Enquiry Received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Thank you, <strong>{submittedData.parent_name}</strong>. The application for{' '}
                  <strong>{submittedData.student_name}</strong> ({submittedData.grade_applying}) has been
                  persisted with status <em>'{submittedData.status}'</em>.
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2 font-semibold text-slate-800">
                  <span>Reference ID:</span>
                  <span className="font-mono text-[#44105c] font-bold">AMAA-2025-00{submittedData.id}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Registered Contact:</span>
                  <span>{submittedData.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Email Confirmation:</span>
                  <span>{submittedData.email}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Timestamp:</span>
                  <span className="font-mono text-[11px]">{submittedData.created_at}</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-center">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto bg-[#0a192f] hover:bg-[#0284c7] text-white font-bold px-8 py-2.5 text-xs rounded-full transition-colors cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
