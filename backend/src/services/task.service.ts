import {
  Prisma,
  Role,
  TaskPriority,
  TaskStatus,
  NotificationType,
} from '@prisma/client';
import prisma from '../config/database.js';
import { ApiError } from '../utils/ApiError.js';
import { scheduleDueDateReminder } from '../jobs/queue.js';
import { analyticsService } from './analytics.service.js';

type Actor = {
  id: string;
  role: Role;
};

type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assigneeId?: string;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

const includeTaskRelations = {
  assignee: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true } },
  project: { select: { id: true, name: true, color: true } },
  createdBy: { select: { id: true, firstName: true, lastName: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.TaskInclude;

const sanitizeSortBy = (sortBy?: string): keyof Prisma.TaskOrderByWithRelationInput => {
  const allowed: Array<keyof Prisma.TaskOrderByWithRelationInput> = [
    'createdAt',
    'updatedAt',
    'dueDate',
    'priority',
    'status',
    'position',
    'title',
  ];

  return allowed.includes((sortBy as keyof Prisma.TaskOrderByWithRelationInput) ?? 'createdAt')
    ? (sortBy as keyof Prisma.TaskOrderByWithRelationInput)
    : 'createdAt';
};

const ensureAssigneeExists = async (assigneeId?: string | null) => {
  if (!assigneeId) return;
  const assignee = await prisma.user.findFirst({ where: { id: assigneeId, isActive: true } });
  if (!assignee) {
    throw ApiError.badRequest('Assignee not found or inactive');
  }
};

const ensureProjectExists = async (projectId: string) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, isArchived: false },
    select: { id: true },
  });

  if (!project) {
    throw ApiError.notFound('Project not found');
  }
};

export const taskService = {
  async getAll(filters: TaskFilters) {
    const {
      status,
      priority,
      projectId,
      assigneeId,
      search,
      dueDateFrom,
      dueDateTo,
      page = 1,
      limit = 20,
      sortBy,
      sortOrder = 'desc',
    } = filters;

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.TaskWhereInput = {
      isDeleted: false,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(projectId && { projectId }),
      ...(assigneeId && { assigneeId }),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(dueDateFrom || dueDateTo
        ? {
            dueDate: {
              ...(dueDateFrom ? { gte: new Date(dueDateFrom) } : {}),
              ...(dueDateTo ? { lte: new Date(dueDateTo) } : {}),
            },
          }
        : {}),
    };

    const orderByKey = sanitizeSortBy(sortBy);

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: includeTaskRelations,
        orderBy: { [orderByKey]: sortOrder },
        skip,
        take: safeLimit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  },

  async getById(id: string) {
    const task = await prisma.task.findFirst({
      where: { id, isDeleted: false },
      include: {
        ...includeTaskRelations,
        comments: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        activityLogs: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!task) throw ApiError.notFound('Task not found');
    return task;
  },

  async create(data: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string | null;
    projectId: string;
    assigneeId?: string | null;
    actor: Actor;
  }) {
    await ensureProjectExists(data.projectId);
    await ensureAssigneeExists(data.assigneeId);

    const dueDate = data.dueDate ? new Date(data.dueDate) : null;

    const task = await prisma.$transaction(async (tx) => {
      const created = await tx.task.create({
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority ?? TaskPriority.MEDIUM,
          status: data.status ?? TaskStatus.TODO,
          dueDate,
          projectId: data.projectId,
          assigneeId: data.assigneeId,
          createdById: data.actor.id,
        },
        include: includeTaskRelations,
      });

      await tx.activityLog.create({
        data: {
          action: 'TASK_CREATED',
          entityType: 'TASK',
          entityId: created.id,
          userId: data.actor.id,
          taskId: created.id,
          projectId: created.projectId,
          details: {
            title: created.title,
            priority: created.priority,
            status: created.status,
          },
        },
      });

      if (created.assigneeId && created.assigneeId !== data.actor.id) {
        await tx.notification.create({
          data: {
            type: NotificationType.TASK_ASSIGNED,
            title: 'Task Assigned',
            message: `You were assigned to "${created.title}"`,
            userId: created.assigneeId,
            taskId: created.id,
            data: { taskId: created.id, projectId: created.projectId },
          },
        });
      }

      return created;
    });

    if (task.dueDate) {
      await scheduleDueDateReminder(task.id, task.dueDate);
    }

    await analyticsService.clearCache();
    return task;
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      status?: TaskStatus;
      dueDate?: string | null;
      assigneeId?: string | null;
      position?: number;
    },
    actor: Actor
  ) {
    const existing = await prisma.task.findFirst({ where: { id, isDeleted: false } });
    if (!existing) throw ApiError.notFound('Task not found');

    // if (actor.role === Role.EMPLOYEE && existing.assigneeId !== actor.id) {
    //   throw ApiError.forbidden('You can only update your own assigned tasks');
    // }

    await ensureAssigneeExists(data.assigneeId);

    const updateData: Prisma.TaskUpdateInput = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.priority !== undefined ? { priority: data.priority } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.position !== undefined ? { position: data.position } : {}),
      ...(data.assigneeId !== undefined ? { assigneeId: data.assigneeId } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate ? new Date(data.dueDate) : null } : {}),
    };

    const changedStatus = data.status !== undefined && data.status !== existing.status;
    const changedAssignee = data.assigneeId !== undefined && data.assigneeId !== existing.assigneeId;

    const task = await prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id },
        data: updateData,
        include: includeTaskRelations,
      });

      await tx.activityLog.create({
        data: {
          action: changedStatus ? 'TASK_STATUS_CHANGED' : changedAssignee ? 'TASK_ASSIGNED' : 'TASK_UPDATED',
          entityType: 'TASK',
          entityId: updated.id,
          userId: actor.id,
          taskId: updated.id,
          projectId: updated.projectId,
          details: {
            from: {
              status: existing.status,
              assigneeId: existing.assigneeId,
              dueDate: existing.dueDate,
            },
            to: {
              status: updated.status,
              assigneeId: updated.assigneeId,
              dueDate: updated.dueDate,
            },
          },
        },
      });

      if (changedStatus && updated.assigneeId) {
        await tx.notification.create({
          data: {
            type: NotificationType.TASK_STATUS_CHANGED,
            title: 'Task Status Updated',
            message: `Task "${updated.title}" moved to ${updated.status}`,
            userId: updated.assigneeId,
            taskId: updated.id,
            data: { taskId: updated.id, status: updated.status },
          },
        });
      }

      if (changedAssignee && updated.assigneeId) {
        await tx.notification.create({
          data: {
            type: NotificationType.TASK_ASSIGNED,
            title: 'Task Assigned',
            message: `You were assigned to "${updated.title}"`,
            userId: updated.assigneeId,
            taskId: updated.id,
            data: { taskId: updated.id, projectId: updated.projectId },
          },
        });
      }

      return updated;
    });

    if (task.dueDate) {
      await scheduleDueDateReminder(task.id, task.dueDate);
    }

    await analyticsService.clearCache();
    return task;
  },

  async assignTask(id: string, assigneeId: string, actor: Actor) {
    if (actor.role !== Role.ADMIN && actor.role !== Role.MANAGER) {
      throw ApiError.forbidden('Only admin or manager can assign task');
    }

    return this.update(id, { assigneeId }, actor);
  },

  async changeStatus(id: string, status: TaskStatus, actor: Actor) {
    const task = await prisma.task.findFirst({ where: { id, isDeleted: false } });
    if (!task) throw ApiError.notFound('Task not found');

    // if (actor.role === Role.EMPLOYEE && task.assigneeId !== actor.id) {
    //   throw ApiError.forbidden('You can only change status of your assigned tasks');
    // }

    return this.update(id, { status }, actor);
  },

  async softDelete(id: string, userId: string) {
    const task = await prisma.task.findFirst({ where: { id, isDeleted: false } });
    if (!task) throw ApiError.notFound('Task not found');

    await prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await tx.activityLog.create({
        data: {
          action: 'TASK_DELETED',
          entityType: 'TASK',
          entityId: id,
          userId,
          taskId: id,
          projectId: task.projectId,
          details: { title: task.title },
        },
      });
    });

    await analyticsService.clearCache();
    return { id };
  },

  async getByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId, isDeleted: false },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ status: 'asc' }, { position: 'asc' }, { createdAt: 'asc' }],
    });
  },

  async getMyTasks(
    userId: string,
    filters?: {
      status?: TaskStatus;
      priority?: TaskPriority;
      projectId?: string;
      search?: string;
      dueDateFrom?: string;
      dueDateTo?: string;
    }
  ) {
    const dueDateFilter =
      filters?.dueDateFrom || filters?.dueDateTo
        ? {
            dueDate: {
              ...(filters?.dueDateFrom ? { gte: new Date(filters.dueDateFrom) } : {}),
              ...(filters?.dueDateTo ? { lte: new Date(filters.dueDateTo) } : {}),
            },
          }
        : {};

    return prisma.task.findMany({
      where: {
        assigneeId: userId,
        isDeleted: false,
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.priority ? { priority: filters.priority } : {}),
        ...(filters?.projectId ? { projectId: filters.projectId } : {}),
        ...(filters?.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...dueDateFilter,
      },
      include: {
        project: { select: { id: true, name: true, color: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ dueDate: 'asc' }, { updatedAt: 'desc' }],
    });
  },

  async getCreatedByMe(
    userId: string,
    filters?: {
      status?: TaskStatus;
      priority?: TaskPriority;
      projectId?: string;
      search?: string;
    }
  ) {
    return prisma.task.findMany({
      where: {
        createdById: userId,
        isDeleted: false,
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.priority ? { priority: filters.priority } : {}),
        ...(filters?.projectId ? { projectId: filters.projectId } : {}),
        ...(filters?.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        project: { select: { id: true, name: true, color: true } },
        assignee: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ createdAt: 'desc' }],
    });
  },
};
