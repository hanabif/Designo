import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  pill = true,
  iconLeft,
  iconRight,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#8b5cf6]/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-semibold',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[#6b38d4] text-white hover:bg-[#582bb8] shadow-[0_4px_14px_rgba(107,56,212,0.3)] hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-[#ede9fe] text-[#6b38d4] hover:bg-[#ddd6fe] hover:text-[#582bb8] shadow-xs hover:-translate-y-0.5',
    dark:
      'bg-[#0a0a0f] text-white hover:bg-[#1f1f29] shadow-[0_6px_20px_-4px_rgba(10,10,15,0.3)] hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'bg-white text-[#0a0a0f] border border-[#e5e1ea] hover:bg-[#f4f1fb] hover:border-[#cbc3d7] shadow-xs hover:-translate-y-0.5',
    ghost:
      'bg-transparent text-[#5e5e6e] hover:text-[#0a0a0f] hover:bg-[#f4f1fb]',
    danger:
      'bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-xs hover:-translate-y-0.5',
  };

  const radiusClass = pill ? 'rounded-full' : 'rounded-xl';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${radiusClass} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        iconLeft
      )}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
};
