// ============================================================
// Socket Event Types — Type-safe Socket.io event definitions
// ============================================================

import { Game, GameSettings, RoundData, RoundResult, LeaderboardEntry } from './game';
import { Player, PlayerProgress } from './player';

// ---------- Client → Server Events ----------

export interface ClientToServerEvents {
  /** Host creates a new game with settings */
  createGame: (settings: GameSettings, callback: (response: CreateGameResponse) => void) => void;

  /** Player joins an existing game by PIN */
  joinGame: (data: JoinGameData, callback: (response: JoinGameResponse) => void) => void;

  /** Player toggles their ready status */
  playerReady: () => void;

  /** Host starts the game */
  startGame: () => void;

  /** Player sends live typing progress */
  typingProgress: (progress: TypingProgressData) => void;

  /** Player finishes typing the current round */
  finishRound: (result: FinishRoundData) => void;

  /** Host triggers the next round */
  nextRound: () => void;

  /** Host cancels the game */
  cancelGame: () => void;

  /** Host updates game settings from lobby */
  updateSettings: (settings: Partial<GameSettings>) => void;

  /** Host triggers play again for the room */
  playAgain: () => void;

  /** Host kicks a player from the room */
  kickPlayer: (targetPlayerId: string) => void;
}

// ---------- Server → Client Events ----------

export interface ServerToClientEvents {
  /** Game created successfully — sent to host */
  gameCreated: (data: { game: Game; playerId: string }) => void;

  /** New player joined the lobby */
  playerJoined: (player: Player) => void;

  /** A player left the lobby */
  playerLeft: (data: { playerId: string; playerName: string }) => void;

  /** A player toggled their ready status */
  playerReadyUpdate: (data: { playerId: string; isReady: boolean }) => void;

  /** Game countdown started (3-2-1-GO) */
  gameCountdown: (data: { countdown: number }) => void;

  /** A new round starts with text to type */
  startRound: (data: RoundData) => void;

  /** Live progress update from another player */
  typingProgressUpdate: (progress: PlayerProgress) => void;

  /** A player finished the round */
  playerFinished: (data: { playerId: string; playerName: string; result: RoundResult }) => void;

  /** Round ended (time expired or all finished) */
  roundEnded: (data: { roundNumber: number; results: RoundResult[] }) => void;

  /** Leaderboard update with rankings */
  leaderboardUpdate: (leaderboard: LeaderboardEntry[]) => void;

  /** Game has ended — show final results */
  gameEnded: (data: { leaderboard: LeaderboardEntry[]; totalRounds: number }) => void;

  /** Game was cancelled by host */
  gameCancelled: () => void;

  /** Settings were updated */
  settingsUpdated: (settings: Partial<GameSettings>) => void;

  /** Error message */
  error: (data: { message: string; code?: string }) => void;

  /** Player list sync (full state) */
  playerSync: (players: Player[]) => void;

  /** Host triggered play again — room reset and ready */
  playAgainAvailable: (data: { game: Game; players: Player[] }) => void;

  /** Player was kicked from lobby by host */
  playerKicked: (data: { message: string }) => void;
}

// ---------- Data Payloads ----------

export interface CreateGameResponse {
  success: boolean;
  game?: Game;
  playerId?: string;
  error?: string;
}

export interface JoinGameData {
  pin: string;
  displayName: string;
  language: string;
  avatar: string;
}

export interface JoinGameResponse {
  success: boolean;
  game?: Game;
  players?: Player[];
  playerId?: string;
  error?: string;
}

export interface TypingProgressData {
  wpm: number;
  accuracy: number;
  progress: number;
  mistakes: number;
  correctChars: number;
  totalChars: number;
}

export interface FinishRoundData {
  wpm: number;
  accuracy: number;
  mistakes: number;
  finishTime: number;
  progress: number;
}
