import React, { useRef, useEffect } from 'react';
import { useTyping } from '../../hooks/useTyping';
import { getCharStatus } from '../../utils/typing';
import { TypingStats } from '../../types/game';

// ============================================================
// TypingArea — Core typing component with character coloring
// ============================================================

interface TypingAreaProps {
  text: string;
  isActive: boolean;
  onProgress?: (stats: TypingStats) => void;
  onFinish?: (stats: TypingStats) => void;
  onKeystroke?: (isCorrect: boolean) => void;
}

export function TypingArea({ text, isActive, onProgress, onFinish, onKeystroke }: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { typed, handleKeyDown, isFinished } = useTyping({
    text,
    onProgress,
    onFinish,
    onKeystroke,
    isActive,
  });

  // Auto-detect Arabic text (RTL)
  const isRtl = /[\u0600-\u06FF]/.test(text);

  // Auto-focus the hidden input
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <div
      className="relative cursor-text"
      onClick={() => inputRef.current?.focus()}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Hidden input to capture keystrokes */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 w-0 h-0"
        onKeyDown={handleKeyDown}
        onPaste={e => e.preventDefault()}
        onCopy={e => e.preventDefault()}
        onCut={e => e.preventDefault()}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={!isActive || isFinished}
        aria-label="Type here"
      />

      {/* Rendered text with character coloring and RTL support */}
      <div className="bg-surface-50 dark:bg-dark-surface rounded-card p-6 sm:p-8 border border-surface-200 dark:border-dark-border">
        <p
          dir={isRtl ? 'rtl' : 'ltr'}
          className={`font-mono text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide select-none ${isRtl ? 'text-right font-sans' : 'text-left font-mono'}`}
        >
          {text.split('').map((char, i) => {
            const status = getCharStatus(typed, text, i);
            return (
              <span
                key={i}
                className={`
                  relative inline
                  ${status === 'correct' ? 'text-primary-500 font-semibold' : ''}
                  ${status === 'incorrect' ? 'text-red-500 bg-red-50 dark:bg-red-900/20 rounded-sm' : ''}
                  ${status === 'current' ? 'bg-primary-100 dark:bg-primary-900/30 rounded-sm text-surface-900 dark:text-white ring-1 ring-primary-400' : ''}
                  ${status === 'pending' ? 'text-surface-400 dark:text-surface-500' : ''}
                `}
              >
                {char}
              </span>
            );
          })}
        </p>

        {/* Focus prompt */}
        {!isFinished && isActive && (
          <p className="text-center text-xs text-surface-400 mt-4">
            Click here to focus and start typing
          </p>
        )}
      </div>
    </div>
  );
}
