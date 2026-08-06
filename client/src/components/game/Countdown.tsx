import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// Countdown — Full-screen 3-2-1-GO overlay
// ============================================================

interface CountdownProps {
  onComplete: () => void;
}

export function Countdown({ onComplete }: CountdownProps) {
  const [count, setCount] = useState(3);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Show "GO!" for 800ms then complete
      const timer = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center"
        >
          {count > 0 ? (
            <span className="text-9xl font-black text-white drop-shadow-2xl">
              {count}
            </span>
          ) : (
            <span className="text-8xl font-black text-green-400 drop-shadow-2xl">
              GO!
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
