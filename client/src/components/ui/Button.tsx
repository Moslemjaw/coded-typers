import React from 'react';
import { motion } from 'framer-motion';

// ============================================================
// Button — Reusable button with variants and animations
// ============================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-btn hover:shadow-btn-hover',
  secondary: 'bg-surface-100 dark:bg-dark-surface hover:bg-surface-200 dark:hover:bg-dark-hover text-surface-800 dark:text-white border border-surface-200 dark:border-dark-border',
  ghost: 'bg-transparent hover:bg-surface-100 dark:hover:bg-dark-surface text-surface-600 dark:text-surface-400',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-btn
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}
      `}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </motion.button>
  );
}
