// ============================================================
// Client-side Scoring — Mirrors server scoring logic
// ============================================================

const FINISH_BONUSES: Record<number, number> = { 1: 50, 2: 30, 3: 15 };

export function calculateScore(wpm: number, accuracy: number, mistakes: number, position: number): number {
  const total = (wpm * 10) + (accuracy * 5) - (mistakes * 3) + (FINISH_BONUSES[position] || 0);
  return Math.max(0, Math.round(total));
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}
