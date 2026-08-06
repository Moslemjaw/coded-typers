import { Server, Socket } from 'socket.io';
import { handleCreateGame, handleJoinGame, handlePlayerReady, handleDisconnect, handleCancelGame, handleUpdateSettings } from './lobbyHandlers';
import { handleStartGame, handleNextRound, handlePlayAgain } from './gameHandlers';
import { handleTypingProgress, handleFinishRound } from './typingHandlers';

// ============================================================
// Socket.io Setup — Central hub for all real-time events
// ============================================================

/** In-memory game state for fast access during gameplay */
export interface PlayerState {
  playerId: string;
  socketId: string;
  displayName: string;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
  isConnected: boolean;
  wpm: number;
  accuracy: number;
  progress: number;
  mistakes: number;
  isFinished: boolean;
  finishPosition: number;
  finishTime: number;
  score: number; // Cumulative total score across all rounds
  roundScore: number; // Score earned in current round
}

export interface GameState {
  pin: string;
  gameId: string;
  hostSocketId: string;
  status: 'waiting' | 'countdown' | 'playing' | 'round-end' | 'finished';
  settings: {
    name: string;
    language: string;
    rounds: number;
    typingTime: number;
    difficulty: string;
    maxPlayers: number;
    randomTexts: boolean;
    leaderboardAfterRound: boolean;
    allowReconnect: boolean;
    music: boolean;
    soundEffects: boolean;
  };
  currentRound: number;
  currentText: string;
  currentTextId: string | null;
  players: Map<string, PlayerState>; // socketId -> PlayerState
  roundTimer: NodeJS.Timeout | null;
  finishedCount: number;
  roundStartTime: number;
  usedTexts: Set<string>; // Set of text contents already used in previous rounds
}

/** Global map of active games: PIN -> GameState */
export const activeGames = new Map<string, GameState>();

/** Helper: find game state by socket ID */
export function findGameBySocket(socketId: string): GameState | undefined {
  for (const game of activeGames.values()) {
    if (game.players.has(socketId)) return game;
  }
  return undefined;
}

/** Helper: get player's game PIN from socket */
export function getPlayerPin(socketId: string): string | undefined {
  for (const [pin, game] of activeGames.entries()) {
    if (game.players.has(socketId)) return pin;
  }
  return undefined;
}

/** Main Socket.io setup function */
export function setupSocket(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ---- Lobby Events ----
    socket.on('createGame', (settings, callback) => {
      handleCreateGame(io, socket, settings, callback);
    });

    socket.on('joinGame', (data, callback) => {
      handleJoinGame(io, socket, data, callback);
    });

    socket.on('playerReady', () => {
      handlePlayerReady(io, socket);
    });

    socket.on('cancelGame', () => {
      handleCancelGame(io, socket);
    });

    socket.on('updateSettings', (settings) => {
      handleUpdateSettings(io, socket, settings);
    });

    // ---- Game Events ----
    socket.on('startGame', () => {
      handleStartGame(io, socket);
    });

    socket.on('nextRound', () => {
      handleNextRound(io, socket);
    });

    socket.on('playAgain', () => {
      handlePlayAgain(io, socket);
    });

    // ---- Typing Events ----
    socket.on('typingProgress', (progress) => {
      handleTypingProgress(io, socket, progress);
    });

    socket.on('finishRound', (result) => {
      handleFinishRound(io, socket, result);
    });

    // ---- Disconnect ----
    socket.on('disconnect', () => {
      handleDisconnect(io, socket);
    });
  });

  console.log('[Socket] Event handlers registered');
}
