import React, { createContext, useContext, ReactNode } from 'react';
import { useGame } from '../hooks/useGame';

// ============================================================
// Game Context — Provides game state and actions app-wide
// ============================================================

type GameContextValue = ReturnType<typeof useGame>;

export const GameContext = createContext<GameContextValue>({} as GameContextValue);

export function GameProvider({ children }: { children: ReactNode }) {
  const gameState = useGame();
  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
