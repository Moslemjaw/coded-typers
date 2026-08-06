import { useState, useEffect, useCallback } from 'react';

// ============================================================
// useDarkMode — Theme persistence with system preference
// ============================================================

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('coded-typers-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('coded-typers-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => setIsDark(prev => !prev), []);
  const setDark = useCallback((val: boolean) => setIsDark(val), []);

  return { isDark, toggle, setDark };
}
