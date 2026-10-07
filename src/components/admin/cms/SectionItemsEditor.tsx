import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Layers
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { CmsSectionItemRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsImagePicker } from './CmsImagePicker';
import { CmsConfirmDialog } from './CmsConfirmDialog';

interface SectionItemsEditorProps {
  sectionId: string;
  sectionKey: string;
  userRole: AdminRole;
}

export const SectionItemsEditor: React.FC<SectionItemsEditorProps> = ({
  sectionId,
  sectionKey,
  userRole,
}) => {
  const [items, setItems] = useState<CmsSectionItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CmsSectionItemRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<CmsSectionItemRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState<{
    title: string;
    subtitle: string;
    description: string;
    content: string;
    image_url: string;
    badge: string;
    icon_name: string;
    link_text: string;
    link_url: string;
    metadataText: string;
    sort_order: number;
    is_visible: boolean;
  }>({
    title: '',
    subtitle: '',
    description: '',
    content: '',
    image_url: '',
    badge: '',
    icon_name: '',
    link_text: '',
    link_url: '',
    metadataText: '{}',
    sort_order: 1,
    is_visible: true,
  });

  const isViewer = userRole === 'viewer';

  const fetchItems = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('cms_section_items')
        .select('*')
        .eq('section_id', sectionId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.error('[SectionItemsEditor Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load section items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [sectionId]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState({
      title: '',
      subtitle: '',
      description: '',
      content: '',
      image_url: '',
      badge: '',
      icon_name: '',
      link_text: '',
      link_url: '',
      metadataText: '{}',
      sort_order: items.length + 1,
      is_visible: true,
    });
    setIsCreating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (item: CmsSectionItemRow) => {
    setIsCreating(false);
    setEditingItem(item);
    setFormState({
      title: item.title || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      content: item.content || '',
      image_url: item.image_url || '',
      badge: item.badge || '',
      icon_name: item.icon_name || '',
      link_text: item.link_text || '',
      link_url: item.link_url || '',
      metadataText: JSON.stringify(item.metadata || {}, null, 2),
      sort_order: item.sort_order,
      is_visible: item.is_visible,
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

    // Validate JSON metadata
    let parsedMetadata = {};
    if (formState.metadataText.trim()) {
      try {
        parsedMetadata = JSON.parse(formState.metadataText);
      } catch (err: any) {
        setErrorMessage('Invalid JSON in Metadata field: ' + err.message);
        return;
      }
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      section_id: sectionId,
      title: formState.title.trim() || null,
      subtitle: formState.subtitle.trim() || null,
      description: formState.description.trim() || null,
      content: formState.content.trim() || null,
      image_url: formState.image_url.trim() || null,
      badge: formState.badge.trim() || null,
      icon_name: formState.icon_name.trim() || null,
      link_text: formState.link_text.trim() || null,
      link_url: formState.link_url.trim() || null,
      metadata: parsedMetadata,
      sort_order: Number(formState.sort_order),
      is_visible: formState.is_visible,
    };

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('cms_section_items')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setItems((prev) => [...prev, data]);
        setSuccessMessage('Created item successfully.');
      } else if (editingItem) {
        const { data, error } = await supabase
          .from('cms_section_items')
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingItem.id)
          .select()
          .single();

        if (error) throw error;
        setItems((prev) => prev.map((i) => (i.id === editingItem.id ? data : i)));
        setSuccessMessage('Updated item successfully.');
      }

      closeFormModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[SectionItemsEditor Save Error]:', err);
      setErrorMessage(err.message || 'Error saving section item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (item: CmsSectionItemRow) => {
    if (isViewer) return;

    const newVis = !item.is_visible;
    try {
      const { error } = await supabase
        .from('cms_section_items')
        .update({ is_visible: newVis, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) throw error;
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_visible: newVis } : i)));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to toggle item visibility');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate || isViewer) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('cms_section_items')
        .delete()
        .eq('id', deleteCandidate.id);

      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== deleteCandidate.id));
      setSuccessMessage('Deleted section item.');
      setDeleteCandidate(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete item.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#354024]" />
            <span>Repeating Section Cards / Items ({items.length})</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            Feature highlights, cards, statistics, or tabs associated with [{sectionKey}]
          </p>
        </div>

        {!isViewer && (
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#354024]/10 hover:bg-[#354024]/15 text-[#354024] font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Items List */}
      {isLoading ? (
        <div className="p-4 text-center text-xs text-slate-400">Loading section items...</div>
      ) : items.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
          This section has no child items.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl flex items-center justify-between gap-3 transition-colors text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {item.sort_order}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 truncate">
                      {item.title || item.subtitle || '(Untitled Item)'}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-md">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={isViewer}
                  onClick={() => handleToggleVisibility(item)}
                  className={`p-1 rounded-md text-xs cursor-pointer ${
                    item.is_visible ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                  }`}
                  title={item.is_visible ? 'Visible' : 'Hidden'}
                >
                  {item.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {!isViewer && (
                  <>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1 text-slate-600 hover:bg-slate-200 rounded-md cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(item)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Modal Form */}
      {(isCreating || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isCreating ? 'Add Section Item' : 'Edit Section Item'}
              </h3>
              <button
                type="button"
                onClick={closeFormModal}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Title">
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Subtitle">
                  <input
                    type="text"
                    value={formState.subtitle}
                    onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <CmsFormField label="Description">
                <textarea
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none"
                />
              </CmsFormField>

              <CmsFormField label="Body Content / HTML">
                <textarea
                  rows={3}
                  value={formState.content}
                  onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none font-mono"
                />
              </CmsFormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CmsFormField label="Badge">
                  <input
                    type="text"
                    placeholder="e.g. Pillar 01, 100%"
                    value={formState.badge}
                    onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Icon Name">
                  <input
                    type="text"
                    placeholder="e.g. BookOpen, Award"
                    value={formState.icon_name}
                    onChange={(e) => setFormState({ ...formState, icon_name: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden font-mono"
                  />
                </CmsFormField>

                <CmsFormField label="Sort Order">
                  <input
                    type="number"
                    min={1}
                    value={formState.sort_order}
                    onChange={(e) => setFormState({ ...formState, sort_order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <CmsImagePicker
                label="Item Image (Optional)"
                value={formState.image_url}
                onChange={(url) => setFormState({ ...formState, image_url: url })}
                bucket="school-gallery"
                disabled={isSaving}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Link / CTA Text">
                  <input
                    type="text"
                    placeholder="Learn More"
                    value={formState.link_text}
                    onChange={(e) => setFormState({ ...formState, link_text: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Link / CTA URL">
                  <input
                    type="text"
                    placeholder="/about"
                    value={formState.link_url}
                    onChange={(e) => setFormState({ ...formState, link_url: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden font-mono"
                  />
                </CmsFormField>
              </div>

              <CmsFormField label="Metadata (JSON)" helpText="Extra properties formatted as valid JSON object">
                <textarea
                  rows={2}
                  value={formState.metadataText}
                  onChange={(e) => setFormState({ ...formState, metadataText: e.target.value })}
                  className="w-full p-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none bg-slate-50"
                />
              </CmsFormField>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="item_visible"
                  checked={formState.is_visible}
                  onChange={(e) => setFormState({ ...formState, is_visible: e.target.checked })}
                  className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                />
                <label htmlFor="item_visible" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Visible in Section
                </label>
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
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isCreating ? 'Create Item' : 'Save Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Dialog */}
      <CmsConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Section Item"
        message={`Are you sure you want to delete "${deleteCandidate?.title || deleteCandidate?.subtitle || 'this item'}"?`}
        confirmLabel="Delete Item"
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteCandidate(null)}
      />
    </div>
  );
};
