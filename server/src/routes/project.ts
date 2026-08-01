import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProgress,
  toggleLike,
} from '../controllers/project';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { mongoIdParams, projectSchema, projectUpdateSchema, progressSchema, projectQuerySchema } from '../validators';

const router = Router();

router.get('/', authenticate, validate({ query: projectQuerySchema }), getProjects);
router.get('/:id', authenticate, validate({ params: mongoIdParams }), getProject);
router.post('/', authenticate, validate({ body: projectSchema }), createProject);
router.put('/:id', authenticate, validate({ body: projectUpdateSchema, params: mongoIdParams }), updateProject);
router.delete('/:id', authenticate, validate({ params: mongoIdParams }), deleteProject);
router.patch('/:id/progress', authenticate, validate({ body: progressSchema, params: mongoIdParams }), updateProgress);
router.post('/:id/like', authenticate, validate({ params: mongoIdParams }), toggleLike);

export default router;
