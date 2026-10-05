import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'mono';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-[#ede9fe] text-[#6b38d4] border-[#8b5cf6]/20',
  success: 'bg-[#ecfdf5] text-[#059669] border-[#10b981]/20',
  warning: 'bg-[#fffbeb] text-[#b45309] border-[#f59e0b]/20',
  danger: 'bg-[#fef2f2] text-[#dc2626] border-[#ef4444]/20',
  neutral: 'bg-[#f4f1fb] text-[#5e5e6e] border-[#e5e1ea]',
  mono: 'bg-[#0a0a0f] text-white border-transparent',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '', icon }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider border ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
};
