import { asyncHandler } from '../utils/asyncHandler.js';
import { commentService } from '../services/comment.service.js';
export const commentController = {
    create: asyncHandler(async (req, res) => {
        const data = await commentService.create({
            ...req.body,
            userId: req.user.id,
        });
        res.status(201).json({ success: true, data });
    }),
    getByTask: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const data = await commentService.getByTask(String(req.params.taskId), page, limit);
        res.json({ success: true, data });
    }),
    delete: asyncHandler(async (req, res) => {
        await commentService.delete(String(req.params.id), req.user.id);
        res.json({ success: true, message: 'Comment deleted' });
    }),
};
//# sourceMappingURL=comment.controller.js.map