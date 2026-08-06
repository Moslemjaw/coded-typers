import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { useGameContext } from '../contexts/GameContext';
import { AVATAR_PRESETS } from '../types/player';

// ============================================================
// Leaderboard — Round results with animated rankings & SaaS styling
// ============================================================

export default function Leaderboard() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { game, leaderboard, isHost, nextRound, currentRound, status } = useGameContext();

  // Auto-navigate when status updates
  useEffect(() => {
    if (status === 'playing') {
      navigate(`/game/${pin}`);
    }
    if (status === 'finished') {
      navigate(`/results/${pin}`);
    }
  }, [status, pin, navigate]);

  const roundNum = currentRound?.roundNumber || game?.currentRound || 1;
  const totalRounds = game?.settings?.rounds || game?.totalRounds || 1;
  const progressPercent = Math.min(Math.round((roundNum / totalRounds) * 100), 100);

  const top3 = leaderboard.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header & Round Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-[20px] p-6 border border-surface-200/80 dark:border-dark-border shadow-card mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-[#3563E9] dark:text-primary-400 font-semibold text-xs mb-2">
                <span>⚡</span>
                <span>Round {roundNum} of {totalRounds} Complete</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                Round {roundNum} Leaderboard
              </h1>
              <p className="text-sm text-surface-500 mt-1">
                {roundNum < totalRounds
                  ? `${totalRounds - roundNum} ${totalRounds - roundNum === 1 ? 'round' : 'rounds'} remaining until final results!`
                  : 'All rounds complete! Prepare for final standings.'}
              </p>
            </div>

            {/* Round Progress Visual Ring / Bar */}
            <div className="w-full sm:w-56 bg-surface-50 dark:bg-dark-surface p-3.5 rounded-2xl border border-surface-200/60 dark:border-dark-border">
              <div className="flex justify-between items-center text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1.5">
                <span>Tournament Progress</span>
                <span className="text-[#3563E9] font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2.5 bg-surface-200 dark:bg-dark-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3563E9] to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-surface-400 font-medium">
                {Array.from({ length: totalRounds }, (_, i) => (
                  <span
                    key={i}
                    className={i + 1 <= roundNum ? 'text-[#3563E9] font-bold' : 'text-surface-300'}
                  >
                    R{i + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Top 3 Spotlights */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-surface-100 dark:border-dark-border">
              {top3.map((entry, idx) => {
                const preset = AVATAR_PRESETS.find(a => a.id === entry.avatar);
                return (
                  <motion.div
                    key={entry.playerId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border ${
                      idx === 0
                        ? 'bg-amber-50/50 border-amber-200/80 dark:bg-amber-900/10'
                        : idx === 1
                        ? 'bg-slate-50/80 border-slate-200/80 dark:bg-slate-800/20'
                        : 'bg-orange-50/50 border-orange-200/80 dark:bg-amber-950/10'
                    }`}
                  >
                    <span className="text-2xl filter drop-shadow-sm">{medals[idx]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{preset?.emoji || '🚀'}</span>
                        <p className="font-semibold text-xs text-surface-900 dark:text-white truncate">
                          {entry.playerName}
                        </p>
                      </div>
                      <p className="text-xs font-mono font-bold text-[#3563E9] dark:text-primary-400 mt-0.5">
                        {entry.totalScore.toLocaleString()} pts
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Animated Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8"
        >
          <LeaderboardTable entries={leaderboard} />
        </motion.div>

        {/* Bottom Action Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          {isHost ? (
            <button
              onClick={nextRound}
              className="bg-[#3563E9] hover:bg-[#2B50C7] text-white font-semibold px-8 py-3.5 rounded-xl shadow-btn hover:shadow-btn-hover transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-base"
            >
              <span>{roundNum < totalRounds ? 'Next Round' : 'View Final Results'}</span>
              <span className="text-lg">→</span>
            </button>
          ) : (
            <div className="bg-white dark:bg-dark-card border border-surface-200/80 dark:border-dark-border px-6 py-3.5 rounded-full shadow-sm flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#3563E9] rounded-full animate-ping" />
              <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                Waiting for host to continue...
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
