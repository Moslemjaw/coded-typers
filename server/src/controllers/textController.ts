import { Request, Response, NextFunction } from 'express';
import Text from '../models/Text';
import { seedDatabase } from '../seed/texts';

// ============================================================
// Text Controller — Manage typing texts collection
// ============================================================

/** GET /api/texts — Fetch texts with optional language/difficulty filters */
export async function getTexts(req: Request, res: Response, next: NextFunction) {
  try {
    const { language, difficulty } = req.query;
    const filter: Record<string, string> = {};

    if (language && typeof language === 'string') filter.language = language;
    if (difficulty && typeof difficulty === 'string') filter.difficulty = difficulty;

    const texts = await Text.find(filter).limit(50);
    res.json({ success: true, texts, count: texts.length });
  } catch (error) {
    next(error);
  }
}

/** POST /api/texts/seed — Seed the database with typing texts */
export async function seedTexts(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await seedDatabase();
    res.json({ success: true, message: 'Database seeded successfully', ...result });
  } catch (error) {
    next(error);
  }
}
