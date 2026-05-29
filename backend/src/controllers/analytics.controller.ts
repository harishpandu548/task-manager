import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { analyticsService } from '../services/analytics.service.js';

export const analyticsController = {
  getDashboard: asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getDashboardStats(
      req.user!.role === 'EMPLOYEE' ? req.user!.id : undefined
    );
    res.json({ success: true, data });
  }),

  getTasksPerUser: asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getTasksPerUser();
    res.json({ success: true, data });
  }),

  getProjectCompletion: asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getProjectCompletion();
    res.json({ success: true, data });
  }),

  getWeeklyProductivity: asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getWeeklyProductivity();
    res.json({ success: true, data });
  }),
};
