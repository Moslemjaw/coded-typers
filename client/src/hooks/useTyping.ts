import { useState, useCallback, useEffect, useRef } from 'react';
import { TypingStats } from '../types/game';
import { calculateWPM, calculateAccuracy, calculateProgress } from '../utils/typing';

// ============================================================
// useTyping — Core typing engine with full mobile/Android support
// Uses both onKeyDown (desktop) and onInput (mobile virtual keyboards)
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
  const handledByKeyDownRef = useRef(false); // Flag to prevent double-processing

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

  // Process a single character input (shared logic for both keydown and input events)
  const processChar = useCallback((char: string) => {
    const currentTyped = typedRef.current;
    if (currentTyped.length >= text.length) return;

    // Start timer on first keystroke
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const currentIndex = currentTyped.length;
    const isCorrect = char === text[currentIndex];

    totalCharsRef.current++;
    if (isCorrect) {
      correctCharsRef.current++;
    } else {
      setMistakes(prev => prev + 1);
    }
    onKeystrokeRef.current?.(isCorrect);

    const newTyped = currentTyped + char;
    typedRef.current = newTyped;
    setTyped(newTyped);

    if (newTyped.length >= text.length) {
      setIsFinished(true);
    }
  }, [text]);

  const processBackspace = useCallback(() => {
    const currentTyped = typedRef.current;
    if (currentTyped.length === 0) return;
    const newTyped = currentTyped.slice(0, -1);
    typedRef.current = newTyped;
    setTyped(newTyped);
  }, []);

  // Desktop: onKeyDown handler (fires reliably on physical keyboards)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive || isFinished) return;

    // Block paste/copy/select-all
    if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'c' || e.key === 'a')) {
      e.preventDefault();
      return;
    }

    // Ignore modifier/function keys
    if (e.key.length > 1 && e.key !== 'Backspace') return;

    e.preventDefault();
    handledByKeyDownRef.current = true;

    if (e.key === 'Backspace') {
      processBackspace();
      return;
    }

    processChar(e.key);
  }, [isActive, isFinished, processChar, processBackspace]);

  // Mobile: onInput handler (fires on virtual keyboards where keydown may not work)
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    // If keydown already handled this keystroke, skip to prevent double-processing
    if (handledByKeyDownRef.current) {
      handledByKeyDownRef.current = false;
      return;
    }

    if (!isActive || isFinished) return;

    const inputEvent = e.nativeEvent as InputEvent;
    const inputType = inputEvent.inputType;

    if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
      processBackspace();
      return;
    }

    // Get the inserted character(s)
    const data = inputEvent.data;
    if (!data) return;

    // Process each character (handles multi-char autocomplete/swipe inputs)
    for (const char of data) {
      if (typedRef.current.length >= text.length) break;
      processChar(char);
    }
  }, [isActive, isFinished, text.length, processChar, processBackspace]);

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
    resetTyping,
    isFinished,
  };
}
