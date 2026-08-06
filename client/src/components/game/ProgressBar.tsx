import React from 'react';
import { motion } from 'framer-motion';
import { AVATAR_PRESETS } from '../../types/player';

// ============================================================
// ProgressBar — Player progress during typing round
// ============================================================

interface ProgressBarProps {
  playerName: string;
  avatar: string;
  progress: number;
  wpm: number;
  accuracy: number;
  isFinished: boolean;
}

export function ProgressBar({ playerName, avatar, progress, wpm, accuracy, isFinished }: ProgressBarProps) {
  const preset = AVATAR_PRESETS.find(a => a.id === avatar);
  const emoji = preset?.emoji || '🚀';

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-surface-100 dark:bg-dark-surface flex items-center justify-center text-sm flex-shrink-0">
        {emoji}
      </div>

      {/* Name + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate">
            {playerName}
          </span>
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span>{wpm} WPM</span>
            <span>{accuracy}%</span>
          </div>
        </div>
        <div className="h-2.5 bg-surface-100 dark:bg-dark-surface rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isFinished ? 'bg-green-500' : 'bg-gradient-to-r from-primary-400 to-primary-600'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Status */}
      {isFinished && (
        <span className="text-green-500 text-sm flex-shrink-0">✓</span>
      )}
    </div>
  );
}
