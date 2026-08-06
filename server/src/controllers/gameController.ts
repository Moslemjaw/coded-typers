import { Request, Response, NextFunction } from 'express';
import Game from '../models/Game';
import Result from '../models/Result';
import { createError } from '../middlewares/errorHandler';

// ============================================================
// Game Controller — REST endpoints for game operations
// ============================================================

/** POST /api/games — Create a new game (backup REST endpoint) */
export async function createGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, language, rounds, typingTime, difficulty, maxPlayers } = req.body;

    if (!name) {
      return next(createError('Game name is required', 400, 'MISSING_NAME'));
    }

    const game = new Game({
      pin: '000000', // Socket handler generates real PIN
      name,
      hostSocketId: 'rest-api',
      hostPlayerId: 'rest-api',
      language: language || 'english',
      rounds: rounds || 3,
      typingTime: typingTime || 60,
      difficulty: difficulty || 'medium',
      maxPlayers: maxPlayers || 30,
    });

    await game.save();
    res.status(201).json({ success: true, game });
  } catch (error) {
    next(error);
  }
}

/** GET /api/games/:pin — Fetch game by PIN */
export async function getGameByPin(req: Request, res: Response, next: NextFunction) {
  try {
    const { pin } = req.params;
    const game = await Game.findOne({ pin }).populate('players');

    if (!game) {
      return next(createError('Game not found', 404, 'GAME_NOT_FOUND'));
    }

    res.json({ success: true, game });
  } catch (error) {
    next(error);
  }
}

/** GET /api/games/:pin/results — Fetch final game results */
export async function getGameResults(req: Request, res: Response, next: NextFunction) {
  try {
    const { pin } = req.params;
    const game = await Game.findOne({ pin });

    if (!game) {
      return next(createError('Game not found', 404, 'GAME_NOT_FOUND'));
    }

    const results = await Result.find({ gameId: game._id }).sort({ rank: 1 });
    res.json({ success: true, results, game });
  } catch (error) {
    next(error);
  }
}
