// ============================================================
// Player Types — Player state and profile definitions
// ============================================================

import { Language } from './game';

/** Player state in the lobby and during gameplay */
export interface Player {
  _id: string;
  socketId: string;
  gameId: string;
  displayName: string;
  language: Language;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
  isConnected: boolean;
  totalScore: number;
  joinedAt: string;
}

/** Live player progress during a typing round */
export interface PlayerProgress {
  playerId: string;
  playerName: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  progress: number;
  mistakes: number;
  isFinished: boolean;
}

/** Player profile with aggregate statistics */
export interface PlayerProfile {
  displayName: string;
  avatar: string;
  preferredLanguage: Language;
  stats: PlayerStats;
  achievements: string[];
  matchHistory: string[];
}

/** Aggregate player statistics */
export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  bestWpm: number;
  bestAccuracy: number;
  averageWpm: number;
  averageAccuracy: number;
  totalWordsTyped: number;
  totalTimePlayed: number; // seconds
  winRate: number;
}

/** Avatar configuration */
export interface AvatarConfig {
  id: string;
  emoji: string;
  bgColor: string;
  label: string;
}

/** Available avatar presets */
export const AVATAR_PRESETS: AvatarConfig[] = [
  { id: 'rocket', emoji: '🚀', bgColor: '#EEF2FF', label: 'Rocket' },
  { id: 'lightning', emoji: '⚡', bgColor: '#FEF3C7', label: 'Lightning' },
  { id: 'fire', emoji: '🔥', bgColor: '#FEE2E2', label: 'Fire' },
  { id: 'star', emoji: '⭐', bgColor: '#FEF9C3', label: 'Star' },
  { id: 'diamond', emoji: '💎', bgColor: '#E0F2FE', label: 'Diamond' },
  { id: 'crown', emoji: '👑', bgColor: '#FEF3C7', label: 'Crown' },
  { id: 'ninja', emoji: '🥷', bgColor: '#F3E8FF', label: 'Ninja' },
  { id: 'alien', emoji: '👾', bgColor: '#DCFCE7', label: 'Alien' },
  { id: 'ghost', emoji: '👻', bgColor: '#F1F5F9', label: 'Ghost' },
  { id: 'robot', emoji: '🤖', bgColor: '#E0E7FF', label: 'Robot' },
  { id: 'unicorn', emoji: '🦄', bgColor: '#FCE7F3', label: 'Unicorn' },
  { id: 'cat', emoji: '🐱', bgColor: '#FFF7ED', label: 'Cat' },
];
