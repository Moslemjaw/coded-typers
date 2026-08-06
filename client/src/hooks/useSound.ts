import { useCallback, useContext, useRef } from 'react';
import { SoundContext } from '../contexts/SoundContext';

// ============================================================
// useSound — Audio feedback using Web Audio API oscillators
// ============================================================

export function useSound() {
  const { sfxEnabled } = useContext(SoundContext);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) => {
    if (!sfxEnabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch { /* ignore audio errors */ }
  }, [sfxEnabled, getCtx]);

  const playKeySound = useCallback(() => {
    playTone(800 + Math.random() * 200, 0.05, 'square', 0.03);
  }, [playTone]);

  const playCountdownBeep = useCallback(() => {
    playTone(600, 0.15, 'sine', 0.15);
  }, [playTone]);

  const playSuccess = useCallback(() => {
    const ctx = getCtx();
    if (!sfxEnabled) return;
    [523, 659, 784].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 150);
    });
  }, [sfxEnabled, getCtx, playTone]);

  const playError = useCallback(() => {
    playTone(200, 0.3, 'sawtooth', 0.08);
  }, [playTone]);

  return { playKeySound, playCountdownBeep, playSuccess, playError };
}
