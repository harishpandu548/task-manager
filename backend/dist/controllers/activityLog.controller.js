import { asyncHandler } from '../utils/asyncHandler.js';
import { activityLogService } from '../services/activityLog.service.js';
export const activityLogController = {
    getByTask: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const data = await activityLogService.getByTask(String(req.params.taskId), page, limit);
        res.json({ success: true, data });
    }),
    getMyActivity: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const data = await activityLogService.getByUser(req.user.id, page, limit);
        res.json({ success: true, data });
    }),
    getRecent: asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 20;
        const data = await activityLogService.getRecent(limit);
        res.json({ success: true, data });
    }),
};
//# sourceMappingURL=activityLog.controller.js.map