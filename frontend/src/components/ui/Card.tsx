import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  border?: boolean;
  glow?: boolean;
  as?: React.ElementType;
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8 md:p-10',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  border = true,
  glow = false,
  as: Tag = 'div',
  onClick,
}) => {
  const base = 'bg-white rounded-2xl transition-all duration-200';
  const borderClass = border ? 'border border-[#e5e1ea]' : '';
  const glowClass = glow
    ? 'shadow-[0_8px_30px_-8px_rgba(107,56,212,0.14)]'
    : 'shadow-[0_2px_8px_-2px_rgba(10,10,15,0.06)]';
  const hoverClass = hover
    ? 'hover:border-[#cbc3d7] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(107,56,212,0.12)] cursor-pointer'
    : '';

  return (
    <Tag
      className={`${base} ${borderClass} ${glowClass} ${hoverClass} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};
