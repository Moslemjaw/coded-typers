import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import Game from '../models/Game';
import Round from '../models/Round';
import Result from '../models/Result';
import Player from '../models/Player';
import { selectText } from '../utils/textSelector';
import { calculateScore } from '../utils/scoring';
import { activeGames, findGameBySocket, GameState } from './index';

async function safeDb(fn: () => Promise<any>) {
  if (mongoose.connection.readyState === 1) {
    try { await fn(); } catch (err: any) { console.warn('[DB] Operation skipped:', err.message); }
  }
}

// ============================================================
// Game Handlers — Start game, rounds, end game
// ============================================================

/** Host starts the game — triggers 3-2-1 countdown, then first round */
export async function handleStartGame(io: Server, socket: Socket) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState) return;

  const player = gameState.players.get(socket.id);
  if (!player?.isHost) {
    socket.emit('error', { message: 'Only the host can start the game' });
    return;
  }

  const typingPlayers = Array.from(gameState.players.values()).filter(p => !p.isHost);
  if (typingPlayers.length < 1) {
    socket.emit('error', { message: 'Need at least 1 player to join before starting' });
    return;
  }

  gameState.status = 'countdown';
  await safeDb(() => Game.findByIdAndUpdate(gameState.gameId, { status: 'countdown' }));

  console.log(`[Game] Starting countdown for game ${gameState.pin}`);

  let count = 3;
  const countdownInterval = setInterval(() => {
    io.to(gameState.pin).emit('gameCountdown', { countdown: count });
    count--;

    if (count < 0) {
      clearInterval(countdownInterval);
      startRound(io, gameState);
    }
  }, 1000);
}

/** Start a new round — select UNIQUE passages, preserve cumulative scores */
export async function startRound(io: Server, gameState: GameState) {
  try {
    gameState.currentRound++;
    gameState.status = 'playing';
    gameState.finishedCount = 0;
    gameState.roundStartTime = Date.now();

    if (!gameState.usedTexts) {
      gameState.usedTexts = new Set<string>();
    }

    // Reset per-round metrics while PRESERVING cumulative total score (player.score)
    for (const player of gameState.players.values()) {
      player.wpm = 0;
      player.accuracy = 100;
      player.progress = 0;
      player.mistakes = 0;
      player.isFinished = false;
      player.finishPosition = 0;
      player.finishTime = 0;
      player.roundScore = 0;
    }

    const excludeSet = gameState.settings.randomTexts ? gameState.usedTexts : new Set<string>();

    const { content, textEnglish, textArabic, textId } = await selectText(
      gameState.settings.language,
      gameState.settings.difficulty,
      excludeSet
    );

    if (gameState.settings.randomTexts) {
      gameState.usedTexts.add(content);
      if (textEnglish) gameState.usedTexts.add(textEnglish);
      if (textArabic) gameState.usedTexts.add(textArabic);
    }

    gameState.currentText = content;
    gameState.currentTextId = textId;

    await safeDb(async () => {
      const round = new Round({
        gameId: gameState.gameId,
        roundNumber: gameState.currentRound,
        textId: textId || undefined,
        textContent: content,
        startedAt: new Date(),
      });
      await round.save();

      await Game.findByIdAndUpdate(gameState.gameId, {
        currentRound: gameState.currentRound,
        status: 'playing',
      });
    });

    io.to(gameState.pin).emit('startRound', {
      roundNumber: gameState.currentRound,
      text: content,
      textEnglish,
      textArabic,
      textId: textId || '',
      timeLimit: gameState.settings.typingTime,
    });

    console.log(`[Game] Round ${gameState.currentRound}/${gameState.settings.rounds} started for game ${gameState.pin}`);

    gameState.roundTimer = setTimeout(() => {
      endRound(io, gameState);
    }, gameState.settings.typingTime * 1000);

  } catch (error) {
    console.error('[Game] Error starting round:', error);
    io.to(gameState.pin).emit('error', { message: 'Failed to start round' });
  }
}

/** End current round — calculate scores for all competitors (finished & in-progress) */
export async function endRound(io: Server, gameState: GameState) {
  if (gameState.status !== 'playing') return;

  gameState.status = 'round-end';

  if (gameState.roundTimer) {
    clearTimeout(gameState.roundTimer);
    gameState.roundTimer = null;
  }

  // Ensure every competitor (including those who didn't reach 100% before timer expired) has round score calculated!
  for (const p of gameState.players.values()) {
    if (p.isHost) continue;
    if (!p.isFinished) {
      p.isFinished = true;
      const baseScore = calculateScore(p.wpm, p.accuracy, p.mistakes, 0);
      const roundMultiplier = 1 + (gameState.currentRound - 1) * 0.5;
      const roundScore = Math.round(baseScore * roundMultiplier);
      p.roundScore = roundScore;
      p.score += roundScore;
    }
  }

  const roundResults = Array.from(gameState.players.values())
    .filter(p => !p.isHost)
    .map(p => ({
      playerId: p.playerId,
      playerName: p.displayName,
      roundNumber: gameState.currentRound,
      wpm: p.wpm,
      accuracy: p.accuracy,
      mistakes: p.mistakes,
      score: p.score, // Total cumulative score
      progress: p.progress,
      finishPosition: p.finishPosition,
      finishTime: p.finishTime,
    }));

  await safeDb(async () => {
    await Round.findOneAndUpdate(
      { gameId: gameState.gameId, roundNumber: gameState.currentRound },
      { endedAt: new Date(), results: roundResults }
    );

    for (const p of gameState.players.values()) {
      if (p.isHost) continue;
      await Player.findByIdAndUpdate(p.playerId, {
        $push: {
          rounds: {
            roundNumber: gameState.currentRound,
            wpm: p.wpm,
            accuracy: p.accuracy,
            mistakes: p.mistakes,
            score: p.score,
            finishTime: p.finishTime,
            finishPosition: p.finishPosition,
            progress: p.progress,
          },
        },
        totalScore: p.score,
      });
    }

    await Game.findByIdAndUpdate(gameState.gameId, { status: 'round-end' });
  });

  io.to(gameState.pin).emit('roundEnded', {
    roundNumber: gameState.currentRound,
    results: roundResults,
  });

  const leaderboard = buildLeaderboard(gameState);
  io.to(gameState.pin).emit('leaderboardUpdate', leaderboard);

  console.log(`[Game] Round ${gameState.currentRound} ended for game ${gameState.pin}`);

  if (gameState.settings.leaderboardAfterRound === false) {
    if (gameState.currentRound >= gameState.settings.rounds) {
      await handleEndGame(io, gameState);
    } else {
      setTimeout(() => {
        if (activeGames.has(gameState.pin) && gameState.status === 'round-end') {
          startRound(io, gameState);
        }
      }, 3000);
    }
  }
}

/** Host triggers next round */
export async function handleNextRound(io: Server, socket: Socket) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState) return;

  const player = gameState.players.get(socket.id);
  if (!player?.isHost) return;

  if (gameState.currentRound >= gameState.settings.rounds) {
    await handleEndGame(io, gameState);
  } else {
    await startRound(io, gameState);
  }
}

/** End game — calculate final rankings, create results, emit */
export async function handleEndGame(io: Server, gameState: GameState) {
  gameState.status = 'finished';

  if (gameState.roundTimer) {
    clearTimeout(gameState.roundTimer);
    gameState.roundTimer = null;
  }

  const leaderboard = buildLeaderboard(gameState);

  await safeDb(async () => {
    for (const entry of leaderboard) {
      const playerDoc = await Player.findById(entry.playerId).catch(() => null);
      const rounds = playerDoc?.rounds.map(r => ({
        roundNumber: r.roundNumber,
        wpm: r.wpm,
        accuracy: r.accuracy,
        mistakes: r.mistakes,
        score: r.score,
      })) || [];

      await Result.create({
        gameId: gameState.gameId,
        playerId: entry.playerId,
        playerName: entry.playerName,
        totalScore: entry.totalScore,
        averageWpm: entry.averageWpm,
        averageAccuracy: entry.averageAccuracy,
        totalMistakes: entry.totalMistakes,
        rank: entry.rank,
        rounds,
      });
    }
    await Game.findByIdAndUpdate(gameState.gameId, { status: 'finished' });
  });

  io.to(gameState.pin).emit('gameEnded', {
    leaderboard,
    totalRounds: gameState.settings.rounds,
  });

  setTimeout(() => {
    // Only delete if game wasn't restarted
    const game = activeGames.get(gameState.pin);
    if (game && game.status === 'finished') {
      activeGames.delete(gameState.pin);
    }
  }, 300000); // 5 minutes retention

  console.log(`[Game] Game ${gameState.pin} ended. Winner: ${leaderboard[0]?.playerName || 'N/A'}`);
}

/** Host triggers Play Again for the same room */
export async function handlePlayAgain(io: Server, socket: Socket) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState) return;

  const player = gameState.players.get(socket.id);
  if (!player?.isHost) return;

  // Reset room game state
  gameState.status = 'waiting';
  gameState.currentRound = 0;
  gameState.currentText = '';
  gameState.currentTextId = null;
  gameState.finishedCount = 0;
  if (gameState.usedTexts) gameState.usedTexts.clear();

  // Reset all players' metrics for the new match
  for (const p of gameState.players.values()) {
    p.wpm = 0;
    p.accuracy = 100;
    p.progress = 0;
    p.mistakes = 0;
    p.isFinished = false;
    p.finishPosition = 0;
    p.finishTime = 0;
    p.score = 0;
    p.roundScore = 0;
    p.isReady = true;
  }

  await safeDb(async () => {
    await Game.findByIdAndUpdate(gameState.gameId, {
      status: 'waiting',
      currentRound: 0,
    });
  });

  const playersList = Array.from(gameState.players.values()).map(p => ({
    _id: p.playerId,
    socketId: p.socketId,
    gameId: gameState.gameId,
    displayName: p.displayName,
    avatar: p.avatar,
    isReady: true,
    isHost: p.isHost,
    isConnected: p.isConnected,
    totalScore: 0,
    joinedAt: new Date().toISOString(),
  }));

  io.to(gameState.pin).emit('playAgainAvailable', {
    game: {
      _id: gameState.gameId,
      pin: gameState.pin,
      name: gameState.settings.name,
      hostId: gameState.hostSocketId,
      settings: gameState.settings,
      status: 'waiting',
      currentRound: 0,
      totalRounds: gameState.settings.rounds,
      createdAt: new Date().toISOString(),
      players: [],
    },
    players: playersList,
  });

  console.log(`[Game] Host restarted room ${gameState.pin}`);
}

/** Build leaderboard from current game state (only non-host players) */
function buildLeaderboard(gameState: GameState) {
  const players = Array.from(gameState.players.values()).filter(p => !p.isHost);

  const entries = players.map(p => ({
    playerId: p.playerId,
    playerName: p.displayName,
    avatar: p.avatar,
    totalScore: p.score, // Cumulative total score
    averageWpm: p.wpm,
    averageAccuracy: p.accuracy,
    totalMistakes: p.mistakes,
    rank: 0,
    roundScores: [] as number[],
  }));

  entries.sort((a, b) => b.totalScore - a.totalScore);

  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}
