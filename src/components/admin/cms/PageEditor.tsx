import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Globe,
  FileText,
  Lock,
  Unlock
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { CmsPageRow, CmsSectionRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { SectionEditor } from './SectionEditor';

interface PageEditorProps {
  page: CmsPageRow;
  onBack: () => void;
  onPageUpdated: (updatedPage: CmsPageRow) => void;
  userRole: AdminRole;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  page,
  onBack,
  onPageUpdated,
  userRole,
}) => {
  const [currentPage, setCurrentPage] = useState<CmsPageRow>({ ...page });
  const [sections, setSections] = useState<CmsSectionRow[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [slugUnlocked, setSlugUnlocked] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isViewer = userRole === 'viewer';

  // Fetch sections for this page
  const fetchSections = async () => {
    setIsLoadingSections(true);
    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (err: any) {
      console.error('[PageEditor Fetch Sections Error]:', err);
      setErrorMessage(err.message || 'Failed to load page sections');
    } finally {
      setIsLoadingSections(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [page.id]);

  // Handle saving page metadata
  const handleSavePageMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    setIsSavingPage(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      title: currentPage.title.trim(),
      slug: currentPage.slug.trim(),
      meta_title: currentPage.meta_title ? currentPage.meta_title.trim() : null,
      meta_description: currentPage.meta_description ? currentPage.meta_description.trim() : null,
      is_published: currentPage.is_published,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .update(payload)
        .eq('id', currentPage.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentPage(data);
      onPageUpdated(data);
      setSlugUnlocked(false);
      setSuccessMessage('Page settings saved successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[PageEditor Save Metadata Error]:', err);
      setErrorMessage(err.message || 'Failed to update page');
    } finally {
      setIsSavingPage(false);
    }
  };

  const handleSectionUpdated = (updatedSection: CmsSectionRow) => {
    setSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and back button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Return to Pages list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-slate-800">
                {currentPage.title}
              </h2>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  currentPage.is_published
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentPage.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Slug: /{currentPage.slug === 'home' ? '' : currentPage.slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {sections.length} Page {sections.length === 1 ? 'Section' : 'Sections'}
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

      {/* Page Metadata Settings Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#354024]" />
            <span>Page Details & SEO Configuration</span>
          </h3>
        </div>

        <form onSubmit={handleSavePageMetadata} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsFormField label="Page Title" required>
              <input
                type="text"
                value={currentPage.title}
                onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                disabled={isViewer || isSavingPage}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden disabled:bg-slate-50"
              />
            </CmsFormField>

            <CmsFormField
              label="URL Slug (Route Path)"
              helpText={slugUnlocked ? 'Warning: Altering slug modifies site routing!' : 'Click lock icon to edit'}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentPage.slug}
                  onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                  disabled={!slugUnlocked || isViewer || isSavingPage}
                  className="w-full p-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden disabled:bg-slate-100 disabled:text-slate-500"
                />
                {!isViewer && (
                  <button
                    type="button"
                    onClick={() => setSlugUnlocked(!slugUnlocked)}
                    className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                    title={slugUnlocked ? 'Lock Slug' : 'Unlock Slug (Caution)'}
                  >
                    {slugUnlocked ? <Unlock className="w-4 h-4 text-amber-600" /> : <Lock className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </CmsFormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsFormField
              label="Meta Title (SEO)"
              helpText="Search engine result title tag (50-60 characters recommended)"
            >
              <input
                type="text"
                value={currentPage.meta_title || ''}
                onChange={(e) => setCurrentPage({ ...currentPage, meta_title: e.target.value })}
                disabled={isViewer || isSavingPage}
                placeholder="Page Title | A.M.A. Adinarayana High School"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden disabled:bg-slate-50"
              />
            </CmsFormField>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPage.is_published}
                  onChange={(e) => setCurrentPage({ ...currentPage, is_published: e.target.checked })}
                  disabled={isViewer || isSavingPage}
                  className="w-4 h-4 rounded text-[#354024] focus:ring-[#354024] border-slate-300 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Page is Published & Publicly Accessible
                </span>
              </label>
            </div>
          </div>

          <CmsFormField
            label="Meta Description (SEO)"
            helpText={`Search snippet summary (${(currentPage.meta_description || '').length}/160 recommended)`}
          >
            <textarea
              rows={2}
              value={currentPage.meta_description || ''}
              onChange={(e) => setCurrentPage({ ...currentPage, meta_description: e.target.value })}
              disabled={isViewer || isSavingPage}
              placeholder="A comprehensive description of this page for search results..."
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none disabled:bg-slate-50"
            />
          </CmsFormField>

          {!isViewer && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingPage}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#354024] hover:bg-[#28311a] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSavingPage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Page Settings</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Page Sections List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#354024]" />
            <span>Page Sections ({sections.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Customize content blocks, headings, copy, and buttons
          </p>
        </div>

        {isLoadingSections ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin text-[#354024] mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading page sections...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No sections found for this page</h4>
            <p className="text-xs text-slate-500 mt-1">This page currently has no configured section records.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {sections.map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                onUpdate={handleSectionUpdated}
                userRole={userRole}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
