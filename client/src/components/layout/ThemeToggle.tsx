import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../contexts/ThemeContext';

// ============================================================
// ThemeToggle — Premium glassmorphic Sun/Moon toggle with SVG
// ============================================================

export function ThemeToggle() {
  const { isDark, toggle } = useContext(ThemeContext);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      className={`
        relative flex items-center justify-center w-10 h-10 rounded-xl
        bg-surface-100/90 dark:bg-dark-surface/90
        hover:bg-surface-200 dark:hover:bg-dark-hover
        border border-surface-200/80 dark:border-dark-border
        shadow-sm hover:shadow-md
        transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[#3563E9]/40
      `}
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -60, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 60, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center justify-center text-amber-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" fillOpacity="0.2" />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 60, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -60, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center justify-center text-amber-500"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.25" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
