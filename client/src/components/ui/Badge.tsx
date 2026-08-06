import React from 'react';

// ============================================================
// Badge — Status/achievement pill badge
// ============================================================

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  success: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  info: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
  neutral: 'bg-surface-100 text-surface-600 dark:bg-dark-surface dark:text-surface-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ variant = 'neutral', children, size = 'sm', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
