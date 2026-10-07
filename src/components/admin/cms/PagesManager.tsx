import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { CmsPageRow } from '../../../types/cms';
import { PageEditor } from './PageEditor';

interface PagesManagerProps {
  userRole: AdminRole;
}

export const PagesManager: React.FC<PagesManagerProps> = ({ userRole }) => {
  const [pages, setPages] = useState<CmsPageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<CmsPageRow | null>(null);
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
      console.error('[PagesManager Fetch Error]:', err);
      setErrorMessage(err.message || 'Failed to load CMS pages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleTogglePublish = async (page: CmsPageRow) => {
    if (isViewer) return;
    const newStatus = !page.is_published;

    // Optimistic UI update
    setPages((prev) =>
      prev.map((p) => (p.id === page.id ? { ...p, is_published: newStatus } : p))
    );

    try {
      const { error } = await supabase
        .from('cms_pages')
        .update({
          is_published: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', page.id);

      if (error) throw error;

      setSuccessMessage(`Page "${page.title}" ${newStatus ? 'published' : 'unpublished'}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[PagesManager Toggle Error]:', err);
      // Revert on error
      setPages((prev) =>
        prev.map((p) => (p.id === page.id ? { ...p, is_published: !newStatus } : p))
      );
      setErrorMessage(err.message || 'Failed to update page status');
    }
  };

  const handlePageUpdated = (updatedPage: CmsPageRow) => {
    setPages((prev) =>
      prev.map((p) => (p.id === updatedPage.id ? updatedPage : p))
    );
    if (selectedPage?.id === updatedPage.id) {
      setSelectedPage(updatedPage);
    }
  };

  // If a page is selected for editing, show the PageEditor drill-down
  if (selectedPage) {
    return (
      <PageEditor
        page={selectedPage}
        onBack={() => setSelectedPage(null)}
        onPageUpdated={handlePageUpdated}
        userRole={userRole}
      />
    );
  }

  // Filter pages by query
  const filteredPages = pages.filter((page) => {
    const q = searchQuery.toLowerCase();
    return (
      page.title.toLowerCase().includes(q) ||
      page.slug.toLowerCase().includes(q) ||
      (page.meta_description && page.meta_description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and overview */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#354024]" />
            <span>Website Pages & Content Sections</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage page metadata, SEO titles, descriptions, and customize content blocks across all 13 core pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl">
            {pages.length} Pages Configured
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter pages by title or slug (e.g. 'admissions', 'about', 'facilities')..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-[#354024] outline-hidden shadow-xs"
        />
      </div>

      {/* Pages Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading pages...</p>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No pages found</h4>
          <p className="text-xs text-slate-500 mt-1">No pages match your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Page Title & Slug</th>
                  <th className="py-3 px-4">SEO Meta Description</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{page.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[11px] text-[#354024] bg-[#354024]/10 px-2 py-0.5 rounded-md">
                          /{page.slug === 'home' ? '' : page.slug}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-md">
                      <p className="line-clamp-2 text-xs">
                        {page.meta_description || <span className="italic text-slate-400">No description set</span>}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        disabled={isViewer}
                        onClick={() => handleTogglePublish(page)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          page.is_published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title={page.is_published ? 'Page is published' : 'Page is draft'}
                      >
                        {page.is_published ? (
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPage(page)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#354024] hover:bg-[#28311a] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Content & Sections</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
