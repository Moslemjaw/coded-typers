import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '../../types/player';
import { AVATAR_PRESETS } from '../../types/player';

// ============================================================
// PlayerCard — Player display in the lobby with Host Kick button
// ============================================================

interface PlayerCardProps {
  player: Player;
  isCurrentUser?: boolean;
  isHostView?: boolean;
  onKick?: (playerId: string) => void;
}

export function PlayerCard({
  player,
  isCurrentUser = false,
  isHostView = false,
  onKick,
}: PlayerCardProps) {
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
        group relative flex items-center gap-3 p-3 rounded-2xl border transition-colors
        ${isCurrentUser
          ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800'
          : 'bg-white dark:bg-dark-card border-surface-100 dark:border-dark-border hover:border-surface-200 dark:hover:border-dark-border'
        }
      `}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
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
            <span className="text-xs" title="Host">👑</span>
          )}
        </div>
      </div>

      {/* Connected status dot */}
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${player.isConnected ? 'bg-green-500' : 'bg-surface-300'}`} />

      {/* Kick Player button for Host */}
      {isHostView && !player.isHost && onKick && (
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onKick(player._id);
          }}
          className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-1 cursor-pointer"
          title={`Remove ${player.displayName}`}
          aria-label={`Remove ${player.displayName}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
}
