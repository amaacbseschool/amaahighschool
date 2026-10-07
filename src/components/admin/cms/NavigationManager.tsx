import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CornerDownRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { NavigationItemRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsConfirmDialog } from './CmsConfirmDialog';

interface NavigationManagerProps {
  userRole: AdminRole;
}

export const NavigationManager: React.FC<NavigationManagerProps> = ({ userRole }) => {
  const [items, setItems] = useState<NavigationItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NavigationItemRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<NavigationItemRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState<{
    label: string;
    path: string;
    parent_id: string | null;
    sort_order: number;
    is_visible: boolean;
    target: string;
  }>({
    label: '',
    path: '',
    parent_id: null,
    sort_order: 1,
    is_visible: true,
    target: '_self'
  });

  const isViewer = userRole === 'viewer';

  const fetchNavItems = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.error('[NavigationManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load navigation items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNavItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState({
      label: '',
      path: '/',
      parent_id: null,
      sort_order: items.filter((i) => i.parent_id === null).length + 1,
      is_visible: true,
      target: '_self'
    });
    setIsCreating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (item: NavigationItemRow) => {
    setIsCreating(false);
    setEditingItem(item);
    setFormState({
      label: item.label,
      path: item.path,
      parent_id: item.parent_id,
      sort_order: item.sort_order,
      is_visible: item.is_visible,
      target: item.target || '_self'
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const closeFormModal = () => {
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    if (!formState.label.trim()) {
      setErrorMessage('Navigation label is required.');
      return;
    }
    if (!formState.path.trim()) {
      setErrorMessage('Path or URL is required.');
      return;
    }

    // Circular dependency check
    if (editingItem && formState.parent_id === editingItem.id) {
      setErrorMessage('An item cannot be its own parent.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('navigation_items')
          .insert([{
            label: formState.label.trim(),
            path: formState.path.trim(),
            parent_id: formState.parent_id || null,
            sort_order: Number(formState.sort_order),
            is_visible: formState.is_visible,
            target: formState.target
          }])
          .select()
          .single();

        if (error) throw error;
        setItems((prev) => [...prev, data]);
        setSuccessMessage(`Created navigation item "${formState.label}".`);
      } else if (editingItem) {
        const { data, error } = await supabase
          .from('navigation_items')
          .update({
            label: formState.label.trim(),
            path: formState.path.trim(),
            parent_id: formState.parent_id || null,
            sort_order: Number(formState.sort_order),
            is_visible: formState.is_visible,
            target: formState.target,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id)
          .select()
          .single();

        if (error) throw error;
        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? data : item)));
        setSuccessMessage(`Updated navigation item "${formState.label}".`);
      }

      closeFormModal();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('[NavigationManager Save Error]:', err);
      setErrorMessage(err.message || 'Error saving navigation item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (item: NavigationItemRow) => {
    if (isViewer) return;

    const newVisibility = !item.is_visible;
    try {
      const { error } = await supabase
        .from('navigation_items')
        .update({ is_visible: newVisibility, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_visible: newVisibility } : i))
      );
    } catch (err: any) {
      console.error('[NavigationManager Toggle Visibility Error]:', err);
      setErrorMessage(err.message || 'Failed to toggle visibility');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate || isViewer) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', deleteCandidate.id);

      if (error) throw error;

      // Note: CASCADE in postgres deletes children
      setItems((prev) => prev.filter((i) => i.id !== deleteCandidate.id && i.parent_id !== deleteCandidate.id));
      setSuccessMessage(`Deleted navigation item "${deleteCandidate.label}".`);
      setDeleteCandidate(null);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('[NavigationManager Delete Error]:', err);
      setErrorMessage(err.message || 'Failed to delete navigation item.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Group top-level and children
  const rootItems = items.filter((i) => i.parent_id === null).sort((a, b) => a.sort_order - b.sort_order);
  const getChildren = (parentId: string) =>
    items.filter((i) => i.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#354024]" />
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              Navigation Menu Manager
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure header links, dropdown menus, sort order, and link targets across the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isViewer && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tree Display */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#354024] animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading navigation hierarchy from database...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Menu Structure & Hierarchy ({items.length} Total Items)</span>
            <span>Actions & Status</span>
          </div>

          <div className="divide-y divide-slate-100">
            {rootItems.map((root) => {
              const children = getChildren(root.id);

              return (
                <div key={root.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  {/* Root Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#354024]/10 text-[#354024] flex items-center justify-center text-xs font-bold shrink-0">
                        {root.sort_order}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{root.label}</span>
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {root.path}
                          </span>
                          {root.target === '_blank' && (
                            <span title="Opens in new tab">
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </span>
                          )}
                        </div>
                        {children.length > 0 && (
                          <span className="text-[11px] text-slate-400 mt-0.5 block">
                            {children.length} dropdown {children.length === 1 ? 'sub-item' : 'sub-items'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isViewer}
                        onClick={() => handleToggleVisibility(root)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                          root.is_visible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                        title={root.is_visible ? 'Visible on Navbar' : 'Hidden from Navbar'}
                      >
                        {root.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {!isViewer && (
                        <>
                          <button
                            type="button"
                            onClick={() => openEditModal(root)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(root)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Children Rows */}
                  {children.length > 0 && (
                    <div className="mt-3 ml-6 pl-4 border-l-2 border-slate-200 space-y-2">
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between gap-4 py-1.5 px-3 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {child.sort_order}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">{child.label}</span>
                            <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                              {child.path}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={isViewer}
                              onClick={() => handleToggleVisibility(child)}
                              className={`p-1 rounded-md text-xs cursor-pointer ${
                                child.is_visible ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                              }`}
                              title={child.is_visible ? 'Visible' : 'Hidden'}
                            >
                              {child.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </button>

                            {!isViewer && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(child)}
                                  className="p-1 rounded-md text-slate-600 hover:bg-slate-200 cursor-pointer"
                                  title="Edit Sub-item"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteCandidate(child)}
                                  className="p-1 rounded-md text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  title="Delete Sub-item"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isCreating ? 'Create Navigation Item' : `Edit: ${editingItem?.label}`}
              </h3>
              <button
                type="button"
                onClick={closeFormModal}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <CmsFormField label="Menu Label" required helpText="Text shown on navbar or dropdown link">
                <input
                  type="text"
                  required
                  placeholder="e.g. Academics"
                  value={formState.label}
                  onChange={(e) => setFormState({ ...formState, label: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-hidden"
                />
              </CmsFormField>

              <CmsFormField label="Path or Destination URL" required helpText="Relative route (/about, /academics#curriculum) or absolute URL">
                <input
                  type="text"
                  required
                  placeholder="/about#our-story"
                  value={formState.path}
                  onChange={(e) => setFormState({ ...formState, path: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-hidden font-mono"
                />
              </CmsFormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Parent Menu (Nesting)" helpText="Select a top-level item to place this inside a dropdown">
                  <select
                    value={formState.parent_id || ''}
                    onChange={(e) => setFormState({ ...formState, parent_id: e.target.value || null })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-hidden bg-white"
                  >
                    <option value="">None (Top-Level Menu Item)</option>
                    {rootItems
                      .filter((r) => !editingItem || r.id !== editingItem.id)
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                  </select>
                </CmsFormField>

                <CmsFormField label="Sort Order" helpText="Lower numbers appear first">
                  <input
                    type="number"
                    min={1}
                    value={formState.sort_order}
                    onChange={(e) => setFormState({ ...formState, sort_order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <CmsFormField label="Link Target">
                  <select
                    value={formState.target}
                    onChange={(e) => setFormState({ ...formState, target: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-hidden bg-white"
                  >
                    <option value="_self">Same Tab (_self)</option>
                    <option value="_blank">New Tab (_blank)</option>
                  </select>
                </CmsFormField>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.is_visible}
                      onChange={(e) => setFormState({ ...formState, is_visible: e.target.checked })}
                      className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-700">Visible on Navbar</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{isCreating ? 'Create Item' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <CmsConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Navigation Item"
        message={`Are you sure you want to delete "${deleteCandidate?.label}"? If this is a parent menu, all of its dropdown items will also be removed.`}
        confirmLabel="Delete Item"
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
};
