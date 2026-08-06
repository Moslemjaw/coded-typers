// ============================================================
// Scoring Engine — Enhanced Points Formula
// ============================================================
//
// FORMULA:
//   Base       = WPM × 15
//   Accuracy   = Base × (accuracy / 100)²     ← quadratic penalty: 90% acc = 81% of base
//   Completion = multiply by (progress / 100)  ← 0% typed = 0 points
//   Bonus      = Finish position bonus (1st/2nd/3rd)
//   Streak     = +10% if accuracy ≥ 98% ("Perfect" bonus)
//
//   Final = round( Base × AccuracyMultiplier × CompletionMultiplier × StreakMultiplier + FinishBonus )
//
// KEY IMPROVEMENTS:
//   1. 0 WPM / 0 progress = 0 points (AFK players get nothing)
//   2. Accuracy is quadratic: 95% → 0.9025x, 80% → 0.64x (harsh penalty for sloppy typing)
//   3. Progress gate: if you only typed 30% of the text, you get 30% of your score
//   4. Finish bonuses are bigger to reward completing first
//   5. "Perfect" accuracy streak bonus (+10%) for ≥98% accuracy
//

const FINISH_BONUSES: Record<number, number> = {
  1: 100,   // 🥇 First place
  2: 60,    // 🥈 Second place
  3: 30,    // 🥉 Third place
};

export function calculateScore(
  wpm: number,
  accuracy: number,
  mistakes: number,
  finishPosition: number,
  progress: number = 100     // 0–100, percentage of text completed
): number {
  // AFK gate: no typing = no points
  if (wpm <= 0 && progress <= 0) return 0;

  // Base score from speed
  const baseScore = wpm * 15;

  // Accuracy multiplier (quadratic: punishes low accuracy harder)
  const accRatio = Math.max(0, Math.min(1, accuracy / 100));
  const accuracyMultiplier = accRatio * accRatio;

  // Completion multiplier (must actually type to earn points)
  const completionMultiplier = Math.max(0, Math.min(1, progress / 100));

  // Perfect accuracy streak bonus (+10% if ≥98% accuracy and actually typed)
  const streakMultiplier = (accuracy >= 98 && wpm > 0) ? 1.10 : 1.0;

  // Finish bonus (only if you actually finished)
  const finishBonus = (progress >= 100) ? (FINISH_BONUSES[finishPosition] || 0) : 0;

  const total = Math.round(
    baseScore * accuracyMultiplier * completionMultiplier * streakMultiplier + finishBonus
  );

  return Math.max(0, total);
}

/** Get the finish bonus for a given position */
export function getFinishBonus(position: number): number {
  return FINISH_BONUSES[position] || 0;
}
