import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { CmsPageRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';

interface SeoManagerProps {
  userRole: AdminRole;
}

export const SeoManager: React.FC<SeoManagerProps> = ({ userRole }) => {
  const [pages, setPages] = useState<CmsPageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    title: string;
    meta_title: string;
    meta_description: string;
    is_published: boolean;
  }>({
    title: '',
    meta_title: '',
    meta_description: '',
    is_published: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isViewer = userRole === 'viewer';

  const fetchPages = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (err: any) {
      console.error('[SeoManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load SEO pages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const startEdit = (page: CmsPageRow) => {
    setEditingPageId(page.id);
    setFormState({
      title: page.title,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      is_published: page.is_published,
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const cancelEdit = () => {
    setEditingPageId(null);
  };

  const handleSave = async (pageId: string) => {
    if (isViewer) return;

    setIsSaving(true);
    setErrorMessage(null);

    const payload = {
      title: formState.title.trim(),
      meta_title: formState.meta_title.trim() || null,
      meta_description: formState.meta_description.trim() || null,
      is_published: formState.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .update(payload)
        .eq('id', pageId)
        .select()
        .single();

      if (error) throw error;

      setPages((prev) => prev.map((p) => (p.id === pageId ? data : p)));
      setSuccessMessage(`SEO configuration for "${data.title}" updated.`);
      setEditingPageId(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[SeoManager Save Error]:', err);
      setErrorMessage(err.message || 'Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPages = pages.filter((page) => {
    const q = searchQuery.toLowerCase();
    return (
      page.title.toLowerCase().includes(q) ||
      page.slug.toLowerCase().includes(q) ||
      (page.meta_title && page.meta_title.toLowerCase().includes(q)) ||
      (page.meta_description && page.meta_description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#354024]" />
            <span>Search Engine Optimization (SEO) & Metadata</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure Google SERP snippet previews, page titles, and meta descriptions across all 13 core pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {pages.length} Pages Indexed
          </span>
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
          placeholder="Search pages by title, slug, or meta keywords..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-[#354024] outline-hidden shadow-xs"
        />
      </div>

      {/* List / Cards of SEO items */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading page SEO configurations...</p>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No pages found</h4>
          <p className="text-xs text-slate-500 mt-1">No pages match your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPages.map((page) => {
            const isEditing = editingPageId === page.id;
            const routePath = page.slug === 'home' ? '/' : `/${page.slug}`;
            const displayTitle = isEditing
              ? formState.meta_title || formState.title
              : page.meta_title || page.title;
            const displayDesc = isEditing
              ? formState.meta_description
              : page.meta_description;

            return (
              <div
                key={page.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                            {page.title}
                          </h3>
                          <span className="font-mono text-xs text-[#354024] bg-[#354024]/10 px-2 py-0.5 rounded-md">
                            {routePath}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            page.is_published
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {page.is_published ? 'Published' : 'Draft'}
                        </span>
                        {!isViewer && (
                          <button
                            type="button"
                            onClick={() => startEdit(page)}
                            className="px-3 py-1.5 bg-[#354024]/10 hover:bg-[#354024]/15 text-[#354024] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Edit SEO
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Google SERP Snippet Preview */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] text-slate-500 font-mono mb-1 truncate">
                        https://amaahighschool.edu.in{routePath}
                      </div>
                      <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                        {displayTitle} | A.M.A. Adinarayana High School
                      </div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {displayDesc || (
                          <span className="italic text-slate-400">
                            No meta description configured. Search engines will generate snippets automatically.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">
                          Editing SEO: {page.title}
                        </span>
                        <span className="font-mono text-xs text-[#354024] bg-[#354024]/10 px-2 py-0.5 rounded-md">
                          {routePath}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CmsFormField
                        label="Meta Title Tag"
                        helpText={`Recommended: 50-60 characters (${formState.meta_title.length} characters)`}
                      >
                        <input
                          type="text"
                          value={formState.meta_title}
                          onChange={(e) => setFormState({ ...formState, meta_title: e.target.value })}
                          placeholder="Page Title | School Brand"
                          className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                        />
                      </CmsFormField>

                      <CmsFormField label="Page Title (Internal)">
                        <input
                          type="text"
                          value={formState.title}
                          onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                          className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
                        />
                      </CmsFormField>
                    </div>

                    <CmsFormField
                      label="Meta Description Tag"
                      helpText={`Recommended: 150-160 characters (${formState.meta_description.length} characters)`}
                    >
                      <textarea
                        rows={3}
                        value={formState.meta_description}
                        onChange={(e) => setFormState({ ...formState, meta_description: e.target.value })}
                        placeholder="Concise overview summarizing this page for search results..."
                        className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none"
                      />
                    </CmsFormField>

                    {/* Live SERP Preview */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Live Search Result Preview
                      </span>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        https://amaahighschool.edu.in{routePath}
                      </div>
                      <div className="text-sm font-semibold text-blue-700 truncate">
                        {formState.meta_title || formState.title} | A.M.A. Adinarayana High School
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {formState.meta_description || 'Search snippet placeholder...'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formState.is_published}
                          onChange={(e) => setFormState({ ...formState, is_published: e.target.checked })}
                          className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                        />
                        <span className="text-xs font-medium text-slate-700">
                          Allow Search Indexing & Public Access
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={isSaving}
                          className="px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSave(page.id)}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#354024] hover:bg-[#28311a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          <span>Save SEO</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
