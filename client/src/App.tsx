import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';
import { SocketProvider } from './contexts/SocketContext';
import { GameProvider } from './contexts/GameContext';

// Layout
import { Navbar } from './components/layout/Navbar';

// Pages
import Landing from './pages/Landing';
import HostGame from './pages/HostGame';
import JoinGame from './pages/JoinGame';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import FinalResults from './pages/FinalResults';
import HostDashboard from './pages/HostDashboard';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/host" element={<HostGame />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/lobby/:pin" element={<Lobby />} />
        <Route path="/game/:pin" element={<Game />} />
        <Route path="/leaderboard/:pin" element={<Leaderboard />} />
        <Route path="/results/:pin" element={<FinalResults />} />
        <Route path="/dashboard/:pin" element={<HostDashboard />} />
        <Route path="/stats" element={<Statistics />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SoundProvider>
          <SocketProvider>
            <GameProvider>
              <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg text-surface-900 dark:text-white transition-colors duration-300">
                <Navbar />
                <main className="flex-1">
                  <AnimatedRoutes />
                </main>
              </div>
            </GameProvider>
          </SocketProvider>
        </SoundProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
