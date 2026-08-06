import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';

// ============================================================
// Landing Page — Premium hero with CODED logo + Host/Join cards
// ============================================================

function CodedLogoBig() {
  return (
    <div className="flex items-center gap-2.5 justify-center">
      <div className="border-[3px] border-surface-900 dark:border-white px-3 py-1 rounded-md">
        <span className="text-2xl sm:text-3xl font-black tracking-[0.1em] text-surface-900 dark:text-white leading-none">
          CODED
        </span>
      </div>
      <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-500">
        TYPERS
      </span>
    </div>
  );
}

const cardVariants = {
  rest: { y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  hover: { y: -6, boxShadow: '0 20px 60px rgba(53,99,233,0.12)' },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 py-16 relative">
        {/* Ambient background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-400/[0.03] rounded-full blur-[100px]" />
        </div>

        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <CodedLogoBig />

          <p className="text-base sm:text-lg text-surface-400 dark:text-surface-500 font-medium mt-4 tracking-wide">
            Real-time Multiplayer Typing Competition
          </p>
        </motion.div>

        {/* Host & Join Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl"
        >
          {/* Host Game Card */}
          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={() => navigate('/host')}
            className="cursor-pointer bg-white dark:bg-dark-card rounded-card border border-surface-100 dark:border-dark-border p-8 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-5 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-1.5">Host Game</h2>
            <p className="text-sm text-surface-400 dark:text-surface-500 leading-relaxed">
              Create a room and invite players to compete
            </p>
          </motion.div>

          {/* Join Game Card */}
          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={() => navigate('/join')}
            className="cursor-pointer bg-white dark:bg-dark-card rounded-card border border-surface-100 dark:border-dark-border p-8 group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-5 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-1.5">Join Game</h2>
            <p className="text-sm text-surface-400 dark:text-surface-500 leading-relaxed">
              Enter a PIN or scan QR code to join a room
            </p>
          </motion.div>
        </motion.div>

        {/* Footer branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-[11px] text-surface-300 dark:text-surface-600 font-medium tracking-[0.15em] uppercase"
        >
          Powered by CODED
        </motion.p>
      </div>
    </PageTransition>
  );
}
