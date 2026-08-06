// ============================================================
// Game Types — Shared type definitions for game state & settings
// ============================================================

export type Language = 'english' | 'arabic' | 'mixed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'waiting' | 'countdown' | 'playing' | 'round-end' | 'finished';

/** Game creation settings configured by the host */
export interface GameSettings {
  name: string;
  language: Language;
  rounds: number;
  typingTime: number;
  difficulty: Difficulty;
  maxPlayers: number;
  randomTexts: boolean;
  leaderboardAfterRound: boolean;
  allowReconnect: boolean;
  music: boolean;
  soundEffects: boolean;
}

/** Full game state as stored and transmitted */
export interface Game {
  _id: string;
  pin: string;
  name: string;
  hostId: string;
  settings: GameSettings;
  status: GameStatus;
  currentRound: number;
  totalRounds: number;
  createdAt: string;
  players: string[];
}

/** Round data for a single typing round (supports per-language passages) */
export interface RoundData {
  roundNumber: number;
  text: string;
  textEnglish?: string;
  textArabic?: string;
  textId: string;
  startedAt?: string;
  endedAt?: string;
  timeLimit: number;
}

/** Individual round result for a player */
export interface RoundResult {
  playerId: string;
  playerName: string;
  roundNumber: number;
  wpm: number;
  accuracy: number;
  mistakes: number;
  score: number;
  progress: number;
  finishPosition: number;
  finishTime: number;
}

/** Leaderboard entry with cumulative scores */
export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  avatar: string;
  totalScore: number;
  averageWpm: number;
  averageAccuracy: number;
  totalMistakes: number;
  rank: number;
  previousRank?: number;
  roundScores: number[];
}

/** Text content for typing */
export interface TypingText {
  _id: string;
  content: string;
  language: Language;
  difficulty: Difficulty;
  wordCount: number;
  category: string;
}

/** Typing statistics calculated in real-time */
export interface TypingStats {
  wpm: number;
  accuracy: number;
  mistakes: number;
  progress: number;
  correctChars: number;
  totalChars: number;
  startTime: number;
  isFinished: boolean;
}

/** Achievement badge definition */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
}

/** Match history record */
export interface MatchHistory {
  gameId: string;
  gameName: string;
  date: string;
  rank: number;
  totalPlayers: number;
  averageWpm: number;
  averageAccuracy: number;
  totalScore: number;
  rounds: number;
}
