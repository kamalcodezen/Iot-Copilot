import { Router } from 'express';
import { getUsers, updateUserRole, deleteUser, getStats } from '../controllers/admin';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/admin';
import { validate } from '../middlewares/validate';
import { mongoIdParams, updateRoleSchema, paginationSchema } from '../validators';

const router = Router();

router.get('/users', authenticate, requireAdmin, validate({ query: paginationSchema }), getUsers);
router.patch('/users/:id/role', authenticate, requireAdmin, validate({ body: updateRoleSchema, params: mongoIdParams }), updateUserRole);
router.delete('/users/:id', authenticate, requireAdmin, validate({ params: mongoIdParams }), deleteUser);
router.get('/stats', authenticate, requireAdmin, getStats);

export default router;
