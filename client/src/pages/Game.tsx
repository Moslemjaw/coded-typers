import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { TypingArea } from '../components/game/TypingArea';
import { Timer } from '../components/game/Timer';
import { Countdown } from '../components/game/Countdown';
import { StatsBar } from '../components/game/StatsBar';
import { useGameContext } from '../contexts/GameContext';
import { useTimer } from '../hooks/useTimer';
import { soundSystem } from '../utils/audio';
import { TypingStats } from '../types/game';

export default function Game() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { game, currentRound, status, sendProgress, finishRound, leaderboard, myPlayer } = useGameContext();

  const [showCountdown, setShowCountdown] = useState(true);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, mistakes: 0, progress: 0 });
  const [hasFinished, setHasFinished] = useState(false);

  const duration = currentRound?.timeLimit || game?.settings?.typingTime || 60;

  const { timeRemaining, start: startTimer } = useTimer({
    duration,
    onExpire: () => {
      if (!hasFinished) {
        handleFinish(stats as any);
      }
    },
  });

  // Navigate on round end (respect leaderboardAfterRound setting)
  useEffect(() => {
    if (status === 'round-end' && leaderboard.length > 0) {
      if (game?.settings?.leaderboardAfterRound !== false) {
        navigate(`/leaderboard/${pin}`);
      }
    }
    if (status === 'finished') {
      navigate(`/results/${pin}`);
    }
  }, [status, leaderboard, pin, navigate, game?.settings?.leaderboardAfterRound]);

  // Background music control
  useEffect(() => {
    if (isTypingActive && game?.settings?.music) {
      soundSystem.startMusic();
    } else {
      soundSystem.stopMusic();
    }
    return () => {
      soundSystem.stopMusic();
    };
  }, [isTypingActive, game?.settings?.music]);

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    setIsTypingActive(true);
    startTimer();
  }, [startTimer]);

  const handleProgress = useCallback((typingStats: TypingStats) => {
    setStats({
      wpm: typingStats.wpm,
      accuracy: typingStats.accuracy,
      mistakes: typingStats.mistakes,
      progress: typingStats.progress,
    });
    sendProgress({
      wpm: typingStats.wpm,
      accuracy: typingStats.accuracy,
      progress: typingStats.progress,
      mistakes: typingStats.mistakes,
    });
  }, [sendProgress]);

  const handleFinish = useCallback((typingStats: TypingStats) => {
    if (hasFinished) return;
    setHasFinished(true);
    setIsTypingActive(false);
    soundSystem.stopMusic();
    if (game?.settings?.soundEffects) {
      soundSystem.playFinishChime();
    }
    const elapsed = typingStats.startTime ? (Date.now() - typingStats.startTime) / 1000 : duration;
    finishRound({
      wpm: typingStats.wpm,
      accuracy: typingStats.accuracy,
      mistakes: typingStats.mistakes,
      finishTime: elapsed,
      progress: typingStats.progress,
    });
  }, [hasFinished, finishRound, duration, game?.settings?.soundEffects]);

  // Disable right-click on entire page
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  // Determine passage matching player's language preference
  const isArabic = myPlayer?.language === 'arabic';
  const text = isArabic
    ? (currentRound?.textArabic || currentRound?.text || 'Loading text...')
    : (currentRound?.textEnglish || currentRound?.text || 'Loading text...');

  const totalRounds = game?.settings?.rounds || game?.totalRounds || 1;
  const currentRoundNum = currentRound?.roundNumber || 1;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Countdown overlay with smoother transition */}
        <AnimatePresence mode="wait">
          {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
        </AnimatePresence>

        {/* Top Header Card: Round info + Timer */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-dark-card rounded-[20px] p-5 border border-surface-200/80 dark:border-dark-border shadow-card mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/40 text-[#3563E9] dark:text-primary-400 text-xs font-bold">
                Round {currentRoundNum} of {totalRounds}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-100 dark:bg-dark-surface text-surface-600 dark:text-surface-400 text-xs font-semibold flex items-center gap-1">
                <span>{isArabic ? '🇸🇦' : '🇬🇧'}</span>
                <span>{isArabic ? 'العربية' : 'English'}</span>
              </span>
            </div>
            <p className="text-sm text-surface-500 font-medium">
              {isArabic ? 'اكتب النص أدناه بأقصى سرعة ممكنة' : 'Type the text below as accurately and fast as you can'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Timer duration={duration} timeRemaining={timeRemaining} />
          </div>
        </motion.div>

        {/* Typing Area Visual Hierarchy Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-[20px] border border-surface-200/80 dark:border-dark-border shadow-card p-6 md:p-8 mb-6 relative overflow-hidden"
        >
          {/* Subtle Live Progress Bar on top edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-surface-100 dark:bg-dark-border">
            <motion.div
              className="h-full bg-gradient-to-r from-[#3563E9] to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.progress, 100)}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Typing Area header indicator */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-100 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isTypingActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                {isTypingActive ? 'Focus Mode Active' : hasFinished ? 'Round Completed' : 'Get Ready'}
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-[#3563E9]">
              {Math.round(stats.progress)}% Complete
            </span>
          </div>

          <TypingArea
            text={text}
            isActive={isTypingActive}
            onProgress={handleProgress}
            onFinish={handleFinish}
            onKeystroke={isCorrect => {
              if (game?.settings?.soundEffects) {
                soundSystem.playKeystroke(isCorrect);
              }
            }}
          />
        </motion.div>

        {/* Refined Stats Bar Positioning */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <StatsBar
            wpm={stats.wpm}
            accuracy={stats.accuracy}
            mistakes={stats.mistakes}
            progress={stats.progress}
          />
        </motion.div>

        {/* Finished State Animated Banner */}
        <AnimatePresence>
          {hasFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-[20px] p-6 text-center shadow-card"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-md">
                ✓
              </div>
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                {isArabic ? 'تم إنهاء الجولة بنجاح!' : 'Round Completed!'}
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1 max-w-md mx-auto">
                {isArabic
                  ? 'تم تسجيل نتيجتك. في انتظار باقي اللاعبين للانتقال للوحة المتصدرين...'
                  : 'Your score has been submitted. Waiting for other players to finish...'}
              </p>

              <div className="flex justify-center items-center gap-6 mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 font-mono text-sm font-bold text-emerald-800 dark:text-emerald-300">
                <span>⚡ {stats.wpm} WPM</span>
                <span>🎯 {stats.accuracy}% Acc</span>
                <span>✗ {stats.mistakes} Mistakes</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
