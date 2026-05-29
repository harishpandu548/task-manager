import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createUserSchema, updateUserSchema } from '../validators/core.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'MANAGER'), userController.getAll);
router.get('/:id', userController.getById);
router.post('/', authorize('ADMIN'), validate(createUserSchema), userController.create);
router.patch('/:id', authorize('ADMIN'), validate(updateUserSchema), userController.update);
router.delete('/:id', authorize('ADMIN'), userController.delete);

export default router;
