import React from 'react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from '../../types/game';
import { AVATAR_PRESETS } from '../../types/player';
import { formatScore } from '../../utils/scoring';

// ============================================================
// LeaderboardTable — Animated ranking table with rank indicators
// ============================================================

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  showRoundScores?: boolean;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function LeaderboardTable({ entries, showRoundScores = false }: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-surface-200/80 dark:border-dark-border bg-white dark:bg-dark-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-50/80 dark:bg-dark-surface border-b border-surface-200/70 dark:border-dark-border text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Rank</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider">Player</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">Score</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right hidden sm:table-cell">WPM</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right hidden sm:table-cell">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-dark-border/60">
            {entries.map((entry, index) => {
              const preset = AVATAR_PRESETS.find(a => a.id === entry.avatar);
              const emoji = preset?.emoji || '🚀';
              const isTop3 = index < 3;
              const isEven = index % 2 === 0;

              // Alternating row styling with subtle highlight for top 3
              let rowBg = isEven ? 'bg-white dark:bg-dark-card' : 'bg-surface-50/50 dark:bg-dark-surface/30';
              if (index === 0) rowBg = 'bg-amber-50/40 dark:bg-amber-900/10 hover:bg-amber-50/70';
              else if (index === 1) rowBg = 'bg-slate-50/60 dark:bg-slate-800/10 hover:bg-slate-100/60';
              else if (index === 2) rowBg = 'bg-orange-50/40 dark:bg-amber-950/10 hover:bg-orange-50/70';

              return (
                <motion.tr
                  key={entry.playerId}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    layout: { type: 'spring', stiffness: 350, damping: 25 },
                    opacity: { duration: 0.2 },
                  }}
                  className={`${rowBg} hover:bg-primary-50/30 dark:hover:bg-dark-hover transition-colors duration-150`}
                >
                  {/* Rank Column */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {isTop3 ? (
                        <motion.span
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          className="text-xl filter drop-shadow-sm inline-block"
                        >
                          {MEDALS[index]}
                        </motion.span>
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-surface-100 dark:bg-dark-surface text-surface-600 dark:text-surface-400 font-semibold text-xs flex items-center justify-center">
                          {entry.rank}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Player Name & Avatar */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-surface-100 dark:bg-dark-surface flex items-center justify-center text-lg shadow-sm border border-surface-200/50">
                        {emoji}
                      </div>
                      <span className="font-semibold text-sm text-surface-900 dark:text-white">
                        {entry.playerName}
                      </span>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-5 py-4 whitespace-nowrap text-right font-bold text-base text-[#3563E9] dark:text-primary-400 font-mono">
                    {formatScore(entry.totalScore)}
                  </td>

                  {/* WPM */}
                  <td className="px-5 py-4 whitespace-nowrap text-right hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-dark-surface text-surface-700 dark:text-surface-300 font-mono">
                      {Math.round(entry.averageWpm)} WPM
                    </span>
                  </td>

                  {/* Accuracy */}
                  <td className="px-5 py-4 whitespace-nowrap text-right hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-mono">
                      {Math.round(entry.averageAccuracy)}%
                    </span>
                  </td>
                </motion.tr>
              );
            })}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-surface-400 text-sm">
                  No leaderboard entries available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
