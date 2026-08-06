import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { Podium } from '../components/leaderboard/Podium';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { useGameContext } from '../contexts/GameContext';

// ============================================================
// Final Results — Premium Podium, Confetti & Full Rankings
// ============================================================

export default function FinalResults() {
  const navigate = useNavigate();
  const { leaderboard, isHost, playAgain, canPlayAgain, status, game } = useGameContext();

  const first = leaderboard[0];
  const second = leaderboard[1];
  const third = leaderboard[2];

  // Auto-navigate to lobby when host resets the game
  useEffect(() => {
    if (status === 'waiting' && game?.pin) {
      navigate(`/lobby/${game.pin}`);
    }
  }, [status, game?.pin, navigate]);

  const isPlayAgainEnabled = isHost || canPlayAgain;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header & Confetti Celebration Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 text-[#3563E9] dark:text-primary-400 font-semibold text-xs mb-3 border border-primary-100 dark:border-primary-900/50 shadow-sm">
            <span className="animate-bounce">🎉</span>
            <span>Tournament Complete! Confetti Celebration Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
            <span>🏆</span> Final Results
          </h1>
          <p className="text-surface-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
            Congratulations to all participants! Here are the official final standings.
          </p>
        </motion.div>

        {/* Dramatic Top 3 Podium Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-[20px] p-6 sm:p-8 border border-surface-200/80 dark:border-dark-border shadow-card mb-8"
        >
          <div className="text-center mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-surface-400">
              Hall of Champions
            </h2>
          </div>
          <Podium first={first} second={second} third={third} />
        </motion.div>

        {/* Full Rankings Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white flex items-center gap-2">
              <span>📊</span> Complete Leaderboard
            </h2>
            <span className="text-xs text-surface-500 font-medium">
              {leaderboard.length} total participants
            </span>
          </div>
          <LeaderboardTable entries={leaderboard} showRoundScores />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={playAgain}
            disabled={!isPlayAgainEnabled}
            className={`
              font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base
              ${isPlayAgainEnabled
                ? 'bg-[#3563E9] hover:bg-[#2B50C7] text-white shadow-btn hover:shadow-btn-hover cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-surface-200 dark:bg-dark-surface text-surface-400 dark:text-surface-500 border border-surface-300/40 dark:border-dark-border cursor-not-allowed opacity-75'
              }
            `}
          >
            {isHost ? (
              <>
                <span>Play Again</span>
                <span>🔄</span>
              </>
            ) : canPlayAgain ? (
              <>
                <span>Play Again</span>
                <span>🔄</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-surface-400 dark:bg-surface-500 animate-pulse" />
                <span>Waiting for Host to Play Again...</span>
              </>
            )}
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-surface-100 hover:bg-surface-200 dark:bg-dark-surface dark:hover:bg-dark-hover text-surface-800 dark:text-surface-200 font-semibold px-8 py-3.5 rounded-xl border border-surface-200/80 dark:border-dark-border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-base"
          >
            <span>Return Home</span>
            <span>🏠</span>
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
