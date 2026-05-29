import { asyncHandler } from '../utils/asyncHandler.js';
import { projectService } from '../services/project.service.js';
export const projectController = {
    getAll: asyncHandler(async (req, res) => {
        const data = await projectService.getAll(req.user.id, req.user.role);
        res.json({ success: true, data });
    }),
    getById: asyncHandler(async (req, res) => {
        const data = await projectService.getById(String(req.params.id));
        res.json({ success: true, data });
    }),
    create: asyncHandler(async (req, res) => {
        const data = await projectService.create(req.body, req.user.id);
        res.status(201).json({ success: true, data });
    }),
    update: asyncHandler(async (req, res) => {
        const data = await projectService.update(String(req.params.id), req.body);
        res.json({ success: true, data });
    }),
    delete: asyncHandler(async (req, res) => {
        await projectService.delete(String(req.params.id));
        res.json({ success: true, message: 'Project archived' });
    }),
    addMember: asyncHandler(async (req, res) => {
        const data = await projectService.addMember(String(req.params.id), String(req.body.userId), req.body.role);
        res.status(201).json({ success: true, data });
    }),
    removeMember: asyncHandler(async (req, res) => {
        await projectService.removeMember(String(req.params.id), String(req.params.userId));
        res.json({ success: true, message: 'Member removed' });
    }),
};
//# sourceMappingURL=project.controller.js.map