import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  X,
  Play,
  Table,
  RotateCcw,
  Terminal,
  Clock,
} from 'lucide-react';
import { db } from '../lib/db';
import type { QueryResult, AdmissionEnquiry } from '../lib/db';

interface SqlConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatabaseChanged: () => void;
}

export const SqlConsoleModal: React.FC<SqlConsoleModalProps> = ({
  isOpen,
  onClose,
  onDatabaseChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'admissions' | 'contacts' | 'notices'>(
    'console'
  );
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT id, student_name, parent_name, grade_applying, status, created_at FROM admissions_enquiries ORDER BY id DESC;'
  );
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [admissions, setAdmissions] = useState<AdmissionEnquiry[]>([]);

  const refreshData = () => {
    setAdmissions(db.getAdmissions());
    runCurrentQuery(sqlQuery);
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const runCurrentQuery = (queryText: string) => {
    const res = db.executeSQL(queryText);
    setQueryResult(res);
  };

  const handleRunQuery = (e: React.FormEvent) => {
    e.preventDefault();
    runCurrentQuery(sqlQuery);
  };

  const handleStatusChange = (id: number, newStatus: AdmissionEnquiry['status']) => {
    db.updateAdmissionStatus(id, newStatus);
    refreshData();
    onDatabaseChanged();
  };

  const presetQueries = [
    {
      label: 'All Admissions',
      sql: 'SELECT id, student_name, grade_applying, status, phone FROM admissions_enquiries ORDER BY id DESC;',
    },
    {
      label: 'Active Notices',
      sql: 'SELECT id, category, title, date FROM school_notices ORDER BY id ASC;',
    },
    {
      label: 'Contact Messages',
      sql: 'SELECT id, full_name, email, subject, status FROM contact_messages;',
    },
    {
      label: 'Newsletter Subscribers',
      sql: 'SELECT id, email, subscribed_at FROM newsletter_subscribers;',
    },
    {
      label: 'Count Admissions',
      sql: 'SELECT COUNT(*) FROM admissions_enquiries;',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#160a22] text-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl rounded-3xl border border-white/10 relative overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e0e2e] to-[#350b4d] px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e40046] text-white flex items-center justify-center shadow-md">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-heading">
                    AMAA High School SQL Console
                  </h3>
                  <span className="text-[10px] font-mono bg-white/10 text-pink-200 px-2.5 py-0.5 rounded-full border border-white/10">
                    SQLite Engine
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Inspect relational tables, review student admission applications, and test live SQL queries.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Bar */}
          <div className="bg-[#12071c] px-6 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('console')}
                className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'console'
                    ? 'bg-[#44105c] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Interactive SQL Terminal</span>
              </button>

              <button
                onClick={() => setActiveTab('admissions')}
                className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'admissions'
                    ? 'bg-[#44105c] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Manage Admissions ({admissions.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  db.resetDatabase();
                  refreshData();
                  onDatabaseChanged();
                }}
                className="text-[11px] text-slate-400 hover:text-[#e40046] flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset Database to Default Seeds"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Seed Data</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'console' ? (
              <div className="space-y-4">
                {/* Preset SQL queries quick buttons */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    Quick Preset Queries:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {presetQueries.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSqlQuery(preset.sql);
                          runCurrentQuery(preset.sql);
                        }}
                        className="text-[11px] bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-white/10 transition-colors font-mono cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SQL Query Editor form */}
                <form onSubmit={handleRunQuery} className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      placeholder="Type your SQL query here (e.g. SELECT * FROM admissions_enquiries;)"
                      className="w-full bg-slate-950 font-mono text-xs sm:text-sm p-4 rounded-2xl border border-white/15 focus:border-[#e40046] focus:ring-1 focus:ring-[#e40046] outline-none text-[#f472b6] leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Tables available: <strong className="text-white">admissions_enquiries</strong>,{' '}
                      <strong className="text-white">contact_messages</strong>,{' '}
                      <strong className="text-white">school_notices</strong>,{' '}
                      <strong className="text-white">newsletter_subscribers</strong>
                    </span>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 bg-[#e40046] hover:bg-[#c9003c] text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-white" />
                      <span>Execute SQL</span>
                    </button>
                  </div>
                </form>

                {/* Query Results Box */}
                {queryResult && (
                  <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="bg-slate-900/90 px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">Execution Result:</span>
                        <span>{queryResult.rowCount} rows returned</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-pink-400" />
                        <span>{queryResult.executionTimeMs} ms</span>
                      </div>
                    </div>

                    {queryResult.error ? (
                      <div className="p-4 text-xs font-mono text-rose-400 bg-rose-950/30">
                        Error: {queryResult.error}
                      </div>
                    ) : (
                      <div className="overflow-x-auto max-h-72">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-900 text-slate-300 border-b border-white/10 sticky top-0">
                            <tr>
                              {queryResult.columns.map((col, cidx) => (
                                <th key={cidx} className="p-3 font-bold uppercase tracking-wider text-pink-300">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {queryResult.rows.map((row, ridx) => (
                              <tr key={ridx} className="hover:bg-white/5 transition-colors">
                                {row.map((cell, cidx) => (
                                  <td key={cidx} className="p-3 text-slate-300 whitespace-nowrap">
                                    {String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Admissions Review Table Tab */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-heading">
                    Logged Admissions Enquiries (Stored in SQL)
                  </h4>
                  <span className="text-xs text-slate-400">
                    Click status dropdown to update student application workflow.
                  </span>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-300 border-b border-white/10">
                        <tr>
                          <th className="p-3.5 font-bold">ID</th>
                          <th className="p-3.5 font-bold">Student Name</th>
                          <th className="p-3.5 font-bold">Parent & Contact</th>
                          <th className="p-3.5 font-bold">Grade Applying</th>
                          <th className="p-3.5 font-bold">Workflow Status</th>
                          <th className="p-3.5 font-bold">Logged At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {admissions.map((adm) => (
                          <tr key={adm.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-mono text-[#f472b6]">#{adm.id}</td>
                            <td className="p-3.5 font-bold text-white">{adm.student_name}</td>
                            <td className="p-3.5 text-slate-300">
                              <div>{adm.parent_name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{adm.phone}</div>
                            </td>
                            <td className="p-3.5 font-medium text-purple-300">{adm.grade_applying}</td>
                            <td className="p-3.5">
                              <select
                                value={adm.status}
                                onChange={(e) =>
                                  handleStatusChange(adm.id, e.target.value as AdmissionEnquiry['status'])
                                }
                                className={`text-xs px-3 py-1 rounded-full font-bold border outline-none cursor-pointer ${
                                  adm.status === 'Admission Approved'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                    : adm.status === 'Interview Scheduled'
                                    ? 'bg-purple-950 text-purple-300 border-purple-500/40'
                                    : 'bg-slate-900 text-slate-300 border-slate-700'
                                }`}
                              >
                                <option value="Pending Review">Pending Review</option>
                                <option value="Document Verification">Document Verification</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Admission Approved">Admission Approved</option>
                              </select>
                            </td>
                            <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                              {adm.created_at}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#12071c] px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>SQL Engine Active & Synchronized</span>
            </div>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Close Console
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
