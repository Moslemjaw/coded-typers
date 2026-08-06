import React, { createContext, useState, useContext, ReactNode } from 'react';

// ============================================================
// Sound Context — Music and SFX settings
// ============================================================

interface SoundContextValue {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  toggleMusic: () => void;
  toggleSfx: () => void;
}

export const SoundContext = createContext<SoundContextValue>({
  musicEnabled: false,
  sfxEnabled: true,
  toggleMusic: () => {},
  toggleSfx: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [musicEnabled, setMusic] = useState(() => localStorage.getItem('ct-music') === 'true');
  const [sfxEnabled, setSfx] = useState(() => localStorage.getItem('ct-sfx') !== 'false');

  const toggleMusic = () => {
    setMusic(prev => {
      localStorage.setItem('ct-music', String(!prev));
      return !prev;
    });
  };

  const toggleSfx = () => {
    setSfx(prev => {
      localStorage.setItem('ct-sfx', String(!prev));
      return !prev;
    });
  };

  return (
    <SoundContext.Provider value={{ musicEnabled, sfxEnabled, toggleMusic, toggleSfx }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
