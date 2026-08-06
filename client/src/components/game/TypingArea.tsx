import React, { useRef, useEffect } from 'react';
import { useTyping } from '../../hooks/useTyping';
import { getCharStatus } from '../../utils/typing';
import { TypingStats } from '../../types/game';

// ============================================================
// TypingArea — Core typing component with Native Arabic Ligature Support
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

  // Split Arabic into words to maintain contiguous text nodes for native ligature joining
  const arabicWords = isRtl ? text.split(' ') : [];
  let currentWordStartIdx = 0;

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
          /* Arabic RTL Rendering: Native word-level contiguous string nodes */
          <div
            dir="rtl"
            className="text-right font-arabic text-xl sm:text-2xl md:text-3xl leading-loose select-none font-medium text-surface-800 dark:text-white"
            style={{ unicodeBidi: 'isolate' }}
          >
            {arabicWords.map((word, wordIdx) => {
              const wordStartIdx = currentWordStartIdx;
              const wordLength = word.length;
              const typedLength = typed.length;
              currentWordStartIdx += wordLength + 1; // +1 for space

              let wordContent: React.ReactNode;

              if (typedLength <= wordStartIdx) {
                // Word not reached yet — rendered as single contiguous string for 100% connected Arabic font shaping
                wordContent = (
                  <span className="text-surface-400 dark:text-surface-500 opacity-60">
                    {word}
                  </span>
                );
              } else if (typedLength >= wordStartIdx + wordLength) {
                // Word fully completed
                const typedWordSlice = typed.slice(wordStartIdx, wordStartIdx + wordLength);
                const isWordCorrect = typedWordSlice === word;
                wordContent = (
                  <span className={isWordCorrect ? 'text-[#3563E9] dark:text-blue-400 font-bold' : 'text-red-500 underline decoration-2 font-bold'}>
                    {word}
                  </span>
                );
              } else {
                // Active word currently being typed
                const charOffset = typedLength - wordStartIdx;
                const typedPart = word.slice(0, charOffset);
                const remainingPart = word.slice(charOffset);

                const typedUserSlice = typed.slice(wordStartIdx, typedLength);
                const isPartCorrect = typedUserSlice === typedPart;

                const currentChar = remainingPart.slice(0, 1);
                const futurePart = remainingPart.slice(1);

                wordContent = (
                  <span>
                    {typedPart && (
                      <span className={isPartCorrect ? 'text-[#3563E9] dark:text-blue-400 font-bold' : 'text-red-500 underline decoration-2 font-bold'}>
                        {typedPart}
                      </span>
                    )}
                    {currentChar && (
                      <span className="text-surface-900 dark:text-white font-bold bg-blue-500/20 border-b-2 border-[#3563E9]">
                        {currentChar}
                      </span>
                    )}
                    {futurePart && (
                      <span className="text-surface-400 dark:text-surface-500 opacity-60">
                        {futurePart}
                      </span>
                    )}
                  </span>
                );
              }

              return (
                <span key={wordIdx} className="inline-block ml-2 mb-1">
                  {wordContent}
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
