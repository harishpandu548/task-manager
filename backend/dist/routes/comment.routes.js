import { Router } from 'express';
import { commentController } from '../controllers/comment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCommentSchema } from '../validators/core.validator.js';
const router = Router();
router.use(authenticate);
router.post('/', validate(createCommentSchema), commentController.create);
router.get('/task/:taskId', commentController.getByTask);
router.delete('/:id', commentController.delete);
export default router;
//# sourceMappingURL=comment.routes.js.map