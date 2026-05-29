import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { taskService } from '../services/task.service.js';
import { TaskPriority, TaskStatus } from '@prisma/client';

export const taskController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status as TaskStatus | undefined,
      priority: req.query.priority as TaskPriority | undefined,
      projectId: req.query.projectId as string | undefined,
      assigneeId: req.query.assigneeId as string | undefined,
      search: req.query.search as string | undefined,
      dueDateFrom: req.query.dueDateFrom as string | undefined,
      dueDateTo: req.query.dueDateTo as string | undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };
    const data = await taskService.getAll(filters);
    res.json({ success: true, data });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await taskService.getById(String(req.params.id));
    res.json({ success: true, data });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await taskService.create({
      ...req.body,
      actor: req.user!,
    });
    res.status(201).json({ success: true, data });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await taskService.update(String(req.params.id), req.body, req.user!);
    res.json({ success: true, data });
  }),

  assign: asyncHandler(async (req: Request, res: Response) => {
    const data = await taskService.assignTask(
      String(req.params.id),
      String(req.body.assigneeId),
      req.user!
    );
    res.json({ success: true, data });
  }),

  changeStatus: asyncHandler(async (req: Request, res: Response) => {
    const data = await taskService.changeStatus(
      String(req.params.id),
      req.body.status,
      req.user!
    );
    res.json({ success: true, data });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await taskService.softDelete(String(req.params.id), req.user!.id);
    res.json({ success: true, message: 'Task deleted' });
  }),

  getMyTasks: asyncHandler(async (req: Request, res: Response) => {
    const data = await taskService.getMyTasks(req.user!.id, {
      status: req.query.status as TaskStatus | undefined,
      priority: req.query.priority as TaskPriority | undefined,
      projectId: req.query.projectId as string | undefined,
      search: req.query.search as string | undefined,
      dueDateFrom: req.query.dueDateFrom as string | undefined,
      dueDateTo: req.query.dueDateTo as string | undefined,
    });
    res.json({ success: true, data });
  }),

  getCreatedByMe: asyncHandler(async (req: Request, res: Response) => {
    const data = await taskService.getCreatedByMe(req.user!.id, {
      status: req.query.status as TaskStatus | undefined,
      priority: req.query.priority as TaskPriority | undefined,
      projectId: req.query.projectId as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.json({ success: true, data });
  }),

  getByProject: asyncHandler(async (req: Request, res: Response) => {
    const data = await taskService.getByProject(String(req.params.projectId));
    res.json({ success: true, data });
  }),
};
