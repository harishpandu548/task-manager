import { asyncHandler } from '../utils/asyncHandler.js';
import { notificationService } from '../services/notification.service.js';
export const notificationController = {
    getAll: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const data = await notificationService.getByUser(req.user.id, page, limit);
        res.json({ success: true, data });
    }),
    markAsRead: asyncHandler(async (req, res) => {
        await notificationService.markAsRead(String(req.params.id), req.user.id);
        res.json({ success: true, message: 'Notification marked as read' });
    }),
    markAllAsRead: asyncHandler(async (req, res) => {
        await notificationService.markAllAsRead(req.user.id);
        res.json({ success: true, message: 'All notifications marked as read' });
    }),
};
//# sourceMappingURL=notification.controller.js.map