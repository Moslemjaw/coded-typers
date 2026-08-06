import { Router } from 'express';
import { getPlayerStats, getMatchHistory } from '../controllers/statsController';

const router = Router();

router.get('/history', getMatchHistory);
router.get('/:playerId', getPlayerStats);

export default router;
