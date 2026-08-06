import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { LeaderboardEntry } from '../../types/game';
import { AVATAR_PRESETS } from '../../types/player';
import { formatScore } from '../../utils/scoring';

// ============================================================
// Podium — Dramatic top-3 podium with animated score counters
// ============================================================

interface PodiumProps {
  first?: LeaderboardEntry;
  second?: LeaderboardEntry;
  third?: LeaderboardEntry;
}

// Animated score counter component
function AnimatedScore({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200; // ms
    const stepTime = 16;
    const increment = (end - start) / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{formatScore(displayValue)}</>;
}

function PodiumBlock({ entry, place, delay }: { entry?: LeaderboardEntry; place: 1 | 2 | 3; delay: number }) {
  if (!entry) return <div className="flex-1" />;

  const heights = { 1: 'h-48 sm:h-56', 2: 'h-36 sm:h-44', 3: 'h-28 sm:h-36' };
  const medals = { 1: '🏆', 2: '🥈', 3: '🥉' };
  const badges = { 1: '1st Place', 2: '2nd Place', 3: '3rd Place' };

  // Premium SaaS styling for each podium position
  const styles = {
    1: {
      bg: 'bg-gradient-to-t from-amber-400/25 via-amber-300/10 to-white/50 dark:from-amber-900/30 dark:via-amber-800/10 dark:to-dark-card',
      border: 'border-2 border-amber-300/80 dark:border-amber-500/50',
      shadow: 'shadow-[0_12px_36px_rgba(245,158,11,0.15)]',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      rankText: 'text-amber-600 dark:text-amber-400',
    },
    2: {
      bg: 'bg-gradient-to-t from-slate-200/40 via-slate-100/10 to-white/50 dark:from-slate-800/40 dark:via-slate-800/10 dark:to-dark-card',
      border: 'border-2 border-slate-300/80 dark:border-slate-600/50',
      shadow: 'shadow-[0_8px_24px_rgba(100,116,139,0.12)]',
      badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      rankText: 'text-slate-600 dark:text-slate-400',
    },
    3: {
      bg: 'bg-gradient-to-t from-amber-900/15 via-orange-800/5 to-white/50 dark:from-amber-950/30 dark:via-orange-950/10 dark:to-dark-card',
      border: 'border-2 border-orange-300/70 dark:border-orange-700/50',
      shadow: 'shadow-[0_6px_20px_rgba(217,119,6,0.1)]',
      badgeBg: 'bg-orange-100 text-orange-800 dark:bg-amber-950/40 dark:text-orange-300',
      rankText: 'text-orange-700 dark:text-orange-400',
    },
  };

  const preset = AVATAR_PRESETS.find(a => a.id === entry.avatar);
  const currentStyle = styles[place];

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, type: 'spring', bounce: 0.25 }}
      className="flex-1 flex flex-col items-center max-w-[200px]"
    >
      {/* Player Header Info */}
      <div className="text-center mb-3 flex flex-col items-center">
        {place === 1 && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
            className="text-2xl mb-1 animate-bounce"
          >
            👑
          </motion.div>
        )}
        <div className="w-12 h-12 rounded-full bg-white dark:bg-dark-surface shadow-md flex items-center justify-center text-2xl border border-surface-200/60 mb-2">
          {preset?.emoji || '🚀'}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${currentStyle.badgeBg}`}>
          {badges[place]}
        </span>
        <p className="font-bold text-sm text-surface-900 dark:text-white truncate max-w-[140px]">
          {entry.playerName}
        </p>
        <p className="text-xs font-mono font-bold text-[#3563E9] dark:text-primary-400 mt-0.5">
          <AnimatedScore value={entry.totalScore} /> pts
        </p>
      </div>

      {/* Podium Block Stand */}
      <div
        className={`w-full ${heights[place]} ${currentStyle.bg} ${currentStyle.border} ${currentStyle.shadow} rounded-t-[20px] flex flex-col items-center justify-start pt-4 backdrop-blur-sm relative overflow-hidden`}
      >
        <span className="text-4xl filter drop-shadow-md">{medals[place]}</span>

        {/* Stats Pills inside Podium Stand */}
        <div className="mt-3 text-center px-2">
          <span className="text-[11px] font-medium text-surface-500 block">
            {Math.round(entry.averageWpm)} WPM
          </span>
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {Math.round(entry.averageAccuracy)}% Acc
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function Podium({ first, second, third }: PodiumProps) {
  // Fire confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#3563E9', '#FFD700', '#94A3B8', '#D97706'],
      });
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-6 px-2 mb-10 pt-4">
      <PodiumBlock entry={second} place={2} delay={0.3} />
      <PodiumBlock entry={first} place={1} delay={0.1} />
      <PodiumBlock entry={third} place={3} delay={0.5} />
    </div>
  );
}
