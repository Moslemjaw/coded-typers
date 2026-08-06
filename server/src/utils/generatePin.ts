import mongoose from 'mongoose';
import Game from '../models/Game';

// ============================================================
// PIN Generator — Creates unique 6-digit game PINs
// ============================================================

/** Generate a random 6-digit numeric string */
function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Generate a unique PIN that doesn't exist in the database or active memory */
export async function generateUniquePin(): Promise<string> {
  let pin = generatePin();
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await Game.findOne({ pin, status: { $ne: 'finished' } });
        if (!existing) return pin;
      } catch {
        return pin;
      }
    } else {
      return pin;
    }
    pin = generatePin();
    attempts++;
  }

  return Date.now().toString().slice(-6);
}
