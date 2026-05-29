import { asyncHandler } from '../utils/asyncHandler.js';
import { taskService } from '../services/task.service.js';
export const taskController = {
    getAll: asyncHandler(async (req, res) => {
        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            projectId: req.query.projectId,
            assigneeId: req.query.assigneeId,
            search: req.query.search,
            dueDateFrom: req.query.dueDateFrom,
            dueDateTo: req.query.dueDateTo,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
        };
        const data = await taskService.getAll(filters);
        res.json({ success: true, data });
    }),
    getById: asyncHandler(async (req, res) => {
        const data = await taskService.getById(String(req.params.id));
        res.json({ success: true, data });
    }),
    create: asyncHandler(async (req, res) => {
        const data = await taskService.create({
            ...req.body,
            actor: req.user,
        });
        res.status(201).json({ success: true, data });
    }),
    update: asyncHandler(async (req, res) => {
        const data = await taskService.update(String(req.params.id), req.body, req.user);
        res.json({ success: true, data });
    }),
    assign: asyncHandler(async (req, res) => {
        const data = await taskService.assignTask(String(req.params.id), String(req.body.assigneeId), req.user);
        res.json({ success: true, data });
    }),
    changeStatus: asyncHandler(async (req, res) => {
        const data = await taskService.changeStatus(String(req.params.id), req.body.status, req.user);
        res.json({ success: true, data });
    }),
    delete: asyncHandler(async (req, res) => {
        await taskService.softDelete(String(req.params.id), req.user.id);
        res.json({ success: true, message: 'Task deleted' });
    }),
    getMyTasks: asyncHandler(async (req, res) => {
        const data = await taskService.getMyTasks(req.user.id, {
            status: req.query.status,
            priority: req.query.priority,
            projectId: req.query.projectId,
            search: req.query.search,
            dueDateFrom: req.query.dueDateFrom,
            dueDateTo: req.query.dueDateTo,
        });
        res.json({ success: true, data });
    }),
    getByProject: asyncHandler(async (req, res) => {
        const data = await taskService.getByProject(String(req.params.projectId));
        res.json({ success: true, data });
    }),
};
//# sourceMappingURL=task.controller.js.map