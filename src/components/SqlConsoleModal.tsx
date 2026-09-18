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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 text-slate-100 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-800/40 relative overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#4f000b] px-6 py-4 border-b border-red-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-900/60 text-amber-300 flex items-center justify-center border border-red-500/40">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-crest">
                    AMAA High School SQL Database Manager
                  </h3>
                  <span className="text-[10px] font-mono bg-red-950 text-red-200 px-2 py-0.5 rounded border border-red-800">
                    SQLite WASM / Local Engine
                  </span>
                </div>
                <p className="text-xs text-red-200/80">
                  Inspect relational tables, review student admission applications, and test raw SQL queries.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Bar */}
          <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('console')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'console'
                    ? 'bg-[#ba181b] text-white border border-red-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Interactive SQL Terminal</span>
              </button>

              <button
                onClick={() => setActiveTab('admissions')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'admissions'
                    ? 'bg-[#ba181b] text-white border border-red-500'
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
                className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1"
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
                    Quick Preset SQL Queries:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {presetQueries.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSqlQuery(preset.sql);
                          runCurrentQuery(preset.sql);
                        }}
                        className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 px-2.5 py-1 rounded-md border border-slate-700 transition-colors font-mono"
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
                      className="w-full bg-slate-950 font-mono text-xs sm:text-sm p-4 rounded-xl border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-emerald-300 leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Tables available: <strong className="text-slate-200">admissions_enquiries</strong>,{' '}
                      <strong className="text-slate-200">contact_messages</strong>,{' '}
                      <strong className="text-slate-200">school_notices</strong>,{' '}
                      <strong className="text-slate-200">newsletter_subscribers</strong>
                    </span>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Execute SQL</span>
                    </button>
                  </div>
                </form>

                {/* Query Results Box */}
                {queryResult && (
                  <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">Execution Result:</span>
                        <span>{queryResult.rowCount} rows returned</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{queryResult.executionTimeMs} ms</span>
                      </div>
                    </div>

                    {queryResult.error ? (
                      <div className="p-4 text-xs font-mono text-rose-400 bg-rose-950/20">
                        Error: {queryResult.error}
                      </div>
                    ) : (
                      <div className="overflow-x-auto max-h-72">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-900 text-slate-300 border-b border-slate-800 sticky top-0">
                            <tr>
                              {queryResult.columns.map((col, cidx) => (
                                <th key={cidx} className="p-2.5 font-bold uppercase tracking-wider text-amber-400/90">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {queryResult.rows.map((row, ridx) => (
                              <tr key={ridx} className="hover:bg-slate-900/60 transition-colors">
                                {row.map((cell, cidx) => (
                                  <td key={cidx} className="p-2.5 text-slate-300 whitespace-nowrap">
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
                  <h4 className="text-sm font-bold text-white">
                    Logged Admissions Enquiries (Stored in SQL)
                  </h4>
                  <span className="text-xs text-slate-400">
                    Click status dropdown to update student application workflow.
                  </span>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
                        <tr>
                          <th className="p-3 font-bold">ID</th>
                          <th className="p-3 font-bold">Student Name</th>
                          <th className="p-3 font-bold">Parent & Contact</th>
                          <th className="p-3 font-bold">Grade Applying</th>
                          <th className="p-3 font-bold">Workflow Status</th>
                          <th className="p-3 font-bold">Logged At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {admissions.map((adm) => (
                          <tr key={adm.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 font-mono text-amber-400">#{adm.id}</td>
                            <td className="p-3 font-bold text-white">{adm.student_name}</td>
                            <td className="p-3 text-slate-300">
                              <div>{adm.parent_name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{adm.phone}</div>
                            </td>
                            <td className="p-3 font-medium text-emerald-300">{adm.grade_applying}</td>
                            <td className="p-3">
                              <select
                                value={adm.status}
                                onChange={(e) =>
                                  handleStatusChange(adm.id, e.target.value as AdmissionEnquiry['status'])
                                }
                                className={`text-xs px-2.5 py-1 rounded-lg font-bold border outline-none cursor-pointer ${
                                  adm.status === 'Admission Approved'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                    : adm.status === 'Interview Scheduled'
                                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                <option value="Pending Review">Pending Review</option>
                                <option value="Document Verification">Document Verification</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Admission Approved">Admission Approved</option>
                              </select>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
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
          <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>SQL Engine Active & Synchronized</span>
            </div>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-1.5 rounded-lg transition-colors"
            >
              Close Console
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
