import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { ProgressBar } from '../components/game/ProgressBar';
import { Timer } from '../components/game/Timer';
import { useGameContext } from '../contexts/GameContext';
import { useTimer } from '../hooks/useTimer';

// ============================================================
// Host Dashboard — Live spectator progress monitoring
// ============================================================

export default function HostDashboard() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { game, players, playerProgress, currentRound, status } = useGameContext();

  const duration = currentRound?.timeLimit || game?.settings?.typingTime || 60;
  const { timeRemaining } = useTimer({ duration, autoStart: true });

  // Auto-navigate to leaderboard or final results
  useEffect(() => {
    if (status === 'round-end') {
      navigate(`/leaderboard/${pin}`);
    }
    if (status === 'finished') {
      navigate(`/results/${pin}`);
    }
  }, [status, pin, navigate]);

  // Joined players excluding host
  const competitorPlayers = players.filter(p => !p.isHost);

  // Calculate averages from live progress
  const progressEntries = Array.from(playerProgress.values());
  const avgWpm = progressEntries.length > 0
    ? Math.round(progressEntries.reduce((sum, p) => sum + p.wpm, 0) / progressEntries.length)
    : 0;
  const avgAccuracy = progressEntries.length > 0
    ? Math.round(progressEntries.reduce((sum, p) => sum + p.accuracy, 0) / progressEntries.length)
    : 0;
  const connectedCount = competitorPlayers.filter(p => p.isConnected).length;
  const finishedCount = progressEntries.filter(p => p.isFinished).length;

  const currentRoundNum = currentRound?.roundNumber || 1;
  const totalRoundsNum = game?.settings?.rounds || 1;

  // Sort competitors by progress / wpm for real-time ranking display
  const sortedCompetitors = [...competitorPlayers].sort((a, b) => {
    const progA = playerProgress.get(a._id)?.progress || 0;
    const progB = playerProgress.get(b._id)?.progress || 0;
    const wpmA = playerProgress.get(a._id)?.wpm || 0;
    const wpmB = playerProgress.get(b._id)?.wpm || 0;
    if (progB !== progA) return progB - progA;
    return wpmB - wpmA;
  });

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Top Banner Card with Gradient Accent Line */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-[20px] border border-surface-200/80 dark:border-dark-border shadow-card overflow-hidden mb-6"
        >
          {/* Top Gradient Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#3563E9] via-blue-400 to-[#3563E9]" />

          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-[#3563E9] dark:text-primary-400 font-semibold text-xs mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>LIVE SPECTATOR DASHBOARD</span>
              </div>
              <h1 className="text-2xl font-extrabold text-surface-900 dark:text-white tracking-tight">
                {game?.settings?.name || 'Typing Competition'}
              </h1>
              <p className="text-sm text-surface-500 mt-0.5">
                Round {currentRoundNum} of {totalRoundsNum} • Real-time Monitoring
              </p>
            </div>

            <div className="flex items-center gap-4 self-start md:self-auto">
              <div className="bg-surface-50 dark:bg-dark-surface px-4 py-2 rounded-2xl border border-surface-200/60 dark:border-dark-border flex items-center gap-2">
                <span className="text-xs font-semibold text-surface-500 uppercase">PIN:</span>
                <span className="font-mono font-bold text-base text-[#3563E9]">{pin}</span>
              </div>
              <Timer duration={duration} timeRemaining={timeRemaining} />
            </div>
          </div>
        </motion.div>

        {/* Current Round Passage Preview */}
        {currentRound?.text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-surface-50/90 dark:bg-dark-surface/60 rounded-[20px] p-5 border border-surface-200/80 dark:border-dark-border mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-500 flex items-center gap-1.5">
                <span>📖</span> Current Passage Preview
              </span>
              <span className="text-xs font-mono text-surface-400">
                {currentRound.text.length} characters
              </span>
            </div>
            <p className="font-mono text-sm text-surface-700 dark:text-surface-300 line-clamp-2 leading-relaxed bg-white dark:bg-dark-card p-3 rounded-xl border border-surface-200/60 dark:border-dark-border">
              "{currentRound.text}"
            </p>
          </motion.div>
        )}

        {/* Animated Stat Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: 'Avg Speed', value: `${avgWpm} WPM`, icon: '⚡', color: 'from-blue-50 to-indigo-50 text-[#3563E9]' },
            { label: 'Avg Accuracy', value: `${avgAccuracy}%`, icon: '🎯', color: 'from-emerald-50 to-teal-50 text-emerald-600' },
            { label: 'Connected', value: `${connectedCount}`, icon: '👥', color: 'from-purple-50 to-indigo-50 text-purple-600' },
            { label: 'Finished', value: `${finishedCount} / ${competitorPlayers.length}`, icon: '✓', color: 'from-amber-50 to-orange-50 text-amber-600' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-dark-card rounded-[20px] p-4 border border-surface-200/80 dark:border-dark-border shadow-card flex items-center gap-3.5"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.color} dark:bg-dark-surface flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs text-surface-500 font-medium truncate">{stat.label}</div>
                <div className="text-xl font-extrabold text-surface-900 dark:text-white font-mono mt-0.5">
                  {stat.value}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live Player Progress Visualization List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white dark:bg-dark-card rounded-[20px] p-6 border border-surface-200/80 dark:border-dark-border shadow-card"
        >
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-surface-100 dark:border-dark-border">
            <div>
              <h2 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-2">
                <span>🚀</span> Live Competitor Standings
              </h2>
              <p className="text-xs text-surface-500 mt-0.5">
                Real-time typing progress updated live
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-100 dark:bg-dark-surface text-surface-600 dark:text-surface-400">
              {competitorPlayers.length} {competitorPlayers.length === 1 ? 'Competitor' : 'Competitors'}
            </span>
          </div>

          <div className="space-y-3">
            {sortedCompetitors.map((player, idx) => {
              const prog = playerProgress.get(player._id) || {
                wpm: 0,
                accuracy: 100,
                progress: 0,
                isFinished: false,
              };
              return (
                <motion.div
                  key={player._id}
                  layout
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="p-2 rounded-2xl hover:bg-surface-50/80 dark:hover:bg-dark-hover transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 text-xs font-bold text-surface-400 text-center font-mono">
                      #{idx + 1}
                    </span>
                    <div className="flex-1">
                      <ProgressBar
                        playerName={player.displayName}
                        avatar={player.avatar}
                        progress={prog.progress}
                        wpm={prog.wpm}
                        accuracy={prog.accuracy}
                        isFinished={prog.isFinished}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {competitorPlayers.length === 0 && (
              <div className="text-center py-12 bg-surface-50/50 dark:bg-dark-surface/30 rounded-2xl border border-dashed border-surface-200">
                <p className="text-3xl mb-2">🎮</p>
                <p className="text-sm font-semibold text-surface-600 dark:text-surface-400">
                  No competitors joined yet
                </p>
                <p className="text-xs text-surface-400 mt-1">
                  Players will appear here as soon as they enter the game.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
