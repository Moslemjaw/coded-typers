import { useState, useCallback, useEffect, useRef } from 'react';
import { TypingStats } from '../types/game';
import { calculateWPM, calculateAccuracy, calculateProgress, normalizeInput } from '../utils/typing';

// ============================================================
// useTyping — Core typing engine for desktop, Android & iOS keyboards
// The hidden input's value is the source of truth (see applyInput)
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
  const onKeystrokeRef = useRef(onKeystroke);
  const typedRef = useRef(''); // Mirror of typed state for sync reads in event handlers

  onProgressRef.current = onProgress;
  onFinishRef.current = onFinish;
  onKeystrokeRef.current = onKeystroke;

  // Keep typedRef in sync with state
  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

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

  // Apply the full input value as the new typed text. Diffing against the previous
  // value works the same for physical keys, virtual keyboards, IME composition
  // (Gboard / Samsung / Arabic keyboards send the whole word-in-progress), swipe
  // typing and autocorrect replacements.
  const applyInput = useCallback((raw: string) => {
    const prev = typedRef.current;
    const next = normalizeInput(raw).slice(0, text.length);
    if (next === prev) return;

    let common = 0;
    while (common < prev.length && common < next.length && prev[common] === next[common]) common++;

    if (next.length > common && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    // Score only newly added characters; deletions just shrink the typed text
    let newMistakes = 0;
    for (let i = common; i < next.length; i++) {
      const isCorrect = next[i] === text[i];
      totalCharsRef.current++;
      if (isCorrect) correctCharsRef.current++;
      else newMistakes++;
      onKeystrokeRef.current?.(isCorrect);
    }
    if (newMistakes) setMistakes(m => m + newMistakes);

    typedRef.current = next;
    setTyped(next);
    if (next.length >= text.length) setIsFinished(true);
  }, [text]);

  // Keep the caret pinned to the end so edits always happen at the typing position
  const pinCaret = (el: HTMLInputElement) => {
    const end = el.value.length;
    if (el.selectionStart !== end || el.selectionEnd !== end) {
      try { el.setSelectionRange(end, end); } catch { /* unsupported input type */ }
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block select-all / undo / redo and caret movement — they'd desync the input
    if ((e.ctrlKey || e.metaKey) && ['a', 'z', 'y'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      return;
    }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (!isActive || isFinished) {
      // Not typing yet (countdown) or already done — discard anything entered
      el.value = typedRef.current;
      return;
    }
    applyInput(el.value);
    pinCaret(el);
  }, [isActive, isFinished, applyInput]);

  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => {
    pinCaret(e.currentTarget);
  }, []);

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
    typedRef.current = '';
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
    handleInput,
    handleSelect,
    resetTyping,
    isFinished,
  };
}
