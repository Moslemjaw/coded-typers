import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import Game from '../models/Game';
import Player from '../models/Player';
import { generateUniquePin } from '../utils/generatePin';
import { validateGameSettings, validateDisplayName, validatePin } from '../middlewares/validation';
import { activeGames, findGameBySocket, GameState, PlayerState } from './index';

async function safeDb(fn: () => Promise<any>) {
  if (mongoose.connection.readyState === 1) {
    try { await fn(); } catch (err: any) { console.warn('[DB] Operation skipped:', err.message); }
  }
}

// ============================================================
// Lobby Handlers — Game creation, joining, ready, disconnect
// ============================================================

/** Host creates a new game */
export async function handleCreateGame(
  io: Server,
  socket: Socket,
  settings: any,
  callback: (response: any) => void
) {
  try {
    const validation = validateGameSettings(settings);
    if (!validation.valid) {
      return callback({ success: false, error: validation.errors.join(', ') });
    }

    const pin = await generateUniquePin();
    const gameId = new mongoose.Types.ObjectId().toString();
    const hostPlayerId = new mongoose.Types.ObjectId().toString();

    await safeDb(async () => {
      const game = new Game({
        _id: gameId,
        pin,
        name: settings.name,
        hostSocketId: socket.id,
        hostPlayerId,
        language: settings.language || 'english',
        rounds: settings.rounds || 3,
        typingTime: settings.typingTime || 60,
        difficulty: settings.difficulty || 'medium',
        maxPlayers: settings.maxPlayers || 30,
        randomTexts: settings.randomTexts ?? true,
        leaderboardAfterRound: settings.leaderboardAfterRound ?? true,
        allowReconnect: settings.allowReconnect ?? true,
        music: settings.music ?? false,
        soundEffects: settings.soundEffects ?? true,
      });

      const hostPlayer = new Player({
        _id: hostPlayerId,
        socketId: socket.id,
        gameId,
        displayName: settings.hostName || 'Host',
        language: settings.language || 'english',
        avatar: settings.avatar || 'crown',
        isReady: true,
        isHost: true,
      });

      await hostPlayer.save();
      game.players.push(hostPlayer._id);
      await game.save();
    });

    const gameState: GameState = {
      pin,
      gameId,
      hostSocketId: socket.id,
      status: 'waiting',
      settings: {
        name: settings.name,
        language: settings.language || 'english',
        rounds: settings.rounds || 3,
        typingTime: settings.typingTime || 60,
        difficulty: settings.difficulty || 'medium',
        maxPlayers: settings.maxPlayers || 30,
        randomTexts: settings.randomTexts ?? true,
        leaderboardAfterRound: settings.leaderboardAfterRound ?? true,
        allowReconnect: settings.allowReconnect ?? true,
        music: settings.music ?? false,
        soundEffects: settings.soundEffects ?? true,
      },
      currentRound: 0,
      currentText: '',
      currentTextId: null,
      players: new Map<string, PlayerState>(),
      roundTimer: null,
      finishedCount: 0,
      roundStartTime: 0,
      usedTexts: new Set<string>(),
    };

    gameState.players.set(socket.id, {
      playerId: hostPlayerId,
      socketId: socket.id,
      displayName: settings.hostName || 'Host',
      avatar: settings.avatar || 'crown',
      isReady: true,
      isHost: true,
      isConnected: true,
      wpm: 0,
      accuracy: 0,
      progress: 0,
      mistakes: 0,
      isFinished: false,
      finishPosition: 0,
      finishTime: 0,
      score: 0,
      roundScore: 0,
    });

    activeGames.set(pin, gameState);
    socket.join(pin);

    callback({
      success: true,
      game: {
        _id: gameId,
        pin,
        name: settings.name,
        hostId: hostPlayerId,
        settings: gameState.settings,
        status: 'waiting',
        currentRound: 0,
        totalRounds: gameState.settings.rounds,
        createdAt: new Date().toISOString(),
        players: [],
      },
      playerId: hostPlayerId,
    });

    console.log(`[Lobby] Game created: ${pin} by ${settings.hostName || 'Host'}`);
  } catch (error) {
    console.error('[Lobby] Error creating game:', error);
    callback({ success: false, error: 'Failed to create game' });
  }
}

/** Player joins an existing game — automatically marked ready */
export async function handleJoinGame(
  io: Server,
  socket: Socket,
  data: any,
  callback: (response: any) => void
) {
  try {
    const { pin, displayName, language, avatar } = data;

    if (!validatePin(pin)) {
      return callback({ success: false, error: 'Invalid game PIN' });
    }

    const nameValidation = validateDisplayName(displayName);
    if (!nameValidation.valid) {
      return callback({ success: false, error: nameValidation.errors.join(', ') });
    }

    const gameState = activeGames.get(pin);
    if (!gameState) {
      return callback({ success: false, error: 'Game not found' });
    }

    // Check if game has already started (allow reconnect if enabled)
    if (gameState.status !== 'waiting' && !gameState.settings.allowReconnect) {
      return callback({ success: false, error: 'Game has already started' });
    }

    // Reconnect logic if allowReconnect is enabled
    const existingPlayerEntry = Array.from(gameState.players.entries()).find(
      ([_, p]) => p.displayName.toLowerCase() === displayName.trim().toLowerCase() && !p.isConnected
    );

    if (existingPlayerEntry && gameState.settings.allowReconnect) {
      const [oldSocketId, existingPlayer] = existingPlayerEntry;
      gameState.players.delete(oldSocketId);
      existingPlayer.socketId = socket.id;
      existingPlayer.isConnected = true;
      gameState.players.set(socket.id, existingPlayer);
      socket.join(pin);

      const playersList = Array.from(gameState.players.values()).map(p => ({
        _id: p.playerId,
        socketId: p.socketId,
        gameId: gameState.gameId,
        displayName: p.displayName,
        language: language || 'english',
        avatar: p.avatar,
        isReady: true,
        isHost: p.isHost,
        isConnected: true,
        totalScore: p.score,
        joinedAt: new Date().toISOString(),
      }));

      io.to(pin).emit('playerSync', playersList);

      return callback({
        success: true,
        game: {
          _id: gameState.gameId,
          pin,
          name: gameState.settings.name,
          hostId: gameState.hostSocketId,
          settings: gameState.settings,
          status: gameState.status,
          currentRound: gameState.currentRound,
          totalRounds: gameState.settings.rounds,
          createdAt: new Date().toISOString(),
          players: [],
        },
        players: playersList,
        playerId: existingPlayer.playerId,
      });
    }

    if (gameState.players.size >= gameState.settings.maxPlayers) {
      return callback({ success: false, error: 'Game is full' });
    }

    const playerId = new mongoose.Types.ObjectId().toString();

    await safeDb(async () => {
      const player = new Player({
        _id: playerId,
        socketId: socket.id,
        gameId: gameState.gameId,
        displayName: displayName.trim(),
        language: language || 'english',
        avatar: avatar || 'rocket',
        isReady: true,
      });
      await player.save();
      await Game.findByIdAndUpdate(gameState.gameId, { $push: { players: player._id } });
    });

    const playerState: PlayerState = {
      playerId,
      socketId: socket.id,
      displayName: displayName.trim(),
      avatar: avatar || 'rocket',
      isReady: true,
      isHost: false,
      isConnected: true,
      wpm: 0,
      accuracy: 0,
      progress: 0,
      mistakes: 0,
      isFinished: false,
      finishPosition: 0,
      finishTime: 0,
      score: 0,
      roundScore: 0,
    };

    gameState.players.set(socket.id, playerState);
    socket.join(pin);

    const playersList = Array.from(gameState.players.values()).map(p => ({
      _id: p.playerId,
      socketId: p.socketId,
      gameId: gameState.gameId,
      displayName: p.displayName,
      language: language || 'english',
      avatar: p.avatar,
      isReady: true,
      isHost: p.isHost,
      isConnected: p.isConnected,
      totalScore: 0,
      joinedAt: new Date().toISOString(),
    }));

    socket.to(pin).emit('playerJoined', {
      _id: playerId,
      socketId: socket.id,
      gameId: gameState.gameId,
      displayName: displayName.trim(),
      language: language || 'english',
      avatar: avatar || 'rocket',
      isReady: true,
      isHost: false,
      isConnected: true,
      totalScore: 0,
      joinedAt: new Date().toISOString(),
    });

    callback({
      success: true,
      game: {
        _id: gameState.gameId,
        pin,
        name: gameState.settings.name,
        hostId: gameState.hostSocketId,
        settings: gameState.settings,
        status: gameState.status,
        currentRound: gameState.currentRound,
        totalRounds: gameState.settings.rounds,
        createdAt: new Date().toISOString(),
        players: [],
      },
      players: playersList,
      playerId,
    });

    console.log(`[Lobby] ${displayName} joined game ${pin} (${gameState.players.size}/${gameState.settings.maxPlayers})`);
  } catch (error) {
    console.error('[Lobby] Error joining game:', error);
    callback({ success: false, error: 'Failed to join game' });
  }
}

/** Player toggles ready status */
export function handlePlayerReady(io: Server, socket: Socket) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState) return;

  const player = gameState.players.get(socket.id);
  if (!player) return;

  player.isReady = true;

  io.to(gameState.pin).emit('playerReadyUpdate', {
    playerId: player.playerId,
    isReady: true,
  });
}

/** Handle player disconnect */
export async function handleDisconnect(io: Server, socket: Socket) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState) return;

  const player = gameState.players.get(socket.id);
  if (!player) return;

  console.log(`[Socket] Disconnected: ${player.displayName} from game ${gameState.pin}`);

  if (player.isHost) {
    if (gameState.status === 'waiting') {
      io.to(gameState.pin).emit('gameCancelled');
      if (gameState.roundTimer) clearTimeout(gameState.roundTimer);
      activeGames.delete(gameState.pin);
      await safeDb(() => Game.findByIdAndUpdate(gameState.gameId, { status: 'finished' }));
      console.log(`[Lobby] Game ${gameState.pin} cancelled (host left)`);
    } else {
      player.isConnected = false;
      io.to(gameState.pin).emit('playerLeft', {
        playerId: player.playerId,
        playerName: player.displayName,
      });
    }
  } else {
    if (gameState.settings.allowReconnect && gameState.status !== 'waiting') {
      player.isConnected = false;
    } else {
      gameState.players.delete(socket.id);
    }

    io.to(gameState.pin).emit('playerLeft', {
      playerId: player.playerId,
      playerName: player.displayName,
    });

    await safeDb(() => Player.findByIdAndUpdate(player.playerId, { isConnected: false }));
  }
}

/** Host cancels the game */
export async function handleCancelGame(io: Server, socket: Socket) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState) return;

  const player = gameState.players.get(socket.id);
  if (!player?.isHost) return;

  io.to(gameState.pin).emit('gameCancelled');
  if (gameState.roundTimer) clearTimeout(gameState.roundTimer);
  activeGames.delete(gameState.pin);

  await safeDb(() => Game.findByIdAndUpdate(gameState.gameId, { status: 'finished' }));
  console.log(`[Lobby] Game ${gameState.pin} cancelled by host`);
}

/** Host updates game settings */
export function handleUpdateSettings(io: Server, socket: Socket, settings: any) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState) return;

  const player = gameState.players.get(socket.id);
  if (!player?.isHost) return;

  Object.assign(gameState.settings, settings);
  io.to(gameState.pin).emit('settingsUpdated', settings);
  console.log(`[Lobby] Settings updated for game ${gameState.pin}`);
}

/** Host kicks a player from the game lobby */
export async function handleKickPlayer(io: Server, socket: Socket, targetPlayerId: string) {
  const gameState = findGameBySocket(socket.id);
  if (!gameState) return;

  const hostPlayer = gameState.players.get(socket.id);
  if (!hostPlayer?.isHost) return;

  // Find target player in the game room
  let targetSocketId: string | null = null;
  let targetPlayer: any = null;

  for (const [sId, p] of gameState.players.entries()) {
    if (p.playerId === targetPlayerId && !p.isHost) {
      targetSocketId = sId;
      targetPlayer = p;
      break;
    }
  }

  if (!targetSocketId || !targetPlayer) return;

  // Remove player from in-memory game state
  gameState.players.delete(targetSocketId);

  // Notify the kicked player specifically
  io.to(targetSocketId).emit('playerKicked', {
    message: 'You have been removed from the lobby by the host.',
  });

  // Make target socket leave room
  const targetSocket = io.sockets.sockets.get(targetSocketId);
  if (targetSocket) {
    targetSocket.leave(gameState.pin);
  }

  // Sync remaining players list to room
  const remainingPlayers = Array.from(gameState.players.values()).map(p => ({
    _id: p.playerId,
    socketId: p.socketId,
    gameId: gameState.gameId,
    displayName: p.displayName,
    avatar: p.avatar,
    isReady: p.isReady,
    isHost: p.isHost,
    isConnected: p.isConnected,
    totalScore: p.score,
    joinedAt: new Date().toISOString(),
  }));

  io.to(gameState.pin).emit('playerLeft', {
    playerId: targetPlayer.playerId,
    playerName: targetPlayer.displayName,
  });

  io.to(gameState.pin).emit('playerSync', remainingPlayers);

  await safeDb(() => Player.findByIdAndDelete(targetPlayerId));

  console.log(`[Lobby] Host kicked ${targetPlayer.displayName} (${targetPlayerId}) from game ${gameState.pin}`);
}
