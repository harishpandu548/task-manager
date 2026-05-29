import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  assignTaskSchema,
  changeTaskStatusSchema,
  createTaskSchema,
  taskQuerySchema,
  updateTaskSchema,
} from '../validators/core.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(taskQuerySchema), taskController.getAll);
router.get('/my', validate(taskQuerySchema), taskController.getMyTasks);
router.get('/created', authorize('ADMIN', 'MANAGER'), validate(taskQuerySchema), taskController.getCreatedByMe);
router.get('/project/:projectId', taskController.getByProject);
router.get('/:id', taskController.getById);
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createTaskSchema), taskController.create);
router.patch('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/assign', authorize('ADMIN', 'MANAGER'), validate(assignTaskSchema), taskController.assign);
router.patch('/:id/status', validate(changeTaskStatusSchema), taskController.changeStatus);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), taskController.delete);

export default router;
