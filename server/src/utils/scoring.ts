// ============================================================
// Scoring Engine — Calculates player scores per round
// ============================================================

/**
 * Score = (WPM × 10) + (Accuracy × 5) - (Mistakes × 3) + FirstFinishBonus
 * 
 * FirstFinishBonus:
 *   1st place = 50 points
 *   2nd place = 30 points
 *   3rd place = 15 points
 *   Everyone else = 0
 */

const FINISH_BONUSES: Record<number, number> = {
  1: 50,
  2: 30,
  3: 15,
};

export function calculateScore(
  wpm: number,
  accuracy: number,
  mistakes: number,
  finishPosition: number
): number {
  const wpmScore = wpm * 10;
  const accuracyScore = accuracy * 5;
  const mistakePenalty = mistakes * 3;
  const finishBonus = FINISH_BONUSES[finishPosition] || 0;

  const total = Math.max(0, Math.round(wpmScore + accuracyScore - mistakePenalty + finishBonus));
  return total;
}

/** Get the finish bonus for a given position */
export function getFinishBonus(position: number): number {
  return FINISH_BONUSES[position] || 0;
}
