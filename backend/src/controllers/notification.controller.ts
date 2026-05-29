import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notificationService } from '../services/notification.service.js';

export const notificationController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await notificationService.getByUser(req.user!.id, page, limit);
    res.json({ success: true, data });
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAsRead(String(req.params.id), req.user!.id);
    res.json({ success: true, message: 'Notification marked as read' });
  }),

  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  }),
};
