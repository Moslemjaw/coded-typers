import React, { createContext, useContext, ReactNode } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

// ============================================================
// Theme Context — Dark mode state for the app
// ============================================================

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
  setDark: (val: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
  setDark: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useDarkMode();
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
