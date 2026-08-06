import { Router } from 'express';
import { getTexts, seedTexts } from '../controllers/textController';

const router = Router();

router.get('/', getTexts);
router.post('/seed', seedTexts);

export default router;
