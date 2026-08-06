import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useGameContext } from '../../contexts/GameContext';

// ============================================================
// Navbar — Top navigation with CODED logo box + Exit Game arrow button
// ============================================================

function CodedLogo() {
  return (
    <div className="flex items-center gap-1.5">
      {/* CODED bordered box logo */}
      <div className="border-2 border-surface-900 dark:border-white px-2 py-0.5 rounded-[4px]">
        <span className="text-[13px] font-black tracking-[0.08em] text-surface-900 dark:text-white leading-none">
          CODED
        </span>
      </div>
      {/* TYPERS text */}
      <span className="text-[15px] font-extrabold tracking-tight text-primary-500">
        TYPERS
      </span>
    </div>
  );
}

export function Navbar() {
  const location = useLocation();
  const { leaveGame, status } = useGameContext();
  const isHome = location.pathname === '/';
  const isInActiveGame = status !== 'idle' && !isHome;

  const handleExit = () => {
    leaveGame();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl border-b border-surface-100/80 dark:border-dark-border/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isHome && (
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleExit}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-surface-400 hover:text-red-500 cursor-pointer flex items-center gap-1"
              title="Exit Game & Return Home"
              aria-label="Exit Game"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}
          <Link to="/" onClick={leaveGame} className="flex items-center gap-2 group">
            <div className="border-2 border-[#3563E9] dark:border-blue-500 rounded-md px-2 py-0.5 text-xs font-black tracking-wider text-[#3563E9] dark:text-blue-400 group-hover:bg-[#3563E9] group-hover:text-white transition-all">
              CODED
            </div>
            <span className="text-lg font-extrabold tracking-tight text-surface-900 dark:text-white">
              TYPERS
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export { CodedLogo };
