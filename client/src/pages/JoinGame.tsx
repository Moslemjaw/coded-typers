import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { useGameContext } from '../contexts/GameContext';
import { AVATAR_PRESETS } from '../types/player';

// ============================================================
// Join Game — Sleek PIN entry, player settings & avatar selection
// ============================================================

export default function JoinGame() {
  const [searchParams] = useSearchParams();
  const { joinGame, error } = useGameContext();
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState(searchParams.get('pin') || '');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('english');
  const [avatar, setAvatar] = useState('rocket');
  const [focusedPinIndex, setFocusedPinIndex] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6 || !name.trim()) return;
    setLoading(true);
    joinGame({ pin, displayName: name, language, avatar });
    setTimeout(() => setLoading(false), 3000);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(val);
  };

  const selectedPreset = AVATAR_PRESETS.find(p => p.id === avatar) || AVATAR_PRESETS[0];

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-dark-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="border-2 border-[#3563E9] dark:border-blue-500 rounded-md px-2 py-0.5 text-xs font-black tracking-wider text-[#3563E9] dark:text-blue-400">
                CODED
              </div>
              <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                TYPERS
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Join a Game
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Enter your 6-digit PIN code, set your display name, and pick an avatar to enter the match lobby.
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

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] shadow-xl shadow-gray-100/50 dark:shadow-none p-6 sm:p-8 space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PIN Input Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Game PIN Code
                  </label>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {pin.length}/6 digits
                  </span>
                </div>

                <div className="relative cursor-text" onClick={() => document.getElementById('game-pin-input')?.focus()}>
                  {/* Invisible Real Input */}
                  <input
                    id="game-pin-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pin}
                    onChange={handlePinChange}
                    onFocus={() => setFocusedPinIndex(true)}
                    onBlur={() => setFocusedPinIndex(false)}
                    maxLength={6}
                    autoFocus
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    required
                  />

                  {/* Visual 6 Digit Slots */}
                  <div className={`grid grid-cols-6 gap-2 sm:gap-3 p-3 rounded-2xl border-2 transition-all duration-300 ${
                    focusedPinIndex
                      ? 'border-[#3563E9] ring-4 ring-[#3563E9]/10 bg-blue-50/20 dark:bg-blue-950/20'
                      : 'border-gray-200 dark:border-dark-border bg-gray-50/50 dark:bg-dark-surface/50'
                  }`}>
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const char = pin[idx] || '';
                      const isCurrent = focusedPinIndex && idx === pin.length;
                      return (
                        <motion.div
                          key={idx}
                          animate={{ scale: char ? [0.95, 1.05, 1] : 1 }}
                          transition={{ duration: 0.15 }}
                          className={`h-14 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-extrabold font-mono transition-all ${
                            char
                              ? 'bg-white dark:bg-dark-card border-2 border-[#3563E9] text-[#3563E9] dark:text-blue-400 shadow-sm'
                              : isCurrent
                              ? 'bg-white dark:bg-dark-card border-2 border-[#3563E9] text-gray-300 dark:text-gray-600 shadow-sm'
                              : 'bg-white/80 dark:bg-dark-card/60 border border-gray-200 dark:border-dark-border text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {char || (isCurrent ? (
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-0.5 h-6 bg-[#3563E9] inline-block"
                            />
                          ) : '•')}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Player Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your nickname..."
                    maxLength={20}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3563E9] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Preferred Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('english')}
                    className={`py-2.5 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      language === 'english'
                        ? 'border-[#3563E9] bg-blue-50/50 dark:bg-blue-950/30 text-[#3563E9] dark:text-blue-400 font-semibold shadow-sm'
                        : 'border-gray-200 dark:border-dark-border bg-gray-50/50 dark:bg-dark-surface/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('arabic')}
                    className={`py-2.5 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      language === 'arabic'
                        ? 'border-[#3563E9] bg-blue-50/50 dark:bg-blue-950/30 text-[#3563E9] dark:text-blue-400 font-semibold shadow-sm'
                        : 'border-gray-200 dark:border-dark-border bg-gray-50/50 dark:bg-dark-surface/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface'
                    }`}
                  >
                    <span>🇸🇦</span>
                    <span>Arabic</span>
                  </button>
                </div>
              </div>

              {/* Sleek Avatar Picker */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Select Avatar
                  </label>
                  <span className="text-xs font-medium text-[#3563E9] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-full">
                    {selectedPreset.label}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2.5">
                  {AVATAR_PRESETS.map(preset => {
                    const isSelected = avatar === preset.id;
                    return (
                      <motion.button
                        key={preset.id}
                        type="button"
                        whileHover={{ scale: 1.12, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAvatar(preset.id)}
                        className={`relative aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-[#3563E9] ring-offset-2 dark:ring-offset-dark-card shadow-md shadow-[#3563E9]/20 scale-105'
                            : 'hover:shadow-md opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: preset.bgColor }}
                        title={preset.label}
                      >
                        {preset.emoji}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-[#3563E9] text-white rounded-full flex items-center justify-center text-[10px] shadow"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={pin.length !== 6 || !name.trim() || loading}
                  className="w-full py-4 px-6 rounded-xl bg-[#3563E9] hover:bg-[#2b51c7] disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white font-semibold text-base shadow-lg shadow-[#3563E9]/25 hover:shadow-xl hover:shadow-[#3563E9]/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Join Game Lobby</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
