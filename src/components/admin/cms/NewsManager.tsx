import React, { useState, useEffect } from 'react';
import {
  Newspaper,
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
  Calendar
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { SchoolArticleRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsImagePicker } from './CmsImagePicker';
import { CmsConfirmDialog } from './CmsConfirmDialog';

interface NewsManagerProps {
  userRole: AdminRole;
}

export const NewsManager: React.FC<NewsManagerProps> = ({ userRole }) => {
  const [articles, setArticles] = useState<SchoolArticleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingArticle, setEditingArticle] = useState<SchoolArticleRow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<SchoolArticleRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    title: string;
    slug: string;
    category: string;
    summary: string;
    body: string;
    thumbnail_url: string;
    published_at: string;
    is_published: boolean;
  }>({
    title: '',
    slug: '',
    category: 'Campus Life',
    summary: '',
    body: '',
    thumbnail_url: '',
    published_at: new Date().toISOString().split('T')[0],
    is_published: true,
  });

  const isViewer = userRole === 'viewer';

  const fetchArticles = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('school_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err: any) {
      console.error('[NewsManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load school articles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormState({
      title: '',
      slug: '',
      category: 'Campus Life',
      summary: '',
      body: '',
      thumbnail_url: '',
      published_at: new Date().toISOString().split('T')[0],
      is_published: true,
    });
    setIsCreating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const openEditModal = (article: SchoolArticleRow) => {
    setIsCreating(false);
    setEditingArticle(article);
    setFormState({
      title: article.title,
      slug: article.slug,
      category: article.category || '',
      summary: article.summary || '',
      body: article.body || '',
      thumbnail_url: article.thumbnail_url || '',
      published_at: article.published_at ? article.published_at.split('T')[0] : '',
      is_published: article.is_published,
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const closeFormModal = () => {
    setIsCreating(false);
    setEditingArticle(null);
  };

  // Helper to auto-generate slug
  const handleTitleChange = (val: string) => {
    const updated: any = { title: val };
    if (isCreating && !formState.slug) {
      updated.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    setFormState((prev) => ({ ...prev, ...updated }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    if (!formState.title.trim()) {
      setErrorMessage('Article title is required.');
      return;
    }

    const finalSlug = (formState.slug.trim() || formState.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      title: formState.title.trim(),
      slug: finalSlug,
      category: formState.category.trim() || null,
      summary: formState.summary.trim() || null,
      body: formState.body.trim() || null,
      thumbnail_url: formState.thumbnail_url.trim() || null,
      published_at: formState.published_at ? new Date(formState.published_at).toISOString() : null,
      is_published: formState.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from('school_articles')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setArticles((prev) => [data, ...prev]);
        setSuccessMessage('Created news article successfully.');
      } else if (editingArticle) {
        const { data, error } = await supabase
          .from('school_articles')
          .update(payload)
          .eq('id', editingArticle.id)
          .select()
          .single();

        if (error) throw error;
        setArticles((prev) => prev.map((a) => (a.id === editingArticle.id ? data : a)));
        setSuccessMessage('Updated news article successfully.');
      }

      closeFormModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[NewsManager Save Error]:', err);
      setErrorMessage(err.message || 'Failed to save news article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (article: SchoolArticleRow) => {
    if (isViewer) return;
    const newStatus = !article.is_published;

    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, is_published: newStatus } : a))
    );

    try {
      const { error } = await supabase
        .from('school_articles')
        .update({
          is_published: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', article.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('[NewsManager Toggle Error]:', err);
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, is_published: !newStatus } : a))
      );
      setErrorMessage('Failed to update article status: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate || isViewer) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('school_articles')
        .delete()
        .eq('id', deleteCandidate.id);

      if (error) throw error;

      setArticles((prev) => prev.filter((a) => a.id !== deleteCandidate.id));
      setSuccessMessage(`Deleted article "${deleteCandidate.title}".`);
      setDeleteCandidate(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[NewsManager Delete Error]:', err);
      setErrorMessage(err.message || 'Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      (a.category && a.category.toLowerCase().includes(q)) ||
      (a.summary && a.summary.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#354024]" />
            <span>School News & Editorial Articles</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish institutional news, campus achievements, press releases, and editorial articles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {articles.length} Articles Published
          </span>
          {!isViewer && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#354024] hover:bg-[#28311a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Article</span>
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
          placeholder="Filter articles by title, category, or summary..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-[#354024] outline-hidden shadow-xs"
        />
      </div>

      {/* Articles List */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading articles...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Newspaper className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No articles found</h4>
          <p className="text-xs text-slate-500 mt-1">No articles match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex gap-4">
                  {article.thumbnail_url && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={article.thumbnail_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {article.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {article.category}
                        </span>
                      )}
                      {article.published_at && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(article.published_at).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm mt-1.5 line-clamp-2">
                      {article.title}
                    </h3>

                    {article.summary && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {article.summary}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  slug: /{article.slug}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={isViewer}
                    onClick={() => handleTogglePublish(article)}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                      article.is_published
                        ? 'text-emerald-700 hover:bg-emerald-50'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={article.is_published ? 'Published' : 'Draft'}
                  >
                    {article.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {!isViewer && (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditModal(article)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(article)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Article"
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
      {(isCreating || editingArticle) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#354024]" />
                <span>{isCreating ? 'Publish New Article' : `Edit: ${editingArticle?.title}`}</span>
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
              <CmsFormField label="Article Headline" required>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Annual Sports Meet 2025 Celebrated with Grand Splendor"
                  className="w-full p-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                />
              </CmsFormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CmsFormField label="URL Slug" helpText="Lowercase hyphenated URL identifier">
                  <input
                    type="text"
                    value={formState.slug}
                    onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                    placeholder="annual-sports-meet-2025"
                    className="w-full p-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Category / Topic">
                  <input
                    type="text"
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    placeholder="e.g. Sports, Academics, Cultural"
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>

                <CmsFormField label="Publication Date">
                  <input
                    type="date"
                    value={formState.published_at}
                    onChange={(e) => setFormState({ ...formState, published_at: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                  />
                </CmsFormField>
              </div>

              <CmsFormField label="Executive Summary / Lead Paragraph">
                <textarea
                  rows={2}
                  value={formState.summary}
                  onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
                  placeholder="One or two sentences summarizing the news article..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none"
                />
              </CmsFormField>

              <CmsFormField label="Full Article Body / Content">
                <textarea
                  rows={6}
                  value={formState.body}
                  onChange={(e) => setFormState({ ...formState, body: e.target.value })}
                  placeholder="Detailed article body, quotes, commentary..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden font-mono"
                />
              </CmsFormField>

              <CmsImagePicker
                label="Thumbnail / Cover Photo"
                value={formState.thumbnail_url}
                onChange={(url) => setFormState({ ...formState, thumbnail_url: url })}
                bucket="news-thumbnails"
                disabled={isSaving}
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="article_published"
                  checked={formState.is_published}
                  onChange={(e) => setFormState({ ...formState, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                />
                <label htmlFor="article_published" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  Article is Published & Visible to the Public
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
                  <span>{isCreating ? 'Publish Article' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CmsConfirmDialog
        isOpen={!!deleteCandidate}
        title="Delete News Article"
        message={`Are you sure you want to permanently delete "${deleteCandidate?.title}"?`}
        confirmLabel="Delete Article"
        onConfirm={handleDelete}
        onCancel={() => setDeleteCandidate(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
