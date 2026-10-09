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

// ------------------------------------------------------------
// Text normalization — makes passages typeable on every keyboard
// (iOS smart punctuation, Arabic diacritics, Persian/Urdu letter
// variants, invisible bidi marks inserted by mobile keyboards).
// Applied to both the passage and the player's input so they compare 1:1.
// ------------------------------------------------------------

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g; // tashkeel + tatweel
const INVISIBLE_MARKS = /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\u061C\uFEFF\u00AD]/g;

const CHAR_EQUIVALENTS: Record<string, string> = {
  '\u2018': "'", '\u2019': "'", '\u201A': "'", '\u201B': "'", '\u2032': "'", '`': "'",
  '\u201C': '"', '\u201D': '"', '\u201E': '"', '\u2033': '"', '\u00AB': '"', '\u00BB': '"',
  '\u2013': '-', '\u2014': '-', '\u2212': '-',
  '\u00A0': ' ', '\u2007': ' ', '\u202F': ' ', '\t': ' ', '\n': ' ', '\r': ' ',
  '\u06CC': '\u064A', // Persian yeh → Arabic yeh
  '\u06A9': '\u0643', // Persian kaf → Arabic kaf
  '\u06C1': '\u0647', // Urdu heh → Arabic heh
};

/** Map look-alike characters to the plain form used in passages */
function normalizeChars(str: string): string {
  let out = '';
  for (const ch of str) out += CHAR_EQUIVALENTS[ch] ?? ch;
  return out;
}

/** Normalize a passage for display + comparison */
export function normalizePassage(text: string): string {
  return normalizeChars(
    text.normalize('NFKC').replace(ARABIC_DIACRITICS, '').replace(INVISIBLE_MARKS, '')
  ).replace(/ {2,}/g, ' ').trim();
}

/** Normalize raw keyboard input (keeps user spacing so the 1:1 index mapping stays intact) */
export function normalizeInput(raw: string): string {
  return normalizeChars(
    raw.normalize('NFKC').replace(ARABIC_DIACRITICS, '').replace(INVISIBLE_MARKS, '')
  );
}

const ARABIC_CHAR = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_CHAR = /[A-Za-z]/;

export function isArabicText(text: string): boolean {
  return ARABIC_CHAR.test(text);
}

/** True when the char was typed with the wrong keyboard layout for the passage */
export function isWrongScript(char: string | undefined, passageIsArabic: boolean): boolean {
  if (!char) return false;
  return passageIsArabic ? LATIN_CHAR.test(char) : ARABIC_CHAR.test(char);
}
