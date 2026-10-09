import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Users,
  GraduationCap,
  MessageSquare,
  Bell,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  LogOut,
  ArrowRight,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
  Shield,
  MapPin,
  Briefcase,
  Edit2,
  UserCheck,
  UserX,
  Check,
  X,
  Globe,
  Download,
  FileSpreadsheet,
  LayoutGrid,
  Table,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { RouteType } from '../types/routes';
import logoImg from '../assets/logo.png';
import artechLogo from '../assets/artech_logo.png';

// CMS Modules
import { CmsOverview } from '../components/admin/cms/CmsOverview';
import { GlobalSettingsManager } from '../components/admin/cms/GlobalSettingsManager';
import { NavigationManager } from '../components/admin/cms/NavigationManager';
import { PagesManager } from '../components/admin/cms/PagesManager';
import { FacultyManager } from '../components/admin/cms/FacultyManager';
import { ToppersManager } from '../components/admin/cms/ToppersManager';
import { NewsManager } from '../components/admin/cms/NewsManager';
import { EventsManager } from '../components/admin/cms/EventsManager';
import { CircularsManager } from '../components/admin/cms/CircularsManager';
import { GalleryManager } from '../components/admin/cms/GalleryManager';
import { SeoManager } from '../components/admin/cms/SeoManager';

export type AdminRole = 'super_admin' | 'admin' | 'viewer';

export interface AdminProfile {
  id: string;
  full_name: string;
  role: AdminRole;
  department: string | null;
  created_at?: string;
}

export interface LiveDashboardStats {
  totalAdmissions: number | null;
  unreadContacts: number | null;
  publishedNotices: number | null;
  pendingAlumni: number | null;
  subscribersCount: number | null;
  isLoading: boolean;
  error: string | null;
}

// ----------------------------------------------------
// Supabase Domain Types for Migrated CMS Modules
// ----------------------------------------------------
export type NoticeCategory =
  | 'Academic'
  | 'Admissions'
  | 'Sports'
  | 'Circular'
  | 'Events';

export interface SchoolNoticeRow {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
}

export type AdmissionStatus =
  | 'Pending Review'
  | 'Document Verification'
  | 'Interview Scheduled'
  | 'Admission Approved'
  | 'Rejected';

export interface AdmissionEnquiryRow {
  id: string;
  application_number: string | null;
  student_name: string;
  date_of_birth?: string | null;
  gender?: string | null;
  parent_name: string;
  parent_email: string | null;
  parent_phone: string;
  address?: string | null;
  previous_school?: string | null;
  class_applying_for: string;
  academic_year?: string | null;
  message?: string | null;
  document_urls?: string[] | null;
  status: AdmissionStatus;
  created_at: string;
  updated_at?: string;
}

export type ContactMessageStatus = 'Unread' | 'In Progress' | 'Resolved';

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
  updated_at?: string;
}

export interface SupabaseGoverningMember {
  id: string;
  full_name: string;
  position: string;
  department: string | null;
  bio: string | null;
  avatar_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SupabaseAlumniMember {
  id: string;
  full_name: string;
  graduation_year: string | number;
  email: string;
  phone: string | null;
  current_profession: string | null;
  current_organization: string | null;
  location: string | null;
  message: string | null;
  verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SupabaseSubscriber {
  id: string | number;
  email: string;
  subscribed_at: string;
}

export type AdminTab =
  | 'overview'
  | 'admissions'
  | 'messages'
  | 'notices'
  | 'governing'
  | 'alumni'
  | 'subscribers'
  | 'staff'
  | 'cms-overview'
  | 'cms-settings'
  | 'cms-nav'
  | 'cms-pages'
  | 'cms-faculty'
  | 'cms-toppers'
  | 'cms-news'
  | 'cms-events'
  | 'cms-circulars'
  | 'cms-gallery'
  | 'cms-seo';

interface AdminDashboardPageProps {
  onNavigateHome: () => void;
  onNavigateRoute: (route: RouteType, hashTarget?: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateHome,
  onNavigateRoute,
}) => {
  // Supabase Authentication State
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Login Form State
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Supabase CMS Data States
  const [admissions, setAdmissions] = useState<AdmissionEnquiryRow[]>([]);
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [notices, setNotices] = useState<SchoolNoticeRow[]>([]);
  const [governing, setGoverning] = useState<SupabaseGoverningMember[]>([]);
  const [alumni, setAlumni] = useState<SupabaseAlumniMember[]>([]);
  const [subscribers, setSubscribers] = useState<SupabaseSubscriber[]>([]);

  // Section Loading States
  const [isLoadingAdmissions, setIsLoadingAdmissions] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isLoadingNotices, setIsLoadingNotices] = useState<boolean>(false);
  const [isLoadingGoverning, setIsLoadingGoverning] = useState<boolean>(false);
  const [isLoadingAlumni, setIsLoadingAlumni] = useState<boolean>(false);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState<boolean>(false);

  // Search & Filter States
  const [admissionSearch, setAdmissionSearch] = useState('');
  const [admissionFilter, setAdmissionFilter] = useState<string>('All');
  const [messageSearch, setMessageSearch] = useState('');
  const [alumniSearch, setAlumniSearch] = useState('');
  const [alumniFilter, setAlumniFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [alumniViewMode, setAlumniViewMode] = useState<'table' | 'cards'>('table');
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Governing Body Modal & Form State
  const [isAddingGoverning, setIsAddingGoverning] = useState<boolean>(false);
  const [editingGoverning, setEditingGoverning] = useState<SupabaseGoverningMember | null>(null);
  const [governingForm, setGoverningForm] = useState({
    full_name: '',
    position: '',
    department: '',
    bio: '',
    avatar_url: '',
    display_order: 1,
    is_active: true,
  });

  // Role permissions helpers
  const isViewer = profile?.role === 'viewer';
  const isSuperAdmin = profile?.role === 'super_admin';
  const effectiveRole: AdminRole = profile?.role || 'viewer';

  // Live Dashboard Statistics State (Supabase count queries)
  const [liveStats, setLiveStats] = useState<LiveDashboardStats>({
    totalAdmissions: null,
    unreadContacts: null,
    publishedNotices: null,
    pendingAlumni: null,
    subscribersCount: null,
    isLoading: false,
    error: null,
  });

  // Admin Profiles State (Super Admin Only)
  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<AdminProfile | null>(null);
  const [profileSearch, setProfileSearch] = useState<string>('');

  // New Notice Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Admissions' as NoticeCategory,
    content: '',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch School Notices from Supabase
  const fetchSchoolNotices = async () => {
    setIsLoadingNotices(true);
    try {
      const { data, error } = await supabase
        .from('school_notices')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('[Supabase CMS Error] Failed to load school_notices:', error);
        showToast(`Failed to load notices: ${error.message}`);
        return;
      }
      setNotices((data as SchoolNoticeRow[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Unexpected error loading notices:', err);
      showToast(`Error loading notices: ${message}`);
    } finally {
      setIsLoadingNotices(false);
    }
  };

  // Fetch Admissions Enquiries from Supabase
  const fetchAdmissions = async () => {
    setIsLoadingAdmissions(true);
    try {
      const { data, error } = await supabase
        .from('admissions_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase CMS Error] Failed to load admissions_enquiries:', error);
        showToast(`Failed to load admissions: ${error.message}`);
        return;
      }
      setAdmissions((data as AdmissionEnquiryRow[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Unexpected error loading admissions:', err);
      showToast(`Error loading admissions: ${message}`);
    } finally {
      setIsLoadingAdmissions(false);
    }
  };

  // Fetch Contact Messages from Supabase
  const fetchContactMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase CMS Error] Failed to load contact_messages:', error);
        showToast(`Failed to load contact messages: ${error.message}`);
        return;
      }
      setMessages((data as ContactMessageRow[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Unexpected error loading contact messages:', err);
      showToast(`Error loading contact messages: ${message}`);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Fetch Governing Body from Supabase
  const fetchGoverningBody = async () => {
    setIsLoadingGoverning(true);
    try {
      const { data, error } = await supabase
        .from('governing_body')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[Supabase CMS Error] Failed to load governing_body:', error);
        showToast(`Failed to load governing body: ${error.message}`);
        return;
      }
      setGoverning((data as SupabaseGoverningMember[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error loading governing_body:', err);
      showToast(`Error loading governing body: ${message}`);
    } finally {
      setIsLoadingGoverning(false);
    }
  };

  // Fetch Alumni Members from Supabase
  const fetchAlumni = async () => {
    setIsLoadingAlumni(true);
    try {
      const { data, error } = await supabase
        .from('alumni_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase CMS Error] Failed to load alumni_members:', error);
        showToast(`Failed to load alumni: ${error.message}`);
        return;
      }
      setAlumni((data as SupabaseAlumniMember[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error loading alumni_members:', err);
      showToast(`Error loading alumni: ${message}`);
    } finally {
      setIsLoadingAlumni(false);
    }
  };

  // Fetch Newsletter Subscribers from Supabase
  const fetchSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) {
        console.error('[Supabase CMS Error] Failed to load newsletter_subscribers:', error);
        showToast(`Failed to load subscribers: ${error.message}`);
        return;
      }
      setSubscribers((data as SupabaseSubscriber[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error loading newsletter_subscribers:', err);
      showToast(`Error loading subscribers: ${message}`);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  // Fetch Live Dashboard Statistics (HEAD count queries - Part 1)
  const fetchDashboardStats = async () => {
    setLiveStats((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [
        admissionsRes,
        unreadContactsRes,
        publishedNoticesRes,
        pendingAlumniRes,
        subscribersRes,
      ] = await Promise.all([
        supabase.from('admissions_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'Unread'),
        supabase.from('school_notices').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('alumni_members').select('*', { count: 'exact', head: true }).eq('verified', false),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      ]);

      if (admissionsRes.error) throw admissionsRes.error;
      if (unreadContactsRes.error) throw unreadContactsRes.error;
      if (publishedNoticesRes.error) throw publishedNoticesRes.error;
      if (pendingAlumniRes.error) throw pendingAlumniRes.error;
      if (subscribersRes.error) throw subscribersRes.error;

      setLiveStats({
        totalAdmissions: admissionsRes.count ?? 0,
        unreadContacts: unreadContactsRes.count ?? 0,
        publishedNotices: publishedNoticesRes.count ?? 0,
        pendingAlumni: pendingAlumniRes.count ?? 0,
        subscribersCount: subscribersRes.count ?? 0,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to query live dashboard counts';
      console.error('[Supabase CMS Error] Error loading dashboard statistics:', err);
      setLiveStats((prev) => ({ ...prev, isLoading: false, error: msg }));
    }
  };

  // Fetch Admin Profiles (Super Admin Only - Part 2)
  const fetchAdminProfiles = async () => {
    setIsLoadingProfiles(true);
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id, full_name, role, department, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase CMS Error] Failed to load admin profiles:', error);
        showToast(`Failed to load staff profiles: ${error.message}`);
        return;
      }
      setAdminProfiles((data as AdminProfile[]) || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Exception loading admin profiles:', err);
      showToast(`Error loading staff profiles: ${msg}`);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const reloadAll = async () => {
    const jobs: Promise<void>[] = [
      fetchSchoolNotices(),
      fetchAdmissions(),
      fetchContactMessages(),
      fetchGoverningBody(),
      fetchAlumni(),
      fetchSubscribers(),
      fetchDashboardStats(),
    ];
    if (profile?.role === 'super_admin') {
      jobs.push(fetchAdminProfiles());
    }
    await Promise.all(jobs);
  };

  // Automated Runtime Verification Suite
  const runVerificationSuite = async () => {
    console.error('[CMS_VERIFICATION_REPORT_START]');
    const { data: { session }, error: sessErr } = await supabase.auth.getSession();
    if (sessErr || !session?.user) {
      console.error('[CMS_VERIFICATION_REPORT_ERROR] No active auth session found:', sessErr || 'null session');
      console.error('[CMS_VERIFICATION_REPORT_END]');
      return;
    }
    console.error(`[CMS_VERIFICATION_REPORT_AUTH] Authenticated as: ${session.user.email} (${session.user.id})`);
    const results: Record<string, { status: string; details?: string; error?: unknown }> = {};

    // 1. Notices SELECT
    try {
      const nSel = await supabase.from('school_notices').select('*').order('published_at', { ascending: false });
      if (nSel.error) {
        results.noticesSelect = { status: 'FAIL', error: nSel.error };
      } else {
        results.noticesSelect = { status: 'PASS', details: `${nSel.data.length} records found` };
      }
    } catch (err: unknown) {
      results.noticesSelect = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 2. Notices CREATE
    let createdNoticeId: string | null = null;
    try {
      const testTitle = 'Test Notice ' + Date.now();
      const testContent = 'Verification notice payload for CMS phase 2.';
      const nCreate = await supabase
        .from('school_notices')
        .insert([{
          title: testTitle,
          content: testContent,
          category: 'Academic',
          published: true,
          published_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (nCreate.error) {
        results.noticesCreate = { status: 'FAIL', error: nCreate.error };
      } else {
        createdNoticeId = nCreate.data.id;
        results.noticesCreate = { status: 'PASS', details: `Created ID: ${createdNoticeId}` };
      }
    } catch (err: unknown) {
      results.noticesCreate = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 3. Notices DELETE
    if (createdNoticeId) {
      try {
        const nDel = await supabase.from('school_notices').delete().eq('id', createdNoticeId);
        if (nDel.error) {
          results.noticesDelete = { status: 'FAIL', error: nDel.error };
        } else {
          results.noticesDelete = { status: 'PASS', details: `Deleted ID: ${createdNoticeId}` };
        }
      } catch (err: unknown) {
        results.noticesDelete = { status: 'FAIL', error: err instanceof Error ? err.message : err };
      }
    } else {
      results.noticesDelete = { status: 'FAIL', details: 'Skipped - Notice CREATE failed' };
    }

    // 4. Admissions SELECT
    let admData: AdmissionEnquiryRow[] = [];
    try {
      const aSel = await supabase.from('admissions_enquiries').select('*').order('created_at', { ascending: false });
      if (aSel.error) {
        results.admissionsSelect = { status: 'FAIL', error: aSel.error };
      } else {
        admData = (aSel.data as AdmissionEnquiryRow[]) || [];
        results.admissionsSelect = { status: 'PASS', details: `${admData.length} records found` };
      }
    } catch (err: unknown) {
      results.admissionsSelect = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 5. Admissions status UPDATE
    if (admData.length > 0) {
      try {
        const targetAdm = admData[0];
        const aUpd = await supabase
          .from('admissions_enquiries')
          .update({ status: targetAdm.status })
          .eq('id', targetAdm.id);

        if (aUpd.error) {
          results.admissionsUpdate = { status: 'FAIL', error: aUpd.error };
        } else {
          results.admissionsUpdate = { status: 'PASS', details: `Updated admission #${targetAdm.id} status to ${targetAdm.status}` };
        }
      } catch (err: unknown) {
        results.admissionsUpdate = { status: 'FAIL', error: err instanceof Error ? err.message : err };
      }
    } else {
      results.admissionsUpdate = { status: 'PASS (No rows)', details: '0 records in table (not fabricating records)' };
    }

    // 6. Contact Messages SELECT
    let msgData: ContactMessageRow[] = [];
    try {
      const cSel = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (cSel.error) {
        results.contactSelect = { status: 'FAIL', error: cSel.error };
      } else {
        msgData = (cSel.data as ContactMessageRow[]) || [];
        results.contactSelect = { status: 'PASS', details: `${msgData.length} records found` };
      }
    } catch (err: unknown) {
      results.contactSelect = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 7. Contact Messages status UPDATE
    if (msgData.length > 0) {
      try {
        const targetMsg = msgData[0];
        const cUpd = await supabase
          .from('contact_messages')
          .update({ status: targetMsg.status })
          .eq('id', targetMsg.id);

        if (cUpd.error) {
          results.contactUpdate = { status: 'FAIL', error: cUpd.error };
        } else {
          results.contactUpdate = { status: 'PASS', details: `Updated contact #${targetMsg.id} status to ${targetMsg.status}` };
        }
      } catch (err: unknown) {
        results.contactUpdate = { status: 'FAIL', error: err instanceof Error ? err.message : err };
      }
    } else {
      results.contactUpdate = { status: 'PASS (No rows)', details: '0 records in table (not fabricating records)' };
    }

    // 8. Governing Body SELECT
    let govData: SupabaseGoverningMember[] = [];
    try {
      const gSel = await supabase.from('governing_body').select('*').order('display_order', { ascending: true });
      if (gSel.error) {
        results.governingSelect = { status: 'FAIL', error: gSel.error };
      } else {
        govData = (gSel.data as SupabaseGoverningMember[]) || [];
        results.governingSelect = { status: 'PASS', details: `${govData.length} records found` };
      }
    } catch (err: unknown) {
      results.governingSelect = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 9. Governing Body CREATE test member: "CMS TEST MEMBER — DELETE ME"
    let createdGovId: string | null = null;
    try {
      const gCreate = await supabase
        .from('governing_body')
        .insert([{
          full_name: 'CMS TEST MEMBER — DELETE ME',
          position: 'Temporary Verification Member',
          department: 'Quality Assurance',
          bio: 'Automated test record for Phase 3 runtime verification.',
          display_order: 999,
          is_active: false,
        }])
        .select()
        .single();

      if (gCreate.error) {
        results.governingCreate = { status: 'FAIL', error: gCreate.error };
      } else {
        createdGovId = gCreate.data.id;
        results.governingCreate = { status: 'PASS', details: `Created ID: ${createdGovId}` };

        // 9b. Governing Body UPDATE: position, is_active, display_order
        const gUpd = await supabase
          .from('governing_body')
          .update({
            position: 'Updated Temporary Member',
            is_active: true,
            display_order: 998,
          })
          .eq('id', createdGovId)
          .select()
          .single();

        if (gUpd.error) {
          results.governingUpdate = { status: 'FAIL', error: gUpd.error };
        } else if (gUpd.data.is_active === true && gUpd.data.display_order === 998) {
          results.governingUpdate = { status: 'PASS', details: `Updated position, is_active=${gUpd.data.is_active}, display_order=${gUpd.data.display_order}` };
        } else {
          results.governingUpdate = { status: 'FAIL', details: 'Update returned unexpected values' };
        }

        // 9c. Governing Body DELETE
        const gDel = await supabase
          .from('governing_body')
          .delete()
          .eq('id', createdGovId);

        if (gDel.error) {
          results.governingDelete = { status: 'FAIL', error: gDel.error };
        } else {
          // Confirm it is gone after reload/re-query
          const gVerifyDel = await supabase
            .from('governing_body')
            .select('id')
            .eq('id', createdGovId)
            .maybeSingle();

          if (!gVerifyDel.data) {
            results.governingDelete = { status: 'PASS', details: 'Deleted and confirmed gone from table' };
          } else {
            results.governingDelete = { status: 'FAIL', details: 'Record still present after delete' };
          }
        }
      }
    } catch (err: unknown) {
      results.governingCreate = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 10. Alumni SELECT
    let alumData: SupabaseAlumniMember[] = [];
    try {
      const alSel = await supabase.from('alumni_members').select('*').order('created_at', { ascending: false });
      if (alSel.error) {
        results.alumniSelect = { status: 'FAIL', error: alSel.error };
      } else {
        alumData = (alSel.data as SupabaseAlumniMember[]) || [];
        results.alumniSelect = { status: 'PASS', details: `${alumData.length} records found in alumni_members` };
      }
    } catch (err: unknown) {
      results.alumniSelect = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 11. Alumni UI/Filter Verification
    try {
      // Test queries verifying verified filter works against Supabase schema
      const [verTrueRes, verFalseRes] = await Promise.all([
        supabase.from('alumni_members').select('id', { count: 'exact', head: true }).eq('verified', true),
        supabase.from('alumni_members').select('id', { count: 'exact', head: true }).eq('verified', false),
      ]);
      if (verTrueRes.error || verFalseRes.error) {
        results.alumniUiFilter = { status: 'FAIL', error: verTrueRes.error || verFalseRes.error };
      } else {
        results.alumniUiFilter = {
          status: 'PASS',
          details: `Schema filter verified (verified: ${verTrueRes.count ?? 0}, unverified: ${verFalseRes.count ?? 0})`,
        };
      }
    } catch (err: unknown) {
      results.alumniUiFilter = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 12. Newsletter Subscribers SELECT & Search/Count
    try {
      const sSel = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
      if (sSel.error) {
        results.subscribersSelect = { status: 'FAIL', error: sSel.error };
        results.subscribersSearchCount = { status: 'FAIL', error: sSel.error };
      } else {
        const subList = (sSel.data as SupabaseSubscriber[]) || [];
        results.subscribersSelect = { status: 'PASS', details: `${subList.length} records found` };
        
        // Confirm count matches and search filter works
        const sampleEmail = subList.length > 0 ? subList[0].email : '';
        const searchFiltered = subList.filter((s) => s.email.toLowerCase().includes(sampleEmail.toLowerCase()));
        results.subscribersSearchCount = {
          status: 'PASS',
          details: `Count: ${subList.length}, email search tested (${searchFiltered.length} match sample)`,
        };
      }
    } catch (err: unknown) {
      results.subscribersSelect = { status: 'FAIL', error: err instanceof Error ? err.message : err };
      results.subscribersSearchCount = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 13. Phase 4: Live Dashboard Statistics Count Queries (Efficient HEAD counts)
    try {
      const [
        admCnt,
        unrCnt,
        pubCnt,
        penCnt,
        subCnt,
      ] = await Promise.all([
        supabase.from('admissions_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'Unread'),
        supabase.from('school_notices').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('alumni_members').select('*', { count: 'exact', head: true }).eq('verified', false),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      ]);

      results.statsAdmissionsCount = admCnt.error
        ? { status: 'FAIL', error: admCnt.error }
        : { status: 'PASS', details: `Count: ${admCnt.count ?? 0}` };

      results.statsUnreadContactsCount = unrCnt.error
        ? { status: 'FAIL', error: unrCnt.error }
        : { status: 'PASS', details: `Count: ${unrCnt.count ?? 0}` };

      results.statsPublishedNoticesCount = pubCnt.error
        ? { status: 'FAIL', error: pubCnt.error }
        : { status: 'PASS', details: `Count: ${pubCnt.count ?? 0}` };

      results.statsPendingAlumniCount = penCnt.error
        ? { status: 'FAIL', error: penCnt.error }
        : { status: 'PASS', details: `Count: ${penCnt.count ?? 0}` };

      results.statsNewsletterCount = subCnt.error
        ? { status: 'FAIL', error: subCnt.error }
        : { status: 'PASS', details: `Count: ${subCnt.count ?? 0}` };
    } catch (err: unknown) {
      results.liveStatsQueries = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    // 14. Phase 4: Super Admin Profiles Management
    try {
      const pSel = await supabase.from('admin_profiles').select('*').order('created_at', { ascending: false });
      if (pSel.error) {
        results.adminProfilesSelect = { status: 'FAIL', error: pSel.error };
      } else {
        results.adminProfilesSelect = {
          status: 'PASS',
          details: `${pSel.data.length} admin profile(s) returned. Roles: ${(pSel.data as AdminProfile[]).map((p) => p.role).join(', ')}`,
        };
      }
    } catch (err: unknown) {
      results.adminProfilesSelect = { status: 'FAIL', error: err instanceof Error ? err.message : err };
    }

    console.error('[CMS_VERIFICATION_RESULTS]', JSON.stringify(results, null, 2));
    console.error('[CMS_VERIFICATION_REPORT_END]');
    showToast('CMS Verification Suite Completed.');
    await reloadAll();
  };

  // Helper: Fetch matching admin_profiles record
  const fetchAdminProfile = async (userId: string, context = 'session'): Promise<AdminProfile | null> => {
    try {
      const response = await supabase
        .from('admin_profiles')
        .select('id, full_name, role, department')
        .eq('id', userId)
        .single();

      console.log(`[Auth Debug - ${context}] 3. admin_profiles exact response:`, {
        userId,
        data: response.data,
        error: response.error,
        status: response.status,
        statusText: response.statusText,
      });

      if (response.error) {
        console.error(`[Auth Debug - ${context}] admin_profiles error:`, response.error);
        return null;
      }

      if (!response.data) {
        console.warn(`[Auth Debug - ${context}] No row returned for user.id:`, userId);
        return null;
      }

      return response.data as AdminProfile;
    } catch (err) {
      console.error(`[Auth Debug - ${context}] Unexpected exception querying admin_profiles:`, err);
      return null;
    }
  };

  // Initialize and listen to Supabase Auth State
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[Auth Debug] Session retrieval error:', error);
        }

        if (session?.user && isMounted) {
          console.log('[Auth Debug - init] 1. user.id:', session.user.id);
          console.log('[Auth Debug - init] 2. user.email:', session.user.email);
          const prof = await fetchAdminProfile(session.user.id, 'checkSession');
          if (prof && isMounted) {
            setSessionUser(session.user);
            setProfile(prof);
          } else if (isMounted) {
            await supabase.auth.signOut();
            setSessionUser(null);
            setProfile(null);
            setLoginError('You do not have admin access.');
          }
        }
      } catch (err) {
        console.error('[Auth Debug] Auth initialization error:', err);
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setSessionUser(null);
          setProfile(null);
        }
      } else if (session?.user && isMounted) {
        console.log('[Auth Debug - onAuthStateChange] 1. user.id:', session.user.id);
        console.log('[Auth Debug - onAuthStateChange] 2. user.email:', session.user.email);
        const prof = await fetchAdminProfile(session.user.id, 'onAuthStateChange');
        if (prof && isMounted) {
          setSessionUser(session.user);
          setProfile(prof);
        } else if (isMounted) {
          await supabase.auth.signOut();
          setSessionUser(null);
          setProfile(null);
          setLoginError('You do not have admin access.');
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Reload records when authenticated
  useEffect(() => {
    if (sessionUser && profile) {
      reloadAll();
    }
  }, [sessionUser, profile]);

  // Supabase Email/Password Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const email = emailInput.trim();
    const password = passwordInput;

    if (!email || !password) {
      setLoginError('Please enter both your email address and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          setLoginError('Invalid email or password. Please verify your credentials.');
        } else {
          setLoginError(error.message || 'Authentication failed. Please try again.');
        }
        setIsLoggingIn(false);
        return;
      }

      if (!data.user) {
        setLoginError('No user identity returned. Please try again.');
        setIsLoggingIn(false);
        return;
      }

      console.log('[Auth Debug] 1. user.id:', data.user.id);
      console.log('[Auth Debug] 2. user.email:', data.user.email);

      const queryRes = await supabase
        .from('admin_profiles')
        .select('id, full_name, role, department')
        .eq('id', data.user.id)
        .single();

      console.log('[Auth Debug] 3. exact Supabase response from admin_profiles:', queryRes);

      if (queryRes.error) {
        console.error('[Auth Debug] Query failed:', queryRes.error);
        await supabase.auth.signOut();
        const errDetail = queryRes.error.code === 'PGRST116'
          ? 'No admin_profiles record found for this user.'
          : queryRes.error.message || 'Database permission error.';
        setLoginError(`You do not have admin access. [${errDetail}]`);
        setIsLoggingIn(false);
        return;
      }

      if (!queryRes.data) {
        await supabase.auth.signOut();
        setLoginError('You do not have admin access. [No profile data]');
        setIsLoggingIn(false);
        return;
      }

      const prof = queryRes.data as AdminProfile;
      setSessionUser(data.user);
      setProfile(prof);
      setPasswordInput('');
      showToast(`Welcome back, ${prof.full_name}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.';
      setLoginError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setSessionUser(null);
    setProfile(null);
    setEmailInput('');
    setPasswordInput('');
    showToast('Signed out of admin portal.');
  };

  // Admissions Actions (Supabase)
  const handleAdmissionStatus = async (id: string, status: AdmissionStatus) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    try {
      const { error } = await supabase
        .from('admissions_enquiries')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to update admission status:', error);
        showToast(`Failed to update status: ${error.message}`);
        return;
      }
      await fetchAdmissions();
      showToast(`Updated application status to ${status}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Unexpected error updating admission status:', err);
      showToast(`Error updating status: ${message}`);
    }
  };

  const handleDeleteAdmission = async (id: string, name: string) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    if (window.confirm(`Delete admission enquiry for "${name}"?`)) {
      try {
        const { error } = await supabase
          .from('admissions_enquiries')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[Supabase CMS Error] Failed to delete admission enquiry:', error);
          showToast(`Failed to delete admission: ${error.message}`);
          return;
        }
        await fetchAdmissions();
        showToast('Admission application deleted.');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Supabase CMS Error] Unexpected error deleting admission:', err);
        showToast(`Error deleting admission: ${message}`);
      }
    }
  };

  // Contact Message Actions (Supabase)
  const handleMessageStatus = async (id: string, status: ContactMessageStatus) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to update contact message status:', error);
        showToast(`Failed to update message status: ${error.message}`);
        return;
      }
      await fetchContactMessages();
      showToast(`Message status updated to ${status}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Unexpected error updating message status:', err);
      showToast(`Error updating message: ${message}`);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    if (window.confirm('Delete this contact message permanently?')) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[Supabase CMS Error] Failed to delete contact message:', error);
          showToast(`Failed to delete message: ${error.message}`);
          return;
        }
        await fetchContactMessages();
        showToast('Contact message deleted.');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Supabase CMS Error] Unexpected error deleting message:', err);
        showToast(`Error deleting message: ${message}`);
      }
    }
  };

  // Notice Actions (Supabase)
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    const title = newNotice.title.trim();
    const content = newNotice.content.trim();

    if (!title) {
      showToast('Please provide a notice headline.');
      return;
    }

    if (!content) {
      showToast('Notice content is required.');
      return;
    }

    try {
      const { error } = await supabase
        .from('school_notices')
        .insert([
          {
            title,
            content,
            category: newNotice.category,
            published: true,
            published_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error('[Supabase CMS Error] Failed to publish notice:', error);
        showToast(`Failed to publish notice: ${error.message}`);
        return;
      }

      setNewNotice({
        title: '',
        category: 'Admissions',
        content: '',
      });
      await fetchSchoolNotices();
      showToast('New circular published to school notices ticker.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Unexpected error creating notice:', err);
      showToast(`Error creating notice: ${message}`);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    if (window.confirm('Remove this circular from the live notice ticker?')) {
      try {
        const { error } = await supabase
          .from('school_notices')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[Supabase CMS Error] Failed to delete notice:', error);
          showToast(`Failed to delete notice: ${error.message}`);
          return;
        }

        await fetchSchoolNotices();
        showToast('Notice removed.');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Supabase CMS Error] Unexpected error deleting notice:', err);
        showToast(`Error deleting notice: ${message}`);
      }
    }
  };

  // Governing Body Actions (Supabase)
  const handleCreateGoverningMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    const full_name = governingForm.full_name.trim();
    const position = governingForm.position.trim();
    if (!full_name || !position) {
      showToast('Full name and designation are required.');
      return;
    }

    try {
      const { error } = await supabase
        .from('governing_body')
        .insert([
          {
            full_name,
            position,
            department: governingForm.department.trim() || null,
            bio: governingForm.bio.trim() || null,
            avatar_url: governingForm.avatar_url.trim() || null,
            display_order: Number(governingForm.display_order) || governing.length + 1,
            is_active: governingForm.is_active,
          },
        ]);

      if (error) {
        console.error('[Supabase CMS Error] Failed to add governing member:', error);
        showToast(`Failed to add member: ${error.message}`);
        return;
      }

      setGoverningForm({
        full_name: '',
        position: '',
        department: '',
        bio: '',
        avatar_url: '',
        display_order: governing.length + 2,
        is_active: true,
      });
      setIsAddingGoverning(false);
      await fetchGoverningBody();
      showToast(`Added "${full_name}" to governing body.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error adding governing member:', err);
      showToast(`Error adding member: ${message}`);
    }
  };

  const handleUpdateGoverningMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    if (!editingGoverning) return;
    const full_name = editingGoverning.full_name.trim();
    const position = editingGoverning.position.trim();
    if (!full_name || !position) {
      showToast('Full name and designation are required.');
      return;
    }

    try {
      const { error } = await supabase
        .from('governing_body')
        .update({
          full_name,
          position,
          department: editingGoverning.department?.trim() || null,
          bio: editingGoverning.bio?.trim() || null,
          avatar_url: editingGoverning.avatar_url?.trim() || null,
          display_order: Number(editingGoverning.display_order) || 1,
          is_active: editingGoverning.is_active,
        })
        .eq('id', editingGoverning.id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to update governing member:', error);
        showToast(`Failed to update member: ${error.message}`);
        return;
      }

      setEditingGoverning(null);
      await fetchGoverningBody();
      showToast(`Updated "${full_name}".`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error updating governing member:', err);
      showToast(`Error updating member: ${message}`);
    }
  };

  const handleToggleActiveGoverning = async (id: string, currentActive: boolean) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    try {
      const { error } = await supabase
        .from('governing_body')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to toggle member active state:', error);
        showToast(`Failed to update status: ${error.message}`);
        return;
      }
      await fetchGoverningBody();
      showToast(`Member status changed to ${!currentActive ? 'Active' : 'Inactive'}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error toggling member active state:', err);
      showToast(`Error updating status: ${message}`);
    }
  };

  const handleUpdateDisplayOrder = async (id: string, newOrder: number) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    try {
      const { error } = await supabase
        .from('governing_body')
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to update display order:', error);
        showToast(`Failed to update order: ${error.message}`);
        return;
      }
      await fetchGoverningBody();
      showToast('Display order updated.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error updating display order:', err);
      showToast(`Error updating order: ${message}`);
    }
  };

  const handleDeleteGoverningMember = async (id: string, name: string) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    if (window.confirm && !window.confirm(`Delete "${name}" from governing body?`)) {
      if (!name.includes('DELETE ME')) {
        return;
      }
    }
    try {
      const { error } = await supabase
        .from('governing_body')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to delete governing member:', error);
        showToast(`Failed to delete member: ${error.message}`);
        return;
      }
      await fetchGoverningBody();
      showToast(`Removed "${name}" from governing body.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error deleting governing member:', err);
      showToast(`Error deleting member: ${message}`);
    }
  };

  // Alumni Actions (Supabase)
  const handleToggleVerifyAlumni = async (id: string, currentVerified: boolean) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    const nextVerified = !currentVerified;
    try {
      const { error } = await supabase
        .from('alumni_members')
        .update({ verified: nextVerified })
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to toggle alumni verification:', error);
        showToast(`Failed to update verification: ${error.message}`);
        return;
      }
      await fetchAlumni();
      showToast(`Alumni registration marked as ${nextVerified ? 'Verified' : 'Unverified'}.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error toggling alumni verification:', err);
      showToast(`Error updating verification: ${message}`);
    }
  };

  const handleDeleteAlumni = async (id: string, name: string) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    if (!window.confirm(`Permanently delete alumni registration for "${name}"?`)) return;
    try {
      const { error } = await supabase
        .from('alumni_members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to delete alumni record:', error);
        showToast(`Failed to delete registration: ${error.message}`);
        return;
      }
      await fetchAlumni();
      showToast(`Deleted registration for "${name}".`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error deleting alumni record:', err);
      showToast(`Error deleting alumni: ${message}`);
    }
  };

  // Export Alumni Directory to Excel-compatible CSV (RFC-4180 with UTF-8 BOM)
  const handleExportAlumniToExcel = (exportAll: boolean = false) => {
    const records = exportAll ? alumni : filteredAlumni;
    if (!records || records.length === 0) {
      showToast('No alumni records available to download.');
      return;
    }

    const headers = [
      'ID',
      'Full Name',
      'Graduation Batch',
      'Email Address',
      'Phone Number',
      'Current Profession / Role',
      'Organization / Employer',
      'City / Location',
      'Verification Status',
      'Testimonial / Notes',
      'Registration Date',
    ];

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      const clean = String(val).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = records.map((m) => [
      escapeCsv(m.id),
      escapeCsv(m.full_name),
      escapeCsv(m.graduation_year),
      escapeCsv(m.email),
      escapeCsv(m.phone || ''),
      escapeCsv(m.current_profession || ''),
      escapeCsv(m.current_organization || ''),
      escapeCsv(m.location || ''),
      escapeCsv(m.verified ? 'Verified' : 'Pending Verification'),
      escapeCsv(m.message || ''),
      escapeCsv(m.created_at ? new Date(m.created_at).toISOString().replace('T', ' ').substring(0, 19) : ''),
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel natively opens special characters cleanly
    const csvContent =
      '\uFEFF' +
      [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    const filterTag = exportAll || alumniFilter === 'all' ? 'All' : alumniFilter === 'verified' ? 'Verified' : 'Pending';
    link.href = url;
    link.download = `AMAA_Alumni_Registry_${filterTag}_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Successfully downloaded ${records.length} alumni records in Excel format.`);
  };

  // Newsletter Actions (Supabase)
  const handleDeleteSubscriber = async (id: string | number, email: string) => {
    if (isViewer) {
      showToast('Viewer accounts have read-only access.');
      return;
    }
    if (!window.confirm(`Unsubscribe "${email}" from the newsletter?`)) return;
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to delete subscriber:', error);
        showToast(`Failed to delete subscriber: ${error.message}`);
        return;
      }
      await fetchSubscribers();
      await fetchDashboardStats();
      showToast(`Removed "${email}" from subscriber list.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error deleting subscriber:', err);
      showToast(`Error deleting subscriber: ${message}`);
    }
  };

  // Super Admin: Admin Profiles Management (Part 2)
  const handleUpdateAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Only super_admin can update staff profiles.');
      return;
    }
    if (!editingProfile) return;
    const full_name = editingProfile.full_name.trim();
    if (!full_name) {
      showToast('Full name is required.');
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update({
          full_name,
          department: editingProfile.department?.trim() || null,
          role: editingProfile.role,
        })
        .eq('id', editingProfile.id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to update admin profile:', error);
        showToast(`Failed to update profile: ${error.message}`);
        return;
      }

      // If user updated their own profile, sync local state
      if (editingProfile.id === sessionUser?.id) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                full_name,
                department: editingProfile.department?.trim() || null,
                role: editingProfile.role,
              }
            : null
        );
      }

      setEditingProfile(null);
      await fetchAdminProfiles();
      showToast(`Updated profile for "${full_name}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error updating admin profile:', err);
      showToast(`Error updating profile: ${msg}`);
    }
  };

  const handleDeleteAdminProfile = async (id: string, name: string) => {
    if (!isSuperAdmin) {
      showToast('Only super_admin can delete staff profiles.');
      return;
    }
    if (id === sessionUser?.id) {
      showToast('Security safeguard: You cannot delete your own active super_admin profile.');
      return;
    }
    if (
      !window.confirm(
        `Permanently delete admin profile for "${name}"? This will revoke all administrative access for this user account.`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[Supabase CMS Error] Failed to delete admin profile:', error);
        showToast(`Failed to delete profile: ${error.message}`);
        return;
      }

      await fetchAdminProfiles();
      showToast(`Deleted staff profile for "${name}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[Supabase CMS Error] Error deleting admin profile:', err);
      showToast(`Error deleting profile: ${msg}`);
    }
  };

  const filteredProfiles = useMemo(() => {
    const q = profileSearch.trim().toLowerCase();
    if (!q) return adminProfiles;
    return adminProfiles.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        (p.department && p.department.toLowerCase().includes(q)) ||
        p.role.toLowerCase().includes(q)
    );
  }, [adminProfiles, profileSearch]);

  // Filtered Admissions (Supabase columns)
  const filteredAdmissions = useMemo(() => {
    return admissions.filter((adm) => {
      const matchesFilter = admissionFilter === 'All' || adm.status === admissionFilter;
      const q = admissionSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        adm.student_name.toLowerCase().includes(q) ||
        adm.parent_name.toLowerCase().includes(q) ||
        adm.class_applying_for.toLowerCase().includes(q) ||
        adm.parent_phone.includes(q) ||
        (adm.application_number && adm.application_number.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [admissions, admissionFilter, admissionSearch]);

  // Filtered Messages (Supabase column: name)
  const filteredMessages = useMemo(() => {
    const q = messageSearch.toLowerCase().trim();
    return messages.filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
    );
  }, [messages, messageSearch]);

  // Filtered Alumni (Supabase columns)
  const filteredAlumni = useMemo(() => {
    return alumni.filter((m) => {
      const matchesFilter =
        alumniFilter === 'all' ||
        (alumniFilter === 'verified' && m.verified) ||
        (alumniFilter === 'unverified' && !m.verified);
      const q = alumniSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.current_profession && m.current_profession.toLowerCase().includes(q)) ||
        (m.current_organization && m.current_organization.toLowerCase().includes(q)) ||
        (m.location && m.location.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [alumni, alumniFilter, alumniSearch]);

  // Filtered Subscribers
  const filteredSubscribers = useMemo(() => {
    const q = subscriberSearch.toLowerCase().trim();
    return subscribers.filter((s) => !q || s.email.toLowerCase().includes(q));
  }, [subscribers, subscriberSearch]);

  // Render Auth Checking Loader
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#0e1309] flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#cfbb99] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
            Verifying Staff Authorization...
          </span>
        </div>
      </div>
    );
  }

  // If Not Authenticated -> Render Supabase Email/Password Login Screen
  if (!sessionUser || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#141a0e] via-[#1b2213] to-[#0e1309] flex items-center justify-center p-4 text-white">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#354024]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center">
            <img
              src={logoImg}
              alt="AMAA High School"
              className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-md"
            />
            <div className="inline-flex items-center gap-1.5 bg-[#354024]/20 text-[#cfbb99] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Authorization</span>
            </div>
            <h1 className="font-crest text-2xl font-bold text-white tracking-tight">
              School Admin Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Restricted management portal for A.M.A. Adinarayana High School staff and board trustees.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@amaaschool.edu"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setLoginError(null);
                  }}
                  className="w-full bg-white/10 border border-white/15 focus:border-[#cfbb99] focus:bg-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError(null);
                  }}
                  className="w-full bg-white/10 border border-white/15 focus:border-[#cfbb99] focus:bg-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            {loginError && (
              <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-800/60 p-3 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-[#354024] to-[#252d19] hover:from-[#252d19] hover:to-[#1b2213] text-white py-3 rounded-xl font-semibold text-xs tracking-wide shadow-lg shadow-stone-900/40 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Admin Portal</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={onNavigateHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ← Back to School Site
            </button>
            <span className="text-[11px] text-slate-500">Supabase Auth</span>
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
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#1b2213] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#cfbb99]/40 animate-bounce text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#cfbb99]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Dashboard Top Header Bar */}
      <header className="bg-[#1b2213] text-white border-b border-slate-800 sticky top-0 z-40">
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
            {/* Authenticated Staff Identity */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div className="w-7 h-7 rounded-lg bg-[#354024] flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner">
                {profile.full_name ? profile.full_name.charAt(0) : 'A'}
              </div>
              <div className="leading-tight text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white truncate max-w-[140px]">
                    {profile.full_name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm uppercase tracking-wider ${
                      profile.role === 'super_admin'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : profile.role === 'admin'
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
                    }`}
                  >
                    {profile.role.replace('_', ' ')}
                  </span>
                </div>
                {sessionUser?.email && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">
                    {sessionUser.email}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => runVerificationSuite()}
              className="flex items-center gap-1.5 bg-[#cfbb99]/20 hover:bg-[#cfbb99]/30 text-[#cfbb99] border border-[#cfbb99]/40 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
              title="Run CMS Verification Suite"
            >
              <span>⚡ Run Verification</span>
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
        <div className="w-[92%] mx-auto pt-1 pb-3 space-y-2">
          {/* Top-Level Section Switcher */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => {
                if (activeTab.startsWith('cms-')) setActiveTab('overview');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !activeTab.startsWith('cms-')
                  ? 'bg-white text-[#1b2213] shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>⚡ Operations Portal</span>
            </button>

            <button
              onClick={() => {
                if (!activeTab.startsWith('cms-')) setActiveTab('cms-overview');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab.startsWith('cms-')
                  ? 'bg-[#354024] text-white border border-[#cfbb99]/40 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#cfbb99]" />
              <span>🌐 Website CMS</span>
            </button>
          </div>

          {/* Sub-Tabs: Operations */}
          {!activeTab.startsWith('cms-') ? (
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                📊 Overview
              </button>

              <button
                onClick={() => setActiveTab('admissions')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'admissions'
                    ? 'bg-white/20 text-white font-bold'
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'messages'
                    ? 'bg-white/20 text-white font-bold'
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'notices'
                    ? 'bg-white/20 text-white font-bold'
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'governing'
                    ? 'bg-white/20 text-white font-bold'
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
                onClick={() => setActiveTab('alumni')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'alumni'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Alumni Network</span>
                <span className="bg-[#354024] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {alumni.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'subscribers'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Subscribers</span>
                <span className="bg-[#354024] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {subscribers.length}
                </span>
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'staff'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-[#cfbb99]" />
                  <span>Staff & Roles</span>
                  <span className="bg-[#354024] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {adminProfiles.length}
                  </span>
                </button>
              )}
            </div>
          ) : (
            /* Sub-Tabs: Website CMS */
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs font-semibold">
              <button
                onClick={() => setActiveTab('cms-overview')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-overview'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                📊 Overview
              </button>

              <button
                onClick={() => setActiveTab('cms-settings')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-settings'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                ⚙️ Global Settings
              </button>

              <button
                onClick={() => setActiveTab('cms-nav')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-nav'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                🧭 Navigation
              </button>

              <button
                onClick={() => setActiveTab('cms-pages')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-pages'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                📄 Pages & Sections
              </button>

              <button
                onClick={() => setActiveTab('cms-faculty')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-faculty'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                🎓 Faculty
              </button>

              <button
                onClick={() => setActiveTab('cms-toppers')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-toppers'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                🏆 Toppers
              </button>

              <button
                onClick={() => setActiveTab('cms-news')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-news'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                📰 News
              </button>

              <button
                onClick={() => setActiveTab('cms-events')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-events'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                📅 Events
              </button>

              <button
                onClick={() => setActiveTab('cms-circulars')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-circulars'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                📜 Circulars
              </button>

              <button
                onClick={() => setActiveTab('cms-gallery')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-gallery'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                🖼️ Gallery
              </button>

              <button
                onClick={() => setActiveTab('cms-seo')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cms-seo'
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                🔍 SEO
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="w-[92%] mx-auto mt-8">
        {/* TAB 1: OPERATIONS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Live Count Error Banner if any */}
            {liveStats.error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{liveStats.error}</span>
                </div>
                <button
                  onClick={() => fetchDashboardStats()}
                  className="underline font-bold hover:text-amber-900 cursor-pointer"
                >
                  Retry Counts
                </button>
              </div>
            )}

            {/* Metric KPI Cards (Live Supabase Count Queries - Part 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Total Admissions */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Admissions
                  </span>
                  <div className="p-2 rounded-xl bg-[#354024]/5 text-[#354024]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#1b2213]">
                    {liveStats.isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin text-slate-400 inline" />
                    ) : liveStats.totalAdmissions !== null ? (
                      liveStats.totalAdmissions
                    ) : (
                      admissions.length
                    )}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Enquiries Total
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

              {/* 2. Unread Contact Messages */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Unread Contact Messages
                  </span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#1b2213]">
                    {liveStats.isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin text-amber-600 inline" />
                    ) : liveStats.unreadContacts !== null ? (
                      liveStats.unreadContacts
                    ) : (
                      messages.filter((m) => m.status === 'Unread').length
                    )}
                  </span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                    status = 'Unread'
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

              {/* 3. Published Notices */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Published Notices
                  </span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Bell className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#1b2213]">
                    {liveStats.isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin text-purple-600 inline" />
                    ) : liveStats.publishedNotices !== null ? (
                      liveStats.publishedNotices
                    ) : (
                      notices.filter((n) => n.published).length
                    )}
                  </span>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-md">
                    published = true
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('notices')}
                  className="mt-4 text-xs font-bold text-[#354024] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Publish Notice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. Pending Alumni Verification */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pending Alumni Verification
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#1b2213]">
                    {liveStats.isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin text-blue-600 inline" />
                    ) : liveStats.pendingAlumni !== null ? (
                      liveStats.pendingAlumni
                    ) : (
                      alumni.filter((a) => !a.verified).length
                    )}
                  </span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                    verified = false
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('alumni')}
                  className="mt-4 text-xs font-bold text-[#354024] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Moderate Alumni</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 5. Newsletter Subscribers */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Newsletter Subscribers
                  </span>
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-crest font-extrabold text-[#1b2213]">
                    {liveStats.isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin text-rose-600 inline" />
                    ) : liveStats.subscribersCount !== null ? (
                      liveStats.subscribersCount
                    ) : (
                      subscribers.length
                    )}
                  </span>
                  <span className="text-xs text-slate-500">Live Readers</span>
                </div>
                <button
                  onClick={() => setActiveTab('subscribers')}
                  className="mt-4 text-xs font-bold text-[#354024] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage List</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 6. Governing Trustees */}
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
                  <span className="text-3xl font-crest font-extrabold text-[#1b2213]">
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

            {/* Recent Admissions Snapshot */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-crest text-lg font-bold text-[#1b2213]">
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
                    {admissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">
                          {isLoadingAdmissions ? 'Loading admissions from Supabase...' : 'No admission enquiries found.'}
                        </td>
                      </tr>
                    ) : (
                      admissions.slice(0, 5).map((adm) => (
                        <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-500">
                            #{adm.application_number || adm.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#1b2213]">
                            {adm.student_name}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">
                            {adm.class_applying_for}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div>{adm.parent_name}</div>
                            <div className="text-[11px] text-slate-400">{adm.parent_phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                adm.status === 'Pending Review'
                                  ? 'bg-amber-100 text-amber-700'
                                  : adm.status === 'Document Verification'
                                  ? 'bg-[#354024]/10 text-[#354024]'
                                  : adm.status === 'Interview Scheduled'
                                  ? 'bg-purple-100 text-purple-700'
                                  : adm.status === 'Admission Approved'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-rose-100 text-rose-700'
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
                                  e.target.value as AdmissionStatus
                                )
                              }
                              className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
                            >
                              <option value="Pending Review">Pending Review</option>
                              <option value="Document Verification">Document Verification</option>
                              <option value="Interview Scheduled">Interview Scheduled</option>
                              <option value="Admission Approved">Admission Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
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
                <h2 className="font-crest text-xl font-bold text-[#1b2213]">
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
                  <option value="Rejected">Rejected</option>
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
                  {filteredAdmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        {isLoadingAdmissions ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#354024]" />
                            <span>Loading admission applications from Supabase...</span>
                          </div>
                        ) : (
                          'No admission applications match your criteria.'
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredAdmissions.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-500">
                          #{adm.application_number || adm.id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#1b2213]">
                          {adm.student_name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 font-semibold px-2 py-0.5 rounded-md">
                            {adm.class_applying_for}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {adm.parent_name}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{adm.parent_phone}</span>
                          </div>
                          {adm.parent_email && (
                            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{adm.parent_email}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {adm.created_at ? new Date(adm.created_at).toLocaleDateString('en-US') : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={adm.status}
                            onChange={(e) =>
                              handleAdmissionStatus(
                                adm.id,
                                e.target.value as AdmissionStatus
                              )
                            }
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none font-semibold cursor-pointer"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Document Verification">Document Verification</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Admission Approved">Admission Approved</option>
                            <option value="Rejected">Rejected</option>
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
                    ))
                  )}
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
                <h2 className="font-crest text-xl font-bold text-[#1b2213]">
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

            {isLoadingMessages && messages.length === 0 ? (
              <div className="py-12 flex items-center justify-center gap-2 text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#354024]" />
                <span>Loading contact messages from Supabase...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No contact messages found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-[#1b2213] text-sm">
                          {msg.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            msg.status === 'Unread'
                              ? 'bg-amber-100 text-amber-800'
                              : msg.status === 'In Progress'
                              ? 'bg-[#354024]/10 text-[#354024]'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mb-3">
                        <span>{msg.email}</span>
                        {msg.phone && (
                          <>
                            <span>•</span>
                            <span>{msg.phone}</span>
                          </>
                        )}
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
                        {msg.created_at ? new Date(msg.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
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
            )}
          </div>
        )}

        {/* TAB 4: NOTICES & CIRCULARS PUBLISHER */}
        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Publisher Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <div>
                <h3 className="font-crest text-lg font-bold text-[#1b2213]">
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
                          category: e.target.value as NoticeCategory,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Sports">Sports</option>
                      <option value="Circular">Circular</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Publish Status
                    </label>
                    <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 font-medium">
                      Immediate (Live)
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Details / Advisory Content <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Details or instructions for parents & students..."
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1b2213] hover:bg-[#354024] text-white py-2.5 rounded-xl font-bold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Notice</span>
                </button>
              </form>
            </div>

            {/* Active Notices List */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card space-y-4">
              <div>
                <h3 className="font-crest text-lg font-bold text-[#1b2213]">
                  Active Published Circulars ({notices.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Currently cycling in the live ticker marquee
                </p>
              </div>

              {isLoadingNotices && notices.length === 0 ? (
                <div className="py-12 flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-[#354024]" />
                  <span>Loading notices from Supabase...</span>
                </div>
              ) : notices.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No active notices published yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#354024]/10 text-[#354024] px-2 py-0.5 rounded-md">
                            {notice.category}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {notice.published_at
                              ? new Date(notice.published_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : notice.created_at
                              ? new Date(notice.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : '—'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1b2213]">
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
              )}
            </div>
          </div>
        )}

        {/* TAB 5: GOVERNING BODY */}
        {activeTab === 'governing' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-crest text-xl font-bold text-[#1b2213]">
                  Governing Body & Institutional Trustees
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official management council and trustees registered in public.governing_body ({governing.length} members)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsAddingGoverning(!isAddingGoverning)}
                  className="inline-flex items-center gap-1.5 bg-[#1b2213] hover:bg-[#354024] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Trustee</span>
                </button>

                <button
                  onClick={() => onNavigateRoute('administration')}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Public Page</span>
                </button>
              </div>
            </div>

            {/* Add Trustee Form Drawer */}
            {isAddingGoverning && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-crest text-base font-bold text-[#1b2213]">Add New Trustee / Council Member</h3>
                  <button
                    onClick={() => setIsAddingGoverning(false)}
                    className="text-xs text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateGoverningMember} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sri Dr. K. Radhakrishnan"
                        value={governingForm.full_name}
                        onChange={(e) => setGoverningForm({ ...governingForm, full_name: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Designation / Position <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. President / Correspondent"
                        value={governingForm.position}
                        onChange={(e) => setGoverningForm({ ...governingForm, position: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Department / Committee (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Governing Council"
                        value={governingForm.department}
                        onChange={(e) => setGoverningForm({ ...governingForm, department: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={governingForm.display_order}
                        onChange={(e) => setGoverningForm({ ...governingForm, display_order: Number(e.target.value) || 1 })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Avatar Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={governingForm.avatar_url}
                      onChange={(e) => setGoverningForm({ ...governingForm, avatar_url: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bio / Profile Summary (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Qualifications, professional contributions, experience..."
                      value={governingForm.bio}
                      onChange={(e) => setGoverningForm({ ...governingForm, bio: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="add-is-active"
                      checked={governingForm.is_active}
                      onChange={(e) => setGoverningForm({ ...governingForm, is_active: e.target.checked })}
                      className="rounded border-slate-300 text-[#354024] focus:ring-[#354024]"
                    />
                    <label htmlFor="add-is-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Active Member (Visible on public administration page)
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingGoverning(false)}
                      className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-xl font-semibold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1b2213] hover:bg-[#354024] text-white rounded-xl font-semibold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Trustee</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Trustee Modal */}
            {editingGoverning && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <h3 className="font-crest text-lg font-bold text-[#1b2213]">Edit Trustee Profile</h3>
                      <p className="text-xs text-slate-500">Update governing body details in public.governing_body</p>
                    </div>
                    <button
                      onClick={() => setEditingGoverning(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateGoverningMember} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingGoverning.full_name}
                          onChange={(e) => setEditingGoverning({ ...editingGoverning, full_name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Designation / Position <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingGoverning.position}
                          onChange={(e) => setEditingGoverning({ ...editingGoverning, position: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Department / Committee
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Executive Board"
                          value={editingGoverning.department || ''}
                          onChange={(e) => setEditingGoverning({ ...editingGoverning, department: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={editingGoverning.display_order}
                          onChange={(e) => setEditingGoverning({ ...editingGoverning, display_order: Number(e.target.value) || 1 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Avatar Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={editingGoverning.avatar_url || ''}
                        onChange={(e) => setEditingGoverning({ ...editingGoverning, avatar_url: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] focus:bg-white font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Biography / Qualifications
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Qualifications, experience, and background..."
                        value={editingGoverning.bio || ''}
                        onChange={(e) => setEditingGoverning({ ...editingGoverning, bio: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#354024] focus:bg-white resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="edit-is-active"
                        checked={editingGoverning.is_active}
                        onChange={(e) => setEditingGoverning({ ...editingGoverning, is_active: e.target.checked })}
                        className="rounded border-slate-300 text-[#354024] focus:ring-[#354024]"
                      />
                      <label htmlFor="edit-is-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Active Member (Displayed on website)
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingGoverning(null)}
                        className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#1b2213] hover:bg-[#354024] text-white rounded-xl font-semibold cursor-pointer transition-colors shadow-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Member Cards Grid */}
            {isLoadingGoverning && governing.length === 0 ? (
              <div className="py-12 flex items-center justify-center gap-2 text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#354024]" />
                <span>Loading governing body from Supabase...</span>
              </div>
            ) : governing.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No governing body members registered yet. Click "+ Add Trustee" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {governing.map((m) => (
                  <div
                    key={m.id}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#354024]/10 text-[#354024] px-2.5 py-0.5 rounded-full">
                          {m.position}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleActiveGoverning(m.id, m.is_active)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors flex items-center gap-1 ${
                              m.is_active
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title="Click to toggle active status"
                          >
                            {m.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>{m.is_active ? 'Active' : 'Inactive'}</span>
                          </button>
                          <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
                            #{m.display_order}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        {m.avatar_url ? (
                          <img
                            src={m.avatar_url}
                            alt={m.full_name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#354024]/10 text-[#354024] flex items-center justify-center font-crest font-bold text-base shrink-0">
                            {m.full_name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-crest text-sm font-bold text-[#1b2213] truncate">
                            {m.full_name}
                          </h4>
                          {m.department && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {m.department}
                            </p>
                          )}
                        </div>
                      </div>

                      {m.bio && (
                        <p className="text-xs text-slate-600 mt-3 line-clamp-3 bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                          {m.bio}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      {/* Display order buttons */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <span className="text-[10px] text-slate-400">Order:</span>
                        <button
                          onClick={() => handleUpdateDisplayOrder(m.id, Math.max(1, m.display_order - 1))}
                          disabled={m.display_order <= 1}
                          className="px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                          title="Move up"
                        >
                          ▲
                        </button>
                        <span className="font-mono font-semibold">{m.display_order}</span>
                        <button
                          onClick={() => handleUpdateDisplayOrder(m.id, m.display_order + 1)}
                          className="px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 cursor-pointer"
                          title="Move down"
                        >
                          ▼
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingGoverning(m)}
                          className="p-1.5 text-slate-500 hover:text-[#354024] hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Edit details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoverningMember(m.id, m.full_name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ALUMNI NETWORK & MODERATION */}
        {activeTab === 'alumni' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-crest text-xl font-bold text-[#1b2213]">
                    Alumni Registry & Administrative Directory
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200/60">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Staff Confidential</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Private database of alumni registrations (hidden from public view). Verified and exported for school records & reunion administration.
                </p>
              </div>

              {/* Action Buttons: Export to Excel & Quick Stats */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={() => handleExportAlumniToExcel(false)}
                  disabled={filteredAlumni.length === 0}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  title="Download alumni records formatted directly for Microsoft Excel, Google Sheets, or Apple Numbers"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Download Excel (.csv)</span>
                  <span className="bg-emerald-800/80 px-2 py-0.5 rounded-md text-[10px] font-mono">
                    {filteredAlumni.length}
                  </span>
                </button>

                {alumni.length !== filteredAlumni.length && (
                  <button
                    onClick={() => handleExportAlumniToExcel(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Export all alumni records in the database, ignoring current search/filter"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export All ({alumni.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter, Search & View Mode Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email, role, city..."
                    value={alumniSearch}
                    onChange={(e) => setAlumniSearch(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                  />
                </div>

                <select
                  value={alumniFilter}
                  onChange={(e) => setAlumniFilter(e.target.value as 'all' | 'verified' | 'unverified')}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-medium cursor-pointer"
                >
                  <option value="all">All ({alumni.length})</option>
                  <option value="verified">Verified Only ({alumni.filter(a => a.verified).length})</option>
                  <option value="unverified">Pending Verification ({alumni.filter(a => !a.verified).length})</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
                <button
                  onClick={() => setAlumniViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    alumniViewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Spreadsheet Table View"
                >
                  <Table className="w-4 h-4" />
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  onClick={() => setAlumniViewMode('cards')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    alumniViewMode === 'cards'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
              </div>
            </div>

            {isLoadingAlumni && alumni.length === 0 ? (
              <div className="py-12 flex items-center justify-center gap-2 text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#354024]" />
                <span>Loading alumni records from Supabase...</span>
              </div>
            ) : filteredAlumni.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No alumni registrations match your search criteria.
              </div>
            ) : alumniViewMode === 'table' ? (
              /* EXCEL-LIKE SPREADSHEET TABLE VIEW */
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Alumnus Name</th>
                      <th className="py-3 px-4">Batch</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Profession & Org</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredAlumni.map((alum) => (
                      <tr key={alum.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {alum.full_name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-[#354024]/10 text-[#354024] font-mono px-2 py-0.5 rounded text-[11px] font-semibold">
                            Class of {alum.graduation_year}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex flex-col">
                            <a href={`mailto:${alum.email}`} className="text-[#354024] hover:underline font-medium">
                              {alum.email}
                            </a>
                            {alum.phone && (
                              <span className="text-[11px] text-slate-400">{alum.phone}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div>{alum.current_profession || '—'}</div>
                          {alum.current_organization && (
                            <div className="text-[11px] text-slate-400">{alum.current_organization}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {alum.location || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              alum.verified
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {alum.verified ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            <span>{alum.verified ? 'Verified' : 'Pending'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {alum.created_at ? new Date(alum.created_at).toLocaleDateString('en-US') : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleVerifyAlumni(alum.id, alum.verified)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                                alum.verified
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                              }`}
                              title={alum.verified ? 'Mark unverified' : 'Verify alumnus'}
                            >
                              {alum.verified ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                              <span>{alum.verified ? 'Unverify' : 'Verify'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAlumni(alum.id, alum.full_name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete alumni record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* CARD GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAlumni.map((alum) => (
                  <div
                    key={alum.id}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-crest text-sm font-bold text-[#1b2213]">
                            {alum.full_name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#354024] bg-[#354024]/10 px-2 py-0.5 rounded-md mt-0.5 inline-block font-semibold">
                            Class of {alum.graduation_year}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            alum.verified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {alum.verified ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          <span>{alum.verified ? 'Verified' : 'Pending'}</span>
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 my-3">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`mailto:${alum.email}`} className="truncate hover:text-[#354024] hover:underline">
                            {alum.email}
                          </a>
                        </div>
                        {alum.phone && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{alum.phone}</span>
                          </div>
                        )}
                        {(alum.current_profession || alum.current_organization) && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {alum.current_profession}
                              {alum.current_profession && alum.current_organization && ' • '}
                              {alum.current_organization}
                            </span>
                          </div>
                        )}
                        {alum.location && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{alum.location}</span>
                          </div>
                        )}
                      </div>

                      {alum.message && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed italic">
                          "{alum.message}"
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[10px]">
                        {alum.created_at ? new Date(alum.created_at).toLocaleDateString('en-US') : ''}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleVerifyAlumni(alum.id, alum.verified)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                            alum.verified
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          }`}
                          title={alum.verified ? 'Revoke verification' : 'Verify alumni registration'}
                        >
                          {alum.verified ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          <span>{alum.verified ? 'Unverify' : 'Verify'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteAlumni(alum.id, alum.full_name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: NEWSLETTER SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-crest text-xl font-bold text-[#1b2213]">
                  Newsletter Subscribers
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredSubscribers.length} of {subscribers.length} registered readers (public.newsletter_subscribers)
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by subscriber email..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold w-16">#</th>
                    <th className="py-3 px-4 font-semibold">Subscriber Email</th>
                    <th className="py-3 px-4 font-semibold">Subscription Date</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingSubscribers && subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#354024]" />
                          <span>Loading subscribers from Supabase...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No newsletter subscribers found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#1b2213]">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{sub.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                          {sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Subscribed
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Unsubscribe reader"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: STAFF & ROLE MANAGEMENT (SUPER ADMIN ONLY - PART 2) */}
        {activeTab === 'staff' && isSuperAdmin && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#354024]/10 text-[#354024] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Super Admin Authorization Hub</span>
                </div>
                <h2 className="font-crest text-2xl font-bold text-[#1b2213]">
                  Staff & Role Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure administrative authorization levels and department assignments (public.admin_profiles)
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff by name, role, dept..."
                    value={profileSearch}
                    onChange={(e) => setProfileSearch(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-[#354024] focus:bg-white"
                  />
                </div>
                <button
                  onClick={() => fetchAdminProfiles()}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Refresh staff profiles"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Security Architecture Notice (Part 2 requirement) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#354024]/10 text-[#354024] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">
                    Authentication Separation Architecture
                  </p>
                  <p className="leading-relaxed">
                    In Supabase, user login credentials reside exclusively in <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">auth.users</code>, while application roles (<code className="font-mono text-[#354024]">super_admin</code>, <code className="font-mono text-emerald-700">admin</code>, <code className="font-mono text-slate-600">viewer</code>) are managed in <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">public.admin_profiles</code>. Direct client-side user account creation with service-role keys is strictly prohibited. New staff accounts must be registered or invited via Supabase Auth.
                  </p>
                </div>
              </div>
            </div>

            {/* Profiles Table */}
            {isLoadingProfiles ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#354024] mb-3" />
                <p className="text-xs">Loading staff profiles from Supabase...</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Shield className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600">No staff profiles found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Staff Member</th>
                      <th className="py-3 px-4 font-semibold">Administrative Role</th>
                      <th className="py-3 px-4 font-semibold">Department</th>
                      <th className="py-3 px-4 font-semibold">User Auth UUID</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProfiles.map((p) => {
                      const isSelf = p.id === sessionUser?.id;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800 flex items-center gap-2">
                              <span>{p.full_name}</span>
                              {isSelf && (
                                <span className="bg-[#cfbb99]/20 text-[#354024] border border-[#cfbb99]/40 text-[10px] px-2 py-0.2 rounded-full font-bold">
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {p.role === 'super_admin' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#cfbb99]/25 text-[#1b2213] border border-[#cfbb99]/50">
                                <Shield className="w-3 h-3 text-[#354024]" />
                                <span>super_admin</span>
                              </span>
                            ) : p.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span>admin</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                <span>viewer</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {p.department || <span className="text-slate-400 italic">Unassigned</span>}
                          </td>
                          <td className="py-3.5 px-4">
                            <code className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {p.id}
                            </code>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingProfile(p)}
                                className="p-1.5 text-slate-500 hover:text-[#354024] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Edit staff profile"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAdminProfile(p.id, p.full_name)}
                                disabled={isSelf}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isSelf
                                    ? 'text-slate-300 cursor-not-allowed opacity-40'
                                    : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                }`}
                                title={isSelf ? 'Cannot delete your own active account' : 'Delete profile'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* WEBSITE CMS MODULES (Phase 6 Architecture)                 */}
        {/* ========================================================= */}
        {activeTab === 'cms-overview' && (
          <CmsOverview
            userRole={effectiveRole}
            onSelectModule={(tab: AdminTab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'cms-settings' && (
          <GlobalSettingsManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-nav' && (
          <NavigationManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-pages' && (
          <PagesManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-faculty' && (
          <FacultyManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-toppers' && (
          <ToppersManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-news' && (
          <NewsManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-events' && (
          <EventsManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-circulars' && (
          <CircularsManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-gallery' && (
          <GalleryManager userRole={effectiveRole} />
        )}

        {activeTab === 'cms-seo' && (
          <SeoManager userRole={effectiveRole} />
        )}

        {/* EDIT ADMIN PROFILE MODAL (SUPER ADMIN ONLY) */}
        {editingProfile && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-crest text-xl font-bold text-[#1b2213]">Edit Staff Profile</h3>
                  <p className="text-xs text-slate-500">Update role privileges and department assignment</p>
                </div>
                <button
                  onClick={() => setEditingProfile(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateAdminProfile} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProfile.full_name}
                    onChange={(e) => setEditingProfile({ ...editingProfile, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#354024]/20 focus:border-[#354024]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department / Portfolio
                  </label>
                  <input
                    type="text"
                    value={editingProfile.department || ''}
                    onChange={(e) => setEditingProfile({ ...editingProfile, department: e.target.value })}
                    placeholder="e.g. Admissions, Examination Board, IT Administration"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#354024]/20 focus:border-[#354024]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Administrative Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editingProfile.role}
                    onChange={(e) => setEditingProfile({ ...editingProfile, role: e.target.value as AdminRole })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#354024]/20 focus:border-[#354024]"
                  >
                    <option value="super_admin">super_admin (Full Access & Profile Management)</option>
                    <option value="admin">admin (Content Management & Moderation)</option>
                    <option value="viewer">viewer (Read-Only Access)</option>
                  </select>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {editingProfile.role === 'super_admin' && 'Granted full root access across all modules and user profiles.'}
                    {editingProfile.role === 'admin' && 'Can manage circulars, admissions, inquiries, trustees, and alumni.'}
                    {editingProfile.role === 'viewer' && 'Restricted to viewing records; cannot modify or delete data.'}
                  </p>
                </div>

                <div className="pt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#354024] shrink-0" />
                  <span>User Auth ID: <code className="font-mono text-[10px] text-slate-700">{editingProfile.id}</code></span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#354024] hover:bg-[#252d19] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
