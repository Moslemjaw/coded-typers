import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../../types/player';
import { AVATAR_PRESETS } from '../../types/player';

// ============================================================
// PlayerCard — Player display in the lobby
// ============================================================

interface PlayerCardProps {
  player: Player;
  isCurrentUser?: boolean;
}

export function PlayerCard({ player, isCurrentUser = false }: PlayerCardProps) {
  const preset = AVATAR_PRESETS.find(a => a.id === player.avatar);
  const emoji = preset?.emoji || '🚀';
  const bgColor = preset?.bgColor || '#EEF2FF';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
      className={`
        flex items-center gap-3 p-3 rounded-2xl border transition-colors
        ${isCurrentUser
          ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800'
          : 'bg-white dark:bg-dark-card border-surface-100 dark:border-dark-border'
        }
      `}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        {emoji}
      </div>

      {/* Name + host badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-surface-900 dark:text-white truncate">
            {player.displayName}
          </span>
          {player.isHost && (
            <span className="text-xs">👑</span>
          )}
        </div>
      </div>

      {/* Connected status dot */}
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${player.isConnected ? 'bg-green-500' : 'bg-surface-300'}`} />
    </motion.div>
  );
}
