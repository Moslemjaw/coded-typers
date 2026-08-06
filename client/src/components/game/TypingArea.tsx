import React, { useRef, useEffect } from 'react';
import { useTyping } from '../../hooks/useTyping';
import { getCharStatus } from '../../utils/typing';
import { TypingStats } from '../../types/game';

// ============================================================
// TypingArea — Core typing component with Arabic ligature support
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

  // Word-level mapping for Arabic to preserve font ligatures and proper RTL wrapping
  const words = isRtl ? text.split(' ') : [];
  let globalArabicCharIdx = 0;

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

      {/* Rendered text container */}
      <div className="bg-surface-50 dark:bg-dark-surface rounded-card p-5 sm:p-8 border border-surface-200 dark:border-dark-border">
        {isRtl ? (
          /* Arabic RTL Rendering: Word wrappers preserve cursive joining */
          <div
            dir="rtl"
            className="text-right font-sans text-xl sm:text-2xl md:text-3xl leading-loose select-none font-medium"
            style={{ unicodeBidi: 'isolate' }}
          >
            {words.map((word, wordIdx) => {
              const wordStartIdx = globalArabicCharIdx;
              const wordChars = word.split('');
              // Include the space character after the word if not last
              globalArabicCharIdx += word.length + 1;

              return (
                <span key={wordIdx} className="inline-block ml-2 mb-1">
                  {wordChars.map((char, charInWordIdx) => {
                    const charIdx = wordStartIdx + charInWordIdx;
                    const status = getCharStatus(typed, text, charIdx);
                    return (
                      <span
                        key={charIdx}
                        className={`
                          transition-colors duration-75
                          ${status === 'correct' ? 'text-[#3563E9] dark:text-blue-400 font-bold' : ''}
                          ${status === 'incorrect' ? 'text-red-500 underline decoration-2 decoration-red-500 font-bold' : ''}
                          ${status === 'current' ? 'text-surface-900 dark:text-white font-bold bg-blue-500/20 border-b-2 border-[#3563E9]' : ''}
                          ${status === 'pending' ? 'text-surface-400 dark:text-surface-500 opacity-60' : ''}
                        `}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </div>
        ) : (
          /* LTR English Rendering */
          <p
            dir="ltr"
            className="text-left font-mono text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide select-none"
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
        )}

        {/* Focus prompt */}
        {!isFinished && isActive && (
          <p className="text-center text-xs text-surface-400 mt-4">
            {isRtl ? 'اضغط هنا للتركيز والبدء في الكتابة' : 'Click here to focus and start typing'}
          </p>
        )}
      </div>
    </div>
  );
}
