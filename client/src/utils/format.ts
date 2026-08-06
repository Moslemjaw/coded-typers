// ============================================================
// Formatting Helpers — Time, PIN, percentage, numbers
// ============================================================

/** Format seconds as MM:SS */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Format 6-digit PIN with spaces for readability: "123 456" */
export function formatPin(pin: string): string {
  if (pin.length !== 6) return pin;
  return `${pin.slice(0, 3)} ${pin.slice(3)}`;
}

/** Format number as percentage with % symbol */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/** Format number with locale separators */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/** Get ordinal suffix for a rank (1st, 2nd, 3rd...) */
export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
