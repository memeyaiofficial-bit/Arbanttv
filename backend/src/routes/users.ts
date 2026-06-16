import { Router } from 'express';
import * as usersController from '../controllers/users';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { requireAdmin, optionalAuth, requireOwner } from '../middlewares/roles';
import { userCreateSchema, userUpdateSchema, userIdSchema } from '../validations/users';

const router = Router();

router.post('/', authenticate, validate(userCreateSchema), usersController.createUser);
router.get('/', authenticate, requireAdmin, usersController.getUsers);
router.get('/:id', optionalAuth, validate(userIdSchema), usersController.getUserById);
router.put('/:id', authenticate, requireOwner(req => req.params.id as string), validate(userUpdateSchema), usersController.updateUser);
router.delete('/:id', authenticate, requireOwner(req => req.params.id as string), validate(userIdSchema), usersController.deleteUser);

export default router;
