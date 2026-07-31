import { Router } from 'express';
import { getPublicProjects, getPublicProject, addComment, getComments } from '../controllers/community';
import { authenticate, optionalAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { mongoIdParams, commentSchema, communityQuerySchema } from "../validators";

const router = Router();

router.get('/projects', optionalAuth, validate({ query: communityQuerySchema }), getPublicProjects);
router.get('/projects/:id', optionalAuth, validate({ params: mongoIdParams }), getPublicProject);
router.post('/projects/:id/comments', authenticate, validate({ body: commentSchema, params: mongoIdParams }), addComment);
router.get('/projects/:id/comments', validate({ params: mongoIdParams }), getComments);

export default router;
