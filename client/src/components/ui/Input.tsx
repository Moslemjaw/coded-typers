import React from 'react';

// ============================================================
// Input — Styled text input with label and error state
// ============================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-surface-50 dark:bg-dark-surface border border-surface-200 dark:border-dark-border
            rounded-input px-4 py-2.5 text-sm text-surface-900 dark:text-white
            placeholder:text-surface-400 dark:placeholder:text-surface-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200 shadow-input
            ${icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:ring-red-500' : ''} ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
