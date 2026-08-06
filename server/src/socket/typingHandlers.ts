import { Server, Socket } from 'socket.io';
import { calculateScore } from '../utils/scoring';
import { findGameBySocket } from './index';
import { endRound } from './gameHandlers';

// ============================================================
// Typing Handlers — Real-time progress and round completion
// ============================================================

/** Player sends live typing progress — broadcast to room for host dashboard */
export function handleTypingProgress(
  io: Server,
  socket: Socket,
  progress: { wpm: number; accuracy: number; progress: number; mistakes: number }
) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState || gameState.status !== 'playing') return;

  const player = gameState.players.get(socket.id);
  if (!player || player.isFinished || player.isHost) return; // Host does not type

  // Update in-memory player state
  player.wpm = progress.wpm || 0;
  player.accuracy = progress.accuracy || 0;
  player.progress = progress.progress || 0;
  player.mistakes = progress.mistakes || 0;

  // Broadcast to everyone in room (for host dashboard and live tracking)
  socket.to(gameState.pin).emit('typingProgressUpdate', {
    playerId: player.playerId,
    playerName: player.displayName,
    avatar: player.avatar,
    wpm: player.wpm,
    accuracy: player.accuracy,
    progress: player.progress,
    mistakes: player.mistakes,
    isFinished: false,
  });
}

/** Player finished typing the round text */
export async function handleFinishRound(
  io: Server,
  socket: Socket,
  result: {
    wpm: number;
    accuracy: number;
    mistakes: number;
    finishTime: number;
    progress: number;
  }
) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState || gameState.status !== 'playing') return;

  const player = gameState.players.get(socket.id);
  if (!player || player.isFinished || player.isHost) return;

  // Mark player as finished
  gameState.finishedCount++;
  player.isFinished = true;
  player.finishPosition = gameState.finishedCount;
  player.finishTime = result.finishTime || 0;
  player.wpm = result.wpm || 0;
  player.accuracy = result.accuracy || 0;
  player.mistakes = result.mistakes || 0;
  player.progress = result.progress || 100;

  // Base score calculation
  const baseScore = calculateScore(
    player.wpm,
    player.accuracy,
    player.mistakes,
    player.finishPosition
  );

  // Progressive Kahoot Multiplier: Points increase with each round!
  // Round 1 = 1.0x, Round 2 = 1.5x, Round 3 = 2.0x, Round 4 = 2.5x...
  const roundMultiplier = 1 + (gameState.currentRound - 1) * 0.5;
  const roundScore = Math.round(baseScore * roundMultiplier);

  player.roundScore = roundScore;
  player.score += roundScore; // ACCUMULATE TO TOTAL SCORE ACROSS ALL ROUNDS!

  // Notify everyone that this player finished
  io.to(gameState.pin).emit('playerFinished', {
    playerId: player.playerId,
    playerName: player.displayName,
    result: {
      playerId: player.playerId,
      playerName: player.displayName,
      roundNumber: gameState.currentRound,
      wpm: player.wpm,
      accuracy: player.accuracy,
      mistakes: player.mistakes,
      score: player.score, // Total cumulative score
      progress: player.progress,
      finishPosition: player.finishPosition,
      finishTime: player.finishTime,
    },
  });

  console.log(`[Typing] ${player.displayName} finished round ${gameState.currentRound} (${player.wpm} WPM, ${player.accuracy}% accuracy, position ${player.finishPosition}, +${roundScore} pts [${roundMultiplier}x mult], total: ${player.score} pts)`);

  // Check if ALL typing players (non-host) have finished
  const typingPlayers = Array.from(gameState.players.values()).filter(p => !p.isHost && p.isConnected);
  const allFinished = typingPlayers.length > 0 && typingPlayers.every(p => p.isFinished);

  if (allFinished) {
    console.log(`[Typing] All active typing players finished round ${gameState.currentRound}`);
    await endRound(io, gameState);
  }
}
