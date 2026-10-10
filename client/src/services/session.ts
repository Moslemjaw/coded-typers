// ============================================================
// Game session — lets a tab reclaim its seat after a refresh or a
// dropped connection. sessionStorage is per tab and survives reloads,
// so players sharing one browser never pick up each other's seat.
// ============================================================

export interface GameSession {
  pin: string;
  playerId: string;
  sessionToken: string;
}

const KEY = 'ct-game-session';

export function loadSession(): GameSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s?.pin && s?.playerId && s?.sessionToken ? s : null;
  } catch {
    return null;
  }
}

export function saveSession(session: GameSession) {
  try { sessionStorage.setItem(KEY, JSON.stringify(session)); } catch { /* storage blocked */ }
}

export function clearSession() {
  try { sessionStorage.removeItem(KEY); } catch { /* storage blocked */ }
}
