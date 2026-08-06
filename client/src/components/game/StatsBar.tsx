import React from 'react';
import { motion } from 'framer-motion';

// ============================================================
// StatsBar — Live typing statistics display
// ============================================================

interface StatsBarProps {
  wpm: number;
  accuracy: number;
  mistakes: number;
  progress: number;
}

interface StatItem {
  key: string;
  label: string;
  icon: string;
  suffix?: string;
}

const statItems: StatItem[] = [
  { key: 'wpm', label: 'WPM', icon: '⚡' },
  { key: 'accuracy', label: 'Accuracy', icon: '🎯', suffix: '%' },
  { key: 'mistakes', label: 'Mistakes', icon: '✗' },
  { key: 'progress', label: 'Progress', icon: '📊', suffix: '%' },
];

export function StatsBar({ wpm, accuracy, mistakes, progress }: StatsBarProps) {
  const values: Record<string, number> = { wpm, accuracy, mistakes, progress };

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {statItems.map(({ key, label, icon, suffix }) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-3 sm:p-4 text-center border border-surface-100 dark:border-dark-border shadow-sm"
        >
          <div className="text-lg mb-1">{icon}</div>
          <div className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
            {Math.round(values[key])}{suffix || ''}
          </div>
          <div className="text-xs text-surface-500 mt-0.5">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}
