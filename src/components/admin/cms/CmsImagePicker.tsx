import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Link2, ExternalLink } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface CmsImagePickerProps {
  label?: string;
  value: string | null;
  onChange: (url: string) => void;
  bucket?: string;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  className?: string;
}

export const CmsImagePicker: React.FC<CmsImagePickerProps> = ({
  label = 'Image Asset',
  value,
  onChange,
  bucket = 'school-gallery',
  disabled = false,
  helpText,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 10MB check
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10MB maximum limit');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanBase = file.name.substring(0, file.name.lastIndexOf('.')).replace(/[^a-zA-Z0-9_-]/g, '_') || 'asset';
      const filePath = `${Date.now()}_${cleanBase}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadErr) {
        throw uploadErr;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const generatedUrl = publicUrlData.publicUrl;
      setUrlInput(generatedUrl);
      onChange(generatedUrl);
    } catch (err: any) {
      console.error('[CmsImagePicker Upload Error]:', err);
      setUploadError(err.message || 'Failed to upload image to Supabase storage');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    setUrlInput('');
    onChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
              mode === 'url' ? 'bg-[#354024]/10 text-[#354024] font-bold' : 'hover:bg-slate-100'
            }`}
          >
            URL
          </button>
          <span>•</span>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
              mode === 'upload' ? 'bg-[#354024]/10 text-[#354024] font-bold' : 'hover:bg-slate-100'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Mode 1: URL Input */}
      {mode === 'url' ? (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              disabled={disabled}
              placeholder="/gallery/jai00311.webp or https://..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                onChange(e.target.value);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#354024] focus:ring-1 focus:ring-[#354024] outline-hidden disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          {value && (
            <button
              type="button"
              disabled={disabled}
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Clear Image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Mode 2: Storage Upload */
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={disabled || isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-3 border border-slate-300 rounded-xl transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#354024]" />
                  <span>Uploading to '{bucket}'...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Select Local Image File</span>
                </>
              )}
            </button>
            {value && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleClear}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Clear Image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          {uploadError}
        </p>
      )}

      {/* Live Preview Card */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300 relative group">
            <img
              src={value}
              alt="Asset Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono text-slate-700 truncate" title={value}>
              {value}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#354024] hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {helpText && !uploadError && (
        <p className="text-[11px] text-slate-500">{helpText}</p>
      )}
    </div>
  );
};
