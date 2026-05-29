import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = Router();
router.use(authenticate);
router.get('/', notificationController.getAll);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
export default router;
//# sourceMappingURL=notification.routes.js.map