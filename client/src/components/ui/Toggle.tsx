import React from 'react';
import { motion } from 'framer-motion';

// ============================================================
// Toggle — Animated ON/OFF switch
// ============================================================

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className={`flex items-center justify-between gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      {label && <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg
          ${checked ? 'bg-primary-500' : 'bg-surface-300 dark:bg-dark-border'}
        `}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            inline-block h-4 w-4 rounded-full bg-white shadow-sm
            ${checked ? 'ml-6' : 'ml-1'}
          `}
        />
      </button>
    </label>
  );
}
