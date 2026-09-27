import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  KeyRound,
  Database,
  Users,
  GraduationCap,
  MessageSquare,
  Bell,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  LogOut,
  Terminal,
  ArrowRight,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { db } from '../lib/db';
import type {
  AdmissionEnquiry,
  ContactMessage,
  SchoolNotice,
  GoverningBodyMember,
} from '../lib/db';
import type { RouteType } from '../types/routes';
import logoImg from '../assets/logo.png';
import artechLogo from '../assets/artech_logo.png';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenSqlConsole: () => void;
}

const DEFAULT_PIN = '1965';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome,
  onNavigateRoute,
  onOpenSqlConsole,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('amaa_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'admissions' | 'messages' | 'notices' | 'governing' | 'sql'
  >('overview');

  // Live Database States
  const [admissions, setAdmissions] = useState<AdmissionEnquiry[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [governing, setGoverning] = useState<GoverningBodyMember[]>([]);

  // Search & Filter States
  const [admissionSearch, setAdmissionSearch] = useState('');
  const [admissionFilter, setAdmissionFilter] = useState<string>('All');
  const [messageSearch, setMessageSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Notice Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Admissions' as SchoolNotice['category'],
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    content: '',
  });

  const reloadAll = () => {
    setAdmissions(db.getAdmissions());
    setMessages(db.getContactMessages());
    setNotices(db.getNotices());
    setGoverning(db.getGoverningBody());
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadAll();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // PIN Login Handler
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      sessionStorage.setItem('amaa_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError(null);
      showToast('Staff authentication granted.');
    } else {
      setPinError('Incorrect Staff PIN. (Hint: School founding year 1965)');
    }
  };

  const handleQuickDemoAccess = () => {
    sessionStorage.setItem('amaa_admin_auth', 'true');
    setIsAuthenticated(true);
    setPinError(null);
    showToast('Quick staff access granted.');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('amaa_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Admissions Actions
  const handleAdmissionStatus = (id: number, status: AdmissionEnquiry['status']) => {
    db.updateAdmissionStatus(id, status);
    setAdmissions(db.getAdmissions());
    showToast(`Updated application #${id} status to ${status}.`);
  };

  const handleDeleteAdmission = (id: number, name: string) => {
    if (window.confirm(`Delete admission enquiry for "${name}"?`)) {
      db.deleteAdmission(id);
      setAdmissions(db.getAdmissions());
      showToast('Admission application deleted.');
    }
  };

  // Contact Message Actions
  const handleMessageStatus = (id: number, status: ContactMessage['status']) => {
    db.updateContactMessageStatus(id, status);
    setMessages(db.getContactMessages());
    showToast(`Message status updated to ${status}.`);
  };

  const handleDeleteMessage = (id: number) => {
    if (window.confirm('Delete this contact message permanently?')) {
      db.deleteContactMessage(id);
      setMessages(db.getContactMessages());
      showToast('Contact message deleted.');
    }
  };

  // Notice Actions
  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim()) return;
    db.addNotice({
      title: newNotice.title.trim(),
      category: newNotice.category,
      date: newNotice.date.trim(),
      content: newNotice.content.trim() || 'Notice issued by AMAA High School Administration.',
      is_important: false,
    });
    setNotices(db.getNotices());
    setNewNotice({
      title: '',
      category: 'Admissions',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: '',
    });
    showToast('New circular published to school notices ticker.');
  };

  const handleDeleteNotice = (id: number) => {
    if (window.confirm('Remove this circular from the live notice ticker?')) {
      db.deleteNotice(id);
      setNotices(db.getNotices());
      showToast('Notice removed.');
    }
  };

  // Filtered Admissions
  const filteredAdmissions = useMemo(() => {
    return admissions.filter((adm) => {
      const matchesFilter = admissionFilter === 'All' || adm.status === admissionFilter;
      const q = admissionSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        adm.student_name.toLowerCase().includes(q) ||
        adm.parent_name.toLowerCase().includes(q) ||
        adm.grade_applying.toLowerCase().includes(q) ||
        adm.phone.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [admissions, admissionFilter, admissionSearch]);

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    const q = messageSearch.toLowerCase().trim();
    return messages.filter(
      (m) =>
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
    );
  }, [messages, messageSearch]);

  // If Not Authenticated -> Render PIN Passcode Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07111e] via-[#0a192f] to-[#040911] flex items-center justify-center p-4 text-white">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#354024]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center">
            <img
              src={logoImg}
              alt="AMAA High School"
              className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-md"
            />
            <div className="inline-flex items-center gap-1.5 bg-[#354024]/20 text-[#cfbb99] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Authorization</span>
            </div>
            <h1 className="font-crest text-2xl font-bold text-white tracking-tight">
              School Admin Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Restricted management portal for A.M.A. Adinarayana High School staff and board trustees.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Passcode / PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={10}
                  placeholder="Enter Passcode (e.g. 1965)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(null);
                  }}
                  className="w-full bg-white/10 border border-white/15 focus:border-[#cfbb99] focus:bg-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition-all font-mono tracking-widest text-center"
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#354024] to-[#252d19] hover:from-[#252d19] hover:to-[#1b2213] text-white py-3 rounded-xl font-semibold text-xs tracking-wide shadow-lg shadow-stone-900/40 transition-all hover:scale-[1.01] cursor-pointer"
            >
              Verify Staff Identity
            </button>

            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-2.5 rounded-xl font-medium text-xs border border-white/10 transition-colors cursor-pointer"
            >
              Quick Staff Access (Demo Mode)
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={onNavigateHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ← Back to School Site
            </button>
            <span className="font-mono text-[11px]">PIN: 1965</span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center">
            <a
              href="https://www.artechstudio.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[10px] text-slate-400 hover:text-white transition-colors"
            >
              <span>Developed by</span>
              <img
                src={artechLogo}
                alt="AR TECH studio"
                className="h-4.5 w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-xs"
              />
              <span className="font-semibold text-slate-300 group-hover:text-[#cfbb99] transition-colors">
                AR TECH studio
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Staff Dashboard
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#0a192f] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#cfbb99]/40 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#cfbb99]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Dashboard Top Header Bar */}
      <header className="bg-[#0a192f] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="w-[92%] mx-auto py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="AMAA Logo"
              className="w-9 h-9 object-contain drop-shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-crest font-bold text-base text-white">
                  AMAA High School
                </span>
                <span className="text-[10px] bg-[#cfbb99]/20 text-[#cfbb99] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Admin Control Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Staff Operations, Enquiries, Circulars & SQL Inspector
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onOpenSqlConsole}
              className="hidden sm:flex items-center gap-1.5 bg-[#354024] hover:bg-[#252d19] text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
              title="Launch SQL Database Console"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SQL Console</span>
            </button>

            <button
              onClick={() => onNavigateRoute('home')}
              className="text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              Public Site
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="w-[92%] mx-auto flex items-center gap-1 overflow-x-auto pt-1 pb-2 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-[#0a192f] shadow-xs'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            📊 Operations Overview
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'admissions'
                ? 'bg-white text-[#0a192f] shadow-xs'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Admissions</span>
            <span className="bg-[#354024] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {admissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-white text-[#0a192f] shadow-xs'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact Messages</span>
            <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-white text-[#0a192f] shadow-xs'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notices & Circulars</span>
            <span className="bg-slate-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {notices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('governing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'governing'
                ? 'bg-white text-[#0a192f] shadow-xs'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Governing Body</span>
            <span className="bg-slate-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {governing.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-white text-[#0a192f] shadow-xs'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#cfbb99]" />
            <span>SQL Database</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-[92%] mx-auto mt-8">
        {/* TAB 1: OPERATIONS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Admissions
                  </span>
                  <div className="p-2 rounded-xl bg-sky-50 text-[#354024]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#0a192f]">
                    {admissions.length}
                  </span>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    {admissions.filter((a) => a.status === 'Pending Review').length} Pending Review
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="mt-4 text-xs font-bold text-[#354024] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Review Applications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Inquiries Received
                  </span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#0a192f]">
                    {messages.length}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {messages.filter((m) => m.status === 'Unread').length} New
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="mt-4 text-xs font-bold text-[#354024] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Inbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Active Circulars
                  </span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Bell className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#0a192f]">
                    {notices.length}
                  </span>
                  <span className="text-xs text-slate-500">Live on Ticker</span>
                </div>
                <button
                  onClick={() => setActiveTab('notices')}
                  className="mt-4 text-xs font-bold text-[#354024] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Publish Notice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Governing Trustees
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#0a192f]">
                    {governing.length}
                  </span>
                  <span className="text-xs text-slate-500">Council Members</span>
                </div>
                <button
                  onClick={() => setActiveTab('governing')}
                  className="mt-4 text-xs font-bold text-[#354024] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage Trust</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Actions & Launch Banner */}
            <div className="bg-gradient-to-r from-[#0a192f] via-[#0f274a] to-[#071324] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-[#cfbb99]/15 border border-[#cfbb99]/30 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#cfbb99]">
                  <Database className="w-3 h-3" />
                  <span>Admin Database Engine</span>
                </div>
                <h3 className="font-crest text-xl sm:text-2xl font-bold">
                  Interactive SQLite Console & Inspection
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Run custom SQL statements across all tables, inspect schemas, or alter application data with zero server lag.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenSqlConsole}
                  className="bg-[#354024] hover:bg-[#252d19] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-stone-900/50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Launch SQL Console</span>
                </button>
              </div>
            </div>

            {/* Recent Admissions Snapshot */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-crest text-lg font-bold text-[#0a192f]">
                    Recent Admission Enquiries
                  </h3>
                  <p className="text-xs text-slate-500">
                    Latest submissions received through the digital portal
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="text-xs font-bold text-[#354024] hover:underline cursor-pointer"
                >
                  View All ({admissions.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">ID</th>
                      <th className="py-3 px-4 font-semibold">Student Name</th>
                      <th className="py-3 px-4 font-semibold">Grade</th>
                      <th className="py-3 px-4 font-semibold">Parent / Contact</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {admissions.slice(0, 5).map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-500">
                          #{adm.id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#0a192f]">
                          {adm.student_name}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {adm.grade_applying}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div>{adm.parent_name}</div>
                          <div className="text-[11px] text-slate-400">{adm.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              adm.status === 'Pending Review'
                                ? 'bg-amber-100 text-amber-700'
                                : adm.status === 'Document Verification'
                                ? 'bg-sky-100 text-sky-700'
                                : adm.status === 'Interview Scheduled'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {adm.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={adm.status}
                            onChange={(e) =>
                              handleAdmissionStatus(
                                adm.id,
                                e.target.value as AdmissionEnquiry['status']
                              )
                            }
                            className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Document Verification">Document Verification</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Admission Approved">Admission Approved</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSIONS MANAGER */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-crest text-xl font-bold text-[#0a192f]">
                  Admissions Applications Registry
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredAdmissions.length} of {admissions.length} student application records
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student, parent, grade..."
                    value={admissionSearch}
                    onChange={(e) => setAdmissionSearch(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                  />
                </div>

                <select
                  value={admissionFilter}
                  onChange={(e) => setAdmissionFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Document Verification">Document Verification</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Admission Approved">Admission Approved</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">ID</th>
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Grade</th>
                    <th className="py-3 px-4 font-semibold">Parent Details</th>
                    <th className="py-3 px-4 font-semibold">Contact Info</th>
                    <th className="py-3 px-4 font-semibold">Applied Date</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        #{adm.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0a192f]">
                        {adm.student_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 font-semibold px-2 py-0.5 rounded-md">
                          {adm.grade_applying}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {adm.parent_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{adm.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{adm.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {adm.created_at.slice(0, 10)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={adm.status}
                          onChange={(e) =>
                            handleAdmissionStatus(
                              adm.id,
                              e.target.value as AdmissionEnquiry['status']
                            )
                          }
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none font-semibold cursor-pointer"
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Document Verification">Document Verification</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Admission Approved">Admission Approved</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteAdmission(adm.id, adm.student_name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-crest text-xl font-bold text-[#0a192f]">
                  Contact Messages & Parent Inquiries
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct messages submitted via the Contact Us page
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sender, email, subject..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-[#0a192f] text-sm">
                        {msg.full_name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          msg.status === 'Unread'
                            ? 'bg-amber-100 text-amber-800'
                            : msg.status === 'In Progress'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mb-3">
                      <span>{msg.email}</span>
                      <span>•</span>
                      <span>{msg.phone}</span>
                    </div>

                    <h4 className="text-xs font-bold text-[#354024] mb-1">
                      Subject: {msg.subject}
                    </h4>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                      {msg.message}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {msg.created_at}
                    </span>

                    <div className="flex items-center gap-2">
                      {msg.status !== 'Resolved' && (
                        <button
                          onClick={() => handleMessageStatus(msg.id, 'Resolved')}
                          className="text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: NOTICES & CIRCULARS PUBLISHER */}
        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Publisher Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <div>
                <h3 className="font-crest text-lg font-bold text-[#0a192f]">
                  Publish Notice / Circular
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast updates to the top notice ticker across all pages
                </p>
              </div>

              <form onSubmit={handleCreateNotice} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Notice Headline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mid-term examinations schedule announced"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newNotice.category}
                      onChange={(e) =>
                        setNewNotice({
                          ...newNotice,
                          category: e.target.value as SchoolNotice['category'],
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="Admissions">Admissions</option>
                      <option value="Academic">Academic</option>
                      <option value="Examination">Examination</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Sports">Sports</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Display Date
                    </label>
                    <input
                      type="text"
                      value={newNotice.date}
                      onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Details / Advisory Content (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Optional details or instructions for parents & students..."
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0a192f] hover:bg-[#354024] text-white py-2.5 rounded-xl font-bold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Notice</span>
                </button>
              </form>
            </div>

            {/* Active Notices List */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <div>
                <h3 className="font-crest text-lg font-bold text-[#0a192f]">
                  Active Published Circulars ({notices.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Currently cycling in the live ticker marquee
                </p>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                          {notice.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {notice.date}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0a192f]">
                        {notice.title}
                      </h4>
                      {notice.content && (
                        <p className="text-[11px] text-slate-600">{notice.content}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GOVERNING BODY */}
        {activeTab === 'governing' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-crest text-xl font-bold text-[#0a192f]">
                  Governing Body & Institutional Trustees
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage the registered office bearers displayed on the public /administration page
                </p>
              </div>

              <button
                onClick={() => onNavigateRoute('administration')}
                className="inline-flex items-center gap-1.5 bg-[#0a192f] hover:bg-[#354024] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Go to Public Administration Page</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {governing.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                        {m.designation}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Order #{m.order_index}
                      </span>
                    </div>

                    <h4 className="font-crest text-sm font-bold text-[#0a192f]">
                      {m.name}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                      {m.qualification}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 bg-white p-2.5 rounded-xl border border-slate-200/60">
                      {m.experience}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[10px]">{m.committee}</span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${m.name} from governing body?`)) {
                          db.deleteGoverningBodyMember(m.id);
                          setGoverning(db.getGoverningBody());
                          showToast(`Removed "${m.name}".`);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Delete member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SQL DATABASE */}
        {activeTab === 'sql' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0a192f] via-[#0f274a] to-[#071324] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-[#cfbb99]/15 border border-[#cfbb99]/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#cfbb99]">
                  <Database className="w-3.5 h-3.5 text-[#cfbb99]" />
                  <span>In-Browser SQLite Relational Engine</span>
                </div>
                <h3 className="font-crest text-2xl font-bold">
                  Interactive SQL Console & Table Engine
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open the full SQL Management Console modal to execute real relational SELECT, WHERE, COUNT, and ORDER BY queries across all 6 school data stores.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenSqlConsole}
                  className="bg-gradient-to-r from-[#354024] to-[#252d19] hover:from-[#252d19] hover:to-[#1b2213] text-white px-6 py-3 rounded-xl font-bold text-xs tracking-wide shadow-lg shadow-stone-900/50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-[#cfbb99]" />
                  <span>Open Full SQL Console</span>
                </button>
              </div>
            </div>

            {/* Table Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-[#0a192f]">
                    admissions_enquiries
                  </h4>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                    {admissions.length} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Columns: id, student_name, parent_name, email, phone, grade_applying, status, created_at
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-[#0a192f]">
                    governing_body_members
                  </h4>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                    {governing.length} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Columns: id, name, designation, committee, qualification, experience, email, order_index
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-[#0a192f]">
                    contact_messages
                  </h4>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                    {messages.length} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Columns: id, full_name, email, phone, subject, message, status, created_at
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-[#0a192f]">
                    school_notices
                  </h4>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                    {notices.length} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Columns: id, title, category, date, content
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-[#0a192f]">
                    alumni_members
                  </h4>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                    {db.getAlumni().length} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Columns: id, full_name, batch_year, email, current_role, organization, city
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-[#0a192f]">
                    newsletter_subscribers
                  </h4>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                    {db.getNewsletterSubscribers().length} rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Columns: id, email, subscribed_at
                </p>
              </div>
            </div>

            {/* Reset Database Button */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-crest text-sm font-bold text-rose-900">
                  Reset Database to Factory Defaults
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Re-seeds default demo applications, notices, and governing members.
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to restore the default sample database? All temporary submissions will be reset.'
                    )
                  ) {
                    db.resetDatabase();
                    reloadAll();
                    showToast('Database reset to factory seeds.');
                  }
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Reset Database Seeds
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
