import React, { useState } from 'react';
import {
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { CmsSectionRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsImagePicker } from './CmsImagePicker';
import { SectionItemsEditor } from './SectionItemsEditor';

interface SectionEditorProps {
  section: CmsSectionRow;
  onUpdate: (updated: CmsSectionRow) => void;
  onCancel?: () => void;
  userRole: AdminRole;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdate,
  onCancel,
  userRole,
}) => {
  const [formData, setFormData] = useState<CmsSectionRow>({ ...section });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const isViewer = userRole === 'viewer';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      eyebrow: formData.eyebrow ? formData.eyebrow.trim() : null,
      heading: formData.heading ? formData.heading.trim() : null,
      subheading: formData.subheading ? formData.subheading.trim() : null,
      content_html: formData.content_html ? formData.content_html.trim() : null,
      cta_text: formData.cta_text ? formData.cta_text.trim() : null,
      cta_url: formData.cta_url ? formData.cta_url.trim() : null,
      secondary_cta_text: formData.secondary_cta_text ? formData.secondary_cta_text.trim() : null,
      secondary_cta_url: formData.secondary_cta_url ? formData.secondary_cta_url.trim() : null,
      badge: formData.badge ? formData.badge.trim() : null,
      image_url: formData.image_url ? formData.image_url.trim() : null,
      sort_order: Number(formData.sort_order),
      is_visible: formData.is_visible,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .update(payload)
        .eq('id', section.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      setFormData(data);
      setSuccessMessage('Section saved successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('[SectionEditor Update Error]:', err);
      setErrorMessage(err.message || 'Failed to save section changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (isViewer) return;
    const newVisibility = !formData.is_visible;
    setFormData((prev) => ({ ...prev, is_visible: newVisibility }));

    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .update({
          is_visible: newVisibility,
          updated_at: new Date().toISOString(),
        })
        .eq('id', section.id)
        .select()
        .single();

      if (error) throw error;
      onUpdate(data);
    } catch (err: any) {
      console.error('[SectionEditor Toggle Error]:', err);
      setFormData((prev) => ({ ...prev, is_visible: !newVisibility }));
      setErrorMessage('Failed to update visibility: ' + err.message);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden transition-all duration-200">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#354024]/10 text-[#354024] flex items-center justify-center font-bold text-sm shrink-0">
            {formData.sort_order}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">
                {formData.heading || formData.eyebrow || section.section_key}
              </span>
              <span className="text-[11px] font-mono bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-md">
                {section.section_key}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md">
                {section.section_type}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {formData.subheading || 'No subheading configured'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isViewer}
            onClick={handleToggleVisibility}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              formData.is_visible
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
            title={formData.is_visible ? 'Section is visible to visitors' : 'Section is hidden'}
          >
            {formData.is_visible ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span>Hidden</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Body */}
      {isExpanded && (
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-6">
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

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <CmsFormField label="Eyebrow / Small Header" helpText="Small uppercase tag above the main heading">
              <input
                type="text"
                value={formData.eyebrow || ''}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                disabled={isViewer || isSaving}
                placeholder="e.g. EXCELLENCE SINCE 1965"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden disabled:bg-slate-50"
              />
            </CmsFormField>

            <CmsFormField label="Badge / Pill Tag" helpText="Highlighted tag or ribbon text">
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                disabled={isViewer || isSaving}
                placeholder="e.g. CBSE Affiliated"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden disabled:bg-slate-50"
              />
            </CmsFormField>
          </div>

          <CmsFormField label="Main Heading" required>
            <input
              type="text"
              value={formData.heading || ''}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              disabled={isViewer || isSaving}
              placeholder="e.g. Inspiring Future Leaders"
              className="w-full p-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden disabled:bg-slate-50"
            />
          </CmsFormField>

          <CmsFormField label="Subheading / Summary">
            <textarea
              rows={2}
              value={formData.subheading || ''}
              onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
              disabled={isViewer || isSaving}
              placeholder="A brief overview or subtitle for this section..."
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none disabled:bg-slate-50"
            />
          </CmsFormField>

          <CmsFormField label="Body Content / HTML" helpText="Rich text or narrative paragraphs">
            <textarea
              rows={4}
              value={formData.content_html || ''}
              onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
              disabled={isViewer || isSaving}
              placeholder="Detailed body copy or HTML formatting..."
              className="w-full p-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden resize-none disabled:bg-slate-50"
            />
          </CmsFormField>

          {/* Section Image */}
          <CmsImagePicker
            label="Section Feature / Hero Image"
            value={formData.image_url || ''}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="school-gallery"
            disabled={isViewer || isSaving}
          />

          {/* Primary & Secondary Call to Actions */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#354024]" />
              <span>Call to Action Buttons</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsFormField label="Primary CTA Label">
                <input
                  type="text"
                  value={formData.cta_text || ''}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  disabled={isViewer || isSaving}
                  placeholder="e.g. Apply Now"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden bg-white"
                />
              </CmsFormField>

              <CmsFormField label="Primary CTA URL">
                <input
                  type="text"
                  value={formData.cta_url || ''}
                  onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                  disabled={isViewer || isSaving}
                  placeholder="e.g. /admissions"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden bg-white font-mono"
                />
              </CmsFormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsFormField label="Secondary CTA Label">
                <input
                  type="text"
                  value={formData.secondary_cta_text || ''}
                  onChange={(e) => setFormData({ ...formData, secondary_cta_text: e.target.value })}
                  disabled={isViewer || isSaving}
                  placeholder="e.g. Explore Curriculum"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden bg-white"
                />
              </CmsFormField>

              <CmsFormField label="Secondary CTA URL">
                <input
                  type="text"
                  value={formData.secondary_cta_url || ''}
                  onChange={(e) => setFormData({ ...formData, secondary_cta_url: e.target.value })}
                  disabled={isViewer || isSaving}
                  placeholder="e.g. /academics"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden bg-white font-mono"
                />
              </CmsFormField>
            </div>
          </div>

          {/* Ordering and Section Items Sub-Editor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsFormField label="Display Sort Order">
              <input
                type="number"
                min={0}
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })}
                disabled={isViewer || isSaving}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] outline-hidden"
              />
            </CmsFormField>
          </div>

          {/* Form Action Controls */}
          {!isViewer && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#354024] hover:bg-[#28311a] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Section</span>
              </button>
            </div>
          )}

          {/* Embedded Sub-Items Manager */}
          <SectionItemsEditor
            sectionId={section.id}
            sectionKey={section.section_key}
            userRole={userRole}
          />
        </form>
      )}
    </div>
  );
};
