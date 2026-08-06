import { Router } from 'express';
import { createGame, getGameByPin, getGameResults } from '../controllers/gameController';

const router = Router();

router.post('/', createGame);
router.get('/:pin', getGameByPin);
router.get('/:pin/results', getGameResults);

export default router;
