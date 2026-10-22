import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span aria-hidden="true" className={`block animate-pulse rounded-md bg-[#e9e5ef] ${className}`} />
);
