import { useState, useCallback, useEffect, useRef } from 'react';
import { TypingStats } from '../types/game';
import { calculateWPM, calculateAccuracy, calculateProgress } from '../utils/typing';

// ============================================================
// useTyping — Core typing engine with WPM/accuracy tracking
// ============================================================

interface UseTypingOptions {
  text: string;
  onProgress?: (stats: TypingStats) => void;
  onFinish?: (stats: TypingStats) => void;
  onKeystroke?: (isCorrect: boolean) => void;
  isActive?: boolean;
}

export function useTyping({ text, onProgress, onFinish, onKeystroke, isActive = true }: UseTypingOptions) {
  const [typed, setTyped] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const correctCharsRef = useRef(0);
  const totalCharsRef = useRef(0);
  const onProgressRef = useRef(onProgress);
  const onFinishRef = useRef(onFinish);

  onProgressRef.current = onProgress;
  onFinishRef.current = onFinish;

  const getStats = useCallback((): TypingStats => {
    const now = Date.now();
    const elapsed = startTimeRef.current ? now - startTimeRef.current : 0;
    const wpm = calculateWPM(correctCharsRef.current, elapsed);
    const accuracy = calculateAccuracy(correctCharsRef.current, totalCharsRef.current);
    const progress = calculateProgress(typed.length, text.length);

    return {
      wpm,
      accuracy,
      mistakes,
      progress,
      correctChars: correctCharsRef.current,
      totalChars: totalCharsRef.current,
      startTime: startTimeRef.current || 0,
      isFinished,
    };
  }, [typed.length, text.length, mistakes, isFinished]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive || isFinished) return;

    // Prevent paste
    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'c' || e.key === 'a')) {
      e.preventDefault();
      return;
    }

    // Ignore modifier keys
    if (e.key.length > 1 && e.key !== 'Backspace') return;

    // Start timer on first keystroke
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      setTyped(prev => prev.slice(0, -1));
      return;
    }

    const currentIndex = typed.length;
    if (currentIndex >= text.length) return;

    const newTyped = typed + e.key;
    totalCharsRef.current++;

    const isCorrect = e.key === text[currentIndex];
    if (isCorrect) {
      correctCharsRef.current++;
    } else {
      setMistakes(prev => prev + 1);
    }
    onKeystroke?.(isCorrect);

    setTyped(newTyped);

    // Check if finished
    if (newTyped.length >= text.length) {
      setIsFinished(true);
    }
  }, [isActive, isFinished, typed, text]);

  // Report progress periodically
  useEffect(() => {
    if (!isActive || isFinished || !startTimeRef.current) return;

    const interval = setInterval(() => {
      const stats = getStats();
      onProgressRef.current?.(stats);
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, isFinished, getStats]);

  // Report finish
  useEffect(() => {
    if (isFinished) {
      const stats = getStats();
      onFinishRef.current?.(stats);
    }
  }, [isFinished, getStats]);

  const resetTyping = useCallback(() => {
    setTyped('');
    setMistakes(0);
    setIsFinished(false);
    startTimeRef.current = null;
    correctCharsRef.current = 0;
    totalCharsRef.current = 0;
  }, []);

  return {
    typed,
    stats: getStats(),
    handleKeyDown,
    resetTyping,
    isFinished,
  };
}
