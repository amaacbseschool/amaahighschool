import React from 'react';
import { checkPrefersReducedMotion } from '../../lib/motion';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverElevation?: boolean;
  variant?: 'glass' | 'glass-dark' | 'glass-gold' | 'matte' | 'default';
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  onClick,
  hoverElevation = true,
  variant = 'matte',
}) => {
  const isReduced = checkPrefersReducedMotion();

  const variantStyles = {
    matte:
      'bg-white border border-slate-200/80 shadow-card hover:border-[#44105c]',
    glass:
      'bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-card hover:border-[#44105c]',
    'glass-dark':
      'bg-gradient-to-br from-[#1e0e2e] to-[#44105c] text-white border border-white/10 shadow-card hover:border-[#e40046]',
    'glass-gold':
      'bg-white border border-[#44105c]/30 shadow-card hover:border-[#e40046]',
    default:
      'bg-white border border-slate-200/80 shadow-card hover:border-[#44105c]',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden transition-all duration-300 rounded-3xl ${
        variantStyles[variant]
      } ${hoverElevation && !isReduced ? 'hover:-translate-y-1 hover:shadow-xl' : ''} ${className}`}
    >
      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
};
