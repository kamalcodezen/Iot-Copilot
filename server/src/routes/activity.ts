import { Router } from 'express';
import { getActivities, getStats } from '../controllers/activity';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getActivities);
router.get('/stats', authenticate, getStats);

export default router;
