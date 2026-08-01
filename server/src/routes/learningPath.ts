import { Router } from 'express';
import { getLearningPaths, getLearningPath, updateLearningPath, deleteLearningPath } from '../controllers/learningPath';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { mongoIdParams } from '../validators/shared';
import { learningPathUpdateSchema } from '../validators/learningPath';

const router = Router();

router.get('/', authenticate, getLearningPaths);
router.get('/:id', authenticate, validate({ params: mongoIdParams }), getLearningPath);
router.put('/:id', authenticate, validate({ body: learningPathUpdateSchema, params: mongoIdParams }), updateLearningPath);
router.delete('/:id', authenticate, validate({ params: mongoIdParams }), deleteLearningPath);

export default router;
