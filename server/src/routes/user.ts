import { Router } from 'express';
import multer from 'multer';
import { getProfile, updateProfile, uploadAvatar, getUserProjects, getUserBadges } from '../controllers/user';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { mongoIdParams } from '../validators/shared';
import { updateProfileSchema } from '../validators/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/:id', validate({ params: mongoIdParams }), getProfile);
router.put('/:id', authenticate, validate({ body: updateProfileSchema, params: mongoIdParams }), updateProfile);
router.put('/:id/avatar', authenticate, upload.single('avatar'), uploadAvatar);
router.get('/:id/projects', validate({ params: mongoIdParams }), getUserProjects);
router.get('/:id/badges', validate({ params: mongoIdParams }), getUserBadges);

export default router;
