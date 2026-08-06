import React from 'react';

// ============================================================
// Select — Styled dropdown select
// ============================================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function Select({ label, options, value, onChange, error, className = '' }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`
          w-full bg-surface-50 dark:bg-dark-surface border border-surface-200 dark:border-dark-border
          rounded-input px-4 py-2.5 text-sm text-surface-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200 shadow-input appearance-none cursor-pointer
          ${error ? 'border-red-400' : ''} ${className}
        `}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
