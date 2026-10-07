import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
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
  Star
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { GalleryImageRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsImagePicker } from './CmsImagePicker';
import { CmsConfirmDialog } from './CmsConfirmDialog';

interface GalleryManagerProps {
  userRole: AdminRole;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ userRole }) => {
  const [images, setImages] = useState<GalleryImageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingImage, setEditingImage] = useState<GalleryImageRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<GalleryImageRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImageRow | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    title: string;
    category: string;
    image_url: string;
    caption: string;
    year: string;
    sort_order: number;
    is_featured: boolean;
    is_active: boolean;
  }>({
    title: '',
    category: 'Campus & Grounds',
    image_url: '',
    caption: '',
    year: '2025',
    sort_order: 1,
    is_featured: false,
    is_active: true,
  });

  const isViewer = userRole === 'viewer';

  const categories = [
    'All',
    'Campus & Grounds',
    'Academics & Labs',
    'Sports & Co-Curricular',
    'Events & Celebrations',
  ];

  const fetchImages = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (err: any) {
      console.error('[GalleryManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load gallery images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openCreateModal = () => {
    setEditingImage(null);
    setFormState({
      title: '',
      category: 'Campus & Grounds',
      image_url: '',
      caption: '',
      year: '2025',
      sort_order: images.length + 1,
      is_featured: false,
      is_active: true,
    });
    setIsCreating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (img: GalleryImageRow) => {
    setIsCreating(false);
    setEditingImage(img);
    setFormState({
      title: img.title,
      category: img.category || 'Campus & Grounds',
      image_url: img.image_url,
      caption: img.caption || '',
      year: img.year || '',
      sort_order: img.sort_order,
      is_featured: img.is_featured,
      is_active: img.is_active,
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const closeFormModal = () => {
    setIsCreating(false);
    setEditingImage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    if (!formState.title.trim()) {
      setErrorMessage('Image title is required.');
      return;
    }
    if (!formState.image_url.trim()) {
      setErrorMessage('Image URL or upload is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      title: formState.title.trim(),
      category: formState.category.trim() || null,
      image_url: formState.image_url.trim(),
      caption: formState.caption.trim() || null,
      year: formState.year.trim() || null,
      sort_order: Number(formState.sort_order),
      is_featured: formState.is_featured,
      is_active: formState.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('gallery_images')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setImages((prev) => [...prev, data]);
        setSuccessMessage('Added photo to gallery successfully.');
      } else if (editingImage) {
        const { data, error } = await supabase
          .from('gallery_images')
          .update(payload)
          .eq('id', editingImage.id)
          .select()
          .single();

        if (error) throw error;
        setImages((prev) => prev.map((img) => (img.id === editingImage.id ? data : img)));
        setSuccessMessage('Updated photo details successfully.');
      }

      closeFormModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[GalleryManager Save Error]:', err);
      setErrorMessage(err.message || 'Failed to save gallery image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (img: GalleryImageRow) => {
    if (isViewer) return;
    const newStatus = !img.is_active;

    setImages((prev) =>
      prev.map((i) => (i.id === img.id ? { ...i, is_active: newStatus } : i))
    );

    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({
          is_active: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', img.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('[GalleryManager Toggle Active Error]:', err);
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, is_active: !newStatus } : i))
      );
      setErrorMessage('Failed to update status: ' + err.message);
    }
  };

  const handleToggleFeatured = async (img: GalleryImageRow) => {
    if (isViewer) return;
    const newStatus = !img.is_featured;

    setImages((prev) =>
      prev.map((i) => (i.id === img.id ? { ...i, is_featured: newStatus } : i))
    );

    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({
          is_featured: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', img.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('[GalleryManager Toggle Featured Error]:', err);
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, is_featured: !newStatus } : i))
      );
      setErrorMessage('Failed to update featured flag: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate || isViewer) return;

    setIsDeleting(true);
    try {
      // 1. Delete database record
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', deleteCandidate.id);

      if (error) throw error;

      // 2. If it's a Supabase storage URL, attempt cleanup (best-effort)
      if (deleteCandidate.image_url.includes('school-gallery')) {
        const parts = deleteCandidate.image_url.split('/school-gallery/');
        if (parts.length > 1) {
          const filePath = parts[1];
          await supabase.storage.from('school-gallery').remove([filePath]);
        }
      }

      setImages((prev) => prev.filter((img) => img.id !== deleteCandidate.id));
      setSuccessMessage(`Deleted photo "${deleteCandidate.title}".`);
      setDeleteCandidate(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[GalleryManager Delete Error]:', err);
      setErrorMessage(err.message || 'Failed to delete gallery image');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.caption && img.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (img.year && img.year.includes(searchQuery));

    const matchesCategory =
      selectedCategory === 'All' || img.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#354024]" />
            <span>School Photo Gallery & Campus Showcase</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Curate campus photographs, laboratory facilities, athletic events, and celebrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {images.length} Photos in Gallery
          </span>
          {!isViewer && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#354024] hover:bg-[#28311a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo</span>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery by title, caption, or year..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-[#354024] outline-hidden shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading gallery photos...</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No photos found</h4>
          <p className="text-xs text-slate-500 mt-1">No photographs match your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-slate-300 transition-colors"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setPreviewImage(img)}
                />

                {img.is_featured && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white p-1 rounded-md shadow-xs" title="Featured Photo">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}

                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs p-1 rounded-lg">
                  <button
                    type="button"
                    disabled={isViewer}
                    onClick={() => handleToggleFeatured(img)}
                    className={`p-1 rounded text-white hover:text-amber-400 cursor-pointer ${img.is_featured ? 'text-amber-400' : ''}`}
                    title={img.is_featured ? 'Remove from Featured' : 'Feature photo'}
                  >
                    <Star className={`w-3.5 h-3.5 ${img.is_featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    disabled={isViewer}
                    onClick={() => handleToggleActive(img)}
                    className="p-1 rounded text-white hover:text-emerald-400 cursor-pointer"
                    title={img.is_active ? 'Hide Photo' : 'Show Photo'}
                  >
                    {img.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1" title={img.title}>
                    {img.title}
                  </h4>
                  {img.category && (
                    <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                      {img.category} {img.year ? `• ${img.year}` : ''}
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    #{img.sort_order}
                  </span>

                  <div className="flex items-center gap-1">
                    {!isViewer && (
                      <>
                        <button
                          type="button"
                          onClick={() => openEditModal(img)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(img)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-black">
              <img
                src={previewImage.image_url}
                alt={previewImage.title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-base">{previewImage.title}</h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                  {previewImage.category}
                </span>
              </div>
              {previewImage.caption && (
                <p className="text-xs text-slate-600 mt-2">{previewImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {(isCreating || editingImage) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#354024]" />
                <span>{isCreating ? 'Add Photo to Gallery' : `Edit: ${editingImage?.title}`}</span>
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
              <CmsFormField label="Photo Title" required>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="e.g. Modern Physics & Chemistry Laboratory"
                  className="w-full p-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                />
              </CmsFormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsFormField label="Gallery Category" required>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden bg-white"
                  >
                    <option value="Campus & Grounds">Campus & Grounds</option>
                    <option value="Academics & Labs">Academics & Labs</option>
                    <option value="Sports & Co-Curricular">Sports & Co-Curricular</option>
                    <option value="Events & Celebrations">Events & Celebrations</option>
                  </select>
                </CmsFormField>

                <CmsFormField label="Academic Year">
                  <input
                    type="text"
                    value={formState.year}
                    onChange={(e) => setFormState({ ...formState, year: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <CmsFormField label="Photo Description / Caption">
                <textarea
                  rows={2}
                  value={formState.caption}
                  onChange={(e) => setFormState({ ...formState, caption: e.target.value })}
                  placeholder="Contextual description of the photograph..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none"
                />
              </CmsFormField>

              <CmsImagePicker
                label="Photograph File"
                value={formState.image_url}
                onChange={(url) => setFormState({ ...formState, image_url: url })}
                bucket="school-gallery"
                required
                disabled={isSaving}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <CmsFormField label="Sort Order">
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
                    id="img_featured"
                    checked={formState.is_featured}
                    onChange={(e) => setFormState({ ...formState, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="img_featured" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                    Featured
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="img_active"
                    checked={formState.is_active}
                    onChange={(e) => setFormState({ ...formState, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="img_active" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                    Active
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
                  <span>{isCreating ? 'Add Photo' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CmsConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete Photo from Gallery"
        message={`Are you sure you want to delete "${deleteCandidate?.title}"?`}
        confirmLabel="Delete Photo"
        onConfirm={handleDelete}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
