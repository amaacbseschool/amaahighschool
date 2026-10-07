import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Mail, Phone, BookOpen, School, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import { supabase } from '../lib/supabase';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordAdded: () => void;
}

interface SubmittedAdmissionReceipt {
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade_applying: string;
  status: string;
  submitted_at: string;
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

  const [submittedData, setSubmittedData] = useState<SubmittedAdmissionReceipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const gradeOptions = [
    'Grade VI (Middle School)',
    'Grade VII (Middle School)',
    'Grade VIII (Middle School)',
    'Grade IX (Secondary School)',
    'Grade X (Board Examination)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Direct anonymous insert into Supabase public.admissions_enquiries
      // Plain insert without .select() because anonymous users cannot SELECT admissions records
      const { error } = await supabase
        .from('admissions_enquiries')
        .insert([{
          student_name: formData.student_name.trim(),
          parent_name: formData.parent_name.trim(),
          parent_email: formData.email.trim(),
          parent_phone: formData.phone.trim(),
          class_applying_for: formData.grade_applying,
          previous_school: formData.previous_school.trim() || null,
          message: formData.notes.trim() || null,
          document_urls: [],
        }]);

      if (error) {
        console.error('[Supabase Admissions Error] Failed to submit enquiry:', error);
        setErrorMessage('Unable to submit your application right now. Please check your details and try again.');
        setIsSubmitting(false);
        return;
      }

      const receipt: SubmittedAdmissionReceipt = {
        student_name: formData.student_name.trim(),
        parent_name: formData.parent_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        grade_applying: formData.grade_applying,
        status: 'Pending Review',
        submitted_at: new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      };

      setIsSubmitting(false);
      setSubmittedData(receipt);
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
    } catch (err: unknown) {
      console.error('[Supabase Admissions Error] Unexpected exception:', err);
      setErrorMessage('A network error occurred while submitting your application. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setErrorMessage(null);
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

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

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
                        Submitting Application to Supabase...
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
                <span className="text-[11px] font-bold text-[#354024] bg-[#354024]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Application Submitted Successfully
                </span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-3">
                  Admission Enquiry Received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Thank you, <strong>{submittedData.parent_name}</strong>. The application for{' '}
                  <strong>{submittedData.student_name}</strong> ({submittedData.grade_applying}) has been
                  received with status <em>'{submittedData.status}'</em>.
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2 font-semibold text-slate-800">
                  <span>Application Status:</span>
                  <span className="font-mono text-[#354024] font-bold">{submittedData.status}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Student Name:</span>
                  <span className="font-semibold text-slate-800">{submittedData.student_name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Grade / Class:</span>
                  <span>{submittedData.grade_applying}</span>
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
                  <span>Submitted At:</span>
                  <span className="font-mono text-[11px]">{submittedData.submitted_at}</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-center">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto bg-[#1b2213] hover:bg-[#354024] text-white font-bold px-8 py-2.5 text-xs rounded-full transition-colors cursor-pointer shadow-md"
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
