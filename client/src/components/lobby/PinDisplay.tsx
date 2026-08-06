import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatPin } from '../../utils/format';

// ============================================================
// PinDisplay — Large game PIN with copy button
// ============================================================

interface PinDisplayProps {
  pin: string;
}

export function PinDisplay({ pin }: PinDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = pin;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Game PIN</p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-4xl sm:text-5xl font-black tracking-[0.3em] text-surface-900 dark:text-white font-mono">
          {formatPin(pin)}
        </span>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="mt-3 px-4 py-1.5 text-sm font-medium rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
      >
        {copied ? '✓ Copied!' : '📋 Copy PIN'}
      </motion.button>
    </div>
  );
}
