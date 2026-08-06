import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import { setupSocket } from './socket/index';

// ============================================================
// Server Entry Point — HTTP, Socket.io, MongoDB (with fallback)
// ============================================================

const PORT = parseInt(process.env.PORT || '3001', 10);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coded-typers';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server with CORS
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Register all Socket.io event handlers
setupSocket(io);

// Start server first so HTTP + WebSockets work immediately
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║       CODED TYPERS — Server Ready        ║
╠══════════════════════════════════════════╣
║  HTTP:   http://localhost:${PORT}            ║
║  Socket: ws://localhost:${PORT}              ║
║  Client: ${CLIENT_URL}          ║
╚══════════════════════════════════════════╝
  `);
});

// Connect to MongoDB asynchronously (with graceful in-memory fallback)
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    console.log(`[DB] Connected to MongoDB: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.warn(`[DB] MongoDB not detected (${err.message}). Running in pure in-memory mode!`);
  });
