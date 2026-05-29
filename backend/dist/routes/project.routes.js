import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProjectSchema, updateProjectSchema, addProjectMemberSchema } from '../validators/core.validator.js';
const router = Router();
router.use(authenticate);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', authorize('ADMIN'), validate(createProjectSchema), projectController.create);
router.patch('/:id', authorize('ADMIN', 'MANAGER'), validate(updateProjectSchema), projectController.update);
router.delete('/:id', authorize('ADMIN'), projectController.delete);
router.post('/:id/members', authorize('ADMIN', 'MANAGER'), validate(addProjectMemberSchema), projectController.addMember);
router.delete('/:id/members/:userId', authorize('ADMIN', 'MANAGER'), projectController.removeMember);
export default router;
//# sourceMappingURL=project.routes.js.map