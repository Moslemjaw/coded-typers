import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlayerCard } from '../components/lobby/PlayerCard';
import { PinDisplay } from '../components/lobby/PinDisplay';
import { QRCode } from '../components/lobby/QRCode';
import { useGameContext } from '../contexts/GameContext';

// ============================================================
// Lobby — Premium waiting room with players and host controls
// ============================================================

export default function Lobby() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { game, players, isHost, myPlayerId, status, startGame, cancelGame } = useGameContext();

  const joinedPlayers = players.filter(p => !p.isHost);

  useEffect(() => {
    if (status === 'playing' || status === 'countdown') {
      if (isHost) {
        navigate(`/dashboard/${pin}`);
      } else {
        navigate(`/game/${pin}`);
      }
    }
    if (status === 'cancelled') {
      navigate('/');
    }
  }, [status, pin, isHost, navigate]);

  const maxPlayers = game?.settings?.maxPlayers || 30;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Game Name Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
            {game?.settings?.name || 'Typing Competition'}
          </h1>
          <p className="text-sm text-surface-400 mt-1">
            Share the PIN or QR code below to invite players
          </p>
        </motion.div>

        {/* PIN & QR — Side by side */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="lg" className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
              <PinDisplay pin={pin || ''} />
              <div className="hidden sm:block w-px h-28 bg-surface-100 dark:bg-dark-border" />
              <QRCode pin={pin || ''} />
            </div>
          </Card>
        </motion.div>

        {/* Player Count Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-base font-semibold text-surface-900 dark:text-white">
              Joined Players
            </h2>
          </div>
          <span className="text-xs font-medium text-surface-400 bg-surface-50 dark:bg-dark-surface px-3 py-1 rounded-full">
            {joinedPlayers.length} / {maxPlayers}
          </span>
        </motion.div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-8">
          <AnimatePresence>
            {joinedPlayers.map((player, i) => (
              <motion.div
                key={player._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <PlayerCard
                  player={player}
                  isCurrentUser={player._id === myPlayerId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {joinedPlayers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-surface-50/50 dark:bg-dark-surface/50 rounded-card border border-dashed border-surface-200 dark:border-dark-border mb-8"
          >
            <div className="text-4xl mb-3">👥</div>
            <p className="text-surface-400 dark:text-surface-500 font-medium">Waiting for players to join...</p>
            <p className="text-xs text-surface-300 dark:text-surface-600 mt-1">Share the PIN or QR code above</p>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card padding="md">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {isHost ? (
                <>
                  <Button onClick={startGame} size="lg" fullWidth disabled={joinedPlayers.length < 1}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Start Game ({joinedPlayers.length} {joinedPlayers.length === 1 ? 'Player' : 'Players'})
                  </Button>
                  <Button variant="ghost" onClick={cancelGame} size="lg" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                    Cancel
                  </Button>
                </>
              ) : (
                <div className="py-3 text-center text-surface-400 font-medium flex items-center gap-2.5 text-sm">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-2 bg-primary-500 rounded-full"
                  />
                  Waiting for host to start the game...
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
