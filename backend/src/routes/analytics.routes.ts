import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/tasks-per-user', authorize('ADMIN', 'MANAGER'), analyticsController.getTasksPerUser);
router.get('/project-completion', authorize('ADMIN', 'MANAGER'), analyticsController.getProjectCompletion);
router.get('/weekly-productivity', authorize('ADMIN', 'MANAGER'), analyticsController.getWeeklyProductivity);

export default router;
