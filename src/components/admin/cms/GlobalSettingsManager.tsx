import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  Phone,
  Share2,
  Layout,
  Info
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { AdminRole } from '../../../pages/AdminDashboardPage';
import type { SiteSettingRow } from '../../../types/cms';
import { CmsFormField } from './CmsFormField';
import { CmsImagePicker } from './CmsImagePicker';

interface GlobalSettingsManagerProps {
  userRole: AdminRole;
}

interface SettingCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  keys: string[];
}

const SETTING_CATEGORIES: SettingCategory[] = [
  {
    id: 'identity',
    name: 'School Identity & Heritage',
    icon: Building,
    description: 'Core institutional name, official crest, established year, motto and diamond jubilee branding',
    keys: [
      'site_name',
      'site_short_name',
      'site_brand_subtitle',
      'site_motto',
      'site_established_year',
      'site_diamond_jubilee_text',
      'site_logo'
    ]
  },
  {
    id: 'contact',
    name: 'Campus Contact & Location',
    icon: Phone,
    description: 'Physical campus address in Patna, main desk & admissions helpline numbers, email addresses and timings',
    keys: [
      'site_address',
      'site_phone',
      'site_phone_secondary',
      'site_email',
      'site_email_admissions',
      'site_hours',
      'site_board_recognition'
    ]
  },
  {
    id: 'social',
    name: 'Social Media Channels',
    icon: Share2,
    description: 'Official verified links to school social media profiles and video streaming channels',
    keys: [
      'site_facebook',
      'site_instagram',
      'site_youtube',
      'site_linkedin'
    ]
  },
  {
    id: 'header',
    name: 'Header & Topbar Elements',
    icon: Layout,
    description: 'Top navigation bar labels, action badges, and primary application button call-to-action',
    keys: [
      'navbar_cta_text',
      'topbar_campus_desk_label',
      'topbar_admin_portal_label'
    ]
  },
  {
    id: 'footer',
    name: 'Footer & Attribution',
    icon: Info,
    description: 'Mission blurb, newsletter block copy, copyright notice, and developer attribution metadata',
    keys: [
      'footer_description',
      'footer_newsletter_title',
      'footer_newsletter_description',
      'footer_copyright',
      'footer_developer_name',
      'footer_developer_url',
      'footer_developer_logo'
    ]
  }
];

export const GlobalSettingsManager: React.FC<GlobalSettingsManagerProps> = ({ userRole }) => {
  const [settings, setSettings] = useState<Record<string, SiteSettingRow>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeCategory, setActiveCategory] = useState<string>('identity');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isViewer = userRole === 'viewer';

  const fetchSettings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const map: Record<string, SiteSettingRow> = {};
      const form: Record<string, any> = {};

      data?.forEach((row: SiteSettingRow) => {
        map[row.key] = row;
        form[row.key] = row.value;
      });

      setSettings(map);
      setFormData(form);
    } catch (err: any) {
      console.error('[GlobalSettingsManager Error]:', err);
      setErrorMessage(err.message || 'Failed to load site settings from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetCategory = () => {
    const currentCat = SETTING_CATEGORIES.find((c) => c.id === activeCategory);
    if (!currentCat) return;

    setFormData((prev) => {
      const updated = { ...prev };
      currentCat.keys.forEach((k) => {
        if (settings[k]) {
          updated[k] = settings[k].value;
        }
      });
      return updated;
    });
    setSuccessMessage('Category settings reset to last saved state.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveCategory = async () => {
    if (isViewer) return;

    const currentCat = SETTING_CATEGORIES.find((c) => c.id === activeCategory);
    if (!currentCat) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updates = currentCat.keys.map(async (key) => {
        const val = formData[key];

        const { error } = await supabase
          .from('site_settings')
          .update({
            value: val,
            updated_at: new Date().toISOString()
          })
          .eq('key', key);

        if (error) throw error;

        return { key, val };
      });

      await Promise.all(updates);

      // Update local state baseline
      setSettings((prev) => {
        const updated = { ...prev };
        currentCat.keys.forEach((k) => {
          if (updated[k]) {
            updated[k] = { ...updated[k], value: formData[k] };
          }
        });
        return updated;
      });

      setSuccessMessage(`Successfully saved ${currentCat.name} settings.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('[GlobalSettingsManager Save Error]:', err);
      setErrorMessage(err.message || 'Permission denied or error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#354024] animate-spin mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">Loading Global Site Settings...</h3>
        <p className="text-xs text-slate-500">Synchronizing 28 configuration keys from Supabase</p>
      </div>
    );
  }

  const currentCategory = SETTING_CATEGORIES.find((c) => c.id === activeCategory) || SETTING_CATEGORIES[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#354024]" />
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              Global Site Settings
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage 28 global parameters controlling branding, campus contact lines, top bar, and footer credits.
          </p>
        </div>

        {isViewer && (
          <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold">
            Viewer Mode (Read-Only)
          </div>
        )}
      </div>

      {/* Notification Alerts */}
      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        {SETTING_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSuccessMessage(null);
                setErrorMessage(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#354024] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#354024]' : 'text-slate-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <currentCategory.icon className="w-4 h-4 text-[#354024]" />
              <span>{currentCategory.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentCategory.description}</p>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {currentCategory.keys.length} Settings
          </span>
        </div>

        {/* Dynamic Fields for current category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentCategory.keys.map((key) => {
            const row = settings[key];
            const val = formData[key] ?? '';
            const desc = row?.description || '';

            // Render Image Picker for logo keys
            if (key === 'site_logo' || key === 'footer_developer_logo') {
              return (
                <div key={key} className="md:col-span-2">
                  <CmsImagePicker
                    label={`${row?.description || key} (${key})`}
                    value={val}
                    onChange={(newUrl) => handleChange(key, newUrl)}
                    bucket="school-gallery"
                    disabled={isViewer || isSaving}
                    helpText={`Database key: ${key}`}
                  />
                </div>
              );
            }

            // Render Textarea for long text
            if (key === 'footer_description' || key === 'footer_newsletter_description' || key === 'site_address') {
              return (
                <div key={key} className="md:col-span-2">
                  <CmsFormField label={desc || key} helpText={`Key: ${key}`}>
                    <textarea
                      rows={3}
                      disabled={isViewer || isSaving}
                      value={val}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-hidden disabled:bg-slate-50 disabled:text-slate-500 resize-none"
                    />
                  </CmsFormField>
                </div>
              );
            }

            // Standard Inputs
            const isEmail = key.includes('email');
            const isPhone = key.includes('phone');
            const isYear = key.includes('year');
            const isUrl = key.includes('url') || key.includes('facebook') || key.includes('instagram') || key.includes('youtube') || key.includes('linkedin');

            return (
              <div key={key} className={isUrl ? 'md:col-span-2' : ''}>
                <CmsFormField label={desc || key} helpText={`Key: ${key}`}>
                  <input
                    type={isEmail ? 'email' : isPhone ? 'tel' : isYear ? 'number' : isUrl ? 'url' : 'text'}
                    disabled={isViewer || isSaving}
                    value={val}
                    onChange={(e) => handleChange(key, isYear ? parseInt(e.target.value, 10) || e.target.value : e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-hidden disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </CmsFormField>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleResetCategory}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Category</span>
          </button>

          {!isViewer && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveCategory}
              className="inline-flex items-center gap-2 bg-[#354024] hover:bg-[#252d19] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-white" />
                  <span>Save {currentCategory.name}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
