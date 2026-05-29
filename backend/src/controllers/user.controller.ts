import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { userService } from '../services/user.service.js';

export const userController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await userService.getAll(page, limit);
    res.json({ success: true, data });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.getById(String(req.params.id));
    res.json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.create(req.body);
    res.status(201).json({ success: true, data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.update(String(req.params.id), req.body);
    res.json({ success: true, data });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await userService.delete(String(req.params.id));
    res.json({ success: true, message: 'User deactivated' });
  }),
};
