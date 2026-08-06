import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket';
import { Game, GameSettings, RoundData, RoundResult, LeaderboardEntry } from '../types/game';
import { Player, PlayerProgress } from '../types/player';

// ============================================================
// useGame — Full game state management via Socket.io
// ============================================================

export function useGame() {
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [isHost, setIsHost] = useState(false);
  const [status, setStatus] = useState<string>('idle');
  const [currentRound, setCurrentRound] = useState<RoundData | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerProgress, setPlayerProgress] = useState<Map<string, PlayerProgress>>(new Map());
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [error, setError] = useState<string>('');
  const [canPlayAgain, setCanPlayAgain] = useState(false);
  const roundRef = useRef(currentRound);
  roundRef.current = currentRound;

  // ---- Socket event listeners ----
  useEffect(() => {
    socket.on('playerJoined', (player: Player) => {
      setPlayers(prev => [...prev.filter(p => p._id !== player._id), player]);
    });

    socket.on('playerLeft', ({ playerId }) => {
      setPlayers(prev => prev.filter(p => p._id !== playerId));
    });

    socket.on('playerReadyUpdate', ({ playerId, isReady }) => {
      setPlayers(prev => prev.map(p => p._id === playerId ? { ...p, isReady } : p));
    });

    socket.on('gameCountdown', ({ countdown: c }) => {
      setCountdown(c);
      setStatus('countdown');
    });

    socket.on('startRound', (data: RoundData) => {
      setCurrentRound(data);
      setCountdown(null);
      setStatus('playing');
      setPlayerProgress(new Map());
      setRoundResults([]);
    });

    socket.on('typingProgressUpdate', (progress: PlayerProgress) => {
      setPlayerProgress(prev => {
        const next = new Map(prev);
        next.set(progress.playerId, progress);
        return next;
      });
    });

    socket.on('playerFinished', ({ result }) => {
      setRoundResults(prev => [...prev, result]);
    });

    socket.on('roundEnded', ({ results }) => {
      setRoundResults(results);
      setStatus('round-end');
    });

    socket.on('leaderboardUpdate', (lb: LeaderboardEntry[]) => {
      setLeaderboard(lb);
    });

    socket.on('gameEnded', ({ leaderboard: lb }) => {
      setLeaderboard(lb);
      setStatus('finished');
      setCanPlayAgain(false);
    });

    socket.on('playAgainAvailable', ({ game: resetGame, players: resetPlayers }) => {
      setGame(resetGame);
      setPlayers(resetPlayers);
      setStatus('waiting');
      setCanPlayAgain(true);
      setRoundResults([]);
      setCurrentRound(null);
    });

    socket.on('playerKicked', ({ message }) => {
      setStatus('idle');
      setGame(null);
      setError(message || 'You were removed from the room by the host');
      navigate('/');
    });

    socket.on('gameCancelled', () => {
      setStatus('cancelled');
      setGame(null);
    });

    socket.on('settingsUpdated', (settings) => {
      setGame(prev => prev ? { ...prev, settings: { ...prev.settings, ...settings } } as Game : null);
    });

    socket.on('playerSync', (syncedPlayers: Player[]) => {
      setPlayers(syncedPlayers);
    });

    socket.on('error', ({ message }) => {
      setError(message);
      setTimeout(() => setError(''), 5000);
    });

    return () => {
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('playerReadyUpdate');
      socket.off('gameCountdown');
      socket.off('startRound');
      socket.off('typingProgressUpdate');
      socket.off('playerFinished');
      socket.off('roundEnded');
      socket.off('leaderboardUpdate');
      socket.off('gameEnded');
      socket.off('playAgainAvailable');
      socket.off('playerKicked');
      socket.off('gameCancelled');
      socket.off('settingsUpdated');
      socket.off('playerSync');
      socket.off('error');
    };
  }, [navigate]);

  // ---- Actions ----
  const createGame = useCallback((settings: GameSettings & { hostName: string; avatar: string }) => {
    socket.emit('createGame', settings as any, (response: any) => {
      if (response.success) {
        setGame(response.game);
        setMyPlayerId(response.playerId);
        setIsHost(true);
        setStatus('waiting');
        navigate(`/lobby/${response.game.pin}`);
      } else {
        setError(response.error || 'Failed to create game');
      }
    });
  }, [navigate]);

  const joinGame = useCallback((data: { pin: string; displayName: string; language: string; avatar: string }) => {
    socket.emit('joinGame', data, (response: any) => {
      if (response.success) {
        setGame(response.game);
        setPlayers(response.players || []);
        setMyPlayerId(response.playerId);
        setIsHost(false);
        setStatus('waiting');
        navigate(`/lobby/${data.pin}`);
      } else {
        setError(response.error || 'Failed to join game');
      }
    });
  }, [navigate]);

  const startGame = useCallback(() => {
    socket.emit('startGame');
  }, []);

  const nextRound = useCallback(() => {
    socket.emit('nextRound');
  }, []);

  const setReady = useCallback(() => {
    socket.emit('playerReady');
  }, []);

  const sendProgress = useCallback((data: any) => {
    socket.emit('typingProgress', data);
  }, []);

  const finishRound = useCallback((data: any) => {
    socket.emit('finishRound', data);
  }, []);

  const cancelGame = useCallback(() => {
    socket.emit('cancelGame');
  }, []);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    socket.emit('updateSettings', settings);
  }, []);

  const playAgain = useCallback(() => {
    if (isHost) {
      socket.emit('playAgain');
      if (game?.pin) {
        navigate(`/lobby/${game.pin}`);
      }
    } else {
      if (game?.pin) {
        navigate(`/lobby/${game.pin}`);
      }
    }
  }, [isHost, game?.pin, navigate]);

  const kickPlayer = useCallback((targetPlayerId: string) => {
    socket.emit('kickPlayer', targetPlayerId);
  }, []);

  const leaveGame = useCallback(() => {
    if (isHost) {
      socket.emit('cancelGame');
    }
    if (socket.connected) {
      socket.disconnect();
      socket.connect();
    }
    setGame(null);
    setPlayers([]);
    setStatus('idle');
    setMyPlayerId('');
    setIsHost(false);
    navigate('/');
  }, [isHost, navigate]);

  const myPlayer = players.find(p => p._id === myPlayerId);

  return {
    game, players, myPlayerId, myPlayer, isHost, status, currentRound,
    countdown, leaderboard, playerProgress, roundResults, error, canPlayAgain,
    createGame, joinGame, startGame, nextRound, setReady, playAgain, kickPlayer, leaveGame,
    sendProgress, finishRound, cancelGame, updateSettings,
    setGame, setPlayers, setMyPlayerId, setIsHost, setStatus,
  };
}
