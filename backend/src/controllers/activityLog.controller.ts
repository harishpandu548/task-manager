import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { activityLogService } from '../services/activityLog.service.js';

export const activityLogController = {
  getByTask: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await activityLogService.getByTask(String(req.params.taskId), page, limit);
    res.json({ success: true, data });
  }),

  getMyActivity: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await activityLogService.getByUser(req.user!.id, page, limit);
    res.json({ success: true, data });
  }),

  getRecent: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await activityLogService.getRecent(limit);
    res.json({ success: true, data });
  }),
};
