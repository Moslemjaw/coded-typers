// ============================================================
// Typing Analysis Utilities — WPM, accuracy, character status
// ============================================================

export type CharStatus = 'correct' | 'incorrect' | 'current' | 'pending';

/** Calculate WPM: (correct chars / 5) / (time in minutes) */
export function calculateWPM(correctChars: number, timeElapsedMs: number): number {
  if (timeElapsedMs <= 0) return 0;
  const minutes = timeElapsedMs / 60000;
  const words = correctChars / 5;
  return Math.round(words / minutes);
}

/** Calculate accuracy percentage */
export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars <= 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

/** Determine the visual status of a character at a given index */
export function getCharStatus(typed: string, original: string, index: number): CharStatus {
  if (index >= typed.length) {
    return index === typed.length ? 'current' : 'pending';
  }
  return typed[index] === original[index] ? 'correct' : 'incorrect';
}

/** Calculate progress percentage */
export function calculateProgress(currentIndex: number, totalLength: number): number {
  if (totalLength <= 0) return 0;
  return Math.round((currentIndex / totalLength) * 100);
}
