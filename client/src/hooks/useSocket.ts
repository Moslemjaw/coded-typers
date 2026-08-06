import { useEffect, useRef, useState, useCallback } from 'react';
import socketInstance from '../services/socket';

// ============================================================
// useSocket — Manages Socket.io connection lifecycle
// ============================================================

export function useSocket() {
  const [isConnected, setIsConnected] = useState(socketInstance.connected);
  const socketRef = useRef(socketInstance);

  useEffect(() => {
    const s = socketRef.current;

    if (!s.connected) {
      s.connect();
    }

    function onConnect() { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
    };
  }, []);

  const emit = useCallback((event: string, ...args: any[]) => {
    socketRef.current.emit(event as any, ...args);
  }, []);

  return { socket: socketRef.current, isConnected, emit };
}
