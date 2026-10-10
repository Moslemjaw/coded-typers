import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// useTimer — Countdown timer with start/pause/reset
// ============================================================

interface UseTimerOptions {
  duration: number; // seconds
  onExpire?: () => void;
  autoStart?: boolean;
  /** Start from this many seconds instead of the full duration (resuming after a refresh) */
  initialRemaining?: number;
}

export function useTimer({ duration, onExpire, autoStart = false, initialRemaining }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(initialRemaining ?? duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clear();
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clear;
  }, [isRunning, clear]);

  // Reset when duration changes (not on mount, so initialRemaining is kept)
  const prevDurationRef = useRef(duration);
  useEffect(() => {
    if (prevDurationRef.current === duration) return;
    prevDurationRef.current = duration;
    setTimeRemaining(duration);
  }, [duration]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => { setIsRunning(false); clear(); }, [clear]);
  const reset = useCallback(() => {
    clear();
    setTimeRemaining(duration);
    setIsRunning(false);
  }, [duration, clear]);

  const progress = duration > 0 ? ((duration - timeRemaining) / duration) * 100 : 0;

  return { timeRemaining, isRunning, start, pause, reset, progress };
}
