import { Request, Response, NextFunction } from 'express';
import Result from '../models/Result';
import Player from '../models/Player';

// ============================================================
// Stats Controller — Player statistics and match history
// ============================================================

/** GET /api/stats/:playerId — Get aggregate stats for a player */
export async function getPlayerStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { playerId } = req.params;
    const results = await Result.find({ playerId });

    if (results.length === 0) {
      return res.json({
        success: true,
        stats: {
          gamesPlayed: 0, gamesWon: 0, bestWpm: 0, bestAccuracy: 0,
          averageWpm: 0, averageAccuracy: 0, totalWordsTyped: 0, winRate: 0,
        },
      });
    }

    const gamesPlayed = results.length;
    const gamesWon = results.filter(r => r.rank === 1).length;
    const allWpms = results.map(r => r.averageWpm);
    const allAccuracies = results.map(r => r.averageAccuracy);

    const stats = {
      gamesPlayed,
      gamesWon,
      bestWpm: Math.max(...allWpms),
      bestAccuracy: Math.max(...allAccuracies),
      averageWpm: Math.round(allWpms.reduce((a, b) => a + b, 0) / gamesPlayed),
      averageAccuracy: Math.round(allAccuracies.reduce((a, b) => a + b, 0) / gamesPlayed),
      totalWordsTyped: 0,
      winRate: Math.round((gamesWon / gamesPlayed) * 100),
    };

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
}

/** GET /api/stats/history — Get recent match history */
export async function getMatchHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { playerId } = req.query;
    const filter: Record<string, any> = {};
    if (playerId) filter.playerId = playerId;

    const results = await Result.find(filter)
      .sort({ completedAt: -1 })
      .limit(20)
      .populate('gameId');

    res.json({ success: true, history: results });
  } catch (error) {
    next(error);
  }
}
