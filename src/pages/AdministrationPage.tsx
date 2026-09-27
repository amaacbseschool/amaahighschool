import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  BookOpen,
  Mail,
  Phone,
  Plus,
  Trash2,
  Edit2,
  X,
  Search,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Clock,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { db } from '../lib/db';
import type { GoverningBodyMember } from '../lib/db';
import type { RouteType } from '../types/routes';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import logoImg from '../assets/logo.png';

interface AdministrationPageProps {
  onNavigateHome: () => void;
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

const COMMITTEES = [
  'All Wings',
  'Board of Trustees',
  'Academic Committee',
  'Executive Council',
  'Parent Advisory Committee',
] as const;

export const AdministrationPage: React.FC<AdministrationPageProps> = ({
  onNavigateHome,
  onNavigateRoute,
  onOpenAdmission,
}) => {
  const [members, setMembers] = useState<GoverningBodyMember[]>(() => db.getGoverningBody());
  const [selectedCommittee, setSelectedCommittee] = useState<string>('All Wings');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<GoverningBodyMember | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    committee: 'Board of Trustees',
    qualification: '',
    experience: '',
    photo_url: '',
    email: '',
    phone: '',
    order_index: 10,
  });

  // Filter members
  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        const matchesCommittee =
          selectedCommittee === 'All Wings' || m.committee.toLowerCase() === selectedCommittee.toLowerCase();
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.designation.toLowerCase().includes(q) ||
          m.qualification.toLowerCase().includes(q) ||
          m.committee.toLowerCase().includes(q);
        return matchesCommittee && matchesQuery;
      })
      .sort((a, b) => (a.order_index || 99) - (b.order_index || 99));
  }, [members, selectedCommittee, searchQuery]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: '',
      committee: 'Board of Trustees',
      qualification: '',
      experience: '',
      photo_url: '',
      email: '',
      phone: '',
      order_index: members.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: GoverningBodyMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      designation: member.designation,
      committee: member.committee,
      qualification: member.qualification,
      experience: member.experience,
      photo_url: member.photo_url || '',
      email: member.email || '',
      phone: member.phone || '',
      order_index: member.order_index,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the Governing Body?`)) {
      db.deleteGoverningBodyMember(id);
      setMembers(db.getGoverningBody());
      showToast(`Removed "${name}" from the Governing Body.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim()) {
      alert('Please provide the member full name and designation.');
      return;
    }

    if (editingMember) {
      db.updateGoverningBodyMember(editingMember.id, {
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        committee: formData.committee,
        qualification: formData.qualification.trim(),
        experience: formData.experience.trim(),
        photo_url: formData.photo_url.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        order_index: Number(formData.order_index) || 10,
      });
      showToast(`Successfully updated details for "${formData.name}".`);
    } else {
      db.addGoverningBodyMember({
        name: formData.name.trim(),
        designation: formData.designation.trim(),
        committee: formData.committee,
        qualification: formData.qualification.trim(),
        experience: formData.experience.trim(),
        photo_url: formData.photo_url.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        order_index: Number(formData.order_index) || members.length + 1,
      });
      showToast(`Successfully appointed "${formData.name}" to the Governing Body!`);
    }

    setMembers(db.getGoverningBody());
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-[#354024] selection:text-white pb-20">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#0a192f] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#cfbb99]/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#cfbb99] shrink-0" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Hero / Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a192f] via-[#0f274a] to-[#071324] text-white pt-12 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(2,132,199,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d97706]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-[90%] mx-auto relative z-10">
          {/* Breadcrumb Bar */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-full transition-all border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateRoute('about', '#leadership')}
                className="text-xs text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Principal's Desk
              </button>
              <span className="text-slate-500">·</span>
              <button
                onClick={() => onNavigateRoute('admin')}
                className="text-xs text-[#cfbb99] hover:text-white font-semibold flex items-center gap-1 cursor-pointer bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-full border border-white/10"
              >
                <Lock className="w-3 h-3 text-[#cfbb99]" />
                <span>Staff Portal (/admin)</span>
              </button>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoImg}
                alt="AMAA High School Crest"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
              <div className="inline-flex items-center gap-2 bg-[#cfbb99]/15 border border-[#cfbb99]/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#cfbb99]">
                <ShieldCheck className="w-4 h-4 text-[#cfbb99]" />
                <span>Institutional Governance & Stewardship</span>
              </div>
            </div>

            <h1 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              School Administration & Governing Council
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl">
              Operating under the sacred trust of <em>"Lead Kindly Light"</em> (Estd. 1965), our Governing Body 
              formulates institutional policy, preserves ethical fiduciary standards, and ensures world-class academic 
              stewardship for future generations.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#354024] to-[#252d19] hover:from-[#252d19] hover:to-[#1b2213] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-stone-900/40 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Governing Member</span>
              </button>

              <button
                onClick={() => onNavigateRoute('admin')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/15 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#cfbb99]" />
                <span>Go to Admin Dashboard</span>
              </button>

              {onOpenAdmission && (
                <button
                  onClick={onOpenAdmission}
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 transition-all cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Admissions 2025–26</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <div className="text-2xl font-crest font-extrabold text-[#cfbb99]">
                <AnimatedCounter value={members.length} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Council Members</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <div className="text-2xl font-crest font-extrabold text-[#d97706]">1965</div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Founding Charter</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <div className="text-2xl font-crest font-extrabold text-white">4 Wings</div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Trustees & Councils</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <div className="text-2xl font-crest font-extrabold text-emerald-400">100%</div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Regulatory Compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory & Control Panel */}
      <div className="w-[90%] mx-auto mt-10">
        {/* Filters & Actions Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Committee Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {COMMITTEES.map((comm) => (
              <button
                key={comm}
                onClick={() => setSelectedCommittee(comm)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCommittee === comm
                    ? 'bg-[#0a192f] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {comm}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, qualification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-[#354024] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Directory Count Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-crest text-xl sm:text-2xl font-bold text-[#0a192f]">
              Governing Body Members
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredMembers.length} of {members.length} institutional office bearers
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#354024] hover:text-[#252d19] bg-[#354024]/10 hover:bg-[#354024]/15 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Members Cards Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-crest text-lg font-bold text-slate-700">No Governing Body Members Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              No office bearer matches your active filter. Try resetting your search query or add a new governing body member.
            </p>
            <button
              onClick={() => {
                setSelectedCommittee('All Wings');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-[#354024] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Accent Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0a192f] via-[#354024] to-[#d97706]" />

                <div className="p-6">
                  {/* Header: Photo / Monogram & Badges */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="relative">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                          onError={(e) => {
                            // Fallback to initial
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0a192f] to-[#354024] flex items-center justify-center text-white font-crest font-bold text-xl shadow-xs">
                          {member.name.replace(/Sri|Dr\.|Mrs\.|Mr\./gi, '').trim().charAt(0) || 'A'}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow-xs" title={`Precedence Order #${member.order_index}`}>
                        <Award className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[11px] font-bold text-[#354024] bg-[#354024]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {member.designation}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {member.committee}
                      </span>
                    </div>
                  </div>

                  {/* Name & Academic Credentials */}
                  <h3 className="font-crest text-lg font-bold text-[#0a192f] group-hover:text-[#354024] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-mono font-medium text-slate-600 mt-1">
                    {member.qualification}
                  </p>

                  {/* Experience Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {member.experience}
                  </p>

                  {/* Contact details if available */}
                  {(member.email || member.phone) && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-1.5 hover:text-[#354024] transition-colors truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer: Management Controls */}
                <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Appointed {member.added_at.slice(0, 10)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 text-slate-500 hover:text-[#354024] hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Edit Member Information"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete from Governing Body"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staff Operations & Administrative Dashboard Banner */}
        <section className="mt-12 bg-gradient-to-r from-[#0a192f] via-[#0f274a] to-[#071324] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#354024]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[#cfbb99]/15 border border-[#cfbb99]/30 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#cfbb99]">
                <Lock className="w-3.5 h-3.5 text-[#cfbb99]" />
                <span>Authorized Staff Portal</span>
              </div>
              <h3 className="font-crest text-xl sm:text-2xl font-bold text-white">
                School Administrative Operations & Staff Dashboard
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Staff members and authorized trustees can log in to the administrative dashboard to review admissions, manage circulars, and access the database inspection tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => onNavigateRoute('admin')}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#354024] to-[#252d19] hover:from-[#252d19] hover:to-[#1b2213] text-white px-5 py-3 rounded-xl font-semibold text-xs shadow-lg shadow-stone-900/50 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#cfbb99]" />
                <span>Open Staff Dashboard (/admin)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Institutional Governance Charter Section */}
        <section className="mt-12 bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-card">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#d97706] uppercase tracking-widest bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
              ORGANISATIONAL FRAMEWORK
            </span>
            <h2 className="font-crest text-2xl sm:text-3xl font-extrabold text-[#0a192f] mt-3">
              Governance Standards & Fiduciary Charter
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              The Governing Council operates as a non-profit educational trust, adhering to national statutory requirements, 
              board guidelines, and community consensus to sustain uncompromised educational excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <Scale className="w-6 h-6 text-[#354024] mb-3" />
              <h4 className="font-crest text-base font-bold text-[#0a192f]">Fiduciary Oversight</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Independent annual chartered audits, transparent fee structures, and disciplined allocation of resources toward lab and library modernization.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <BookOpen className="w-6 h-6 text-[#354024] mb-3" />
              <h4 className="font-crest text-base font-bold text-[#0a192f]">Academic Autonomy</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Empowering the Principal and faculty council with complete pedagogical freedom to introduce enriched science practicals, Olympiad training, and arts.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <Building2 className="w-6 h-6 text-[#354024] mb-3" />
              <h4 className="font-crest text-base font-bold text-[#0a192f]">Campus Safety & Health</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Statutory fire safety audits, CCTV surveillance protocols, seismic structural compliance, and strict background checks for all campus personnel.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <Users className="w-6 h-6 text-[#354024] mb-3" />
              <h4 className="font-crest text-base font-bold text-[#0a192f]">Parent & Alumni Voice</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Formal representation of parent councils and alumni advisors in all strategic expansion and student wellness decisions.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* --- ADD / EDIT MEMBER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0a192f] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#354024]/20 border border-[#354024]/40 text-[#cfbb99]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-crest text-lg font-bold">
                    {editingMember ? 'Edit Governing Member' : 'Appoint Governing Member'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    A.M.A. Adinarayana High School — Institutional Trust
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. S. K. Narayana"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Designation / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vice-Chairman / Trustee"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Committee / Wing
                  </label>
                  <select
                    value={formData.committee}
                    onChange={(e) => setFormData({ ...formData, committee: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none"
                  >
                    <option value="Board of Trustees">Board of Trustees</option>
                    <option value="Academic Committee">Academic Committee</option>
                    <option value="Executive Council">Executive Council</option>
                    <option value="Parent Advisory Committee">Parent Advisory Committee</option>
                    <option value="Finance & Audit Committee">Finance & Audit Committee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Qualifications & Credentials
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc., Ph.D. — IIT Madras"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Background, Experience & Institutional Contribution
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe professional background, achievements, and responsibilities in governing the school..."
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="member@amaaschool.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone / Office Contact (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 94400 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Order Priority
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-[#354024] focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0a192f] to-[#354024] hover:from-[#0f274a] hover:to-[#252d19] text-white font-semibold shadow-md shadow-slate-900/20 cursor-pointer"
                >
                  {editingMember ? 'Save Changes' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
