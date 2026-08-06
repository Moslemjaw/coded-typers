// ============================================================
// Validation Helpers — Validates game settings, PINs, and names
// ============================================================

const VALID_LANGUAGES = ['english', 'arabic', 'mixed'];
const VALID_ROUNDS = [1, 3, 5, 10];
const VALID_TIMES = [15, 30, 60, 90];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validate game creation settings */
export function validateGameSettings(settings: Record<string, any>): ValidationResult {
  const errors: string[] = [];

  if (!settings.name || typeof settings.name !== 'string' || settings.name.trim().length === 0) {
    errors.push('Game name is required');
  } else if (settings.name.length > 50) {
    errors.push('Game name must be 50 characters or less');
  }

  if (settings.language && !VALID_LANGUAGES.includes(settings.language)) {
    errors.push('Invalid language selection');
  }

  if (settings.rounds && !VALID_ROUNDS.includes(settings.rounds)) {
    errors.push('Rounds must be 1, 3, 5, or 10');
  }

  if (settings.typingTime && !VALID_TIMES.includes(settings.typingTime)) {
    errors.push('Typing time must be 15, 30, 60, or 90 seconds');
  }

  if (settings.difficulty && !VALID_DIFFICULTIES.includes(settings.difficulty)) {
    errors.push('Invalid difficulty level');
  }

  if (settings.maxPlayers !== undefined) {
    const mp = Number(settings.maxPlayers);
    if (isNaN(mp) || mp < 2 || mp > 50) {
      errors.push('Max players must be between 2 and 50');
    }
  }

  return { valid: errors.length === 0, errors };
}

/** Validate a 6-digit game PIN */
export function validatePin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

/** Validate a player display name */
export function validateDisplayName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Display name is required');
  } else if (name.trim().length < 2) {
    errors.push('Display name must be at least 2 characters');
  } else if (name.trim().length > 20) {
    errors.push('Display name must be 20 characters or less');
  }

  return { valid: errors.length === 0, errors };
}
