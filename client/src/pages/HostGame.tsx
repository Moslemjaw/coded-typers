import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { Toggle } from '../components/ui/Toggle';
import { useGameContext } from '../contexts/GameContext';

// ============================================================
// Host Game — Create custom game session with spacious SaaS design
// ============================================================

export default function HostGame() {
  const { createGame, error } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    language: 'english',
    rounds: '3',
    typingTime: '60',
    difficulty: 'medium',
    maxPlayers: '30',
    randomTexts: true,
    leaderboardAfterRound: true,
    allowReconnect: true,
    music: false,
    soundEffects: true,
  });

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    createGame({
      name: form.name,
      hostName: 'Host',
      avatar: 'crown',
      language: form.language as any,
      rounds: parseInt(form.rounds),
      typingTime: parseInt(form.typingTime),
      difficulty: form.difficulty as any,
      maxPlayers: parseInt(form.maxPlayers),
      randomTexts: form.randomTexts,
      leaderboardAfterRound: form.leaderboardAfterRound,
      allowReconnect: form.allowReconnect,
      music: form.music,
      soundEffects: form.soundEffects,
    });
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-dark-bg px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="border-2 border-[#3563E9] dark:border-blue-500 rounded-md px-2 py-0.5 text-xs font-black tracking-wider text-[#3563E9] dark:text-blue-400">
                CODED
              </div>
              <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                TYPERS
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Create a Game Room
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure room parameters, round rules, and player limits for your match.
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Configuration Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] shadow-xl shadow-gray-100/50 dark:shadow-none p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* SECTION 1: Game Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#3563E9] dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                    01
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Game Identity
                  </h2>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <svg className="w-4 h-4 text-[#3563E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Room Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Speed Typers Championship"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3563E9] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* SECTION 2: Match Parameters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#3563E9] dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                    02
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Match Rules
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Language */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <svg className="w-4 h-4 text-[#3563E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <span>Allowed Language</span>
                    </label>
                    <select
                      value={form.language}
                      onChange={e => update('language', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3563E9] transition-all cursor-pointer"
                    >
                      <option value="english">English Only</option>
                      <option value="arabic">Arabic Only</option>
                      <option value="mixed">Both (English & Arabic Choice)</option>
                    </select>
                  </div>

                  {/* Rounds */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <svg className="w-4 h-4 text-[#3563E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Total Rounds</span>
                    </label>
                    <select
                      value={form.rounds}
                      onChange={e => update('rounds', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3563E9] transition-all cursor-pointer"
                    >
                      <option value="1">1 Round</option>
                      <option value="3">3 Rounds</option>
                      <option value="5">5 Rounds</option>
                      <option value="10">10 Rounds</option>
                    </select>
                  </div>

                  {/* Typing Time */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <svg className="w-4 h-4 text-[#3563E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Typing Time / Round</span>
                    </label>
                    <select
                      value={form.typingTime}
                      onChange={e => update('typingTime', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3563E9] transition-all cursor-pointer"
                    >
                      <option value="15">15 Seconds</option>
                      <option value="30">30 Seconds</option>
                      <option value="60">60 Seconds</option>
                      <option value="90">90 Seconds</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <svg className="w-4 h-4 text-[#3563E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Text Difficulty</span>
                    </label>
                    <select
                      value={form.difficulty}
                      onChange={e => update('difficulty', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3563E9] transition-all cursor-pointer"
                    >
                      <option value="easy">Easy (Simple Words)</option>
                      <option value="medium">Medium (Standard Sentences)</option>
                      <option value="hard">Hard (Complex & Code Snippets)</option>
                    </select>
                  </div>
                </div>

                {/* Max Players */}
                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <svg className="w-4 h-4 text-[#3563E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Maximum Players</span>
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={form.maxPlayers}
                    onChange={e => update('maxPlayers', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3563E9] transition-all"
                  />
                </div>
              </div>

              {/* SECTION 3: Options & Preferences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-dark-border">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#3563E9] dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                    03
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Gameplay & Audio Controls
                  </h2>
                </div>

                <div className="space-y-3 divide-y divide-gray-100 dark:divide-dark-border">
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Random Texts per Round</p>
                      <p className="text-xs text-gray-400">Generate different prompt texts for each round</p>
                    </div>
                    <Toggle checked={form.randomTexts} onChange={v => update('randomTexts', v)} />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Leaderboard After Every Round</p>
                      <p className="text-xs text-gray-400">Show interim standings between rounds</p>
                    </div>
                    <Toggle checked={form.leaderboardAfterRound} onChange={v => update('leaderboardAfterRound', v)} />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Allow Reconnect</p>
                      <p className="text-xs text-gray-400">Permit disconnected players to rejoin the lobby</p>
                    </div>
                    <Toggle checked={form.allowReconnect} onChange={v => update('allowReconnect', v)} />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Background Music</p>
                      <p className="text-xs text-gray-400">Play ambient music during typing rounds</p>
                    </div>
                    <Toggle checked={form.music} onChange={v => update('music', v)} />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Sound Effects</p>
                      <p className="text-xs text-gray-400">Keystroke sounds and achievement alerts</p>
                    </div>
                    <Toggle checked={form.soundEffects} onChange={v => update('soundEffects', v)} />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!form.name.trim() || loading}
                  className="w-full py-4 px-6 rounded-xl bg-[#3563E9] hover:bg-[#2b51c7] disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-semibold text-base shadow-lg shadow-[#3563E9]/25 hover:shadow-xl hover:shadow-[#3563E9]/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Game & Get PIN</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
