import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, GraduationCap, Send, Database, User, Mail, Phone, BookOpen, School } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../lib/db';
import type { AdmissionEnquiry } from '../lib/db';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSqlConsole: () => void;
  onRecordAdded: () => void;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  onOpenSqlConsole,
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
    'Nursery / Pre-KG',
    'Lower Kindergarten (LKG)',
    'Upper Kindergarten (UKG)',
    'Grade I',
    'Grade II',
    'Grade III',
    'Grade IV',
    'Grade V',
    'Grade VI',
    'Grade VII',
    'Grade VIII',
    'Grade IX',
    'Grade X (High School)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Insert into SQL database
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

      // Trigger celebration confetti with Red and White theme
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ba181b', '#e5383b', '#ffffff', '#660708', '#fae084'],
        });
      } catch (err) {
        console.log('Confetti error:', err);
      }
    }, 600);
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-blue-100 relative my-8"
        >
          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!submittedData ? (
            <div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#1d4ed8] uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4 text-[#1d4ed8]" />
                <span>Admission Session 2025–26</span>
              </div>

              <h3 className="font-crest text-2xl sm:text-3xl font-bold text-[#0a192f]">
                Online Admission Enquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
                Fill in the details below. Records are validated and stored directly into our institutional SQL database.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student's Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.student_name}
                        onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none"
                      />
                    </div>
                  </div>

                  {/* Parent Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent / Guardian Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={formData.parent_name}
                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none"
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
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="parent@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none"
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
                      <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={formData.grade_applying}
                        onChange={(e) => setFormData({ ...formData, grade_applying: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none bg-white"
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
                      <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. St. Jude / State Board"
                        value={formData.previous_school}
                        onChange={(e) => setFormData({ ...formData, previous_school: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes / Queries */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Inquiries or Transportation Needs
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g. Seeking school bus transport route near East Colony; interest in sports academy."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group inline-flex items-center justify-center gap-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Recording to SQL Database...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        <span>Submit Admission Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Confirmation State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-sky-100 text-[#1d4ed8] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10 text-[#1d4ed8]" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#1d4ed8] bg-sky-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Application Logged in SQL Database
                </span>
                <h3 className="font-crest text-2xl font-bold text-[#0a192f] mt-3">
                  Admission Enquiry Received!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Thank you, <strong>{submittedData.parent_name}</strong>. Application for{' '}
                  <strong>{submittedData.student_name}</strong> ({submittedData.grade_applying}) has been
                  persisted with tracking status <em>'{submittedData.status}'</em>.
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-sky-50/70 p-4 rounded-2xl border border-blue-100 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-blue-100 pb-1.5 font-semibold text-slate-700">
                  <span>Application Reference ID:</span>
                  <span className="font-mono text-[#1d4ed8] font-bold">AMAA-2025-00{submittedData.id}</span>
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

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    handleReset();
                    onOpenSqlConsole();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0a192f] text-white font-bold px-5 py-2.5 rounded-xl text-xs border border-blue-400/40 hover:bg-[#0f2b48] transition-colors"
                >
                  <Database className="w-4 h-4 text-sky-300" />
                  <span>View in SQL Console</span>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto bg-[#1d4ed8] text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#1e40af] transition-colors"
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
