import express from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';
import textRoutes from './routes/textRoutes';
import statsRoutes from './routes/statsRoutes';
import { errorHandler } from './middlewares/errorHandler';

// ============================================================
// Express App — API routes and middleware configuration
// ============================================================

const app = express();

// CORS — allow client origin
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/games', gameRoutes);
app.use('/api/texts', textRoutes);
app.use('/api/stats', statsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
