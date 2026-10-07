import React, { useState, useEffect } from 'react';
import {
  FileBadge,
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
  Download
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { SchoolCircularRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsImagePicker } from './CmsImagePicker';
import { CmsConfirmDialog } from './CmsConfirmDialog';

interface CircularsManagerProps {
  userRole: AdminRole;
}

export const CircularsManager: React.FC<CircularsManagerProps> = ({ userRole }) => {
  const [circulars, setCirculars] = useState<SchoolCircularRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCircular, setEditingCircular] = useState<SchoolCircularRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<SchoolCircularRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    circular_number: string;
    title: string;
    issue_date: string;
    target_classes: string;
    file_url: string;
    is_published: boolean;
  }>({
    circular_number: '',
    title: '',
    issue_date: new Date().toISOString().split('T')[0],
    target_classes: 'Classes VI - X',
    file_url: '',
    is_published: true,
  });

  const isViewer = userRole === 'viewer';

  const fetchCirculars = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('school_circulars')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCirculars(data || []);
    } catch (err: any) {
      console.error('[CircularsManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load school circulars');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCirculars();
  }, []);

  const openCreateModal = () => {
    setEditingCircular(null);
    setFormState({
      circular_number: `CIR/${new Date().getFullYear()}/${String(circulars.length + 1).padStart(3, '0')}`,
      title: '',
      issue_date: new Date().toISOString().split('T')[0],
      target_classes: 'Classes VI - X',
      file_url: '',
      is_published: true,
    });
    setIsCreating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (circ: SchoolCircularRow) => {
    setIsCreating(false);
    setEditingCircular(circ);
    setFormState({
      circular_number: circ.circular_number || '',
      title: circ.title,
      issue_date: circ.issue_date ? circ.issue_date.split('T')[0] : '',
      target_classes: circ.target_classes || '',
      file_url: circ.file_url || '',
      is_published: circ.is_published,
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const closeFormModal = () => {
    setIsCreating(false);
    setEditingCircular(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    if (!formState.title.trim()) {
      setErrorMessage('Circular title is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      circular_number: formState.circular_number.trim() || null,
      title: formState.title.trim(),
      issue_date: formState.issue_date ? formState.issue_date : null,
      target_classes: formState.target_classes.trim() || null,
      file_url: formState.file_url.trim() || null,
      is_published: formState.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('school_circulars')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setCirculars((prev) => [data, ...prev]);
        setSuccessMessage('Published official circular successfully.');
      } else if (editingCircular) {
        const { data, error } = await supabase
          .from('school_circulars')
          .update(payload)
          .eq('id', editingCircular.id)
          .select()
          .single();

        if (error) throw error;
        setCirculars((prev) => prev.map((c) => (c.id === editingCircular.id ? data : c)));
        setSuccessMessage('Updated circular successfully.');
      }

      closeFormModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[CircularsManager Save Error]:', err);
      setErrorMessage(err.message || 'Failed to save circular');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (circ: SchoolCircularRow) => {
    if (isViewer) return;
    const newStatus = !circ.is_published;

    setCirculars((prev) =>
      prev.map((c) => (c.id === circ.id ? { ...c, is_published: newStatus } : c))
    );

    try {
      const { error } = await supabase
        .from('school_circulars')
        .update({
          is_published: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', circ.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('[CircularsManager Toggle Error]:', err);
      setCirculars((prev) =>
        prev.map((c) => (c.id === circ.id ? { ...c, is_published: !newStatus } : c))
      );
      setErrorMessage('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate || isViewer) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('school_circulars')
        .delete()
        .eq('id', deleteCandidate.id);

      if (error) throw error;

      setCirculars((prev) => prev.filter((c) => c.id !== deleteCandidate.id));
      setSuccessMessage(`Deleted circular "${deleteCandidate.title}".`);
      setDeleteCandidate(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[CircularsManager Delete Error]:', err);
      setErrorMessage(err.message || 'Failed to delete circular');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCirculars = circulars.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.circular_number && c.circular_number.toLowerCase().includes(q)) ||
      (c.target_classes && c.target_classes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <FileBadge className="w-5 h-5 text-[#354024]" />
            <span>Official Circulars & Board Notifications</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish official administrative notices, fee circulars, examination schedules, and holiday announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {circulars.length} Official Circulars
          </span>
          {!isViewer && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#354024] hover:bg-[#28311a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Circular</span>
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
          placeholder="Filter circulars by title, reference number, or grade..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-[#354024] outline-hidden shadow-xs"
        />
      </div>

      {/* Circulars Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading circulars archive...</p>
        </div>
      ) : filteredCirculars.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileBadge className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No circulars found</h4>
          <p className="text-xs text-slate-500 mt-1">No circulars match your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Circular Title</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Target Classes</th>
                  <th className="py-3 px-4">PDF Document</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCirculars.map((circ) => (
                  <tr key={circ.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#354024] font-bold">
                      {circ.circular_number || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 max-w-sm">
                      {circ.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                      {circ.issue_date ? new Date(circ.issue_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {circ.target_classes ? (
                        <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {circ.target_classes}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {circ.file_url ? (
                        <a
                          href={circ.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#354024] hover:underline font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No document</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        disabled={isViewer}
                        onClick={() => handleTogglePublish(circ)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          circ.is_published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title={circ.is_published ? 'Published' : 'Draft'}
                      >
                        {circ.is_published ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-amber-600" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isViewer && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal(circ)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Edit Circular"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCandidate(circ)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Circular"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {(isCreating || editingCircular) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-[#354024]" />
                <span>{isCreating ? 'Issue New Circular' : `Edit: ${editingCircular?.title}`}</span>
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
                <CmsFormField label="Circular Reference Number">
                  <input
                    type="text"
                    value={formState.circular_number}
                    onChange={(e) => setFormState({ ...formState, circular_number: e.target.value })}
                    placeholder="e.g. CIR/2025/007"
                    className="w-full p-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Issue Date">
                  <input
                    type="date"
                    value={formState.issue_date}
                    onChange={(e) => setFormState({ ...formState, issue_date: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <CmsFormField label="Circular Title / Subject" required>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="e.g. Annual Summative Examination-II Schedule Announced"
                  className="w-full p-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                />
              </CmsFormField>

              <CmsFormField label="Applicable Target Classes / Grades">
                <input
                  type="text"
                  value={formState.target_classes}
                  onChange={(e) => setFormState({ ...formState, target_classes: e.target.value })}
                  placeholder="e.g. Classes VI - X or Grade X Only"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                />
              </CmsFormField>

              <CmsImagePicker
                label="Circular Document / File URL"
                value={formState.file_url}
                onChange={(url) => setFormState({ ...formState, file_url: url })}
                bucket="school-circulars"
                disabled={isSaving}
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="circ_published"
                  checked={formState.is_published}
                  onChange={(e) => setFormState({ ...formState, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                />
                <label htmlFor="circ_published" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  Circular is Published and Downloadable by Parents
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
                  <span>{isCreating ? 'Issue Circular' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CmsConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Circular"
        message={`Are you sure you want to delete circular "${deleteCandidate?.title}"?`}
        confirmLabel="Delete Circular"
        onConfirm={handleDelete}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
