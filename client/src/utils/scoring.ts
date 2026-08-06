// ============================================================
// Client-side Scoring — Mirrors server scoring logic
// ============================================================
//
// FORMULA:
//   Base       = WPM × 15
//   Accuracy   = Base × (accuracy / 100)²
//   Completion = multiply by (progress / 100)
//   Bonus      = Finish position bonus (1st/2nd/3rd)
//   Streak     = +10% if accuracy ≥ 98%
//

const FINISH_BONUSES: Record<number, number> = { 1: 100, 2: 60, 3: 30 };

export function calculateScore(
  wpm: number,
  accuracy: number,
  mistakes: number,
  position: number,
  progress: number = 100
): number {
  if (wpm <= 0 && progress <= 0) return 0;

  const baseScore = wpm * 15;
  const accRatio = Math.max(0, Math.min(1, accuracy / 100));
  const accuracyMultiplier = accRatio * accRatio;
  const completionMultiplier = Math.max(0, Math.min(1, progress / 100));
  const streakMultiplier = (accuracy >= 98 && wpm > 0) ? 1.10 : 1.0;
  const finishBonus = (progress >= 100) ? (FINISH_BONUSES[position] || 0) : 0;

  const total = Math.round(
    baseScore * accuracyMultiplier * completionMultiplier * streakMultiplier + finishBonus
  );
  return Math.max(0, total);
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}
