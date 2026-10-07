import React, { useState, useEffect } from 'react';
import {
  Award,
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
  Quote
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { AcademicTopperRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsImagePicker } from './CmsImagePicker';
import { CmsConfirmDialog } from './CmsConfirmDialog';

interface ToppersManagerProps {
  userRole: AdminRole;
}

export const ToppersManager: React.FC<ToppersManagerProps> = ({ userRole }) => {
  const [toppers, setToppers] = useState<AcademicTopperRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTopper, setEditingTopper] = useState<AcademicTopperRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<AcademicTopperRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    student_name: string;
    academic_year: string;
    class_level: string;
    score: string;
    rank_badge: string;
    quote: string;
    photo_url: string;
    sort_order: number;
    is_active: boolean;
  }>({
    student_name: '',
    academic_year: '2024-2025',
    class_level: 'Class X',
    score: '',
    rank_badge: '',
    quote: '',
    photo_url: '',
    sort_order: 1,
    is_active: true,
  });

  const isViewer = userRole === 'viewer';

  const fetchToppers = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('academic_toppers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setToppers(data || []);
    } catch (err: any) {
      console.error('[ToppersManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load academic toppers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToppers();
  }, []);

  const openCreateModal = () => {
    setEditingTopper(null);
    setFormState({
      student_name: '',
      academic_year: '2024-2025',
      class_level: 'Class X',
      score: '98.6%',
      rank_badge: 'State 1st Rank',
      quote: '',
      photo_url: '',
      sort_order: toppers.length + 1,
      is_active: true,
    });
    setIsCreating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (topper: AcademicTopperRow) => {
    setIsCreating(false);
    setEditingTopper(topper);
    setFormState({
      student_name: topper.student_name,
      academic_year: topper.academic_year || '',
      class_level: topper.class_level || '',
      score: topper.score || '',
      rank_badge: topper.rank_badge || '',
      quote: topper.quote || '',
      photo_url: topper.photo_url || '',
      sort_order: topper.sort_order,
      is_active: topper.is_active,
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const closeFormModal = () => {
    setIsCreating(false);
    setEditingTopper(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    if (!formState.student_name.trim()) {
      setErrorMessage('Student name is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      student_name: formState.student_name.trim(),
      academic_year: formState.academic_year.trim() || null,
      class_level: formState.class_level.trim() || null,
      score: formState.score.trim() || null,
      rank_badge: formState.rank_badge.trim() || null,
      quote: formState.quote.trim() || null,
      photo_url: formState.photo_url.trim() || null,
      sort_order: Number(formState.sort_order),
      is_active: formState.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('academic_toppers')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setToppers((prev) => [...prev, data]);
        setSuccessMessage('Created topper record successfully.');
      } else if (editingTopper) {
        const { data, error } = await supabase
          .from('academic_toppers')
          .update(payload)
          .eq('id', editingTopper.id)
          .select()
          .single();

        if (error) throw error;
        setToppers((prev) => prev.map((t) => (t.id === editingTopper.id ? data : t)));
        setSuccessMessage('Updated topper record successfully.');
      }

      closeFormModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[ToppersManager Save Error]:', err);
      setErrorMessage(err.message || 'Failed to save topper');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (topper: AcademicTopperRow) => {
    if (isViewer) return;
    const newStatus = !topper.is_active;

    setToppers((prev) =>
      prev.map((t) => (t.id === topper.id ? { ...t, is_active: newStatus } : t))
    );

    try {
      const { error } = await supabase
        .from('academic_toppers')
        .update({
          is_active: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', topper.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('[ToppersManager Toggle Error]:', err);
      setToppers((prev) =>
        prev.map((t) => (t.id === topper.id ? { ...t, is_active: !newStatus } : t))
      );
      setErrorMessage('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate || isViewer) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('academic_toppers')
        .delete()
        .eq('id', deleteCandidate.id);

      if (error) throw error;

      setToppers((prev) => prev.filter((t) => t.id !== deleteCandidate.id));
      setSuccessMessage(`Removed topper "${deleteCandidate.student_name}".`);
      setDeleteCandidate(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[ToppersManager Delete Error]:', err);
      setErrorMessage(err.message || 'Failed to delete topper');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredToppers = toppers.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.student_name.toLowerCase().includes(q) ||
      (t.class_level && t.class_level.toLowerCase().includes(q)) ||
      (t.academic_year && t.academic_year.toLowerCase().includes(q)) ||
      (t.rank_badge && t.rank_badge.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#354024]" />
            <span>Academic Toppers & Hall of Fame</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Showcase top-ranking students, board exam percentages, and testimonials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {toppers.length} Topper Records
          </span>
          {!isViewer && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#354024] hover:bg-[#28311a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Topper</span>
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
          placeholder="Filter toppers by student name, year, or rank badge..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-[#354024] outline-hidden shadow-xs"
        />
      </div>

      {/* Grid of Toppers Cards */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading toppers...</p>
        </div>
      ) : filteredToppers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No toppers found</h4>
          <p className="text-xs text-slate-500 mt-1">No topper records match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredToppers.map((topper) => (
            <div
              key={topper.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    {topper.photo_url ? (
                      <img
                        src={topper.photo_url}
                        alt={topper.student_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                        {topper.student_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-800 text-sm truncate block">
                      {topper.student_name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[#354024]">
                        {topper.score}
                      </span>
                      {topper.class_level && (
                        <span className="text-[11px] text-slate-500">
                          • {topper.class_level}
                        </span>
                      )}
                    </div>
                    {topper.rank_badge && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md">
                        {topper.rank_badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  {topper.academic_year && (
                    <p className="text-[11px] font-medium text-slate-500">
                      Academic Session: <span className="text-slate-800 font-semibold">{topper.academic_year}</span>
                    </p>
                  )}
                  {topper.quote && (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 italic text-[11px] border border-slate-100 flex items-start gap-1.5">
                      <Quote className="w-3 h-3 text-[#354024] shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{topper.quote}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Rank #{topper.sort_order}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={isViewer}
                    onClick={() => handleToggleActive(topper)}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                      topper.is_active
                        ? 'text-emerald-700 hover:bg-emerald-50'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={topper.is_active ? 'Active' : 'Inactive'}
                  >
                    {topper.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {!isViewer && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(topper)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit Topper"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(topper)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Topper"
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

      {/* Modal */}
      {(isCreating || editingTopper) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#354024]" />
                <span>{isCreating ? 'Add Academic Topper' : `Edit: ${editingTopper?.student_name}`}</span>
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
                <CmsFormField label="Student Full Name" required>
                  <input
                    type="text"
                    required
                    value={formState.student_name}
                    onChange={(e) => setFormState({ ...formState, student_name: e.target.value })}
                    placeholder="e.g. S. Sai Pranathi"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Academic Session / Year">
                  <input
                    type="text"
                    value={formState.academic_year}
                    onChange={(e) => setFormState({ ...formState, academic_year: e.target.value })}
                    placeholder="e.g. 2024-2025"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CmsFormField label="Class / Grade">
                  <input
                    type="text"
                    value={formState.class_level}
                    onChange={(e) => setFormState({ ...formState, class_level: e.target.value })}
                    placeholder="Class X"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Score / Marks">
                  <input
                    type="text"
                    value={formState.score}
                    onChange={(e) => setFormState({ ...formState, score: e.target.value })}
                    placeholder="e.g. 592 / 600 (98.6%)"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Rank Badge / Distinction">
                  <input
                    type="text"
                    value={formState.rank_badge}
                    onChange={(e) => setFormState({ ...formState, rank_badge: e.target.value })}
                    placeholder="e.g. State 1st Rank"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <CmsFormField label="Student Testimonial / Quote">
                <textarea
                  rows={3}
                  value={formState.quote}
                  onChange={(e) => setFormState({ ...formState, quote: e.target.value })}
                  placeholder="Student reflection or gratitude..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none"
                />
              </CmsFormField>

              <CmsImagePicker
                label="Student Photograph"
                value={formState.photo_url}
                onChange={(url) => setFormState({ ...formState, photo_url: url })}
                bucket="toppers-photos"
                disabled={isSaving}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Display Order">
                  <input
                    type="number"
                    min={1}
                    value={formState.sort_order}
                    onChange={(e) => setFormState({ ...formState, sort_order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="topper_active"
                    checked={formState.is_active}
                    onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="topper_active" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                    Display in Hall of Fame
                  </label>
                </div>
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
                  <span>{isCreating ? 'Create Record' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CmsConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Topper Record"
        message={`Are you sure you want to delete "${deleteCandidate?.student_name}"?`}
        confirmLabel="Delete Topper"
        onConfirm={handleDelete}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
