import { Router } from 'express';
import { activityLogController } from '../controllers/activityLog.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
const router = Router();
router.use(authenticate);
router.get('/me', activityLogController.getMyActivity);
router.get('/recent', authorize('ADMIN', 'MANAGER'), activityLogController.getRecent);
router.get('/task/:taskId', activityLogController.getByTask);
export default router;
//# sourceMappingURL=activityLog.routes.js.map