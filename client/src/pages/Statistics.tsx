import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import api from '../services/api';

// ============================================================
// Statistics — Comprehensive typing stats & match history
// ============================================================

export default function Statistics() {
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const playerId = localStorage.getItem('ct-playerId') || '';

  useEffect(() => {
    if (playerId) {
      setLoading(true);
      Promise.all([
        api.getPlayerStats(playerId).then(res => setStats(res.stats)).catch(() => {}),
        api.getMatchHistory(playerId).then(res => setHistory(res.history || [])).catch(() => {}),
      ]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [playerId]);

  const winRate = stats && stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-dark-bg px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="border-2 border-[#3563E9] dark:border-blue-500 rounded-md px-2 py-0.5 text-xs font-black tracking-wider text-[#3563E9] dark:text-blue-400">
                  CODED
                </div>
                <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                  TYPERS
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Performance Analytics
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Track your typing speed, accuracy records, and match history.
              </p>
            </div>

            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3563E9] hover:bg-[#2b51c7] text-white text-sm font-semibold shadow-md shadow-[#3563E9]/20 transition-all self-start sm:self-auto"
            >
              <span>Play Match</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>

          {loading ? (
            <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] p-12 text-center">
              <div className="w-8 h-8 border-3 border-[#3563E9] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Fetching player analytics...</p>
            </div>
          ) : stats ? (
            <>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Games Played */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 dark:bg-blue-950/20 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#3563E9] dark:text-blue-400 flex items-center justify-center mb-3 font-semibold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {stats.gamesPlayed}
                  </p>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
                    Matches Played
                  </p>
                </motion.div>

                {/* Games Won */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 dark:bg-blue-950/20 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 font-semibold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      {stats.gamesWon}
                    </p>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                      {winRate}% Win
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
                    Victories
                  </p>
                </motion.div>

                {/* Best WPM */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 dark:bg-blue-950/20 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#3563E9] dark:text-blue-400 flex items-center justify-center mb-3 font-semibold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-extrabold text-[#3563E9] dark:text-blue-400 tracking-tight">
                    {stats.bestWpm} <span className="text-sm font-semibold text-gray-400">WPM</span>
                  </p>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
                    Peak Speed
                  </p>
                </motion.div>

                {/* Best Accuracy */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 dark:bg-blue-950/20 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform" />
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 font-semibold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {stats.bestAccuracy}%
                  </p>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
                    Peak Accuracy
                  </p>
                </motion.div>
              </div>

              {/* Match History Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] shadow-sm overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Recent Match History
                  </h2>
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {history.length} Matches Recorded
                  </span>
                </div>

                {history.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-dark-border">
                    {history.map((match: any, i: number) => {
                      const getRankBadge = (rank: number) => {
                        if (rank === 1) return <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-200 dark:border-amber-800/40">🥇 1st Place</span>;
                        if (rank === 2) return <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs border border-gray-200 dark:border-gray-700">🥈 2nd Place</span>;
                        if (rank === 3) return <span className="px-2.5 py-1 rounded-lg bg-amber-900/10 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-800/20">🥉 3rd Place</span>;
                        return <span className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-dark-surface text-gray-500 font-medium text-xs">Rank #{rank}</span>;
                      };

                      return (
                        <motion.div
                          key={i}
                          whileHover={{ backgroundColor: 'rgba(53, 99, 233, 0.02)' }}
                          className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {getRankBadge(match.rank)}
                            <div>
                              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                {match.playerName || 'Player'}
                              </p>
                              <p className="text-xs text-gray-400">
                                Match ID: {match._id ? match._id.slice(-6) : `M-${i + 1}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 self-end sm:self-auto">
                            <div className="text-right">
                              <p className="text-xs text-gray-400 uppercase font-semibold">Speed</p>
                              <p className="text-sm font-bold text-[#3563E9] dark:text-blue-400">
                                {Math.round(match.averageWpm)} <span className="text-xs font-normal">WPM</span>
                              </p>
                            </div>
                            <div className="text-right pl-4 border-l border-gray-100 dark:border-dark-border">
                              <p className="text-xs text-gray-400 uppercase font-semibold">Score</p>
                              <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                                {match.totalScore} <span className="text-xs font-normal text-gray-400">pts</span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#3563E9] dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">No Match Records Found</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                      Complete your first typing race to view stats and match history logs here.
                    </p>
                    <Link
                      to="/join"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all"
                    >
                      Join a Room
                    </Link>
                  </div>
                )}
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] p-12 text-center shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#3563E9] dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Profile Found</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                You haven't played any matches yet on this device. Join or host a game to generate player statistics!
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/join"
                  className="px-5 py-2.5 rounded-xl bg-[#3563E9] hover:bg-[#2b51c7] text-white text-sm font-semibold shadow-md shadow-[#3563E9]/20 transition-all"
                >
                  Join Game
                </Link>
                <Link
                  to="/host"
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-all"
                >
                  Host Game
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
