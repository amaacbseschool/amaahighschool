import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  Mail,
  Phone,
  Search,
  ArrowLeft,
  Scale,
  Clock,
  GraduationCap,
  Lock,
  X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getPageWithSections } from '../lib/cms';
import type { CmsPageWithSections } from '../types/cms';
import type { RouteType } from '../types/routes';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import logoImg from '../assets/logo.png';

interface AdministrationPageProps {
  onNavigateHome: () => void;
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
  onOpenAdmission?: () => void;
}

export interface PublicGoverningMember {
  id: string;
  name: string;
  designation: string;
  committee: string;
  qualification: string;
  experience: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  order_index: number;
  added_at: string;
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
  const [members, setMembers] = useState<PublicGoverningMember[]>([]);
  const [pageData, setPageData] = useState<CmsPageWithSections | null>(null);
  const [selectedCommittee, setSelectedCommittee] = useState<string>('All Wings');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    getPageWithSections('administration')
      .then((data) => {
        if (isMounted && data) {
          setPageData(data);
        }
      })
      .catch((err) => {
        console.error('[CMS] Failed to load administration page data:', err);
      });

    const fetchGoverningBody = async () => {
      try {
        const { data, error } = await supabase
          .from('governing_body')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('[Public Governing Body Error] Failed to load from Supabase:', error);
          if (isMounted) setMembers([]);
          return;
        }

        if (data && isMounted) {
          const adapted: PublicGoverningMember[] = data.map((m) => ({
            id: m.id,
            name: m.full_name,
            designation: m.position,
            committee: m.department || 'Board of Trustees',
            qualification: m.department || '',
            experience: m.bio || '',
            photo_url: m.avatar_url || undefined,
            order_index: m.display_order ?? 99,
            added_at: m.created_at ? m.created_at.slice(0, 10) : 'Estd. 1965',
          }));
          setMembers(adapted);
        }
      } catch (err: unknown) {
        console.error('[Public Governing Body Error] Unexpected exception querying governing_body:', err);
        if (isMounted) setMembers([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchGoverningBody();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const heroSection = pageData?.sections?.find((s) => s.section_key === 'administration.hero');
  const heroEyebrow = heroSection?.eyebrow || 'Institutional Governance & Stewardship';
  const heroHeading = heroSection?.heading || 'School Administration & Governing Council';
  const heroSubheading =
    heroSection?.subheading ||
    'Operating under the sacred trust of "Lead Kindly Light" (Estd. 1965), our Governing Body formulates institutional policy, preserves ethical fiduciary standards, and ensures world-class academic stewardship for future generations.';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-[#354024] selection:text-white pb-20">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1b2213] via-[#0f274a] to-[#071324] text-white pt-12 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(53,64,36,0.15),transparent_70%)] pointer-events-none" />
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
                <span>{heroEyebrow}</span>
              </div>
            </div>

            <h1 className="font-crest text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {heroHeading}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl">
              {heroSubheading}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigateRoute('admin')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#354024] to-[#252d19] hover:from-[#252d19] hover:to-[#1b2213] text-white px-5 py-2.5 rounded-xl font-semibold text-xs border border-white/15 shadow-lg shadow-stone-900/40 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#cfbb99]" />
                <span>Manage via Staff Portal (/admin)</span>
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
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Committee Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {COMMITTEES.map((comm) => (
              <button
                key={comm}
                onClick={() => setSelectedCommittee(comm)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCommittee === comm
                    ? 'bg-[#1b2213] text-white shadow-xs'
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
              placeholder="Search by name, role, department..."
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
            <h2 className="font-crest text-xl sm:text-2xl font-bold text-[#1b2213]">
              Governing Body Members
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredMembers.length} of {members.length} institutional office bearers
            </p>
          </div>
        </div>

        {/* Members Cards Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-crest text-lg font-bold text-slate-700">
              {isLoading ? 'Loading Governing Body...' : 'No Governing Body Members Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
              {isLoading
                ? 'Retrieving official leadership roster from the institution registry...'
                : 'No office bearer matches your active filter or search query.'}
            </p>
            {selectedCommittee !== 'All Wings' && (
              <button
                onClick={() => {
                  setSelectedCommittee('All Wings');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold bg-[#354024] text-white px-4 py-2 rounded-xl hover:bg-[#252d19] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Accent Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#1b2213] via-[#354024] to-[#d97706]" />

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
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1b2213] to-[#354024] flex items-center justify-center text-white font-crest font-bold text-xl shadow-xs">
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

                  {/* Name & Title */}
                  <h3 className="font-crest text-lg font-bold text-[#1b2213] group-hover:text-[#354024] transition-colors">
                    {member.name}
                  </h3>
                  {member.qualification && (
                    <p className="text-xs font-mono font-medium text-slate-600 mt-1">
                      {member.qualification}
                    </p>
                  )}

                  {/* Experience Bio */}
                  {member.experience && (
                    <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {member.experience}
                    </p>
                  )}

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

                {/* Card Footer: Metadata (Public View Only) */}
                <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Appointed {member.added_at}
                  </span>
                  <span className="text-[10px] font-semibold text-[#354024] bg-[#354024]/10 px-2 py-0.5 rounded-full">
                    Active Trustee
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staff Operations & Administrative Dashboard Banner */}
        <section className="mt-12 bg-gradient-to-r from-[#1b2213] via-[#0f274a] to-[#071324] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
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
                Staff members and authorized trustees can log in to the administrative dashboard to review admissions, manage circulars, and manage the official governing body roster.
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
            <h2 className="font-crest text-2xl sm:text-3xl font-extrabold text-[#1b2213] mt-3">
              Governance Standards & Fiduciary Charter
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              The Governing Council operates as a non-profit educational trust, adhering to national statutory requirements, 
              board guidelines, and community consensus to sustain uncompromised educational excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <Scale className="w-8 h-8 text-[#354024] mb-3" />
              <h3 className="font-crest text-sm font-bold text-[#1b2213]">Fiduciary Integrity</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Bi-annual external statutory audits with transparent financial allocation dedicated 100% to infrastructure and academic grants.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <Award className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="font-crest text-sm font-bold text-[#1b2213]">Academic Autonomy</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Empowering the Principal and faculty council with complete pedagogical freedom aligned with NEP 2020 national curriculum guidelines.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <Users className="w-8 h-8 text-[#44105c] mb-3" />
              <h3 className="font-crest text-sm font-bold text-[#1b2213]">Community Representation</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Active parent advisory representation and prominent alumni trustees ensuring generational accountability and community goodwill.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <Building2 className="w-8 h-8 text-emerald-700 mb-3" />
              <h3 className="font-crest text-sm font-bold text-[#1b2213]">Infrastructure Stewardship</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Long-term campus master plan oversight overseeing solar integration, modern science labs, and sports academy expansion.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
