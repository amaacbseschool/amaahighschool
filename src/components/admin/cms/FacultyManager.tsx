import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { FacultyMemberRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsImagePicker } from './CmsImagePicker';
import { CmsConfirmDialog } from './CmsConfirmDialog';

interface FacultyManagerProps {
  userRole: AdminRole;
}

export const FacultyManager: React.FC<FacultyManagerProps> = ({ userRole }) => {
  const [faculty, setFaculty] = useState<FacultyMemberRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<FacultyMemberRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<FacultyMemberRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    name: string;
    designation: string;
    department: string;
    qualification: string;
    experience: string;
    bio: string;
    avatar_url: string;
    email: string;
    office_hours: string;
    sort_order: number;
    is_active: boolean;
  }>({
    name: '',
    designation: '',
    department: '',
    qualification: '',
    experience: '',
    bio: '',
    avatar_url: '',
    email: '',
    office_hours: '',
    sort_order: 1,
    is_active: true,
  });

  const isViewer = userRole === 'viewer';

  const fetchFaculty = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('faculty_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFaculty(data || []);
    } catch (err: any) {
      console.error('[FacultyManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load faculty members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setFormState({
      name: '',
      designation: '',
      department: 'Academics',
      qualification: '',
      experience: '',
      bio: '',
      avatar_url: '',
      email: '',
      office_hours: '',
      sort_order: faculty.length + 1,
      is_active: true,
    });
    setIsCreating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (member: FacultyMemberRow) => {
    setIsCreating(false);
    setEditingMember(member);
    setFormState({
      name: member.name,
      designation: member.designation || '',
      department: member.department || '',
      qualification: member.qualification || '',
      experience: member.experience || '',
      bio: member.bio || '',
      avatar_url: member.avatar_url || '',
      email: member.email || '',
      office_hours: member.office_hours || '',
      sort_order: member.sort_order,
      is_active: member.is_active,
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const closeFormModal = () => {
    setIsCreating(false);
    setEditingMember(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    if (!formState.name.trim()) {
      setErrorMessage('Faculty name is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      name: formState.name.trim(),
      designation: formState.designation.trim() || null,
      department: formState.department.trim() || null,
      qualification: formState.qualification.trim() || null,
      experience: formState.experience.trim() || null,
      bio: formState.bio.trim() || null,
      avatar_url: formState.avatar_url.trim() || null,
      email: formState.email.trim() || null,
      office_hours: formState.office_hours.trim() || null,
      sort_order: Number(formState.sort_order),
      is_active: formState.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('faculty_members')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setFaculty((prev) => [...prev, data]);
        setSuccessMessage('Created faculty member successfully.');
      } else if (editingMember) {
        const { data, error } = await supabase
          .from('faculty_members')
          .update(payload)
          .eq('id', editingMember.id)
          .select()
          .single();

        if (error) throw error;
        setFaculty((prev) => prev.map((f) => (f.id === editingMember.id ? data : f)));
        setSuccessMessage('Updated faculty member successfully.');
      }

      closeFormModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[FacultyManager Save Error]:', err);
      setErrorMessage(err.message || 'Failed to save faculty member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (member: FacultyMemberRow) => {
    if (isViewer) return;
    const newStatus = !member.is_active;

    setFaculty((prev) =>
      prev.map((f) => (f.id === member.id ? { ...f, is_active: newStatus } : f))
    );

    try {
      const { error } = await supabase
        .from('faculty_members')
        .update({
          is_active: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', member.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('[FacultyManager Toggle Error]:', err);
      setFaculty((prev) =>
        prev.map((f) => (f.id === member.id ? { ...f, is_active: !newStatus } : f))
      );
      setErrorMessage('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate || isViewer) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('faculty_members')
        .delete()
        .eq('id', deleteCandidate.id);

      if (error) throw error;

      setFaculty((prev) => prev.filter((f) => f.id !== deleteCandidate.id));
      setSuccessMessage(`Removed faculty member "${deleteCandidate.name}".`);
      setDeleteCandidate(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[FacultyManager Delete Error]:', err);
      setErrorMessage(err.message || 'Failed to delete faculty member');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFaculty = faculty.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      (f.designation && f.designation.toLowerCase().includes(q)) ||
      (f.department && f.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#354024]" />
            <span>Faculty & Academic Staff Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage teacher profiles, qualifications, department appointments, and office hours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {faculty.length} Faculty Members
          </span>
          {!isViewer && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#354024] hover:bg-[#28311a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty Member</span>
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter faculty by name, designation, or department..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-[#354024] outline-hidden shadow-xs"
        />
      </div>

      {/* Grid of Faculty Cards */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading faculty directory...</p>
        </div>
      ) : filteredFaculty.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No faculty members found</h4>
          <p className="text-xs text-slate-500 mt-1">No faculty matching search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm truncate">
                        {member.name}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#354024] truncate">
                      {member.designation || 'Faculty'}
                    </p>
                    {member.department && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {member.department}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  {member.qualification && (
                    <p className="line-clamp-1">
                      <span className="font-semibold text-slate-700">Qual:</span> {member.qualification}
                    </p>
                  )}
                  {member.experience && (
                    <p className="line-clamp-1">
                      <span className="font-semibold text-slate-700">Exp:</span> {member.experience}
                    </p>
                  )}
                  {member.email && (
                    <p className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] truncate">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{member.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Order #{member.sort_order}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={isViewer}
                    onClick={() => handleToggleActive(member)}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                      member.is_active
                        ? 'text-emerald-700 hover:bg-emerald-50'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={member.is_active ? 'Active Profile' : 'Inactive Profile'}
                  >
                    {member.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {!isViewer && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit Faculty Member"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(member)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Faculty Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editingMember) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#354024]" />
                <span>{isCreating ? 'Add New Faculty Member' : `Edit: ${editingMember?.name}`}</span>
              </h3>
              <button
                type="button"
                onClick={closeFormModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Full Name" required>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Smt. K. Radhika"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Designation / Role">
                  <input
                    type="text"
                    value={formState.designation}
                    onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                    placeholder="e.g. Senior Faculty in Mathematics"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Department">
                  <input
                    type="text"
                    value={formState.department}
                    onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                    placeholder="e.g. Mathematics, Sciences, Languages"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Display Order">
                  <input
                    type="number"
                    min={1}
                    value={formState.sort_order}
                    onChange={(e) => setFormState({ ...formState, sort_order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Academic Qualifications">
                  <input
                    type="text"
                    value={formState.qualification}
                    onChange={(e) => setFormState({ ...formState, qualification: e.target.value })}
                    placeholder="e.g. M.Sc. in Mathematics, B.Ed."
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Years of Experience">
                  <input
                    type="text"
                    value={formState.experience}
                    onChange={(e) => setFormState({ ...formState, experience: e.target.value })}
                    placeholder="e.g. 14 Years in High School Pedagogy"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <CmsFormField label="Professional Biography">
                <textarea
                  rows={3}
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  placeholder="Summary of pedagogical background, special achievements, and student mentorship..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none"
                />
              </CmsFormField>

              <CmsImagePicker
                label="Faculty Profile Photo"
                value={formState.avatar_url}
                onChange={(url) => setFormState({ ...formState, avatar_url: url })}
                bucket="faculty-avatars"
                disabled={isSaving}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Institutional Email">
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="k.radhika@amaahighschool.edu.in"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Consultation / Office Hours">
                  <input
                    type="text"
                    value={formState.office_hours}
                    onChange={(e) => setFormState({ ...formState, office_hours: e.target.value })}
                    placeholder="Monday to Friday • 03:30 PM – 04:30 PM"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="faculty_active"
                  checked={formState.is_active}
                  onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                />
                <label htmlFor="faculty_active" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  Profile is Active & Visible on Website
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={isSaving}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#354024] hover:bg-[#28311a] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isCreating ? 'Create Member' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <CmsConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Faculty Member"
        message={`Are you sure you want to delete "${deleteCandidate?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Member"
        onConfirm={handleDelete}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
