import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { AVATAR_PRESETS } from '../types/player';

// ============================================================
// Profile — Manage player identity, avatar preset, & preferences
// ============================================================

export default function Profile() {
  const [name, setName] = useState(() => localStorage.getItem('ct-displayName') || '');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('ct-avatar') || 'rocket');
  const [language, setLanguage] = useState(() => localStorage.getItem('ct-language') || 'english');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ct-displayName', name);
    localStorage.setItem('ct-avatar', avatar);
    localStorage.setItem('ct-language', language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const currentPreset = AVATAR_PRESETS.find(a => a.id === avatar) || AVATAR_PRESETS[0];

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-dark-bg px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Header */}
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
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Player Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Customize your handle, avatar icon, and default language settings.
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-[20px] shadow-xl shadow-gray-100/50 dark:shadow-none p-6 sm:p-8 space-y-8"
          >
            <form onSubmit={handleSave} className="space-y-8">
              {/* Hero Avatar Display */}
              <div className="text-center space-y-3">
                <motion.div
                  key={avatar}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-28 h-28 mx-auto rounded-3xl flex items-center justify-center text-6xl shadow-lg border-4 border-white dark:border-dark-card transition-all"
                  style={{ backgroundColor: currentPreset.bgColor }}
                >
                  {currentPreset.emoji}
                </motion.div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {name.trim() || 'Anonymous Typist'}
                  </h2>
                  <span className="inline-block mt-1 text-xs font-semibold text-[#3563E9] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full">
                    {currentPreset.label} Avatar
                  </span>
                </div>
              </div>

              {/* SECTION 1: Player Identity */}
              <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-dark-border">
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
                    placeholder="Enter display name..."
                    maxLength={20}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3563E9] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* SECTION 2: Preferred Language */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Preferred Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLanguage('english')}
                    className={`py-3 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
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
                    className={`py-3 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
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

              {/* SECTION 3: Avatar Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Choose Avatar Preset
                  </label>
                  <span className="text-xs text-gray-400 font-medium">
                    {AVATAR_PRESETS.length} Available
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

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    saved
                      ? 'bg-emerald-600 shadow-emerald-600/25'
                      : 'bg-[#3563E9] hover:bg-[#2b51c7] shadow-[#3563E9]/25 hover:shadow-xl hover:shadow-[#3563E9]/30'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <span>✓</span>
                        <span>Profile Saved Successfully</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="save"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <span>Save Profile Changes</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
