import React from 'react';

interface CmsFormFieldProps {
  label: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const CmsFormField: React.FC<CmsFormFieldProps> = ({
  label,
  helpText,
  error,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {helpText && !error && (
        <p className="text-[11px] text-slate-500 leading-normal">{helpText}</p>
      )}
      {error && (
        <p className="text-[11px] font-semibold text-rose-600 leading-normal">{error}</p>
      )}
    </div>
  );
};
