import React, { createContext, useContext, ReactNode } from 'react';
import { useSocket } from '../hooks/useSocket';
import { Socket } from 'socket.io-client';

// ============================================================
// Socket Context — Provides socket instance app-wide
// ============================================================

interface SocketContextValue {
  socket: Socket;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextValue>({} as SocketContextValue);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { socket, isConnected } = useSocket();

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
